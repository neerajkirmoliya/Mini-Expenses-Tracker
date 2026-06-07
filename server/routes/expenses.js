import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../store.js";

export const router = Router();

const VALID_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Entertainment",
  "Other",
];

// GET /api/expenses
router.get("/", (req, res) => {
  const { category, from, to } = req.query;
  let expenses = getExpenses();

  if (category && category !== "All") {
    expenses = expenses.filter((e) => e.category === category);
  }

  if (from) {
    expenses = expenses.filter((e) => e.date >= from);
  }

  if (to) {
    expenses = expenses.filter((e) => e.date <= to);
  }

  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(expenses);
});

// POST /api/expenses
router.post("/", (req, res) => {
  const { amount, category, date, note } = req.body;

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number" });
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Valid category is required" });
  }

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  const today = new Date().toISOString().split("T")[0];
  if (date > today) {
    return res.status(400).json({ error: "Date cannot be in the future" });
  }

  const expense = {
    id: uuidv4(),
    amount: Number(amount),
    category,
    date,
    note: note || "",
    createdAt: new Date().toISOString(),
  };

  addExpense(expense);
  res.status(201).json(expense);
});

// PUT /api/expenses/:id
router.put("/:id", (req, res) => {
  const { amount, category, date, note } = req.body;

  if (amount !== undefined && (isNaN(amount) || Number(amount) <= 0)) {
    return res.status(400).json({ error: "Amount must be a positive number" });
  }

  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  const today = new Date().toISOString().split("T")[0];
  if (date && date > today) {
    return res.status(400).json({ error: "Date cannot be in the future" });
  }

  const updated = updateExpense(req.params.id, {
    ...(amount !== undefined && { amount: Number(amount) }),
    ...(category !== undefined && { category }),
    ...(date !== undefined && { date }),
    ...(note !== undefined && { note }),
  });

  if (!updated) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.json(updated);
});

// DELETE /api/expenses/:id
router.delete("/:id", (req, res) => {
  const deleted = deleteExpense(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Expense not found" });
  }
  res.json({ message: "Deleted successfully" });
});

// GET /api/expenses/summary
router.get("/summary", (req, res) => {
  const expenses = getExpenses();
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthlyExpenses = expenses.filter((e) =>
    e.date.startsWith(thisMonth)
  );

  const totalThisMonth = monthlyExpenses.reduce(
    (sum, e) => sum + e.amount, 0
  );

  const totalPerCategory = {};
  VALID_CATEGORIES.forEach((cat) => {
    totalPerCategory[cat] = monthlyExpenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
  });

  const highest = expenses.reduce(
    (max, e) => (e.amount > (max?.amount || 0) ? e : max),
    null
  );

  res.json({ totalThisMonth, totalPerCategory, highest });
});