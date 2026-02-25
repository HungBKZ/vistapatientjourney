import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

type NavItem = {
  path: string;
  labelKey: string;
  icon: React.ReactElement;
  highlight?: boolean;
  external?: boolean;
};

const navItems: NavItem[] = [
  {
    path: '/',
    labelKey: 'nav.home',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/explore',
    labelKey: 'nav.explore',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    path: '/journey',
    labelKey: 'nav.journey',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2m0 18l6-3m-6 3V2m6 15l5.447 2.724A1 1 0 0021 19.382V8.618a1 1 0 00-.553-.894L15 5m0 12V5m0 0L9 2" />
      </svg>
    ),
    highlight: true,
  },
  {
    path: 'https://vista-camera-eyes.vercel.app/eye-simulation.html',
    labelKey: 'nav.knowledge',
    external: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    path: '/quiz',
    labelKey: 'nav.quiz',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

export default function MobileNavBar() {
  const location = useLocation();
  const { t } = useLanguage();

  // return (
  //   <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-bottom">
  //     <div className="flex justify-around items-center h-16 px-2">
  //       {navItems.map((item) => {
  //         const isActive = location.pathname === item.path;
          
  //         if (item.external) {
  //           return (
  //             <a
  //               key={item.path}
  //               href={item.path}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               onClick={(e) => {
  //                 e.preventDefault();
  //                 window.open(item.path, '_blank', 'noopener,noreferrer');
  //               }}
  //               className={`flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors ${
  //                 item.highlight
  //                   ? 'relative -top-3'
  //                   : ''
  //               }`}
  //             >
  //               {item.highlight ? (
  //                 <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-lg ${
  //                   isActive 
  //                     ? 'bg-sky-500 text-white' 
  //                     : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
  //                 }`}>
  //                   {item.icon}
  //                 </div>
  //               ) : (
  //                 <div className={`${isActive ? 'text-sky-500' : 'text-gray-500'}`}>
  //                   {item.icon}
  //                 </div>
  //               )}
  //               <span className={`text-xs mt-1 ${
  //                 item.highlight 
  //                   ? 'text-sky-600 font-medium' 
  //                   : isActive 
  //                     ? 'text-sky-500 font-medium' 
  //                     : 'text-gray-500'
  //               }`}>
  //                 {t(item.labelKey)}
  //               </span>
  //             </a>
  //           );
  //         }
          
  //         return (
  //           <Link
  //             key={item.path}
  //             to={item.path}
  //             className={`flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors ${
  //               item.highlight
  //                 ? 'relative -top-3'
  //                 : ''
  //             }`}
  //           >
  //             {item.highlight ? (
  //               <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-lg ${
  //                 isActive 
  //                   ? 'bg-sky-500 text-white' 
  //                   : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
  //               }`}>
  //                 {item.icon}
  //               </div>
  //             ) : (
  //               <div className={`${isActive ? 'text-sky-500' : 'text-gray-500'}`}>
  //                 {item.icon}
  //               </div>
  //             )}
  //             <span className={`text-xs mt-1 ${
  //               item.highlight 
  //                 ? 'text-sky-600 font-medium' 
  //                 : isActive 
  //                   ? 'text-sky-500 font-medium' 
  //                   : 'text-gray-500'
  //             }`}>
  //               {t(item.labelKey)}
  //             </span>
  //           </Link>
  //         );
  //       })}
  //     </div>
  //   </nav>
  // );
}
