import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../organisms/Header';
import { Footer } from '../../organisms';

const AdminLayout = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Initialize sidebarCollapsed from localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const navigation = [
    {
      name: t('admin.dashboard.title'),
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      current: location.pathname === '/admin'
    },
    {
      name: t('admin.room.title'),
      href: '/admin/rooms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      current: location.pathname === '/admin/rooms'
    },
    {
      name: t('admin.dashboard.items.bookings'),
      href: '/admin/bookings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      current: location.pathname === '/admin/bookings'
    },
    {
      name: t('admin.dashboard.items.users'),
      href: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      current: location.pathname === '/admin/users'
    },
    {
      name: t('admin.dashboard.items.analytics'),
      href: '/admin/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      current: location.pathname === '/admin/analytics'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/10 flex flex-col">
      {/* Header del home */}
      <Header />
      
      <div className="pt-16 flex flex-grow">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-600/75 backdrop-blur-sm"></div>
          </div>
        )}

        {/* Sidebar */}
         <div className={`
           fixed top-16 left-0 bottom-0 z-50 bg-white/98 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-300/60 dark:border-gray-700/50 shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
           ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
           w-64
         `}>
           <div className="flex flex-col h-full">
             {/* Collapse button for desktop */}
             <div className="hidden lg:flex justify-end p-2 border-b border-gray-200 dark:border-gray-700/50">
               <button
                 className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition-all duration-200 transform hover:scale-105"
                 onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
               >
                 <span className="sr-only">{sidebarCollapsed ? t('common.expand') : t('common.collapse')}</span>
                 <svg className={`h-5 w-5 transform transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                 </svg>
               </button>
             </div>
             
             {/* Navigation */}
             <nav className="flex-1 px-4 py-6 space-y-2">
               <button
                 className="lg:hidden mb-4 p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 self-end transition-all duration-200 transform hover:scale-105"
                 onClick={() => setSidebarOpen(false)}
               >
                 <span className="sr-only">{t('common.close')}</span>
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
               
               {navigation.map((item) => (
                 <Link
                   key={item.name}
                   to={item.href}
                   className={`
                     flex items-center text-sm font-medium rounded-xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg
                     ${sidebarCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}
                     ${item.current
                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                       : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
                     }
                   `}
                   onClick={() => setSidebarOpen(false)}
                   title={sidebarCollapsed ? item.name : ''}
                 >
                   <span className={`${sidebarCollapsed ? 'mr-0' : 'mr-3'} transition-all duration-200 ${item.current ? 'text-white' : ''}`}>{item.icon}</span>
                   <span className={`transition-all duration-200 ${sidebarCollapsed ? 'lg:hidden' : ''} ${item.current ? 'font-semibold' : ''}`}>{item.name}</span>
                 </Link>
               ))}
             </nav>
           </div>
         </div>

         {/* Main content area */}
         <div className="flex-1 min-h-screen">
           {/* Mobile menu button */}
           <div className="lg:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gradient-to-r from-gray-200/50 via-blue-200/30 to-purple-200/20 dark:from-gray-700/50 dark:via-blue-700/30 dark:to-purple-700/20">
             <div className="flex items-center h-12 px-4">
               <button
                 className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-gray-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-700/50 dark:text-gray-300 dark:hover:bg-blue-900/30 transition-all duration-200"
                 onClick={() => setSidebarOpen(true)}
               >
                 <span className="sr-only">{t('common.open')}</span>
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
               </button>
               <h1 className="ml-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                 {t('admin.title')}
               </h1>
             </div>
           </div>

           {/* Page content */}
           <main className="min-h-full bg-transparent">
             {children}
           </main>
         </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;