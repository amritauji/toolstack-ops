import Link from 'next/link';

export const metadata = {
  title: 'Settings | NexBoard',
  description: 'Manage your account and organization settings'
};

export default function SettingsPage() {
  const settingsItems = [
    {
      title: 'Organization',
      description: 'Manage organization details and members',
      href: '/settings/organization',
      icon: '🏢'
    },
    {
      title: 'Billing',
      description: 'Manage subscription and payment methods',
      href: '/settings/billing',
      icon: '💳'
    },
    {
      title: 'API Keys',
      description: 'Generate and manage API keys',
      href: '/settings/api-keys',
      icon: '🔑'
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Settings</h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Manage your account and organization preferences</p>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {settingsItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'block',
              padding: '20px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '24px' }}>{item.icon}</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                  {item.description}
                </p>
              </div>
              <div style={{ marginLeft: 'auto', color: '#9ca3af' }}>
                →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}