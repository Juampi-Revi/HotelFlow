import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstruction from '../../components/templates/UnderConstruction/UnderConstruction';

const AdminStaff = () => {
  const { t } = useTranslation();

  return (
    <UnderConstruction 
      title={t('admin.navigation.staff')}
      message="El módulo de personal estará disponible próximamente. Aquí podrás gestionar empleados, asignar roles y permisos, y administrar horarios de trabajo."
    />
  );
};

export default AdminStaff;