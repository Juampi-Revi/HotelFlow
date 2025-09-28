import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/templates/AdminLayout/AdminLayout';

const Admin = () => {
  const { t } = useTranslation();

  const dashboardCards = [
    {
      title: t('admin.rooms.title'),
      description: t('admin.rooms.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      href: '/admin/rooms',
      color: 'from-slate-600 to-slate-700',
      bgColor: 'bg-slate-50 dark:bg-slate-800/50',
      borderColor: 'border-slate-200 dark:border-slate-700',
      stats: '12 rooms'
    },
    {
      title: t('admin.dashboard.items.bookings'),
      description: t('admin.dashboard.items.bookingsDesc'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/admin/bookings',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      stats: '24 active bookings'
    },
    {
      title: t('admin.dashboard.items.users'),
      description: t('admin.dashboard.items.usersDesc'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      href: '/admin/customers',
      color: 'from-emerald-600 to-emerald-700',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      stats: '156 users'
    },
    {
      title: t('admin.dashboard.items.analytics'),
      description: t('admin.dashboard.items.analyticsDesc'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: '/admin/analytics',
      color: 'from-indigo-600 to-indigo-700',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      stats: '85% occupancy'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'booking',
      message: 'New booking for room 101',
      time: '5 minutes ago',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 2,
      type: 'room',
      message: 'Room 205 marked as available',
      time: '15 minutes ago',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 3,
      type: 'user',
      message: 'New user registered',
      time: '30 minutes ago',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {t('admin.dashboard.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-2xl">
                {t('admin.dashboard.welcome')}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right space-y-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardCards.map((card, index) => (
              <Link
                key={index}
                to={card.href}
                className={`group relative p-6 rounded-xl ${card.bgColor} border ${card.borderColor} shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden`}
              >
                {/* Subtle gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all duration-300`}>
                      {card.icon}
                    </div>
                    <svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-300 transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                    {card.description}
                  </p>
                  <p className={`text-sm font-semibold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                    {card.stats}
                  </p>
                </div>
                
                {/* Subtle border accent */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
              </Link>
            ))}
          </div>

          {/* Recent Activity & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('admin.dashboard.recentActivity')}
                </h2>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                  Ver todo
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0 shadow-sm">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1 leading-relaxed">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('admin.dashboard.quickStats')}
                </h2>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                  Actualizar
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{t('admin.dashboard.stats.totalRooms')}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    12
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{t('admin.dashboard.stats.occupancyRate')}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    85%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{t('admin.dashboard.stats.totalBookings')}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    24
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{t('admin.dashboard.stats.revenue')}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    $12,450
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;