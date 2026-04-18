import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, Zap, Sparkles } from 'lucide-react';

export default function Recommendation({ language, t }) {
  const [formData, setFormData] = useState({
    amount: 50000,
    duration_months: 12,
    risk_preference: 'low',
    age: 30
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const riskOptions = [
    { id: 'low', label: t?.riskLow || 'Low', icon: Shield, desc: t?.riskLowDesc || 'Govt Backed' },
    { id: 'medium', label: t?.riskMed || 'Medium', icon: TrendingUp, desc: t?.riskMedDesc || 'Top Banks' },
    { id: 'high', label: t?.riskHigh || 'High', icon: Zap, desc: t?.riskHighDesc || 'Small Finance' }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await axios.post(`${backendUrl}/api/recommend`, {
        ...formData,
        language
      });
      setResult(res.data);
    } catch (err) {
      alert("Error getting recommendation");
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-6 h-full flex flex-col pt-8"
    >
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">{t?.recTitle || 'Smart Suggest'}</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">{t?.recSubtitle || 'Personalized FD recommendations via AI'}</p>
      </div>

      <div className="flex flex-col gap-6 w-full pb-8">
        <div className="space-y-5 flex-shrink-0 bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-slate-100 relative z-10 w-full">
          
          {/* Basic Details Container */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-slate-500 mb-1.5 text-xs font-bold uppercase tracking-wider">{t?.amountLabel || 'Amount'}</label>
                <div className="relative flex items-center">
                   <span className="absolute left-4 text-slate-400 font-bold">₹</span>
                   <input type="number" 
                      value={formData.amount} 
                      onChange={e=>setFormData({...formData, amount: parseFloat(e.target.value)})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-2 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-semibold text-slate-800 text-sm" 
                   />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-slate-500 mb-1.5 text-xs font-bold uppercase tracking-wider">{t?.durationLabel || 'Duration'}</label>
                <div className="relative flex items-center">
                  <input type="number" 
                     value={formData.duration_months} 
                     onChange={e=>setFormData({...formData, duration_months: parseInt(e.target.value)})} 
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-semibold text-slate-800 text-sm" 
                  />
                  <span className="absolute right-4 text-slate-400 text-xs font-medium">Mo</span>
                </div>
              </div>
            </div>

            <div>
               <label className="block text-slate-500 mb-1.5 text-xs font-bold uppercase tracking-wider">{t?.ageLabel || 'Age'}</label>
               <input type="number" 
                  value={formData.age} 
                  onChange={e=>setFormData({...formData, age: parseInt(e.target.value)})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-semibold text-slate-800 text-sm" 
               />
            </div>
          </div>

          {/* Risk Preference */}
          <div>
            <label className="block text-slate-700 mb-3 text-sm font-bold">{t?.riskTitle || 'Select Risk Profile'}</label>
            <div className="grid grid-cols-3 gap-3">
               {riskOptions.map(option => {
                  const Icon = option.icon;
                  const isSelected = formData.risk_preference === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setFormData({...formData, risk_preference: option.id})}
                      className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                        isSelected ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.02]' : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'
                      }`}
                    >
                       <Icon size={24} className={`mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                       <span className={`text-xs font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{option.label}</span>
                       <span className="text-[10px] text-slate-400 text-center mt-0.5 leading-tight">{option.desc}</span>
                    </button>
                  )
               })}
            </div>
          </div>

          <button 
             onClick={handleSubmit} 
             disabled={loading} 
             className="w-full bg-slate-900 text-white font-bold py-4 rounded-[1.25rem] shadow-lg shadow-slate-200 hover:bg-black transition-all flex items-center justify-center space-x-2 disabled:bg-slate-400"
          >
            {loading ? (
               <span className="animate-pulse">{t?.analyzingBtn || 'Analyzing Options...'}</span>
            ) : (
               <>
                 <Sparkles size={18} className="text-yellow-400" />
                 <span>{t?.getRecBtn || 'Get AI Recommendation'}</span>
               </>
            )}
          </button>
        </div>

        <div className="w-full">
          <AnimatePresence>
            {result && (
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="bg-emerald-50 p-6 md:p-8 rounded-[1.5rem] border border-emerald-200 shadow-lg relative overflow-hidden flex-shrink-0"
              >
                 <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-emerald-400/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                 
                 <div className="flex items-center space-x-2 mb-4">
                   <div className="bg-emerald-100 p-1.5 rounded-lg">
                     <TrendingUp size={16} className="text-emerald-700" />
                   </div>
                   <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">{t?.topMatch || 'Top Match'}</h3>
                 </div>
                 
                 <p className="text-2xl md:text-3xl font-extrabold text-emerald-700 mb-6 tracking-tight leading-tight">{result.recommendation}</p>
                 
                 <div className="bg-white/60 p-5 rounded-xl border border-emerald-100/50 backdrop-blur-sm mb-4">
                    <h4 className="font-bold text-emerald-900 text-xs uppercase mb-2">{t?.whyFits || 'Why this fits you'}</h4>
                    <p className="text-sm text-emerald-800 leading-relaxed font-medium">{result.reason}</p>
                 </div>

                 {result.ml_suggestion && (
                   <div className="flex items-start space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                     <Sparkles size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                     <p className="text-xs md:text-sm text-indigo-900 font-medium leading-relaxed">{result.ml_suggestion}</p>
                   </div>
                 )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
