import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { SmartInsight } from '../types';

export const SmartInsightsBanner: React.FC = () => {
  const [insights, setInsights] = useState<SmartInsight[]>([]);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    const data = await api.getSmartInsights();
    setInsights(data);
  };

  const getInsightStyle = (type: SmartInsight['type']) => {
    switch (type) {
      case 'SUCCESS':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          border: 'border-emerald-500/20 hover:border-emerald-500/40',
          glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
        };
      case 'WARNING':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          border: 'border-amber-500/20 hover:border-amber-500/40',
          glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
        };
      default:
        return {
          icon: <TrendingUp className="w-4 h-4 text-indigo-400" />,
          badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          border: 'border-indigo-500/20 hover:border-indigo-500/40',
          glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
        };
    }
  };

  if (insights.length === 0) return null;

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Smart HR Intelligence & Contextual Insights
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <AnimatePresence>
          {insights.map((insight, idx) => {
            const style = getInsightStyle(insight.type);
            return (
              <motion.div
                key={insight.id || idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                whileHover={{ y: -2 }}
                className={`p-4 rounded-xl glass-panel border ${style.border} ${style.glow} transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide border ${style.badge} flex items-center gap-1.5`}>
                      {style.icon}
                      <span>{insight.category}</span>
                    </span>
                    {insight.metric?.diff && (
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        +{insight.metric.diff}%
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100 mb-1">{insight.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{insight.message}</p>
                </div>

                {insight.recommendation && (
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="truncate pr-2 italic">💡 {insight.recommendation}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
