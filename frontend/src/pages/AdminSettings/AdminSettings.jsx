import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstruction from '../../components/templates/UnderConstruction/UnderConstruction';

const AdminSettings = () => {
  const { t } = useTranslation();

  return (
    <UnderConstruction 
      title={t('admin.navigation.settings')}
      message={t('common.settingsComingSoon')}
    />
  );
};

export default AdminSettings;