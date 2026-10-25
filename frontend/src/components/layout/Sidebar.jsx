import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  CalendarDays,
  Target,
  Timer,
  UserCircle,
  GraduationCap,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/sessions', label: 'Sessions', icon: BookOpen },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/60 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink-950 transition-transform duration-200 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine-500 text-white">
              <GraduationCap size={19} strokeWidth={2.25} />
            </div>
            <span className="font-display text-lg font-semibold text-paper-100">
              StudyTracker
            </span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-ink-800 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-pine-500 text-white'
                    : 'text-slate-300 hover:bg-ink-800 hover:text-paper-100'
                )
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-800 px-5 py-4">
          <p className="text-xs text-slate-500">Keep the streak alive. Every session counts.</p>
        </div>
      </aside>
    </>
  );
}
