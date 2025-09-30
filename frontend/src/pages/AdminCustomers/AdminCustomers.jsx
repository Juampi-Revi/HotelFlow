import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstruction from '../../components/templates/UnderConstruction/UnderConstruction';

const AdminCustomers = () => {
  const { t } = useTranslation();

  return (
    <UnderConstruction 
      title={t('admin.navigation.customers')}
      message="El módulo de clientes estará disponible próximamente. Aquí podrás gestionar la base de datos de clientes, ver historial de reservas y administrar perfiles de huéspedes."
    />
  );
};

export default AdminCustomers;