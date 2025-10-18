import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/templates/AdminLayout/AdminLayout';
import { userService } from '../../services/userService';
import { useToast } from '../../hooks';
import Toast from '../../components/atoms/Toast/Toast';
import { useAuth } from '../../contexts';
import Pagination from '../../components/atoms/Pagination';
import { Button } from '../../components/atoms';

const AdminUsers = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const { notification, showNotification, hideNotification } = useToast();
  const [usersPage, setUsersPage] = useState({ content: [], totalPages: 0, totalElements: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 0-based
  const [size, setSize] = useState(20);
  const [query, setQuery] = useState('');
  const [confirmState, setConfirmState] = useState({ open: false, nextIsAdmin: false, target: null });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const pageData = await userService.listUsers(page, size);
      setUsersPage(pageData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load users');
      showNotification('error', t('common.error') + ': ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, size]);

  const startToggleAdmin = (u) => {
    const isAdmin = (u.roles || []).includes('ADMIN');
    const next = !isAdmin;
    // Disallow self updates from the frontend
    if (currentUser?.email && currentUser.email === u.email) {
      showNotification('warning', t('admin.users.actions.cannotSelfUpdate'));
      return;
    }
    setConfirmState({ open: true, nextIsAdmin: next, target: u });
  };

  const confirmToggleAdmin = async () => {
    const u = confirmState.target;
    if (!u) { setConfirmState({ open: false, nextIsAdmin: false, target: null }); return; }
    try {
      await userService.updateRole(u.id, confirmState.nextIsAdmin);
      showNotification('success', t('admin.users.actions.updated'));
      fetchUsers();
    } catch (err) {
      showNotification('error', err.message || t('admin.users.actions.updateFailed'));
    }
    setConfirmState({ open: false, nextIsAdmin: false, target: null });
  };

  const togglePermission = async (u, permKey) => {
    if (currentUser?.email && currentUser.email === u.email) {
      showNotification('warning', t('admin.users.actions.cannotSelfUpdate'));
      return;
    }
    try {
      const isAdminTarget = (u.roles || []).includes('ADMIN');
      if (!isAdminTarget) {
        showNotification('warning', t('admin.users.permissions.onlyForAdmins'));
        return;
      }
      const hasCreate = (u.permissions || []).includes('ROOMS_CREATE');
      const hasEdit = (u.permissions || []).includes('ROOMS_EDIT');
      // Prevent disabling the last active permission
      if (permKey === 'ROOMS_CREATE' && hasCreate && !hasEdit) {
        showNotification('warning', t('admin.users.permissions.mustKeepOne'));
        return;
      }
      if (permKey === 'ROOMS_EDIT' && hasEdit && !hasCreate) {
        showNotification('warning', t('admin.users.permissions.mustKeepOne'));
        return;
      }
      let payload = {};
      if (permKey === 'ROOMS_CREATE') {
        payload = { roomsCreate: !hasCreate };
      } else if (permKey === 'ROOMS_EDIT') {
        payload = { roomsEdit: !hasEdit };
      }
      await userService.updatePermissions(u.id, payload);
      showNotification('success', t('admin.users.actions.permissionsUpdated'));
      fetchUsers();
    } catch (err) {
      showNotification('error', err.message || t('admin.users.actions.permissionsUpdateFailed'));
    }
  };

  const columns = useMemo(() => ([
    { key: 'name', label: t('admin.users.table.name') },
    { key: 'email', label: t('admin.users.table.email') },
    { key: 'roles', label: t('admin.users.table.roles') },
    { key: 'createdAt', label: t('admin.users.table.createdAt') },
    { key: 'actions', label: t('admin.users.table.actions') }
  ]), [t]);

  const filteredContent = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return usersPage.content || [];
    return (usersPage.content || []).filter(u => {
      const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      return name.includes(q) || (u.email || '').toLowerCase().includes(q);
    });
  }, [usersPage.content, query]);

  const formatDate = (iso) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString();
    } catch (_) { return iso; }
  };

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('admin.users.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('admin.users.subtitle')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                {t('admin.users.table.pageSize')}
              </label>
              <select
                className="text-sm rounded border dark:bg-slate-800 dark:border-slate-700 px-2 py-1"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
              >
                {[10, 20, 50].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            {/* Top toolbar: search */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('admin.users.search.placeholder')}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">🔎</span>
              </div>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-10 rounded bg-gray-100 dark:bg-gray-700" />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600 dark:text-red-400">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      {columns.map(col => (
                        <th key={col.key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {(filteredContent || []).map(u => {
                      const isAdmin = (u.roles || []).includes('ADMIN');
                      const isSelf = currentUser?.email && currentUser.email === u.email;
                      const canCreate = (u.permissions || []).includes('ROOMS_CREATE');
                      const canEdit = (u.permissions || []).includes('ROOMS_EDIT');
                      return (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                {(u.firstName || u.lastName || u.email || '?').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium">{((u.firstName || '') + ' ' + (u.lastName || '')).trim() || '-'}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{u.email}</td>
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex flex-wrap gap-2">
                              {(u.roles || []).map(r => (
                                <span key={r} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${r === 'OWNER' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : r === 'ADMIN' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300'}`}>{r}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{formatDate(u.createdAt)}</td>
                          <td className="px-4 py-2 text-sm">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={isSelf}
                                onClick={() => startToggleAdmin(u)}
                                title={isAdmin ? t('admin.users.actions.revokeAdmin') : t('admin.users.actions.makeAdmin')}
                                className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium transition ${isAdmin ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'} ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {isAdmin ? t('admin.users.actions.revokeAdmin') : t('admin.users.actions.makeAdmin')}
                              </button>
                              {isAdmin && (
                                <>
                                  <button
                                    type="button"
                                    disabled={isSelf}
                                    onClick={() => togglePermission(u, 'ROOMS_CREATE')}
                                    title={t('admin.users.permissions.create')}
                                    className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium transition ${canCreate ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300'} ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    {t('admin.users.permissions.create')}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isSelf}
                                    onClick={() => togglePermission(u, 'ROOMS_EDIT')}
                                    title={t('admin.users.permissions.edit')}
                                    className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium transition ${canEdit ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300'} ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    {t('admin.users.permissions.edit')}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {t('admin.users.table.showing')} {usersPage.number + 1} / {usersPage.totalPages} — {usersPage.totalElements} {t('admin.users.table.results')}
                  </div>
                  <Pagination
                    currentPage={page}
                    totalPages={usersPage.totalPages}
                    onPageChange={setPage}
                    prevLabel={t('admin.users.table.previous')}
                    nextLabel={t('admin.users.table.next')}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Confirmation modal */}
      {confirmState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmState({ open: false, nextIsAdmin: false, target: null })} />
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {confirmState.nextIsAdmin ? t('admin.users.actions.confirmMakeAdminTitle') : t('admin.users.actions.confirmRevokeAdminTitle')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {confirmState.nextIsAdmin
                ? t('admin.users.actions.confirmMakeAdminDesc', { email: confirmState.target?.email })
                : t('admin.users.actions.confirmRevokeAdminDesc', { email: confirmState.target?.email })}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="small"
                onClick={() => setConfirmState({ open: false, nextIsAdmin: false, target: null })}
                className="text-gray-700 dark:text-gray-200"
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant={confirmState.nextIsAdmin ? 'secondary' : 'danger'}
                size="small"
                onClick={confirmToggleAdmin}
              >
                {confirmState.nextIsAdmin ? t('admin.users.actions.confirmMakeAdminAction') : t('admin.users.actions.confirmRevokeAdminAction')}
              </Button>
            </div>
          </div>
        </div>
      )}
      <Toast show={notification.show} type={notification.type} message={notification.message} onClose={hideNotification} />
    </AdminLayout>
  );
};

export default AdminUsers;