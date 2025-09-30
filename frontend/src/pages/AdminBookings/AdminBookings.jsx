import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstruction from '../../components/templates/UnderConstruction/UnderConstruction';

const AdminBookings = () => {
  const { t } = useTranslation();

  return (
    <UnderConstruction 
      title={t('admin.navigation.bookings')}
      message="El módulo de reservas estará disponible próximamente. Aquí podrás gestionar todas las reservas, ver el estado de las mismas y administrar check-ins y check-outs."
    />
  );
};

export default AdminBookings;