"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { uploadAvatar } from "@/lib/uploadAvatar";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 10;
    return Math.min(strength, 100);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 102400) {
      setError("Image must be less than 100KB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }

    setAvatar(file);
    setError("");
    
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username
          }
        }
      });

      if (signupError) {
        setError(signupError.message);
        setLoading(false);
        return;
      }

      let avatarUrl = null;
      
      if (avatar && data.user) {
        try {
          avatarUrl = await uploadAvatar(avatar, data.user.id);
        } catch (uploadError) {
          console.error("Avatar upload failed:", uploadError.message);
        }
      }

      // Update profile with avatar URL if upload was successful
      if (avatarUrl && data.user) {
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await supabase
          .from("profiles")
          .update({ avatar_url: avatarUrl })
          .eq("id", data.user.id);
      }

      setShowSuccess(true);
      setMessage("Check your email for confirmation link!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
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
            <h3 style={styles.successTitle}>Account Created!</h3>
            <p style={styles.successText}>{message}</p>
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
          <h1 style={styles.title}>Join ToolStack Ops</h1>
          <p style={styles.subtitle}>Create your account to get started</p>
        </div>

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={styles.avatarUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={styles.fileInput}
                id="avatar"
              />
              <label htmlFor="avatar" style={styles.fileLabel}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" style={styles.avatarPreview} />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    <span style={styles.avatarIcon}>📷</span>
                    <span style={styles.avatarText}>Upload Avatar</span>
                  </div>
                )}
              </label>
              <span style={styles.avatarHint}>Max 100KB</span>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
              placeholder=" "
              required
            />
            <label style={{
              ...styles.label,
              ...(fullName ? styles.labelActive : {})
            }}>Full Name</label>
            <span style={styles.inputBorder}></span>
          </div>

          <div style={styles.inputGroup}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder=" "
              required
            />
            <label style={{
              ...styles.label,
              ...(username ? styles.labelActive : {})
            }}>Username</label>
            <span style={styles.inputBorder}></span>
          </div>

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

          <div style={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordStrength(calculatePasswordStrength(e.target.value));
              }}
              style={{...styles.input, paddingRight: 42}}
              placeholder=" "
              required
            />
            <label style={{
              ...styles.label,
              ...(password ? styles.labelActive : {})
            }}>Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3C4.5 3 1.6 5.6 1 8c.6 2.4 3.5 5 7 5s6.4-2.6 7-5c-.6-2.4-3.5-5-7-5zm0 8.5A3.5 3.5 0 118 4.5a3.5 3.5 0 010 7zm0-5.5a2 2 0 100 4 2 2 0 000-4z" fill="currentColor"/>
              </svg>
            </button>
            <span style={styles.inputBorder}></span>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div style={{ marginBottom: 24, marginTop: -16 }}>
              <div style={{
                height: '4px',
                background: '#f3f4f6',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${passwordStrength}%`,
                  background: passwordStrength < 33 ? '#ef4444' : 
                             passwordStrength < 66 ? '#f59e0b' : '#10b981',
                  transition: 'all 0.3s ease'
                }} />
              </div>
              <p style={{ 
                fontSize: '12px', 
                color: passwordStrength < 33 ? '#ef4444' : 
                       passwordStrength < 66 ? '#f59e0b' : '#10b981',
                fontWeight: 500,
                margin: 0
              }}>
                {passwordStrength < 33 ? 'Weak password' : 
                 passwordStrength < 66 ? 'Medium password' : 'Strong password'}
              </p>
            </div>
          )}

          {/* Terms & Conditions */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: 16, alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
              style={{ marginTop: '2px', cursor: 'pointer' }}
            />
            <label htmlFor="terms" style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', cursor: 'pointer' }}>
              I agree to the <a href="/terms" style={{ color: '#635BFF', textDecoration: 'none', fontWeight: 500 }}>Terms of Service</a> and <a href="/privacy" style={{ color: '#635BFF', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>
            </label>
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
              ...((loading || !acceptedTerms) ? styles.submitBtnLoading : {})
            }}
            disabled={loading || !acceptedTerms}
          >
            <span style={{
              ...styles.btnText,
              opacity: loading ? 0 : 1
            }}>Create account</span>
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
          <span>Already have an account? </span>
          <Link href={ROUTES.LOGIN} style={styles.link}>Sign in</Link>
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
  avatarUpload: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  fileInput: {
    display: "none",
  },
  fileLabel: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: "50%",
    border: "2px dashed #e3e8ee",
    transition: "border-color 0.2s ease",
  },
  avatarPreview: {
    width: 76,
    height: 76,
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  avatarIcon: {
    fontSize: 24,
  },
  avatarText: {
    fontSize: 10,
    color: "#8792a2",
    textAlign: "center",
  },
  avatarHint: {
    fontSize: 11,
    color: "#8792a2",
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
  passwordToggle: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#8792a2",
    padding: 6,
    borderRadius: 4,
    transition: "color 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 4,
    margin: 0,
  },
  successText: {
    color: "#8792a2",
    fontSize: 14,
    margin: 0,
  },
};