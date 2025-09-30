import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstruction from '../../components/templates/UnderConstruction/UnderConstruction';

const AdminSettings = () => {
  const { t } = useTranslation();

  return (
    <UnderConstruction 
      title={t('admin.navigation.settings')}
      message="El módulo de configuración estará disponible próximamente. Aquí podrás configurar parámetros del sistema, gestionar usuarios administradores y personalizar la aplicación."
    />
  );
};

export default AdminSettings;