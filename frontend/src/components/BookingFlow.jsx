import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Lock, Calendar, PartyPopper } from 'lucide-react';

export default function BookingFlow({ language, t }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('50000');
  const [duration, setDuration] = useState('12');

  const handleNext = () => setStep(prev => prev + 1);

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (step === 3) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="flex flex-col items-center justify-center p-8 h-full pt-20 max-w-md mx-auto w-full"
      >
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
           <CheckCircle2 size={100} className="text-emerald-500 relative z-10" />
           <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="absolute -right-4 -top-4 text-yellow-500"
           >
             <PartyPopper size={32} />
           </motion.div>
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">{t?.successTitle || 'Booking Confirmed!'}</h2>
        <p className="text-slate-500 text-center mb-8 font-medium">
          {t?.successMsg1 || 'Your Fixed Deposit of'} <span className="text-slate-800 font-bold">₹{amount}</span> {t?.successMsg2 || 'for'} <span className="text-slate-800 font-bold">{duration} months</span> {t?.successMsg3 || 'has been successfully created.'}
        </p>
        
        <button 
           onClick={() => setStep(1)} 
           className="text-indigo-600 font-bold bg-indigo-50 px-8 py-3.5 rounded-full hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
        >
          {t?.bookAnother || 'Book Another FD'}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col pt-8 max-w-lg mx-auto w-full">
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">{t?.bookTitle || 'Quick Book'}</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">{t?.bookSubtitle || 'Secure your wealth in 2 simple steps'}</p>
      </div>
      
      {/* Premium Progress Bar */}
      <div className="flex space-x-2 mb-8 relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10"></div>
        <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-indigo-600 shadow-md shadow-indigo-200' : 'bg-slate-200'}`}></div>
        <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-indigo-600 shadow-md shadow-indigo-200' : 'bg-slate-200'}`}></div>
        <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-indigo-600 shadow-md shadow-indigo-200' : 'bg-slate-200'}`}></div>
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
               key="step1"
               variants={stepVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
               className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-slate-100"
            >
              <div className="flex items-center space-x-2 mb-5 text-indigo-600">
                <div className="bg-indigo-50 p-2 rounded-xl"><Lock size={20} /></div>
                <h3 className="font-bold text-lg text-slate-800 tracking-tight">{t?.step1Title || 'Investment Details'}</h3>
              </div>
              
              <div className="space-y-5">
                 <div className="relative">
                   <label className="block text-slate-500 mb-1.5 text-xs font-bold uppercase tracking-wider">{t?.amountLabel || 'Amount'}</label>
                   <div className="relative flex items-center">
                     <span className="absolute left-4 text-slate-400 font-bold">₹</span>
                     <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-9 pr-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-semibold text-slate-800" />
                   </div>
                 </div>
                 <div className="relative">
                   <label className="block text-slate-500 mb-1.5 text-xs font-bold uppercase tracking-wider">{t?.durationLabel || 'Duration'}</label>
                   <div className="relative flex items-center">
                     <span className="absolute left-4 text-slate-400"><Calendar size={18} /></span>
                     <input type="number" value={duration} onChange={e=>setDuration(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-12 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-semibold text-slate-800" />
                     <span className="absolute right-4 text-slate-400 text-sm font-medium">Months</span>
                   </div>
                 </div>
                 <button onClick={handleNext} className="w-full bg-slate-900 text-white font-bold py-4 mt-2 rounded-[1.25rem] shadow-lg hover:bg-black transition-all flex items-center justify-center">
                   {t?.continueBtn || 'Continue'} <ChevronRight className="ml-2" size={18} />
                 </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
               key="step2"
               variants={stepVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
               className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-slate-100"
            >
              <h3 className="font-bold text-lg mb-4 text-slate-800">{t?.step2Title || 'Confirm Order'}</h3>
              
              <div className="bg-slate-50 p-5 rounded-2xl mb-6">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium text-sm">{t?.principalAmt || 'Principal Amount'}</span>
                  <span className="font-bold text-slate-800">₹{amount}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium text-sm">{t?.tenure || 'Tenure'}</span>
                  <span className="font-bold text-slate-800">{duration} Months</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 font-semibold text-sm">{t?.maturityValue || 'Maturity Amount'}</span>
                  <span className="font-black text-emerald-600 text-lg">₹{(parseInt(amount) * Math.pow(1 + 0.065, parseInt(duration)/12)).toFixed(2)}</span>
                </div>
              </div>
              
              <button onClick={handleNext} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-[1.25rem] shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center active:scale-[0.98]">
                {t?.payBtn || 'Pay Securely'}
              </button>
              <button onClick={() => setStep(1)} className="w-full text-slate-400 font-semibold py-3 mt-3 rounded-full hover:bg-slate-50 hover:text-slate-600 transition-all">
                {t?.editBtn || 'Edit Details'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
