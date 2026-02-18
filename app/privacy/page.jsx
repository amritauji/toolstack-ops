export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>Privacy Policy</h1>
      
      <div style={{ lineHeight: '1.6', color: '#374151' }}>
        <p style={{ marginBottom: '24px' }}>
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: '16px' }}>
            We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
          </p>
          <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
            <li>Account information (name, email address)</li>
            <li>Profile information</li>
            <li>Content you create using our Service</li>
            <li>Communications with us</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>2. How We Use Your Information</h2>
          <p style={{ marginBottom: '16px' }}>
            We use the information we collect to:
          </p>
          <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>3. Information Sharing</h2>
          <p style={{ marginBottom: '16px' }}>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>4. Data Security</h2>
          <p style={{ marginBottom: '16px' }}>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>5. Data Retention</h2>
          <p style={{ marginBottom: '16px' }}>
            We retain your information for as long as your account is active or as needed to provide you services and comply with legal obligations.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>6. Your Rights</h2>
          <p style={{ marginBottom: '16px' }}>
            You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>7. Cookies</h2>
          <p style={{ marginBottom: '16px' }}>
            We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>8. Changes to This Policy</h2>
          <p style={{ marginBottom: '16px' }}>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>9. Contact Us</h2>
          <p style={{ marginBottom: '16px' }}>
            If you have any questions about this Privacy Policy, please contact us at privacy@toolstack.io
          </p>
        </section>
      </div>
    </div>
  );
}