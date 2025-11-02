import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/templates/AdminLayout/AdminLayout';
import { categoryService } from '../../services/categoryService';
import Button from '../../components/atoms/Button/Button';

const initialForm = { name: '', slug: '', description: '', imageUrl: '', isActive: true };

const AdminCategories = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.slug || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    );
  }, [categories, search]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setError('');
    } catch (e) {
      setError(t('admin.categories.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      isActive: !!cat.isActive
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(initialForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editing) {
        await categoryService.updateCategory(editing.id, form);
      } else {
        await categoryService.createCategory(form);
      }
      await loadCategories();
      closeForm();
    } catch (e) {
      setError(t('admin.categories.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm(t('admin.categories.confirmDelete'))) return;
    try {
      setDeletingId(id);
      await categoryService.deleteCategory(id);
      await loadCategories();
    } catch (e) {
      setError(t('admin.categories.errors.deleteFailed'));
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (id) => {
    try {
      await categoryService.toggleActive(id);
      await loadCategories();
    } catch (e) {
      setError(t('admin.categories.errors.toggleFailed'));
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {t('admin.categories.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-2xl">
                {t('admin.categories.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                className="px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder={t('admin.categories.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="primary" onClick={openCreate}>
                {t('admin.categories.actions.addNew')}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.categories.table.name')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.categories.table.slug')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.categories.table.description')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.categories.table.active')}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.categories.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        {t('admin.categories.loading')}
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        {t('admin.categories.empty')}
                      </td>
                    </tr>
                  ) : (
                    filtered.map(cat => (
                      <tr key={cat.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{cat.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{cat.slug}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{cat.description}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${cat.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'}`}>
                            {cat.isActive ? t('admin.categories.status.active') : t('admin.categories.status.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="secondary" size="small" onClick={() => openEdit(cat)}>
                              {t('admin.categories.actions.edit')}
                            </Button>
                            <Button variant="secondary" size="small" onClick={() => toggleActive(cat.id)}>
                              {t('admin.categories.actions.toggle')}
                            </Button>
                            <Button variant="danger" size="small" onClick={() => deleteCategory(cat.id)} disabled={deletingId === cat.id}>
                              {t('admin.categories.actions.delete')}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-lg border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editing ? t('admin.categories.form.editTitle') : t('admin.categories.form.createTitle')}
                  </h2>
                  <Button variant="secondary" size="small" onClick={closeForm}>✕</Button>
                </div>
                <form onSubmit={saveCategory} className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.categories.form.name')}</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.categories.form.slug')}</label>
                    <input name="slug" value={form.slug} onChange={handleChange} required className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.categories.form.description')}</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.categories.form.imageUrl')}</label>
                    <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="isActive" type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                    <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">{t('admin.categories.form.isActive')}</label>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" type="button" onClick={closeForm}>{t('admin.categories.form.cancel')}</Button>
                    <Button variant="primary" type="submit" disabled={saving}>{saving ? t('admin.categories.form.saving') : t('admin.categories.form.save')}</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;