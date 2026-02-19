<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的雲端記帳本</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useMemo, useEffect } = React;
        const { PlusCircle, Trash2, Wallet, History, Coins, PencilLine } = lucide;

        const App = () => {
            // 狀態管理：從 LocalStorage 讀取數據
            const [initialBalance, setInitialBalance] = useState(() => {
                const saved = localStorage.getItem('min_balance');
                return saved ? Number(saved) : 0;
            });
            const [isBalanceSet, setIsBalanceSet] = useState(() => !!localStorage.getItem('min_balance'));
            
            const [transactions, setTransactions] = useState(() => {
                const saved = localStorage.getItem('transactions');
                return saved ? JSON.parse(saved) : [];
            });

            const [tempBalance, setTempBalance] = useState('');
            const [formData, setFormData] = useState({ amount: '', note: '' });

            // 當數據變動時，自動永久保存到瀏覽器
            useEffect(() => {
                localStorage.setItem('transactions', JSON.stringify(transactions));
            }, [transactions]);

            const handleSetBalance = (e) => {
                e.preventDefault();
                if (!tempBalance || Number(tempBalance) < 0) return;
                setInitialBalance(Number(tempBalance));
                setIsBalanceSet(true);
                localStorage.setItem('min_balance', tempBalance);
            };

            const currentBalance = useMemo(() => {
                const totalExpense = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
                return initialBalance - totalExpense;
            }, [initialBalance, transactions]);

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

            // 這裡保留你原本的 UI 代碼... (為了篇幅簡略，邏輯已補全)
            if (!isBalanceSet) {
                return (
                    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl text-center border border-slate-100">
                            <h2 className="text-2xl font-bold mb-2">錢包設定</h2>
                            <form onSubmit={handleSetBalance} className="space-y-4">
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-50 border-2 rounded-2xl p-4 text-center text-2xl font-bold"
                                    value={tempBalance}
                                    onChange={(e) => setTempBalance(e.target.value)}
                                    placeholder="輸入總金額"
                                />
                                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">開始記帳</button>
                            </form>
                        </div>
                    </div>
                );
            }

            return (
                <div className="min-h-screen bg-slate-50 pb-10">
                    <header className="bg-white p-6 shadow-sm border-b sticky top-0 z-10 text-center">
                        <p className="text-slate-400 text-sm">目前餘額</p>
                        <h1 className={`text-4xl font-black ${currentBalance < 0 ? 'text-red-500' : 'text-slate-800'}`}>
                            ${currentBalance.toLocaleString()}
                        </h1>
                        <button onClick={() => {localStorage.clear(); location.reload();}} className="text-[10px] text-slate-300 underline mt-2">重設所有數據</button>
                    </header>
                    <main className="max-w-md mx-auto p-4 space-y-6">
                        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" placeholder="花了什麼？" className="w-full bg-slate-50 rounded-2xl p-4" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} required />
                                <input type="number" placeholder="多少錢？" className="w-full bg-slate-50 rounded-2xl p-4" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">送出紀錄</button>
                            </form>
                        </section>
                        <section className="space-y-3">
                            {transactions.map(t => (
                                <div key={t.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
                                    <div><div className="font-bold">{t.note}</div><div className="text-xs text-slate-400">{t.date}</div></div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-red-500">-${t.amount}</span>
                                        <button onClick={() => deleteTransaction(t.id)} className="text-slate-200 hover:text-red-400">刪除</button>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </main>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
