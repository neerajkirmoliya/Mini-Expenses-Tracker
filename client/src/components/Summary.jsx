import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://mini-expenses-tracker.onrender.com";

export default function Summary({ refresh }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/expenses/summary`)
      .then(res => setSummary(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) return <div style={cardStyle}>Loading...</div>;
  if (!summary) return null;

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>This Month</h2>

      <div style={{
        fontSize: "36px",
        fontWeight: "700",
        color: "var(--accent)",
        marginBottom: "20px",
        fontFamily: "'DM Mono', monospace",
      }}>
        ₹{summary.totalThisMonth.toLocaleString("en-IN", {
          minimumFractionDigits: 2
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {Object.entries(summary.totalPerCategory).map(([cat, amt]) => (
          <div key={cat} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: `var(--${cat.toLowerCase()})`,
              }} />
              <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                {cat}
              </span>
            </div>
            <span style={{
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: "'DM Mono', monospace",
            }}>
              ₹{amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>

      {summary.highest && (
        <div style={{
          marginTop: "20px",
          padding: "12px",
          background: "var(--surface2)",
          borderRadius: "8px",
          fontSize: "13px",
        }}>
          <span style={{ color: "var(--text-muted)" }}>Highest expense: </span>
          <span style={{ fontWeight: "600", color: "var(--yellow)" }}>
            ₹{summary.highest.amount.toLocaleString("en-IN")} — {summary.highest.category}
          </span>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "16px",
  padding: "24px",
};

const titleStyle = {
  fontSize: "13px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "var(--text-muted)",
  marginBottom: "12px",
};
