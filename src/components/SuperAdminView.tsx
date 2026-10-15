import React, { useState } from 'react';
import { useAppState, useSession, showToast, formatAUD } from '../lib/state';

interface SuperAdminViewProps {
  onSelectView?: (view: string) => void;
}

export default function SuperAdminView({ onSelectView }: SuperAdminViewProps) {
  const { state, setState } = useAppState();
  const { setSession } = useSession();
  const [activeTab, setActiveTab] = useState<'tenants' | 'audit' | 'metrics'>('tenants');

  const handleImpersonate = (tenantId: string) => {
    setSession({
      role: 'mc',
      email: 'robert@galati.demo',
      name: 'Robert Galati',
      businessName: 'Galati MC & Entertainment',
      keepSignedIn: true,
      impersonating: true,
      at: Date.now()
    });
    showToast('Impersonation active: viewing as Robert Galati', 'info');
    if (onSelectView) onSelectView('mc');
  };

  const handleToggleTenantStatus = (tenantId: string) => {
    const updatedTenants = state.tenants.map(t => {
      if (t.id === tenantId) {
        const nextStatus = t.status === 'Active' ? 'Suspended' : 'Active';
        return { ...t, status: nextStatus as any };
      }
      return t;
    });
    setState({ ...state, tenants: updatedTenants });
    showToast('Tenant status updated', 'success');
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8ded0] pb-5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6b21a8] bg-[#f6eefe] px-2.5 py-0.5 rounded border border-[#e0c8fb]">
            Global Platform Administration
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#15110e] mt-1">
            Tap &amp; Toast Super Admin
          </h1>
          <p className="text-xs text-[#8b7b6b]">
            Platform operations, multi-tenant billing, and security event auditing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Status: 99.98% Operational
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Monthly Recurring Revenue</span>
          <div className="font-serif text-3xl font-bold text-[#15110e] mt-1">$14,250 <span className="text-xs font-sans text-emerald-600 font-bold">+18.4%</span></div>
          <div className="text-[11px] text-[#8b7b6b] mt-0.5">Stripe Connected</div>
        </div>
        <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Active MC Tenants</span>
          <div className="font-serif text-3xl font-bold text-[#15110e] mt-1">{state.tenants.length}</div>
          <div className="text-[11px] text-[#3c6a42] font-semibold mt-0.5">3 Pro, 1 Standard</div>
        </div>
        <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Total Live Weddings</span>
          <div className="font-serif text-3xl font-bold text-[#bd9661] mt-1">16</div>
          <div className="text-[11px] text-[#8b7b6b] mt-0.5">Across 4 tenants</div>
        </div>
        <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Gifting Processed</span>
          <div className="font-serif text-3xl font-bold text-[#15110e] mt-1">$182.4k</div>
          <div className="text-[11px] text-[#8b7b6b] mt-0.5">Zero payout incidents</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e8ded0] gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('tenants')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'tenants' ? 'border-[#6b21a8] text-[#6b21a8]' : 'border-transparent text-[#8b7b6b] hover:text-[#15110e]'
          }`}
        >
          🏢 Tenant Accounts ({state.tenants.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'audit' ? 'border-[#6b21a8] text-[#6b21a8]' : 'border-transparent text-[#8b7b6b] hover:text-[#15110e]'
          }`}
        >
          🔒 Security Audit Log ({state.auditLog.length})
        </button>
      </div>

      {/* Tenants Table */}
      {activeTab === 'tenants' && (
        <div className="bg-white border border-[#e8ded0] rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f2eb] text-[#8b7b6b] uppercase text-[10px] font-bold tracking-wider border-b border-[#e8ded0]">
              <tr>
                <th className="py-3 px-4">Business / Lead MC</th>
                <th className="py-3 px-4">Plan &amp; MRR</th>
                <th className="py-3 px-4">Weddings</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2ede7]">
              {state.tenants.map(t => (
                <tr key={t.id} className="hover:bg-[#fdfbf7] transition-colors">
                  <td className="py-3 px-4">
                    <strong className="text-[#15110e] block">{t.businessName}</strong>
                    <span className="text-[11px] text-[#8b7b6b]">{t.contactName} ({t.email})</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#15110e]">{t.plan}</span>
                    <span className="text-[11px] text-[#3c6a42] block">${t.mrr}/mo</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#15110e]">{t.weddingsCount} weddings</td>
                  <td className="py-3 px-4">
                    <span
                      onClick={() => handleToggleTenantStatus(t.id)}
                      className={`cursor-pointer inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        t.status === 'Active'
                          ? 'bg-[#e8eee4] text-[#3c6a42] border border-[#d1dfcb]'
                          : 'bg-[#fbeae8] text-[#a8382c] border border-[#f2c7c2]'
                      }`}
                      title="Click to toggle status"
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleImpersonate(t.id)}
                      className="bg-[#15110e] hover:bg-[#bd9661] hover:text-[#15110e] text-white text-[11px] font-bold px-3 py-1.5 rounded transition-colors"
                    >
                      Open as MC &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Log Table */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-[#e8ded0] rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f2eb] text-[#8b7b6b] uppercase text-[10px] font-bold tracking-wider border-b border-[#e8ded0]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2ede7]">
              {state.auditLog.map(entry => (
                <tr key={entry.id} className="hover:bg-[#fdfbf7] transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-[#8b7b6b]">{entry.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-[#15110e]">{entry.user}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#bd9661]">{entry.action}</span>
                  </td>
                  <td className="py-3 px-4 text-[#4a3e35]">{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
