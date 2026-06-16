import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  // Đã sửa: Bọc hàm t() vào useMemo để tự động cập nhật chữ trên menu khi đổi ngôn ngữ
  const navItems = useMemo(() => [
    { href: '/', label: t('nav.home') || 'Home' },
    { href: '/explore', label: t('nav.explore') || 'Explore' },
    { href: '/knowledge', label: t('nav.knowledge') || 'Knowledge' },
    { href: '/journey', label: t('nav.journey') || 'Journey' },
    { href: '/diagnosis', label: t('nav.diagnosis') || 'Diagnosis' },
  ], [t]); // Thêm t vào dependency array để re-render khi ngôn ngữ thay đổi

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';
  const headerBg = isHomePage && !isScrolled
    ? 'bg-white/55 border-white/50 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.2)]'
    : 'bg-white/75 border-white/70 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.25)]';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4">
        <div className={`mx-auto max-w-7xl rounded-[1.75rem] border backdrop-blur-2xl transition-all duration-300 ${headerBg}`}>
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img
                  src={LOGO_URL}
                  alt="VISTA"
                  className="h-10 w-10 rounded-xl object-cover"
                />
              </span>
              <div className="leading-tight">
                {/* <p className="text-[11px] uppercase tracking-[0.3em] text-sky-700">VISTA</p> */}
                {/* Đã sửa: Chuyển ngữ câu Slogan phụ dưới Logo
                <p className="text-sm text-slate-500">{t('nav.slogan') || 'Eye care and eyewear platform'}</p> */}
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50/90 p-1 text-sm font-medium text-slate-600">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const baseClass = `rounded-full px-4 py-2 transition-all duration-200 ${isActive ? 'bg-white text-slate-950 shadow-sm' : 'hover:bg-white hover:text-slate-900'}`;

                return (
                  <Link key={item.href} to={item.href} className={baseClass}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'vi' | 'en' | 'km')}
                  aria-label="Language"
                  className="h-11 appearance-none rounded-full border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition-colors hover:border-slate-300 cursor-pointer"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                  <option value="km">ភាសាខ្មែរ</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
                aria-label="Toggle menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-slate-950/25 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-4 right-4 top-20 rounded-[1.75rem] border border-white/70 bg-white/85 p-4 shadow-[0_24px_90px_-40px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">{t('nav.menu') || 'Menu'}</p>
                <p className="text-sm text-slate-500">{t('nav.navigate') || 'Navigate VISTA'}</p>
              </div>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                Premium UI
              </span>
            </div>

            <nav className="grid gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const itemClass = `flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${isActive ? 'border-slate-900 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`;

                return (
                  <Link key={item.href} to={item.href} className={itemClass} onClick={() => setIsMobileMenuOpen(false)}>
                    <span>{item.label}</span>
                    <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M7.21 14.77a.75.75 0 01.02-1.06L10.94 10 7.23 6.29a.75.75 0 111.06-1.06l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 01-1.08.02z" />
                    </svg>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{t('nav.language') || 'Language'}</div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'vi' | 'en' | 'km')}
                aria-label="Language"
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                <option value="km">ភាសាខ្មែរ</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
}