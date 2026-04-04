import { useTranslation } from 'react-i18next';
import { renderFeatureIcon } from '../atoms/Icons/FeatureIcons';

const RoomFeatures = ({ features = [], showTitle = true }) => {
  const { t } = useTranslation();

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="p-0 m-0">
      {showTitle && (
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
          {t('room.sections.whatOffers', '¿Qué ofrece este lugar?')}
        </h3>
      )}
      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <span
            key={feature.id || feature.name}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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