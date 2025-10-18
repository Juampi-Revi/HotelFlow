import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstruction from '../../components/templates/UnderConstruction/UnderConstruction';

const AdminAnalytics = () => {
  const { t } = useTranslation();

  return (
    <UnderConstruction 
      title={t('admin.navigation.analytics')}
      message={t('common.analyticsComingSoon')}
    />
  );
};

export default AdminAnalytics;