import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { Activity, Zap, Brain, Target, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

const generateData = (points: number) => {
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    accuracy: 0.4 + Math.random() * 0.5 + (i / points) * 0.1,
    loss: 0.8 - Math.random() * 0.4 - (i / points) * 0.3,
    latency: 20 + Math.random() * 15,
  }));
};

export const AnalyticsModule = () => {
  const data = useMemo(() => generateData(20), []);
  
  const stats = [
    { label: 'Neural Density', value: '84.2B', icon: Brain, color: 'text-brand-primary' },
    { label: 'Inference Speed', value: '12ms', icon: Zap, color: 'text-yellow-400' },
    { label: 'Decision Accuracy', value: '99.4%', icon: Target, color: 'text-green-400' },
    { label: 'System Load', value: '24%', icon: Activity, color: 'text-brand-accent' },
  ];

  return (
    <div className="flex flex-col h-full glass-panel overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-brand-primary" />
        <h2 className="font-semibold tracking-tight">Predictive Analytics & RL Metrics</h2>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-6 cyber-grid">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-4 bg-black/40"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={stat.color} size={18} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live Data</span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-5 bg-black/40">
            <h3 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
              <Activity size={14} />
              Training Convergence (Accuracy vs Loss)
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#ffffff40" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff20', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="accuracy" stroke="#00f2ff" fillOpacity={1} fill="url(#colorAcc)" strokeWidth={2} />
                  <Area type="monotone" dataKey="loss" stroke="#ff00c8" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-5 bg-black/40">
            <h3 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
              <Zap size={14} />
              Inference Latency Distribution (ms)
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#ffffff40" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff20', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="latency" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.latency > 30 ? '#ff00c8' : '#7000ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 bg-brand-primary/5 border-brand-primary/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/20 rounded-lg">
                <Target className="text-brand-primary" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">RL Decision Engine</h3>
                <p className="text-xs text-slate-400">Autonomous Policy Optimization</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-bold text-brand-primary uppercase tracking-widest">
              Active Policy: PPO-v4
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase">Reward Function</div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[11px] text-brand-primary">
                R(s,a) = w₁·Acc + w₂·(1-Lat) - w₃·Cost
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Exploration Rate</span>
                <span className="text-brand-primary">0.02</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '20%' }}
                  className="h-full bg-brand-primary"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase">Recent Strategic Decisions</div>
              <div className="space-y-2">
                {[
                  { action: 'Scale Neural Clusters', impact: '+12% Throughput', status: 'Success' },
                  { action: 'Prune Low-Weight Synapses', impact: '-40ms Latency', status: 'Success' },
                  { action: 'Adjust Attention Heads', impact: '+2.4% Accuracy', status: 'Optimizing' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                      <span className="text-slate-300">{item.action}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-brand-primary font-mono">{item.impact}</span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                        item.status === 'Success' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                      )}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
