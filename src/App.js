import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Wallet, 
  History,
  Coins,
  PencilLine
} from 'lucide-react';

const App = () => {
  // 狀態管理
  const [initialBalance, setInitialBalance] = useState(() => {
    const saved = localStorage.getItem('min_balance');
    return saved ? Number(saved) : 0;
  });
  const [isBalanceSet, setIsBalanceSet] = useState(() => !!localStorage.getItem('min_balance'));
  const [transactions, setTransactions] = useState([]);
  const [tempBalance, setTempBalance] = useState('');
  
  const [formData, setFormData] = useState({
    amount: '',
    note: ''
  });

  // 設定初始金額
  const handleSetBalance = (e) => {
    e.preventDefault();
    if (!tempBalance || Number(tempBalance) < 0) return;
    setInitialBalance(Number(tempBalance));
    setIsBalanceSet(true);
    localStorage.setItem('min_balance', tempBalance);
  };

  // 計算目前的餘額
  const currentBalance = useMemo(() => {
    const totalExpense = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    return initialBalance - totalExpense;
  }, [initialBalance, transactions]);

  // 處理支出提交
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.note) return;

    const newTransaction = {
      id: Date.now(),
      amount: Number(formData.amount),
      note: formData.note,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({ amount: '', note: '' });
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // 如果還沒設定初始金額，顯示設定畫面
  if (!isBalanceSet) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <Wallet size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">歡迎使用</h2>
          <p className="text-slate-500 mb-8">請先輸入你目前擁有的總金額</p>
          <form onSubmit={handleSetBalance} className="space-y-4">
            <input
              type="number"
              inputMode="decimal"
              placeholder="例如: 5000"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-center text-2xl font-bold focus:border-blue-500 focus:outline-none transition-all"
              value={tempBalance}
              onChange={(e) => setTempBalance(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
            >
              開始記帳
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
      {/* 頂部餘額顯示 */}
      <header className="bg-white p-6 shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto text-center">
          <p className="text-slate-400 text-sm font-medium mb-1">目前剩餘錢包</p>
          <h1 className={`text-4xl font-black transition-colors ${currentBalance < 0 ? 'text-red-500' : 'text-slate-800'}`}>
            ${currentBalance.toLocaleString()}
          </h1>
          <button 
            onClick={() => setIsBalanceSet(false)}
            className="text-[10px] text-slate-300 mt-2 hover:text-slate-500 underline"
          >
            重新設定初始金額
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* 新增支出區塊 */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-700">
            <PlusCircle size={18} className="text-red-500" />
            新增支出紀錄
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <PencilLine size={18} />
              </div>
              <input
                type="text"
                placeholder="花了什麼？(如：午餐、珍奶)"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-red-400 transition-all"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Coins size={18} />
              </div>
              <input
                type="number"
                inputMode="decimal"
                placeholder="多少錢？"
                style={{ appearance: 'none' }}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-red-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
            >
              送出支出紀錄
            </button>
          </form>
        </section>

        {/* 歷史列表 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-700">
              <History size={18} />
              支出明細
            </h3>
            <span className="text-xs text-slate-400">共 {transactions.length} 筆</span>
          </div>

          {transactions.length === 0 ? (
            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl py-12 text-center text-slate-400 text-sm">
              還沒有任何支出喔！
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <div key={t.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-50 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-xs">
                      支
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{t.note}</div>
                      <div className="text-[10px] text-slate-400">{t.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-red-500">
                      -${t.amount.toLocaleString()}
                    </span>
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 text-slate-200 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
