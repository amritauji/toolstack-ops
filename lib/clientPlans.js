// Client-side plans configuration
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'INR',
    features: ['3 projects', '50 tasks', '3 members']
  },
  professional: {
    name: 'Professional',
    price: 49900,
    priceDisplay: 'INR 499',
    currency: 'INR',
    interval: 'monthly',
    features: ['50 projects', '1000 tasks', '10 members', 'API access', 'Priority support']
  },
  enterprise: {
    name: 'Enterprise',
    price: 149900,
    priceDisplay: 'INR 1499',
    currency: 'INR',
    interval: 'monthly',
    features: ['Unlimited projects', 'Unlimited tasks', 'Unlimited members', 'API access', 'SSO', 'Dedicated support']
  }
};