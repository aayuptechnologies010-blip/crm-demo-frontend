import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Save, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Lock,
  Layers,
  ArrowRight,
  Eye,
  Key
} from 'lucide-react';
import Card from '../components/shared/Card';
import { PrimaryButton } from '../components/shared/FormElements';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const initialRoles = ['Super Admin', 'Admin / Sales Manager', 'Branch Admin', 'Sales Executive', 'Dealer', 'Installer'];

const ALL_PERMISSIONS = [
  { key: 'View Dashboard', category: 'General' },
  { key: 'Manage Leads', category: 'Leads' },
  { key: 'Assign Leads', category: 'Leads' },
  { key: 'Delete Leads', category: 'Leads' },
  { key: 'View Site Surveys', category: 'Technical' },
  { key: 'Manage Quotations', category: 'Sales' },
  { key: 'View Orders', category: 'Sales' },
  { key: 'Manage Installations', category: 'Technical' },
  { key: 'Manage Subsidy', category: 'Operations' },
  { key: 'Manage Payments', category: 'Accounts' },
  { key: 'Manage Service Complaints', category: 'Service' },
  { key: 'Manage Dealers', category: 'Channel' },
  { key: 'View Reports', category: 'Analytics' },
  { key: 'Manage Team', category: 'Management' },
  { key: 'Export Data', category: 'Data' },
  { key: 'Manage Settings', category: 'System' }
];

const defaultPerms = {
  'Super Admin': new Set(ALL_PERMISSIONS.map(p => p.key)),
  'Admin / Sales Manager': new Set(['View Dashboard', 'Manage Leads', 'Assign Leads', 'View Reports', 'Manage Team', 'Export Data', 'View Site Surveys', 'Manage Quotations', 'View Orders', 'Manage Installations', 'Manage Subsidy', 'Manage Payments', 'Manage Service Complaints', 'Manage Dealers']),
  'Branch Admin': new Set(['View Dashboard', 'Manage Leads', 'Assign Leads', 'View Reports', 'Manage Team', 'View Orders']),
  'Sales Executive': new Set(['View Dashboard', 'Manage Leads', 'View Site Surveys', 'Manage Quotations']),
  'Dealer': new Set(['View Dashboard', 'Manage Leads', 'View Orders']),
  'Installer': new Set(['View Dashboard', 'View Site Surveys', 'Manage Installations', 'Manage Service Complaints'])
};

