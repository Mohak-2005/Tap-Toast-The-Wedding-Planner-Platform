import React, { useState } from 'react';
import { useAppState, useSession, showToast, logAudit } from '../lib/state';
import { PrivateRunSheetItem, Client, Invoice, Wedding, Guest, TeamMember } from '../lib/types';
import JoeyChatbot from './JoeyChatbot';
import McReferralsSection from './McReferralsSection';
import SeatingPlannerSection from './SeatingPlannerSection';
import CoupleView, { CoupleTab } from './CoupleView';

interface McViewProps {
  onSelectView?: (view: string) => void;
}


// ============================================================================
// MC GIFT & WISHING WELL LEDGER SECTION COMPONENT
// ============================================================================
interface McGiftLedgerSectionProps {
  state: any;
  setState: any;
  weddingName?: string;
  onAddGiftClick: () => void;
  mcGiftSearch: string;
  setMcGiftSearch: (s: string) => void;
  mcGiftTypeFilter: 'all' | 'wishing-well' | 'envelope' | 'gift';
  setMcGiftTypeFilter: (f: 'all' | 'wishing-well' | 'envelope' | 'gift') => void;
}

function McGiftLedgerSection({
  state,
  setState,
  weddingName,
  onAddGiftClick,
  mcGiftSearch,
  setMcGiftSearch,
  mcGiftTypeFilter,
  setMcGiftTypeFilter,
}: McGiftLedgerSectionProps) {
  const gifts = Array.isArray(state?.gifts) ? state.gifts : [];
  
  const filteredGifts = gifts.filter((g: any) => {
    const q = (mcGiftSearch || '').toLowerCase();
    const matchQ = (g.guestName || '').toLowerCase().includes(q) || (g.message || '').toLowerCase().includes(q);
    const gType = (g.type || '').toLowerCase();
    const matchType =
      mcGiftTypeFilter === 'all'
        ? true
        : mcGiftTypeFilter === 'wishing-well'
        ? gType.includes('well')
        : mcGiftTypeFilter === 'envelope'
        ? gType.includes('envelope') || gType.includes('cash')
        : !gType.includes('well') && !gType.includes('envelope');
    return matchQ && matchType;
  });

  const totalAmount = gifts.reduce((sum: number, g: any) => sum + Number(g.amount || 0), 0);
  const digitalGifts = gifts.filter((g: any) => (g.type || '').toLowerCase().includes('well'));
  const digitalAmount = digitalGifts.reduce((sum: number, g: any) => sum + Number(g.amount || 0), 0);
  const envelopeGifts = gifts.filter((g: any) => (g.type || '').toLowerCase().includes('envelope') || (g.type || '').toLowerCase().includes('cash'));
  const envelopeAmount = envelopeGifts.reduce((sum: number, g: any) => sum + Number(g.amount || 0), 0);
  const sentCount = gifts.filter((g: any) => g.thankYouSent || g.thankYouStatus === 'Sent' || g.thankYouStatus === 'Completed').length;
  const dueCount = gifts.length - sentCount;

  const toggleThankYou = (giftId: string) => {
    const updated = gifts.map((g: any) => {
      if (g.id === giftId) {
        const nextSent = !g.thankYouSent;
        return {
          ...g,
          thankYouSent: nextSent,
          thankYouStatus: nextSent ? 'Sent' : 'Due',
        };
      }
      return g;
    });
    setState({ ...state, gifts: updated });
    showToast('Thank-you status updated', 'info');
  };

  const removeGift = (giftId: string, name: string) => {
    if (window.confirm(`Remove gift entry from ${name}?`)) {
      setState({
        ...state,
        gifts: gifts.filter((g: any) => g.id !== giftId),
      });
      showToast(`Removed gift entry`, 'info');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#e8ded0]">
        <div>
          <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
            FINANCIAL RECEPTION RECONCILIATION
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#15110e]">
            Gift &amp; Wishing Well Ledger
          </h1>
          <p className="text-xs text-[#8b7b6b] mt-1">
            {weddingName ? `Live gift pool and reception records for ${weddingName}.` : 'Live reception monetary tracking, wishing well contributions, and cash envelope logging.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => showToast('Gift ledger exported to CSV file', 'success')}
            className="btn btn-outline btn-sm text-xs font-semibold flex items-center gap-1.5"
          >
            <span>📊</span> Export CSV
          </button>
          <button
            type="button"
            onClick={onAddGiftClick}
            className="btn btn-gold btn-sm text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <span>+</span> Record Cash / Envelope Gift
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">Total Received Gifts</div>
          <div className="text-2xl font-serif font-bold text-[#15110e] mt-1">
            ${totalAmount.toLocaleString()}<span className="text-xs font-sans text-[#8b7b6b] font-normal"> .00 AUD</span>
          </div>
          <div className="text-[11px] text-[#bd9661] font-semibold mt-1">
            {gifts.length} guest gifts recorded
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-emerald-600 rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">Digital Wishing Well</div>
          <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
            ${digitalAmount.toLocaleString()}<span className="text-xs font-sans text-[#8b7b6b] font-normal"> .00 AUD</span>
          </div>
          <div className="text-[11px] text-[#8b7b6b] mt-1">
            {digitalGifts.length} online transfers via Gift &amp; Go
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-amber-600 rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">Reception Cash &amp; Envelopes</div>
          <div className="text-2xl font-serif font-bold text-amber-900 mt-1">
            ${envelopeAmount.toLocaleString()}<span className="text-xs font-sans text-[#8b7b6b] font-normal"> .00 AUD</span>
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            {envelopeGifts.length} physical cards received at reception
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#15110e] rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">Thank-You Note Status</div>
          <div className="text-2xl font-serif font-bold text-[#15110e] mt-1">
            {sentCount} <span className="text-sm font-sans font-normal text-[#8b7b6b]">Sent</span> / {dueCount} <span className="text-sm font-sans font-normal text-amber-700">Due</span>
          </div>
          <div className="text-[11px] text-[#8b7b6b] mt-1">
            Automated couple thank-you tracker
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search gifts by guest name or blessing note..."
              value={mcGiftSearch}
              onChange={(e) => setMcGiftSearch(e.target.value)}
              className="w-full bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'all', label: `All Gifts (${gifts.length})` },
              { id: 'wishing-well', label: `Wishing Well (${digitalGifts.length})` },
              { id: 'envelope', label: `Reception Envelopes (${envelopeGifts.length})` },
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setMcGiftTypeFilter(pill.id as any)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  mcGiftTypeFilter === pill.id
                    ? 'bg-[#15110e] text-[#dfc194] font-bold'
                    : 'bg-[#faf7f2] text-[#6b5a4a] border border-[#e8ded0] hover:bg-[#ede5d8]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e8ded0] text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                <th className="py-2.5 px-3">GUEST / CONTRIBUTOR</th>
                <th className="py-2.5 px-3">AMOUNT (AUD)</th>
                <th className="py-2.5 px-3">GIFT METHOD</th>
                <th className="py-2.5 px-3">RECEIVED</th>
                <th className="py-2.5 px-3">PERSONAL BLESSING / NOTE</th>
                <th className="py-2.5 px-3">THANK-YOU NOTE</th>
                <th className="py-2.5 px-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ede4]">
              {filteredGifts.map((g: any) => {
                const isEnv = (g.type || '').toLowerCase().includes('envelope') || (g.type || '').toLowerCase().includes('cash');
                const isWell = (g.type || '').toLowerCase().includes('well');
                const isSent = g.thankYouSent || g.thankYouStatus === 'Sent' || g.thankYouStatus === 'Completed';

                return (
                  <tr key={g.id} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="py-3 px-3">
                      <strong className="text-sm text-[#15110e] block">{g.guestName}</strong>
                      <span className="text-[11px] text-[#8b7b6b]">{isEnv ? 'Physical Card at Reception' : 'Digital Registry Gift'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-serif font-bold text-sm text-[#15110e]">
                        ${Number(g.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isEnv
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : isWell
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}>
                        {isEnv ? '💌 Cash Envelope' : isWell ? '📱 Wishing Well' : '🎁 Boxed Gift'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#5a4a3c] whitespace-nowrap">
                      {g.date || 'Today'}
                    </td>
                    <td className="py-3 px-3 text-[#5a4a3c] max-w-xs truncate" title={g.message}>
                      {g.message || 'No personal message recorded'}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => toggleThankYou(g.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                          isSent
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                        }`}
                        title="Click to toggle thank you status"
                      >
                        {isSent ? '✓ Sent' : '⏳ Due'}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => removeGift(g.id, g.guestName)}
                        className="text-[#a8382c] hover:bg-[#fbeae8] px-2 py-0.5 rounded border border-[#f2a89f] text-[10.5px] font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>



    </div>
  );
}

export default function McView({ onSelectView }: McViewProps) {
  const { state, setState } = useAppState();
  const { session, setSession, clearSession } = useSession();

  // Navigation state
  const [activeTab, setActiveTab] = useState<'weddings' | 'calendar' | 'clients' | 'team' | 'referrals' | 'settings'>('weddings');
  const [selectedWeddingId, setSelectedWeddingId] = useState<string | null>(null);
  const [mcInitialTab, setMcInitialTab] = useState<CoupleTab>('overview');
  const [detailSubTab, setDetailSubTab] = useState<'runsheet' | 'seating' | 'guests' | 'venue'>('runsheet');

  // MC Gift Ledger State
  const [mcGiftSearch, setMcGiftSearch] = useState('');
  const [mcGiftTypeFilter, setMcGiftTypeFilter] = useState<'all' | 'wishing-well' | 'envelope' | 'gift'>('all');
  const [showMcAddGiftModal, setShowMcAddGiftModal] = useState(false);
  const [mcGiftName, setMcGiftName] = useState('');
  const [mcGiftAmount, setMcGiftAmount] = useState('');
  const [mcGiftType, setMcGiftType] = useState('Cash Envelope (Podium)');
  const [mcGiftMessage, setMcGiftMessage] = useState('');
  const [mcGiftStatus, setMcGiftStatus] = useState<'Due' | 'Drafted' | 'Sent'>('Due');

  // Calendar State
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(10); // 0-indexed: 10 is November

  // Client Drawer State
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Run Sheet States
  const [runSheetFilter, setRunSheetFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [runSheetSearch, setRunSheetSearch] = useState('');
  const [showAddCueModal, setShowAddCueModal] = useState(false);
  const [cueTime, setCueTime] = useState('17:00');
  const [cueActivity, setCueActivity] = useState('');
  const [cueNotes, setCueNotes] = useState('');
  const [cuePrivateNotes, setCuePrivateNotes] = useState('');

  // Seating States
  const [seatingViewMode, setSeatingViewMode] = useState<'floor' | 'list'>('floor');
  const [unassignedSearch, setUnassignedSearch] = useState('');
  const [seatModalTarget, setSeatModalTarget] = useState<{ tableId: string; seatIndex: number } | null>(null);

  // New Wedding Modal State
  const [showNewWeddingModal, setShowNewWeddingModal] = useState(false);
  const [nwWeddingName, setNwWeddingName] = useState('');
  const [nwBrideName, setNwBrideName] = useState('');
  const [nwGroomName, setNwGroomName] = useState('');
  const [nwBrideEmail, setNwBrideEmail] = useState('');
  const [nwGroomEmail, setNwGroomEmail] = useState('');
  const [nwVenue, setNwVenue] = useState('');
  const [nwDate, setNwDate] = useState('2027-09-18');

  // New Invoice Modal State
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [niCouple, setNiCouple] = useState('Sophie & James');
  const [niAmount, setNiAmount] = useState(1850);
  const [niStatus, setNiStatus] = useState<'Pending' | 'Paid' | 'Draft'>('Pending');

  // Profile Settings State
  const [mcName, setMcName] = useState('Robert Galati');
  const [mcBiz, setMcBiz] = useState('Robert Galati MC Services');
  const [mcEmail, setMcEmail] = useState('robert@galatimc.com.au');
  const [mcPhone, setMcPhone] = useState('0418 223 901');
  const [mcRate, setMcRate] = useState(1850);
  const [mcTagline, setMcTagline] = useState('Premier Luxury Wedding Host & Stage Director');
  const [mcInstagram, setMcInstagram] = useState('@robertgalati.mc');
  const [mcBio, setMcBio] = useState(
    'High-energy, warm, and sophisticated Master of Ceremonies with over 12 years of experience hosting premier luxury weddings across Sydney, Southern Highlands, and Hunter Valley.'
  );

  // Stage & Prompter Preferences
  const [prompterFontSize, setPrompterFontSize] = useState<'Medium' | 'Large' | 'Extra Large'>('Large');
  const [stageClockFormat, setStageClockFormat] = useState<'12h' | '24h'>('12h');
  const [overrunAlert, setOverrunAlert] = useState(true);
  const [cueBufferMargin, setCueBufferMargin] = useState(5);
  const [shareNotesWithCouple, setShareNotesWithCouple] = useState(false);
  const [autoSmsToSpeakers, setAutoSmsToSpeakers] = useState(true);
  const [djPlaylistSync, setDjPlaylistSync] = useState('https://open.spotify.com/playlist/37i9dQZF1DX4UtSsGT1Sbe');
  const [cueChimeSound, setCueChimeSound] = useState('Soft Bell');

  // Team Member & Access Control States
  const [showInviteMemberModal, setShowInviteMemberModal] = useState<boolean>(false);
  const [selectedMemberForAccess, setSelectedMemberForAccess] = useState<TeamMember | null>(null);

  // Invite Form State
  const [invName, setInvName] = useState<string>('');
  const [invRole, setInvRole] = useState<string>('Associate MC & Host');
  const [invEmail, setInvEmail] = useState<string>('');
  const [invPhone, setInvPhone] = useState<string>('');
  const [invAccessLevel, setInvAccessLevel] = useState<'Full MC Dashboard Access' | 'Full Access' | 'Host & Run Sheet' | 'Seating & Guests' | 'Audio & AV Lead'>('Full MC Dashboard Access');
  const [invWeddingScope, setInvWeddingScope] = useState<'all' | 'custom'>('all');
  const [invSelectedWeddings, setInvSelectedWeddings] = useState<string[]>(['w1']);
  const [invCanRunsheet, setInvCanRunsheet] = useState<boolean>(true);
  const [invCanSeating, setInvCanSeating] = useState<boolean>(true);
  const [invCanDietary, setInvCanDietary] = useState<boolean>(true);
  const [invCanMessaging, setInvCanMessaging] = useState<boolean>(true);
  const [invCanGiftLedger, setInvCanGiftLedger] = useState<boolean>(true);

  // Handlers for Team Members
  const handleMcAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcGiftName.trim()) {
      showToast('Please enter the guest or family name', 'error');
      return;
    }
    const amountVal = parseFloat(mcGiftAmount.replace(/[^0-9.]/g, '')) || 0;
    const newGift = {
      id: 'gf_' + Date.now(),
      guestName: mcGiftName.trim(),
      amount: amountVal,
      type: mcGiftType.toLowerCase().includes('envelope') ? 'cash-envelope' : mcGiftType.toLowerCase().includes('well') ? 'wishing-well' : 'gift',
      date: 'Today (Reception)',
      message: mcGiftMessage.trim() || 'Logged at reception podium by MC',
      thankYouSent: mcGiftStatus === 'Sent',
      thankYouStatus: mcGiftStatus as any,
    };
    setState({
      ...state,
      gifts: [newGift, ...(state.gifts || [])],
    });
    showToast(`Successfully recorded ${amountVal} gift from ${mcGiftName.trim()}`, 'success');
    setShowMcAddGiftModal(false);
    setMcGiftName('');
    setMcGiftAmount('');
    setMcGiftMessage('');
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName.trim() || !invEmail.trim()) {
      showToast('Please enter member name and email address', 'error');
      return;
    }

    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      name: invName.trim(),
      role: invRole.trim() || 'Associate Host',
      email: invEmail.trim(),
      phone: invPhone.trim() || '0400 123 456',
      status: 'Active',
      accessLevel: invAccessLevel,
      assignedWeddings: invWeddingScope === 'all' ? ['all'] : invSelectedWeddings,
      permissions: {
        canEditRunsheet: invCanRunsheet,
        canEditSeating: invCanSeating,
        canViewDietary: invCanDietary,
        canMessageClients: invCanMessaging,
      },
    };

    setState({
      ...state,
      team: [...(state.team || []), newMember],
    });

    showToast(`Invitation sent to ${newMember.name} with ${newMember.accessLevel} access!`, 'success');
    setShowInviteMemberModal(false);
    setInvName('');
    setInvEmail('');
    setInvPhone('');
  };

  const handleUpdateMemberAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForAccess) return;

    const updatedTeam = (state.team || []).map((m) => {
      if (m.id === selectedMemberForAccess.id) {
        return selectedMemberForAccess;
      }
      return m;
    });

    setState({ ...state, team: updatedTeam });
    showToast(`Access permissions updated for ${selectedMemberForAccess.name}!`, 'success');
    setSelectedMemberForAccess(null);
  };

  const handleRemoveMember = (memberId: string) => {
    const member = (state.team || []).find(m => m.id === memberId);
    const updatedTeam = (state.team || []).filter(m => m.id !== memberId);
    setState({ ...state, team: updatedTeam });
    showToast(`Removed ${member?.name || 'team member'} from agency team`, 'info');
    if (selectedMemberForAccess?.id === memberId) {
      setSelectedMemberForAccess(null);
    }
  };

  const activeWedding = state.weddings.find(w => w.id === selectedWeddingId) || state.weddings[0];
  const runSheet = activeWedding.privateRunSheet || [];

  const handleLogout = () => {
    clearSession();
    showToast('Signed out of MC Pro account', 'info');
    if (onSelectView) onSelectView('login');
  };

  // Run Sheet handlers
  const updateWeddingRunSheet = (newCues: PrivateRunSheetItem[]) => {
    const updatedWeddings = state.weddings.map(w => {
      if (w.id === activeWedding.id) {
        return { ...w, privateRunSheet: newCues };
      }
      return w;
    });
    setState({ ...state, weddings: updatedWeddings });
  };

  const handleToggleDone = (cueId: string) => {
    const updated = runSheet.map(c => (c.id === cueId ? { ...c, done: !c.done } : c));
    updateWeddingRunSheet(updated);
  };

  const handleUpdateCueField = (cueId: string, field: keyof PrivateRunSheetItem, value: any) => {
    const updated = runSheet.map(c => (c.id === cueId ? { ...c, [field]: value } : c));
    updateWeddingRunSheet(updated);
  };

  const handleMoveCue = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= runSheet.length) return;
    const newItems = [...runSheet];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    updateWeddingRunSheet(newItems);
  };

  const handleDeleteCue = (cueId: string) => {
    const updated = runSheet.filter(c => c.id !== cueId);
    updateWeddingRunSheet(updated);
    showToast('Cue removed from run sheet', 'info');
  };

  const handleAddCue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cueTime || !cueActivity) return;
    const newItem: PrivateRunSheetItem = {
      id: 'pmc_' + Date.now(),
      time: cueTime,
      activity: cueActivity,
      notes: cueNotes,
      privateNotes: cuePrivateNotes,
      done: false,
      order: runSheet.length + 1,
    };
    updateWeddingRunSheet([...runSheet, newItem]);
    logAudit(state, setState, 'MC Cue Added', 'Robert Galati', 'mc', `Added schedule entry: ${newItem.activity} at ${newItem.time}`, 'Run Sheet');
    setCueTime('17:00');
    setCueActivity('');
    setCueNotes('');
    setCuePrivateNotes('');
    setShowAddCueModal(false);
    showToast(`Added "${newItem.activity}" to schedule`, 'success');
  };

  // Seating handlers
  const handleSeatClick = (tableId: string, seatIndex: number) => {
    const current = state.guests.find(g => g.tableId === tableId && g.seatIndex === seatIndex);
    if (current) {
      if (window.confirm(`Remove ${current.name} from this seat?`)) {
        const updatedGuests = state.guests.map(g => (g.id === current.id ? { ...g, tableId: null, seatIndex: null } : g));
        setState({ ...state, guests: updatedGuests });
        logAudit(state, setState, 'MC Seating Updated', 'Robert Galati', 'mc', `Unseated ${current.name}`, 'Seating');
        showToast(`Removed ${current.name} from seat`, 'info');
      }
    } else {
      setSeatModalTarget({ tableId, seatIndex });
    }
  };

  const assignGuestToTableAndSeat = (guestId: string, tableId: string, seatIndex: number) => {
    const updatedGuests = state.guests.map(g => (g.id === guestId ? { ...g, tableId, seatIndex } : g));
    setState({ ...state, guests: updatedGuests });
    logAudit(state, setState, 'MC Seating Updated', 'Robert Galati', 'mc', `Assigned guest to table ${tableId}`, 'Seating');
    showToast('Guest seated successfully!', 'success');
  };

  const handleAutoAssign = (guestId: string) => {
    for (const tbl of state.tables) {
      const seated = state.guests.filter(g => g.tableId === tbl.id);
      if (seated.length < tbl.capacity) {
        for (let s = 0; s < tbl.capacity; s++) {
          if (!seated.some(x => x.seatIndex === s)) {
            assignGuestToTableAndSeat(guestId, tbl.id, s);
            return;
          }
        }
      }
    }
    showToast('All tables are at maximum capacity', 'error');
  };

  // Calendar Helpers
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const changeCalendarMonth = (delta: number) => {
    let newM = calMonth + delta;
    let newY = calYear;
    if (newM < 0) {
      newM = 11;
      newY--;
    } else if (newM > 11) {
      newM = 0;
      newY++;
    }
    setCalMonth(newM);
    setCalYear(newY);
  };

  // Invoice Handlers
  const handleMarkInvoicePaid = (invId: string) => {
    const invoices = (state.invoices || []).map(i => (i.id === invId ? { ...i, status: 'Paid' as const } : i));
    setState({ ...state, invoices });
    logAudit(state, setState, 'Invoice Paid', 'Robert Galati', 'mc', `Marked invoice ${invId} as Paid`, 'General');
    showToast(`Invoice ${invId} marked as Paid!`, 'success');
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: Invoice = {
      id: 'INV-' + (1080 + (state.invoices?.length || 0) + 1),
      couple: niCouple,
      date: 'Today',
      venue: niCouple.includes('Sophie') ? 'Fernwood Estate' : 'Dunbar House',
      amount: Number(niAmount),
      status: niStatus,
    };
    const invoices = [newInv, ...(state.invoices || [])];
    setState({ ...state, invoices });
    logAudit(state, setState, 'Invoice Generated', 'Robert Galati', 'mc', `Created invoice ${newInv.id} for ${niCouple}`, 'General');
    setShowNewInvoiceModal(false);
    showToast(`Generated invoice ${newInv.id}!`, 'success');
  };

  // New Wedding Handler
  const handleCreateWedding = (e: React.FormEvent) => {
    e.preventDefault();
    const bName = nwBrideName.trim() || 'Bride';
    const gName = nwGroomName.trim() || 'Groom';
    const coupleDisplay = `${bName} & ${gName}`;
    const finalWeddingName = nwWeddingName.trim() || `${coupleDisplay}'s Wedding`;
    const d = new Date(nwDate || '2027-09-18');
    const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateDisplay = `${d.getDate()} ${mNames[d.getMonth()]} ${d.getFullYear()}`;

    const newW: Wedding = {
      id: 'w_' + Date.now(),
      couple: coupleDisplay,
      partner1: bName,
      partner2: gName,
      weddingName: finalWeddingName,
      brideName: bName,
      groomName: gName,
      brideEmail: nwBrideEmail.trim(),
      groomEmail: nwGroomEmail.trim(),
      date: (nwDate || '2027-09-18') + 'T15:00:00',
      dateDisplay,
      timeDisplay: '3:00 PM',
      venue: nwVenue,
      venueAddress: nwVenue,
      parking: 'Complimentary on-site guest parking available.',
      dressCode: 'Formal Elegance',
      registry: 'Gift & Go wishing well',
      invited: 110,
      confirmed: 0,
      status: 'Planning',
      tasks: [],
      runSheet: [
        { id: 'rs_' + Date.now() + '_1', time: '14:30', note: 'MC Arrival & sound check', done: false },
        { id: 'rs_' + Date.now() + '_2', time: '15:00', note: 'Ceremony processional', done: false },
      ],
      privateRunSheet: [
        { id: 'pmc_' + Date.now() + '_1', time: '14:30', activity: 'MC Arrival & Audio Check', notes: 'Sound check with technicians.', privateNotes: 'Check cordless mics.', done: false, order: 1 },
      ],
    };

    const newClient: Client = {
      id: 'c_' + Date.now(),
      couple: coupleDisplay,
      weddingDate: dateDisplay,
      venue: nwVenue,
      tier: 'Diamond Host Package',
      deposit: 'Paid ($500)',
      phone: '0412 345 678',
      email: nwBrideEmail.trim() || nwGroomEmail.trim(),
      notes: `Booking for ${finalWeddingName}. Bride: ${bName} (${nwBrideEmail}), Groom: ${gName} (${nwGroomEmail}). Venue: ${nwVenue}.`,
    };

    setState({
      ...state,
      weddings: [...state.weddings, newW],
      clients: [...(state.clients || []), newClient],
    });

    logAudit(state, setState, 'New Wedding Created', 'Robert Galati', 'mc', `Created booking for ${finalWeddingName} at ${nwVenue}`, 'General');
    setShowNewWeddingModal(false);
    setNwWeddingName('');
    setNwBrideName('');
    setNwGroomName('');
    setNwBrideEmail('');
    setNwGroomEmail('');
    setNwVenue('');
    showToast(`Created booking for ${finalWeddingName}!`, 'success');
  };

  // Settings Save Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    logAudit(state, setState, 'MC Profile Updated', 'Robert Galati', 'mc', 'Updated professional rates and bio', 'General');
    showToast('MC profile settings updated successfully!', 'success');
  };

  // Run Sheet filtering
  const filteredCues = runSheet.filter(cue => {
    const matchSearch =
      cue.activity.toLowerCase().includes(runSheetSearch.toLowerCase()) ||
      (cue.notes && cue.notes.toLowerCase().includes(runSheetSearch.toLowerCase())) ||
      (cue.privateNotes && cue.privateNotes.toLowerCase().includes(runSheetSearch.toLowerCase())) ||
      cue.time.toLowerCase().includes(runSheetSearch.toLowerCase());
    const matchStatus = runSheetFilter === 'all' || (runSheetFilter === 'done' ? cue.done : !cue.done);
    return matchSearch && matchStatus;
  });

  // Confirmed & Unassigned guests for seating
  const confirmedGuests = state.guests.filter(g => g.rsvpStatus === 'confirmed');
  const unassignedGuests = confirmedGuests.filter(
    g => !g.tableId && g.name.toLowerCase().includes(unassignedSearch.toLowerCase())
  );

  if (selectedWeddingId) {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        {session?.impersonating && (
          <div className="w-full bg-[#bd9661] text-[#15110e] px-4 py-1.5 text-xs font-bold flex items-center justify-between border-b border-[#a8824f]">
            <div className="flex items-center gap-2">
              <span>👑</span>
              <span>SUPER ADMIN IMPERSONATION MODE: Viewing Console as Robert Galati</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSession({ role: 'superadmin', email: 'admin@tapandtoast.demo', name: 'Platform Admin', keepSignedIn: true });
                if (onSelectView) onSelectView('superadmin');
              }}
              className="bg-[#15110e] text-white px-2 py-0.5 rounded text-xs hover:bg-[#231c17] cursor-pointer"
            >
              Exit Impersonation &rarr;
            </button>
          </div>
        )}
        <CoupleView
          weddingId={selectedWeddingId}
          isMcView={true}
          initialTab={mcInitialTab}
          onBackToWeddings={() => setSelectedWeddingId(null)}
          onSelectView={onSelectView}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-45px)] bg-[#f8f6f2] font-sans select-none">
      {/* Super Admin Impersonation Banner */}
      {session?.impersonating && (
        <div className="w-full bg-[#bd9661] text-[#15110e] px-4 py-1.5 text-xs font-bold flex items-center justify-between border-b border-[#a8824f]">
          <div className="flex items-center gap-2">
            <span>👑</span>
            <span>SUPER ADMIN IMPERSONATION MODE: Viewing Console as Robert Galati</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSession({ role: 'superadmin', email: 'admin@tapandtoast.demo', name: 'Platform Admin', keepSignedIn: true });
              if (onSelectView) onSelectView('superadmin');
            }}
            className="bg-[#15110e] text-white px-2 py-0.5 rounded text-xs hover:bg-[#231c17] cursor-pointer"
          >
            Exit Impersonation &rarr;
          </button>
        </div>
      )}

      {/* Sidebar Navigation matching Screenshots 35-39 */}
      <aside className="w-full md:w-[240px] bg-[#15110e] text-[#d9c9b8] flex flex-col justify-between border-r border-[#29211a] flex-shrink-0">
        <div>
          {/* Brand */}
          <div className="p-5 pb-3 flex items-center gap-2.5">
            <span className="tt-mark inline-grid place-items-center w-6 h-6 border border-[#bd9661] text-[#bd9661] font-serif font-bold text-sm rounded-[3px]">
              T
            </span>
            <span className="font-serif text-[18px] text-white font-semibold tracking-wide">
              Tap <span className="gold-amp">&amp;</span> Toast
            </span>
          </div>
          <div className="text-[9.5px] tracking-[2px] uppercase text-[#bd9661] font-bold px-5 pb-3">
            PRO ACCOUNT
          </div>

          {/* Navigation Links */}
          <nav className="p-2 flex flex-col gap-1">
            {[
              {
                id: 'weddings',
                label: 'All Weddings',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="12" r="6" />
                    <circle cx="15" cy="12" r="6" />
                  </svg>
                ),
              },
              {
                id: 'calendar',
                label: 'Calendar',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ),
              },
              {
                id: 'clients',
                label: 'Clients',
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
                id: 'team',
                label: 'Team & Crew',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                ),
              },
              {
                id: 'referrals',
                label: 'Referrals & Discounts',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                ),
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                ),
              },
            ].map(item => {
              const isActive = activeTab === item.id && !selectedWeddingId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSelectedWeddingId(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-[13.5px] transition-all border-l-[3px] cursor-pointer ${
                    isActive
                      ? 'bg-[#2b221a] text-[#fce4ca] font-bold border-l-[#bd9661]'
                      : 'text-[#bfaea0] hover:text-white hover:bg-[#251e18] border-l-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-[#bd9661]' : 'text-[#bfaea0]'}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {(item as any).badge && (
                    <span className="text-[9px] font-bold bg-[#bd9661] text-[#15110e] px-1.5 py-0.5 rounded-full">
                      {(item as any).badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#231b14] text-xs">
          <div className="text-[10px] uppercase tracking-wider text-[#8c7b6c] mb-1">Signed in as</div>
          <div className="font-semibold text-white">Robert Galati</div>
          <div className="text-[11px] text-[#8c7b6c] mb-3">Master of Ceremonies</div>
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
        {/* ==================================================================== */}
        {/* TAB 1: ALL WEDDINGS & WEDDING DETAIL                                  */}
        {/* ==================================================================== */}
        {activeTab === 'weddings' && !selectedWeddingId && (
          <section className="space-y-7">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  PRO ACCOUNT
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e] leading-tight">
                  Your Weddings
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setShowNewWeddingModal(true)}
                className="btn btn-primary"
              >
                + New Wedding
              </button>
            </div>

            {/* 4 Metric Cards matching Screenshot 6 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">7</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Active weddings</div>
              </div>
              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">3</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">This month</div>
              </div>
              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">642</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Guests managed</div>
              </div>
              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">89%</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Avg. RSVP rate</div>
              </div>
            </div>

            {/* Weddings Table matching Screenshot 6 */}
            <div className="bg-white border border-[#e8ded0] rounded-[6px] shadow-sm overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Couple</th>
                    <th>Date</th>
                    <th>Guests</th>
                    <th>RSVP Progress</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.weddings.map((w, idx) => {
                    const initials = w.couple.split('&').map(p => p.trim()[0]).join('&');
                    const confirmedCount = w.id === 'w1' ? confirmedGuests.length : (w.confirmed || 0);
                    const percent = Math.min(100, Math.round((confirmedCount / (w.invited || 100)) * 100));
                    const statusClass = idx === 0 ? 'finalising' : idx === 2 ? 'on-track' : 'planning';
                    const statusLabel = idx === 0 ? 'Finalising' : idx === 2 ? 'On Track' : 'Planning';

                    return (
                      <tr
                        key={w.id}
                        className="cursor-pointer hover:bg-[#faf7f2] transition-colors"
                        onClick={() => {
                          setSelectedWeddingId(w.id);
                          setMcInitialTab('overview');
                        }}
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#15110e] text-[#dfc194] font-bold text-xs flex items-center justify-center">
                              {initials}
                            </div>
                            <div>
                              <strong className="text-sm font-serif text-[#15110e]">{w.couple}</strong>
                              <div className="text-[11px] text-[#8b7b6b]">{w.venue.split(',')[0]}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-xs text-[#15110e] font-medium">{w.dateDisplay || w.date}</td>
                        <td className="text-xs font-semibold">{w.invited} invited</td>
                        <td className="w-48">
                          <div className="space-y-1">
                            <div className="w-full bg-[#f0ede4] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#bd9661] h-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <div className="text-[11px] text-[#8b7b6b]">
                              {confirmedCount} confirmed &bull; {percent}%
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`tt-pill ${statusClass}`}>{statusLabel}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWeddingId(w.id);
                              setMcInitialTab('mc_runsheet');
                            }}
                            className="btn btn-outline btn-xs"
                          >
                            📋 Run Sheet &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* WEDDING DETAIL VIEW (inside MC Hub) */}
        {selectedWeddingId && (
          <section className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedWeddingId(null)}
                  className="btn btn-outline btn-sm mb-2"
                >
                  &larr; Back to All Weddings
                </button>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold">
                  WEDDING DETAIL
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  {activeWedding.couple}
                </h1>
                <div className="text-xs text-[#8b7b6b] mt-1">
                  Saturday, {activeWedding.dateDisplay || activeWedding.date} &bull; {activeWedding.venue}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-gold btn-sm"
                >
                  🖨️ Print Run Sheet
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Private MC schedule saved successfully!', 'success')}
                  className="btn btn-outline btn-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Sub-Tabs */}
            <div className="flex gap-2 border-b border-[#e8ded0] pb-2 overflow-x-auto">
              {[
                { id: 'runsheet', label: '🔒 Private Run Sheet' },
                { id: 'seating', label: 'Seating Floor Plan' },
                { id: 'guests', label: 'Guest & Catering Summary' },
                { id: 'venue', label: 'Venue & Travel' },
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setDetailSubTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                    detailSubTab === sub.id
                      ? 'bg-[#bd9661] text-[#15110e]'
                      : 'bg-white text-[#8b7b6b] border border-[#d5c7b5]'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-pane 1: Run Sheet (Private MC Run Sheet) */}
            {detailSubTab === 'runsheet' && (
              <div className="space-y-4">

                <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#15110e]">
                        Private MC Run Sheet &amp; Cue Schedule
                      </h2>
                      <div className="text-xs text-[#8b7b6b]">
                        {runSheet.length} Schedule Entries &bull; {activeWedding.couple} Wedding
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Search schedule..."
                        value={runSheetSearch}
                        onChange={(e) => setRunSheetSearch(e.target.value)}
                        className="text-input max-w-[160px] text-xs py-1.5"
                      />
                      {['all', 'pending', 'done'].map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setRunSheetFilter(st as any)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold capitalize border ${
                            runSheetFilter === st ? 'bg-[#15110e] text-[#dfc194] border-[#15110e]' : 'bg-white text-[#8b7b6b] border-[#d5c7b5]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowAddCueModal(true)}
                        className="btn btn-gold btn-sm"
                      >
                        + Add Cue Entry
                      </button>
                    </div>
                  </div>

                  {/* Cue Items List */}
                  <div className="space-y-3">
                    {filteredCues.map((cue, idx) => (
                      <div
                        key={cue.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          cue.done ? 'bg-emerald-50/20 border-emerald-200 opacity-75' : 'bg-[#fdfbf7] border-[#e8ded0]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={cue.done}
                            onChange={() => handleToggleDone(cue.id)}
                            className="mt-2 w-4 h-4 rounded text-[#bd9661] cursor-pointer"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] font-bold text-[#8b7b6b] uppercase">
                                #{idx + 1}
                              </span>
                              <input
                                type="text"
                                value={cue.time}
                                onChange={(e) => handleUpdateCueField(cue.id, 'time', e.target.value)}
                                className="w-24 text-xs font-bold bg-[#faf6f0] border border-[#d4c5b3] rounded px-2 py-1"
                              />
                              <input
                                type="text"
                                value={cue.activity}
                                onChange={(e) => handleUpdateCueField(cue.id, 'activity', e.target.value)}
                                className={`flex-1 text-sm font-bold bg-white border border-[#d4c5b3] rounded px-2 py-1 text-[#15110e] ${
                                  cue.done ? 'line-through text-[#8b7b6b]' : ''
                                }`}
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveCue(idx, -1)}
                                  disabled={idx === 0}
                                  className="btn btn-outline btn-xs px-1.5 py-0.5 disabled:opacity-30"
                                  title="Move Up"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveCue(idx, 1)}
                                  disabled={idx === runSheet.length - 1}
                                  className="btn btn-outline btn-xs px-1.5 py-0.5 disabled:opacity-30"
                                  title="Move Down"
                                >
                                  ▼
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCue(cue.id)}
                                  className="btn btn-outline btn-xs px-1.5 py-0.5 text-red-600 border-red-200"
                                  title="Delete Cue"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">
                                Public Schedule Notes
                              </label>
                              <input
                                type="text"
                                value={cue.notes || ''}
                                onChange={(e) => handleUpdateCueField(cue.id, 'notes', e.target.value)}
                                className="w-full text-xs bg-white border border-[#d4c5b3] rounded px-2 py-1"
                                placeholder="Public notes or announcements..."
                              />
                            </div>

                            <div className="bg-[#fff8ee] border border-[#ebd4b8] rounded p-2">
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#bd9661] mb-1">
                                MC Cue Notes
                              </span>
                              <input
                                type="text"
                                value={cue.privateNotes || ''}
                                onChange={(e) => handleUpdateCueField(cue.id, 'privateNotes', e.target.value)}
                                className="w-full text-xs bg-transparent border-0 border-b border-[#e3d4bf] text-[#453423] px-1 py-0.5 focus:outline-none focus:border-[#bd9661]"
                                placeholder="Private cues, technical sound directions..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-pane 2: Seating Floor Plan */}
            {detailSubTab === 'seating' && (
              <SeatingPlannerSection weddingId={activeWedding.id} onSelectView={onSelectView} isMcView={true} />
            )}

            {/* Sub-pane 3: Catering & Dietaries */}
            {detailSubTab === 'guests' && (
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#15110e]">
                  Catering Breakdown &amp; Special Dietaries
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-4">
                    <div className="text-2xl font-serif font-bold text-[#15110e]">
                      {confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('vegetarian')).length}
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-1">Vegetarian meals</div>
                  </div>
                  <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-4">
                    <div className="text-2xl font-serif font-bold text-[#15110e]">
                      {confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('gluten')).length}
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-1">Gluten-Free meals</div>
                  </div>
                  <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-4">
                    <div className="text-2xl font-serif font-bold text-[#15110e]">
                      {confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('nut')).length}
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-1">Nut Allergy meals</div>
                  </div>
                  <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-4">
                    <div className="text-2xl font-serif font-bold text-[#15110e]">
                      {confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('vegan')).length}
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-1">Vegan meals</div>
                  </div>
                </div>
                <div className="text-xs text-[#8b7b6b] pt-2">
                  Total Headcount: {confirmedGuests.reduce((sum, g) => sum + (g.guestCount || 1), 0)} confirmed covers.
                </div>
              </div>
            )}

            {/* Sub-pane 4: Venue & Travel */}
            {detailSubTab === 'venue' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold">
                      COUPLE LOCATION &amp; LOGISTICS
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-[#15110e] mt-1">
                      Venue &amp; Travel Roster
                    </h2>
                    <div className="text-xs text-[#8b7b6b]">
                      Venue coordinates, guest parking facility details, shuttle timings and direct navigation for MC &amp; event vendors
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold btn-sm flex items-center gap-1.5"
                  >
                    📍 Open Google Maps ↗
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Venue & Address */}
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#fbf3e6] text-[#bd9661] flex items-center justify-center text-lg">
                        🏛
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#15110e]">
                          Wedding Venue &amp; Address
                        </h3>
                        <span className="text-xs text-[#8b7b6b]">Ceremony &amp; Reception Grounds</span>
                      </div>
                    </div>
                    <div className="text-xs text-[#15110e] leading-relaxed">
                      <strong>Fernwood Estate, Southern Highlands</strong><br />
                      124 Range Road, Mittagong NSW 2575<br />
                      Australia
                    </div>
                    <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-3 text-xs text-[#5a4a3c] space-y-1">
                      <div><strong>Ceremony:</strong> 2:00 PM &bull; The Lower Meadow Lawns</div>
                      <div><strong>Cocktail Hour &amp; Reception:</strong> 5:00 PM &bull; The Grand Pavilion</div>
                      <div><strong>Venue Concierge:</strong> (02) 4871 2000 &bull; concierge@fernwoodestate.demo</div>
                    </div>
                  </div>

                  {/* Card 2: Parking */}
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#fbf3e6] text-[#bd9661] flex items-center justify-center text-lg">
                        🅿️
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#15110e]">
                          Guest Parking Facilities
                        </h3>
                        <span className="text-xs text-[#8b7b6b]">On-Site Valet &amp; Dedicated Bays</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#15110e]">
                      Complimentary on-site guest parking is available at the Main Lawn entrance. Follow directional signage upon arrival.
                    </p>
                    <ul className="list-disc pl-5 text-xs text-[#5a4a3c] space-y-1">
                      <li><strong>120 dedicated sealed bays</strong> with illuminated pathways.</li>
                      <li><strong>Valet attendants:</strong> Stationed at the porte-cochère from 1:15 PM.</li>
                      <li><strong>EV Charging:</strong> 4 Type-2 chargers available at North Parking.</li>
                      <li><strong>Overnight Parking:</strong> Permitted until 11:00 AM Sunday morning.</li>
                    </ul>
                  </div>

                  {/* Card 3: Shuttles */}
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#fbf3e6] text-[#bd9661] flex items-center justify-center text-lg">
                        🚌
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#15110e]">
                          Transport &amp; Guest Shuttles
                        </h3>
                        <span className="text-xs text-[#8b7b6b]">Scheduled Private Charter Transfers</span>
                      </div>
                    </div>
                    <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-3 text-xs text-[#5a4a3c] space-y-1.5">
                      <div><strong>Guest Arrival Shuttles:</strong></div>
                      <div>&bull; 1:15 PM from Bowral Grand Hotel (Station St Entrance)</div>
                      <div>&bull; 1:30 PM from Milton Park Country House Resort</div>
                      <div className="pt-1"><strong>Evening Return Loops:</strong></div>
                      <div>&bull; Continuous departures every 45 mins from 10:15 PM until 12:30 AM</div>
                    </div>
                  </div>

                  {/* Card 4: Interactive Google Map */}
                  <div className="bg-[#15110e] border border-[#3d2e20] text-white rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#bd9661] font-bold">
                          LIVE NAVIGATION
                        </div>
                        <h3 className="font-serif text-base font-bold text-white">Interactive Google Map</h3>
                        <span className="text-[11px] text-[#bdaea0]">Coordinates: 34.4512° S, 150.5369° E</span>
                      </div>
                      <a
                        href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold btn-xs"
                      >
                        Open Maps ↗
                      </a>
                    </div>

                    <a
                      href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative h-48 rounded-lg overflow-hidden border border-[#3d3023] bg-[#e5e3df] group cursor-pointer"
                    >
                      <iframe
                        src="https://maps.google.com/maps?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575&t=&z=14&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        className="border-0 block pointer-events-none"
                        loading="lazy"
                        title="Google Maps Location"
                      />
                      <div className="absolute top-2 left-2 bg-[#191410]/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-[#4a3a2a] flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                          📍
                        </div>
                        <div>
                          <strong className="text-white text-xs block leading-tight">Fernwood Estate</strong>
                          <span className="text-[#dfc194] text-[10px] block">124 Range Road, Mittagong NSW</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}

            </section>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: CALENDAR (Screenshot 35)                                      */}
        {/* ==================================================================== */}
        {activeTab === 'calendar' && !selectedWeddingId && (
          <section className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  MC SCHEDULE
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Wedding Calendar
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeCalendarMonth(-1)}
                  className="btn btn-outline btn-sm"
                >
                  &larr; Previous
                </button>
                <span className="font-serif text-base font-bold text-[#15110e] px-3">
                  {monthNames[calMonth]} {calYear}
                </span>
                <button
                  type="button"
                  onClick={() => changeCalendarMonth(1)}
                  className="btn btn-outline btn-sm"
                >
                  Next &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-sm">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                <div>SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const firstDay = new Date(calYear, calMonth, 1).getDay();
                  const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
                  const cells = [];

                  // Empty cells for offset
                  for (let i = 0; i < firstDay; i++) {
                    cells.push(
                      <div key={`empty-${i}`} className="min-h-[90px] bg-[#faf8f5] opacity-40 rounded-lg border border-[#eee]" />
                    );
                  }

                  // Day cells
                  for (let d = 1; d <= totalDays; d++) {
                    const matchedWeddings = state.weddings.filter(w => {
                      const wd = new Date(w.date);
                      return wd.getFullYear() === calYear && wd.getMonth() === calMonth && wd.getDate() === d;
                    });

                    cells.push(
                      <div
                        key={`day-${d}`}
                        onClick={() => showToast(`MC Calendar selected: ${d} ${monthNames[calMonth]} ${calYear}`, 'info')}
                        className="min-h-[90px] bg-white border border-[#e8ded0] rounded-lg p-2 transition-all hover:border-[#bd9661] hover:bg-[#fdfbf8] cursor-pointer flex flex-col justify-between"
                      >
                        <div className="text-xs font-bold text-[#15110e]">{d}</div>
                        <div className="space-y-1">
                          {matchedWeddings.map(mw => (
                            <div
                              key={mw.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWeddingId(mw.id);
                                setMcInitialTab('overview');
                              }}
                              className="bg-[#17120f] text-[#dfc194] px-2 py-1 rounded text-[10.5px] font-semibold truncate hover:bg-[#2b221a] cursor-pointer"
                              title={`${mw.couple} at ${mw.venue}`}
                            >
                              💍 {mw.couple.split('&')[0].trim()}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return cells;
                })()}
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: CLIENTS (Screenshot 36)                                       */}
        {/* ==================================================================== */}
        {activeTab === 'clients' && !selectedWeddingId && (
          <section className="space-y-6">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                DIRECTORY
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                Couple Clients
              </h1>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-[6px] shadow-sm overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Couple</th>
                    <th>Wedding Date</th>
                    <th>Venue</th>
                    <th>Package Tier</th>
                    <th>Deposit</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(state.clients || []).map(client => (
                    <tr key={client.id} className="hover:bg-[#faf7f2] transition-colors">
                      <td><strong className="text-sm font-serif text-[#15110e]">{client.couple}</strong></td>
                      <td className="text-xs text-[#15110e]">{client.weddingDate}</td>
                      <td className="text-xs text-[#8b7b6b]">{client.venue}</td>
                      <td>
                        <span className="tt-pill warm text-xs">{client.tier}</span>
                      </td>
                      <td className="text-xs font-semibold text-[#15110e]">{client.deposit}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedClient(client)}
                          className="btn btn-outline btn-xs"
                        >
                          View Contact
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: TEAM (Screenshot 38)                                          */}
                {/* ==================================================================== */}
        {/* TAB 5: TEAM & CREW ACCESS MANAGEMENT                                 */}
        {/* ==================================================================== */}
        {activeTab === 'team' && !selectedWeddingId && (
          <section className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4 pb-3 border-b border-[#e8ded0]">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  STAFF &amp; COLLABORATORS
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  MC Team &amp; Crew
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1 max-w-2xl">
                  Manage agency team members and co-pilots. All team members share equal MC role parity, identical console permissions, and unified dashboard access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInvName('');
                  setInvEmail('');
                  setInvPhone('');
                  setInvRole('Associate MC & Co-Pilot');
                  setInvAccessLevel('Full MC Dashboard Access');
                  setInvWeddingScope('all');
                  setInvSelectedWeddings(state.weddings.map(w => w.id));
                  setInvCanRunsheet(true);
                  setInvCanSeating(true);
                  setInvCanDietary(true);
                  setInvCanMessaging(true);
                  setInvCanGiftLedger(true);
                  setShowInviteMemberModal(true);
                }}
                className="btn btn-gold btn-sm px-4 py-2 font-bold flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>+ Invite Member</span>
              </button>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(state.team || []).map(m => {
                const accessBadgeStyle = {
                  'Full Access': 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
                  'Host & Run Sheet': 'bg-sky-50 text-sky-800 border-sky-200 font-semibold',
                  'Seating & Guests': 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
                  'Audio & AV Lead': 'bg-purple-50 text-purple-800 border-purple-200 font-semibold',
                }[m.accessLevel || 'Host & Run Sheet'] || 'bg-stone-100 text-stone-700 border-stone-200';

                const assignedNames = (m.assignedWeddings && !m.assignedWeddings.includes('all'))
                  ? state.weddings.filter(w => m.assignedWeddings?.includes(w.id)).map(w => w.couple).join(', ')
                  : 'All Assigned Weddings';

                return (
                  <div
                    key={m.id}
                    className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#15110e]">{m.name}</h3>
                        <div className="text-xs text-[#bd9661] font-bold mt-0.5">{m.role}</div>
                      </div>
                      <span className="tt-pill green text-[10px]">{m.status || 'Active'}</span>
                    </div>

                    {/* Access Tier Tag */}
                    <div className="pt-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#8b7b6b] mb-1">
                        Access Level
                      </div>
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] border ${accessBadgeStyle}`}>
                        {m.accessLevel || 'Host & Run Sheet'}
                      </span>
                    </div>

                    {/* Assigned Scope */}
                    <div className="text-xs text-[#544332] bg-[#faf8f5] p-2.5 rounded-xl border border-[#f0ede4] space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#8b7b6b]">
                        Wedding Scope
                      </div>
                      <div className="truncate text-xs font-medium text-[#15110e]">
                        {assignedNames}
                      </div>
                    </div>

                    {/* Granular Permission Tags */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#8b7b6b]">
                        Active Permissions
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {m.permissions?.canEditRunsheet && (
                          <span className="px-2 py-0.5 bg-[#f4ece1] text-[#785b34] rounded text-[10px] font-medium">
                            Run Sheet
                          </span>
                        )}
                        {m.permissions?.canEditSeating && (
                          <span className="px-2 py-0.5 bg-[#f4ece1] text-[#785b34] rounded text-[10px] font-medium">
                            Seating Canvas
                          </span>
                        )}
                        {m.permissions?.canViewDietary && (
                          <span className="px-2 py-0.5 bg-[#f4ece1] text-[#785b34] rounded text-[10px] font-medium">
                            Dietary Alerts
                          </span>
                        )}
                        {m.permissions?.canMessageClients && (
                          <span className="px-2 py-0.5 bg-[#f4ece1] text-[#785b34] rounded text-[10px] font-medium">
                            Client Messaging
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1 text-xs text-[#8b7b6b] pt-2 border-t border-[#f0ede4]">
                      <div className="flex items-center gap-1.5">
                        <span>✉</span>
                        <span className="truncate">{m.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>📞</span>
                        <span>{m.phone}</span>
                      </div>
                    </div>

                    {/* Manage Access Action Button */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#f0ede4]">
                      <button
                        type="button"
                        onClick={() => setSelectedMemberForAccess(m)}
                        className="px-3 py-1.5 text-xs font-bold bg-[#faf5ed] hover:bg-[#bd9661] text-[#855c26] hover:text-white rounded-lg border border-[#e0cbb2] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Manage Access</span>
                        <span>⚙</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.id)}
                        className="text-xs text-[#8b7b6b] hover:text-red-700 font-semibold cursor-pointer p-1"
                        title="Remove member from agency"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

                {/* TAB 6: SETTINGS (Screenshot 39)                                      */}
        {/* ==================================================================== */}
        {/* ==================================================================== */}
        {/* TAB: REFERRALS & DISCOUNTS                                           */}
        {/* ==================================================================== */}
        {activeTab === 'referrals' && !selectedWeddingId && (
          <McReferralsSection state={state} setState={setState} />
        )}


        {/* ==================================================================== */}
        {/* TAB 6: SETTINGS (Screenshot 39)                                      */}
        {/* ==================================================================== */}
        {activeTab === 'settings' && !selectedWeddingId && (
          <section className="space-y-6 max-w-4xl">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                PROFESSIONAL ACCOUNT &amp; STAGE STUDIO
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                MC Pro Account &amp; Stage Preferences
              </h1>
              <p className="text-xs text-[#8b7b6b] mt-1">
                Configure your public MC branding, live stage prompter display, DJ sound sync, and client collaboration preferences.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Section 1: Profile & Business Branding */}
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                  <span className="text-lg">🎙️</span>
                  <h3 className="font-serif text-base font-bold text-[#15110e]">MC Identity &amp; Public Branding</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      MC Full Name
                    </label>
                    <input
                      type="text"
                      value={mcName}
                      onChange={(e) => setMcName(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Business / Stage Name
                    </label>
                    <input
                      type="text"
                      value={mcBiz}
                      onChange={(e) => setMcBiz(e.target.value)}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Direct Phone
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold font-mono text-[#6b5847] rounded-l select-none">
                        +61
                      </span>
                      <input
                        type="tel"
                        value={mcPhone}
                        onChange={(e) => setMcPhone(e.target.value)}
                        className="text-input rounded-l-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Professional Email
                    </label>
                    <input
                      type="email"
                      value={mcEmail}
                      onChange={(e) => setMcEmail(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Base Rate (AUD / Wedding)
                    </label>
                    <input
                      type="number"
                      value={mcRate}
                      onChange={(e) => setMcRate(Number(e.target.value))}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Tagline / Specialty
                    </label>
                    <input
                      type="text"
                      value={mcTagline}
                      onChange={(e) => setMcTagline(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Instagram / Portfolio Handle
                    </label>
                    <input
                      type="text"
                      value={mcInstagram}
                      onChange={(e) => setMcInstagram(e.target.value)}
                      className="text-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Bio &amp; Style Introduction (Seen by Couples on Proposals)
                  </label>
                  <textarea
                    rows={3}
                    value={mcBio}
                    onChange={(e) => setMcBio(e.target.value)}
                    className="text-input resize-none"
                  />
                </div>
              </div>

              {/* Section 2: Live Stage & Prompter Display */}
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                  <span className="text-lg">⏱️</span>
                  <h3 className="font-serif text-base font-bold text-[#15110e]">Live Stage &amp; Teleprompter Preferences</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Prompter Script Font Size
                    </label>
                    <select
                      value={prompterFontSize}
                      onChange={(e) => setPrompterFontSize(e.target.value as any)}
                      className="text-input"
                    >
                      <option value="Medium">Medium (16px)</option>
                      <option value="Large">Large (20px - Stage Recommended)</option>
                      <option value="Extra Large">Extra Large (24px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Stage Clock Format
                    </label>
                    <select
                      value={stageClockFormat}
                      onChange={(e) => setStageClockFormat(e.target.value as any)}
                      className="text-input"
                    >
                      <option value="12h">12-Hour (e.g. 7:15 PM)</option>
                      <option value="24h">24-Hour Military (e.g. 19:15)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Default Buffer Margin
                    </label>
                    <select
                      value={cueBufferMargin}
                      onChange={(e) => setCueBufferMargin(Number(e.target.value))}
                      className="text-input"
                    >
                      <option value={0}>0 minutes (Tight Timing)</option>
                      <option value={5}>5 minutes (Standard Buffer)</option>
                      <option value={10}>10 minutes (Relaxed Schedule)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between py-2 border-t border-[#f0ede4]">
                    <div>
                      <strong className="text-xs text-[#15110e] block">Visual Overrun Warning Flasher</strong>
                      <span className="text-[11px] text-[#8b7b6b]">Flash a gentle amber screen border when a speaker or speech cue exceeds +3 minutes.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={overrunAlert}
                        onChange={(e) => setOverrunAlert(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 3: Audio & DJ Tech Sync */}
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                  <span className="text-lg">🎧</span>
                  <h3 className="font-serif text-base font-bold text-[#15110e]">Audio &amp; DJ Master Sync</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Master DJ / Spotify Playlist URI
                    </label>
                    <input
                      type="text"
                      value={djPlaylistSync}
                      onChange={(e) => setDjPlaylistSync(e.target.value)}
                      className="text-input font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Entrance Chime Sound
                    </label>
                    <select
                      value={cueChimeSound}
                      onChange={(e) => setCueChimeSound(e.target.value)}
                      className="text-input"
                    >
                      <option value="Soft Bell">Soft Crystal Bell (Subtle)</option>
                      <option value="Chime Trio">Orchestral Chime Trio</option>
                      <option value="Gavel">Warm Wooden Gavel</option>
                      <option value="Fanfare">Brass Fanfare Accompany</option>
                    </select>
                  </div>
                </div>

                <div className="divide-y divide-[#f0ede4] pt-1">
                  <div className="flex items-center justify-between py-2.5">
                    <div>
                      <strong className="text-xs text-[#15110e] block">Auto-SMS Speech Reminders to Speakers</strong>
                      <span className="text-[11px] text-[#8b7b6b]">Sends a polite SMS cue to the Best Man &amp; Maid of Honor 15 minutes before their scheduled toast.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={autoSmsToSpeakers}
                        onChange={(e) => setAutoSmsToSpeakers(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <div>
                      <strong className="text-xs text-[#15110e] block">Share Private MC Run Sheet with Couple</strong>
                      <span className="text-[11px] text-[#8b7b6b]">Allow the couple to view private MC run sheet notes in read-only mode from their dashboard.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={shareNotesWithCouple}
                        onChange={(e) => setShareNotesWithCouple(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 4: Subscription & Save Actions */}
              <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-0.5 rounded">ACTIVE LICENSE</span>
                    <strong className="font-serif text-sm text-[#15110e]">MC Pro Annual Plan ($590 AUD/yr)</strong>
                  </div>
                  <p className="text-xs text-[#8b7b6b] mt-0.5">Renews automatically on 12 December 2026 &bull; Unlimited weddings &amp; run sheets.</p>
                </div>
                <div className="flex gap-2.5">
                  <button
                    type="submit"
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-6 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    Save MC Preferences
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}
      </main>

      {/* ==================================================================== */}
      {/* MODAL 1: ADD CUE MODAL                                               */}
      {/* ==================================================================== */}
      {showAddCueModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#d5c7b5] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-[#15110e]">
                Add Schedule Cue Entry
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCueModal(false)}
                className="text-[#8b7b6b] hover:text-[#15110e] text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddCue} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 17:00"
                    value={cueTime}
                    onChange={(e) => setCueTime(e.target.value)}
                    className="text-input"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Activity Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunset Golden Hour Photos"
                    value={cueActivity}
                    onChange={(e) => setCueActivity(e.target.value)}
                    className="text-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Public Notes / Running Details
                </label>
                <input
                  type="text"
                  placeholder="Public schedule guidance..."
                  value={cueNotes}
                  onChange={(e) => setCueNotes(e.target.value)}
                  className="text-input"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661] mb-1">
                  MC Cue Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Private cues, technical sound directions..."
                  value={cuePrivateNotes}
                  onChange={(e) => setCuePrivateNotes(e.target.value)}
                  className="text-input resize-none bg-[#fcfaf5] border-[#d4b483]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCueModal(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold btn-sm">
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: SEAT GUEST MODAL                                            */}
      {/* ==================================================================== */}
      {seatModalTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#d5c7b5] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-[#15110e]">
                Assign Guest to Table
              </h3>
              <button
                type="button"
                onClick={() => setSeatModalTarget(null)}
                className="text-[#8b7b6b] hover:text-[#15110e] text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Target Table
                </label>
                <div className="p-2 bg-[#faf7f2] border border-[#e8ded0] rounded text-xs font-bold text-[#15110e]">
                  {seatModalTarget.tableId === 'head'
                    ? 'Head Table (Seat ' + (seatModalTarget.seatIndex + 1) + ')'
                    : (state.tables.find(t => t.id === seatModalTarget.tableId)?.name || 'Table') + ' (Seat ' + (seatModalTarget.seatIndex + 1) + ')'}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Choose Confirmed Guest
                </label>
                <select
                  id="sg-modal-guest-select"
                  className="text-input text-xs"
                  defaultValue=""
                >
                  <option value="" disabled>Select unassigned guest...</option>
                  {confirmedGuests.filter(g => !g.tableId).map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} {g.dietary && g.dietary !== 'None' ? `(${g.dietary})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSeatModalTarget(null)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sel = (document.getElementById('sg-modal-guest-select') as HTMLSelectElement)?.value;
                    if (sel) {
                      assignGuestToTableAndSeat(sel, seatModalTarget.tableId, seatModalTarget.seatIndex);
                      setSeatModalTarget(null);
                    }
                  }}
                  className="btn btn-gold btn-sm"
                >
                  Confirm Seating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: NEW WEDDING WIZARD MODAL                                    */}
      {/* ==================================================================== */}
      {showNewWeddingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white border border-[#d5c7b5] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-[#f0ede4]">
              <div>
                <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                  MC PRO BOOKING
                </div>
                <h3 className="font-serif text-xl font-bold text-[#15110e]">
                  New Wedding Booking
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewWeddingModal(false)}
                className="text-[#8b7b6b] hover:text-[#15110e] text-xl font-bold cursor-pointer p-1 transition-colors"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWedding} className="space-y-3.5 text-xs">
              {/* WEDDING NAME */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Wedding Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam & Olivia's Wedding"
                  value={nwWeddingName}
                  onChange={(e) => setNwWeddingName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                />
              </div>

              {/* BRIDE NAME & GROOM NAME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Bride Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Olivia"
                    value={nwBrideName}
                    onChange={(e) => {
                      setNwBrideName(e.target.value);
                      if (!nwWeddingName || nwWeddingName.includes('&')) {
                        const other = nwGroomName ? ` & ${nwGroomName}` : '';
                        setNwWeddingName(`${e.target.value}${other}'s Wedding`);
                      }
                    }}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Groom Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam"
                    value={nwGroomName}
                    onChange={(e) => {
                      setNwGroomName(e.target.value);
                      if (!nwWeddingName || nwWeddingName.includes('&')) {
                        const first = nwBrideName ? `${nwBrideName} & ` : '';
                        setNwWeddingName(`${first}${e.target.value}'s Wedding`);
                      }
                    }}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>
              </div>

              {/* BRIDE EMAIL & GROOM EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Bride Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. olivia@example.com"
                    value={nwBrideEmail}
                    onChange={(e) => setNwBrideEmail(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Groom Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. liam@example.com"
                    value={nwGroomEmail}
                    onChange={(e) => setNwGroomEmail(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>
              </div>

              {/* VENUE LOCATION */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Venue Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bendooley Estate, Berrima"
                  value={nwVenue}
                  onChange={(e) => setNwVenue(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#f0ede4]">
                <button
                  type="button"
                  onClick={() => setShowNewWeddingModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e8ded0] text-[#8b7b6b] hover:bg-[#faf8f5] font-bold cursor-pointer text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm px-5 py-2 font-bold shadow-2xs cursor-pointer"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: NEW INVOICE MODAL                                           */}
      {/* ==================================================================== */}
      {/* SLIDE DRAWER: CLIENT FILE CONTACT DRAWER                             */}
      {/* ==================================================================== */}
            {/* ==================================================================== */}
      {/* MODAL: INVITE TEAM MEMBER & CONFIGURE ACCESS                        */}
      {/* ==================================================================== */}
      {showInviteMemberModal && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInviteMemberModal(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#e8ded0] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#15110e] text-white flex justify-between items-center border-b border-[#29211a]">
              <div>
                <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                  STAFF ONBOARDING
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Invite Team Member
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteMemberModal(false)}
                className="text-white/70 hover:text-[#bd9661] text-xl font-bold cursor-pointer transition-colors p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jessica Alva"
                    value={invName}
                    onChange={(e) => setInvName(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Role / Stage Title *
                  </label>
                  <select
                    value={invRole}
                    onChange={(e) => setInvRole(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white cursor-pointer"
                  >
                    <option value="Associate MC & Host">Associate MC & Host</option>
                    <option value="Day-of Wedding Coordinator">Day-of Wedding Coordinator</option>
                    <option value="Sound Engineer & AV Lead">Sound Engineer & AV Lead</option>
                    <option value="Stage Assistant & Floor Director">Stage Assistant & Floor Director</option>
                    <option value="Lighting & Effects Specialist">Lighting & Effects Specialist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jessica@galati.demo"
                    value={invEmail}
                    onChange={(e) => setInvEmail(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Mobile Phone
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-[#e8ded0] bg-[#faf8f5] text-xs font-bold font-mono text-[#8b7b6b] rounded-l-xl select-none">
                      +61
                    </span>
                    <input
                      type="tel"
                      placeholder="e.g. 0422 990 112"
                      value={invPhone}
                      onChange={(e) => setInvPhone(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-r-xl rounded-l-none px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Access Level Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Team Member Access Level *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'Full Access',
                      title: '👑 Full Access',
                      desc: 'Full console access: Run sheet, seating canvas, catering, messaging.',
                    },
                    {
                      id: 'Host & Run Sheet',
                      title: '🎤 Host & Run Sheet',
                      desc: 'Interactive cues, private runsheet notes, timeline checkoffs.',
                    },
                    {
                      id: 'Seating & Guests',
                      title: '🪑 Seating & Guests',
                      desc: 'Drag & drop seating canvas, RSVP checks, dietary summaries.',
                    },
                    {
                      id: 'Audio & AV Lead',
                      title: '🎧 Audio & AV Lead',
                      desc: 'Stage music timeline, mic cues, sound technical notes.',
                    },
                  ].map((level) => (
                    <div
                      key={level.id}
                      onClick={() => setInvAccessLevel(level.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        invAccessLevel === level.id
                          ? 'border-[#bd9661] bg-[#faf5ed] text-[#15110e] shadow-2xs'
                          : 'border-[#e8ded0] bg-white hover:bg-[#faf8f5] text-[#544332]'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{level.title}</span>
                        {invAccessLevel === level.id && <span className="text-[#bd9661]">✓</span>}
                      </div>
                      <p className="text-[10.5px] text-[#8b7b6b] mt-1 leading-normal">{level.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Weddings Scope */}
              <div className="space-y-1.5 pt-1 border-t border-[#f0ede4]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Assigned Wedding Scope
                </label>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#15110e]">
                    <input
                      type="radio"
                      name="invScope"
                      checked={invWeddingScope === 'all'}
                      onChange={() => setInvWeddingScope('all')}
                      className="accent-[#bd9661]"
                    />
                    <span>All Agency Weddings</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#15110e]">
                    <input
                      type="radio"
                      name="invScope"
                      checked={invWeddingScope === 'custom'}
                      onChange={() => setInvWeddingScope('custom')}
                      className="accent-[#bd9661]"
                    />
                    <span>Specific Weddings Only</span>
                  </label>
                </div>

                {invWeddingScope === 'custom' && (
                  <div className="p-2.5 bg-[#faf8f5] rounded-xl border border-[#e8ded0] space-y-1.5 mt-2">
                    <span className="text-[10px] uppercase font-bold text-[#8b7b6b]">Select Weddings:</span>
                    <div className="space-y-1">
                      {state.weddings.map((w) => (
                        <label key={w.id} className="flex items-center gap-2 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={invSelectedWeddings.includes(w.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setInvSelectedWeddings([...invSelectedWeddings, w.id]);
                              } else {
                                setInvSelectedWeddings(invSelectedWeddings.filter(id => id !== w.id));
                              }
                            }}
                            className="accent-[#bd9661]"
                          />
                          <span className="font-medium text-[#15110e]">{w.couple}</span>
                          <span className="text-[10px] text-[#8b7b6b]">({w.date})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Granular Feature Permissions */}
              <div className="space-y-1.5 pt-1 border-t border-[#f0ede4]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Feature Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invCanRunsheet}
                      onChange={(e) => setInvCanRunsheet(e.target.checked)}
                      className="accent-[#bd9661]"
                    />
                    <span>Edit Live Run Sheet</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invCanSeating}
                      onChange={(e) => setInvCanSeating(e.target.checked)}
                      className="accent-[#bd9661]"
                    />
                    <span>Modify Seating Canvas</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invCanDietary}
                      onChange={(e) => setInvCanDietary(e.target.checked)}
                      className="accent-[#bd9661]"
                    />
                    <span>View Dietary Alerts</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invCanMessaging}
                      onChange={(e) => setInvCanMessaging(e.target.checked)}
                      className="accent-[#bd9661]"
                    />
                    <span>Chat with Couples via Joey</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#e8ded0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteMemberModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e8ded0] text-[#8b7b6b] hover:bg-[#faf8f5] font-bold cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm px-5 py-2 font-bold shadow-2xs"
                >
                  Send Invitation &amp; Set Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: MANAGE EXISTING TEAM MEMBER ACCESS                           */}
      {/* ==================================================================== */}
      {selectedMemberForAccess && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMemberForAccess(null);
          }}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#e8ded0] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#15110e] text-white flex justify-between items-center border-b border-[#29211a]">
              <div>
                <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                  PERMISSIONS &amp; SCOPE
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Manage Access: {selectedMemberForAccess.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMemberForAccess(null)}
                className="text-white/70 hover:text-[#bd9661] text-xl font-bold cursor-pointer transition-colors p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateMemberAccess} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Role / Stage Designation
                </label>
                <input
                  type="text"
                  value={selectedMemberForAccess.role}
                  onChange={(e) => setSelectedMemberForAccess({ ...selectedMemberForAccess, role: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                />
              </div>

              {/* Access Tier */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Assigned Access Level Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'Full Access',
                      title: '👑 Full Access',
                      desc: 'Full console access: Run sheet, seating canvas, catering, messaging.',
                    },
                    {
                      id: 'Host & Run Sheet',
                      title: '🎤 Host & Run Sheet',
                      desc: 'Interactive cues, private runsheet notes, timeline checkoffs.',
                    },
                    {
                      id: 'Seating & Guests',
                      title: '🪑 Seating & Guests',
                      desc: 'Drag & drop seating canvas, RSVP checks, dietary summaries.',
                    },
                    {
                      id: 'Audio & AV Lead',
                      title: '🎧 Audio & AV Lead',
                      desc: 'Stage music timeline, mic cues, sound technical notes.',
                    },
                  ].map((level) => (
                    <div
                      key={level.id}
                      onClick={() => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        accessLevel: level.id as any
                      })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedMemberForAccess.accessLevel === level.id
                          ? 'border-[#bd9661] bg-[#faf5ed] text-[#15110e] shadow-2xs'
                          : 'border-[#e8ded0] bg-white hover:bg-[#faf8f5] text-[#544332]'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{level.title}</span>
                        {selectedMemberForAccess.accessLevel === level.id && <span className="text-[#bd9661]">✓</span>}
                      </div>
                      <p className="text-[10.5px] text-[#8b7b6b] mt-1 leading-normal">{level.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Scope */}
              <div className="space-y-1.5 pt-1 border-t border-[#f0ede4]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Assigned Wedding Scope
                </label>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#15110e]">
                    <input
                      type="radio"
                      name="manageScope"
                      checked={selectedMemberForAccess.assignedWeddings?.includes('all') || !selectedMemberForAccess.assignedWeddings}
                      onChange={() => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        assignedWeddings: ['all']
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>All Agency Weddings</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#15110e]">
                    <input
                      type="radio"
                      name="manageScope"
                      checked={!selectedMemberForAccess.assignedWeddings?.includes('all') && (selectedMemberForAccess.assignedWeddings?.length || 0) > 0}
                      onChange={() => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        assignedWeddings: ['w1']
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>Specific Weddings Only</span>
                  </label>
                </div>

                {!selectedMemberForAccess.assignedWeddings?.includes('all') && selectedMemberForAccess.assignedWeddings && (
                  <div className="p-2.5 bg-[#faf8f5] rounded-xl border border-[#e8ded0] space-y-1.5 mt-2">
                    <span className="text-[10px] uppercase font-bold text-[#8b7b6b]">Select Weddings:</span>
                    <div className="space-y-1">
                      {state.weddings.map((w) => {
                        const isAssigned = (selectedMemberForAccess.assignedWeddings || []).includes(w.id);
                        return (
                          <label key={w.id} className="flex items-center gap-2 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={(e) => {
                                const curr = selectedMemberForAccess.assignedWeddings || [];
                                const updated = e.target.checked
                                  ? [...curr, w.id]
                                  : curr.filter(id => id !== w.id);
                                setSelectedMemberForAccess({
                                  ...selectedMemberForAccess,
                                  assignedWeddings: updated.length ? updated : ['w1']
                                });
                              }}
                              className="accent-[#bd9661]"
                            />
                            <span className="font-medium text-[#15110e]">{w.couple}</span>
                            <span className="text-[10px] text-[#8b7b6b]">({w.date})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Granular Feature Permissions */}
              <div className="space-y-1.5 pt-1 border-t border-[#f0ede4]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Feature Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedMemberForAccess.permissions?.canEditRunsheet}
                      onChange={(e) => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        permissions: { ...selectedMemberForAccess.permissions, canEditRunsheet: e.target.checked }
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>Edit Live Run Sheet</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedMemberForAccess.permissions?.canEditSeating}
                      onChange={(e) => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        permissions: { ...selectedMemberForAccess.permissions, canEditSeating: e.target.checked }
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>Modify Seating Canvas</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedMemberForAccess.permissions?.canViewDietary}
                      onChange={(e) => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        permissions: { ...selectedMemberForAccess.permissions, canViewDietary: e.target.checked }
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>View Dietary Alerts</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedMemberForAccess.permissions?.canMessageClients}
                      onChange={(e) => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        permissions: { ...selectedMemberForAccess.permissions, canMessageClients: e.target.checked }
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>Chat with Couples via Joey</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#e8ded0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleRemoveMember(selectedMemberForAccess.id)}
                  className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer"
                >
                  Remove Member
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMemberForAccess(null)}
                    className="px-4 py-2 rounded-xl border border-[#e8ded0] text-[#8b7b6b] hover:bg-[#faf8f5] font-bold cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-gold btn-sm px-5 py-2 font-bold shadow-2xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Joey AI Assistant for Desktop MC */}
      <JoeyChatbot context="mc" />

{selectedClient && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex justify-end"
          onClick={() => setSelectedClient(null)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="bg-[#15110e] text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] tracking-[2px] uppercase text-[#bd9661] font-bold">
                  CLIENT FILE
                </div>
                <h3 className="font-serif text-xl font-bold">{selectedClient.couple}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="text-white hover:text-[#bd9661] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">Wedding Date</label>
                <div className="font-bold text-sm text-[#15110e]">{selectedClient.weddingDate}</div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">Venue Location</label>
                <div className="text-[#15110e]">{selectedClient.venue}</div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">Primary Contact Phone</label>
                <a href={`tel:${selectedClient.phone}`} className="text-[#bd9661] font-bold hover:underline">
                  {selectedClient.phone}
                </a>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">Email</label>
                <a href={`mailto:${selectedClient.email}`} className="text-[#bd9661] font-bold hover:underline">
                  {selectedClient.email}
                </a>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">Contract &amp; Package Tier</label>
                <div className="text-[#15110e]">{selectedClient.tier} ({selectedClient.deposit})</div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">MC Operational Notes</label>
                <p className="bg-[#faf7f2] p-3 rounded-lg border border-[#e8ded0] text-[#5a4a3c] leading-relaxed">
                  {selectedClient.notes}
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => showToast(`Initiating mock call to ${selectedClient.couple} (${selectedClient.phone})`, 'info')}
                  className="btn btn-gold w-full py-2.5 font-bold"
                >
                  Call Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Record Reception Cash / Envelope Gift */}
      {showMcAddGiftModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8ded0] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#15110e]">
                  Record Reception Envelope / Gift
                </h3>
                <span className="text-xs text-[#8b7b6b]">Log physical cards or contributions handed to the MC</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMcAddGiftModal(false)}
                className="text-[#8b7b6b] hover:text-[#15110e] text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleMcAddGift} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  CONTRIBUTOR / GUEST NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uncle Arthur & Aunt Evelyn"
                  value={mcGiftName}
                  onChange={(e) => setMcGiftName(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg p-2 text-xs text-[#15110e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    AMOUNT (AUD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="300"
                    value={mcGiftAmount}
                    onChange={(e) => setMcGiftAmount(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg p-2 text-xs text-[#15110e] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    GIFT TYPE
                  </label>
                  <select
                    value={mcGiftType}
                    onChange={(e) => setMcGiftType(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg p-2 text-xs text-[#15110e] outline-none"
                  >
                    <option value="Cash Envelope (Podium)">💌 Cash Envelope (Podium)</option>
                    <option value="Cheque in Greeting Card">📜 Cheque in Card</option>
                    <option value="Digital Wishing Well">📱 Wishing Well Transfer</option>
                    <option value="Physical Gift Box">🎁 Physical Boxed Gift</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  BLESSING MESSAGE / MC NOTE
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Handed to MC at reception podium with greeting card"
                  value={mcGiftMessage}
                  onChange={(e) => setMcGiftMessage(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg p-2 text-xs text-[#15110e] outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e8ded0]">
                <button
                  type="button"
                  onClick={() => setShowMcAddGiftModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#d5c7b5] text-xs font-semibold text-[#8b7b6b] hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#bd9661] hover:bg-[#a6824e] text-[#15110e] text-xs font-bold shadow-sm"
                >
                  Save to Gift Ledger &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
