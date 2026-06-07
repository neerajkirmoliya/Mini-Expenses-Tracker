import { Router } from "express";
import { getBudgets, setBudget } from "../store.js";

export const router = Router();

const VALID_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Entertainment",
  "Other",
];

// GET /api/budgets
router.get("/", (_req, res) => {
  res.json(getBudgets());
});

// PUT /api/budgets/:category
router.put("/:category", (req, res) => {
  const { category } = req.params;
  const { amount } = req.body;

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number" });
  }

  setBudget(category, Number(amount));
  res.json({ category, amount: Number(amount) });
});