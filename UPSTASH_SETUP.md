# Upstash Redis Setup Guide

## Why Redis?

The in-memory rate limiting won't work in serverless/multi-instance deployments. Redis provides:
- Distributed rate limiting across all instances
- Persistent storage
- Automatic expiration
- High performance

## Setup Steps

### 1. Create Upstash Account

1. Go to [https://upstash.com](https://upstash.com)
2. Sign up (free tier available)
3. Create a new Redis database

### 2. Get Credentials

1. In Upstash dashboard, click your database
2. Copy **REST URL** → `UPSTASH_REDIS_URL`
3. Copy **REST Token** → `UPSTASH_REDIS_TOKEN`

### 3. Add to Environment

**Local (.env.local)**:
```env
UPSTASH_REDIS_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_TOKEN=your-token-here
```

**Vercel/Production**:
1. Go to Vercel project settings
2. Environment Variables
3. Add both variables
4. Redeploy

### 4. Verify

The app will automatically use Redis if configured, otherwise falls back to in-memory (dev only).

Check logs for: `Using Redis for rate limiting` or `Using in-memory rate limiting (dev only)`

## Rate Limits

- **API endpoints**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 requests per 15 minutes per IP
- **Per-user API**: 1000 requests per hour (coming soon)

## Monitoring

View rate limit stats in Upstash dashboard:
- Request count
- Memory usage
- Key expiration

## Cost

- **Free tier**: 10,000 commands/day
- **Pay-as-you-go**: $0.20 per 100K commands
- Typical usage: ~50K commands/day for 1000 users

## Troubleshooting

**Rate limiting not working?**
- Check env vars are set
- Restart dev server
- Check Upstash dashboard for errors

**Too many rate limit errors?**
- Increase limits in `lib/rateLimit.js`
- Add per-user limits instead of per-IP
- Whitelist trusted IPs

## Alternative: Vercel KV

If using Vercel, you can use Vercel KV instead:

```bash
npm install @vercel/kv
```

Update `lib/rateLimit.js` to use `@vercel/kv` instead of `@upstash/redis`.
