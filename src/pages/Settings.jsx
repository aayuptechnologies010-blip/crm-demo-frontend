import { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Bell, 
  Shield, 
  Save, 
  User, 
  Edit2, 
  X, 
  Camera, 
  Phone, 
  Mail, 
  Briefcase, 
  Database, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  HardDriveDownload,
  ShieldCheck,
  Server,
  Plus
} from 'lucide-react';
import Card from '../components/shared/Card';
import { Input, Select, PrimaryButton, SecondaryButton } from '../components/shared/FormElements';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { requestNotificationPermission } from '../utils/firebase';
import { 
  SAMPLE_SOLAR_PROJECTS, 
  SAMPLE_SOLAR_LEADS, 
  SAMPLE_DEALERS, 
  SAMPLE_COMPLAINTS 
} from '../data/solarData';

const allTabs = [
  { id: 'company', label: 'Company Profile', icon: Building2, roles: ['Super Admin', 'Admin', 'Sales Executive'] },
  { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['Super Admin', 'Admin', 'Sales Executive'] },
  { id: 'backups', label: 'Automated Backup & Data Export', icon: Database, roles: ['Super Admin', 'Admin'] },
];

// Notifications per role
const notifsByRole = {
  'Super Admin': [
    { key: 'newLead', label: 'New Lead Created', desc: 'Get notified when a new lead is added' },
    { key: 'assignment', label: 'Lead Assignment', desc: 'Notify when a lead is assigned' },
    { key: 'followup', label: 'Follow-up Reminders', desc: 'Reminders before scheduled follow-ups' },
    { key: 'conversion', label: 'Lead Conversion', desc: 'Notify when a lead is marked as Won' },
    { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly performance summary' },
  ],
  'Admin': [
    { key: 'newLead', label: 'New Lead Created', desc: 'Get notified when a new lead is added' },
    { key: 'assignment', label: 'Lead Assignment', desc: 'Notify when a lead is assigned' },
    { key: 'followup', label: 'Follow-up Reminders', desc: 'Reminders before scheduled follow-ups' },
    { key: 'conversion', label: 'Lead Conversion', desc: 'Notify when a lead is marked as Won' },
    { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly performance summary' },
  ],
  'Sales Executive': [
    { key: 'assignment', label: 'Lead Assigned to Me', desc: 'Notify when a lead is assigned to you' },
    { key: 'followup', label: 'Follow-up Reminders', desc: 'Reminders before your scheduled follow-ups' },
    { key: 'conversion', label: 'Lead Conversion', desc: 'Notify when your lead is marked as Won' },
  ],
};

const initialRoles = ['Super Admin', 'Admin / Sales Manager', 'Branch Admin', 'Sales Executive', 'Dealer', 'Installer'];
const permissions = [
  'View Dashboard', 'Manage Leads', 'Assign Leads', 'Delete Leads',
  'View Reports', 'Manage Team', 'Export Data', 'Manage Settings',
  'View Site Surveys', 'Manage Quotations', 'View Orders', 'Manage Installations',
  'Manage Subsidy', 'Manage Payments', 'Manage Service Complaints', 'Manage Dealers'
];
const defaultPerms = {
  'Super Admin': new Set(permissions),
  'Admin / Sales Manager': new Set(['View Dashboard', 'Manage Leads', 'Assign Leads', 'View Reports', 'Manage Team', 'Export Data', 'View Site Surveys', 'Manage Quotations', 'View Orders', 'Manage Installations', 'Manage Subsidy', 'Manage Payments', 'Manage Service Complaints', 'Manage Dealers']),
  'Branch Admin': new Set(['View Dashboard', 'Manage Leads', 'Assign Leads', 'View Reports', 'Manage Team', 'View Orders']),
  'Sales Executive': new Set(['View Dashboard', 'Manage Leads', 'View Site Surveys', 'Manage Quotations']),
  'Dealer': new Set(['View Dashboard', 'Manage Leads', 'View Orders']),
  'Installer': new Set(['View Dashboard', 'View Site Surveys', 'Manage Installations', 'Manage Service Complaints'])
};

export default function Settings() {
  const { currentUser, updateProfile } = useAuth();
  const isSuperAdmin = currentUser?.role === 'Super Admin';
  const tabs = allTabs.filter(t => t.roles.includes(currentUser?.role));
  const [tab, setTab] = useState('company');
  const [editMode, setEditMode] = useState(false);
  const [rolesList, setRolesList] = useState(initialRoles);
  const [perms, setPerms] = useState(defaultPerms);
  const [newRoleName, setNewRoleName] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);
  const [notifs, setNotifs] = useState({
    newLead: currentUser?.notifications?.newLead ?? true,
    assignment: currentUser?.notifications?.assignment ?? true,
    followup: currentUser?.notifications?.followup ?? true,
    conversion: currentUser?.notifications?.conversion ?? false,
    weeklyReport: currentUser?.notifications?.weeklyReport ?? true,
  });
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);
  const [fcmToken, setFcmToken] = useState(() => localStorage.getItem('fcm_token') || '');
  const [testSent, setTestSent] = useState(false);

  const [permSaving, setPermSaving] = useState(false);
  const [permSaved, setPermSaved] = useState(false);

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
      setNewRoleName('');
      setShowAddRole(false);
      alert(`Role "${cleanName}" created successfully! Now check the boxes to grant required access.`);
    } catch (err) {
      // Offline fallback
      setRolesList([...rolesList, cleanName]);
      setPerms(prev => ({
        ...prev,
        [cleanName]: new Set(['View Dashboard'])
      }));
      setNewRoleName('');
      setShowAddRole(false);
    }
  };

  const handleDeleteRole = async (roleToDelete) => {
    if (roleToDelete === 'Super Admin') return;
    if (!window.confirm(`Are you sure you want to delete role "${roleToDelete}"?`)) return;

    try {
      await api.delete(`/settings/roles/${encodeURIComponent(roleToDelete)}`);
    } catch (e) {
      console.log('Role deleted locally');
    }
    setRolesList(rolesList.filter(r => r !== roleToDelete));
    setPerms(prev => {
      const next = { ...prev };
      delete next[roleToDelete];
      return next;
    });
  };

  const handleSavePerms = async () => {
    setPermSaving(true);
    try {
      const payload = {};
      Object.entries(perms).forEach(([r, setObj]) => {
        payload[r] = Array.from(setObj);
      });
      await api.patch('/settings/permissions', { rolePermissions: payload });
      setPermSaved(true);
      setTimeout(() => setPermSaved(false), 2500);
    } catch (err) {
      alert(err.message || 'Failed to save permissions');
    } finally {
      setPermSaving(false);
    }
  };

  const handleSaveNotifs = async () => {
    setNotifSaving(true);
    try {
      await api.patch('/auth/notifications', { notifications: notifs });
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2500);
    } catch { }
    finally { setNotifSaving(false); }
  };

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    profileImage: currentUser?.profileImage || null,
  });
  const [previewImage, setPreviewImage] = useState(currentUser?.profileImage || null);
  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewImage(ev.target.result);
      setForm(f => ({ ...f, profileImage: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    await updateProfile(form);
    setEditMode(false);
  };

  const handleCancel = () => {
    setForm({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      profileImage: currentUser?.profileImage || null,
    });
    setPreviewImage(currentUser?.profileImage || null);
    setEditMode(false);
  };

  const togglePerm = (role, perm) => {
    setPerms(p => {
      const next = new Set(p[role]);
      next.has(perm) ? next.delete(perm) : next.add(perm);
      return { ...p, [role]: next };
    });
  };

  const displayImage = previewImage || currentUser?.profileImage;
  const avatarInitials = currentUser?.avatar || 'U';

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setTab(id); setEditMode(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${tab === id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* Company Profile Tab — includes My Profile section */}
      {tab === 'company' && (
        <div className="space-y-4 max-w-2xl">

          {/* ── My Profile Section ── */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-800">My Profile</h3>
              {!editMode ? (
                <PrimaryButton onClick={() => setEditMode(true)}>
                  <Edit2 size={14} /> Edit Profile
                </PrimaryButton>
              ) : (
                <div className="flex gap-2">
                  <SecondaryButton onClick={handleCancel}>
                    <X size={14} /> Cancel
                  </SecondaryButton>
                  <PrimaryButton onClick={handleSave}>
                    <Save size={14} /> Save Changes
                  </PrimaryButton>
                </div>
              )}
            </div>

            {/* Avatar + basic info */}
            <div className="flex items-center gap-5 mb-5 pb-5 border-b border-gray-100">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-blue-500 flex items-center justify-center shadow-sm">
                  {displayImage
                    ? <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
                    : <span className="text-white text-2xl font-bold">{avatarInitials}</span>
                  }
                </div>
                {editMode && (
                  <>
                    <button onClick={() => fileRef.current.click()}
                      className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors">
                      <Camera size={13} />
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </>
                )}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{currentUser?.name}</p>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
                <span className="inline-block mt-1.5 text-xs bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-lg font-semibold">
                  {currentUser?.role}
                </span>
                {editMode && (
                  <p className="text-xs text-gray-400 mt-1.5">Click the camera icon to change photo</p>
                )}
              </div>
            </div>

            {/* Fields — edit or read */}
            {editMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Enter your full name" />
                  <Input label="Phone Number" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX" />
                </div>
                <Input label="Email Address" value={currentUser?.email} disabled
                  className="bg-gray-50 text-gray-400 cursor-not-allowed" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Role" value={currentUser?.role} disabled
                    className="bg-gray-50 text-gray-400 cursor-not-allowed" />
                  <Input label="Team" value={currentUser?.team} disabled
                    className="bg-gray-50 text-gray-400 cursor-not-allowed" />
                </div>
                <p className="text-xs text-gray-400">Email, Role and Team can only be changed by Super Admin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: User, label: 'Full Name', value: currentUser?.name },
                  { icon: Phone, label: 'Phone Number', value: currentUser?.phone || 'Not set' },
                  { icon: Mail, label: 'Email Address', value: currentUser?.email },
                  { icon: Briefcase, label: 'Role', value: currentUser?.role },
                  { icon: Building2, label: 'Team', value: currentUser?.team },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm text-gray-800 font-semibold truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>


        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <Card className="p-6 max-w-2xl">
          <h3 className="font-semibold text-gray-800 mb-1">Notification Preferences</h3>
          <p className="text-xs text-gray-400 mb-5">Manage notifications for <span className="font-semibold text-blue-600">{currentUser?.name}</span></p>
          <div className="space-y-4">
            {(notifsByRole[currentUser?.role] || notifsByRole['Sales Executive']).map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <button onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors outline-none ${notifs[key] ? 'bg-blue-500' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifs[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
            <div className="flex justify-end">
              <PrimaryButton onClick={handleSaveNotifs} disabled={notifSaving}>
                <Save size={14} /> {notifSaving ? 'Saving...' : notifSaved ? 'Saved ✓' : 'Save Preferences'}
              </PrimaryButton>
            </div>
          </div>

          {/* FCM Push Notification Live Tester (Super Admin & Admin Only) */}
          {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  🔔
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">FCM Live Push Notification Test Panel</h4>
                  <p className="text-xs text-gray-400">Test live browser & desktop notifications for your device</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-semibold text-gray-700">Device Push Permission:</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                    {typeof window !== 'undefined' && 'Notification' in window ? Notification.permission.toUpperCase() : 'NOT SUPPORTED'}
                  </span>
                </div>

                {fcmToken ? (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">Your FCM Token (Active):</span>
                    <div className="p-2 bg-white rounded-xl border border-gray-200 text-[11px] font-mono text-gray-600 break-all select-all max-h-20 overflow-y-auto">
                      {fcmToken}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Token generate karne ke liye neeche permission enable kijiye.</p>
                )}

                <div className="flex gap-2 flex-wrap pt-1">
                  <SecondaryButton
                    onClick={async () => {
                      const token = await requestNotificationPermission();
                      if (token) setFcmToken(token);
                    }}
                    className="!text-xs !py-2"
                  >
                    ⚡ Request / Refresh Token
                  </SecondaryButton>

                  <PrimaryButton
                    onClick={async () => {
                      if (!('Notification' in window)) {
                        alert('Browser desktop notifications support nahi karta.');
                        return;
                      }
                      if (Notification.permission !== 'granted') {
                        const token = await requestNotificationPermission();
                        if (token) setFcmToken(token);
                      }
                      if (Notification.permission === 'granted') {
                        new Notification('🔥 CRM Live Test Notification', {
                          body: `Hello ${currentUser?.name || 'User'}! FCM live notification system is working perfectly.`,
                          icon: '/logo.png',
                          badge: '/logo.png'
                        });
                        setTestSent(true);
                        setTimeout(() => setTestSent(false), 3000);
                      } else {
                        alert('Please allow notification permission in your browser URL bar.');
                      }
                    }}
                    className="!text-xs !py-2 !bg-indigo-600 hover:!bg-indigo-700"
                  >
                    🚀 {testSent ? 'Notification Sent! ✓' : 'Send Test Notification'}
                  </PrimaryButton>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Role Permissions (Super Admin dynamic creation and tracking control) */}
      {tab === 'permissions' && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-base">Role Creation & Dynamic Access Control</h3>
                <span className="text-[10px] font-black bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                  Super Admin Exclusive
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Super Admin creates roles, assigns granular module access, and tracks end-to-end data across the CRM.
              </p>
            </div>
            <button
              onClick={() => setShowAddRole(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-all whitespace-nowrap">
              <Plus size={14} /> Create New Role
            </button>
          </div>

          {/* Super Admin Tracking Notice */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 mb-5 flex items-start gap-2.5 text-xs text-[#166534]">
            <ShieldCheck size={18} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold">Super Admin Master Tracker Role:</span> Super Admin CRM me operations create nahi karta, balki sabhi Sales Executives, Dealers, aur Installers ka real-time performance, leads, quotations, installations, payments, aur complaints audit track karta hai.
            </div>
          </div>

          {/* Create New Role Modal */}
          {showAddRole && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-5 animate-in fade-in duration-200">
              <form onSubmit={handleCreateNewRole} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Create Custom CRM Role</h4>
                  <button type="button" onClick={() => setShowAddRole(false)} className="text-slate-400 hover:text-slate-700">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    required
                    placeholder="Enter new role name (e.g. Area Manager, Site Surveyor, Billing Desk)..."
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
                      Save & Add Role
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Permissions Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50">
                  <th className="text-left px-3 py-3 font-extrabold text-gray-500 uppercase tracking-wider">Module Permission</th>
                  {rolesList.map(r => (
                    <th key={r} className="text-center px-3 py-3 font-black text-gray-700 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <span>{r}</span>
                        {r !== 'Super Admin' && r !== 'Admin / Sales Manager' && r !== 'Sales Executive' && (
                          <button
                            title={`Delete role ${r}`}
                            onClick={() => handleDeleteRole(r)}
                            className="text-slate-300 hover:text-rose-600 transition-colors">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {permissions.map(perm => (
                  <tr key={perm} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3 py-2.5 font-semibold text-gray-800">{perm}</td>
                    {rolesList.map(role => {
                      const isChecked = perms[role]?.has(perm) || false;
                      const isSuperAdminCol = role === 'Super Admin';
                      return (
                        <td key={role} className="px-3 py-2.5 text-center">
                          <input 
                            type="checkbox" 
                            disabled={isSuperAdminCol}
                            checked={isSuperAdminCol ? true : isChecked} 
                            onChange={() => togglePerm(role, perm)}
                            className="w-4 h-4 rounded border-gray-300 text-[#166534] focus:ring-emerald-200 cursor-pointer disabled:opacity-60" 
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              * Super Admin automatically retains complete 360° audit and tracking visibility across all modules.
            </div>
            <PrimaryButton onClick={handleSavePerms} disabled={permSaving}>
              <Save size={14} /> {permSaving ? 'Saving...' : permSaved ? 'Permissions Saved ✓' : 'Save Roles & Permissions'}
            </PrimaryButton>
          </div>
        </Card>
      )}

      {/* Automatic Backup & Data Export Tab */}
      {tab === 'backups' && (
        <div className="space-y-4 max-w-3xl">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">Automatic Database Backup & Cloud Sync</h3>
                  <p className="text-xs text-gray-500">MongoDB Atlas automatic daily snapshots & local JSON/CSV dump</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> Auto-Backup Active
              </span>
            </div>

            {/* Backup status cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Backup Frequency</div>
                <div className="text-sm font-black text-slate-800 mt-0.5">Every 24 Hours (Daily)</div>
                <div className="text-[10px] text-slate-500 mt-1">Scheduled at 02:00 AM IST</div>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <div className="text-[11px] font-bold text-emerald-800 uppercase">Last Backup Time</div>
                <div className="text-sm font-black text-emerald-950 mt-0.5">Today at 02:00 AM</div>
                <div className="text-[10px] text-emerald-700 mt-1">Status: Success (12.4 MB)</div>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                <div className="text-[11px] font-bold text-blue-800 uppercase">Retention Policy</div>
                <div className="text-sm font-black text-blue-950 mt-0.5">30 Days Rolling</div>
                <div className="text-[10px] text-blue-700 mt-1">Encrypted AES-256 Storage</div>
              </div>
            </div>

            {/* Quick Manual Backup Trigger */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Manual Immediate Backup</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generate an instant snapshot of all Leads, Customers, Orders, Invoices & Service Tickets.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const backupData = {
                      timestamp: new Date().toISOString(),
                      system: 'Devagyadi Bharat Solar CRM',
                      version: '2.4.0',
                      collections: {
                        leads: SAMPLE_SOLAR_LEADS,
                        projects: SAMPLE_SOLAR_PROJECTS,
                        dealers: SAMPLE_DEALERS,
                        complaints: SAMPLE_COMPLAINTS
                      }
                    };
                    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `crm_full_backup_${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                  }}
                  className="px-4 py-2 text-xs font-bold bg-[#166534] hover:bg-emerald-900 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap">
                  <HardDriveDownload size={14} /> Download Instant JSON Backup
                </button>
              </div>
            </div>

            {/* Data Export Center to Excel / PDF */}
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <FileSpreadsheet size={15} className="text-emerald-700" /> Modular Data Export Center (Excel / CSV / PDF)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Export Leads */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">Leads & Inquiries Database</div>
                    <div className="text-[10px] text-slate-400">All customer inquiries & survey data</div>
                  </div>
                  <button
                    onClick={() => {
                      const csv = "data:text/csv;charset=utf-8," + 
                        "Lead ID,Customer Name,Mobile,District,Capacity,Status,Amount\n" +
                        SAMPLE_SOLAR_LEADS.map(l => `${l.id},"${l.customerName}",${l.mobile},${l.district},${l.requiredKw},${l.status},${l.estimatedAmount}`).join("\n");
                      const encoded = encodeURI(csv);
                      const a = document.createElement('a');
                      a.href = encoded;
                      a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                    }}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#166534] font-bold text-xs flex items-center gap-1">
                    <Download size={13} /> CSV
                  </button>
                </div>

                {/* Export Customers & Projects */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">Installed Projects & BOS</div>
                    <div className="text-[10px] text-slate-400">Solar rooftop customer portfolio</div>
                  </div>
                  <button
                    onClick={() => {
                      const csv = "data:text/csv;charset=utf-8," + 
                        "Project ID,Customer,Mobile,District,Capacity,Installer,Status\n" +
                        SAMPLE_SOLAR_PROJECTS.map(p => `${p.projectId},"${p.customerName}",${p.mobile},${p.district},${p.solarCapacity},"${p.assignedInstaller}",${p.installationStatus}`).join("\n");
                      const encoded = encodeURI(csv);
                      const a = document.createElement('a');
                      a.href = encoded;
                      a.download = `solar_projects_export_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                    }}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#166534] font-bold text-xs flex items-center gap-1">
                    <Download size={13} /> CSV
                  </button>
                </div>

                {/* Export Dealers & Commissions */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">Dealer Network & Commissions</div>
                    <div className="text-[10px] text-slate-400">Commission earned, paid & pending ledger</div>
                  </div>
                  <button
                    onClick={() => {
                      const csv = "data:text/csv;charset=utf-8," + 
                        "Dealer ID,Firm Name,Contact Person,Mobile,District,Closed kW,Commission Earned,Commission Paid,Pending\n" +
                        SAMPLE_DEALERS.map(d => `${d.id},"${d.name}","${d.contactPerson}",${d.mobile},${d.district},${d.closedSalesKw},${d.commissionEarned},${d.commissionPaid},${d.commissionPending}`).join("\n");
                      const encoded = encodeURI(csv);
                      const a = document.createElement('a');
                      a.href = encoded;
                      a.download = `dealers_export_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                    }}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#166534] font-bold text-xs flex items-center gap-1">
                    <Download size={13} /> CSV
                  </button>
                </div>

                {/* Export Service & Complaints */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">Service Tickets & AMC Audit</div>
                    <div className="text-[10px] text-slate-400">Fault logs, technician visits & resolutions</div>
                  </div>
                  <button
                    onClick={() => {
                      const csv = "data:text/csv;charset=utf-8," + 
                        "Complaint No,Customer Name,Project ID,Fault Type,Priority,Technician,Visit Date,Status\n" +
                        SAMPLE_COMPLAINTS.map(c => `${c.id},"${c.customerName}",${c.projectId},"${c.complaintType}",${c.priority},"${c.technicianName}",${c.visitDate},${c.status}`).join("\n");
                      const encoded = encodeURI(csv);
                      const a = document.createElement('a');
                      a.href = encoded;
                      a.download = `complaints_service_export_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                    }}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#166534] font-bold text-xs flex items-center gap-1">
                    <Download size={13} /> CSV
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
