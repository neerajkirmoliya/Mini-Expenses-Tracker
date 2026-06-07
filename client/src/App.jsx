import { useState } from "react";
import Header from "./components/Header.jsx";
import Summary from "./components/Summary.jsx";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import Chart from "./components/Chart.jsx";
import BudgetPanel from "./components/BudgetPanel.jsx";

export default function App() {
  const [refresh, setRefresh] = useState(0);
  const [showForm, setShowForm] = useState(false);

  function triggerRefresh() {
    setRefresh((r) => r + 1);
  }

  return (
    <div className="app">
      <Header onAddClick={() => setShowForm(true)} />

      {showForm && (
        <ExpenseForm
          onClose={() => setShowForm(false)}
          onSaved={() => {
            triggerRefresh();
            setShowForm(false);
          }}
        />
      )}

      <main className="main-layout">
        <div className="left-col">
          <Summary refresh={refresh} />
          <Chart refresh={refresh} />
          <BudgetPanel refresh={refresh} onSaved={triggerRefresh} />
        </div>
        <div className="right-col">
          <ExpenseList refresh={refresh} onChanged={triggerRefresh} />
        </div>
      </main>

      <style>{`
        .app {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px 48px;
        }
        .main-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 24px;
          margin-top: 24px;
        }
        .left-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .right-col {
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 900px) {
          .main-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}