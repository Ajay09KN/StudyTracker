import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ title, onOpenMobileMenu }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const initials = (user?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-paper/90 px-4 py-4 backdrop-blur dark:border-ink-700 dark:bg-ink-950/90 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-ink-800 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-display text-xl font-semibold text-ink dark:text-paper-100 sm:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition-colors hover:bg-slate-100 dark:border-ink-700 dark:text-slate-300 dark:hover:bg-ink-800"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-slate-100 dark:border-ink-700 dark:hover:bg-ink-800"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ backgroundColor: user?.avatarColor || '#2F6F5E' }}
            >
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-ink dark:text-paper-100 sm:inline">
              {user?.name}
            </span>
            <ChevronDown size={15} className="text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-paper-100 shadow-card dark:border-ink-700 dark:bg-ink-900 dark:shadow-card-dark">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-ink hover:bg-slate-50 dark:text-paper-200 dark:hover:bg-ink-800"
              >
                <UserCircle size={16} /> Profile & settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="flex w-full items-center gap-2.5 border-t border-slate-200 px-4 py-2.5 text-left text-sm text-coral-500 hover:bg-coral-50 dark:border-ink-700 dark:hover:bg-coral-500/10"
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
