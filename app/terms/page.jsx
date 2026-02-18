export default function TermsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>Terms of Service</h1>
      
      <div style={{ lineHeight: '1.6', color: '#374151' }}>
        <p style={{ marginBottom: '24px' }}>
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: '16px' }}>
            By accessing and using ToolStack Ops (&quot;Service&quot;), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>2. Use License</h2>
          <p style={{ marginBottom: '16px' }}>
            Permission is granted to temporarily use the Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display</li>
            <li>attempt to reverse engineer any software contained on the Service</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>3. User Accounts</h2>
          <p style={{ marginBottom: '16px' }}>
            You are responsible for safeguarding the password and for maintaining the confidentiality of your account. You agree not to disclose your password to any third party.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>4. Privacy Policy</h2>
          <p style={{ marginBottom: '16px' }}>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>5. Prohibited Uses</h2>
          <p style={{ marginBottom: '16px' }}>
            You may not use our Service for any unlawful purpose or to solicit others to perform unlawful acts.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>6. Service Availability</h2>
          <p style={{ marginBottom: '16px' }}>
            We reserve the right to withdraw or amend this Service, and any service or material we provide, in our sole discretion without notice.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>7. Limitation of Liability</h2>
          <p style={{ marginBottom: '16px' }}>
            In no event shall ToolStack Ops or its suppliers be liable for any damages arising out of the use or inability to use the Service.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>8. Contact Information</h2>
          <p style={{ marginBottom: '16px' }}>
            If you have any questions about these Terms of Service, please contact us at legal@toolstack.io
          </p>
        </section>
      </div>
    </div>
  );
}