# Next.js Best Practices

Principles for Next.js App Router development.

## 1. Server vs Client Components

### Decision Tree
Does it need...?
```
│
├── useState, useEffect, event handlers
│   └── Client Component ('use client')
│
├── Direct data fetching, no interactivity
│   └── Server Component (default)
│
└── Both? 
    └── Split: Server parent + Client child
```

### By Default
| Type | Use |
|------|-----|
| Server | Data fetching, layout, static content |
| Client | Forms, buttons, interactive UI |

## 2. Data Fetching Patterns

### Fetch Strategy
| Pattern | Use |
|---------|-----|
| Default | Static (cached at build) |
| Revalidate | ISR (time-based refresh) |
| No-store | Dynamic (every request) |

### Data Flow
| Source | Pattern |
|--------|---------|
| Database | Server Component fetch |
| API | fetch with caching |
| User input | Client state + server action |

## 3. Routing Principles

### File Conventions
| File | Purpose |
|------|---------|
| page.tsx | Route UI |
| layout.tsx | Shared layout |
| loading.tsx | Loading state |
| error.tsx | Error boundary |
| not-found.tsx | 404 page |

### Route Organization
| Pattern | Use |
|---------|-----|
| Route groups (name) | Organize without URL |
| Parallel routes @slot | Multiple same-level pages |
| Intercepting (.) | Modal overlays |

## 4. API Routes

### Route Handlers
| Method | Use |
|--------|-----|
| GET | Read data |
| POST | Create data |
| PUT/PATCH | Update data |
| DELETE | Remove data |

### Best Practices
- Validate input with Zod
- Return proper status codes
- Handle errors gracefully
- Use Edge runtime when possible

## 5. Performance Principles

### Image Optimization
- Use next/image component
- Set priority for above-fold
- Provide blur placeholder
- Use responsive sizes

### Bundle Optimization
- Dynamic imports for heavy components
- Route-based code splitting (automatic)
- Analyze with bundle analyzer

## 6. Metadata

### Static vs Dynamic
| Type | Use |
|------|-----|
| Static export | Fixed metadata |
| generateMetadata | Dynamic per-route |

### Essential Tags
- title (50-60 chars)
- description (150-160 chars)
- Open Graph images
- Canonical URL

## 7. Caching Strategy

### Cache Layers
| Layer | Control |
|-------|---------|
| Request | fetch options |
| Data | revalidate/tags |
| Full route | route config |

### Revalidation
| Method | Use |
|--------|-----|
| Time-based | revalidate: 60 |
| On-demand | revalidatePath/Tag |
| No cache | no-store |

## 8. Server Actions

### Use Cases
- Form submissions
- Data mutations
- Revalidation triggers

### Best Practices
- Mark with 'use server'
- Validate all inputs
- Return typed responses
- Handle errors

## 9. Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| 'use client' everywhere | Server by default |
| Fetch in client components | Fetch in server |
| Skip loading states | Use loading.tsx |
| Ignore error boundaries | Use error.tsx |
| Large client bundles | Dynamic imports |

## 10. Project Structure

```
app/
├── (marketing)/     # Route group
│   └── page.tsx
├── (dashboard)/
│   ├── layout.tsx   # Dashboard layout
│   └── page.tsx
├── api/
│   └── [resource]/
│       └── route.ts
└── components/
    └── ui/
```

**Remember**: Server Components are the default for a reason. Start there, add client only when needed.

---

# Next.js App Router Patterns

Comprehensive patterns for Next.js 14+ App Router architecture, Server Components, and modern full-stack React development.

## When to Use This Skill
- Building new Next.js applications with App Router
- Migrating from Pages Router to App Router
- Implementing Server Components and streaming
- Setting up parallel and intercepting routes
- Optimizing data fetching and caching
- Building full-stack features with Server Actions

## Core Concepts

### 1. Rendering Modes
| Mode | Where | When to Use |
|------|-------|-------------|
| Server Components | Server only | Data fetching, heavy computation, secrets |
| Client Components | Browser | Interactivity, hooks, browser APIs |
| Static | Build time | Content that rarely changes |
| Dynamic | Request time | Personalized or real-time data |
| Streaming | Progressive | Large pages, slow data sources |

### 2. File Conventions
```
app/
├── layout.tsx       # Shared UI wrapper
├── page.tsx         # Route UI
├── loading.tsx      # Loading UI (Suspense)
├── error.tsx        # Error boundary
├── not-found.tsx    # 404 UI
├── route.ts         # API endpoint
├── template.tsx     # Re-mounted layout
├── default.tsx      # Parallel route fallback
└── opengraph-image.tsx  # OG image generation
```

## Quick Start

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: { default: 'My App', template: '%s | My App' },
  description: 'Built with Next.js App Router',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

// app/page.tsx - Server Component by default
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  })
  return res.json()
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <main>
      <h1>Products</h1>
      <ProductGrid products={products} />
    </main>
  )
}
```

## Patterns

### Pattern 1: Server Components with Data Fetching
```tsx
// app/products/page.tsx
import { Suspense } from 'react'
import { ProductList, ProductListSkeleton } from '@/components/products'
import { FilterSidebar } from '@/components/filters'

interface SearchParams {
  category?: string
  sort?: 'price' | 'name' | 'date'
  page?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <div className="flex gap-8">
      <FilterSidebar />
      <Suspense
        key={JSON.stringify(params)}
        fallback={<ProductListSkeleton />}
      >
        <ProductList
          category={params.category}
          sort={params.sort}
          page={Number(params.page) || 1}
        />
      </Suspense>
    </div>
  )
}
```

### Pattern 2: Client Components with 'use client'
```tsx
// components/products/AddToCartButton.tsx
'use client'

import { useState, useTransition } from 'react'
import { addToCart } from '@/app/actions/cart'

export function AddToCartButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    setError(null)
    startTransition(async () => {
      const result = await addToCart(productId)
      if (result.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? 'Adding...' : 'Add to Cart'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
```

### Pattern 3: Server Actions
```tsx
// app/actions/cart.ts
"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addToCart(productId: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  try {
    await db.cart.upsert({
      where: { sessionId_productId: { sessionId, productId } },
      update: { quantity: { increment: 1 } },
      create: { sessionId, productId, quantity: 1 },
    });

    revalidateTag("cart");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add item to cart" };
  }
}
```

## Caching Strategies

### Data Cache
```tsx
// No cache (always fresh)
fetch(url, { cache: "no-store" });

// Cache forever (static)
fetch(url, { cache: "force-cache" });

// ISR - revalidate after 60 seconds
fetch(url, { next: { revalidate: 60 } });

// Tag-based invalidation
fetch(url, { next: { tags: ["products"] } });

// Invalidate via Server Action
("use server");
import { revalidateTag, revalidatePath } from "next/cache";

export async function updateProduct(id: string, data: ProductData) {
  await db.product.update({ where: { id }, data });
  revalidateTag("products");
  revalidatePath("/products");
}
```

## Best Practices

### Do's
- Start with Server Components - Add 'use client' only when needed
- Colocate data fetching - Fetch data where it's used
- Use Suspense boundaries - Enable streaming for slow data
- Leverage parallel routes - Independent loading states
- Use Server Actions - For mutations with progressive enhancement

### Don'ts
- Don't pass serializable data - Server → Client boundary limitations
- Don't use hooks in Server Components - No useState, useEffect
- Don't fetch in Client Components - Use Server Components or React Query
- Don't over-nest layouts - Each layout adds to the component tree
- Don't ignore loading states - Always provide loading.tsx or Suspense