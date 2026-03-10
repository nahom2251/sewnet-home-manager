import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

const navItems = [
  { path: '/dashboard', key: 'nav.dashboard' },
  { path: '/apartments', key: 'nav.apartments' },
  { path: '/tenants', key: 'nav.tenants' },
  { path: '/billing', key: 'nav.billing' },
  { path: '/reports', key: 'nav.reports' },
  { path: '/settings', key: 'nav.settings' },
];

export default function AppLayout() {
  const { t, language, setLanguage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card shrink-0">
        <div className="p-5 border-b border-border">
          <span className="text-xl font-semibold text-foreground tracking-tight">AS</span>
          <span className="text-xs block text-muted-foreground mt-0.5">Apartment Manager</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2.5 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="w-full px-3 py-2 text-xs text-muted-foreground hover:bg-secondary rounded-md transition-colors"
          >
            {language === 'en' ? 'አማርኛ' : 'English'}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-semibold text-foreground">AS</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="px-3 py-1.5 text-sm border border-border rounded-md text-foreground"
        >
          {mobileOpen ? t('common.close') : 'Menu'}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="mt-14 bg-card border-b border-border p-4 space-y-1" onClick={e => e.stopPropagation()}>
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 text-sm rounded-md ${
                    isActive ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
            <button
              onClick={() => { setLanguage(language === 'en' ? 'am' : 'en'); setMobileOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs text-muted-foreground"
            >
              {language === 'en' ? 'አማርኛ' : 'English'}
            </button>
          </div>
        </div>
      )}

      {/* Main workspace */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        <div className="max-w-5xl mx-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
