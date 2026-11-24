import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle } from 'lucide-react';
import type { DayQuizQuestion } from '../data/quizzes';
import { cn } from '../lib/utils';

interface DayQuizProps {
  quiz: DayQuizQuestion;
  passed?: boolean;
  onRecordResult: (dayId: number, passed: boolean) => void;
}

export function DayQuiz({ quiz, passed, onRecordResult }: DayQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [quiz.dayId]);

  const isAnswered = selected !== null;
  const isCorrect = selected === quiz.correctIndex;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    onRecordResult(quiz.dayId, idx === quiz.correctIndex);
  };

  return (
    <section
      aria-label={`Day ${quiz.dayId} Knowledge Check`}
      className="mt-12 rounded-2xl border border-border-u bg-card-u p-6 md:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-500" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-u font-semibold">
            Knowledge Check · Day {String(quiz.dayId).padStart(2, '0')}
          </span>
        </div>
        {passed && (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            Passed
          </span>
        )}
      </div>

      <h3 className="text-base md:text-lg font-semibold text-foreground leading-snug mb-4">
        {quiz.question}
      </h3>

      <div className="space-y-2.5">
        {quiz.options.map((option, idx) => {
          const isThisSelected = selected === idx;
          const isThisCorrect = idx === quiz.correctIndex;

          let stateClass =
            'border-border-u bg-background hover:border-indigo-500/50 hover:bg-indigo-500/[0.04] text-foreground';
          if (isAnswered) {
            if (isThisCorrect) {
              stateClass =
                'border-emerald-500/60 bg-emerald-500/10 text-foreground';
            } else if (isThisSelected && !isThisCorrect) {
              stateClass =
                'border-rose-500/60 bg-rose-500/10 text-foreground';
            } else {
              stateClass = 'border-border-u bg-background/50 text-muted-u opacity-65';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={cn(
                'w-full min-h-[44px] text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-start gap-3',
                stateClass
              )}
            >
              <span className="font-mono text-xs mt-0.5 px-1.5 py-0.5 rounded bg-card-u border border-border-u text-muted-u shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 leading-relaxed">{option}</span>
              {isAnswered && isThisCorrect && (
                <CheckCircle2
                  className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              )}
              {isAnswered && isThisSelected && !isThisCorrect && (
                <XCircle
                  className="w-4 h-4 text-rose-500 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          className={cn(
            'mt-4 p-4 rounded-xl border text-sm leading-relaxed flex flex-col sm:flex-row sm:items-start justify-between gap-3',
            isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/25 text-foreground'
              : 'bg-amber-500/10 border-amber-500/25 text-foreground'
          )}
        >
          <div>
            <p className="font-semibold mb-1">
              {isCorrect ? 'Correct.' : 'Not quite — review the core mechanic:'}
            </p>
            <p className="text-foreground/80">{quiz.explanation}</p>
          </div>
          {!isCorrect && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="shrink-0 min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border-u bg-background hover:bg-card-u text-xs font-medium text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Retry
            </button>
          )}
        </div>
      )}
    </section>
  );
}
