import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Monitor, Terminal, Key, ShieldCheck, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface OnboardingModalProps {
  onClose: () => void;
}

type OSType = 'mac' | 'windows' | 'linux';

export function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [os, setOs] = useState<OSType>('mac');

  useEffect(() => {
    const savedOs = localStorage.getItem('ai-mastery-os') as OSType;
    if (savedOs) {
      setOs(savedOs);
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes('mac')) setOs('mac');
    else if (ua.includes('win')) setOs('windows');
    else if (ua.includes('linux')) setOs('linux');
  }, []);

  const handleSetOs = (type: OSType) => {
    setOs(type);
    localStorage.setItem('ai-mastery-os', type);
  };

  const cliCommands = {
    mac: {
      tool: 'Ollama',
      command: 'brew install ollama',
      description: 'The easiest way to run local LLMs on macOS.'
    },
    windows: {
      tool: 'Ollama (Windows)',
      command: 'winget install ollama',
      description: 'Run powerful open-source models inside your terminal.'
    },
    linux: {
      tool: 'Ollama',
      command: 'curl -fsSL https://ollama.com/install.sh | sh',
      description: 'Native Linux installation for high-performance inference.'
    }
  };

  const aiProviders = [
    { name: 'Google AI Studio', url: 'https://aistudio.google.com/', feature: 'Free Gemini API keys', icon: ShieldCheck },
    { name: 'Anthropic Console', url: 'https://console.anthropic.com/', feature: 'Access to Claude 3.5 Sonnet', icon: Key },
    { name: 'OpenAI Platform', url: 'https://platform.openai.com/', feature: 'The industry standard APIs', icon: Globe },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/40 dark:bg-black/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-600 dark:from-white dark:to-white/60 bg-clip-text text-transparent">Get AI Access</h2>
            <p className="text-slate-500 dark:text-white/50 text-sm md:text-base mt-2">Essential setup to start your 30-day mastery journey.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 dark:text-white/30 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* Section 1: AI Access */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Web & API Access</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {aiProviders.map((provider) => (
                <a
                  key={provider.name}
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                      <provider.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">{provider.name}</div>
                      <div className="text-xs text-slate-500 dark:text-white/40">{provider.feature}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 dark:text-white/20 group-hover:text-slate-600 dark:group-hover:text-white/60 transition-colors" />
                </a>
              ))}
            </div>
          </section>

          {/* Section 2: CLI Usage */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Terminal & Local AI</h3>
            </div>
            
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-lg mb-4 w-fit border border-slate-200 dark:border-white/5">
              {(['mac', 'windows', 'linux'] as OSType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => handleSetOs(t)}
                  className={cn(
                    "px-4 py-1.5 text-xs rounded-md font-medium transition-all capitalize",
                    os === t ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 dark:text-white/40 hover:text-indigo-600 dark:hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 dark:opacity-20 text-slate-400 dark:text-white">
                <Monitor className="w-12 h-12" />
              </div>
              
              <div className="relative z-10">
                <div className="text-sm font-semibold mb-1 text-emerald-600 dark:text-emerald-400">{cliCommands[os].tool}</div>
                <p className="text-slate-500 dark:text-white/50 text-xs mb-4">{cliCommands[os].description}</p>
                
                <div className="bg-white dark:bg-white/5 p-3 rounded-lg font-mono text-sm border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
                  <span className="text-indigo-600 dark:text-indigo-300 font-medium">$ {cliCommands[os].command}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(cliCommands[os].command)}
                    className="text-[10px] uppercase font-bold text-slate-400 dark:text-white/30 hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            I'm Ready to Begin
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
