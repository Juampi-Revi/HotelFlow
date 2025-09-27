import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../organisms/Header';

const AdminLayout = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Inicializar sidebarCollapsed desde localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Guardar en localStorage cuando cambie el estado
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header del home */}
      <Header />
      
      <div className="pt-16 flex min-h-screen">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
          </div>
        )}

        {/* Sidebar */}
         <div className={`
           fixed top-16 left-0 bottom-0 z-50 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
           ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
           w-64
         `}>
           <div className="flex flex-col h-full">
             {/* Collapse button for desktop */}
             <div className="hidden lg:flex justify-end p-2 border-b border-gray-200 dark:border-gray-700">
               <button
                 className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                 className="lg:hidden mb-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 self-end"
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
                     flex items-center text-sm font-medium rounded-md transition-colors duration-200 group
                     ${sidebarCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2'}
                     ${item.current
                       ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                     }
                   `}
                   onClick={() => setSidebarOpen(false)}
                   title={sidebarCollapsed ? item.name : ''}
                 >
                   <span className={`${sidebarCollapsed ? 'mr-0' : 'mr-3'} transition-all duration-200`}>{item.icon}</span>
                   <span className={`transition-all duration-200 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
                 </Link>
               ))}
             </nav>
           </div>
         </div>

         {/* Main content area */}
         <div className="flex-1 min-h-screen">
           {/* Mobile menu button */}
           <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
             <div className="flex items-center h-12 px-4">
               <button
                 className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                 onClick={() => setSidebarOpen(true)}
               >
                 <span className="sr-only">{t('common.open')}</span>
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
               </button>
               <h1 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                 {t('admin.title')}
               </h1>
             </div>
           </div>

           {/* Page content */}
           <main className="min-h-full bg-gray-50 dark:bg-gray-900">
             {children}
           </main>
         </div>
      </div>
    </div>
  );
};

export default AdminLayout;