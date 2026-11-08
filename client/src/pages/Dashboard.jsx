
import React, { useState, useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  Trash2,
} from "lucide-react";
import API from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: "Expense",
    description: "",
  });

  const fetchExpenses = async () => {
    try {
      const response = await API.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      alert("Unable to load transactions. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const income = expenses
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpense = expenses
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = income - totalExpense;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/expenses", {
        ...formData,
        amount: Number(formData.amount),
      });

      alert("Transaction added successfully!");

      setFormData({
        title: "",
        amount: "",
        category: "Food",
        type: "Expense",
        description: "",
      });

      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add transaction");
    }
  };

  // DELETE TRANSACTION
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      alert("Unable to delete transaction");
    }
  };

  // EDIT TRANSACTION
  const handleEdit = async (item) => {
    const newTitle = window.prompt(
      "Enter transaction title:",
      item.title
    );

    if (newTitle === null || !newTitle.trim()) return;

    const newAmount = window.prompt(
      "Enter transaction amount:",
      item.amount
    );

    if (newAmount === null) return;

    if (!Number.isFinite(Number(newAmount)) || Number(newAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      await API.put(`/expenses/${item._id}`, {
        title: newTitle.trim(),
        amount: Number(newAmount),
        category: item.category,
        type: item.type,
        description: item.description,
        date: item.date,
      });

      alert("Transaction updated successfully!");
      fetchExpenses();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update transaction");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to SpendWise! Manage your money wisely.</p>
        </div>

        <button
          className="add-button"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {showForm && (
        <form className="expense-form" onSubmit={handleSubmit}>
          <h2>Add New Transaction</h2>

          <input
            name="title"
            placeholder="Transaction title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option>Food</option>
            <option>Shopping</option>
            <option>Travel</option>
            <option>Education</option>
            <option>Health</option>
            <option>Salary</option>
            <option>Other</option>
          </select>

          <input
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
          />

          <button type="submit" className="add-button">
            Save Transaction
          </button>
        </form>
      )}

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-top">
            <span>Total Balance</span>
            <Wallet />
          </div>
          <h2>₹{balance.toLocaleString("en-IN")}</h2>
          <p>Available balance</p>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <span>Total Income</span>
            <TrendingUp />
          </div>
          <h2>₹{income.toLocaleString("en-IN")}</h2>
          <p>Money received</p>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <span>Total Expenses</span>
            <TrendingDown />
          </div>
          <h2>₹{totalExpense.toLocaleString("en-IN")}</h2>
          <p>Money spent</p>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <span>Total Savings</span>
            <PiggyBank />
          </div>
          <h2>₹{balance.toLocaleString("en-IN")}</h2>
          <p>Income minus expenses</p>
        </div>
      </div>

      <div className="recent-transactions">
        <h2>Recent Transactions</h2>

        {loading ? (
          <p>Loading transactions...</p>
        ) : expenses.length === 0 ? (
          <p>No transactions yet. Add your first transaction!</p>
        ) : (
          expenses.map((item) => (
            <div className="transaction-row" key={item._id}>
              <div>
                <h4>{item.title}</h4>
                <p>
                  {item.category} ·{" "}
                  {new Date(item.date).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="transaction-actions">
                <span
                  className={
                    item.type === "Income"
                      ? "income-amount"
                      : "expense-amount"
                  }
                >
                  {item.type === "Income" ? "+" : "-"}₹
                  {Number(item.amount).toLocaleString("en-IN")}
                </span>

                <button
                  className="edit-button"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(item._id)}
                  title="Delete transaction"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
