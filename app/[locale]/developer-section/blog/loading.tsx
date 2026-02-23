import styles from "./BlogPostPage.module.css";

export default function BlogLoading() {
  return (
    <div className={styles.breadcrumb} aria-hidden>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <span
          className="skeleton"
          style={{
            width: 72,
            height: 24,
            borderRadius: 6,
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
        <span
          className="skeleton"
          style={{
            width: 100,
            height: 24,
            borderRadius: 6,
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
        <span
          className="skeleton"
          style={{
            width: 140,
            height: 24,
            borderRadius: 6,
            background: "rgba(255,255,255,0.08)",
          }}
        />
      </div>
      <div className={styles.headerSection} style={{ alignItems: "flex-start" }}>
        <span
          className="skeleton"
          style={{
            width: "min(100%, 320px)",
            height: 36,
            borderRadius: 8,
            background: "rgba(255,255,255,0.08)",
            marginBottom: "0.75rem",
          }}
        />
        <span
          className="skeleton"
          style={{
            width: "min(100%, 480px)",
            height: 22,
            borderRadius: 6,
            background: "rgba(255,255,255,0.06)",
            marginBottom: "1.5rem",
          }}
        />
        <span
          className="skeleton"
          style={{
            width: "100%",
            maxWidth: 720,
            height: 80,
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
          }}
        />
      </div>
    </div>
  );
}
