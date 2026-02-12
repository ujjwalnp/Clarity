import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Plus, IndianRupee, Moon, Sun, Filter, Calendar } from 'lucide-react';

interface Expense {
  _id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
}

const AddExpenses = () => {
  // State for List and UI
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Form State (matching MongoDB Schema)
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    description: ''
  });

  // Filter State
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });

  // --- API CALLS ---

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      // Construct query string for filters
      const query = new URLSearchParams();
      if (filters.category) query.append('category', filters.category);
      if (filters.startDate) query.append('startDate', filters.startDate);
      if (filters.endDate) query.append('endDate', filters.endDate);

      const response = await fetch(`/api/expense/?${query.toString()}`);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        }),
      });

      if (response.ok) {
        setFormData({ title: '', amount: '', date: new Date().toISOString().split('T')[0], category: 'Food', description: '' });
        fetchExpenses();
      }
    } catch (error) {
      alert("Error adding expense");
    }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (error) {
      console.error("Delete failed");
    }
  };

  // --- CALCULATIONS ---
  const totalBalance = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors p-4 md:p-8 text-slate-900 dark:text-slate-100`}>
      
      {/* Theme Toggle */}
      <button onClick={() => setIsDarkMode(!isDarkMode)} className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all z-50">
        {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
      </button>

      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center py-6">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Clarity: Expense Manager
          </h1>
        </header>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-2xl flex justify-between items-center">
          <div>
            <p className="text-indigo-200 text-sm font-semibold uppercase">Total Spending</p>
            <h2 className="text-5xl font-bold flex items-center gap-2 mt-2">
              <IndianRupee size={40} />
              {totalBalance.toLocaleString('en-IN')}
            </h2>
          </div>
          <div className="hidden md:block opacity-20"><IndianRupee size={100} /></div>
        </div>

        {/* Add Expense Form */}
        <form onSubmit={handleAddExpense} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" placeholder="Title (e.g. Groceries)" required
            className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:ring-2 ring-indigo-500"
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
          />
          <input 
            type="number" placeholder="Amount" required
            className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:ring-2 ring-indigo-500"
            value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
          />
          <input 
            type="date" required
            className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:ring-2 ring-indigo-500"
            value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
          />
          <select 
            className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:ring-2 ring-indigo-500"
            value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
          </select>
          <input 
            type="text" placeholder="Description (Optional)"
            className="md:col-span-1 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:ring-2 ring-indigo-500"
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95">
            <Plus size={20} /> Add Expense
          </button>
        </form>

        {/* Filters Section */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-slate-500"><Filter size={18} /> <span>Filters:</span></div>
          <select 
            className="bg-transparent border-b border-slate-300 dark:border-slate-600 py-1 outline-none"
            onChange={e => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Transport">Transport</option>
          </select>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <input type="date" className="bg-transparent text-sm" onChange={e => setFilters({...filters, startDate: e.target.value})} />
            <span>to</span>
            <input type="date" className="bg-transparent text-sm" onChange={e => setFilters({...filters, endDate: e.target.value})} />
          </div>
        </div>

        {/* Expenses List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 animate-pulse text-indigo-500 font-medium">Loading your expenses...</div>
          ) : (
            expenses.map((expense) => (
              <div key={expense._id} className="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-bold">
                    {expense.category[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{expense.title}</h4>
                    <p className="text-xs text-slate-400 flex gap-2">
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="text-indigo-500">{expense.category}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-black text-rose-500">-₹{expense.amount}</span>
                  <button 
                    onClick={() => deleteExpense(expense._id)}
                    className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddExpenses;