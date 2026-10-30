import React, { useState, useMemo } from 'react';
import { Wedding, WeddingVendor } from '../lib/types';
import { showToast, logAudit, useAppState } from '../lib/state';

interface VendorDirectorySectionProps {
  wedding: Wedding;
  onUpdateWeddingVendors?: (vendors: WeddingVendor[]) => void;
  readOnly?: boolean;
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
  readOnly = false,
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
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<WeddingVendor | null>(null);

  // Form State - only necessary fields
  const [formCategory, setFormCategory] = useState('Photography & Cinema');
  const [formBusinessName, setFormBusinessName] = useState('');
  const [formContactName, setFormContactName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formInstagram, setFormInstagram] = useState('');
  const [formNotes, setFormNotes] = useState('');

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

    return matchesSearch && matchesCategory;
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
    setFormNotes(vendor.notes || '');
    setShowModal(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBusinessName.trim()) {
      showToast('Please enter the vendor business name', 'error');
      return;
    }

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
        notes: formNotes.trim() || undefined,
      };
      updatedList = [newVendor, ...vendors];
      showToast(`Added "${formBusinessName}" to Vendor Directory`, 'success');
      logAudit(state, setState, 'Vendor Added', wedding.couple, 'couple', `Added new vendor: ${formBusinessName} (${formCategory})`, 'Content');
    }

    if (onUpdateWeddingVendors) onUpdateWeddingVendors(updatedList);
    setShowModal(false);
  };

  const handleDeleteVendor = (vendor: WeddingVendor) => {
    if (window.confirm(`Are you sure you want to remove "${vendor.businessName}" from your vendor directory?`)) {
      const updatedList = vendors.filter(v => v.id !== vendor.id);
      if (onUpdateWeddingVendors) onUpdateWeddingVendors(updatedList);
      showToast(`Removed "${vendor.businessName}" from Vendor Directory`, 'info');
      logAudit(state, setState, 'Vendor Deleted', wedding.couple, 'couple', `Removed vendor: ${vendor.businessName}`, 'Content');
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Photography & Cinema':
        return (
          <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        );
      case 'Florals & Styling':
        return (
          <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 0 1 5 5c0 3-5 9-5 9s-5-6-5-9a5 5 0 0 1 5-5z"/>
            <circle cx="12" cy="7" r="1.5"/>
          </svg>
        );
      case 'Catering & Bar':
        return (
          <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/>
            <path d="M15 11v11"/>
            <path d="M6 2v20"/>
            <path d="M6 6h4"/>
          </svg>
        );
      case 'Music & Entertainment':
        return (
          <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        );
      case 'Celebrant':
        return (
          <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'Hair & Makeup':
        return (
          <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3"/>
            <path d="M8.12 8.12 12 12"/>
            <path d="M20 4 8.5 15.5"/>
            <circle cx="18" cy="18" r="3"/>
            <path d="M14.8 14.8 12 12"/>
          </svg>
        );
      case 'Venue':
        return (
          <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18"/>
            <path d="M5 21V7l7-4 7 4v14"/>
            <path d="M9 10h6"/>
            <path d="M9 14h6"/>
          </svg>
        );
      case 'Cake Designer':
        return (
          <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/>
            <path d="M4 16s2-1 4-1 4 1 4 1 2-1 4-1 4 1 4 1"/>
            <path d="M2 21h20"/>
            <circle cx="12" cy="7" r="2"/>
          </svg>
        );
      case 'Attire & Styling':
        return (
          <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a2 2 0 0 1 2 2c0 .7-.4 1.3-1 1.7V8l8 5-2 9H5l-2-9 8-5V6.7c-.6-.4-1-1-1-1.7a2 2 0 0 1 2-2z"/>
          </svg>
        );
      case 'Transport':
        return (
          <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"/>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        );
      default:
        return (
          <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Description */}
      <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-1">
            {readOnly ? 'WEDDING CONCIERGE • VENDOR DIRECTORY' : 'COUPLE CONTENT • VENDOR DIRECTORY'}
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#15110e]">
            Wedding Vendor Directory
          </h2>
          <p className="text-xs text-[#8b7b6b] mt-1 max-w-2xl leading-relaxed">
            {readOnly
              ? 'View and reference all confirmed wedding vendor details, contact persons, phone numbers, and service deliverables.'
              : 'Maintain all your wedding vendor details, contact persons, phone numbers, and service deliverables in one central directory.'}
          </p>
        </div>

        {!readOnly && (
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span className="text-base font-bold">+</span>
            <span>Add New Vendor</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs space-y-3">
        {/* Search Box */}
        <div className="relative w-full max-w-lg">
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

        {/* Category Pills - Icon on left, text to the right on same line */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar items-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                  : 'bg-[#faf8f5] border border-[#f0ede4] text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#f5ede2]'
              }`}
            >
              {cat !== 'All' && <span className="shrink-0 flex items-center">{getCategoryIcon(cat)}</span>}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Directory Tabular View */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white border border-[#e8ded0] rounded-2xl p-12 text-center shadow-xs space-y-3">
          <div className="text-4xl">💐</div>
          <h3 className="font-serif text-lg font-bold text-[#15110e]">No wedding vendors found</h3>
          <p className="text-xs text-[#8b7b6b] max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search query or category filter above.'
              : 'Start adding your wedding suppliers, contacts, and contracted deliverables.'}
          </p>
          {!readOnly && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-2 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              + Add First Vendor
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-[#e8ded0] rounded-2xl shadow-xs overflow-hidden">
          {/* Table Header Bar */}
          <div className="px-5 py-3.5 bg-[#fbf9f6] border-b border-[#ebdcc9] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-xs"></span>
              <span className="font-semibold text-[#15110e] text-xs">
                {filteredVendors.length} {filteredVendors.length === 1 ? 'Vendor' : 'Vendors Registered'}
              </span>
              {selectedCategory !== 'All' && (
                <span className="bg-[#f0e7db] text-[#735e4b] px-2 py-0.5 rounded-md text-[11px] font-medium border border-[#dfd2c0]">
                  {selectedCategory}
                </span>
              )}
              {searchQuery && (
                <span className="bg-[#f0e7db] text-[#735e4b] px-2 py-0.5 rounded-md text-[11px] font-medium border border-[#dfd2c0]">
                  &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#8b7b6b]">{readOnly ? 'Concierge Vendor Directory' : 'Private Vendor Directory'}</span>
          </div>

          {/* Responsive Professional Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[880px]">
              <thead>
                <tr className="bg-[#f5f1ea] border-b border-[#dfd2c0] text-[11px] font-bold uppercase tracking-wider text-[#6e5d50]">
                  <th className="py-3 px-3.5 w-[160px] font-semibold">Category</th>
                  <th className="py-3 px-3.5 w-[190px] font-semibold">Vendor / Business</th>
                  <th className="py-3 px-3.5 w-[140px] font-semibold">Contact Person</th>
                  <th className="py-3 px-3.5 w-[170px] font-semibold">Phone &amp; Email</th>
                  <th className="py-3 px-3.5 w-[145px] font-semibold">Web &amp; Social</th>
                  <th className="py-3 px-3.5 font-semibold">Deliverables &amp; Notes</th>
                  {!readOnly && (
                    <th className="py-3 px-3.5 w-[90px] font-semibold text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebdcc9] text-xs bg-white">
                {filteredVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-[#faf7f2] transition-colors group"
                  >
                    {/* Category */}
                    <td className="py-3.5 px-3.5 align-middle">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#15110e] bg-[#f7f2ea] border border-[#dfd2c0] px-2.5 py-1 rounded-md whitespace-nowrap shadow-2xs">
                        {getCategoryIcon(vendor.category)}
                        <span>{vendor.category}</span>
                      </span>
                    </td>

                    {/* Business Name */}
                    <td className="py-3.5 px-3.5 align-middle">
                      <div className="font-semibold text-xs text-[#15110e] leading-snug">
                        {vendor.businessName}
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-3.5 px-3.5 align-middle">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#15110e] text-[#dfc194] font-bold text-[10px] inline-flex items-center justify-center shrink-0 border border-[#bd9661]/40 shadow-2xs">
                          {vendor.contactName ? vendor.contactName.charAt(0) : '—'}
                        </span>
                        <span className="text-xs text-[#15110e] font-medium whitespace-nowrap">
                          {vendor.contactName || '—'}
                        </span>
                      </div>
                    </td>

                    {/* Phone & Email with Golden Theme Micro-Icons */}
                    <td className="py-3.5 px-3.5 align-middle">
                      <div className="space-y-1">
                        {vendor.phone ? (
                          <a
                            href={`tel:${vendor.phone}`}
                            className="flex items-center gap-1.5 text-[#15110e] hover:text-[#bd9661] font-medium whitespace-nowrap transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            <span>{vendor.phone}</span>
                          </a>
                        ) : null}
                        {vendor.email ? (
                          <a
                            href={`mailto:${vendor.email}`}
                            className="flex items-center gap-1.5 text-[#736355] hover:text-[#15110e] hover:underline text-[11px] truncate max-w-[170px] transition-colors"
                            title={vendor.email}
                          >
                            <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                              <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <span className="truncate">{vendor.email}</span>
                          </a>
                        ) : null}
                        {!vendor.phone && !vendor.email && (
                          <span className="text-[#a89b8d] italic text-[11px]">—</span>
                        )}
                      </div>
                    </td>

                    {/* Web & Social with Golden Theme Micro-Icons */}
                    <td className="py-3.5 px-3.5 align-middle">
                      <div className="space-y-1">
                        {vendor.website ? (
                          <a
                            href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[#bd9661] hover:text-[#8a6839] font-medium text-[11px] truncate max-w-[150px] transition-colors"
                            title={vendor.website}
                          >
                            <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="2" y1="12" x2="22" y2="12"/>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                            <span className="truncate">{vendor.website.replace(/^https?:\/\//, '')}</span>
                            <span className="text-[10px]">↗</span>
                          </a>
                        ) : null}
                        {vendor.instagram ? (
                          <div className="text-[11px] text-[#736355] flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                            <span>{vendor.instagram}</span>
                          </div>
                        ) : null}
                        {!vendor.website && !vendor.instagram && (
                          <span className="text-[#a89b8d] italic text-[11px]">—</span>
                        )}
                      </div>
                    </td>

                    {/* Deliverables & Notes */}
                    <td className="py-3.5 px-3.5 align-middle">
                      <p className="text-xs text-[#4d4036] leading-relaxed line-clamp-3">
                        {vendor.notes || <span className="text-[#a89b8d] italic text-[11px]">No deliverables noted</span>}
                      </p>
                    </td>

                    {/* Actions: Clean Pencil & Bin icons (hidden when readOnly) */}
                    {!readOnly && (
                      <td className="py-3.5 px-3.5 align-middle text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(vendor)}
                            className="w-7 h-7 rounded-lg text-[#15110e] hover:text-[#bd9661] hover:bg-[#faf6f0] border border-[#dfd2c0] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                            title="Edit Vendor"
                            aria-label="Edit Vendor"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"/>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVendor(vendor)}
                            className="w-7 h-7 rounded-lg text-[#8b7b6b] hover:text-rose-600 hover:bg-rose-50 border border-[#dfd2c0] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                            title="Remove Vendor"
                            aria-label="Remove Vendor"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-5 py-3 bg-[#faf8f5] border-t border-[#e8ded0] flex items-center justify-between text-[11px] text-[#8b7b6b]">
            <span>Showing {filteredVendors.length} of {vendors.length} total vendors</span>
            <span>All vendor contacts are private to the couple &amp; planning team</span>
          </div>
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

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                  Deliverables, Scope &amp; Notes
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
