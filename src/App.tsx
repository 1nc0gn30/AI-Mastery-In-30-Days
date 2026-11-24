import React, { useState, useEffect, useMemo, useRef } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  BookOpen,
  Moon,
  Sun,
  Cpu,
  Sparkles,
  ShieldCheck,
  Database,
  Search,
  FlaskConical,
  Terminal,
  Clock,
  Download,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { curriculumData, type CurriculumCategory, type DayContent } from './data/curriculum';
import { dayQuizzes } from './data/quizzes';
import { exportStudyNotesMarkdown, type LabTabId } from './lib/aiLabEngine';
import { cn } from './lib/utils';
import { OnboardingModal } from './components/OnboardingModal';
import { InteractiveLab } from './components/InteractiveLab';
import { DayQuiz } from './components/DayQuiz';
import { DayJournal } from './components/DayJournal';
import { SupportFooter } from './components/SupportFooter';

type ActiveView = 'curriculum' | 'lab';
type CompletionFilter = 'all' | 'todo' | 'done';

const CATEGORIES: Array<'All' | CurriculumCategory> = [
  'All',
  'Foundations',
  'Multimodal',
  'Advanced',
  'Agents & Security',
];

const LAB_LABELS: Record<LabTabId, { title: string; summary: string }> = {
  prompt: {
    title: 'Prompt Builder & Linter',
    summary: 'Compose P.C.T.F. prompts, switch CoT/ToT/ReAct patterns, and lint clichés.',
  },
  tokens: {
    title: 'Token, Cost & VRAM Lab',
    summary: 'Inspect subword tokens, compare API spend, and size local Ollama VRAM.',
  },
  rag: {
    title: 'RAG Chunk & Retrieval Simulator',
    summary: 'Tune chunk size & overlap and inspect live TF-IDF cosine retrieval scores.',
  },
  security: {
    title: 'Prompt Injection Red-Team Lab',
    summary: 'Audit OWASP LLM01 attacks, detect secret leaks, and generate XML guardrails.',
  },
};

function CodeBlock({ codeText }: { codeText: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border-u bg-card-u">
      <div className="bg-background px-4 py-2 border-b border-border-u flex items-center justify-between text-[11px] font-mono text-muted-u uppercase">
        <span>Code / Payload Example</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm text-foreground/90 leading-relaxed">
        <code className="font-mono">{codeText}</code>
      </pre>
    </div>
  );
}

function getInitialRouteState(): { view: ActiveView; day: number; labTab: LabTabId } {
  if (typeof window === 'undefined') {
    return { view: 'curriculum', day: 1, labTab: 'prompt' };
  }
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get('view') === 'lab' ? 'lab' : 'curriculum';
  const dayNum = Number(params.get('day'));
  const savedDay = Number(localStorage.getItem('ai-mastery-active-day'));
  const validDay =
    Number.isInteger(dayNum) && dayNum >= 1 && dayNum <= curriculumData.length
      ? dayNum
      : Number.isInteger(savedDay) && savedDay >= 1 && savedDay <= curriculumData.length
        ? savedDay
        : 1;
  const tabParam = params.get('tab');
  const validTab: LabTabId =
    tabParam === 'prompt' || tabParam === 'tokens' || tabParam === 'rag' || tabParam === 'security'
      ? tabParam
      : 'prompt';
  return { view: viewParam, day: validDay, labTab: validTab };
}

