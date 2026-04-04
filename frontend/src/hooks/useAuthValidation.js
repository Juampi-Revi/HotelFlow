export default function useAuthValidation(t, mode) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const getFieldError = (field, value) => {
    const val = (value || '').trim();
    if (field === 'firstName' && mode === 'register') {
      if (!val || val.length < 4) return t('auth.register.validation.firstName');
    }
    if (field === 'lastName' && mode === 'register') {
      if (!val || val.length < 4) return t('auth.register.validation.lastName');
    }
    if (field === 'email') {
      if (!val || !emailPattern.test(val)) return t('auth.register.validation.email');
    }
    if (field === 'password') {
      if (mode === 'register') {
        if (!val || !passwordStrong.test(val)) return t('auth.register.validation.password');
      } else {
        if (!val || val.length < 8) return t('auth.register.validation.password');
      }
    }
    return '';
  };

  const getFormErrors = (form) => {
    const errors = {};
    if (mode === 'register') {
      if (!form.firstName || form.firstName.trim().length < 4) errors.firstName = t('auth.register.validation.firstName');
      if (!form.lastName || form.lastName.trim().length < 4) errors.lastName = t('auth.register.validation.lastName');
    }
    if (!form.email || !emailPattern.test(form.email)) errors.email = t('auth.register.validation.email');
    if (mode === 'register') {
      if (!form.password || !passwordStrong.test(form.password)) errors.password = t('auth.register.validation.password');
    } else {
      if (!form.password || form.password.length < 8) errors.password = t('auth.register.validation.password');
    }
    return errors;
  };

  const isFormValid = (form) => {
    if (mode === 'register') {
      return (
        form.firstName?.trim().length >= 4 &&
        form.lastName?.trim().length >= 4 &&
        emailPattern.test(form.email || '') &&
        passwordStrong.test(form.password || '')
      );
    }
    return emailPattern.test(form.email || '') && (form.password || '').length >= 8;
  };

  return { getFieldError, getFormErrors, isFormValid, emailPattern, passwordStrong };
}
