import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Network, Zap, Binary, Brain, Code2 } from 'lucide-react';

export function DesktopDecor() {
  return (
    <div className="hidden 2xl:block pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
      
      {/* Central Ambient Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Left Decor */}
      <div className="absolute left-[calc(50%-36rem)] top-1/4 w-64 h-[600px] flex flex-col items-center justify-between opacity-[0.05] dark:opacity-[0.1]">
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
          <Brain className="w-28 h-28 text-indigo-500" />
        </motion.div>
        
        <div className="w-[1px] h-40 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent" />
        
        <div className="flex flex-col gap-6 font-mono text-[11px] tracking-widest uppercase whitespace-pre select-none text-slate-400 dark:text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Neural_Core_Sync</span>
          </div>
          <div className="text-indigo-500 font-bold border-b border-indigo-500/20 pb-1">Ref: LLM_PROTO_V4</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 opacity-60">
            <span>Lat: 12ms</span>
            <span>Tkn: 1.2k/s</span>
            <span>Mem: 84%</span>
            <span>Opt: AdamW</span>
          </div>
        </div>

        <div className="p-6 border-4 border-dashed border-indigo-500/10 rounded-full animate-spin-slow">
           <Network className="w-14 h-14 text-indigo-400" />
        </div>
      </div>

      {/* Right Decor */}
      <div className="absolute right-[calc(50%-36rem)] top-1/3 w-64 h-[500px] flex flex-col items-center justify-around opacity-[0.05] dark:opacity-[0.1]">
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500/40 rotate-45" />
              <div className="h-[1px] w-20 bg-indigo-500/20" />
              <Binary className="w-5 h-5 text-indigo-400" />
            </motion.div>
          ))}
        </div>

        <motion.div 
          animate={{ scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative py-8"
        >
          <Cpu className="w-36 h-36 text-indigo-500" />
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full" />
        </motion.div>

        <div className="bg-indigo-500/5 p-8 rounded-[2rem] border border-indigo-500/10 backdrop-blur-sm">
          <Code2 className="w-20 h-20 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>

      {/* Background Grids */}
      <div className="absolute -left-40 top-0 w-96 h-full bg-[radial-gradient(#6366f1_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-[0.03] dark:opacity-[0.06]" />
      <div className="absolute -right-40 top-0 w-96 h-full bg-[radial-gradient(#6366f1_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-[0.03] dark:opacity-[0.06]" />
    </div>
  );
}
