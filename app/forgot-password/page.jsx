"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function ForgotPasswordPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successMessage}>
            <div style={styles.successIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#635BFF"/>
                <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={styles.successTitle}>Check your email</h3>
            <p style={styles.successText}>
              We've sent a password reset link to {email}
            </p>
            <Link href={ROUTES.LOGIN} style={styles.backLink}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#635BFF"/>
              <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h10v2H8v-2z" fill="white"/>
            </svg>
          </div>
          <h1 style={styles.title}>Reset your password</h1>
          <p style={styles.subtitle}>Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleResetPassword} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder=" "
              required
            />
            <label style={{
              ...styles.label,
              ...(email ? styles.labelActive : {})
            }}>Email address</label>
            <span style={styles.inputBorder}></span>
          </div>

          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnLoading : {})
            }}
            disabled={loading}
          >
            <span style={{
              ...styles.btnText,
              opacity: loading ? 0 : 1
            }}>Send reset link</span>
            {loading && (
              <div style={styles.btnLoader}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" opacity="0.25"/>
                  <path d="M16 9a7 7 0 01-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" dur="1s" values="0 9 9;360 9 9" repeatCount="indefinite"/>
                  </path>
                </svg>
              </div>
            )}
          </button>
        </form>

        <div style={styles.signupLink}>
          <Link href={ROUTES.LOGIN} style={styles.link}>Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    background: "#fafbfc",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    lineHeight: 1.5,
  },
  card: {
    background: "#ffffff",
    borderRadius: 12,
    padding: "48px 40px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    width: "100%",
    maxWidth: 400,
  },
  header: {
    textAlign: "center",
    marginBottom: 32,
  },
  logo: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
  },
  title: {
    color: "#1a1f36",
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: 8,
    letterSpacing: "-0.02em",
    margin: 0,
  },
  subtitle: {
    color: "#8792a2",
    fontSize: 14,
    fontWeight: 400,
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    position: "relative",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #e3e8ee",
    borderRadius: 6,
    padding: "16px 14px 8px 14px",
    color: "#1a1f36",
    fontSize: 16,
    fontWeight: 400,
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  label: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#8792a2",
    fontSize: 16,
    fontWeight: 400,
    pointerEvents: "none",
    transition: "all 0.2s ease",
    background: "#ffffff",
    padding: "0 2px",
  },
  labelActive: {
    top: 0,
    fontSize: 12,
    fontWeight: 500,
    color: "#635BFF",
  },
  inputBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 0,
    height: 2,
    background: "#635BFF",
    transition: "width 0.3s ease",
  },
  submitBtn: {
    width: "100%",
    background: "#635BFF",
    color: "#ffffff",
    border: "none",
    borderRadius: 6,
    padding: "14px 20px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 16,
    fontWeight: 500,
    position: "relative",
    marginBottom: 24,
    transition: "all 0.2s ease",
    overflow: "hidden",
    minHeight: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnLoading: {
    background: "#a2a7b5",
    cursor: "not-allowed",
  },
  btnText: {
    transition: "opacity 0.2s ease",
  },
  btnLoader: {
    position: "absolute",
    color: "#ffffff",
  },
  errorMessage: {
    color: "#f56565",
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 16,
    padding: 12,
    background: "#fef5f5",
    border: "1px solid #fed7d7",
    borderRadius: 6,
  },
  signupLink: {
    textAlign: "center",
    fontSize: 14,
    color: "#8792a2",
  },
  link: {
    color: "#635BFF",
    textDecoration: "none",
    fontWeight: 500,
  },
  successMessage: {
    textAlign: "center",
    padding: "32px 20px",
  },
  successIcon: {
    margin: "0 auto 16px",
    animation: "successPop 0.5s ease-out",
  },
  successTitle: {
    color: "#1a1f36",
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: 8,
    margin: 0,
  },
  successText: {
    color: "#8792a2",
    fontSize: 14,
    marginBottom: 24,
    margin: 0,
  },
  backLink: {
    display: "inline-block",
    color: "#635BFF",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: 14,
    marginTop: 16,
  },
};
