import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Calculator as CalcIcon, Lightbulb, Wallet } from 'lucide-react';
import Chatbot from './components/Chatbot';
import Calculator from './components/Calculator';
import Recommendation from './components/Recommendation';
import BookingFlow from './components/BookingFlow';
import { translations } from './utils/translations';

function App() {
  const [language, setLanguage] = useState('English');
  const [activeTab, setActiveTab] = useState('chat');
  
  const t = translations[language] || translations.English;

  const navItems = [
    { id: 'chat', label: t.navChat, icon: MessageSquare },
    { id: 'calculator', label: t.navCalc, icon: CalcIcon },
    { id: 'recommend', label: t.navSuggest, icon: Lightbulb },
    { id: 'book', label: t.navBook, icon: Wallet }
  ];

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-0 md:p-6 lg:p-10 text-slate-800 bg-slate-100">
      <div className="w-full max-w-md h-full md:h-[850px] md:max-h-[85vh] bg-white md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative border md:border-slate-100 flex-shrink-0 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <header className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 p-5 z-20 shadow-md">
          <div className="flex justify-between items-center max-w-lg mx-auto md:max-w-none px-2 space-x-4">
            <div>
              <h1 className="text-xl text-white font-bold tracking-tight">{t.appTitle}</h1>
              <p className="text-indigo-200 text-xs font-medium">{t.appSubtitle}</p>
            </div>
            
            <div className="bg-white/20 p-1 rounded-xl backdrop-blur-md border border-white/20 flex-shrink-0">
              <select 
                className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer pr-1 [&>option]:text-slate-800"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Hinglish">Hinglish</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full bg-slate-50 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full absolute inset-0 overflow-y-auto no-scrollbar"
            >
              <div className="max-w-2xl mx-auto min-h-full flex flex-col px-2 md:px-0 pb-32">
                {activeTab === 'chat' && <Chatbot language={language} t={t} />}
                {activeTab === 'calculator' && <Calculator language={language} t={t} />}
                {activeTab === 'recommend' && <Recommendation language={language} t={t} />}
                {activeTab === 'book' && <BookingFlow language={language} t={t} />}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Dock Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-30">
          <nav className="glass rounded-[2rem] p-2 flex justify-between items-center shadow-lg mx-auto border border-white/60 bg-white/80 backdrop-blur-xl">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex flex-col items-center justify-center w-[22%] py-3 rounded-[1.5rem] transition-colors duration-300 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-400'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-indigo-50/80 rounded-[1.5rem]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 mb-1">
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </span>
                  <span className={`relative z-10 text-[10px] font-semibold tracking-wide ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
        
      </div>
    </div>
  );
}

export default App;
