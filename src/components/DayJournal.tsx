import React from 'react';
import { NotebookPen, Download, Check } from 'lucide-react';

interface DayJournalProps {
  dayId: number;
  value: string;
  onChange: (dayId: number, text: string) => void;
  onExportAll: () => void;
}

export function DayJournal({ dayId, value, onChange, onExportAll }: DayJournalProps) {
  return (
    <section
      aria-label={`Day ${dayId} Study Notes`}
      className="mt-8 rounded-2xl border border-border-u bg-card-u p-6 md:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <NotebookPen className="w-4 h-4 text-indigo-500" aria-hidden="true" />
          <label
            htmlFor={`journal-day-${dayId}`}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-u font-semibold"
          >
            Personal Study Notes &amp; Journal · Day {String(dayId).padStart(2, '0')}
          </label>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-u">
            <Check className="w-3 h-3 text-emerald-500" aria-hidden="true" />
            Saved locally
          </span>
          <button
            type="button"
            onClick={onExportAll}
            className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-u bg-background hover:border-indigo-500/40 text-xs font-medium text-foreground transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
            Export .md
          </button>
        </div>
      </div>

      <textarea
        id={`journal-day-${dayId}`}
        value={value}
        onChange={(e) => onChange(dayId, e.target.value)}
        rows={4}
        placeholder="Capture your reflections, prompt experiments, or links from today's tasks. Stored strictly in your browser's localStorage..."
        className="w-full rounded-xl border border-border-u bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-u/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 resize-y leading-relaxed"
      />
      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-muted-u">
        <span>Zero cloud upload · 100% private browser storage</span>
        <span>{value.length} chars</span>
      </div>
    </section>
  );
}
