import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/templates/AdminLayout/AdminLayout';
import { useAuth } from '../../contexts';

const AdminProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fullName = ((user?.firstName || '') + ' ' + (user?.lastName || '')).trim();

  return (
    <AdminLayout>
      <section className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('admin.profile.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('admin.profile.description')}
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => { try { logout(); } catch (_) {} navigate('/'); }}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transition"
            >
              {t('admin.navigation.logout')}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
                {fullName ? fullName.charAt(0).toUpperCase() : (user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">{fullName || t('admin.profile.unknownUser')}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{user?.email || t('admin.profile.noEmail')}</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('admin.profile.fields.firstName')}</div>
                  <div className="text-base text-slate-900 dark:text-white">{user?.firstName || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('admin.profile.fields.lastName')}</div>
                  <div className="text-base text-slate-900 dark:text-white">{user?.lastName || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('admin.profile.fields.email')}</div>
                  <div className="text-base text-slate-900 dark:text-white">{user?.email || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminProfile;