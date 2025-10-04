import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Input from '../../components/atoms/Input/Input';
import Button from '../../components/atoms/Button/Button';

const LoginModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // UX-only: show message until real login is implemented
    setTimeout(() => {
      setMessage(t('auth.login.messages.comingSoon'));
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t('auth.login.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('auth.login.fields.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.login.placeholders.email')}
            required
            disabled={submitting}
          />
          <Input
            label={t('auth.login.fields.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.login.placeholders.password')}
            required
            disabled={submitting}
          />

          {message && (
            <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {t('auth.login.legend.noAccount')}{' '}
              <Link to="/register" className="text-blue-600 hover:underline dark:text-blue-400" onClick={onClose}>
                {t('auth.login.legend.goToRegister')}
              </Link>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                {t('auth.login.actions.cancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? t('auth.login.actions.submitting') : t('auth.login.actions.submit')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;