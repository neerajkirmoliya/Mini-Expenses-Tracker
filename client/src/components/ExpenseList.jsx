import { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./ExpenseForm.jsx";

const API = "https://mini-expenses-tracker.onrender.com";
const CATEGORIES = ["All", "Food", "Transport", "Bills", "Entertainment", "Other"];

export default function ExpenseList({ refresh, onChanged }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, [refresh, category, from, to]);

  async function fetchExpenses() {
    setLoading(true);
    try {
      const params = {};
      if (category !== "All") params.category = category;
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await axios.get(`${API}/api/expenses`, { params });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`${API}/api/expenses/${id}`);
      setConfirmDelete(null);
      onChanged();
    } catch (err) {
      console.error(err);
    }
  }

  function setThisMonth() {
    const now = new Date();
    const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const today = now.toISOString().split("T")[0];
    setFrom(firstDay);
    setTo(today);
  }

  function setLastMonth() {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last = new Date(now.getFullYear(), now.getMonth(), 0);
    setFrom(first.toISOString().split("T")[0]);
    setTo(last.toISOString().split("T")[0]);
  }

  function clearFilters() {
    setFrom("");
    setTo("");
    setCategory("All");
    setSearch("");
  }

  const filtered = expenses.filter(e =>
    e.note?.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={cardStyle}>
      {editing && (
        <ExpenseForm
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); onChanged(); }}
        />
      )}

      {confirmDelete && (
        <div style={overlayStyle}>
          <div style={confirmStyle}>
            <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
              Delete this expense?
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={cancelBtnStyle}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                style={deleteBtnStyle}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 style={titleStyle}>Expenses</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search by category or note..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, marginBottom: "16px" }}
      />

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid var(--border)",
              background: category === cat ? "var(--accent)" : "var(--surface2)",
              color: category === cat ? "white" : "var(--text-muted)",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Date filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px", alignItems: "center" }}>
        <button onClick={setThisMonth} style={dateFilterBtn}>This Month</button>
        <button onClick={setLastMonth} style={dateFilterBtn}>Last Month</button>
        <input
          type="date"
          value={from}
          onChange={e => setFrom(e.target.value)}
          style={{ ...inputStyle, width: "auto", fontSize: "12px", padding: "6px 10px" }}
        />
        <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>to</span>
        <input
          type="date"
          value={to}
          onChange={e => setTo(e.target.value)}
          style={{ ...inputStyle, width: "auto", fontSize: "12px", padding: "6px 10px" }}
        />
        <button onClick={clearFilters} style={dateFilterBtn}>Clear</button>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "60px 0" }}>
          <p style={{ fontSize: "40px" }}>🧾</p>
          <p style={{ fontSize: "15px", marginTop: "12px" }}>No expenses found</p>
          <p style={{ fontSize: "13px", marginTop: "4px" }}>Add one using the button above!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map(expense => (
            <div key={expense.id} style={expenseRowStyle}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: `var(--${expense.category.toLowerCase()})20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
              }}>
                {categoryEmoji(expense.category)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", fontSize: "14px" }}>
                    {expense.category}
                  </span>
                  <span style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    fontFamily: "'DM Mono', monospace",
                    color: "var(--text)",
                  }}>
                    ₹{Number(expense.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {expense.note || "—"}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {formatDate(expense.date)}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  onClick={() => setEditing(expense)}
                  style={iconBtnStyle}
                >
                  ✏️
                </button>
                <button
                  onClick={() => setConfirmDelete(expense.id)}
                  style={iconBtnStyle}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function categoryEmoji(cat) {
  const map = {
    Food: "🍔",
    Transport: "🚗",
    Bills: "💡",
    Entertainment: "🎬",
    Other: "📦",
  };
  return map[cat] || "💸";
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const cardStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "16px",
  padding: "24px",
  flex: 1,
};

const titleStyle = {
  fontSize: "13px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "var(--text-muted)",
  marginBottom: "16px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
};

const dateFilterBtn = {
  padding: "6px 14px",
  borderRadius: "20px",
  border: "1px solid var(--border)",
  background: "var(--surface2)",
  color: "var(--text-muted)",
  fontSize: "13px",
  cursor: "pointer",
};

const expenseRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  background: "var(--surface2)",
  borderRadius: "12px",
  border: "1px solid var(--border)",
};

const iconBtnStyle = {
  background: "transparent",
  border: "none",
  fontSize: "16px",
  padding: "4px",
  cursor: "pointer",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "#00000080",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  backdropFilter: "blur(4px)",
};

const confirmStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "16px",
  padding: "28px",
  width: "100%",
  maxWidth: "360px",
  margin: "0 16px",
  textAlign: "center",
};

const cancelBtnStyle = {
  flex: 1,
  padding: "10px",
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  color: "var(--text)",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

const deleteBtnStyle = {
  flex: 1,
  padding: "10px",
  background: "var(--red)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};
