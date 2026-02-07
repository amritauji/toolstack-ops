# 🚀 Deployment Checklist

## Pre-Deployment (Before Going Live)

### Environment Setup
- [ ] All environment variables set in Vercel/hosting
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configured
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configured
- [ ] `SENTRY_AUTH_TOKEN` configured
- [ ] `NEXT_PUBLIC_SENTRY_DSN` configured

### Security
- [ ] Rate limiting active on all API routes
- [ ] Input sanitization applied
- [ ] HTTPS enforced
- [ ] CORS configured properly
- [ ] RLS policies verified in Supabase
- [ ] No sensitive data in code
- [ ] `.env.local` not in git

### Database
- [ ] Database backups enabled (daily)
- [ ] All SQL migrations applied
- [ ] Developer role created
- [ ] Test data removed
- [ ] Indexes created for performance

### Code Quality
- [ ] All tests passing
- [ ] No console errors
- [ ] Linter passing
- [ ] Build successful
- [ ] No TypeScript errors

### Monitoring
- [ ] Sentry configured and tested
- [ ] Vercel Analytics enabled
- [ ] Health check endpoint working
- [ ] Error tracking verified

### Performance
- [ ] Images optimized
- [ ] Bundle size acceptable (<500KB)
- [ ] Lighthouse score >90
- [ ] Page load time <3s

---

## Deployment Steps

### 1. Final Testing
```bash
npm run build
npm run start
```
- [ ] Test all features locally
- [ ] Test on mobile
- [ ] Test different browsers

### 2. Push to Repository
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 3. Deploy to Vercel
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables
- [ ] Deploy to production
- [ ] Verify deployment successful

### 4. Post-Deployment Verification
- [ ] Visit production URL
- [ ] Test login/signup
- [ ] Create a task
- [ ] Test all major features
- [ ] Check Sentry for errors
- [ ] Monitor performance

---

## Post-Deployment (After Going Live)

### Immediate (First Hour)
- [ ] Monitor error rates in Sentry
- [ ] Check server logs
- [ ] Verify database connections
- [ ] Test critical user flows
- [ ] Check analytics tracking

### First Day
- [ ] Monitor user feedback
- [ ] Check performance metrics
- [ ] Review error logs
- [ ] Verify backups running
- [ ] Monitor server load

### First Week
- [ ] Analyze user behavior
- [ ] Review error patterns
- [ ] Check database performance
- [ ] Optimize slow queries
- [ ] Gather user feedback

---

## Rollback Plan

### If Issues Occur:
1. **Immediate**: Revert to previous deployment in Vercel
2. **Database**: Restore from backup if needed
3. **Notify**: Alert users of maintenance
4. **Fix**: Address issues in development
5. **Redeploy**: After thorough testing

### Rollback Commands:
```bash
# Vercel CLI
vercel rollback

# Or use Vercel Dashboard:
# Deployments → Previous → Promote to Production
```

---

## Success Metrics

### Week 1 Goals:
- [ ] Zero critical errors
- [ ] <1% error rate
- [ ] >95% uptime
- [ ] <2s page load time
- [ ] Positive user feedback

### Month 1 Goals:
- [ ] 100+ active users
- [ ] <0.5% error rate
- [ ] 99.9% uptime
- [ ] <1.5s page load time
- [ ] Feature requests collected

---

## Emergency Contacts

### Team
- Developer: [Your Name]
- DevOps: [Name]
- Support: [Email]

### Services
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- Sentry Support: https://sentry.io/support

---

## Quick Commands

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs
```

### Check Health
```bash
curl https://your-domain.com/api/health
```

### Monitor Errors
Visit: https://sentry.io/organizations/toolstack-ops/issues/

---

**Last Updated:** January 2025  
**Status:** Ready for Deployment ✅
