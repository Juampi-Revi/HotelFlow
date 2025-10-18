import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstruction from '../../components/templates/UnderConstruction/UnderConstruction';

const AdminStaff = () => {
  const { t } = useTranslation();

  return (
    <UnderConstruction 
      title={t('admin.navigation.staff')}
      message={t('common.staffComingSoon')}
    />
  );
};

export default AdminStaff;