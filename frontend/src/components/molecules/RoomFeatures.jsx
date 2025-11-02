import { useTranslation } from 'react-i18next';
import { renderFeatureIcon } from '../atoms/Icons/FeatureIcons';

const RoomFeatures = ({ features = [] }) => {
  const { t } = useTranslation();

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
        {t('room.sections.whatOffers', '¿Qué ofrece este lugar?')}
      </h3>
      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <span
            key={feature.id || feature.name}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700"
          >
            {renderFeatureIcon(feature.icon, 'h-4 w-4')}
            <span>{feature.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default RoomFeatures;