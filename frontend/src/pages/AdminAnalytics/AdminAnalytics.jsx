import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstruction from '../../components/templates/UnderConstruction/UnderConstruction';

const AdminAnalytics = () => {
  const { t } = useTranslation();

  return (
    <UnderConstruction 
      title={t('admin.navigation.analytics')}
      message="El módulo de analíticas estará disponible próximamente. Aquí podrás ver estadísticas detalladas, reportes de ocupación y métricas de rendimiento del hotel."
    />
  );
};

export default AdminAnalytics;