import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../organisms/Header';
import { Footer } from '../../organisms';
import MobileNotSupported from '../../molecules/MobileNotSupported';
import useDeviceDetection from '../../../hooks/useDeviceDetection';

const AdminLayout = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAdminSupported } = useDeviceDetection();
  
  // Initialize sidebarCollapsed from localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Show mobile not supported message if device is not supported
  if (!isAdminSupported) {
    return <MobileNotSupported />;
  }

  const navigationSections = [
    {
      title: t('admin.navigation.overview'),
      items: [
        {
          name: t('admin.dashboard.title'),
          href: '/admin',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          current: location.pathname === '/admin'
        },
        {
          name: t('admin.navigation.analytics'),
          href: '/admin/analytics',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          current: location.pathname === '/admin/analytics'
        }
      ]
    },
    {
      title: t('admin.navigation.hotelManagement'),
      items: [
        {
          name: t('admin.navigation.rooms'),
          href: '/admin/rooms',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
          current: location.pathname === '/admin/rooms'
        },
        {
          name: t('admin.navigation.bookings'),
          href: '/admin/bookings',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          current: location.pathname === '/admin/bookings'
        },
        {
          name: t('admin.navigation.availability'),
          href: '/admin/availability',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          current: location.pathname === '/admin/availability'
        }
      ]
    },
    {
      title: t('admin.navigation.userManagement'),
      items: [
        {
          name: t('admin.navigation.customers'),
          href: '/admin/customers',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          ),
          current: location.pathname === '/admin/customers'
        },
        {
          name: t('admin.navigation.staff'),
          href: '/admin/staff',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          current: location.pathname === '/admin/staff'
        }
      ]
    },
    {
      title: t('admin.navigation.configuration'),
      items: [
        {
          name: t('admin.navigation.settings'),
          href: '/admin/settings',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          current: location.pathname === '/admin/settings'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header del home */}
      <Header />
      
      <div className="pt-16 flex flex-grow">
        {/* Sidebar - Desktop Only */}
         <div className={`
           fixed top-16 left-0 bottom-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-300/60 dark:border-gray-700/50 shadow-xl transition-all duration-300 ease-in-out
           ${sidebarCollapsed ? 'w-16' : 'w-64'}
         `}>
           <div className="flex flex-col h-full">
             {/* Collapse button */}
             <div className="flex justify-end p-2 border-b border-gray-200 dark:border-gray-700/50">
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
             <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
               
               {navigationSections.map((section, sectionIndex) => (
                 <div key={section.title} className="space-y-2">
                   {!sidebarCollapsed && (
                     <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                       {section.title}
                     </h3>
                   )}
                   <div className="space-y-1">
                     {section.items.map((item) => (
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
                           title={sidebarCollapsed ? item.name : ''}
                         >
                           <span className={`${sidebarCollapsed ? 'mr-0' : 'mr-3'} transition-all duration-200 ${item.current ? 'text-white' : ''}`}>{item.icon}</span>
                           <span className={`transition-all duration-200 ${sidebarCollapsed ? 'hidden' : ''} ${item.current ? 'font-semibold' : ''}`}>{item.name}</span>
                         </Link>
                     ))}
                   </div>
                   {sectionIndex < navigationSections.length - 1 && !sidebarCollapsed && (
                     <div className="border-t border-gray-200 dark:border-gray-700/50 pt-2"></div>
                   )}
                 </div>
               ))}
             </nav>
           </div>
         </div>

         {/* Main content area */}
         <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
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