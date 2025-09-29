import { useTranslation } from 'react-i18next';

const ViewToggle = ({ currentView, onViewChange }) => {
  const { t } = useTranslation();

  const toggleClasses = `
    relative inline-flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1 transition-all duration-300
  `;

  const buttonBaseClasses = `
    relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
  `;

  const activeClasses = `
    bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md
  `;

  const inactiveClasses = `
    text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
  `;

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('admin.rooms.viewToggle.label')}
      </span>
      <div className={toggleClasses}>
        <button
          onClick={() => onViewChange('cards')}
          className={`${buttonBaseClasses} ${
            currentView === 'cards' ? activeClasses : inactiveClasses
          }`}
          aria-pressed={currentView === 'cards'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
          </svg>
          <span>{t('admin.rooms.viewToggle.cards')}</span>
        </button>
        <button
          onClick={() => onViewChange('table')}
          className={`${buttonBaseClasses} ${
            currentView === 'table' ? activeClasses : inactiveClasses
          }`}
          aria-pressed={currentView === 'table'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9" />
          </svg>
          <span>{t('admin.rooms.viewToggle.table')}</span>
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;