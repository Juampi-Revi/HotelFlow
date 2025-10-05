import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Footer } from '../../components/organisms';
import Input from '../../components/atoms/Input/Input';
import Button from '../../components/atoms/Button/Button';
import Toast from '../../components/atoms/Toast/Toast';
import { authService } from '../../services/authService';
import { useAuthValidation, useToast } from '../../hooks';
import { useAuth } from '../../contexts';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const mode = location.pathname.includes('/login') ? 'login' : 'register';
  const { login: setAuthSession } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notification, showNotification, hideNotification } = useToast();

  const { getFieldError, getFormErrors, isFormValid } = useAuthValidation(t, mode);

  const updateField = (field) => (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: getFieldError(field, value) }));
  };

  // Notifications handled via useToast

  const validate = () => {
    const newErrors = getFormErrors(form);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        const user = await authService.register(form);
        showNotification('success', t('auth.register.success'));
        setTimeout(() => navigate('/'), 1200);
        return user;
      } else {
        const auth = await authService.login({ email: form.email, password: form.password });
        setAuthSession(auth);
        showNotification('success', t('auth.login.actions.submitting'));
        navigate('/admin');
        return auth;
      }
    } catch (err) {
      if (err?.code === 'DUPLICATE_EMAIL') {
        showNotification('error', t('auth.register.errors.duplicateEmail'));
        setErrors(prev => ({ ...prev, email: t('auth.register.errors.duplicateEmail') }));
      } else if (err?.code === 'INVALID_CREDENTIALS') {
        showNotification('error', 'Invalid email or password');
      } else {
        showNotification('error', t('auth.register.errors.generic'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToOtherMode = () => {
    navigate(mode === 'login' ? '/register' : '/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4">
          <div className="grid place-items-center min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-md md:max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              {mode === 'login' ? t('auth.login.title') : t('auth.register.title')}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <>
                  <Input
                    label={t('auth.register.fields.firstName')}
                    value={form.firstName}
                    onChange={updateField('firstName')}
                    placeholder={t('auth.register.placeholders.firstName')}
                    error={errors.firstName}
                    required
                    disabled={isSubmitting}
                  />
                  <Input
                    label={t('auth.register.fields.lastName')}
                    value={form.lastName}
                    onChange={updateField('lastName')}
                    placeholder={t('auth.register.placeholders.lastName')}
                    error={errors.lastName}
                    required
                    disabled={isSubmitting}
                  />
                </>
              )}
              <Input
                label={mode === 'login' ? t('auth.login.fields.email') : t('auth.register.fields.email')}
                type="email"
                value={form.email}
                onChange={updateField('email')}
                placeholder={mode === 'login' ? t('auth.login.placeholders.email') : t('auth.register.placeholders.email')}
                error={errors.email}
                required
                disabled={isSubmitting}
              />
              <Input
                label={mode === 'login' ? t('auth.login.fields.password') : t('auth.register.fields.password')}
                type="password"
                value={form.password}
                onChange={updateField('password')}
                placeholder={mode === 'login' ? t('auth.login.placeholders.password') : t('auth.register.placeholders.password')}
                error={errors.password}
                required
                disabled={isSubmitting}
              />

              <div className="flex flex-col items-center gap-3">
                <Button type="submit" variant="primary" disabled={isSubmitting || !isFormValid(form)}>
                  {isSubmitting
                    ? (mode === 'login' ? t('auth.login.actions.submitting') : t('auth.register.actions.submitting'))
                    : (mode === 'login' ? t('auth.login.actions.submit') : t('auth.register.actions.submit'))}
                </Button>
                <div className="text-sm text-slate-700 dark:text-slate-300 text-center">
                  {mode === 'login' ? t('auth.login.legend.noAccount') : t('auth.register.legend.haveAccount')}
                  {' '}
                  <button type="button" onClick={goToOtherMode} className="text-blue-600 hover:underline dark:text-blue-400">
                    {mode === 'login' ? t('auth.login.legend.goToRegister') : t('auth.register.legend.goToLogin')}
                  </button>
                </div>
              </div>
            </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {notification.show && (
        <Toast
          message={notification.message}
          type={notification.type}
          isVisible={notification.show}
          onClose={hideNotification}
        />
      )}
    </div>
  );
};

export default Auth;