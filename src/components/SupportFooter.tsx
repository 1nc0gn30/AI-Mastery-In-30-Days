import React, { useState } from 'react';
import { Coffee, Copy, Check, Github, ExternalLink } from 'lucide-react';

const STRIPE_COFFEE_URL = 'https://buy.stripe.com/3cIfZg27PdKo2D64Ocfw40X';
const SOLANA_TIP_ADDRESS = 'GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK';

export function SupportFooter() {
  const [copiedSol, setCopiedSol] = useState(false);

  const handleCopySol = async () => {
    try {
      await navigator.clipboard.writeText(SOLANA_TIP_ADDRESS);
      setCopiedSol(true);
      setTimeout(() => setCopiedSol(false), 2000);
    } catch {
      // Clipboard API fallback ignored safely
    }
  };

  return (
    <footer className="mt-16 pt-8 pb-12 border-t border-border-u text-xs text-muted-u">
      <div className="flex flex-col gap-5">
        {/* Open-access support bar */}
        <div className="rounded-xl border border-border-u bg-card-u px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-foreground font-medium text-xs">
              100% Free &amp; Open-Access Curriculum
            </p>
            <p className="text-[11px] text-muted-u">
              Every lesson, quiz, and interactive lab is unlocked by default. Support open developer education if this helped you:
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={STRIPE_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
            >
              <Coffee className="w-3.5 h-3.5" aria-hidden="true" />
              Buy Us a Coffee
            </a>
            <button
              type="button"
              onClick={handleCopySol}
              title={`Copy Solana tip address: ${SOLANA_TIP_ADDRESS}`}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-u bg-background hover:border-indigo-500/40 text-foreground font-mono text-[11px] transition-colors"
            >
              {copiedSol ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                  SOL Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-muted-u" aria-hidden="true" />
                  SOL Tip
                </>
              )}
            </button>
          </div>
        </div>

        {/* Attribution row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-muted-u">
            Engineered by{' '}
            <span className="text-foreground font-medium">Neal Frazier Tech (@1nc0gn30)</span>
            {' • '}
            <a
              href="https://nullai.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-2 transition-colors"
            >
              NullAI Platform
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/1nc0gn30/AI-Mastery-In-30-Days"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Github className="w-3.5 h-3.5" aria-hidden="true" />
              GitHub Repo
            </a>
            <a
              href="https://nullai.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              nullai.tech
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
