import React, { useState } from 'react';
import { DemoState, ReferralCode, ReferredCouple } from '../lib/types';
import { showToast, logAudit } from '../lib/state';

interface McReferralsSectionProps {
  state: DemoState;
  setState: (state: DemoState) => void;
}

export default function McReferralsSection({ state, setState }: McReferralsSectionProps) {
  const referralCodes: ReferralCode[] = state.referralCodes || [];
  const referredCouples: ReferredCouple[] = state.referredCouples || [];

  const [showNewCodeModal, setShowNewCodeModal] = useState(false);
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeType, setNewCodeType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCodeValue, setNewCodeValue] = useState(15);
  const [newCodeDesc, setNewCodeDesc] = useState('');
  const [newCodeReward, setNewCodeReward] = useState(150);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Pending'>('all');

  const primaryCode = referralCodes[0]?.code || 'ROBERT-VIP-15';
  const referralLink = `https://tapandtoast.demo/signup?ref=${primaryCode}`;

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    showToast(`✓ Promo code ${code} copied to clipboard!`, 'success');
  };

  const handleCopyLink = (code: string) => {
    const link = `https://tapandtoast.demo/signup?ref=${code}`;
    navigator.clipboard?.writeText(link);
    showToast(`✓ Referral signup link copied to clipboard!`, 'success');
  };

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName.trim()) {
      showToast('Please enter a valid promo code', 'error');
      return;
    }
    const cleanCode = newCodeName.trim().toUpperCase().replace(/\s+/g, '-');
    const newCodeItem: ReferralCode = {
      id: 'ref_' + Date.now(),
      code: cleanCode,
      discountType: newCodeType,
      discountValue: Number(newCodeValue),
      description: newCodeDesc || `${cleanCode} exclusive referral discount for couples`,
      usesCount: 0,
      mcRewardValue: Number(newCodeReward),
      status: 'active',
      createdDate: 'Today',
    };

    setState({
      ...state,
      referralCodes: [newCodeItem, ...referralCodes],
    });

    logAudit(state, setState, 'Promo Code Created', 'Robert Galati', 'mc', `Created promo code ${cleanCode} with ${newCodeValue}${newCodeType === 'percentage' ? '%' : ' AUD'} discount`, 'General');
    setShowNewCodeModal(false);
    setNewCodeName('');
    setNewCodeDesc('');
    showToast(`✓ Promo code ${cleanCode} created successfully!`, 'success');
  };

  const handleToggleCodeStatus = (id: string) => {
    const updated = referralCodes.map(c =>
      c.id === id ? { ...c, status: (c.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' } : c
    );
    setState({ ...state, referralCodes: updated });
    showToast('Promo code status updated', 'info');
  };

  const handleRequestPayout = () => {
    showToast('✓ Payout request of $600 AUD submitted to St George Bank (BSB: 062-000, Acc: ****4182)', 'success');
  };

  const handleShareWhatsApp = (code: string) => {
    const text = `Hey! Here is my exclusive Master of Ceremonies promo code for Tap & Toast: ${code}. You will get 15% off your wedding platform setup: https://tapandtoast.demo/signup?ref=${code}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    showToast('Opening WhatsApp to share referral code', 'info');
  };

  const handleShareEmail = (code: string) => {
    const subject = encodeURIComponent('Exclusive 15% Wedding Discount from Robert Galati (MC)');
    const body = encodeURIComponent(
      `Hi there,\n\nI am delighted to share an exclusive 15% discount for your wedding planning suite on Tap & Toast.\n\nUse my personal promo code: ${code} at checkout, or simply sign up here:\nhttps://tapandtoast.demo/signup?ref=${code}\n\nWarm regards,\nRobert Galati | Executive MC`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    showToast('Opening email client with referral invitation', 'info');
  };

  const filteredCouples = referredCouples.filter(c => {
    const matchesSearch = c.coupleName.toLowerCase().includes(searchQuery.toLowerCase()) || c.codeUsed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.commissionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <section className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
            PARTNER AMBASSADOR &amp; DISCOUNTS
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#15110e]">
            Referrals &amp; Promo Codes
          </h1>
          <p className="text-xs text-[#8b7b6b] mt-1">
            Share your custom referral code with engaged couples. They receive up to 15% off their platform booking, and you earn direct commission.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewCodeModal(true)}
          className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
        >
          <span>+</span> Create Promo Code
        </button>
      </div>

      {/* Hero Ambassador Card */}
      <div className="bg-gradient-to-r from-[#15110e] via-[#241a13] to-[#15110e] border border-[#a8824f]/60 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#bd9661]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#2a1f16] border border-[#bd9661] text-[#dfc194] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ⭐ Verified MC Ambassador Program
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">● Active Payouts</span>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-white">
                Your Primary Referral Code
              </h2>
              <p className="text-xs text-[#d9c9b8] mt-1 leading-relaxed">
                Give couples <strong className="text-[#dfc194]">15% OFF</strong> their Tap &amp; Toast subscription or platform deposit.
                You earn <strong className="text-emerald-400">$150 AUD direct payout</strong> or pro account credits for every confirmed booking.
              </p>
            </div>

            {/* Code Box & Actions */}
            <div className="flex items-center gap-3 flex-wrap pt-1">
              <div className="bg-[#0b0806] border-2 border-[#bd9661] px-4 py-2 rounded-xl flex items-center gap-3">
                <span className="text-sm text-[#8b7b6b]">CODE:</span>
                <span className="font-mono text-base font-bold text-[#dfc194] tracking-wider">
                  {primaryCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(primaryCode)}
                  className="bg-[#241a13] hover:bg-[#3d2e23] text-[#dfc194] text-xs font-semibold px-2.5 py-1 rounded cursor-pointer transition-colors"
                >
                  Copy Code
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleCopyLink(primaryCode)}
                className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>🔗</span> Copy Signup Link
              </button>

              <button
                type="button"
                onClick={() => handleShareWhatsApp(primaryCode)}
                className="bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>💬</span> WhatsApp
              </button>

              <button
                type="button"
                onClick={() => handleShareEmail(primaryCode)}
                className="bg-[#2b221a] hover:bg-[#3d3126] text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 border border-[#4a3a2d]"
              >
                <span>✉️</span> Email Invitation
              </button>
            </div>
          </div>

          {/* QR Code & Direct Badge */}
          <div className="bg-[#1c140e] border border-[#bd9661]/40 rounded-xl p-4 text-center flex flex-col items-center flex-shrink-0 w-full sm:w-auto shadow-md">
            <div className="text-[10px] uppercase font-bold text-[#bd9661] tracking-wider mb-2">
              Printed QaRd &amp; Promo QR
            </div>
            <div className="bg-white p-2 rounded-lg w-[110px] h-[110px] flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(referralLink)}`}
                alt="Referral QR Code"
                className="w-[100px] h-[100px] object-contain"
              />
            </div>
            <div className="text-[10px] text-[#c9bbae] mt-2">
              Scan to redeem 15% discount
            </div>
          </div>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-xs">
          <div className="text-xs uppercase text-[#8b7b6b] font-bold">Total Couples Referred</div>
          <div className="font-serif text-3xl font-bold text-[#15110e] mt-1.5">18 Couples</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <span>↑ +4 new</span>
            <span className="text-[#8b7b6b]">this month</span>
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-xs">
          <div className="text-xs uppercase text-[#8b7b6b] font-bold">Confirmed Bookings</div>
          <div className="font-serif text-3xl font-bold text-[#15110e] mt-1.5">12 Weddings</div>
          <div className="text-xs text-[#bd9661] font-semibold mt-1">
            66.7% referral conversion rate
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-xs">
          <div className="text-xs uppercase text-[#8b7b6b] font-bold">Couples Total Savings</div>
          <div className="font-serif text-3xl font-bold text-[#15110e] mt-1.5">$2,700 AUD</div>
          <div className="text-xs text-[#8b7b6b] font-semibold mt-1">
            Average $225 saved per couple
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase text-[#8b7b6b] font-bold">Commission Earned</div>
            <div className="font-serif text-3xl font-bold text-emerald-700 mt-1.5">$1,800 AUD</div>
            <div className="text-xs text-[#8b7b6b] font-semibold mt-1">
              $600 available for payout
            </div>
          </div>
          <button
            type="button"
            onClick={handleRequestPayout}
            className="mt-3 bg-[#15110e] hover:bg-[#231c17] text-[#dfc194] text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-colors text-center w-full shadow-xs"
          >
            Request Payout ($600) &rarr;
          </button>
        </div>
      </div>

      {/* Promo Code Campaign Manager */}
      <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#15110e]">
              Active Discount Codes &amp; Campaign Rules
            </h2>
            <p className="text-xs text-[#8b7b6b] mt-0.5">
              Customize multiple promo codes for bridal expos, seasonal discounts, and VIP couples.
            </p>
          </div>
          <div className="text-xs font-bold text-[#bd9661] bg-[#faf6f0] border border-[#ebd3a8] px-3 py-1 rounded-full">
            {referralCodes.filter(c => c.status === 'active').length} Active Campaigns
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {referralCodes.map((code) => {
            const isActive = code.status === 'active';
            return (
              <div
                key={code.id}
                className={`rounded-xl p-4 border transition-all space-y-3 ${
                  isActive ? 'bg-[#faf8f5] border-[#ebd3a8] shadow-xs' : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-sm font-bold text-[#15110e] bg-white border border-[#d5c7b5] px-2 py-0.5 rounded">
                      {code.code}
                    </span>
                    <div className="text-[10px] text-[#8b7b6b] mt-1 font-semibold">
                      Created: {code.createdDate}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isActive ? 'Active' : 'Paused'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#bd9661]">
                    {code.discountValue}{code.discountType === 'percentage' ? '% OFF' : ' AUD Flat Off'}
                  </div>
                  <p className="text-[11px] text-[#6b5849] line-clamp-2">
                    {code.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f0ede4] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#8b7b6b] block">Uses</span>
                    <strong className="text-[#15110e]">{code.usesCount} weddings</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8b7b6b] block">MC Reward</span>
                    <strong className="text-emerald-700">+${code.mcRewardValue}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleCodeStatus(code.id)}
                    className="text-[10px] font-bold text-[#bd9661] hover:underline cursor-pointer"
                  >
                    {isActive ? 'Pause' : 'Activate'}
                  </button>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(code.code)}
                    className="flex-1 bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-semibold text-[11px] py-1 rounded-md cursor-pointer transition-colors text-center"
                  >
                    Copy Code
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(code.code)}
                    className="flex-1 bg-[#15110e] hover:bg-[#231c17] text-white font-semibold text-[11px] py-1 rounded-md cursor-pointer transition-colors text-center"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referred Couples & Payout Table */}
      <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#15110e]">
              Referred Couples &amp; Rewards Ledger
            </h2>
            <p className="text-xs text-[#8b7b6b] mt-0.5">
              Live audit trail of couples who redeemed your referral codes and commission payment status.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter couple or code..."
              className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
            />

            {/* Status Filter */}
            <div className="flex bg-[#faf8f5] p-1 rounded-xl border border-[#e8ded0] text-xs">
              {(['all', 'Paid', 'Pending'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors ${
                    statusFilter === status
                      ? 'bg-[#15110e] text-white shadow-xs'
                      : 'text-[#8b7b6b] hover:text-[#15110e]'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#f0ede4] text-[#8b7b6b] uppercase text-[10px] tracking-wider bg-[#faf8f5]">
                <th className="p-3">Referred Couple</th>
                <th className="p-3">Wedding Date</th>
                <th className="p-3">Promo Code</th>
                <th className="p-3">Couple Discount</th>
                <th className="p-3">MC Commission</th>
                <th className="p-3">Commission Status</th>
                <th className="p-3">Date Referred</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ede4]">
              {filteredCouples.map((c) => (
                <tr key={c.id} className="hover:bg-[#faf8f5] transition-colors">
                  <td className="p-3 font-bold text-[#15110e]">{c.coupleName}</td>
                  <td className="p-3 text-[#6b5849]">{c.weddingDate}</td>
                  <td className="p-3">
                    <span className="font-mono bg-white border border-[#d5c7b5] px-2 py-0.5 rounded text-[11px] font-bold text-[#bd9661]">
                      {c.codeUsed}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-700">-${c.discountSaved} AUD</td>
                  <td className="p-3 font-bold text-[#15110e]">+${c.mcCommission} AUD</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.commissionStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.commissionStatus}
                    </span>
                  </td>
                  <td className="p-3 text-[#8b7b6b]">{c.dateReferred}</td>
                </tr>
              ))}
              {filteredCouples.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-[#8b7b6b] italic">
                    No referred couples matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create New Promo Code */}
      {showNewCodeModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ebd3a8] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
              <h3 className="font-serif text-lg font-bold text-[#15110e]">
                Create New Referral Promo Code
              </h3>
              <button
                type="button"
                onClick={() => setShowNewCodeModal(false)}
                className="w-7 h-7 rounded-full bg-[#f0ede4] hover:bg-[#e2ddd3] flex items-center justify-center text-xs text-[#15110e] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCode} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">
                  Promo Code (e.g. AUTUMN2027)
                </label>
                <input
                  type="text"
                  required
                  value={newCodeName}
                  onChange={(e) => setNewCodeName(e.target.value.toUpperCase())}
                  placeholder="e.g. EXPO-SPECIAL"
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 font-mono font-bold text-sm text-[#15110e] outline-none focus:border-[#bd9661]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newCodeType}
                    onChange={(e) => setNewCodeType(e.target.value as any)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 text-[#15110e] outline-none"
                  >
                    <option value="percentage">Percentage (% Off)</option>
                    <option value="fixed">Flat Amount ($ AUD Off)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">
                    Discount Amount {newCodeType === 'percentage' ? '(%)' : '($ AUD)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={newCodeType === 'percentage' ? 50 : 500}
                    required
                    value={newCodeValue}
                    onChange={(e) => setNewCodeValue(Number(e.target.value))}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">
                  MC Commission / Reward per Booking ($ AUD)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  required
                  value={newCodeReward}
                  onChange={(e) => setNewCodeReward(Number(e.target.value))}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 text-[#15110e] outline-none focus:border-[#bd9661]"
                />
                <span className="text-[10px] text-[#8b7b6b] mt-0.5 block">
                  You will receive this reward whenever a couple confirms a booking using this code.
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">
                  Description / Campaign Target
                </label>
                <input
                  type="text"
                  value={newCodeDesc}
                  onChange={(e) => setNewCodeDesc(e.target.value)}
                  placeholder="e.g. Exclusive voucher for Hunter Valley Bridal Showcase"
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 text-[#15110e] outline-none focus:border-[#bd9661]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCodeModal(false)}
                  className="flex-1 bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-semibold py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 rounded-xl cursor-pointer shadow-sm"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
