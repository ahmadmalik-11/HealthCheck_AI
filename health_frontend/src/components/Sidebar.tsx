import {
  Activity,
  BarChart3,
  Info,
  LayoutDashboard,
  Menu,
  SearchCheck,
  X,
} from 'lucide-react';
import type { PageId } from '../types/classification';
import { Logo } from './Logo';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  mobileOpen: boolean;
  onMobileToggle: (open: boolean) => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'check', label: 'Check a Claim', icon: SearchCheck },
  { id: 'evaluation', label: 'Evaluation & Performance', icon: BarChart3 },
  { id: 'about', label: 'About Project', icon: Info },
];

export function Sidebar({
  activePage,
  onNavigate,
  mobileOpen,
  onMobileToggle,
}: SidebarProps) {
  const handleSelect = (page: PageId) => {
    onNavigate(page);
    onMobileToggle(false);
  };

  return (
    <>
      {/* Mobile Top Navigation Bar (kept compact under 15% mobile viewport height) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => onMobileToggle(!mobileOpen)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-[#0F2942] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-[1px] lg:hidden"
          onClick={() => onMobileToggle(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-slate-200 bg-slate-50/75 transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 bg-white shadow-xl' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-5">
          <Logo />
          <button
            type="button"
            onClick={() => onMobileToggle(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#0F2942] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-200/80'
                    : 'text-slate-600 hover:bg-white hover:text-[#0F2942]'
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    isActive ? 'text-teal-700' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-200/80 px-5 py-4">
          <div className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-500">
            <Activity className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />
            <div>
              <p className="font-medium text-[#0F2942]">TF-IDF + LinearSVC</p>
              <p className="mt-0.5 text-slate-500">Three-class claim verification</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
