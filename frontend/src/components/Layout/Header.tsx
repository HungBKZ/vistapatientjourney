import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg';

const navItems = [
  { href: '/', label: 'Trang chủ' },
  // { href: '/services', label: 'Dịch vụ' },
  // { href: '/booking', label: 'Đặt lịch' },
  { href: '/knowledge', label: 'Mắt ảo' },
  { href: '/podcast', label: 'Podcast' },
  { href: '/quiz', label: 'Quiz' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    ? 'bg-transparent' 
    : 'bg-white shadow-sm';
  const textColor = isHomePage && !isScrolled ? 'text-white' : 'text-gray-700';
  const logoTextColor = isHomePage && !isScrolled ? 'text-white' : 'text-blue-600';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={LOGO_URL}
                alt="VISTA"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className={`text-xl font-bold ${logoTextColor}`}>
                VISTA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : `${textColor} hover:bg-gray-100 hover:text-gray-900`
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              {/* <Link 
                to="/booking" 
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Đặt lịch khám
              </Link> */}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${textColor}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/20" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-20 left-4 right-4 bg-white rounded-xl shadow-xl p-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-4 py-3 rounded-lg font-medium ${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 mt-3">
                <Link 
                  to="/booking" 
                  className="block w-full text-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg"
                >
                  Đặt lịch khám
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
