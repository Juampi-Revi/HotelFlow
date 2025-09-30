import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstruction from '../../components/templates/UnderConstruction/UnderConstruction';

const AdminAvailability = () => {
  const { t } = useTranslation();

  return (
    <UnderConstruction 
      title={t('admin.navigation.availability')}
      message="El módulo de disponibilidad estará disponible próximamente. Aquí podrás gestionar la disponibilidad de habitaciones, bloquear fechas y configurar tarifas especiales."
    />
  );
};

export default AdminAvailability;