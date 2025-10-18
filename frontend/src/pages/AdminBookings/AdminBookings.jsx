import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstruction from '../../components/templates/UnderConstruction/UnderConstruction';

const AdminBookings = () => {
  const { t } = useTranslation();

  return (
    <UnderConstruction 
      title={t('admin.navigation.bookings')}
      message={t('common.bookingsComingSoon')}
    />
  );
};

export default AdminBookings;