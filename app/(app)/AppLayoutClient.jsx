"use client";

export default function AppLayoutClient({ children }) {
  return (
    <div style={shell}>
      <main style={content}>{children}</main>
    </div>
  );
}

const shell = {
  minHeight: "100vh",
  background: "#f8fafc",
};

const content = {
  padding: 0,
  background: 'transparent',
};