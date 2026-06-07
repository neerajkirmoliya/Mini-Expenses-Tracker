import { useState } from "react";
import axios from "axios";

const API = "http://localhost:4000";
const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

export default function ExpenseForm({ onClose, onSaved, existing }) {
  const [form, setForm] = useState({
    amount: existing?.amount || "",
    category: existing?.category || "",
    date: existing?.date || new Date().toISOString().split("T")[0],
    note: existing?.note || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setError("");

    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      return setError("Amount must be a positive number");
    }
    if (!form.category) {
      return setError("Please select a category");
    }
    if (!form.date) {
      return setError("Please select a date");
    }

    const today = new Date().toISOString().split("T")[0];
    if (form.date > today) {
      return setError("Date cannot be in the future");
    }

    setLoading(true);
    try {
      if (existing) {
        await axios.put(`${API}/api/expenses/${existing.id}`, form);
      } else {
        await axios.post(`${API}/api/expenses`, form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700" }}>
            {existing ? "Edit Expense" : "Add Expense"}
          </h2>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {error && (
          <div style={{
            background: "#ff000020",
            border: "1px solid var(--red)",
            borderRadius: "8px",
            padding: "10px 14px",
            color: "var(--red)",
            fontSize: "13px",
            marginBottom: "16px",
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Date *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Note (optional)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="What was this for?"
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              onClick={onClose}
              style={cancelBtnStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={submitBtnStyle}
            >
              {loading ? "Saving..." : existing ? "Update" : "Add Expense"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

const modalStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "20px",
  padding: "32px",
  width: "100%",
  maxWidth: "440px",
  margin: "0 16px",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "500",
  color: "var(--text-muted)",
  marginBottom: "6px",
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

const closeBtnStyle = {
  background: "transparent",
  border: "none",
  color: "var(--text-muted)",
  fontSize: "18px",
  padding: "4px",
};

const cancelBtnStyle = {
  flex: 1,
  padding: "12px",
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  color: "var(--text)",
  fontSize: "14px",
  fontWeight: "600",
};

const submitBtnStyle = {
  flex: 2,
  padding: "12px",
  background: "var(--accent)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontSize: "14px",
  fontWeight: "600",
};