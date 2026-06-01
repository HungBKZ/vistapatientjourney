import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

type NavItem = {
  path: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
};

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/explore',
    label: 'Explore',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    ),
  },
  {
    path: '/knowledge',
    label: 'Knowledge',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    path: '/journey',
    label: 'Journey',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2m0 18l6-3m-6 3V2m6 15l5.447 2.724A1 1 0 0021 19.382V8.618a1 1 0 00-.553-.894L15 5m0 12V5m0 0L9 2" />
      </svg>
    ),
  },
];

export default function MobileNavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
      <div className="mx-auto max-w-xl rounded-[1.75rem] border border-white/70 bg-white/80 px-2 py-2 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const isActive = !item.external && location.pathname === item.path;
            const base = `flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-all ${isActive ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`;

            const content = (
              <>
                <span className={isActive ? 'scale-105' : ''}>{item.icon}</span>
                <span className="leading-none">{item.label}</span>
              </>
            );

            if (item.external) {
              return (
                <a key={item.path} href={item.path} target="_blank" rel="noreferrer" className={base}>
                  {content}
                </a>
              );
            }

            return (
              <Link key={item.path} to={item.path} className={base}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
