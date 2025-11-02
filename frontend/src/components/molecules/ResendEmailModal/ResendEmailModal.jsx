import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import { authService } from '../../../services/authService';

const ResendEmailModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(t('auth.resendEmail.validation.emailRequired'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await authService.resendConfirmationEmail(email.trim());
      
      if (response.sent) {
        onSuccess(t('auth.resendEmail.success'));
        handleClose();
      } else {
        setError(response.message || t('auth.resendEmail.errors.generic'));
      }
    } catch (err) {
      setError(err.message || t('auth.resendEmail.errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('auth.resendEmail.title')}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('auth.resendEmail.description')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('auth.resendEmail.fields.email')}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder={t('auth.resendEmail.placeholders.email')}
            error={error}
            required
            disabled={isSubmitting}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t('auth.resendEmail.actions.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? t('auth.resendEmail.actions.sending') : t('auth.resendEmail.actions.send')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResendEmailModal;