import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { curriculumData, DayContent } from './data/curriculum';
import { 
  CheckCircle2, ChevronRight, Menu, X, BookOpen, ChevronLeft, Moon, Sun,
  Cpu, Sparkles, BrainCircuit, Globe, ShieldCheck, Zap, Database
} from 'lucide-react';
import { cn } from './lib/utils';
import { OnboardingModal } from './components/OnboardingModal';
import { DesktopDecor } from './components/DesktopDecor';

export default function App() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load state and handle theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('ai-mastery-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark');
    }

    const saved = localStorage.getItem('ai-mastery-completed');
    if (saved) {
      try {
        setCompletedDays(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    const onboarded = localStorage.getItem('ai-mastery-onboarded');
    if (!onboarded) {
      setShowOnboarding(true);
    }
  }, []);

  // Sync theme to document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ai-mastery-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleCloseOnboarding = () => {
    localStorage.setItem('ai-mastery-onboarded', 'true');
    setShowOnboarding(false);
  };

  const toggleDayCompletion = (id: number) => {
    setCompletedDays((prev) => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter((d) => d !== id);
      } else {
        next = [...prev, id];
      }
      localStorage.setItem('ai-mastery-completed', JSON.stringify(next));
      return next;
    });
  };

  const activeDayContent = curriculumData.find((d) => d.id === selectedDay) || curriculumData[0];
  const progressPercent = Math.round((completedDays.length / curriculumData.length) * 100);

  // Group days by category for the sidebar
  const groupedData = curriculumData.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, DayContent[]>);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-indigo-500/30 pt-16 md:pt-20">
      
      {/* Desktop & Mobile Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 border-b border-border-u bg-background/80 backdrop-blur-xl z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="md:hidden w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-foreground hidden sm:inline md:text-xl font-display uppercase italic">AI Expert 30</span>
        </div>

        {/* Desktop Resource Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-u hover:text-indigo-600 dark:hover:text-white transition-colors">AI Studio</a>
          <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-u hover:text-indigo-600 dark:hover:text-white transition-colors">Hugging Face</a>
          <a href="https://replicate.com/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-u hover:text-indigo-600 dark:hover:text-white transition-colors">Replicate</a>
          <a href="https://docs.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-u hover:text-indigo-600 dark:hover:text-white transition-colors">Claude Docs</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
             className="p-2.5 text-muted-u hover:bg-card-u rounded-full transition-colors border border-border-u"
             title="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="md:hidden p-2.5 text-muted-u bg-card-u rounded-full border border-border-u"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Sidebar background overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-72 bg-sidebar-u border-r border-border-u flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:transform-none shadow-2xl md:shadow-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="md:hidden h-20 flex items-center justify-between px-6 border-b border-border-u shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Expert 30</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              className="md:hidden text-muted-u hover:text-foreground p-2 rounded-full hover:bg-card-u transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Progress */}
        <div className="px-6 py-5 border-b border-border-u shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wider text-muted-u font-mono">Progress</span>
            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-border-u rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none rotate-12">
             <Cpu className="w-64 h-64 text-indigo-500" />
          </div>
          {Object.entries(groupedData).map(([category, days]) => {
            const CategoryIcon = category === "Foundations" ? Database : 
                               category === "Multimodal" ? Sparkles :
                               category === "Advanced" ? Cpu : ShieldCheck;
            
            return (
              <div key={category} className="mb-6 relative z-10">
                <div className="px-6 flex items-center gap-2 mb-2">
                  <CategoryIcon className="w-3 h-3 text-indigo-500/60" />
                  <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-u">{category}</h4>
                </div>
                <div className="flex flex-col">
                  {days.map((day) => {
                  const isActive = selectedDay === day.id;
                  const isCompleted = completedDays.includes(day.id);
                  
                  return (
                    <button
                      key={day.id}
                      onClick={() => {
                        setSelectedDay(day.id);
                        setSidebarOpen(false); // close mobile sidebar on select
                      }}
                      className={cn(
                        "w-full text-left px-6 py-2.5 flex items-center justify-between text-sm transition-all duration-200 relative group",
                        isActive 
                          ? "bg-indigo-500/10 text-brand-500 dark:text-white border-l-2 border-indigo-500 shadow-[inset_4px_0_12px_rgba(99,102,241,0.05)]" 
                          : "text-muted-u hover:bg-card-u hover:text-foreground border-l-2 border-transparent"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-bg"
                          className="absolute inset-0 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.1)] pointer-events-none"
                        />
                      )}
                      <div className="flex flex-col gap-0.5 truncate pr-2 relative z-10">
                        <span className={cn("font-mono text-[10px] uppercase tracking-wider opacity-50", isActive && "text-brand-500 opacity-100")}>Day {day.id}</span>
                        <span className="truncate font-medium">{day.title}</span>
                      </div>
                      <div className="relative z-10">
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );})}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        <DesktopDecor />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          {/* Floating AI Decoration Icons */}
          <div className="absolute top-20 right-10 opacity-[0.05] pointer-events-none animate-float hidden lg:block">
            <Globe className="w-32 h-32 text-indigo-500" />
          </div>
          <div className="absolute bottom-20 left-10 opacity-[0.05] pointer-events-none animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
            <Sparkles className="w-48 h-48 text-indigo-500" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto px-6 py-12 md:py-20"
            >
              <div className="mb-4 inline-flex items-center gap-3 px-4 py-2 bg-card-u rounded-2xl border border-border-u text-[11px] font-mono tracking-widest uppercase text-muted-u shadow-sm relative group">
                <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-colors rounded-2xl" />
                <BrainCircuit className="w-4 h-4 text-indigo-500 animate-float" />
                <span className="relative z-10">{activeDayContent.category} — Day {activeDayContent.id}</span>
              </div>

              <div className="mt-8 prose prose-slate dark:prose-invert max-w-none">
                <Markdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter mb-10 text-foreground font-display uppercase leading-tight" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-16 mb-6 text-foreground/95 border-l-8 border-indigo-500 pl-6 font-display uppercase" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-[11px] font-bold tracking-[0.4em] mt-12 mb-4 text-brand-500 uppercase font-display border-b border-indigo-500/10 pb-2 flex items-center justify-between" {...props}><span className="flex-1">{props.children}</span><Zap className="w-3 h-3 text-amber-500 ml-2" /></h3>,
                    p: ({node, ...props}) => <p className="text-foreground/70 leading-relaxed mb-8 text-lg font-light" {...props} />,
                    a: ({node, ...props}) => <a className="text-brand-500 hover:text-indigo-400 underline underline-offset-4 decoration-indigo-500/30 transition-colors" {...props} target="_blank" rel="noopener noreferrer" />,
                    ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 mb-8 space-y-3 text-foreground/70 font-light" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote className="my-10 p-8 border-l-2 border-indigo-500 bg-indigo-500/5 rounded-r-2xl italic text-foreground/80 shadow-[0_0_50px_-12px_rgba(99,102,241,0.05)]" {...props} />
                    ),
                    strong: ({node, ...props}) => <strong className="font-semibold text-foreground/95" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-foreground/80" {...props} />,
                    code: ({node, inline, ...props}: any) => 
                      inline ? (
                        <code className="font-mono text-sm bg-card-u px-1.5 py-0.5 rounded text-brand-500 dark:text-white" {...props} />
                      ) : (
                        <div className="my-6 rounded-lg overflow-hidden border border-border-u bg-card-u">
                          <div className="bg-background px-4 py-2 border-b border-border-u flex items-center text-xs font-mono text-muted-u uppercase">
                            Snippet Example
                          </div>
                          <pre className="p-4 overflow-x-auto text-sm text-foreground/80">
                            <code className="font-mono" {...props} />
                          </pre>
                        </div>
                      ),
                  }}
                >
                  {activeDayContent.content}
                </Markdown>
              </div>

              {/* Action Buttons */}
              <div className="mt-16 pt-8 border-t border-border-u flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => toggleDayCompletion(activeDayContent.id)}
                  className={cn(
                    "w-full sm:w-auto px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all text-sm",
                    completedDays.includes(activeDayContent.id)
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-white/90 shadow-lg"
                  )}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {completedDays.includes(activeDayContent.id) ? "Mark as Incomplete" : "Complete Day " + activeDayContent.id}
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedDay(Math.max(1, activeDayContent.id - 1))}
                    disabled={activeDayContent.id === 1}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-full border border-border-u text-muted-u hover:text-foreground hover:bg-card-u disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedDay(Math.min(curriculumData.length, activeDayContent.id + 1))}
                    disabled={activeDayContent.id === curriculumData.length}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-full border border-border-u text-muted-u hover:text-foreground hover:bg-card-u disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="text-sm font-medium">Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
      </AnimatePresence>
    </div>
  );
}
