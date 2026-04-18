import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Calculator({ t }) {
  const [amount, setAmount] = useState(10000);
  const [duration, setDuration] = useState(12);
  const [rate, setRate] = useState(6.5);
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await axios.post(`${backendUrl}/api/calculate`, {
        amount: parseFloat(amount),
        duration_months: parseInt(duration),
        interest_rate: parseFloat(rate)
      });
      setResult(res.data);
    } catch (err) {
      alert("Error calculating");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-6 h-full flex flex-col pt-8"
    >
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">{t?.calcTitle || 'FD Calculator'}</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">{t?.calcSubtitle || 'Estimate your returns with ease'}</p>
      </div>
      
      <div className="flex flex-col gap-6 w-full pb-8">
        <div className="space-y-5 bg-white p-6 md:p-8 rounded-[1.5rem] shadow-md border border-slate-100 flex-shrink-0 relative z-10 w-full">
          <div className="relative">
            <label className="block text-slate-500 mb-1.5 text-xs font-bold uppercase tracking-wider">{t?.amountLabel}</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 font-bold">₹</span>
              <input 
                type="number" 
                value={amount} 
                onChange={e=>setAmount(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-9 pr-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-slate-500 mb-1.5 text-xs font-bold uppercase tracking-wider">{t?.durationLabel}</label>
              <div className="relative flex items-center">
                <input 
                  type="number" 
                  value={duration} 
                  onChange={e=>setDuration(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-semibold text-slate-800"
                />
                <span className="absolute right-4 text-slate-400 text-sm font-medium">Mo</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-slate-500 mb-1.5 text-xs font-bold uppercase tracking-wider">{t?.rateLabel}</label>
              <div className="relative flex items-center">
                <input 
                  type="number" 
                  value={rate} 
                  onChange={e=>setRate(e.target.value)} 
                  step="0.1" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-semibold text-slate-800"
                />
                <span className="absolute right-4 text-slate-400 text-sm font-medium">%</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleCalculate} 
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 mt-4 rounded-[1.25rem] shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98] transition-all"
          >
            {t?.calcBtn}
          </button>
        </div>

        <div className="w-full">
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: -20, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: 20, rotateX: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ perspective: "1000px" }}
                className="bg-gradient-to-br from-indigo-900 to-violet-900 p-6 md:p-8 rounded-[1.5rem] shadow-xl border border-indigo-700/50 relative overflow-hidden flex-shrink-0"
              >
                 <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                 
                 <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-6">{t?.estimatedReturns}</h3>
                 
                 <div className="flex justify-between items-end mb-8">
                   <div>
                      <p className="text-white/60 text-sm mb-1">{t?.maturityValue}</p>
                      <p className="font-bold text-3xl md:text-3xl lg:text-4xl text-white tracking-tight">₹{result.maturity_amount}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-white/60 text-sm mb-1">{t?.interestEarned}</p>
                      <p className="font-semibold text-emerald-400 text-xl md:text-2xl">+₹{result.interest_earned}</p>
                   </div>
                 </div>
                 
                 <div className="bg-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md border border-white/10">
                   <div className="flex justify-between items-center text-sm md:text-base font-medium">
                     <span className="text-indigo-100">{t?.investedAmount}</span>
                     <span className="text-white font-bold">₹{result.invested_amount}</span>
                   </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
