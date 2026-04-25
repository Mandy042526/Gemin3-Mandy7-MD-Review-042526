import React, { useEffect } from 'react';
import { useAppStore } from '@/src/store';
import { useTranslation } from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';
import { LayoutDashboard, NotebookPen, FileSearch, Settings as SettingsIcon } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppLayout({ children, activeTab, setActiveTab }: AppLayoutProps) {
  const { theme, language } = useAppStore();
  const t = useTranslation(language);

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    root.className = '';
    // Add the current theme class
    if (theme !== 'light') {
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'notekeeper', label: t('noteKeeper'), icon: NotebookPen },
    { id: 'regulatory', label: t('regulatoryReview'), icon: FileSearch },
    { id: 'settings', label: t('settings'), icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            MedDev Reviewer
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground text-center">
            Agentic Medical Device Reviewer v2
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold">
            {navItems.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="flex items-center space-x-4">
             {/* Status indicators could go here */}
             <div className="flex items-center space-x-2 text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-muted-foreground">System Ready</span>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
