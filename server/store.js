import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

const DEFAULT_DATA = {
  expenses: [],
  budgets: {},
};

function load() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR);
  if (existsSync(DATA_FILE)) {
    try {
      return JSON.parse(readFileSync(DATA_FILE, "utf8"));
    } catch {
      return { ...DEFAULT_DATA };
    }
  }
  return { ...DEFAULT_DATA };
}

function save(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const db = load();

export function getExpenses() {
  return db.expenses;
}

export function addExpense(expense) {
  db.expenses.push(expense);
  save(db);
}

export function updateExpense(id, updates) {
  const idx = db.expenses.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  db.expenses[idx] = { ...db.expenses[idx], ...updates };
  save(db);
  return db.expenses[idx];
}

export function deleteExpense(id) {
  const idx = db.expenses.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  db.expenses.splice(idx, 1);
  save(db);
  return true;
}

export function getBudgets() {
  return db.budgets;
}

export function setBudget(category, amount) {
  db.budgets[category] = amount;
  save(db);
}