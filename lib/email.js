"use server";

/**
 * Email Service for sending organization invites
 * Configure one of the providers below in your .env file
 */

export async function sendInviteEmail(email, inviteToken, orgName, inviterName) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite?token=${inviteToken}`;
  
  // Check which email provider is configured
  if (process.env.RESEND_API_KEY) {
    return await sendViaResend(email, inviteUrl, orgName, inviterName);
  } else if (process.env.SMTP_HOST) {
    return await sendViaSMTP(email, inviteUrl, orgName, inviterName);
  } else {
    // Development mode - log to console
    console.log('\n📧 INVITE EMAIL (Configure RESEND_API_KEY or SMTP in .env)');
    console.log('To:', email);
    console.log('From:', inviterName);
    console.log('Organization:', orgName);
    console.log('Invite URL:', inviteUrl);
    console.log('\n');
    return { success: true, provider: 'console' };
  }
}

async function sendViaResend(email, inviteUrl, orgName, inviterName) {
  try {
    const Resend = (await import('resend')).Resend;
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.SMTP_FROM || 'noreply@yourdomain.com',
      to: email,
      subject: `You're invited to join ${orgName} on NexBoard`,
      html: `
        <h2>You've been invited!</h2>
        <p>${inviterName} has invited you to join <strong>${orgName}</strong> on NexBoard.</p>
        <p><a href="${inviteUrl}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accept Invite</a></p>
        <p>Or copy this link: ${inviteUrl}</p>
        <p><small>This invite expires in 7 days.</small></p>
      `,
    });

    return { success: true, provider: 'resend' };
  } catch (error) {
    console.error('Resend email error:', error);
    // Fallback to console in development
    console.log('\n📧 EMAIL (Resend not configured)');
    console.log('To:', email);
    console.log('Invite URL:', inviteUrl);
    return { success: false, error: error.message };
  }
}

async function sendViaSMTP(email, inviteUrl, orgName, inviterName) {
  try {
    const nodemailer = (await import('nodemailer')).default;
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: `You're invited to join ${orgName} on NexBoard`,
      html: `
        <h2>You've been invited!</h2>
        <p>${inviterName} has invited you to join <strong>${orgName}</strong> on NexBoard.</p>
        <p><a href="${inviteUrl}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accept Invite</a></p>
        <p>Or copy this link: ${inviteUrl}</p>
        <p><small>This invite expires in 7 days.</small></p>
      `,
    });

    return { success: true, provider: 'smtp' };
  } catch (error) {
    console.error('SMTP email error:', error);
    // Fallback to console in development
    console.log('\n📧 EMAIL (SMTP not configured)');
    console.log('To:', email);
    console.log('Invite URL:', inviteUrl);
    return { success: false, error: error.message };
  }
}
