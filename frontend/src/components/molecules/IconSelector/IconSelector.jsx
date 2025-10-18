import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ICON_DEFINITIONS } from '../../../utils/iconMap';
import { renderFeatureIcon } from '../../atoms/Icons';

const IconSelector = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const rootRef = useRef(null);
  const listboxId = 'icon-selector-listbox';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = useMemo(() => {
    const q = query.toLowerCase().trim();
    const base = ICON_DEFINITIONS.map(({ token }) => ({
      token,
      label: t(`admin.features.icons.${token}`)
    }));
    const filtered = q
      ? base.filter(({ token, label }) => token.toLowerCase().includes(q) || (label || '').toLowerCase().includes(q))
      : base;
    if (highlightIndex >= filtered.length) setHighlightIndex(Math.max(0, filtered.length - 1));
    return filtered;
  }, [query, highlightIndex, t]);

  const selectedLabel = value ? t(`admin.features.icons.${value}`) : '';

  const handleSelect = (token) => {
    onChange(token);
    setOpen(false);
    setQuery('');
  };

  const onKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
        setHighlightIndex(0);
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, options.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const opt = options[highlightIndex];
      if (opt) handleSelect(opt.token);
      return;
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-600"
      >
        <div className="flex items-center gap-2">
          {renderFeatureIcon(value, 'h-5 w-5 text-gray-700 dark:text-gray-300')}
          <span className="text-sm">
            {selectedLabel || t('admin.features.iconSelector.select')}
          </span>
        </div>
        <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>
      </button>

      {open && (
        <div
          role="listbox"
          id={listboxId}
          className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder={t('admin.features.iconSelector.searchPlaceholder')}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlightIndex(0); }}
              className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <ul className="max-h-56 overflow-auto py-1">
            {options.map(({ token, label }, idx) => {
              const isActive = idx === highlightIndex;
              const isSelected = token === value;
              return (
                <li key={token} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlightIndex(idx)}
                    onClick={() => handleSelect(token)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left transition ${
                      isActive ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    } ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {renderFeatureIcon(token, 'h-5 w-5') || (
                      <div className="h-5 w-5 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400">
                        <span className="text-[10px]">{label?.slice(0, 1)}</span>
                      </div>
                    )}
                    <span className="text-sm">{label}</span>
                    {isSelected && (
                      <svg className="ml-auto h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.42 0l-3.2-3.2a1 1 0 111.42-1.42l2.49 2.49 6.49-6.49a1 1 0 011.42 0z"/></svg>
                    )}
                  </button>
                </li>
              );
            })}
            {options.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{t('admin.features.iconSelector.noResults')}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default IconSelector;