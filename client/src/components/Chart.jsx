import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API = "https://mini-expenses-tracker.onrender.com";

const COLORS = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Bills: "#a855f7",
  Entertainment: "#ec4899",
  Other: "#6b7280",
};

export default function Chart({ refresh }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/expenses/summary`)
      .then(res => {
        const chartData = Object.entries(res.data.totalPerCategory)
          .filter(([, amt]) => amt > 0)
          .map(([name, value]) => ({ name, value }));
        setData(chartData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) return <div style={cardStyle}>Loading...</div>;

  if (data.length === 0) {
    return (
      <div style={{ ...cardStyle, textAlign: "center", color: "var(--text-muted)" }}>
        <p style={{ fontSize: "32px" }}>📊</p>
        <p style={{ fontSize: "14px", marginTop: "8px" }}>
          No data to show yet
        </p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Spending by Category</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
            }
            contentStyle={{
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text)",
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
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
