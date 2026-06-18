# 💸 Mini Expense Tracker

## Project Description
A full-stack expense tracking application built with Node.js and React. Users can log daily expenses across categories, view spending summaries, set budgets per category, and visualize spending with charts.

## Live Demo
-https://mini-expenses-tracker-client.vercel.app/

## Tech Stack
- **Backend:** Node.js, Express — simple and fast REST API
- **Frontend:** React + Vite — fast dev experience with hooks
- **Storage:** JSON file (persists across server restarts)
- **Charts:** Recharts — easy React chart library
- **HTTP Client:** Axios — clean API calls from frontend
- **Styling:** Plain CSS with CSS variables

## How to Run Locally

### Backend
```bash
cd server
npm install
npm run dev
```
Server runs on http://localhost:4000

### Frontend
```bash
cd client
npm install
npm run dev
```
App runs on http://localhost:5173

## API Documentation

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | /api/expenses | - | Array of expenses |
| POST | /api/expenses | {amount, category, date, note} | Created expense |
| PUT | /api/expenses/:id | {amount, category, date, note} | Updated expense |
| DELETE | /api/expenses/:id | - | Success message |
| GET | /api/expenses/summary | - | {totalThisMonth, totalPerCategory, highest} |
| GET | /api/budgets | - | Budget object |
| PUT | /api/budgets/:category | {amount} | Updated budget |

## Project Structure

mini-expense-tracker/
├── server/
│   ├── index.js         # Express app entry point
│   ├── store.js         # Data storage with JSON persistence
│   ├── package.json
│   └── routes/
│       ├── expenses.js  # Expense CRUD routes
│       └── budgets.js   # Budget routes
└── client/
├── index.html
├── vite.config.js
└── src/
├── main.jsx
├── index.css
├── App.jsx
└── components/
├── Header.jsx
├── Summary.jsx
├── Chart.jsx
├── BudgetPanel.jsx
├── ExpenseForm.jsx
└── ExpenseList.jsx

## AI Assistance

During this project, I used Claude AI as a reference tool 
when I got stuck — similar to how a developer would use 
Stack Overflow or documentation.

Specifically I used it for:
- Understanding how to structure a monorepo project
- Clarifying how Express middleware works
- Looking up correct React hooks syntax

Everything else I did myself:
- Designed the component structure
- Decided how data flows between frontend and backend
- Chose the tech stack (Vite, Recharts, Axios)
- Manually wrote, typed and tested every file
- Debugged all errors that came up during development
- Made all UI and UX decisions

I treat AI the same way I treat documentation —
as a reference, not a replacement for thinking.