export default function App() {
  const initial = useMemo(() => getInitialRouteState(), []);

  const [activeView, setActiveView] = useState<ActiveView>(initial.view);
  const [selectedDay, setSelectedDay] = useState<number>(initial.day);
  const [activeLabTab, setActiveLabTab] = useState<LabTabId>(initial.labTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
  const [journalNotes, setJournalNotes] = useState<Record<number, string>>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | CurriculumCategory>('All');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');

  const mainScrollRef = useRef<HTMLElement>(null);

  // Hydrate persisted state
  useEffect(() => {
    const savedTheme = localStorage.getItem('ai-mastery-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }

    try {
      const savedCompleted = localStorage.getItem('ai-mastery-completed');
      if (savedCompleted) {
        const parsed = JSON.parse(savedCompleted);
        if (Array.isArray(parsed)) setCompletedDays(parsed);
      }
      const savedQuiz = localStorage.getItem('ai-mastery-quizzes');
      if (savedQuiz) {
        const parsed = JSON.parse(savedQuiz);
        if (parsed && typeof parsed === 'object') setQuizResults(parsed);
      }
      const savedNotes = localStorage.getItem('ai-mastery-notes');
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes);
        if (parsed && typeof parsed === 'object') setJournalNotes(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // Sync dark/light class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ai-mastery-theme', theme);
  }, [theme]);

  // Sync URL query params and scroll top on route change
  useEffect(() => {
    localStorage.setItem('ai-mastery-active-day', String(selectedDay));
    const url = new URL(window.location.href);
    if (activeView === 'lab') {
      url.searchParams.set('view', 'lab');
      url.searchParams.set('tab', activeLabTab);
      url.searchParams.delete('day');
    } else {
      url.searchParams.delete('view');
      url.searchParams.delete('tab');
      if (selectedDay > 1) {
        url.searchParams.set('day', String(selectedDay));
      } else {
        url.searchParams.delete('day');
      }
    }
    window.history.replaceState({}, '', url.toString());
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView, selectedDay, activeLabTab]);

  // Keyboard shortcuts (Alt + Left/Right for day nav)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeView !== 'curriculum' || showSetupGuide) return;
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedDay((d) => Math.min(curriculumData.length, d + 1));
      } else if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedDay((d) => Math.max(1, d - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeView, showSetupGuide]);

  const toggleDayCompletion = (id: number) => {
    setCompletedDays((prev) => {
      const next = prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id];
      localStorage.setItem('ai-mastery-completed', JSON.stringify(next));
      return next;
    });
  };

  const handleRecordQuiz = (dayId: number, passed: boolean) => {
    setQuizResults((prev) => {
      const next = { ...prev, [dayId]: prev[dayId] || passed };
      localStorage.setItem('ai-mastery-quizzes', JSON.stringify(next));
      return next;
    });
  };

  const handleNoteChange = (dayId: number, text: string) => {
    setJournalNotes((prev) => {
      const next = { ...prev, [dayId]: text };
      localStorage.setItem('ai-mastery-notes', JSON.stringify(next));
      return next;
    });
  };

  const handleExportNotes = () => {
    const markdown = exportStudyNotesMarkdown(
      completedDays,
      journalNotes,
      quizResults,
      curriculumData
    );
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-mastery-30-days-study-log.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openLabTab = (tab: LabTabId) => {
    setActiveLabTab(tab);
    setActiveView('lab');
    setSidebarOpen(false);
  };

  const activeDayContent =
    curriculumData.find((d) => d.id === selectedDay) ?? curriculumData[0];
  const activeQuiz = dayQuizzes[activeDayContent.id];
  const progressPercent = Math.round((completedDays.length / curriculumData.length) * 100);
  const quizzesPassedCount = Object.values(quizResults).filter(Boolean).length;

  const filteredDays = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return curriculumData.filter((day) => {
      if (categoryFilter !== 'All' && day.category !== categoryFilter) return false;
      const done = completedDays.includes(day.id);
      if (completionFilter === 'done' && !done) return false;
      if (completionFilter === 'todo' && done) return false;
      if (!q) return true;
      return (
        day.title.toLowerCase().includes(q) ||
        day.description.toLowerCase().includes(q) ||
        day.day.toLowerCase().includes(q) ||
        day.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, categoryFilter, completionFilter, completedDays]);

  const groupedData = useMemo(() => {
    return filteredDays.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    }, {} as Record<string, DayContent[]>);
  }, [filteredDays]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-indigo-500/30 pt-16">
      {/* Top Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border-u bg-background/90 backdrop-blur-xl z-40">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Left: Mobile Menu + Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open 30-day curriculum sidebar"
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground bg-card-u rounded-xl border border-border-u shrink-0"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setActiveView('curriculum')}
              aria-label="AI Mastery in 30 Days Home"
              className="flex items-center gap-2.5 text-left min-w-0"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <div className="hidden sm:block truncate">
                <span className="font-bold tracking-tight text-foreground text-sm sm:text-base font-display block leading-tight truncate">
                  AI Mastery in 30 Days
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-u block leading-tight">
                  Open Curriculum · v2.0
                </span>
              </div>
            </button>
          </div>

          {/* Center: Mode Switcher */}
          <nav aria-label="Primary workspace navigation" className="flex items-center gap-1 p-1 rounded-xl bg-card-u border border-border-u shrink-0">
            <button
              type="button"
              onClick={() => setActiveView('curriculum')}
              className={cn(
                'min-h-[38px] px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5',
                activeView === 'curriculum'
                  ? 'bg-indigo-600 text-white'
                  : 'text-muted-u hover:text-foreground'
              )}
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Curriculum</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('lab')}
              className={cn(
                'min-h-[38px] px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5',
                activeView === 'lab'
                  ? 'bg-indigo-600 text-white'
                  : 'text-muted-u hover:text-foreground'
              )}
            >
              <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
              <span>AI Lab</span>
            </button>
          </nav>

          {/* Right: Setup Guide + Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSetupGuide(true)}
              className="hidden sm:inline-flex min-h-[40px] items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-u bg-card-u hover:border-indigo-500/40 text-xs font-medium text-foreground transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
              <span>Setup Guide</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-u hover:text-foreground bg-card-u rounded-xl transition-colors border border-border-u"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* 2px Progress Rail Anchor */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border-u overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Left Curriculum Sidebar */}
      <aside
        aria-label="30-day syllabus navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-sidebar-u border-r border-border-u flex flex-col transition-transform duration-300 ease-out shrink-0',
          activeView === 'curriculum' && 'md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Drawer Header */}
        <div className="md:hidden h-16 flex items-center justify-between px-4 border-b border-border-u shrink-0">
          <span className="font-semibold text-sm font-display">30-Day Field Index</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                setShowSetupGuide(true);
              }}
              className="min-h-[40px] px-2.5 py-1 rounded-lg border border-border-u bg-background text-xs font-medium text-foreground"
            >
              Setup
            </button>
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-u hover:text-foreground rounded-xl"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Progress Summary + Export */}
        <div className="p-4 border-b border-border-u shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-u font-mono block">
                Completion
              </span>
              <span className="text-sm font-semibold font-mono text-foreground">
                {completedDays.length}/{curriculumData.length} Days · {quizzesPassedCount} Quizzes
              </span>
            </div>
            <span className="text-sm font-mono font-bold text-indigo-500">
              {progressPercent}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-border-u rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search
              className="w-4 h-4 text-muted-u absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search days, MCP, RAG, Ollama..."
              aria-label="Search curriculum lessons"
              className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-xl border border-border-u bg-background text-xs text-foreground placeholder:text-muted-u focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {/* Category + Status Filter */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors',
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-background text-muted-u border-border-u hover:text-foreground'
                )}
              >
                {cat === 'Agents & Security' ? 'Agents' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex gap-1">
              {(['all', 'todo', 'done'] as CompletionFilter[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setCompletionFilter(st)}
                  className={cn(
                    'px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-colors',
                    completionFilter === st
                      ? 'bg-foreground text-background font-semibold'
                      : 'text-muted-u hover:text-foreground'
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleExportNotes}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              <Download className="w-3 h-3" aria-hidden="true" />
              Export .md
            </button>
          </div>
        </div>

        {/* Day Index List */}
        <div className="flex-1 overflow-y-auto py-3">
          {filteredDays.length === 0 ? (
            <div className="px-5 py-8 text-center text-xs text-muted-u space-y-2">
              <p>No lessons match your filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('All');
                  setCompletionFilter('all');
                }}
                className="text-indigo-500 underline underline-offset-2"
              >
                Reset filters
              </button>
            </div>
          ) : (
            Object.entries(groupedData).map(([category, days]) => {
              const CategoryIcon =
                category === 'Foundations'
                  ? Database
                  : category === 'Multimodal'
                    ? Sparkles
                    : category === 'Advanced'
                      ? Cpu
                      : ShieldCheck;

              return (
                <div key={category} className="mb-4">
                  <div className="px-4 flex items-center gap-2 mb-1.5">
                    <CategoryIcon className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
                    <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-u font-mono">
                      {category}
                    </h2>
                  </div>
                  <div className="flex flex-col">
                    {days.map((day) => {
                      const isActive = activeView === 'curriculum' && selectedDay === day.id;
                      const isCompleted = completedDays.includes(day.id);

                      return (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => {
                            setSelectedDay(day.id);
                            setActiveView('curriculum');
                            setSidebarOpen(false);
                          }}
                          className={cn(
                            'w-full min-h-[48px] text-left px-4 py-2 flex items-center justify-between gap-2 text-sm transition-colors border-l-2',
                            isActive
                              ? 'bg-indigo-500/10 text-foreground border-indigo-500 font-medium'
                              : 'text-muted-u hover:bg-card-u hover:text-foreground border-transparent'
                          )}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span
                              className={cn(
                                'font-mono text-[11px] mt-0.5 shrink-0',
                                isActive ? 'text-indigo-500 font-semibold' : 'text-muted-u/70'
                              )}
                            >
                              {String(day.id).padStart(2, '0')}
                            </span>
                            <span className="truncate text-xs sm:text-[13px] leading-snug">
                              {day.title}
                            </span>
                          </div>
                          {isCompleted && (
                            <CheckCircle2
                              className="w-4 h-4 text-emerald-500 shrink-0"
                              aria-label={`Day ${day.id} completed`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        <main ref={mainScrollRef} className="flex-1 overflow-y-auto">
          {activeView === 'lab' ? (
            <>
              <InteractiveLab activeTab={activeLabTab} onSelectTab={setActiveLabTab} />
              <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <SupportFooter />
              </div>
            </>
          ) : (
            <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-14">
              {/* Eyebrow Metadata Bar */}
              <div className="flex flex-wrap items-center gap-2 mb-5 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold">
                  {String(activeDayContent.id).padStart(2, '0')} / {curriculumData.length}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-card-u border border-border-u text-muted-u">
                  {activeDayContent.category}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-card-u border border-border-u text-muted-u inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {activeDayContent.durationMins} min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-card-u border border-border-u text-muted-u">
                  {activeDayContent.difficulty}
                </span>
              </div>

              {/* Lesson Markdown */}
              <div className="max-w-none">
                <Markdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground font-display leading-[1.12]">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-10 mb-4 text-foreground font-display border-l-4 border-indigo-500 pl-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xs font-bold tracking-[0.2em] mt-8 mb-3 text-indigo-600 dark:text-indigo-400 uppercase font-mono border-b border-border-u pb-2">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-foreground/80 leading-relaxed mb-5 text-base">{children}</p>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 font-medium"
                      >
                        {children}
                      </a>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-outside ml-5 mb-6 space-y-2 text-foreground/80 text-base leading-relaxed">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-outside ml-5 mb-6 space-y-2.5 text-foreground/80 text-base leading-relaxed">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="pl-1">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="my-8 p-5 border-l-4 border-indigo-500 bg-card-u rounded-r-xl text-foreground/90 [&>h3]:mt-0 [&>p]:mb-0">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    pre: ({ children }) => <>{children}</>,
                    code: ({ className, children }) => {
                      const raw = String(children ?? '').replace(/\n$/, '');
                      const isBlock = Boolean(className) || raw.includes('\n');
                      if (isBlock) {
                        return <CodeBlock codeText={raw} />;
                      }
                      return (
                        <code className="font-mono text-[13px] bg-card-u border border-border-u px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-300">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {activeDayContent.content}
                </Markdown>
              </div>

              {/* Contextual Interactive Lab Launch Card */}
              <div className="mt-10 rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.06] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400 font-semibold">
                    <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Recommended Hands-On Lab for Day {activeDayContent.id}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {LAB_LABELS[activeDayContent.recommendedLab].title}
                  </p>
                  <p className="text-xs text-muted-u">
                    {LAB_LABELS[activeDayContent.recommendedLab].summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openLabTab(activeDayContent.recommendedLab)}
                  className="shrink-0 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  <span>Open Lab</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Interactive Per-Day Knowledge Check */}
              {activeQuiz && (
                <DayQuiz
                  quiz={activeQuiz}
                  passed={quizResults[activeDayContent.id]}
                  onRecordResult={handleRecordQuiz}
                />
              )}

              {/* Persistent Per-Day Study Notes & Journal */}
              <DayJournal
                dayId={activeDayContent.id}
                value={journalNotes[activeDayContent.id] ?? ''}
                onChange={handleNoteChange}
                onExportAll={handleExportNotes}
              />

              {/* Completion & Day Navigation Bar */}
              <div className="mt-10 pt-6 border-t border-border-u flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleDayCompletion(activeDayContent.id)}
                  className={cn(
                    'min-h-[46px] px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors text-sm',
                    completedDays.includes(activeDayContent.id)
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-foreground text-background hover:opacity-90'
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  {completedDays.includes(activeDayContent.id)
                    ? `Day ${activeDayContent.id} Completed`
                    : `Mark Day ${activeDayContent.id} Complete`}
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedDay(Math.max(1, activeDayContent.id - 1))}
                    disabled={activeDayContent.id === 1}
                    aria-label="Previous day"
                    className="flex-1 sm:flex-none min-h-[46px] px-4 py-2.5 rounded-xl border border-border-u bg-card-u text-foreground hover:border-indigo-500/40 disabled:opacity-35 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedDay(Math.min(curriculumData.length, activeDayContent.id + 1))
                    }
                    disabled={activeDayContent.id === curriculumData.length}
                    aria-label="Next day"
                    className="flex-1 sm:flex-none min-h-[46px] px-5 py-2.5 rounded-xl border border-border-u bg-card-u text-foreground hover:border-indigo-500/40 disabled:opacity-35 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
                  >
                    <span>Next Day</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <SupportFooter />
            </article>
          )}
        </main>
      </div>

      {/* On-Demand Setup Guide Modal */}
      <AnimatePresence>
        {showSetupGuide && <OnboardingModal onClose={() => setShowSetupGuide(false)} />}
      </AnimatePresence>
    </div>
  );
}
