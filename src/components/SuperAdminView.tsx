import React, { useState } from 'react';
import { useAppState, useSession, showToast, formatAUD } from '../lib/state';
import { Tenant, SupportTicket, SaaSPlan } from '../lib/types';
import { initialPlans } from '../lib/seedData';

interface SuperAdminViewProps {
  onSelectView?: (view: string) => void;
}

export default function SuperAdminView({ onSelectView }: SuperAdminViewProps) {
  const { state, setState } = useAppState();
  const { clearSession, setSession } = useSession();
  const [activeTab, setActiveTab] = useState<'platform' | 'tenants' | 'plans' | 'flags' | 'audit' | 'support' | 'settings'>('platform');

  // Dynamic SaaS Plans
  const plans: SaaSPlan[] = state.plans && state.plans.length > 0 ? state.plans : initialPlans;

  // Helper to extract clean plan key matching available plans
  const getTenantPlanKey = (planStr: string): string => {
    if (!planStr) return plans[0]?.key || 'Starter';
    const clean = planStr.trim();
    const direct = plans.find(p => p.key.toLowerCase() === clean.toLowerCase());
    if (direct) return direct.key;
    const prefixMatch = plans.find(p => clean.toLowerCase().startsWith(p.key.toLowerCase()));
    if (prefixMatch) return prefixMatch.key;
    const subMatch = plans.find(p => clean.toLowerCase().includes(p.key.toLowerCase()));
    if (subMatch) return subMatch.key;
    return clean.split(' ')[0] || clean;
  };

  // Super Admin Platform Settings State
  const [saSettings, setSaSettings] = useState({
    platformName: 'Tap & Toast SaaS Global',
    environment: 'Production (v2.4.1 Stable)',
    maintenanceMode: false,
    selfServiceMcRegistration: true,
    stripeAccountId: 'acct_1Mpx99K109849TapToast',
    platformFeePercent: 2.5,
    payoutSchedule: 'Rolling T+2 Business Days',
    primaryCurrency: 'AUD ($)',
    aiEngineModel: 'OpenAI GPT-4o / Claude 3.5 Sonnet',
    aiTemperature: 0.3,
    aiMaxTokens: 2048,
    aiPersonality: 'Warm & Dignified Luxury Concierge',
    enforce2FA: true,
    sessionTimeoutHours: 4,
    logImpersonations: true,
    twilioSenderId: 'TapAndToast',
    sendgridDomain: 'notifications.tapandtoast.com.au',
    lastBackup: 'Today at 03:00 AM UTC',
  });

  // Filters
  const [tenantSearch, setTenantSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditCategory, setAuditCategory] = useState('all');

  // Modals & Drawers
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Add Plan Form State
  const [newPlanKey, setNewPlanKey] = useState('');
  const [newPlanTagline, setNewPlanTagline] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState<number | ''>(199);
  const [newPlanBilling, setNewPlanBilling] = useState('AUD / mo');
  const [newPlanBadge, setNewPlanBadge] = useState('');
  const [newPlanFeatured, setNewPlanFeatured] = useState(false);
  const [newPlanFeatures, setNewPlanFeatures] = useState('');

  // Invite Form
  const [invBiz, setInvBiz] = useState('');
  const [invLead, setInvLead] = useState('');
  const [invEmail, setInvEmail] = useState('');
  const [invPlan, setInvPlan] = useState('Pro');

  const featureFlags = state.featureFlags || {
    digitalGifting: true,
    aiSeating: true,
    qardPrinting: true,
    photoModeration: false,
    smsReminders: true,
  };

  const supportTickets = state.supportTickets || [];

  const handleImpersonate = (tenant: Tenant) => {
    setSession({
      role: 'mc',
      email: tenant.email,
      name: tenant.contactName,
      businessName: tenant.businessName,
      keepSignedIn: true,
      impersonating: true,
      at: Date.now(),
    });
    showToast(`Impersonating ${tenant.contactName} (${tenant.businessName})`, 'info');
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

  const handleChangeTenantPlan = (tenantId: string, newPlanKey: string) => {
    const selectedPlan = plans.find(p => p.key.toLowerCase() === newPlanKey.toLowerCase());
    const mrr = selectedPlan ? selectedPlan.price : 199;
    const planDisplay = selectedPlan ? `${selectedPlan.key} ($${selectedPlan.price}/mo)` : newPlanKey;
    const updatedTenants = state.tenants.map(t => {
      if (t.id === tenantId) {
        return { ...t, plan: planDisplay, mrr };
      }
      return t;
    });
    setState({ ...state, tenants: updatedTenants });
    showToast(`Tenant plan changed to ${selectedPlan?.key || newPlanKey} ($${mrr}/mo)`, 'success');
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanKey.trim()) {
      showToast('Please enter a plan name / tier key', 'error');
      return;
    }
    const numPrice = typeof newPlanPrice === 'number' ? newPlanPrice : parseFloat(String(newPlanPrice)) || 0;
    const featureLines = newPlanFeatures
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const newPlan: SaaSPlan = {
      id: 'plan_' + Date.now(),
      key: newPlanKey.trim(),
      tagline: newPlanTagline.trim() || `${newPlanKey.trim()} Membership`,
      price: numPrice,
      billingCycle: newPlanBilling.trim() || 'AUD / mo',
      features: featureLines.length > 0 ? featureLines : [
        'Unlimited active weddings',
        'Interactive live run sheets & cues',
        'Digital RSVPs & seating arrangements',
        'Standard platform support',
      ],
      badge: newPlanBadge.trim() || undefined,
      featured: newPlanFeatured,
    };

    const newAudit = {
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'SaaS Plan Created',
      user: 'Platform Super Admin',
      role: 'superadmin',
      details: `Created new subscription tier: ${newPlan.key} ($${newPlan.price}/mo)`,
      category: 'Billing',
    };

    const currentPlans = state.plans && state.plans.length > 0 ? state.plans : initialPlans;
    const updatedPlans = [...currentPlans, newPlan];

    setState({
      ...state,
      plans: updatedPlans,
      auditLog: [newAudit, ...state.auditLog],
    });

    setShowAddPlanModal(false);
    setNewPlanKey('');
    setNewPlanTagline('');
    setNewPlanPrice(199);
    setNewPlanBadge('');
    setNewPlanFeatured(false);
    setNewPlanFeatures('');
    showToast(`Successfully created new plan: "${newPlan.key}"!`, 'success');
  };

  const handleToggleFlag = (key: keyof typeof featureFlags) => {
    const nextVal = !featureFlags[key];
    const updatedFlags = { ...featureFlags, [key]: nextVal };
    const newAuditEntry = {
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Feature Flag Toggled',
      user: 'Platform Super Admin',
      role: 'superadmin',
      details: `${key} set to ${nextVal ? 'Enabled' : 'Disabled'}`,
      category: 'General',
    };
    setState({
      ...state,
      featureFlags: updatedFlags,
      auditLog: [newAuditEntry, ...state.auditLog],
    });
    showToast(`Feature Flag: ${key} is now ${nextVal ? 'Enabled' : 'Disabled'}`, 'info');
  };

  const handleClearAuditLog = () => {
    setState({ ...state, auditLog: [] });
    showToast('Audit log records reset', 'info');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invBiz || !invLead || !invEmail) return;
    const selectedPlan = plans.find(p => p.key.toLowerCase() === invPlan.toLowerCase()) || plans[0];
    const mrr = selectedPlan ? selectedPlan.price : 199;
    const planDisplay = selectedPlan ? `${selectedPlan.key} ($${selectedPlan.price}/mo)` : invPlan;
    const newTenant: Tenant = {
      id: 'ten_' + Date.now(),
      businessName: invBiz,
      contactName: invLead,
      email: invEmail,
      plan: planDisplay,
      weddingsCount: 0,
      mrr,
      status: 'Active',
      createdAt: 'Today',
    };
    const newAudit = {
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'MC Tenant Invited',
      user: 'Super Admin',
      role: 'superadmin',
      details: `Onboarded ${invBiz} (${planDisplay} plan)`,
      category: 'Tenants',
    };
    setState({
      ...state,
      tenants: [newTenant, ...state.tenants],
      auditLog: [newAudit, ...state.auditLog],
    });
    setShowInviteModal(false);
    setInvBiz('');
    setInvLead('');
    setInvEmail('');
    showToast(`Onboarded new MC tenant: ${invBiz}!`, 'success');
  };

  const handleToggleTicketStatus = (ticketId: string) => {
    const updatedTickets = supportTickets.map(t => {
      if (t.id === ticketId) {
        const nextStatus = t.status === 'Resolved' ? 'Open' : 'Resolved';
        return { ...t, status: nextStatus as any };
      }
      return t;
    });
    setState({ ...state, supportTickets: updatedTickets });
    showToast('Ticket status updated', 'success');
  };

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReplyText.trim() || !selectedTicket) return;
    const newMsg = {
      sender: 'Super Admin Support',
      time: 'Just now',
      text: ticketReplyText.trim(),
      isAdmin: true,
    };
    const updatedTicket: SupportTicket = {
      ...selectedTicket,
      status: 'In Progress',
      messages: [...selectedTicket.messages, newMsg],
    };
    const updatedTickets = supportTickets.map(t => (t.id === selectedTicket.id ? updatedTicket : t));
    setState({ ...state, supportTickets: updatedTickets });
    setSelectedTicket(updatedTicket);
    setTicketReplyText('');
    showToast('Reply sent to tenant helpdesk', 'success');
  };

  const handleLogout = () => {
    clearSession();
    showToast('Signed out of Super Admin Console', 'info');
    if (onSelectView) onSelectView('login');
  };

  const filteredTenants = state.tenants.filter(t => {
    const matchSearch = t.businessName.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.contactName.toLowerCase().includes(tenantSearch.toLowerCase());
    const tenantKey = getTenantPlanKey(t.plan).toLowerCase();
    const matchPlan = planFilter === 'all' ||
      tenantKey === planFilter.toLowerCase() ||
      t.plan.toLowerCase().includes(planFilter.toLowerCase());
    return matchSearch && matchPlan;
  });

  const filteredAudit = state.auditLog.filter(a => {
    const matchSearch = a.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.details.toLowerCase().includes(auditSearch.toLowerCase());
    const matchCat = auditCategory === 'all' || a.category.toLowerCase() === auditCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  const activeTenantsCount = state.tenants.filter(t => t.status === 'Active').length;

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-45px)] bg-[#f8f6f2] font-sans select-none">
      {/* Sidebar matching superadmin.html & Screenshot 7 */}
      <aside className="w-full md:w-[240px] bg-[#15110e] text-[#d9c9b8] flex flex-col justify-between border-r border-[#29211a] flex-shrink-0">
        <div>
          {/* Sidebar Brand */}
          <div className="p-5 pb-4 flex items-center gap-2.5 border-b border-[#231b14]">
            <span className="tt-mark inline-grid place-items-center w-6 h-6 border border-[#bd9661] text-[#bd9661] font-serif font-bold text-sm rounded-[3px]">
              T
            </span>
            <span className="font-serif text-[18px] text-white font-semibold tracking-wide">
              Tap <span className="gold-amp">&amp;</span> Toast
            </span>
          </div>

          {/* Sidebar Menu */}
          <nav className="p-2 flex flex-col gap-1">
            {[
              {
                id: 'platform',
                label: 'Platform Operations',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                  </svg>
                ),
              },
              {
                id: 'tenants',
                label: 'MC Tenants',
                badge: state.tenants.length,
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                id: 'plans',
                label: 'Plans & Billing',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
              },
              {
                id: 'flags',
                label: 'Feature Flags',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                ),
              },
              {
                id: 'audit',
                label: 'Audit Logs',
                badge: state.auditLog.length,
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                ),
              },
              {
                id: 'support',
                label: 'Support Tickets',
                badge: supportTickets.filter(t => t.status !== 'Resolved').length,
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
              },
              {
                id: 'settings',
                label: 'Platform Settings',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                ),
              },
            ].map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-[13.5px] transition-all border-l-[3px] cursor-pointer ${
                    isActive
                      ? 'bg-[#2b221a] text-[#fce4ca] font-bold border-l-[#bd9661]'
                      : 'text-[#bfaea0] hover:text-white hover:bg-[#251e18] border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#bd9661]' : 'text-[#bfaea0]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-semibold bg-[#2a2119] text-[#dfc194] px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#231b14] text-xs">
          <div className="text-[10px] uppercase tracking-wider text-[#8c7b6c] mb-1">Signed in as</div>
          <div className="font-semibold text-[#dfc194]">Platform Super Admin</div>
          <div className="text-[11px] text-[#8c7b6c] mb-3">SUPER ADMIN</div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-1.5 px-3 border border-[#3d3126] text-[#d9c9b8] hover:text-white hover:bg-[#231c16] rounded text-xs transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-9 overflow-y-auto max-w-[1400px]">
        {/* ================================================================ */}
        {/* TAB 1: PLATFORM OPERATIONS (Matches Screenshot 7 & superadmin.html) */}
        {/* ================================================================ */}
        {activeTab === 'platform' && (
          <section className="space-y-7">
            {/* Page Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  GLOBAL OVERVIEW
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e] leading-tight">
                  Platform Operations
                </h1>
              </div>
            </div>

            {/* 4 Metric Cards matching Screenshot 7 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">{activeTenantsCount}</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Active MC Tenants</div>
              </div>

              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">$18,450</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Monthly Recurring Revenue (AUD)</div>
              </div>

              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">24</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Active Weddings Managed</div>
              </div>

              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">3,120</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Total Guest Profiles</div>
              </div>
            </div>

            {/* Inline SVG Chart Card matching Screenshot 7 */}
            <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-serif text-lg font-bold text-[#15110e]">
                  MRR Revenue Growth (AUD) &amp; Booking Volume
                </h2>
                <span className="tt-pill green">
                  99.98% Service Uptime
                </span>
              </div>

              <div className="w-full h-[220px] mt-3">
                <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#bd9661" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#bd9661" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="50" y1="30" x2="780" y2="30" stroke="#f0e9df" strokeWidth="1" />
                  <line x1="50" y1="80" x2="780" y2="80" stroke="#f0e9df" strokeWidth="1" />
                  <line x1="50" y1="130" x2="780" y2="130" stroke="#f0e9df" strokeWidth="1" />
                  <line x1="50" y1="170" x2="780" y2="170" stroke="#e0d5c5" strokeWidth="1.5" />

                  {/* Y-Axis Labels */}
                  <text x="15" y="34" fontSize="10" fill="#8c7b6c">$20k</text>
                  <text x="15" y="84" fontSize="10" fill="#8c7b6c">$15k</text>
                  <text x="15" y="134" fontSize="10" fill="#8c7b6c">$10k</text>
                  <text x="15" y="174" fontSize="10" fill="#8c7b6c">$5k</text>

                  {/* Months X-Axis */}
                  <text x="100" y="190" fontSize="11" fill="#8c7b6c">May 2026</text>
                  <text x="240" y="190" fontSize="11" fill="#8c7b6c">Jun 2026</text>
                  <text x="380" y="190" fontSize="11" fill="#8c7b6c">Jul 2026</text>
                  <text x="520" y="190" fontSize="11" fill="#8c7b6c">Aug 2026</text>
                  <text x="640" y="190" fontSize="11" fill="#8c7b6c">Sep 2026</text>
                  <text x="750" y="190" fontSize="11" fill="#8c7b6c">Oct 2026</text>

                  {/* Area Fill */}
                  <path d="M 120 150 L 260 135 L 400 110 L 540 85 L 660 60 L 760 38 L 760 170 L 120 170 Z" fill="url(#chartGrad)" />

                  {/* Trend Line */}
                  <path d="M 120 150 L 260 135 L 400 110 L 540 85 L 660 60 L 760 38" fill="none" stroke="#bd9661" strokeWidth="3" strokeLinecap="round" />

                  {/* Data Points */}
                  <circle cx="120" cy="150" r="4.5" fill="#15110e" stroke="#bd9661" strokeWidth="2" />
                  <circle cx="260" cy="135" r="4.5" fill="#15110e" stroke="#bd9661" strokeWidth="2" />
                  <circle cx="400" cy="110" r="4.5" fill="#15110e" stroke="#bd9661" strokeWidth="2" />
                  <circle cx="540" cy="85" r="4.5" fill="#15110e" stroke="#bd9661" strokeWidth="2" />
                  <circle cx="660" cy="60" r="4.5" fill="#15110e" stroke="#bd9661" strokeWidth="2" />
                  <circle cx="760" cy="38" r="5" fill="#bd9661" stroke="#ffffff" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Quick Tenant Table */}
            <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#15110e]">
                    MC Tenant Directory
                  </h3>
                  <div className="text-xs text-[#8b7b6b]">
                    Manage active multi-tenant instances
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="btn btn-gold btn-sm"
                >
                  + Invite MC
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>MC Business &amp; Contact</th>
                      <th>Plan Tier</th>
                      <th>Active Weddings</th>
                      <th>MRR</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.tenants.map(t => (
                      <tr key={t.id}>
                        <td>
                          <strong className="text-sm font-semibold text-[#15110e] block">{t.businessName}</strong>
                          <span className="text-[11px] text-[#8b7b6b]">{t.contactName} ({t.email})</span>
                        </td>
                        <td>
                          <select
                            value={getTenantPlanKey(t.plan)}
                            onChange={(e) => handleChangeTenantPlan(t.id, e.target.value)}
                            className="text-input py-1 px-2 text-xs max-w-[130px] font-medium"
                          >
                            {plans.map(p => (
                              <option key={p.id} value={p.key}>{p.key} (${p.price}/mo)</option>
                            ))}
                          </select>
                        </td>
                        <td className="font-semibold">{t.weddingsCount} weddings</td>
                        <td className="font-bold text-emerald-700">${t.mrr}/mo</td>
                        <td>
                          <span
                            onClick={() => handleToggleTenantStatus(t.id)}
                            className={`tt-pill ${t.status === 'Active' ? 'green' : t.status === 'Trial' ? 'warm' : 'danger'} cursor-pointer`}
                            title="Click to toggle status"
                          >
                            {t.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleTenantStatus(t.id)}
                              className="btn btn-outline btn-xs"
                            >
                              {t.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedTenant(t)}
                              className="btn btn-outline btn-xs"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 2: MC TENANTS (Matches superadmin.html)                       */}
        {/* ================================================================ */}
        {activeTab === 'tenants' && (
          <section className="space-y-6">
            <div className="page-header flex justify-between items-center">
              <div>
                <div className="header-eyebrow text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  ACCOUNTS
                </div>
                <h1 className="header-title font-serif text-3xl font-bold text-[#15110e]">
                  MC Tenants
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="btn btn-gold btn-sm"
              >
                + Invite MC
              </button>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Search MC business..."
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  className="text-input max-w-[280px]"
                />
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="text-input max-w-[160px]"
                >
                  <option value="all">All Plans</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.key}>{p.key}</option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>MC Business &amp; Contact</th>
                      <th>Plan Tier</th>
                      <th>Active Weddings</th>
                      <th>MRR</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTenants.map(t => (
                      <tr key={t.id}>
                        <td>
                          <strong className="text-sm font-semibold text-[#15110e] block">{t.businessName}</strong>
                          <span className="text-[11px] text-[#8b7b6b]">{t.contactName} &bull; {t.email}</span>
                        </td>
                        <td>
                          <select
                            value={getTenantPlanKey(t.plan)}
                            onChange={(e) => handleChangeTenantPlan(t.id, e.target.value)}
                            className="text-input py-1 px-2 text-xs max-w-[130px] font-medium"
                          >
                            {plans.map(p => (
                              <option key={p.id} value={p.key}>{p.key} (${p.price}/mo)</option>
                            ))}
                          </select>
                        </td>
                        <td className="font-semibold">{t.weddingsCount} weddings</td>
                        <td className="font-bold text-emerald-700">${t.mrr}/mo</td>
                        <td>
                          <span className={`tt-pill ${t.status === 'Active' ? 'green' : t.status === 'Trial' ? 'warm' : 'danger'}`}>
                            {t.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleTenantStatus(t.id)}
                              className="btn btn-outline btn-xs"
                            >
                              {t.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedTenant(t)}
                              className="btn btn-outline btn-xs"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 3: PLANS & BILLING (Matches superadmin.html)                  */}
        {/* ================================================================ */}
        {activeTab === 'plans' && (
          <section className="space-y-6">
            <div className="page-header flex justify-between items-center">
              <div>
                <div className="header-eyebrow text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  SUBSCRIPTIONS
                </div>
                <h1 className="header-title font-serif text-3xl font-bold text-[#15110e]">
                  Plans &amp; Billing
                </h1>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewPlanKey('');
                  setNewPlanTagline('');
                  setNewPlanPrice(249);
                  setNewPlanBilling('AUD / mo');
                  setNewPlanBadge('');
                  setNewPlanFeatured(false);
                  setNewPlanFeatures('Up to 5 active weddings at a time\nQaRd physical QR code printing\nAI Seating Optimization Assistant\nFull client messaging suite');
                  setShowAddPlanModal(true);
                }}
                className="btn btn-gold btn-sm"
              >
                + Add Plan
              </button>
            </div>

            <div className="plan-cards-grid">
              {plans.map(p => {
                const subCount = state.tenants.filter(t => getTenantPlanKey(t.plan).toLowerCase() === p.key.toLowerCase()).length;
                return (
                  <div
                    key={p.id}
                    className={`plan-card ${p.featured ? 'featured' : ''} relative flex flex-col justify-between`}
                  >
                    {p.badge && (
                      <div className="plan-featured-badge">{p.badge}</div>
                    )}
                    <div>
                      <div className={`text-xs tracking-wider font-bold uppercase ${p.featured ? 'text-[#bd9661]' : 'text-[#8b7b6b]'}`}>
                        {p.key}
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-[#15110e] mt-1">
                        {p.tagline}
                      </h3>
                      <div className="plan-price mt-3">
                        ${p.price} <small className="text-sm text-[#8b7b6b] font-normal">{p.billingCycle || 'AUD / mo'}</small>
                      </div>
                      <ul className="text-xs text-[#5a4b3d] space-y-2 list-none p-0 mt-4">
                        {p.features.map((feat, fIdx) => (
                          <li key={fIdx}>✓ {feat}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 border-t border-[#e8ded0] pt-4 text-xs text-[#8b7b6b] flex justify-between items-center">
                      <span>
                        Active Subscribers: <strong className="text-[#15110e]">{subCount}</strong>
                      </span>
                      <span className="text-[11px] text-[#bd9661] font-semibold">
                        ${p.price * subCount}/mo MRR
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 4: FEATURE FLAGS (Matches superadmin.html)                    */}
        {/* ================================================================ */}
        {activeTab === 'flags' && (
          <section className="space-y-6">
            <div className="page-header">
              <div>
                <div className="header-eyebrow text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  ENVIRONMENT CONTROLS
                </div>
                <h1 className="header-title font-serif text-3xl font-bold text-[#15110e]">
                  Feature Flags
                </h1>
              </div>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm max-w-[760px]">
              <div className="toggle-switch-row">
                <div className="switch-label">
                  <strong>Stripe Digital Gifting &amp; Wishing Well</strong>
                  <small>Enable guest contributions via Apple Pay / Credit Card across wedding portals</small>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={featureFlags.digitalGifting}
                    onChange={() => handleToggleFlag('digitalGifting')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-switch-row">
                <div className="switch-label">
                  <strong>AI Seating Optimization Assistant</strong>
                  <small>Allow couples and MCs to auto-generate seat pairings by dietary and party constraints</small>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={featureFlags.aiSeating}
                    onChange={() => handleToggleFlag('aiSeating')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-switch-row">
                <div className="switch-label">
                  <strong>Custom QaRd Printing Pipeline</strong>
                  <small>Render high-resolution 300 DPI vector PDF print outputs for wedding stationery</small>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={featureFlags.qardPrinting}
                    onChange={() => handleToggleFlag('qardPrinting')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-switch-row">
                <div className="switch-label">
                  <strong>Real-time Photo Wall Moderation</strong>
                  <small>Enable instant live photo stream with couple pre-approval filters</small>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={featureFlags.photoModeration}
                    onChange={() => handleToggleFlag('photoModeration')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-switch-row">
                <div className="switch-label">
                  <strong>Automated SMS RSVP Reminders</strong>
                  <small>Trigger automated Twilio SMS reminders 14 days before RSVP cutoff</small>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={featureFlags.smsReminders}
                    onChange={() => handleToggleFlag('smsReminders')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 5: AUDIT LOG (Matches superadmin.html)                        */}
        {/* ================================================================ */}
        {activeTab === 'audit' && (
          <section className="space-y-6">
            <div className="page-header flex justify-between items-center">
              <div>
                <div className="header-eyebrow text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  COMPLIANCE &amp; LOGGING
                </div>
                <h1 className="header-title font-serif text-3xl font-bold text-[#15110e]">
                  System Audit Log
                </h1>
              </div>
              <button
                type="button"
                onClick={handleClearAuditLog}
                className="btn btn-outline btn-sm"
              >
                Clear Log
              </button>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Filter audit trail..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="text-input max-w-[280px]"
                />
                <select
                  value={auditCategory}
                  onChange={(e) => setAuditCategory(e.target.value)}
                  className="text-input max-w-[180px]"
                >
                  <option value="all">All Categories</option>
                  <option value="RSVP">RSVP</option>
                  <option value="Seating">Seating</option>
                  <option value="Gifting">Gifting</option>
                  <option value="Feed">Feed</option>
                  <option value="Tenants">Tenants</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Actor</th>
                      <th>Action</th>
                      <th>Category</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAudit.map(entry => (
                      <tr key={entry.id}>
                        <td className="font-mono text-xs text-[#8b7b6b] whitespace-nowrap">{entry.timestamp}</td>
                        <td className="font-bold text-[#15110e]">{entry.user}</td>
                        <td>{entry.action}</td>
                        <td>
                          <span className="tt-pill warm">{entry.category || 'General'}</span>
                        </td>
                        <td className="text-xs text-[#4c3d31]">{entry.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 6: SUPPORT TICKETS (Matches superadmin.html)                  */}
        {/* ================================================================ */}
        {activeTab === 'support' && (
          <section className="space-y-6">
            <div className="page-header">
              <div>
                <div className="header-eyebrow text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  HELPDESK
                </div>
                <h1 className="header-title font-serif text-3xl font-bold text-[#15110e]">
                  Support Tickets
                </h1>
              </div>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-[6px] shadow-sm overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Tenant</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {supportTickets.map(t => (
                    <tr key={t.id}>
                      <td className="font-bold">{t.id}</td>
                      <td className="font-semibold text-[#15110e]">{t.tenant}</td>
                      <td className="text-xs">{t.subject}</td>
                      <td>
                        <span className={`tt-pill ${t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'warm' : 'green'}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`tt-pill ${t.status === 'Resolved' ? 'green' : t.status === 'In Progress' ? 'warm' : 'lavender'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="text-xs text-[#8b7b6b]">{t.date}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleTicketStatus(t.id)}
                            className="btn btn-outline btn-xs"
                          >
                            {t.status === 'Resolved' ? 'Reopen' : 'Resolve'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedTicket(t)}
                            className="btn btn-gold btn-xs"
                          >
                            View &rarr;
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* TAB 7: PLATFORM SETTINGS                                           */}
        {/* ================================================================== */}
        {activeTab === 'settings' && (
          <section className="space-y-6 max-w-5xl">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                GLOBAL SAAS OPERATIONS
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                Platform System Settings
              </h1>
              <p className="text-xs text-[#8b7b6b] mt-1">
                Configure global SaaS infrastructure, Stripe payment gateways, Joey AI reasoning models, authentication security, and disaster recovery snapshots.
              </p>
            </div>

            {/* Section 1: SaaS Global Environment & Maintenance */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                <span className="text-lg">🌐</span>
                <h3 className="font-serif text-base font-bold text-[#15110e]">SaaS Infrastructure &amp; Operation Mode</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Platform Brand / Instance Name
                  </label>
                  <input
                    type="text"
                    value={saSettings.platformName}
                    onChange={(e) => setSaSettings({ ...saSettings, platformName: e.target.value })}
                    className="text-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Deployment Environment
                  </label>
                  <input
                    type="text"
                    disabled
                    value={saSettings.environment}
                    className="text-input bg-[#faf7f2] cursor-not-allowed text-[#6b5849] font-mono text-xs"
                  />
                </div>
              </div>

              <div className="divide-y divide-[#f0ede4] pt-2">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <strong className="text-xs text-[#15110e] block">Global Platform Maintenance Mode</strong>
                    <span className="text-[11px] text-[#8b7b6b]">
                      When activated, couples and guests see a polite maintenance notice. Super Admin and MC consoles remain operational.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={saSettings.maintenanceMode}
                      onChange={(e) => setSaSettings({ ...saSettings, maintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <strong className="text-xs text-[#15110e] block">Self-Service MC Tenant Registrations</strong>
                    <span className="text-[11px] text-[#8b7b6b]">
                      Allow prospective wedding MCs and entertainment agencies to self-register via the public register portal.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={saSettings.selfServiceMcRegistration}
                      onChange={(e) => setSaSettings({ ...saSettings, selfServiceMcRegistration: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Stripe Billing & Payment Gateway */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💳</span>
                  <h3 className="font-serif text-base font-bold text-[#15110e]">Stripe Connect &amp; Wishing Well Gateway</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Stripe Live Connected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Stripe Account ID
                  </label>
                  <input
                    type="text"
                    value={saSettings.stripeAccountId}
                    onChange={(e) => setSaSettings({ ...saSettings, stripeAccountId: e.target.value })}
                    className="text-input font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Platform Wishing Well Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={saSettings.platformFeePercent}
                    onChange={(e) => setSaSettings({ ...saSettings, platformFeePercent: Number(e.target.value) })}
                    className="text-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Payout Schedule
                  </label>
                  <input
                    type="text"
                    value={saSettings.payoutSchedule}
                    onChange={(e) => setSaSettings({ ...saSettings, payoutSchedule: e.target.value })}
                    className="text-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#8b7b6b]">Automated Webhook status: <strong>active (100% health, 0 dropped events)</strong></span>
                <button
                  type="button"
                  onClick={() => showToast('Simulated Stripe webhook ping (charge.succeeded) received 200 OK', 'success')}
                  className="btn btn-outline btn-xs"
                >
                  ⚡ Test Webhook Simulator
                </button>
              </div>
            </div>

            {/* Section 3: AI Joey Assistant Architecture */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                <span className="text-lg">🤖</span>
                <h3 className="font-serif text-base font-bold text-[#15110e]">Joey AI Wedding Assistant Engine</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    LLM Foundation Model
                  </label>
                  <select
                    value={saSettings.aiEngineModel}
                    onChange={(e) => setSaSettings({ ...saSettings, aiEngineModel: e.target.value })}
                    className="text-input"
                  >
                    <option value="OpenAI GPT-4o / Claude 3.5 Sonnet">OpenAI GPT-4o / Claude 3.5 Sonnet (Hybrid)</option>
                    <option value="OpenAI GPT-4o Mini">OpenAI GPT-4o Mini (Cost Efficient)</option>
                    <option value="Anthropic Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet (High Nuance)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Reasoning Temperature
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={saSettings.aiTemperature}
                    onChange={(e) => setSaSettings({ ...saSettings, aiTemperature: Number(e.target.value) })}
                    className="text-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Personality Persona
                  </label>
                  <input
                    type="text"
                    value={saSettings.aiPersonality}
                    onChange={(e) => setSaSettings({ ...saSettings, aiPersonality: e.target.value })}
                    className="text-input"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Security & Authentication */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                <span className="text-lg">🛡️</span>
                <h3 className="font-serif text-base font-bold text-[#15110e]">Security, Authentication &amp; Audit</h3>
              </div>

              <div className="divide-y divide-[#f0ede4]">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <strong className="text-xs text-[#15110e] block">Mandatory 2FA for All MC Tenants</strong>
                    <span className="text-[11px] text-[#8b7b6b]">Require authenticator app verification (TOTP) when logging in from new devices.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={saSettings.enforce2FA}
                      onChange={(e) => setSaSettings({ ...saSettings, enforce2FA: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <strong className="text-xs text-[#15110e] block">Immutable Impersonation Logging</strong>
                    <span className="text-[11px] text-[#8b7b6b]">Every Super Admin impersonation session is cryptographically signed and stored in audit log.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={saSettings.logImpersonations}
                      onChange={(e) => setSaSettings({ ...saSettings, logImpersonations: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 5: Backup & Disaster Recovery */}
            <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💾</span>
                  <strong className="font-serif text-base text-[#15110e]">Database Snapshots &amp; Disaster Recovery</strong>
                </div>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Last automated cloud snapshot: <strong>{saSettings.lastBackup}</strong> &bull; Point-in-time recovery enabled.
                </p>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSaSettings({ ...saSettings, lastBackup: 'Just now (Manual Snapshot)' });
                    showToast('✓ Instant cloud snapshot captured and archived to cold storage!', 'success');
                  }}
                  className="btn btn-outline btn-sm"
                >
                  📸 Create Snapshot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('✓ Platform system settings updated and synchronized across all nodes!', 'success');
                  }}
                  className="btn btn-gold btn-sm"
                >
                  Save Platform Settings
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ================================================================== */}
      {/* TENANT DETAIL SLIDE DRAWER (Matches superadmin.html)               */}
      {/* ================================================================== */}
      {selectedTenant && (
        <div
          className="slide-drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTenant(null);
          }}
        >
          <div className="slide-drawer">
            <div className="drawer-header">
              <div>
                <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                  TENANT RECORD
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  {selectedTenant.businessName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTenant(null)}
                className="text-white hover:text-[#bd9661] text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="drawer-body space-y-4">
              <div>
                <label className="field-label">Lead Host / MC</label>
                <div className="font-bold text-[#15110e]">{selectedTenant.contactName}</div>
              </div>
              <div>
                <label className="field-label">Email</label>
                <div className="text-xs text-[#15110e]">{selectedTenant.email}</div>
              </div>
              <div>
                <label className="field-label">Current Subscription</label>
                <div className="flex items-center gap-2 mt-1">
                  <select
                    value={getTenantPlanKey(selectedTenant.plan)}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      const selectedPlan = plans.find(p => p.key.toLowerCase() === newKey.toLowerCase());
                      const mrr = selectedPlan ? selectedPlan.price : 199;
                      const planDisplay = selectedPlan ? `${selectedPlan.key} ($${selectedPlan.price}/mo)` : newKey;
                      const updated = { ...selectedTenant, plan: planDisplay, mrr };
                      setSelectedTenant(updated);
                      handleChangeTenantPlan(selectedTenant.id, newKey);
                    }}
                    className="text-input py-1.5 px-2 text-xs flex-1 font-semibold"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.key}>{p.key} (${p.price}/mo)</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Managed Weddings Volume</label>
                <div className="text-xs text-[#15110e]">{selectedTenant.weddingsCount} active events in system</div>
              </div>
              <div>
                <label className="field-label">Stripe Connect Status</label>
                <span className="tt-pill green">Verified &amp; Payouts Active</span>
              </div>
              <div>
                <label className="field-label">Platform Onboarding Date</label>
                <div className="text-xs text-[#8b7b6b]">{selectedTenant.createdAt}</div>
              </div>

              <div className="pt-6 border-t border-[#e8ded0] space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handleImpersonate(selectedTenant);
                    setSelectedTenant(null);
                  }}
                  className="w-full btn btn-gold"
                >
                  Impersonate &amp; Open Console &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleToggleTenantStatus(selectedTenant.id);
                    setSelectedTenant(null);
                  }}
                  className="w-full btn btn-outline"
                >
                  {selectedTenant.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* SUPPORT CONVERSATION DRAWER (Matches superadmin.html)             */}
      {/* ================================================================== */}
      {selectedTicket && (
        <div
          className="slide-drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTicket(null);
          }}
        >
          <div className="slide-drawer">
            <div className="drawer-header">
              <div>
                <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                  TICKET RESOLUTION &bull; {selectedTicket.id}
                </div>
                <h3 className="font-serif text-lg font-bold text-white truncate max-w-[340px]">
                  {selectedTicket.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-white hover:text-[#bd9661] text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="drawer-body flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-3 bg-[#fdfbf7] border border-[#e8ded0] rounded-lg text-xs">
                  <div><strong>Tenant:</strong> {selectedTicket.tenant}</div>
                  <div><strong>Priority:</strong> <span className="font-semibold">{selectedTicket.priority}</span> &bull; <strong>Status:</strong> {selectedTicket.status}</div>
                </div>

                <div className="space-y-3 pt-2">
                  {selectedTicket.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg text-xs space-y-1 ${
                        m.isAdmin
                          ? 'bg-[#15110e] text-[#f8f6f2] border border-[#2b221a]'
                          : 'bg-[#faf7f2] border border-[#e8ded0] text-[#15110e]'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <strong className={m.isAdmin ? 'text-[#dfc194]' : 'text-[#8b7b6b]'}>{m.sender}</strong>
                        <span className={m.isAdmin ? 'text-[#a8988a]' : 'text-[#8b7b6b]'}>{m.time}</span>
                      </div>
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendTicketReply} className="pt-4 border-t border-[#e8ded0] space-y-2">
                <textarea
                  rows={3}
                  value={ticketReplyText}
                  onChange={(e) => setTicketReplyText(e.target.value)}
                  placeholder="Type official admin resolution message..."
                  className="text-input resize-none text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleTicketStatus(selectedTicket.id)}
                    className="btn btn-outline btn-xs"
                  >
                    {selectedTicket.status === 'Resolved' ? 'Reopen Ticket' : 'Mark Resolved'}
                  </button>
                  <button type="submit" className="btn btn-gold btn-xs">
                    Send Reply &rarr;
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* INVITE MC MODAL                                                    */}
      {/* ================================================================== */}
      {showInviteModal && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInviteModal(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e8ded0] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#15110e] text-white flex justify-between items-center border-b border-[#29211a]">
              <div>
                <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                  TENANT ONBOARDING
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Invite New MC Tenant
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-white/70 hover:text-[#bd9661] text-xl font-bold cursor-pointer transition-colors p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleInviteSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="field-group">
                  <label className="field-label">MC Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hunter Valley Wedding Hosts"
                    value={invBiz}
                    onChange={(e) => setInvBiz(e.target.value)}
                    className="text-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Lead MC Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dean Campbell"
                    value={invLead}
                    onChange={(e) => setInvLead(e.target.value)}
                    className="text-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="field-group">
                    <label className="field-label">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="dean@hvmc.com.au"
                      value={invEmail}
                      onChange={(e) => setInvEmail(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Subscription Tier</label>
                    <select
                      value={invPlan}
                      onChange={(e) => setInvPlan(e.target.value)}
                      className="text-input"
                    >
                      {plans.map(p => (
                        <option key={p.id} value={p.key}>{p.key} (${p.price}/mo)</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-[#faf8f5] border-t border-[#e8ded0] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn btn-outline btn-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold btn-sm cursor-pointer">
                  Send Invitation &amp; Create Tenant &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* ADD NEW SAAS PLAN MODAL                                            */}
      {/* ================================================================== */}
      {showAddPlanModal && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddPlanModal(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#e8ded0] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#15110e] text-white flex justify-between items-center border-b border-[#29211a]">
              <div>
                <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                  SAAS TIER CONFIGURATION
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Create New SaaS Plan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPlanModal(false)}
                className="text-white/70 hover:text-[#bd9661] text-xl font-bold cursor-pointer transition-colors p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePlan} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="field-group">
                    <label className="field-label">Plan Name / Tier Key *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VIP Host, Elite, Diamond"
                      value={newPlanKey}
                      onChange={(e) => setNewPlanKey(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Monthly Price (AUD) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-[#8b7b6b] font-semibold">$</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1"
                        placeholder="249"
                        value={newPlanPrice}
                        onChange={(e) => setNewPlanPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="text-input pl-7"
                      />
                    </div>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Tagline / Target Audience *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boutique Agencies & Luxury Celebrants"
                    value={newPlanTagline}
                    onChange={(e) => setNewPlanTagline(e.target.value)}
                    className="text-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="field-group">
                    <label className="field-label">Badge Label (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. MOST POPULAR, NEW, EXCLUSIVE"
                      value={newPlanBadge}
                      onChange={(e) => setNewPlanBadge(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Billing Cycle Text</label>
                    <input
                      type="text"
                      placeholder="AUD / mo"
                      value={newPlanBilling}
                      onChange={(e) => setNewPlanBilling(e.target.value)}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newPlanFeatured}
                      onChange={(e) => setNewPlanFeatured(e.target.checked)}
                      className="w-4 h-4 text-[#bd9661] rounded border-[#d4c5b3] focus:ring-[#bd9661]"
                    />
                    <span className="text-xs font-semibold text-[#15110e]">
                      Highlight as Featured / Most Popular Card
                    </span>
                  </label>
                </div>

                <div className="field-group">
                  <label className="field-label">Plan Features (1 per line)</label>
                  <textarea
                    rows={4}
                    placeholder="Enter features, each on a new line:&#10;Up to 5 active weddings&#10;QaRd physical QR code printing&#10;AI Seating Optimization Assistant"
                    value={newPlanFeatures}
                    onChange={(e) => setNewPlanFeatures(e.target.value)}
                    className="text-input text-xs resize-none"
                  />
                  <span className="text-[11px] text-[#8b7b6b] mt-1 block">
                    Each line becomes a bullet point with a checkmark on the plan card.
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 bg-[#faf8f5] border-t border-[#e8ded0] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="btn btn-outline btn-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold btn-sm cursor-pointer">
                  + Create SaaS Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
