import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ExternalLink, Monitor, Terminal, Key, ShieldCheck, Globe, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface OnboardingModalProps {
  onClose: () => void;
}

type OSType = 'mac' | 'windows' | 'linux';

export function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [os, setOs] = useState<OSType>('linux');
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    const savedOs = localStorage.getItem('ai-mastery-os') as OSType | null;
    if (savedOs === 'mac' || savedOs === 'windows' || savedOs === 'linux') {
      setOs(savedOs);
    } else {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes('mac')) setOs('mac');
      else if (ua.includes('win')) setOs('windows');
      else setOs('linux');
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleSetOs = (type: OSType) => {
    setOs(type);
    setCopiedCmd(false);
    localStorage.setItem('ai-mastery-os', type);
  };

  const cliCommands: Record<OSType, { tool: string; command: string; description: string }> = {
    mac: {
      tool: 'Ollama (macOS)',
      command: 'brew install ollama && ollama pull llama3.1:8b',
      description: 'Run quantized local LLMs on Apple Silicon with Metal acceleration.',
    },
    windows: {
      tool: 'Ollama (Windows)',
      command: 'winget install Ollama.Ollama',
      description: 'Install native Ollama CLI and OpenAI-compatible local endpoint.',
    },
    linux: {
      tool: 'Ollama (Linux)',
      command: 'curl -fsSL https://ollama.com/install.sh | sh',
      description: 'Native Linux installation with CUDA/ROCm GPU detection.',
    },
  };

  const aiProviders = [
    {
      name: 'Google AI Studio',
      url: 'https://aistudio.google.com/',
      feature: 'Free-tier Gemini API keys & 1M+ token playground',
      icon: ShieldCheck,
    },
    {
      name: 'Anthropic Console',
      url: 'https://console.anthropic.com/',
      feature: 'Claude API workbench & prompt caching docs',
      icon: Key,
    },
    {
      name: 'OpenAI Platform',
      url: 'https://platform.openai.com/',
      feature: 'GPT APIs, structured outputs & tokenizer reference',
      icon: Globe,
    },
  ];

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(cliCommands[os].command);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="setup-guide-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/75 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-card-u border border-border-u rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-border-u flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-500 font-semibold">
              Environment Setup
            </span>
            <h2 id="setup-guide-title" className="text-xl md:text-2xl font-bold text-foreground mt-1 font-display">
              API &amp; Local AI Quickstart
            </h2>
            <p className="text-muted-u text-sm mt-1">
              Optional cloud playgrounds and local Ollama setup for hands-on daily tasks. All built-in labs work offline with zero API keys.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close setup guide"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-u hover:text-foreground bg-background border border-border-u rounded-xl transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[68vh]">
          {/* Section 1: Cloud Providers */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-foreground">
                Cloud Workbenches
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {aiProviders.map((provider) => (
                <a
                  key={provider.name}
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 bg-background hover:border-indigo-500/40 border border-border-u rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <provider.icon className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{provider.name}</div>
                      <div className="text-xs text-muted-u">{provider.feature}</div>
                    </div>
                  </div>
                  <ExternalLink
                    className="w-4 h-4 text-muted-u group-hover:text-foreground transition-colors shrink-0"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </section>

          {/* Section 2: Local Ollama CLI */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-foreground">
                Local Open-Weight Models
              </h3>
            </div>

            <div className="flex gap-1.5 p-1 bg-background rounded-lg mb-3 w-fit border border-border-u">
              {(['mac', 'windows', 'linux'] as OSType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleSetOs(t)}
                  className={cn(
                    'min-h-[36px] px-3.5 py-1 text-xs rounded-md font-medium transition-colors capitalize',
                    os === t
                      ? 'bg-indigo-600 text-white'
                      : 'text-muted-u hover:text-foreground'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-4 bg-background border border-border-u rounded-xl">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {cliCommands[os].tool}
                </div>
                <Monitor className="w-4 h-4 text-muted-u" aria-hidden="true" />
              </div>
              <p className="text-muted-u text-xs mb-3">{cliCommands[os].description}</p>

              <div className="bg-card-u p-3 rounded-lg font-mono text-xs border border-border-u flex items-center justify-between gap-3">
                <code className="text-foreground overflow-x-auto whitespace-nowrap">
                  $ {cliCommands[os].command}
                </code>
                <button
                  type="button"
                  onClick={handleCopyCommand}
                  className="shrink-0 min-h-[34px] inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border-u bg-background hover:border-indigo-500/40 text-[11px] font-medium text-foreground transition-colors"
                >
                  {copiedCmd ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-muted-u" aria-hidden="true" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-5 bg-background border-t border-border-u flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Back to Curriculum
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
