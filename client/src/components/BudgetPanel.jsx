import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:4000";
const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

export default function BudgetPanel({ refresh, onSaved }) {
  const [budgets, setBudgets] = useState({});
  const [summary, setSummary] = useState({});
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    axios.get(`${API}/api/budgets`).then(res => setBudgets(res.data));
    axios.get(`${API}/api/expenses/summary`).then(res =>
      setSummary(res.data.totalPerCategory)
    );
  }, [refresh]);

  function handleSave(category) {
    if (!value || isNaN(value) || Number(value) <= 0) return;
    axios.put(`${API}/api/budgets/${category}`, { amount: Number(value) })
      .then(() => {
        setEditing(null);
        setValue("");
        onSaved();
      });
  }

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Budgets</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {CATEGORIES.map(cat => {
          const budget = budgets[cat];
          const spent = summary[cat] || 0;
          const percent = budget ? Math.min((spent / budget) * 100, 100) : 0;
          const isOver = budget && spent > budget;

          return (
            <div key={cat}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: `var(--${cat.toLowerCase()})`,
                  }} />
                  <span style={{ fontSize: "13px", fontWeight: "500" }}>{cat}</span>
                </div>

                {editing === cat ? (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="number"
                      value={value}
                      onChange={e => setValue(e.target.value)}
                      placeholder="Amount"
                      style={{
                        width: "90px",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--border)",
                        background: "var(--surface2)",
                        color: "var(--text)",
                        fontSize: "12px",
                      }}
                    />
                    <button
                      onClick={() => handleSave(cat)}
                      style={{
                        background: "var(--accent)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "12px",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      style={{
                        background: "var(--surface2)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "12px",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      fontSize: "12px",
                      color: isOver ? "var(--red)" : "var(--text-muted)",
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {budget
                        ? `₹${spent.toLocaleString("en-IN")} / ₹${budget.toLocaleString("en-IN")}`
                        : "No budget set"}
                    </span>
                    <button
                      onClick={() => { setEditing(cat); setValue(budget || ""); }}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "2px 8px",
                        fontSize: "11px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {budget ? "Edit" : "Set"}
                    </button>
                  </div>
                )}
              </div>

              {budget && (
                <div style={{
                  height: "4px",
                  background: "var(--surface2)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${percent}%`,
                    background: isOver ? "var(--red)" : `var(--${cat.toLowerCase()})`,
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
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
  marginBottom: "16px",
};