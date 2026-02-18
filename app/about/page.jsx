import Link from "next/link";

export const metadata = {
  title: "About Nexboard | Project Management Platform for Modern Teams",
  description:
    "Learn about Nexboard, the all-in-one project management platform built for fast-moving teams that need tasks, collaboration, and execution in one place.",
  alternates: {
    canonical: "https://nexboard.me/about",
  },
};

export default function AboutPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", padding: "64px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1, marginBottom: "16px" }}>About Nexboard</h1>
        <p style={{ fontSize: "18px", color: "#334155", marginBottom: "28px", maxWidth: "740px" }}>
          Nexboard is a project management and team operations platform built for companies that need speed, visibility, and execution quality.
        </p>

        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>What Nexboard does</h2>
          <p style={{ color: "#334155", marginBottom: "8px" }}>
            Teams use Nexboard to manage tasks, collaborate in real time, track progress, and automate routine workflows.
          </p>
          <p style={{ color: "#334155", marginBottom: 0 }}>
            Core capabilities include kanban boards, activity tracking, analytics, role-based collaboration, and organization-level workspace management.
          </p>
        </section>

        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Who Nexboard is for</h2>
          <p style={{ color: "#334155", marginBottom: 0 }}>
            Product teams, operations teams, founders, and agencies that need one reliable system for planning, task execution, and delivery.
          </p>
        </section>

        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Why teams choose Nexboard</h2>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#334155" }}>
            <li>Fast onboarding with an intuitive UI.</li>
            <li>Multi-tenant organization support and role-based controls.</li>
            <li>Realtime collaboration and clear operational visibility.</li>
          </ul>
        </section>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link
            href="/pricing"
            style={{
              display: "inline-block",
              background: "#0f172a",
              color: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            View Pricing
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "#fff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              padding: "12px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
