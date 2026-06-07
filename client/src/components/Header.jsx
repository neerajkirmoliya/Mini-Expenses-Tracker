export default function Header({ onAddClick }) {
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "28px 0 20px",
      borderBottom: "1px solid var(--border)",
      marginBottom: "8px",
    }}>
      <div>
        <h1 style={{
          fontSize: "24px",
          fontWeight: "700",
          letterSpacing: "-0.5px",
          color: "var(--text)",
        }}>
          💸 Mini Expense Tracker
        </h1>
        <p style={{
          color: "var(--text-muted)",
          fontSize: "14px",
          marginTop: "4px",
        }}>
          Track your daily spending
        </p>
      </div>

      <button
        onClick={onAddClick}
        style={{
          background: "var(--accent)",
          color: "white",
          border: "none",
          borderRadius: "10px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: "600",
          transition: "background 0.2s",
        }}
        onMouseOver={e => e.target.style.background = "var(--accent-hover)"}
        onMouseOut={e => e.target.style.background = "var(--accent)"}
      >
        + Add Expense
      </button>
    </header>
  );
}