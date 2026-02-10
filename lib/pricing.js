// Pricing configuration with regional pricing and currency support

export const REGIONS = {
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    multiplier: 1.0,
    locale: 'en-US',
    gradient: 'linear-gradient(135deg, #B22234, #FFFFFF, #3C3B6E)'
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    symbol: 'C$',
    multiplier: 1.0,
    locale: 'en-CA',
    gradient: 'linear-gradient(135deg, #FF0000, #FFFFFF, #FF0000)'
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    multiplier: 1.1,
    locale: 'en-GB',
    gradient: 'linear-gradient(135deg, #012169, #FFFFFF, #C8102E)'
  },
  EU: {
    code: 'EU',
    name: 'European Union',
    currency: 'EUR',
    symbol: '€',
    multiplier: 1.1,
    locale: 'en-EU',
    gradient: 'linear-gradient(135deg, #003399, #FFCC00)'
  },
  IN: {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    symbol: '₹',
    multiplier: 0.4,
    locale: 'en-IN',
    gradient: 'linear-gradient(135deg, #FF9933, #FFFFFF, #138808)'
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    multiplier: 1.2,
    locale: 'en-AU',
    gradient: 'linear-gradient(135deg, #012169, #FFFFFF, #C8102E)'
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    symbol: 'S$',
    multiplier: 1.2,
    locale: 'en-SG',
    gradient: 'linear-gradient(135deg, #ED2939, #FFFFFF)'
  },
  BR: {
    code: 'BR',
    name: 'Brazil',
    currency: 'BRL',
    symbol: 'R$',
    multiplier: 0.5,
    locale: 'pt-BR',
    gradient: 'linear-gradient(135deg, #009739, #FEDD00, #012169)'
  },
  MX: {
    code: 'MX',
    name: 'Mexico',
    currency: 'MXN',
    symbol: '$',
    multiplier: 0.5,
    locale: 'es-MX',
    gradient: 'linear-gradient(135deg, #006847, #FFFFFF, #CE1126)'
  },
  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    symbol: 'د.إ',
    multiplier: 0.9,
    locale: 'en-AE',
    gradient: 'linear-gradient(135deg, #00732F, #FFFFFF, #000000, #FF0000)'
  }
};

// Base prices in USD
export const BASE_PRICES = {
  free: {
    monthly: 0,
    annual: 0
  },
  starter: {
    monthly: 12,
    annual: 10
  },
  professional: {
    monthly: 25,
    annual: 20
  },
  enterprise: {
    monthly: 50,
    annual: 40
  }
};

// Currency exchange rates (update periodically via API)
export const EXCHANGE_RATES = {
  USD: 1.0,
  CAD: 1.35,
  GBP: 0.79,
  EUR: 0.92,
  INR: 83.0,
  AUD: 1.52,
  SGD: 1.34,
  BRL: 4.95,
  MXN: 17.0,
  AED: 3.67
};

// Plan features
export const PLAN_FEATURES = {
  free: {
    name: 'Free',
    users: 3,
    tasks: 50,
    storage: '100 MB',
    support: 'Community',
    features: [
      'Up to 3 users',
      '50 tasks',
      '100 MB storage',
      'Basic features',
      'Community support'
    ]
  },
  starter: {
    name: 'Starter',
    users: 10,
    tasks: 'Unlimited',
    storage: '5 GB per user',
    support: 'Email (48h)',
    features: [
      'Up to 10 users',
      'Unlimited tasks',
      '5 GB storage per user',
      'Real-time collaboration',
      'Task comments',
      'File attachments',
      'Mobile app access',
      'Basic analytics',
      'Email support (48h)'
    ]
  },
  professional: {
    name: 'Professional',
    users: 50,
    tasks: 'Unlimited',
    storage: '20 GB per user',
    support: 'Priority (24h)',
    features: [
      'Everything in Starter',
      'Up to 50 users',
      '20 GB storage per user',
      'Advanced analytics',
      'Custom fields',
      'Automation rules',
      'API access',
      'Integrations (Slack, GitHub)',
      'Audit logs',
      'SSO (Single Sign-On)',
      'Priority support (24h)'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    users: 'Unlimited',
    tasks: 'Unlimited',
    storage: 'Unlimited',
    support: '24/7 Dedicated',
    features: [
      'Everything in Professional',
      'Unlimited users',
      'Unlimited storage',
      'Dedicated account manager',
      '24/7 phone & chat support',
      'Custom integrations',
      'On-premise deployment',
      'Advanced security (2FA, IP whitelisting)',
      'Custom SLA (99.9% uptime)',
      'Training & onboarding',
      'White-label option',
      'Custom contracts'
    ]
  }
};

// Calculate price based on region
export function calculatePrice(basePlan, billingCycle, regionCode) {
  const region = REGIONS[regionCode] || REGIONS.US;
  const basePrice = BASE_PRICES[basePlan][billingCycle];
  const regionalPrice = basePrice * region.multiplier;
  const exchangeRate = EXCHANGE_RATES[region.currency];
  const finalPrice = regionalPrice * exchangeRate;
  
  return {
    amount: Math.round(finalPrice * 100) / 100,
    currency: region.currency,
    symbol: region.symbol,
    formatted: `${region.symbol}${Math.round(finalPrice)}`
  };
}

// Get user's region from IP (fallback to US)
export async function detectUserRegion() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code;
    
    // Map country code to our regions
    const regionMap = {
      US: 'US',
      CA: 'CA',
      GB: 'GB',
      IN: 'IN',
      AU: 'AU',
      SG: 'SG',
      BR: 'BR',
      MX: 'MX',
      AE: 'AE',
      // EU countries
      DE: 'EU', FR: 'EU', IT: 'EU', ES: 'EU', NL: 'EU',
      BE: 'EU', AT: 'EU', PT: 'EU', IE: 'EU', FI: 'EU'
    };
    
    return regionMap[countryCode] || 'US';
  } catch (error) {
    console.error('Failed to detect region:', error);
    return 'US';
  }
}

// Format currency
export function formatCurrency(amount, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}
