import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const TITLES = {
  '/': 'Dashboard',
  '/sessions': 'Study Sessions',
  '/analytics': 'Analytics',
  '/calendar': 'Study Calendar',
  '/goals': 'Goals',
  '/pomodoro': 'Pomodoro Timer',
  '/profile': 'Profile & Settings',
};

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] || 'StudyTracker';

  return (
    <div className="flex h-screen overflow-hidden bg-paper dark:bg-ink-950">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
