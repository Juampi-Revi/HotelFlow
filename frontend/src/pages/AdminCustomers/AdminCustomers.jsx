import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstruction from '../../components/templates/UnderConstruction/UnderConstruction';

const AdminCustomers = () => {
  const { t } = useTranslation();

  return (
    <UnderConstruction 
      title={t('admin.navigation.customers')}
      message={t('common.customersComingSoon')}
    />
  );
};

export default AdminCustomers;