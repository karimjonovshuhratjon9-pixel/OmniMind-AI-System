import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, MessageSquare, Eye, Volume2, BarChart3, 
  Shield, Info, Settings, Terminal, Globe, Menu, X
} from 'lucide-react';
import { ChatModule } from './components/ChatModule';
import { VisionModule } from './components/VisionModule';
import { AudioModule } from './components/AudioModule';
import { AnalyticsModule } from './components/AnalyticsModule';
import { cn } from './lib/utils';

type ModuleType = 'nlu' | 'vision' | 'audio' | 'analytics';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('nlu');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const modules = [
    { id: 'nlu', name: 'NLU Core', icon: MessageSquare, color: 'text-brand-primary' },
    { id: 'vision', name: 'Computer Vision', icon: Eye, color: 'text-brand-accent' },
    { id: 'audio', name: 'Audio Synthesis', icon: Volume2, color: 'text-brand-secondary' },
    { id: 'analytics', name: 'Predictive Analytics', icon: BarChart3, color: 'text-yellow-400' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#050505] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="relative flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl z-20"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 shrink-0">
            <Cpu className="text-black" size={24} />
          </div>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
            >
              OmniMind
            </motion.div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id as ModuleType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                activeModule === mod.id 
                  ? "bg-white/10 text-white shadow-inner" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <mod.icon className={cn("shrink-0", activeModule === mod.id ? mod.color : "group-hover:text-white")} size={20} />
              {isSidebarOpen && <span className="font-medium text-sm">{mod.name}</span>}
              {activeModule === mod.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-brand-primary rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-colors">
            <Settings size={20} />
            {isSidebarOpen && <span className="text-sm">System Config</span>}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {isSidebarOpen && <span className="text-sm">Collapse Menu</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">System Online</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-slate-500">
              <Terminal size={14} />
              <span className="text-xs font-mono">v4.2.0-stable</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe size={14} />
              <span>Edge Node: US-EAST-1</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Omni" alt="Avatar" className="w-6 h-6" />
            </div>
          </div>
        </header>

        {/* Module Container */}
        <div className="flex-1 p-8 overflow-hidden relative">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-secondary/20 blur-[120px] rounded-full" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full w-full"
            >
              {activeModule === 'nlu' && <ChatModule />}
              {activeModule === 'vision' && <VisionModule />}
              {activeModule === 'audio' && <AudioModule />}
              {activeModule === 'analytics' && <AnalyticsModule />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <footer className="h-10 border-t border-white/5 bg-black/40 flex items-center justify-between px-8 text-[10px] text-slate-600 uppercase tracking-[0.2em]">
          <div className="flex gap-4">
            <span>Neural Engine: Gemini 3.1</span>
            <span>Memory: 128GB HBM3</span>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Shield size={10} /> Secure Protocol</span>
            <span className="flex items-center gap-1"><Info size={10} /> AGI Research Sandbox</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
