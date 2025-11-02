import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Footer } from '../../components/organisms';
import Input from '../../components/atoms/Input/Input';
import Button from '../../components/atoms/Button/Button';
import Toast from '../../components/atoms/Toast/Toast';
import ResendEmailModal from '../../components/molecules/ResendEmailModal/ResendEmailModal';
import { authService } from '../../services/authService';
import { useAuthValidation, useToast } from '../../hooks';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: ''
};

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const { notification, showNotification, hideNotification } = useToast();

  const { getFieldError, getFormErrors, isFormValid } = useAuthValidation(t, 'register');

  const updateField = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: getFieldError(field, value) }));
  };

  const validate = () => {
    const nextErrors = getFormErrors(form);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      await authService.register(form);
      showNotification('success', t('auth.register.success'));
      setForm(initialForm);
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      const msg = err?.code === 'DUPLICATE_EMAIL' ? t('auth.register.errors.duplicateEmail') : t('auth.register.errors.generic');
      showNotification('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('auth.register.title')}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Input
                label={t('auth.register.fields.email')}
                type="email"
                value={form.email}
                onChange={updateField('email')}
                placeholder={t('auth.register.placeholders.email')}
                error={errors.email}
                required
                disabled={isSubmitting}
              />
              <Input
                label={t('auth.register.fields.password')}
                type="password"
                value={form.password}
                onChange={updateField('password')}
                placeholder={t('auth.register.placeholders.password')}
                error={errors.password}
                required
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setIsResendModalOpen(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 underline disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {t('auth.resendEmail.actions.send')}
                </button>
                <Button type="submit" variant="primary" disabled={isSubmitting || !isFormValid(form)}>
                  {isSubmitting ? t('auth.register.actions.submitting') : t('auth.register.actions.submit')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <ResendEmailModal
        isOpen={isResendModalOpen}
        onClose={() => setIsResendModalOpen(false)}
        onSuccess={(message) => showNotification('success', message)}
      />
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

export default Register;