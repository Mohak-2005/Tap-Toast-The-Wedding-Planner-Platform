import React, { useState, useMemo } from 'react';
import { Wedding, WeddingVendor } from '../lib/types';
import { formatAUD, showToast, logAudit, useAppState } from '../lib/state';

interface VendorDirectorySectionProps {
  wedding: Wedding;
  onUpdateWeddingVendors: (vendors: WeddingVendor[]) => void;
}

const DEFAULT_VENDORS: WeddingVendor[] = [
  {
    id: 'v1',
    category: 'Photography & Cinema',
    businessName: 'Willow & Wolf Cinematography',
    contactName: 'Sarah Jenkins',
    email: 'sarah@willowandwolf.com.au',
    phone: '0412 849 201',
    website: 'https://willowandwolf.com.au',
    instagram: '@willowandwolffilms',
    status: 'Booked',
    cost: 4200,
    paidAmount: 2000,
    notes: 'Full 10-hour coverage, 2 shooters, drone aerial footage, 4K highlight film + raw USB.'
  },
  {
    id: 'v2',
    category: 'Florals & Styling',
    businessName: 'Fleur & Botanica Studio',
    contactName: 'Elena Rostova',
    email: 'elena@fleurbotanica.com.au',
    phone: '0423 118 732',
    website: 'https://fleurbotanica.com.au',
    instagram: '@fleurbotanica',
    status: 'Deposit Paid',
    cost: 3500,
    paidAmount: 1500,
    notes: 'Ceremony floral arch, 12 table centrepieces, bridal bouquet + 4 bridesmaid bouquets, buttonholes.'
  },
  {
    id: 'v3',
    category: 'Catering & Bar',
    businessName: 'Fernwood Estate Culinary & Cellar',
    contactName: 'Chef Marco Valenti',
    email: 'banquets@fernwoodestate.com.au',
    phone: '02 4861 8890',
    website: 'https://fernwoodestate.com.au',
    status: 'Booked',
    cost: 12800,
    paidAmount: 8000,
    notes: '3-course shared feast, premium Southern Highlands wine pairing, kids meals, late-night sliders.'
  },
  {
    id: 'v4',
    category: 'Music & Entertainment',
    businessName: 'Groove & Brass Collective',
    contactName: 'Dave Miller',
    email: 'bookings@grooveandbrass.com.au',
    phone: '0431 556 902',
    website: 'https://grooveandbrass.com.au',
    instagram: '@groovebrasssyd',
    status: 'Booked',
    cost: 2800,
    paidAmount: 1400,
    notes: 'Acoustic duo for ceremony & canapés, 5-piece live dance band for reception (7:30 PM - 11:30 PM).'
  },
  {
    id: 'v5',
    category: 'Celebrant',
    businessName: 'Clara Davis Ceremonies',
    contactName: 'Clara Davis',
    email: 'clara@claradaviscivil.com.au',
    phone: '0405 992 411',
    website: 'https://claradaviscivil.com.au',
    status: 'Paid in Full',
    cost: 950,
    paidAmount: 950,
    notes: 'NSW BDM legal paperwork registration, bespoke story ceremony script, Thursday rehearsal.'
  },
  {
    id: 'v6',
    category: 'Hair & Makeup',
    businessName: 'Glow & Co Bridal Artistry',
    contactName: 'Chloe Dupont',
    email: 'chloe@glowandco.com.au',
    phone: '0418 773 240',
    website: 'https://glowandcobridal.com.au',
    instagram: '@glowandcobridal',
    status: 'Deposit Paid',
    cost: 1600,
    paidAmount: 800,
    notes: 'Bridal hair & makeup + 4 bridesmaids + Mother of the Bride. Includes touch-up kits.'
  }
];

const CATEGORIES = [
  'All',
  'Photography & Cinema',
  'Florals & Styling',
  'Catering & Bar',
  'Music & Entertainment',
  'Celebrant',
  'Hair & Makeup',
  'Venue',
  'Cake Designer',
  'Attire & Styling',
  'Transport',
  'Other'
];