export default function RolesPermissions() {
  const { currentUser } = useAuth();
  const [rolesList, setRolesList] = useState(initialRoles);
  const [perms, setPerms] = useState(defaultPerms);
  const [selectedRole, setSelectedRole] = useState('Sales Executive');
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPerms = async () => {
      try {
        const res = await api.get('/settings/permissions');
        if (res && typeof res === 'object') {
          const loaded = { ...defaultPerms };
          const discoveredRoles = new Set(initialRoles);
          Object.entries(res).forEach(([r, pList]) => {
            discoveredRoles.add(r);
            if (Array.isArray(pList)) {
              loaded[r] = new Set(pList);
            }
          });
          setRolesList(Array.from(discoveredRoles));
          setPerms(loaded);
        }
      } catch (e) {
        console.error('Failed to load role permissions:', e);
      }
    };
    fetchPerms();
  }, []);

  const handleCreateNewRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    const cleanName = newRoleName.trim();
    if (rolesList.includes(cleanName)) {
      alert('This role already exists!');
      return;
    }

    try {
      const defaultRolePerms = ['View Dashboard'];
      await api.post('/settings/roles', {
        roleName: cleanName,
        permissions: defaultRolePerms
      });
      setRolesList([...rolesList, cleanName]);
      setPerms(prev => ({
        ...prev,
        [cleanName]: new Set(defaultRolePerms)
      }));
      setSelectedRole(cleanName);
      setNewRoleName('');
      setShowAddRole(false);
    } catch (err) {
      // Offline fallback
      setRolesList([...rolesList, cleanName]);
      setPerms(prev => ({
        ...prev,
        [cleanName]: new Set(['View Dashboard'])
      }));
      setSelectedRole(cleanName);
      setNewRoleName('');
      setShowAddRole(false);
    }
  };

  const handleDeleteRole = async (roleToDelete) => {
    if (roleToDelete === 'Super Admin' || roleToDelete === 'Admin / Sales Manager') return;
    if (!window.confirm(`Are you sure you want to delete role "${roleToDelete}"?`)) return;

    try {
      await api.delete(`/settings/roles/${encodeURIComponent(roleToDelete)}`);
    } catch (e) {
      console.log('Role deleted locally');
    }
    const updated = rolesList.filter(r => r !== roleToDelete);
    setRolesList(updated);
    setPerms(prev => {
      const next = { ...prev };
      delete next[roleToDelete];
      return next;
    });
    if (selectedRole === roleToDelete) {
      setSelectedRole(updated[0] || 'Sales Executive');
    }
  };

  const togglePerm = (permKey) => {
    if (selectedRole === 'Super Admin') return; // Super admin has permanent full access
    setPerms(prev => {
      const currentSet = new Set(prev[selectedRole] || []);
      if (currentSet.has(permKey)) {
        currentSet.delete(permKey);
      } else {
        currentSet.add(permKey);
      }
      return {
        ...prev,
        [selectedRole]: currentSet
      };
    });
  };

  const toggleSelectAll = () => {
    if (selectedRole === 'Super Admin') return;
    const currentSet = perms[selectedRole] || new Set();
    const allKeys = ALL_PERMISSIONS.map(p => p.key);
    const hasAll = allKeys.every(k => currentSet.has(k));

    setPerms(prev => ({
      ...prev,
      [selectedRole]: hasAll ? new Set(['View Dashboard']) : new Set(allKeys)
    }));
  };

  const handleSavePerms = async () => {
    setSaving(true);
    try {
      const payload = {};
      Object.entries(perms).forEach(([r, setObj]) => {
        payload[r] = Array.from(setObj);
      });
      await api.patch('/settings/permissions', { rolePermissions: payload });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-[#166534]" size={24} /> Roles & Permissions Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Super Admin master portal: Create dynamic CRM roles, configure granular access & monitor data tracking
          </p>
        </div>
        <button
          onClick={() => setShowAddRole(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-900/10 transition-all hover:scale-[1.02] active:scale-95">
          <Plus size={16} /> Create New Role
        </button>
      </div>

      {/* Super Admin Notice Card */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3 text-xs text-[#166534]">
        <ShieldCheck size={20} className="shrink-0 mt-0.5 text-[#166534]" />
        <div>
          <span className="font-extrabold text-sm">Super Admin Master Tracking & Control:</span>
          <p className="mt-0.5 text-slate-700">
            Aap (Super Admin) naye roles create karke unko exact permission dete hain. Super Admin ka role data entry karna nahi, balki pure business ke sabhi leads, dealers, sales, installations aur complaints ko **Track & Monitor** karna hai.
          </p>
        </div>
      </div>

      {/* Create Role Modal/Box */}
      {showAddRole && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <form onSubmit={handleCreateNewRole} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Enter New CRM Role Title</h4>
              <button type="button" onClick={() => setShowAddRole(false)} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                required
                autoFocus
                placeholder="e.g. Area Sales Manager, Site Surveyor, Billing Desk, Quality Auditor..."
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:border-[#166534] outline-none font-semibold text-slate-800"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRole(false)}
                  className="px-3 py-2 text-xs font-bold border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-100">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#166534] hover:bg-emerald-900 text-white rounded-xl shadow-xs">
                  Save Role
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Two-Column Layout: Roles on Left, Permission Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Roles Selector */}
        <div className="lg:col-span-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Available Roles ({rolesList.length})
          </div>

          <div className="space-y-1.5">
            {rolesList.map(r => {
              const isSelected = selectedRole === r;
              const permCount = perms[r]?.size || 0;
              const isSystemRole = r === 'Super Admin' || r === 'Admin / Sales Manager';

              return (
                <div
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-300 text-[#166534] font-black shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/70 text-slate-700 font-bold'
                  }`}>
                  <div>
                    <div className="text-xs flex items-center gap-1.5">
                      <Key size={13} className={isSelected ? 'text-[#166534]' : 'text-slate-400'} />
                      <span>{r}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5 ml-4">
                      {r === 'Super Admin' ? 'All Permissions (Master View)' : `${permCount} Permissions Granted`}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {!isSystemRole && (
                      <button
                        title="Delete Role"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(r);
                        }}
                        className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                    <ArrowRight size={14} className={isSelected ? 'text-[#166534]' : 'text-slate-300'} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Permission Checkboxes for Selected Role */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#166534] border border-emerald-200 font-bold">
                  Active Role
                </span>
                <h3 className="text-base font-extrabold text-slate-900">{selectedRole}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedRole === 'Super Admin'
                  ? 'Super Admin tracks all CRM modules unrestricted.'
                  : `Select which modules and features ${selectedRole} is allowed to access:`}
              </p>
            </div>

            {selectedRole !== 'Super Admin' && (
              <button
                onClick={toggleSelectAll}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors">
                Toggle Select All
              </button>
            )}
          </div>

          {/* Permissions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {ALL_PERMISSIONS.map(p => {
              const isChecked = selectedRole === 'Super Admin' || (perms[selectedRole]?.has(p.key) || false);
              const isDisabled = selectedRole === 'Super Admin';

              return (
                <label
                  key={p.key}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-600'
                  } ${isDisabled ? 'cursor-not-allowed opacity-90' : ''}`}>
                  <input
                    type="checkbox"
                    disabled={isDisabled}
                    checked={isChecked}
                    onChange={() => togglePerm(p.key)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#166534] focus:ring-emerald-200 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-xs font-bold block">{p.key}</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{p.category} Module</span>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Changes will apply instantly across user sessions.
            </span>
            <PrimaryButton onClick={handleSavePerms} disabled={saving}>
              <Save size={14} /> {saving ? 'Saving...' : saved ? 'Permissions Saved ✓' : 'Save Permissions'}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
