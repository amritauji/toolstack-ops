# Razorpay Setup Guide for NexBoard

## 🇮🇳 Why Razorpay?

- ✅ Works in India (Stripe not available)
- ✅ Supports Indian payments (UPI, cards, netbanking, wallets)
- ✅ Accepts international payments (Visa, Mastercard from USA/Europe)
- ✅ Lowest fees: 2% per transaction
- ✅ Free test mode
- ✅ Easy KYC for students/individuals

## 📋 Setup Steps

### 1. Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Click "Sign Up"
3. Choose "Individual" or "Proprietorship" (for students)
4. Complete email verification

### 2. Get API Keys

**Test Mode (Free - No KYC needed):**
1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Click "Generate Test Key"
4. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (keep this secret!)

**Live Mode (After KYC):**
1. Complete KYC verification
2. Generate Live Keys
3. Use `rzp_live_` keys

### 3. Add to Environment Variables

**Local (.env.local):**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

**Vercel/Production:**
1. Go to Vercel project settings
2. Environment Variables
3. Add both variables
4. Redeploy

### 4. Run Database Migration

Run this in Supabase SQL Editor:
```sql
-- File: sql/payments_table.sql
```

### 5. Test Payment

**Test Cards (Test Mode):**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Test UPI:**
- UPI ID: `success@razorpay`

## 💰 Pricing Plans

Current plans in `lib/razorpay.js`:

| Plan | Price | Features |
|------|-------|----------|
| Free | ₹0 | 3 projects, 50 tasks, 3 members |
| Professional | ₹499/month | 50 projects, 1000 tasks, 10 members, API |
| Enterprise | ₹1499/month | Unlimited everything, SSO |

**To change prices:** Edit `PLANS` object in `lib/razorpay.js`

## 🌍 International Payments

Razorpay automatically accepts international cards:
- ✅ Visa, Mastercard, Amex from any country
- ✅ Auto currency conversion
- ✅ Same 2% fee

**Enable International Payments:**
1. Complete KYC
2. Dashboard → Settings → Payment Methods
3. Enable "International Cards"

## 🔒 Security

- ✅ Payment signature verification implemented
- ✅ Server-side validation
- ✅ Secure webhook handling
- ✅ PCI DSS compliant (Razorpay handles it)

## 📊 Testing Checklist

- [ ] Test mode keys added to `.env.local`
- [ ] Payments table created in Supabase
- [ ] Test card payment works
- [ ] Payment appears in Razorpay dashboard
- [ ] Organization plan upgrades correctly
- [ ] Payment history shows in billing page

## 🚀 Going Live

1. **Complete KYC:**
   - PAN card
   - Bank account details
   - Business/Individual proof

2. **Generate Live Keys:**
   - Replace test keys with live keys
   - Update Vercel environment variables

3. **Enable Payment Methods:**
   - Cards, UPI, Netbanking, Wallets
   - International cards (if needed)

4. **Test with Real Money:**
   - Make a small test payment (₹1)
   - Verify it appears in dashboard
   - Test refund process

## 💡 Tips

- **For Students:** Use "Individual" account type
- **No Company?** You can still accept payments as individual
- **Fees:** 2% on all transactions (no hidden charges)
- **Settlement:** Money reaches bank in 2-3 days
- **Support:** Razorpay has good email support

## 🔗 Useful Links

- Dashboard: https://dashboard.razorpay.com
- Documentation: https://razorpay.com/docs
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details
- Support: support@razorpay.com

## ❓ Troubleshooting

**Payment not working?**
- Check API keys are correct
- Verify test mode vs live mode
- Check browser console for errors

**Signature verification failed?**
- Ensure `RAZORPAY_KEY_SECRET` is correct
- Check no extra spaces in env vars

**International payments not working?**
- Complete KYC first
- Enable international cards in dashboard
- Check payment method is enabled

## 📱 Mobile Payments

Razorpay automatically handles:
- UPI apps (PhonePe, Google Pay, Paytm)
- Mobile wallets
- Responsive checkout page

---

**Ready to accept payments!** 🎉

Test mode is completely free. Start testing now and go live when ready.
