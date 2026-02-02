import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getUser() {
  const cookieStore = await cookies(); // ✅ MUST AWAIT

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}