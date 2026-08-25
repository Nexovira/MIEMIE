import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { AdminUser } from '../../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  KeyRound, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  MessageCircle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  RefreshCw,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { createUserWithEmailAndPassword, auth } from '../../lib/firebase';

export const AdminAccounts: React.FC = () => {
  const { admins, addAdminUser, deleteAdminUser } = useStore();
  const { currentUser } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'superadmin' | 'inventory_manager' | 'curator'>('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notes, setNotes] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success modal/card after creating an account
  const [createdAccount, setCreatedAccount] = useState<{
    displayName: string;
    email: string;
    password: string;
    role: string;
  } | null>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Generate strong random password
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let generated = 'TWM-';
    for (let i = 0; i < 8; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    generated += '!';
    setPassword(generated);
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 3000);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setCreating(true);

    try {
      // 1. Attempt to register with Firebase Auth
      let uid = `admin-${Date.now()}`;
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        if (userCred && userCred.user) {
          uid = userCred.user.uid;
        }
      } catch (authErr: any) {
        if (authErr.code === 'auth/email-already-in-use') {
          // Account already exists in Firebase Auth, update profile record in Firestore
          uid = `existing-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
        } else if (authErr.code === 'auth/weak-password') {
          setError('Password is too weak. Please use at least 6 characters.');
          setCreating(false);
          return;
        } else {
          console.warn('Firebase Auth user creation notice:', authErr);
        }
      }

      // 2. Persist Admin record to Firestore for live sync across all devices
      await addAdminUser({
        uid,
        email: cleanEmail,
        displayName: displayName.trim() || 'Store Administrator',
        role,
        createdBy: currentUser?.email || 'Owner',
        notes: notes.trim() || undefined
      });

      // 3. Display credentials clearly for immediate sending to owner/admin
      setCreatedAccount({
        displayName: displayName.trim() || 'Store Administrator',
        email: cleanEmail,
        password,
        role
      });

      // Clear form
      setDisplayName('');
      setEmail('');
      setPassword('');
      setNotes('');
    } catch (err: any) {
      setError(err.message || 'Failed to create admin account.');
    } finally {
      setCreating(false);
    }
  };

  const shareViaWhatsApp = (account: { email: string; password: string; displayName: string }) => {
    const portalUrl = window.location.origin;
    const msg = `👑 *Thrift With Miemie - Admin Portal Access*\n\nHello ${account.displayName},\nYour administrative account has been activated:\n\n🔗 *Portal Link:* ${portalUrl}\n📧 *Email:* ${account.email}\n🔑 *Password:* ${account.password}\n\nPlease sign in to manage thrift inventory, photos, and customer orders.`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-[#1E1611] tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#D95A2B]" />
            <span>Admin Accounts & Team Access</span>
          </h2>
          <p className="text-xs text-[#7A6E65]">
            Create new administrator accounts, assign curator roles, and send secure access credentials instantly.
          </p>
        </div>
      </div>

      {/* Success Notification Modal / Card for Created Account */}
      {createdAccount && (
        <div className="p-6 bg-[#1E1611] text-[#FBF9F5] rounded-3xl border-2 border-[#D95A2B] shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Admin Account Created & Synchronized Live!</span>
            </div>
            <button
              onClick={() => setCreatedAccount(null)}
              className="text-stone-400 hover:text-white text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-stone-300">
            Save or send these credentials now. You can copy them with 1-click or share directly to WhatsApp.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#2A2019] p-4 rounded-2xl border border-[#3E2F26]">
            {/* Email Field */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#D95A2B] tracking-wider">Admin Email</span>
              <div className="flex items-center justify-between bg-[#1E1611] px-3 py-2 rounded-xl border border-[#3E2F26]">
                <span className="text-xs font-mono font-bold text-white select-all">{createdAccount.email}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdAccount.email, 'email')}
                  className="text-stone-400 hover:text-white p-1"
                  title="Copy email"
                >
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#D95A2B] tracking-wider">Admin Password</span>
              <div className="flex items-center justify-between bg-[#1E1611] px-3 py-2 rounded-xl border border-[#3E2F26]">
                <span className="text-xs font-mono font-bold text-amber-300 select-all">{createdAccount.password}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdAccount.password, 'password')}
                  className="text-stone-400 hover:text-white p-1"
                  title="Copy password"
                >
                  {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                const creds = `Thrift With Miemie Admin Login:\nURL: ${window.location.origin}\nEmail: ${createdAccount.email}\nPassword: ${createdAccount.password}`;
                copyToClipboard(creds, 'all');
              }}
              className="bg-white hover:bg-stone-200 text-[#1E1611] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedField === 'all' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#D95A2B]" />}
              <span>{copiedField === 'all' ? 'Copied Full Credentials!' : '1-Click Copy All Login Details'}</span>
            </button>

            <button
              type="button"
              onClick={() => shareViaWhatsApp(createdAccount)}
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send Credentials via WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Create Form on Left, Active List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Create Form */}
        <div className="lg:col-span-5 bg-[#FBF9F5] p-6 sm:p-7 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-5">
          <div className="flex items-center gap-2 font-display text-base font-bold text-[#1E1611]">
            <UserPlus className="w-5 h-5 text-[#D95A2B]" />
            <span>Create New Admin Account</span>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs sm:text-sm">
            
            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26] flex items-center justify-between">
                <span>Admin Name / Display Name</span>
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Miemie (Curator) or Blessing (Assistant)"
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thriftwithmiemie.com"
                  className="w-full pl-10 pr-3 py-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#3E2F26]">Secure Password</label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-[11px] font-bold text-[#D95A2B] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Generate Password</span>
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter or generate password"
                  className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border border-[#DCD5C9] font-mono text-xs focus:outline-hidden focus:border-[#D95A2B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-[#1E1611] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Role & Permissions</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
              >
                <option value="admin">Store Admin (Full Catalog & Content Access)</option>
                <option value="superadmin">Super Admin / Owner (Miemie)</option>
                <option value="inventory_manager">Inventory Manager (Stock & Pricing Only)</option>
                <option value="curator">Curator / Photo Assistant</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Notes / Department (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Egbeda warehouse dispatch team"
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] text-xs focus:outline-hidden focus:border-[#D95A2B]"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3.5 px-4 bg-[#D95A2B] hover:bg-[#C04C20] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {creating ? (
                <span>⏳ Creating & Syncing Account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Admin & Generate Credentials</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Column: Active Admins List */}
        <div className="lg:col-span-7 bg-[#FBF9F5] p-6 sm:p-7 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-display text-base font-bold text-[#1E1611]">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Active Administrators ({admins.length})</span>
            </div>
            <span className="text-[11px] text-[#7A6E65] font-semibold">Live Real-Time Sync</span>
          </div>

          <div className="space-y-3">
            {admins.map((admin) => (
              <div 
                key={admin.uid}
                className="p-4 bg-white rounded-2xl border border-[#E7E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-[#D95A2B]/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-[#1E1611]">
                      {admin.displayName || 'Administrator'}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      admin.role === 'superadmin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : admin.role === 'inventory_manager'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-[#FFEFEA] text-[#D95A2B]'
                    }`}>
                      {admin.role.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-[#5A4E45] flex items-center gap-2 font-mono">
                    <span>{admin.email}</span>
                  </div>

                  {admin.notes && (
                    <div className="text-[11px] text-[#7A6E65] italic">
                      Note: {admin.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(admin.email, admin.uid);
                    }}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                    title="Copy admin email"
                  >
                    {copiedField === admin.uid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {admin.email !== 'owner@thriftwithmiemie.com' && admin.uid !== currentUser?.uid && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Revoke admin access for ${admin.email}?`)) {
                          deleteAdminUser(admin.uid);
                        }
                      }}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                      title="Revoke access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
