import React, { useState } from 'react';
import { useAppState, useSession, showToast, formatAUD, logAudit } from '../lib/state';
import { Tenant, SupportTicket, SaaSPlan, McTransaction } from '../lib/types';
import { initialPlans, initialMcTransactions } from '../lib/seedData';

interface SuperAdminViewProps {
  onSelectView?: (view: string) => void;
}

export default function SuperAdminView({ onSelectView }: SuperAdminViewProps) {
  const { state, setState } = useAppState();
  const { clearSession, setSession } = useSession();
  const [activeTab, setActiveTab] = useState<'platform' | 'tenants' | 'couple_tenants' | 'plans' | 'audit' | 'support' | 'settings'>('platform');
  const [planCategoryFilter, setPlanCategoryFilter] = useState<'all' | 'couple' | 'mc'>('all');
  const [newPlanCategory, setNewPlanCategory] = useState<'couple' | 'mc'>('couple');

  // Dynamic SaaS Plans
  const plans: SaaSPlan[] = Array.isArray(state?.plans) && state.plans.length > 0 ? state.plans : initialPlans;
  const tenants: Tenant[] = Array.isArray(state?.tenants) ? state.tenants : [];
  const auditLog: any[] = Array.isArray(state?.auditLog) ? state.auditLog : [];

  // MC Transactions & Billing States
  const mcTransactions: McTransaction[] = Array.isArray(state?.mcTransactions) && state.mcTransactions.length > 0
    ? state.mcTransactions
    : initialMcTransactions;

  const [selectedMcFilter, setSelectedMcFilter] = useState<string>('all');
  const [txnTypeFilter, setTxnTypeFilter] = useState<string>('all');
  const [txnStatusFilter, setTxnStatusFilter] = useState<string>('all');
  const [txnSearch, setTxnSearch] = useState<string>('');
  const [isFetchingTxns, setIsFetchingTxns] = useState<boolean>(false);
  const [isSyncingXero, setIsSyncingXero] = useState<boolean>(false);
  const [showXeroModal, setShowXeroModal] = useState<boolean>(false);
  const [selectedTxnDetail, setSelectedTxnDetail] = useState<McTransaction | null>(null);
  const [lastXeroSyncTime, setLastXeroSyncTime] = useState<string>('Today at 10:45 AM');
  const [billingSectionFocus, setBillingSectionFocus] = useState<'all' | 'couple_subs' | 'mc_subs' | 'plans'>('couple_subs');

  // Filtered MC Transactions
  const filteredMcTransactions = mcTransactions.filter((txn) => {
    if (selectedMcFilter !== 'all' && txn.tenantId !== selectedMcFilter) return false;
    if (txnTypeFilter !== 'all' && txn.type !== txnTypeFilter) return false;
    if (txnStatusFilter !== 'all' && txn.status !== txnStatusFilter) return false;
    if (txnSearch.trim()) {
      const q = txnSearch.toLowerCase();
      const matchId = txn.id.toLowerCase().includes(q);
      const matchMc = txn.mcName.toLowerCase().includes(q) || txn.businessName.toLowerCase().includes(q);
      const matchDesc = txn.description.toLowerCase().includes(q);
      const matchCouple = txn.weddingCouple ? txn.weddingCouple.toLowerCase().includes(q) : false;
      const matchXero = txn.xeroInvoiceId ? txn.xeroInvoiceId.toLowerCase().includes(q) : false;
      if (!matchId && !matchMc && !matchDesc && !matchCouple && !matchXero) return false;
    }
    return true;
  });

  // Handler to filter transactions by MC and scroll to table
  

  // Live fetch latest transactions from MCs and invoices
  const handleFetchMcTransactions = () => {
    setIsFetchingTxns(true);
    setTimeout(() => {
      const currentTxns = state.mcTransactions && state.mcTransactions.length > 0 ? state.mcTransactions : initialMcTransactions;
      const existingTxnInvoiceIds = new Set(currentTxns.map((t) => t.invoiceId).filter(Boolean));

      const newTxnsFromInvoices: McTransaction[] = [];
      (state.invoices || []).forEach((inv) => {
        if (!existingTxnInvoiceIds.has(inv.id)) {
          newTxnsFromInvoices.push({
            id: `TXN-${Math.floor(8845 + Math.random() * 100)}`,
            date: inv.date || 'Today, Just now',
            tenantId: 'ten1',
            mcName: 'Robert Galati',
            businessName: 'Galati MC & Entertainment',
            type: 'client_invoice',
            description: `Wedding Host Booking: ${inv.couple} (${inv.id})`,
            amount: inv.amount,
            platformFee: Math.round(inv.amount * 0.025 * 100) / 100,
            netAmount: Math.round(inv.amount * 0.975 * 100) / 100,
            status: inv.status === 'Paid' ? 'Paid' : 'Pending',
            paymentMethod: inv.status === 'Paid' ? 'Stripe (Visa •••• 4242)' : 'Bank Transfer',
            xeroStatus: inv.status === 'Paid' ? 'Synced' : 'Pending',
            xeroInvoiceId: inv.status === 'Paid' ? `XERO-INV-${Math.floor(8900 + Math.random() * 50)}` : undefined,
            weddingCouple: inv.couple,
            invoiceId: inv.id,
          });
        }
      });

      const updated = [...newTxnsFromInvoices, ...currentTxns];
      setState({ ...state, mcTransactions: updated });
      setIsFetchingTxns(false);
      showToast(`✓ Fetched ${updated.length} latest MC transactions across Stripe & Invoices`, 'success');
    }, 600);
  };

  // Sync pending transactions to Xero Accounting
  const handleSyncToXero = () => {
    setIsSyncingXero(true);
    setTimeout(() => {
      const currentTxns = state.mcTransactions && state.mcTransactions.length > 0 ? state.mcTransactions : initialMcTransactions;
      let count = 0;
      const updatedTxns = currentTxns.map((t) => {
        if (t.xeroStatus === 'Pending') {
          count++;
          return {
            ...t,
            xeroStatus: 'Synced' as const,
            xeroInvoiceId: t.xeroInvoiceId || `XERO-INV-${Math.floor(8850 + Math.random() * 100)}`,
          };
        }
        return t;
      });
      setState({ ...state, mcTransactions: updatedTxns });
      setIsSyncingXero(false);
      setLastXeroSyncTime('Just now');
      showToast(`✓ Reconciled & synced ${count > 0 ? count : 'all'} MC transactions into Xero Chart of Accounts`, 'success');
    }, 700);
  };

  // Export CSV for Xero Bank Feeds
  const handleExportXeroCsv = () => {
    const currentTxns = state.mcTransactions && state.mcTransactions.length > 0 ? state.mcTransactions : initialMcTransactions;
    const headers = ['*Date', '*Amount', 'Payee', 'Description', 'Reference', 'Tax Code', 'Xero Account Code'];
    const rows = currentTxns.map((t) => [
      t.date.split(',')[0],
      t.amount.toFixed(2),
      `"${t.businessName}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.id,
      'GST on Income (10%)',
      t.type === 'subscription' ? '400 - SaaS Subscription Revenue' : '410 - Platform Commission',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `xero_reconciliation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Xero Reconciliation Bank Feed CSV exported', 'success');
  };

  // Helper to extract clean plan key matching available plans
  const getTenantPlanKey = (planStr: string | any): string => {
    if (!planStr || typeof planStr !== 'string') return plans[0]?.key || 'Starter';
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
    payoutSchedule: 'Inbound SaaS Subscriptions (No System Payouts to MCs)',
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
  const [coupleSearch, setCoupleSearch] = useState('');
  const [couplePlanFilter, setCouplePlanFilter] = useState('all');
  const [coupleStatusFilter, setCoupleStatusFilter] = useState('all');
  const [selectedCoupleTenant, setSelectedCoupleTenant] = useState<any | null>(null);

  // Expanded Audit Log filters
  const [auditRoleFilter, setAuditRoleFilter] = useState('all');
  const [auditWeddingFilter, setAuditWeddingFilter] = useState('all');
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
  const [invPhone, setInvPhone] = useState('');
  const [invPlan, setInvPlan] = useState('Pro');

  // Couple Invitation States (Requirement: Super Admin can invite couple to register)
  const [showInviteCoupleModal, setShowInviteCoupleModal] = useState(false);
  const [couplePartner1, setCouplePartner1] = useState('James Wilson');
  const [couplePartner2, setCouplePartner2] = useState('Sophie Carter');
  const [groomEmail, setGroomEmail] = useState('james.wilson@example.com');
  const [brideEmail, setBrideEmail] = useState('sophie.carter@example.com');
  const [groomPhone, setGroomPhone] = useState('0412 345 678');
  const [bridePhone, setBridePhone] = useState('0423 456 789');
  const [showInviteCoupleLinkModal, setShowInviteCoupleLinkModal] = useState(false);
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');

  const handleInviteCoupleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = `${window.location.origin}${window.location.pathname}#register`;
    setGeneratedInviteLink(link);

    const auditEntry = {
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: 'Super Admin',
      role: 'superadmin' as const,
      action: 'Couple Registration Invitation Sent',
      category: 'Tenants',
      details: `Dispatched registration invite link to Groom ${couplePartner1} (${groomEmail}, ${groomPhone}) & Bride ${couplePartner2} (${brideEmail}, ${bridePhone})`,
      wedding: `${couplePartner1} & ${couplePartner2} Wedding`,
      channel: 'Admin Console',
      status: 'Success',
    };

    setState({
      ...state,
      auditLog: [auditEntry, ...(state.auditLog || [])],
    });

    setShowInviteCoupleModal(false);
    setShowInviteCoupleLinkModal(true);
    showToast(`Invitation dispatched for ${couplePartner1} & ${couplePartner2}! Link ready.`, 'success');
  };

  const featureFlags = state.featureFlags || {
    digitalGifting: true,
    aiSeating: true,
    qardPrinting: true,
    photoModeration: false,
    smsReminders: true,
  };

  const supportTickets = state.supportTickets || [];

  const handleImpersonateCouple = (w: any) => {
    const coupleEmail = w.brideEmail || w.groomEmail || `${(w.partner1 || 'couple').toLowerCase()}@demo.test`;
    setSession({
      role: 'couple',
      email: coupleEmail,
      name: `${w.couple} (Couple)`,
      keepSignedIn: true,
      impersonating: true,
      at: Date.now(),
    });
    logAudit(state, setState, 'SuperAdmin Impersonation', 'Platform Admin', 'superadmin', `Impersonating Couple tenancy: ${w.couple}`, 'Security', w.couple);
    showToast(`Impersonating Couple: ${w.couple}`, 'info');
    if (onSelectView) onSelectView('couple');
  };

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
      category: newPlanCategory,
    };

    const newAudit = {
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'SaaS Plan Created',
      user: 'Platform Super Admin',
      role: 'superadmin',
      details: `Created new ${newPlanCategory === 'couple' ? 'Couple' : 'MC'} subscription tier: ${newPlan.key} (${newPlan.price} ${newPlan.billingCycle})`,
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
      phone: invPhone.trim() || '0412 884 991',
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
    setInvPhone('');
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

  const filteredTenants = tenants.filter(t => {
    if (!t) return false;
    const matchSearch = (t.businessName || '').toLowerCase().includes(tenantSearch.toLowerCase()) ||
      (t.contactName || '').toLowerCase().includes(tenantSearch.toLowerCase());
    const tenantKey = getTenantPlanKey(t.plan).toLowerCase();
    const matchPlan = planFilter === 'all' ||
      tenantKey === planFilter.toLowerCase() ||
      (t.plan || '').toLowerCase().includes(planFilter.toLowerCase());
    return matchSearch && matchPlan;
  });

  const filteredAudit = auditLog.filter(a => {
    const matchSearch =
      (a.user || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
      (a.action || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
      (a.details || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
      (a.wedding || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
      (a.ipAddress || '').toLowerCase().includes(auditSearch.toLowerCase());
    const matchCat = auditCategory === 'all' || (a.category || '').toLowerCase() === auditCategory.toLowerCase();
    const matchRole = auditRoleFilter === 'all' || (a.role || '').toLowerCase() === auditRoleFilter.toLowerCase();
    const matchWedding = auditWeddingFilter === 'all' || (a.wedding || '').toLowerCase() === auditWeddingFilter.toLowerCase();
    return matchSearch && matchCat && matchRole && matchWedding;
  });

  const activeTenantsCount = tenants.filter(t => t?.status === 'Active').length;

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
                label: 'Platform Tenants',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="8" y1="22" x2="16" y2="22" />
                  </svg>
                ),
              },
              {
                id: 'couple_tenants',
                label: 'Couple Tenants',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
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
                id: 'audit',
                label: 'Audit Logs',
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
      <main className="flex-1 p-6 md:p-9 overflow-y-auto w-full min-w-0">
        <div className="max-w-[1400px] w-full mx-auto space-y-7">
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
                <div className="text-3xl font-serif font-bold text-[#15110e]">{(state.weddings || []).length}</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Active Couple Tenants</div>
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

                        {/* Quick Couple Directory Table */}
            <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#15110e]">
                    Couple Directory
                  </h3>
                  <div className="text-xs text-[#8b7b6b]">
                    Manage active couple wedding suites &amp; subscriptions
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteCoupleModal(true)}
                    className="btn btn-gold btn-sm"
                  >
                    + Invite Couple
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Couple &amp; Celebration</th>
                      <th>Wedding Date &amp; Venue</th>
                      <th>SaaS Pass Tier</th>
                      <th>Assigned MC / Host</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(state.weddings || []).map((w: any) => {
                      const rawPlanName = w.subscriptionPlan?.name || 'Signature Pro Wedding Suite';
                      const cleanPlan = rawPlanName.replace(' Wedding Suite', '').replace(' Plan', '');
                      const statusStr = w.subscriptionPlan?.status || w.status || 'Active';
                      const coupleEmail = w.brideEmail || w.groomEmail || `${(w.partner1 || 'couple').toLowerCase()}@demo.test`;

                      return (
                        <tr
                          key={w.id}
                          onClick={() => setSelectedCoupleTenant(w)}
                          className="cursor-pointer hover:bg-[#faf7f2] transition-colors"
                        >
                          <td>
                            <strong className="text-sm font-semibold text-[#15110e] block">{w.couple}</strong>
                            <span className="text-[11px] text-[#8b7b6b]">{coupleEmail}</span>
                          </td>
                          <td>
                            <div className="font-medium text-[#15110e]">
                              {(() => {
                                try {
                                  const d = new Date(w.date);
                                  if (!isNaN(d.getTime())) {
                                    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
                                  }
                                } catch {}
                                return w.dateDisplay || w.date;
                              })()}
                            </div>
                            <div className="text-[11px] text-[#8b7b6b]">{w.venue}</div>
                          </td>
                          <td>
                            <span className="bg-[#fcf8f2] text-[#8b6932] border border-[#ebd3a8] px-2 py-0.5 rounded text-xs font-bold">
                              {cleanPlan}
                            </span>
                          </td>
                          <td>
                            <div className="font-medium text-[#15110e]">Robert Galati</div>
                            <div className="text-[11px] text-[#8b7b6b]">Certified MC</div>
                          </td>
                          <td>
                            <span className="tt-pill green">
                              {statusStr}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCoupleTenant(w);
                                }}
                                className="btn btn-outline btn-xs"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
                  Platform Tenants
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="btn btn-gold btn-sm"
                >
                  + Invite Tenant
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Search platform tenant business..."
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
        {/* TAB 2B: COUPLE TENANTS                                           */}
        {/* ================================================================ */}
        {activeTab === 'couple_tenants' && (
          <section className="space-y-6">
            <div className="page-header flex justify-between items-center">
              <div>
                <div className="header-eyebrow text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  ACCOUNTS &amp; CELEBRATIONS
                </div>
                <h1 className="header-title font-serif text-3xl font-bold text-[#15110e]">
                  Couple Tenants
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-0.5">
                  Manage active couple wedding suites, passes, guest quotas, venue configurations, and linked MCs.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteCoupleModal(true)}
                  className="btn btn-gold btn-sm flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>
                  <span>+ Invite Couple</span>
                </button>
              </div>
            </div>

            {/* Couple Tenants Filter & Clean Minimal Data Table */}
            <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Search couple, partners, or venue..."
                  value={coupleSearch}
                  onChange={(e) => setCoupleSearch(e.target.value)}
                  className="text-input max-w-[280px]"
                />
                <select
                  value={couplePlanFilter}
                  onChange={(e) => setCouplePlanFilter(e.target.value)}
                  className="text-input max-w-[170px]"
                >
                  <option value="all">All Plan Tiers</option>
                  <option value="signature">Signature Pro</option>
                  <option value="essential">Essential Pass</option>
                  <option value="couture">Couture Suite</option>
                </select>
                <select
                  value={coupleStatusFilter}
                  onChange={(e) => setCoupleStatusFilter(e.target.value)}
                  className="text-input max-w-[150px]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Planning">Planning</option>
                  <option value="Finalising">Finalising</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Couple &amp; Celebration</th>
                      <th>Wedding Date &amp; Venue</th>
                      <th>SaaS Pass Tier</th>
                      <th>Assigned MC / Host</th>
                      <th>Guests &amp; RSVPs</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(state.weddings || [])
                      .filter((w: any) => {
                        const q = coupleSearch.toLowerCase();
                        const matchSearch =
                          (w.couple || '').toLowerCase().includes(q) ||
                          (w.partner1 || '').toLowerCase().includes(q) ||
                          (w.partner2 || '').toLowerCase().includes(q) ||
                          (w.venue || '').toLowerCase().includes(q) ||
                          (w.brideEmail || '').toLowerCase().includes(q);
                        const planName = (w.subscriptionPlan?.name || 'Signature Pro').toLowerCase();
                        const matchPlan =
                          couplePlanFilter === 'all' ||
                          planName.includes(couplePlanFilter.toLowerCase());
                        const statusStr = (w.subscriptionPlan?.status || w.status || 'Active').toLowerCase();
                        const matchStatus =
                          coupleStatusFilter === 'all' ||
                          statusStr === coupleStatusFilter.toLowerCase();
                        return matchSearch && matchPlan && matchStatus;
                      })
                      .map((w: any) => {
                        const rawPlanName = w.subscriptionPlan?.name || 'Signature Pro Wedding Suite';
                        const cleanPlan = rawPlanName.replace(' Wedding Suite', '').replace(' Plan', '');
                        const planPrice = w.subscriptionPlan?.price || 299;
                        const confirmedCount = w.confirmed || Math.round(w.invited * 0.75);
                        const pct = Math.round((confirmedCount / (w.invited || 1)) * 100);
                        const coupleEmail = w.brideEmail || w.groomEmail || `${(w.partner1 || 'couple').toLowerCase()}@demo.test`;

                        return (
                          <tr
                            key={w.id}
                            onClick={() => setSelectedCoupleTenant(w)}
                            className="cursor-pointer hover:bg-[#faf7f2] transition-colors"
                            title="Click to view couple tenancy dossier & details"
                          >
                            <td>
                              <div className="font-serif font-bold text-sm text-[#15110e]">{w.couple}</div>
                              <div className="text-[11px] text-[#8b7b6b] mt-0.5">{coupleEmail}</div>
                            </td>
                            <td>
                              <div className="text-xs font-semibold text-[#15110e]">{w.dateDisplay || w.date}</div>
                              <div className="text-[11px] text-[#8b7b6b] mt-0.5 truncate max-w-[190px]">{w.venue}</div>
                            </td>
                            <td>
                              <div className="text-xs font-semibold text-[#15110e]">{cleanPlan}</div>
                              <div className="text-[11px] text-[#8b7b6b] font-mono mt-0.5">${planPrice} AUD</div>
                            </td>
                            <td>
                              <div className="text-xs font-semibold text-[#15110e]">
                                {w.selectedMc?.name || 'Robert Galati'}
                              </div>
                              <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                                {w.selectedMc?.isPreferredOwn ? 'Couple Preferred' : 'Platform MC'}
                              </div>
                            </td>
                            <td>
                              <div className="text-xs font-semibold text-[#15110e]">
                                {confirmedCount} / {w.invited} confirmed
                              </div>
                              <div className="text-[11px] text-[#bd9661] font-mono mt-0.5">
                                {pct}% response rate
                              </div>
                            </td>
                            <td>
                              <span className="tt-pill green">
                                {w.subscriptionPlan?.status || 'Active'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 3: PLANS, MC TRANSACTIONS & XERO BILLING                     */}
        {/* ================================================================ */}
        {activeTab === 'plans' && (
          <section className="space-y-6 animate-in fade-in duration-150">
            {/* Top Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#e8ded0]">
              <div>
                <div className="header-eyebrow text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  SUBSCRIPTIONS &amp; BILLING
                </div>
                <h1 className="header-title font-serif text-3xl font-bold text-[#15110e]">
                  Plans &amp; Billing
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Manage MC subscription tiers, review live transaction activity, and reconcile general ledgers in Xero.
                </p>
              </div>
            </div>

            {/* Xero Accounting Notice & Gateway (Clean UI Colors) */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#15110e] text-[#bd9661] font-serif font-bold text-lg flex items-center justify-center shrink-0 border border-[#bd9661]/40">
                  X
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-bold text-base text-[#15110e]">Xero Cloud Accounting</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Sync Connected &bull; Tap &amp; Toast Pty Ltd
                    </span>
                  </div>
                  <p className="text-xs text-[#8b7b6b] mt-0.5">
                    For actual accounting, statutory tax compliance (BAS / GST), and bank reconciliations, the SuperAdmin uses Xero.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSyncToXero}
                  disabled={isSyncingXero}
                  className="px-3 py-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#f2ede4] border border-[#e8ded0] text-xs font-bold text-[#15110e] flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60"
                  title="Sync pending transactions to Xero"
                >
                  <span className={`text-[#bd9661] ${isSyncingXero ? 'animate-spin' : ''}`}>⟳</span>
                  <span>{isSyncingXero ? 'Syncing...' : 'Sync Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowXeroModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] hover:text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span>Open Xero</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* Sub-Section Filter / Focus Tabs */}
            <div className="flex items-center gap-2 border-b border-[#e8ded0] pb-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setBillingSectionFocus('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  billingSectionFocus === 'all'
                    ? 'bg-[#15110e] text-[#dfc194]'
                    : 'text-[#8b7b6b] hover:text-[#15110e] hover:bg-white'
                }`}
              >
                All Billing Overview
              </button>
              <button
                type="button"
                onClick={() => setBillingSectionFocus('couple_subs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  billingSectionFocus === 'couple_subs'
                    ? 'bg-[#15110e] text-[#dfc194]'
                    : 'text-[#8b7b6b] hover:text-[#15110e] hover:bg-white'
                }`}
              >
                <span>Couple Subscriptions ({(state.weddings || []).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setBillingSectionFocus('mc_subs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  billingSectionFocus === 'mc_subs'
                    ? 'bg-[#15110e] text-[#dfc194]'
                    : 'text-[#8b7b6b] hover:text-[#15110e] hover:bg-white'
                }`}
              >
                <span>MC Subscriptions ({tenants.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setBillingSectionFocus('plans')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  billingSectionFocus === 'plans'
                    ? 'bg-[#15110e] text-[#dfc194]'
                    : 'text-[#8b7b6b] hover:text-[#15110e] hover:bg-white'
                }`}
              >
                SaaS Plan Tiers ({plans.length})
              </button>
            </div>

            {/* ============================================================== */}
            {/* 1A. COUPLE SUBSCRIPTIONS TABLE                                 */}
            {/* ============================================================== */}
            {(billingSectionFocus === 'all' || billingSectionFocus === 'couple_subs') && (
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ede4]">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#bd9661]">
                      COUPLE WEDDING PASSES
                    </div>
                    <h2 className="font-serif text-xl font-bold text-[#15110e] mt-0.5 flex items-center gap-2">
                      <span>Couple Subscriptions</span>
                      <span className="text-xs font-sans font-bold bg-[#faf5ed] text-[#bd9661] border border-[#ebd3a8] px-2 py-0.5 rounded-full">
                        {(state.weddings || []).length} Passes
                      </span>
                    </h2>
                    <p className="text-xs text-[#8b7b6b] mt-0.5">
                      Active wedding passes purchased by couples, celebration tiers, and feature entitlements.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-[#e8ded0] text-[10px] uppercase tracking-wider text-[#8b7b6b] bg-[#faf8f5]">
                            <th className="py-3 px-3 font-bold">Couple &amp; Celebration</th>
                            <th className="py-3 px-3 font-bold">Wedding Date &amp; Venue</th>
                            <th className="py-3 px-3 font-bold">Couple SaaS Tier</th>
                            <th className="py-3 px-3 font-bold">Status</th>
                            <th className="py-3 px-3 font-bold">Pass Type</th>
                            <th className="py-3 px-3 font-bold">Assigned MC / Host</th>
                            <th className="py-3 px-3 font-bold">Entitlements</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f2ede4]">
                          {(state.weddings || []).map((w: any) => {
                            const planName = w.subscriptionPlan?.name || 'Signature Pro Wedding Suite';
                            const planPrice = w.subscriptionPlan?.price || 299;
                            const isCouture = planName.toLowerCase().includes('couture');
                            const isEssential = planName.toLowerCase().includes('essential');

                            return (
                              <tr key={w.id} className="hover:bg-[#fbf9f6] transition-colors">
                                <td className="py-3.5 px-3">
                                  <div className="font-serif font-bold text-[#15110e] text-sm">{w.couple}</div>
                                  <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                                    {w.partner1} &amp; {w.partner2}
                                  </div>
                                </td>

                                <td className="py-3.5 px-3">
                                  <div className="font-semibold text-[#15110e]">{w.dateDisplay || w.date}</div>
                                  <div className="text-[11px] text-[#8b7b6b] truncate max-w-[160px]">{w.venue}</div>
                                </td>

                                <td className="py-3.5 px-3">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-[#15110e] text-xs">{planName}</span>
                                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                                      isCouture ? 'bg-purple-100 text-purple-800' : isEssential ? 'bg-[#e2d8cb] text-[#4a3b2c]' : 'bg-[#bd9661] text-[#15110e]'
                                    }`}>
                                      {isCouture ? 'COUTURE' : isEssential ? 'ESSENTIAL' : 'SIGNATURE PRO'}
                                    </span>
                                  </div>
                                  <div className="font-mono text-[11px] text-[#bd9661] font-semibold mt-0.5">
                                    ${planPrice}.00 AUD (One-Time)
                                  </div>
                                </td>

                                <td className="py-3.5 px-3">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                    {w.subscriptionPlan?.status || 'Active'}
                                  </span>
                                </td>

                                <td className="py-3.5 px-3 text-[#15110e] font-medium">
                                  Wedding Pass (Stripe)
                                </td>

                                <td className="py-3.5 px-3">
                                  <div className="font-semibold text-[#15110e]">
                                    {w.selectedMc?.name || 'Robert Galati'}
                                  </div>
                                  <div className="text-[10px] text-[#8b7b6b]">
                                    {w.selectedMc?.isPreferredOwn ? 'Couple Preferred Host' : 'Certified Platform MC'}
                                  </div>
                                </td>

                                <td className="py-3.5 px-3">
                                  <div className="flex flex-wrap gap-1 max-w-xs">
                                    <span className="bg-[#faf5ee] border border-[#ebd3a8] text-[#544332] text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                                      <span className="text-[#bd9661] font-bold">✓</span> Joey AI Concierge
                                    </span>
                                    <span className="bg-[#faf5ee] border border-[#ebd3a8] text-[#544332] text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                                      <span className="text-[#bd9661] font-bold">✓</span> Smart Seating
                                    </span>
                                    <span className="bg-[#faf5ee] border border-[#ebd3a8] text-[#544332] text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                                      <span className="text-[#bd9661] font-bold">✓</span> QaRd Invites
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* 1B. MC / COORDINATOR SUBSCRIPTIONS TABLE                       */}
            {/* ============================================================== */}
            {(billingSectionFocus === 'all' || billingSectionFocus === 'mc_subs') && (
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ede4]">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#bd9661]">
                      MC SAAS MEMBERSHIPS
                    </div>
                    <h2 className="font-serif text-xl font-bold text-[#15110e] mt-0.5 flex items-center gap-2">
                      <span>MC Subscriptions</span>
                      <span className="text-xs font-sans font-bold bg-[#faf5ed] text-[#bd9661] border border-[#ebd3a8] px-2 py-0.5 rounded-full">
                        {tenants.length} Accounts
                      </span>
                    </h2>
                    <p className="text-xs text-[#8b7b6b] mt-0.5">
                      Active MC memberships, public directory listing status, and recurring SaaS billing.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-[#e8ded0] text-[10px] uppercase tracking-wider text-[#8b7b6b] bg-[#faf8f5]">
                            <th className="py-3 px-3 font-bold">MC Agency &amp; Host</th>
                            <th className="py-3 px-3 font-bold">Subscription Plan</th>
                            <th className="py-3 px-3 font-bold">Directory Listing</th>
                            <th className="py-3 px-3 font-bold">Status</th>
                            <th className="py-3 px-3 font-bold">Billing Cycle</th>
                            <th className="py-3 px-3 font-bold">Next Renewal</th>
                            <th className="py-3 px-3 font-bold">Features Entitlements</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f2ede4]">
                          {tenants.map((t) => {
                            const planKey = getTenantPlanKey(t.plan);
                            const matchedPlan = plans.find(p => p.key.toLowerCase() === planKey.toLowerCase());
                            const mcTxnCount = mcTransactions.filter(x => x.tenantId === t.id).length;
                            const isPaidListed = t.isListed !== false && (t.mrr > 0 || !t.plan?.toLowerCase().includes('base'));

                            const featuresList = matchedPlan?.features && matchedPlan.features.length > 0
                              ? matchedPlan.features
                              : planKey === 'Pro'
                              ? [
                                  '★ Public Certified Directory Listing',
                                  'Up to 5 active weddings simultaneously',
                                  'Joey AI Matchmaker recommendations',
                                  'Stripe Connect auto-split payouts',
                                  'Live run sheets & audio cues'
                                ]
                              : planKey === 'Standard'
                              ? [
                                  'Up to 3 active weddings',
                                  'Custom guest QR links',
                                  'Standard email support'
                                ]
                              : [
                                  '1 active wedding at a time',
                                  'Run sheets & private speech prompter',
                                  '⚠️ Unlisted (No directory listing)',
                                  'Standard community support'
                                ];

                            return (
                              <tr key={t.id} className="hover:bg-[#fbf9f6] transition-colors">
                                <td className="py-3.5 px-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-[#15110e] text-[#dfc194] font-bold text-xs flex items-center justify-center shrink-0 border border-[#bd9661]/40">
                                      {t.contactName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                      <div className="font-bold text-[#15110e] text-[13px]">{t.businessName}</div>
                                      <div className="text-[11px] text-[#8b7b6b]">{t.contactName} &bull; {t.email}</div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3.5 px-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-[#15110e] text-xs">{planKey}</span>
                                    {matchedPlan?.badge && (
                                      <span className="text-[9px] bg-[#bd9661] text-[#15110e] font-bold px-1.5 py-0.2 rounded">
                                        {matchedPlan.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-mono text-[11px] text-[#bd9661] font-semibold mt-0.5">
                                    ${t.mrr || (matchedPlan ? matchedPlan.price : 149)} / mo AUD
                                  </div>
                                </td>

                                <td className="py-3.5 px-3">
                                  {isPaidListed ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                                      <span>★</span> Listed (Public)
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1 w-max">
                                      <span>⚠️</span> Unlisted (Base)
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-3">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    t.status === 'Active'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {t.status}
                                  </span>
                                </td>

                                <td className="py-3.5 px-3 text-[#15110e] font-medium">
                                  {t.mrr === 0 ? 'Free Base Tier' : 'Monthly (Stripe)'}
                                </td>

                                <td className="py-3.5 px-3 text-[#8b7b6b]">
                                  {t.status === 'Active' ? '12 Nov 2026' : 'Suspended'}
                                </td>

                                <td className="py-3.5 px-3 max-w-md">
                                  <div className="flex flex-wrap gap-1">
                                    {featuresList.map((feat, fIdx) => (
                                      <span
                                        key={fIdx}
                                        className="bg-[#faf5ee] border border-[#ebd3a8] text-[#544332] text-[10.5px] px-2 py-0.5 rounded-md flex items-center gap-1"
                                        title={feat}
                                      >
                                        <span className="text-[#bd9661] font-bold text-[9px]">✓</span>
                                        <span className="truncate max-w-[200px]">{feat}</span>
                                      </span>
                                    ))}
                                  </div>
                                </td>

                                
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* 3. SAAS SUBSCRIPTION TIER CARDS GRID                           */}
            {/* ============================================================== */}
            {(billingSectionFocus === 'all' || billingSectionFocus === 'plans') && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#bd9661]">
                      TIER CATALOGUE
                    </div>
                    <h2 className="font-serif text-xl font-bold text-[#15110e] mt-0.5">
                      SaaS Subscription Tiers &amp; Pricing
                    </h2>
                    <p className="text-xs text-[#8b7b6b] mt-0.5">
                      {plans.length} configured plans available for couples and certified MCs
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center bg-[#f4efe8] p-1 rounded-lg border border-[#ebdcc9] text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setPlanCategoryFilter('all')}
                        className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          planCategoryFilter === 'all' ? 'bg-[#15110e] text-[#dfc194]' : 'text-[#6b5847]'
                        }`}
                      >
                        All ({plans.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlanCategoryFilter('couple')}
                        className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          planCategoryFilter === 'couple' ? 'bg-[#15110e] text-[#dfc194]' : 'text-[#6b5847]'
                        }`}
                      >
                        Couple ({plans.filter(p => p.category === 'couple').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlanCategoryFilter('mc')}
                        className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          planCategoryFilter === 'mc' ? 'bg-[#15110e] text-[#dfc194]' : 'text-[#6b5847]'
                        }`}
                      >
                        MC ({plans.filter(p => p.category === 'mc').length})
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setNewPlanKey('');
                        setNewPlanCategory('couple');
                        setNewPlanTagline('Smart Wedding Suite with Joey AI Concierge');
                        setNewPlanPrice(299);
                        setNewPlanBilling('AUD / one-time pass');
                        setNewPlanBadge('');
                        setNewPlanFeatured(false);
                        setNewPlanFeatures('Guest list manager with Adults & Kids RSVP counts\nDigital QaRd mobile invitations & dietary tracking\nGift & Wishing Well ledger (0% platform fee)\nSmart Seating Planner with AI auto-seat solver');
                        setShowAddPlanModal(true);
                      }}
                      className="btn btn-gold btn-sm self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>+ Add Plan</span>
                    </button>
                  </div>
                </div>

                <div className="plan-cards-grid">
                  {plans
                    .filter(p => {
                      if (planCategoryFilter === 'all') return true;
                      if (planCategoryFilter === 'couple') return p.category === 'couple';
                      if (planCategoryFilter === 'mc') return p.category === 'mc';
                      return true;
                    })
                    .map((p) => {
                      const planCat = p.category || (p.key.toLowerCase().includes('host') || p.key.toLowerCase().includes('ceremonies') ? 'mc' : 'couple');
                      const subCount = planCat === 'couple'
                        ? (state.weddings || []).length
                        : tenants.filter(t => getTenantPlanKey(t?.plan).toLowerCase() === p.key.toLowerCase()).length;

                      return (
                        <div
                          key={p.id}
                          className={`plan-card ${p.featured ? 'featured' : ''} relative flex flex-col justify-between`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              planCat === 'couple'
                                ? 'bg-[#f4ebe1] text-[#7a5a3a] border border-[#e4d4c2]'
                                : 'bg-[#15110e] text-[#dfc194] border border-[#bd9661]'
                            }`}>
                              {planCat === 'couple' ? 'Couple Plan' : 'MC SaaS Tier'}
                            </span>
                            {p.badge && (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#bd9661] text-[#15110e]">
                                {p.badge}
                              </span>
                            )}
                          </div>

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
                              {(p.features || []).map((feat, fIdx) => (
                                <li key={fIdx}>✓ {feat}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-6 border-t border-[#e8ded0] pt-4 text-xs text-[#8b7b6b] flex justify-between items-center">
                            <span>
                              Active Subscribers: <strong className="text-[#15110e]">{subCount}</strong>
                            </span>
                            <span className="text-[11px] text-[#bd9661] font-semibold">
                              ${p.price * subCount} Total
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}</section>
        )}

        {/* TAB 4: FEATURE FLAGS (Matches superadmin.html)                    */}
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
                <p className="text-xs text-[#8b7b6b] mt-0.5">
                  Complete tamper-evident record of user roles, affected wedding tenancies, actions executed, parameters, and access channels.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," +
                      ["Timestamp,Actor,Role,Action,Wedding,Category,Details,IP,Channel,Status"]
                        .concat(filteredAudit.map(e => `"${e.timestamp}","${e.user}","${e.role}","${e.action}","${e.wedding || 'Platform Global'}","${e.category}","${(e.details || '').replace(/"/g, '""')}","${e.ipAddress || ''}","${e.channel || ''}","${e.status || 'Success'}"`))
                        .join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `system_audit_log_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showToast('Audit log exported to CSV', 'success');
                  }}
                  className="btn btn-outline btn-sm font-bold flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearAuditLog}
                  className="btn btn-outline btn-sm"
                >
                  Clear Log
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
              {/* Comprehensive Filter Toolbar */}
              <div className="flex gap-2.5 flex-wrap items-center">
                <input
                  type="text"
                  placeholder="Search actor, action, wedding, details, IP..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="text-input min-w-[260px] flex-1 max-w-[340px]"
                />

                <select
                  value={auditRoleFilter}
                  onChange={(e) => setAuditRoleFilter(e.target.value)}
                  className="text-input max-w-[150px]"
                >
                  <option value="all">All Roles</option>
                  <option value="couple">Couple</option>
                  <option value="mc">Certified MC</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="guest">Guest</option>
                </select>

                <select
                  value={auditWeddingFilter}
                  onChange={(e) => setAuditWeddingFilter(e.target.value)}
                  className="text-input max-w-[190px]"
                >
                  <option value="all">All Celebrations</option>
                  <option value="Carter & Wilson Wedding">Carter &amp; Wilson Wedding</option>
                  <option value="Miller & Davies Wedding">Miller &amp; Davies Wedding</option>
                  <option value="Platform Global">Platform Global</option>
                </select>

                <select
                  value={auditCategory}
                  onChange={(e) => setAuditCategory(e.target.value)}
                  className="text-input max-w-[160px]"
                >
                  <option value="all">All Categories</option>
                  <option value="Onboarding">Onboarding</option>
                  <option value="Billing">Billing</option>
                  <option value="RSVP">RSVP</option>
                  <option value="Seating">Seating</option>
                  <option value="Run Sheet">Run Sheet</option>
                  <option value="Gifting">Gifting</option>
                  <option value="Feed">Feed</option>
                  <option value="Tenants">Tenants</option>
                  <option value="Security">Security</option>
                </select>

                <div className="text-xs text-[#8b7b6b] ml-auto font-medium">
                  Showing <strong>{filteredAudit.length}</strong> audited events
                </div>
              </div>

              {/* Multi-Column Audit Table */}
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap">Timestamp</th>
                      <th>Actor &amp; User</th>
                      <th>Role</th>
                      <th>Action Executed</th>
                      <th>Target Wedding / Tenancy</th>
                      <th>Category</th>
                      <th>Action Details / Change Summary</th>
                      <th>Origin &amp; Channel</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAudit.map((entry) => {
                      const roleBadge =
                        entry.role === 'couple'
                          ? 'bg-[#f5ede2] text-[#6b5847] border border-[#d5c7b5]'
                          : entry.role === 'mc'
                          ? 'bg-[#15110e] text-[#dfc194]'
                          : entry.role === 'superadmin'
                          ? 'bg-[#1e293b] text-[#94a3b8]'
                          : 'bg-[#f0ebe3] text-[#5c4a3b]';

                      const roleLabel =
                        entry.role === 'couple'
                          ? 'Couple'
                          : entry.role === 'mc'
                          ? 'Certified MC'
                          : entry.role === 'superadmin'
                          ? 'Super Admin'
                          : 'Guest';

                      return (
                        <tr key={entry.id} className="hover:bg-[#fbf9f6] transition-colors">
                          <td className="font-mono text-[11px] text-[#8b7b6b] whitespace-nowrap">
                            {entry.timestamp}
                          </td>
                          <td>
                            <strong className="text-xs font-bold text-[#15110e] block">
                              {entry.user}
                            </strong>
                          </td>
                          <td>
                            <span className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${roleBadge}`}>
                              {roleLabel}
                            </span>
                          </td>
                          <td>
                            <span className="font-semibold text-xs text-[#15110e]">
                              {entry.action}
                            </span>
                          </td>
                          <td>
                            <div className="text-xs font-semibold text-[#15110e]">
                              {entry.wedding || 'Carter & Wilson Wedding'}
                            </div>
                            <span className="text-[10px] text-[#8b7b6b] block">
                              {entry.wedding === 'Platform Global' ? 'System Tenancy' : 'Celebration Suite'}
                            </span>
                          </td>
                          <td>
                            <span className="tt-pill warm">
                              {entry.category || 'General'}
                            </span>
                          </td>
                          <td className="text-xs text-[#4c3d31] max-w-sm leading-relaxed">
                            {entry.details}
                          </td>
                          <td>
                            <div className="text-[11px] font-medium text-[#15110e]">
                              {entry.channel || 'Web Portal'}
                            </div>
                            <span className="font-mono text-[10px] text-[#8b7b6b]">
                              {entry.ipAddress || '101.188.67.21'}
                            </span>
                          </td>
                          <td>
                            <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {entry.status || 'Success'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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
                <svg className="w-5 h-5 text-[#bd9661]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
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
                  <svg className="w-5 h-5 text-[#bd9661]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
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
                    MC Subscription Billing Model
                  </label>
                  <input
                    type="text"
                    value={saSettings.payoutSchedule}
                    onChange={(e) => setSaSettings({ ...saSettings, payoutSchedule: e.target.value })}
                    className="text-input"
                  />
                  <span className="text-[10px] text-[#8b7b6b] block mt-0.5">
                    MCs pay monthly SaaS subscriptions to Tap & Toast. The platform does not disburse payouts to MCs.
                  </span>
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
                <svg className="w-5 h-5 text-[#bd9661]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>
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
                <svg className="w-5 h-5 text-[#bd9661]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
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
                  <svg className="w-5 h-5 text-[#bd9661]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
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
                  Create Snapshot
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
      </div>
      </main>

      {/* ================================================================== */}
      {/* TENANT DETAIL SLIDE DRAWER (Matches superadmin.html)               */}
      {/* ================================================================== */}
      {selectedCoupleTenant && (
          <div
            className="modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedCoupleTenant(null);
            }}
          >
            <div className="modal-card max-w-lg">
              <div className="flex justify-between items-center pb-3 border-b border-[#ebdcc9]">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                    COUPLE TENANCY DOSSIER
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#15110e]">
                    {selectedCoupleTenant.couple}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCoupleTenant(null)}
                  className="text-gray-400 hover:text-black text-xl font-bold cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-3 py-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#faf8f5] rounded-lg border border-[#ebdcc9]">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#8b7b6b]">Partner 1</label>
                    <div className="font-bold text-[#15110e]">{selectedCoupleTenant.partner1}</div>
                    <div className="text-[10.5px] text-[#8b7b6b]">{selectedCoupleTenant.brideEmail || `${selectedCoupleTenant.partner1.toLowerCase()}@demo.test`}</div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#8b7b6b]">Partner 2</label>
                    <div className="font-bold text-[#15110e]">{selectedCoupleTenant.partner2}</div>
                    <div className="text-[10.5px] text-[#8b7b6b]">{selectedCoupleTenant.groomEmail || `${selectedCoupleTenant.partner2.toLowerCase()}@demo.test`}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#8b7b6b]">Wedding Date</label>
                    <div className="font-semibold text-[#15110e]">{selectedCoupleTenant.dateDisplay || selectedCoupleTenant.date}</div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#8b7b6b]">Venue &amp; Region</label>
                    <div className="font-semibold text-[#15110e] truncate">{selectedCoupleTenant.venue}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#8b7b6b]">SaaS Subscription Tier</label>
                    <div className="font-bold text-[#15110e]">{selectedCoupleTenant.subscriptionPlan?.name || 'Signature Pro Wedding Suite'}</div>
                    <div className="text-[10.5px] text-[#bd9661] font-mono">${selectedCoupleTenant.subscriptionPlan?.price || 299} AUD One-Time</div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#8b7b6b]">Assigned MC / Host</label>
                    <div className="font-bold text-[#15110e]">{selectedCoupleTenant.selectedMc?.name || 'Robert Galati'}</div>
                    <div className="text-[10.5px] text-[#8b7b6b]">{selectedCoupleTenant.selectedMc?.businessName || 'Certified MC'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#faf8f5] rounded-lg border border-[#ebdcc9] text-center">
                  <div>
                    <div className="text-[10px] text-[#8b7b6b] uppercase">Invited</div>
                    <div className="font-bold text-sm text-[#15110e]">{selectedCoupleTenant.invited}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8b7b6b] uppercase">Confirmed</div>
                    <div className="font-bold text-sm text-emerald-700">{selectedCoupleTenant.confirmed || Math.round(selectedCoupleTenant.invited * 0.75)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8b7b6b] uppercase">RSVP Rate</div>
                    <div className="font-bold text-sm text-[#bd9661]">
                      {Math.round(((selectedCoupleTenant.confirmed || Math.round(selectedCoupleTenant.invited * 0.75)) / selectedCoupleTenant.invited) * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#ebdcc9]">
                <button
                  type="button"
                  onClick={() => {
                    handleImpersonateCouple(selectedCoupleTenant);
                    setSelectedCoupleTenant(null);
                  }}
                  className="btn btn-gold flex-1 text-xs"
                >
                  Impersonate &amp; Launch Couple Dashboard &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCoupleTenant(null)}
                  className="btn btn-outline text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

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
              {selectedTenant.phone && (
                <div>
                  <label className="field-label">Phone No</label>
                  <div className="text-xs text-[#15110e]">{selectedTenant.phone}</div>
                </div>
              )}
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
                <span className="tt-pill green">Inbound SaaS Subscriptions Active (No MC Payouts)</span>
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
      {/* ================================================================== */}
      {/* INVITE COUPLE TO REGISTER MODAL                                      */}
      {/* ================================================================== */}
      {showInviteCoupleModal && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInviteCoupleModal(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#e8ded0] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#15110e] text-white flex justify-between items-center border-b border-[#29211a]">
              <div>
                <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                  COUPLE INVITATION &bull; SUPER ADMIN
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Invite Couple
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteCoupleModal(false)}
                className="text-white/70 hover:text-[#bd9661] text-xl font-bold cursor-pointer transition-colors p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteCoupleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <p className="text-xs text-[#8b7b6b]">
                  Send a dedicated onboarding invite to the couple. They will receive their invite link with co-host access to configure guest management, RSVPs, and live runsheet sync.
                </p>

                {/* Groom Details */}
                <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#e8ded0] space-y-3">
                  <div className="text-[11px] font-bold text-[#bd9661] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#e8ded0]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#bd9661]" />
                    <span>Groom Details</span>
                  </div>
                  <div>
                    <label className="field-label text-xs font-bold text-[#15110e]">Groom Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. James Wilson"
                      value={couplePartner1}
                      onChange={(e) => setCouplePartner1(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="field-group">
                      <label className="field-label text-xs font-bold text-[#15110e]">Groom Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="james.wilson@example.com"
                        value={groomEmail}
                        onChange={(e) => setGroomEmail(e.target.value)}
                        className="text-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label text-xs font-bold text-[#15110e]">Groom Phone Number *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold font-mono text-[#6b5847] rounded-l select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="0412 345 678"
                          value={groomPhone}
                          onChange={(e) => setGroomPhone(e.target.value)}
                          className="text-input rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bride Details */}
                <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#e8ded0] space-y-3">
                  <div className="text-[11px] font-bold text-[#bd9661] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#e8ded0]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#bd9661]" />
                    <span>Bride Details</span>
                  </div>
                  <div>
                    <label className="field-label text-xs font-bold text-[#15110e]">Bride Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sophie Carter"
                      value={couplePartner2}
                      onChange={(e) => setCouplePartner2(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="field-group">
                      <label className="field-label text-xs font-bold text-[#15110e]">Bride Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="sophie.carter@example.com"
                        value={brideEmail}
                        onChange={(e) => setBrideEmail(e.target.value)}
                        className="text-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label text-xs font-bold text-[#15110e]">Bride Phone Number *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold font-mono text-[#6b5847] rounded-l select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="0423 456 789"
                          value={bridePhone}
                          onChange={(e) => setBridePhone(e.target.value)}
                          className="text-input rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-[#faf8f5] border-t border-[#e8ded0] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteCoupleModal(false)}
                  className="btn btn-outline btn-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold btn-sm cursor-pointer flex items-center gap-2">
                  <span>Send Onboarding Invitation &rarr;</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVITATION LINK READY MODAL */}
      {showInviteCoupleLinkModal && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e8ded0] p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center text-xl">
                ✓
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#15110e]">
                  Couple Invitation Dispatched!
                </h3>
                <p className="text-xs text-[#8b7b6b]">
                  Onboarding link generated for <strong>{couplePartner1} &amp; {couplePartner2}</strong>.
                </p>
              </div>
            </div>

            <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e8ded0] space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                DIRECT ONBOARDING LINK:
              </label>
              <input
                type="text"
                readOnly
                value={generatedInviteLink}
                className="w-full bg-white border border-[#d5c7b5] rounded-lg p-2 text-xs text-[#15110e] font-mono outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0ede6]">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(generatedInviteLink);
                  showToast('Invitation link copied to clipboard!', 'success');
                }}
                className="btn btn-gold btn-sm cursor-pointer"
              >
                Copy Link
              </button>
              <button
                type="button"
                onClick={() => setShowInviteCoupleLinkModal(false)}
                className="btn btn-outline btn-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

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
                  Invite Platform Tenant
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
                  <label className="field-label">Business Name</label>
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
                  <label className="field-label">Tenant Name</label>
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
                    <label className="field-label">Phone No</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold font-mono text-[#6b5847] rounded-l select-none">
                        +61
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="0412 884 991"
                        value={invPhone}
                        onChange={(e) => setInvPhone(e.target.value)}
                        className="text-input rounded-l-none"
                      />
                    </div>
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
                  Create &amp; Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* XERO ACCOUNTING PORTAL MODAL                                   */}
      {/* ============================================================== */}
      {showXeroModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#e8ded0] overflow-hidden space-y-0">
            {/* Xero Header */}
            <div className="bg-[#15110e] text-white p-5 flex items-start justify-between border-b border-[#29211a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2a2119] text-[#bd9661] border border-[#bd9661]/40 font-serif font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
                  X
                </div>
                <div>
                  <div className="text-[10px] tracking-widest uppercase font-bold text-[#bd9661]">
                    Xero Cloud Accounting Integration
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                    Tap &amp; Toast Pty Ltd &bull; General Ledger
                  </h3>
                  <div className="text-[11px] text-[#a09080]">
                    Connected Organisation: <strong>Tap &amp; Toast Pty Ltd (ABN 48 619 204 881)</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowXeroModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-base cursor-pointer transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-3.5 text-[#544332] space-y-1">
                <div className="font-bold text-[12px] flex items-center gap-1.5 text-[#15110e]">
                  <span className="text-[#bd9661]">📘</span> Direct General Ledger &amp; Reconciliation Notice
                </div>
                <p className="leading-relaxed">
                  For actual accounting, BAS / GST tax returns, and bank reconciliation, the SuperAdmin uses Xero. All transactions below are automatically synchronized with your Xero Invoices &amp; Stripe Bank Feed.
                </p>
              </div>

              {/* Xero Chart of Accounts Mapping */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8b7b6b]">
                  Xero Chart of Accounts Mapping:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#faf8f5] border border-[#e8ded0] p-3 rounded-xl">
                    <div className="text-[10px] text-[#8b7b6b]">Account 400 (Revenue)</div>
                    <div className="font-bold text-[#15110e] text-xs mt-0.5">SaaS MC Subscriptions</div>
                    <div className="font-mono text-emerald-700 font-semibold text-[11px] mt-1">$1,496.00 AUD/mo</div>
                  </div>
                  <div className="bg-[#faf8f5] border border-[#e8ded0] p-3 rounded-xl">
                    <div className="text-[10px] text-[#8b7b6b]">Account 410 (Commission)</div>
                    <div className="font-bold text-[#15110e] text-xs mt-0.5">Platform Booking Fees (2.5%)</div>
                    <div className="font-mono text-emerald-700 font-semibold text-[11px] mt-1">$621.25 AUD</div>
                  </div>
                </div>
              </div>

              {/* Direct Links to Xero Portals */}
              <div className="space-y-2 pt-1 border-t border-[#f0ede4]">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8b7b6b]">
                  Quick Access to Xero Modules:
                </div>
                <div className="space-y-1.5">
                  <a
                    href="https://go.xero.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#faf8f5] hover:bg-[#f2ede4] rounded-xl border border-[#e8ded0] text-xs text-[#15110e] font-semibold transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[#bd9661]">📊</span>
                      <span>Xero Dashboard &amp; Bank Reconciliation</span>
                    </span>
                    <span className="text-[#8b7b6b] group-hover:text-[#bd9661] font-bold">↗</span>
                  </a>

                  <a
                    href="https://go.xero.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#faf8f5] hover:bg-[#f2ede4] rounded-xl border border-[#e8ded0] text-xs text-[#15110e] font-semibold transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-700">🧾</span>
                      <span>Xero Sales Invoices &amp; Customer Ledger (38 synced)</span>
                    </span>
                    <span className="text-[#8b7b6b] group-hover:text-[#bd9661] font-bold">↗</span>
                  </a>

                  <a
                    href="https://go.xero.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#faf8f5] hover:bg-[#f2ede4] rounded-xl border border-[#e8ded0] text-xs text-[#15110e] font-semibold transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[#bd9661]">🏛️</span>
                      <span>Australian GST / BAS Summary Reports</span>
                    </span>
                    <span className="text-[#8b7b6b] group-hover:text-[#bd9661] font-bold">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#faf8f5] border-t border-[#e8ded0] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSyncToXero}
                disabled={isSyncingXero}
                className="px-3.5 py-2 rounded-xl bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] text-xs font-bold cursor-pointer transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                <span className={isSyncingXero ? 'animate-spin text-[#bd9661]' : 'text-[#bd9661]'}>⟳</span>
                <span>{isSyncingXero ? 'Syncing...' : 'Sync Pending to Xero'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowXeroModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#e8ded0] bg-white hover:bg-[#faf8f5] text-xs font-bold text-[#8b7b6b] cursor-pointer"
                >
                  Close
                </button>
                <a
                  href="https://go.xero.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#bd9661] hover:bg-[#a6804d] text-white text-xs font-bold cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                >
                  <span>Open go.xero.com</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ============================================================== */}
      {/* TRANSACTION RECEIPT / DETAIL MODAL                             */}
      {/* ============================================================== */}
      {selectedTxnDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e8ded0] overflow-hidden">
            <div className="bg-[#15110e] text-white p-5 flex items-start justify-between">
              <div>
                <div className="text-[10px] tracking-widest uppercase font-bold text-[#bd9661]">
                  TRANSACTION RECEIPT
                </div>
                <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                  {selectedTxnDetail.id}
                </h3>
                <div className="text-[11px] text-[#a09080]">
                  {selectedTxnDetail.date} &bull; {selectedTxnDetail.paymentMethod}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxnDetail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-base cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                <span className="text-[#8b7b6b]">MC Agency:</span>
                <span className="font-bold text-[#15110e] text-right">
                  {selectedTxnDetail.mcName}<br />
                  <small className="text-[#8b7b6b] font-normal">{selectedTxnDetail.businessName}</small>
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                <span className="text-[#8b7b6b]">Transaction Type:</span>
                <span className="font-bold text-[#15110e] capitalize">
                  {selectedTxnDetail.type.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                <span className="text-[#8b7b6b]">Description:</span>
                <span className="font-bold text-[#15110e] text-right max-w-[240px]">
                  {selectedTxnDetail.description}
                </span>
              </div>

              {selectedTxnDetail.weddingCouple && (
                <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                  <span className="text-[#8b7b6b]">Wedding Couple:</span>
                  <span className="font-bold text-[#bd9661]">
                    {selectedTxnDetail.weddingCouple}
                  </span>
                </div>
              )}

              <div className="bg-[#faf8f5] rounded-xl p-3 space-y-1.5 border border-[#e8ded0]">
                <div className="flex justify-between text-[#8b7b6b]">
                  <span>Gross Amount:</span>
                  <span className="font-mono font-bold text-[#15110e]">
                    ${selectedTxnDetail.amount.toFixed(2)} AUD
                  </span>
                </div>
                <div className="flex justify-between text-[#8b7b6b]">
                  <span>Platform Commission (2.5%):</span>
                  <span className="font-mono text-amber-700">
                    -${selectedTxnDetail.platformFee.toFixed(2)} AUD
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold pt-1.5 border-t border-[#e8ded0] text-emerald-800">
                  <span>Net Settled Amount:</span>
                  <span className="font-mono">
                    ${selectedTxnDetail.netAmount.toFixed(2)} AUD
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[#8b7b6b]">Xero Reconciliation:</span>
                <span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#8e6e42] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>✓</span> {selectedTxnDetail.xeroInvoiceId || 'Synced with Xero'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#faf8f5] border-t border-[#e8ded0] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTxnDetail(null)}
                className="px-4 py-2 rounded-xl bg-[#15110e] text-[#dfc194] text-xs font-bold cursor-pointer hover:bg-[#251e18]"
              >
                Close Receipt
              </button>
            </div>
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
                <div className="field-group">
                  <label className="field-label">Plan Target / Audience *</label>
                  <select
                    value={newPlanCategory}
                    onChange={(e) => setNewPlanCategory(e.target.value as 'couple' | 'mc')}
                    className="text-input font-medium"
                  >
                    <option value="couple">Couple Plan (Wedding Pass / Suite)</option>
                    <option value="mc">MC Plan (Platform Membership)</option>
                  </select>
                </div>

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
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs text-[#8b7b6b] font-bold pointer-events-none select-none">$</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1"
                        placeholder="249"
                        value={newPlanPrice}
                        onChange={(e) => setNewPlanPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="text-input input-with-currency"
                        style={{ paddingLeft: '28px' }}
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