export const VendorDirectorySection: React.FC<VendorDirectorySectionProps> = ({
  wedding,
  onUpdateWeddingVendors,
}) => {
  const { state, setState } = useAppState();

  const vendors: WeddingVendor[] = useMemo(() => {
    if (wedding.vendors && wedding.vendors.length > 0) {
      return wedding.vendors;
    }
    return DEFAULT_VENDORS;
  }, [wedding.vendors]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<WeddingVendor | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState('Photography & Cinema');
  const [formBusinessName, setFormBusinessName] = useState('');
  const [formContactName, setFormContactName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formInstagram, setFormInstagram] = useState('');
  const [formStatus, setFormStatus] = useState<WeddingVendor['status']>('Booked');
  const [formCost, setFormCost] = useState<string>('');
  const [formPaidAmount, setFormPaidAmount] = useState<string>('');
  const [formNotes, setFormNotes] = useState('');

  // Metrics
  const totalCost = vendors.reduce((acc, v) => acc + (v.cost || 0), 0);
  const totalPaid = vendors.reduce((acc, v) => acc + (v.paidAmount || 0), 0);
  const totalRemaining = Math.max(0, totalCost - totalPaid);
  const confirmedCount = vendors.filter(v => v.status === 'Booked' || v.status === 'Paid in Full').length;

  const filteredVendors = vendors.filter(v => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.businessName.toLowerCase().includes(q) ||
      v.contactName.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      (v.notes || '').toLowerCase().includes(q) ||
      (v.email || '').toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'All' || v.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All' || v.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setEditingVendor(null);
    setFormCategory('Photography & Cinema');
    setFormBusinessName('');
    setFormContactName('');
    setFormEmail('');
    setFormPhone('');
    setFormWebsite('');
    setFormInstagram('');
    setFormStatus('Booked');
    setFormCost('');
    setFormPaidAmount('');
    setFormNotes('');
    setShowModal(true);
  };

  const handleOpenEditModal = (vendor: WeddingVendor) => {
    setEditingVendor(vendor);
    setFormCategory(vendor.category);
    setFormBusinessName(vendor.businessName);
    setFormContactName(vendor.contactName);
    setFormEmail(vendor.email);
    setFormPhone(vendor.phone);
    setFormWebsite(vendor.website || '');
    setFormInstagram(vendor.instagram || '');
    setFormStatus(vendor.status);
    setFormCost(vendor.cost !== undefined ? String(vendor.cost) : '');
    setFormPaidAmount(vendor.paidAmount !== undefined ? String(vendor.paidAmount) : '');
    setFormNotes(vendor.notes || '');
    setShowModal(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBusinessName.trim()) {
      showToast('Please enter the vendor business name', 'error');
      return;
    }

    const costNum = formCost ? parseFloat(formCost) || 0 : undefined;
    const paidNum = formPaidAmount ? parseFloat(formPaidAmount) || 0 : undefined;

    let updatedList: WeddingVendor[];

    if (editingVendor) {
      updatedList = vendors.map(v =>
        v.id === editingVendor.id
          ? {
              ...v,
              category: formCategory,
              businessName: formBusinessName.trim(),
              contactName: formContactName.trim(),
              email: formEmail.trim(),
              phone: formPhone.trim(),
              website: formWebsite.trim() || undefined,
              instagram: formInstagram.trim() || undefined,
              status: formStatus,
              cost: costNum,
              paidAmount: paidNum,
              notes: formNotes.trim() || undefined,
            }
          : v
      );
      showToast(`Updated details for "${formBusinessName}"`, 'success');
      logAudit(state, setState, 'Vendor Updated', wedding.couple, 'couple', `Updated vendor: ${formBusinessName}`, 'Content');
    } else {
      const newVendor: WeddingVendor = {
        id: 'v_' + Date.now(),
        category: formCategory,
        businessName: formBusinessName.trim(),
        contactName: formContactName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        website: formWebsite.trim() || undefined,
        instagram: formInstagram.trim() || undefined,
        status: formStatus,
        cost: costNum,
        paidAmount: paidNum,
        notes: formNotes.trim() || undefined,
      };
      updatedList = [newVendor, ...vendors];
      showToast(`Added "${formBusinessName}" to Vendor Directory`, 'success');
      logAudit(state, setState, 'Vendor Added', wedding.couple, 'couple', `Added new vendor: ${formBusinessName} (${formCategory})`, 'Content');
    }

    onUpdateWeddingVendors(updatedList);
    setShowModal(false);
  };

  const handleDeleteVendor = (vendor: WeddingVendor) => {
    if (window.confirm(`Are you sure you want to remove "${vendor.businessName}" from your vendor directory?`)) {
      const updatedList = vendors.filter(v => v.id !== vendor.id);
      onUpdateWeddingVendors(updatedList);
      showToast(`Removed "${vendor.businessName}" from Vendor Directory`, 'info');
      logAudit(state, setState, 'Vendor Deleted', wedding.couple, 'couple', `Removed vendor: ${vendor.businessName}`, 'Content');
    }
  };

  const getStatusBadge = (status: WeddingVendor['status']) => {
    switch (status) {
      case 'Paid in Full':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Booked':
        return 'bg-[#e8eee4] text-[#3c6a42] border-[#c9d8c3]';
      case 'Deposit Paid':
        return 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]';
      case 'In Discussion':
        return 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]';
      case 'Final Payment Due':
        return 'bg-[#fee2e2] text-[#b91c1c] border-[#fca5a5]';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Photography & Cinema':
        return '📷';
      case 'Florals & Styling':
        return '💐';
      case 'Catering & Bar':
        return '🍽️';
      case 'Music & Entertainment':
        return '🎵';
      case 'Celebrant':
        return '🕊️';
      case 'Hair & Makeup':
        return '💄';
      case 'Venue':
        return '🏛️';
      case 'Cake Designer':
        return '🎂';
      case 'Attire & Styling':
        return '👗';
      case 'Transport':
        return '🚗';
      default:
        return '✨';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Description */}
      <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-1">
            COUPLE CONTENT &bull; VENDOR DIRECTORY
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#15110e]">
            Wedding Vendor Directory
          </h2>
          <p className="text-xs text-[#8b7b6b] mt-1 max-w-2xl leading-relaxed">
            Maintain all your wedding vendor details, contact persons, phone numbers, quoted fees, and service deliverables in one central directory. 
            <span className="font-semibold text-[#15110e]"> No separate vendor login required</span> — this is your private wedding book.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span className="text-base font-bold">+</span>
          <span>Add New Vendor</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#8b7b6b] text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Vendors</span>
            <span>📋</span>
          </div>
          <div className="font-serif text-2xl font-bold text-[#15110e]">
            {vendors.length}
          </div>
          <div className="text-[11px] text-[#8b7b6b] mt-1">
            {confirmedCount} confirmed bookings
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#8b7b6b] text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Confirmed Bookings</span>
            <span>✅</span>
          </div>
          <div className="font-serif text-2xl font-bold text-[#3c6a42]">
            {confirmedCount}
          </div>
          <div className="text-[11px] text-[#8b7b6b] mt-1">
            {vendors.length - confirmedCount} in discussion/pending
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#8b7b6b] text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Quoted</span>
            <span>💵</span>
          </div>
          <div className="font-serif text-2xl font-bold text-[#15110e]">
            {formatAUD(totalCost)}
          </div>
          <div className="text-[11px] text-[#8b7b6b] mt-1">
            Across {vendors.filter(v => (v.cost || 0) > 0).length} suppliers
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#8b7b6b] text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Paid to Date</span>
            <span>💳</span>
          </div>
          <div className="font-serif text-2xl font-bold text-[#bd9661]">
            {formatAUD(totalPaid)}
          </div>
          <div className="text-[11px] text-[#8b7b6b] mt-1">
            Remaining: <strong className="text-[#15110e]">{formatAUD(totalRemaining)}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7b6b] text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by vendor name, contact person, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#faf8f5] border border-[#e8ded0] rounded-xl text-xs outline-none focus:border-[#bd9661] text-[#15110e]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8b7b6b] hover:text-[#15110e] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#8b7b6b] uppercase tracking-wider shrink-0">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Deposit Paid">Deposit Paid</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Final Payment Due">Final Payment Due</option>
              <option value="Paid in Full">Paid in Full</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#15110e] text-[#dfc194]'
                  : 'bg-[#faf8f5] border border-[#f0ede4] text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#f5ede2]'
              }`}
            >
              {cat !== 'All' && <span className="mr-1">{getCategoryIcon(cat)}</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Cards Grid */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white border border-[#e8ded0] rounded-2xl p-12 text-center shadow-xs space-y-3">
          <div className="text-4xl">💐</div>
          <h3 className="font-serif text-lg font-bold text-[#15110e]">No wedding vendors found</h3>
          <p className="text-xs text-[#8b7b6b] max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All'
              ? 'Try adjusting your search query or filters above.'
              : 'Start adding your wedding suppliers, contacts, and contracted deliverables.'}
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="mt-2 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            + Add First Vendor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVendors.map((vendor) => {
            const hasCost = (vendor.cost || 0) > 0;
            const paidPct = hasCost ? Math.min(100, Math.round(((vendor.paidAmount || 0) / (vendor.cost || 1)) * 100)) : 0;

            return (
              <div
                key={vendor.id}
                className="bg-white border border-[#e8ded0] hover:border-[#bd9661]/60 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Category & Status Row */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#f0ede4]">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#916c3d] bg-[#faf6f0] border border-[#ebd3a8] px-2.5 py-0.5 rounded-full">
                      <span>{getCategoryIcon(vendor.category)}</span>
                      <span>{vendor.category}</span>
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(vendor.status)}`}>
                      {vendor.status}
                    </span>
                  </div>

                  {/* Business Name & Contact Person */}
                  <div className="mt-3">
                    <h3 className="font-serif text-lg font-bold text-[#15110e] group-hover:text-[#bd9661] transition-colors leading-snug">
                      {vendor.businessName}
                    </h3>
                    <div className="text-xs text-[#8b7b6b] mt-0.5 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#f5ede2] text-[#bd9661] font-bold text-[10px] inline-flex items-center justify-center">
                        {(vendor.contactName || vendor.businessName).charAt(0)}
                      </span>
                      <span className="font-medium text-[#15110e]">{vendor.contactName || 'Primary Contact'}</span>
                    </div>
                  </div>

                  {/* Contact Methods */}
                  <div className="mt-4 space-y-2 text-xs bg-[#faf8f5] p-3 rounded-xl border border-[#f0ede4]">
                    {vendor.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#8b7b6b] flex items-center gap-1.5 text-[11px]">
                          <span>📞</span> Phone:
                        </span>
                        <a
                          href={`tel:${vendor.phone}`}
                          className="font-medium text-[#15110e] hover:text-[#bd9661] hover:underline"
                        >
                          {vendor.phone}
                        </a>
                      </div>
                    )}

                    {vendor.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#8b7b6b] flex items-center gap-1.5 text-[11px]">
                          <span>✉️</span> Email:
                        </span>
                        <a
                          href={`mailto:${vendor.email}`}
                          className="font-medium text-[#15110e] hover:text-[#bd9661] hover:underline truncate max-w-[170px]"
                          title={vendor.email}
                        >
                          {vendor.email}
                        </a>
                      </div>
                    )}

                    {vendor.website && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#8b7b6b] flex items-center gap-1.5 text-[11px]">
                          <span>🌐</span> Web:
                        </span>
                        <a
                          href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[#bd9661] hover:underline truncate max-w-[170px]"
                        >
                          {vendor.website.replace(/^https?:\/\//, '')} &nearr;
                        </a>
                      </div>
                    )}

                    {vendor.instagram && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#8b7b6b] flex items-center gap-1.5 text-[11px]">
                          <span>📸</span> Insta:
                        </span>
                        <span className="font-medium text-[#8b7b6b]">
                          {vendor.instagram}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Payment / Budget Progress */}
                  {hasCost && (
                    <div className="mt-3.5 space-y-1.5 bg-white p-2.5 rounded-xl border border-[#f0ede4]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider">Fee &amp; Payment</span>
                        <span className="font-bold text-[#15110e]">{formatAUD(vendor.cost || 0)}</span>
                      </div>
                      <div className="w-full bg-[#f0ede4] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#bd9661] h-full rounded-full transition-all"
                          style={{ width: `${paidPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10.5px] text-[#8b7b6b]">
                        <span>Paid: <strong className="text-[#3c6a42]">{formatAUD(vendor.paidAmount || 0)}</strong> ({paidPct}%)</span>
                        <span>Due: <strong className="text-[#b91c1c]">{formatAUD(Math.max(0, (vendor.cost || 0) - (vendor.paidAmount || 0)))}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Contract Notes / Deliverables */}
                  {vendor.notes && (
                    <div className="mt-3 text-xs bg-[#fdfbf8] p-2.5 rounded-xl border border-[#ebdcc9] text-[#6b5849] italic leading-relaxed">
                      "{vendor.notes}"
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-[#f0ede4] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {vendor.phone && (
                      <a
                        href={`tel:${vendor.phone}`}
                        className="text-[11px] font-bold bg-[#faf8f5] hover:bg-[#faf4ec] text-[#15110e] border border-[#e8ded0] px-2.5 py-1 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Call Vendor"
                      >
                        <span>📞</span> Call
                      </a>
                    )}
                    {vendor.email && (
                      <a
                        href={`mailto:${vendor.email}`}
                        className="text-[11px] font-bold bg-[#faf8f5] hover:bg-[#faf4ec] text-[#15110e] border border-[#e8ded0] px-2.5 py-1 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Send Email"
                      >
                        <span>✉️</span> Email
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(vendor)}
                      className="text-xs text-[#bd9661] hover:text-[#916c3d] p-1.5 rounded-lg hover:bg-[#faf8f5] font-bold cursor-pointer transition-colors"
                      title="Edit Vendor"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVendor(vendor)}
                      className="text-xs text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 font-bold cursor-pointer transition-colors"
                      title="Remove Vendor"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Vendor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#e8ded0] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#f0ede4]">
              <div>
                <div className="text-[10px] uppercase font-bold text-[#bd9661] tracking-wider">
                  {editingVendor ? 'EDIT EXISTING VENDOR' : 'NEW WEDDING SUPPLIER'}
                </div>
                <h3 className="font-serif text-xl font-bold text-[#15110e]">
                  {editingVendor ? editingVendor.businessName : 'Add Wedding Vendor'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-black font-bold text-xl cursor-pointer p-1"
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveVendor} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                    Category / Service *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] text-[#15110e]"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                    Booking Status *
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] text-[#15110e]"
                  >
                    <option value="Booked">Booked</option>
                    <option value="Deposit Paid">Deposit Paid</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Final Payment Due">Final Payment Due</option>
                    <option value="Paid in Full">Paid in Full</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                  Business / Studio Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Willow & Wolf Cinematography"
                  value={formBusinessName}
                  onChange={(e) => setFormBusinessName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] text-[#15110e]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                  Primary Contact Person
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins (Lead Shooter)"
                  value={formContactName}
                  onChange={(e) => setFormContactName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] text-[#15110e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0412 849 201"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] text-[#15110e]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. hello@vendor.com.au"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] text-[#15110e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                    Website or Portfolio URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://willowandwolf.com.au"
                    value={formWebsite}
                    onChange={(e) => setFormWebsite(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] text-[#15110e]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @willowandwolffilms"
                    value={formInstagram}
                    onChange={(e) => setFormInstagram(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] text-[#15110e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                    Total Quoted Fee ($ AUD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 4200"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] text-[#15110e]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                    Amount Paid ($ AUD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 2000"
                    value={formPaidAmount}
                    onChange={(e) => setFormPaidAmount(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] text-[#15110e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                  Deliverables, Contract Scope &amp; Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. 10 hours coverage, 2 shooters, drone aerial footage included, delivery within 4 weeks."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] text-[#15110e] leading-relaxed"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#f0ede4] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  {editingVendor ? 'Save Changes' : 'Add to Directory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDirectorySection;
