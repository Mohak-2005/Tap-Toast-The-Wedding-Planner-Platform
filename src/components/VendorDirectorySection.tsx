import React, { useState, useMemo, useRef } from 'react';
import { Wedding, WeddingVendor, VendorDocument } from '../lib/types';
import { showToast, logAudit, useAppState } from '../lib/state';

interface VendorDirectorySectionProps {
  wedding: Wedding;
  onUpdateWeddingVendors?: (vendors: WeddingVendor[]) => void;
  onUpdateWedding?: (updatedWedding: Wedding) => void;
  readOnly?: boolean;
  initialSubView?: 'directory' | 'documents';
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
  onUpdateWedding,
  readOnly = false,
  initialSubView = 'directory',
}) => {
  const { state, setState } = useAppState();

  // Sub-view Switcher: 'directory' | 'documents'
  const [activeSubView, setActiveSubView] = useState<'directory' | 'documents'>(initialSubView);

  // Supplier Directory State
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

  // =========================================================================
  // VENDOR DOCUMENTS & COMPLIANCE VAULT STATE
  // =========================================================================
  const DEFAULT_DOCS: VendorDocument[] = useMemo(() => [
    {
      id: 'doc_1',
      weddingId: wedding.id,
      vendorName: 'Willow & Wolf Cinematography',
      vendorCategory: 'Photography & Cinema',
      docType: 'insurance',
      title: 'Public Liability Certificate of Currency ($20M)',
      fileName: 'Willow_Wolf_Public_Liability_2026.pdf',
      fileSize: '1.4 MB',
      uploadedAt: '12 Oct 2026',
      policyNumber: 'PL-AU-883910-X',
      expiryDate: '2027-04-30',
      notes: 'QBE Insurance Australia. Covers drone aerial photography and dual cinematographers on site.',
      status: 'active',
    },
    {
      id: 'doc_2',
      weddingId: wedding.id,
      vendorName: 'Fleur & Botanica Studio',
      vendorCategory: 'Florals & Styling',
      docType: 'insurance',
      title: 'Certificate of Currency - Public & Products Liability',
      fileName: 'Fleur_Botanica_Insurance_Cert.pdf',
      fileSize: '840 KB',
      uploadedAt: '18 Oct 2026',
      policyNumber: 'QBE-PL-99210-F',
      expiryDate: '2027-02-15',
      notes: 'Includes tall arch rigging and candle open-flame waiver for the Heritage Pavilion.',
      status: 'active',
    },
    {
      id: 'doc_3',
      weddingId: wedding.id,
      vendorName: 'Fernwood Estate Culinary & Cellar',
      vendorCategory: 'Catering & Bar',
      docType: 'permit',
      title: 'NSW Food Authority & Liquor License Permit',
      fileName: 'Fernwood_Liquor_FoodSafety_Permit.pdf',
      fileSize: '2.1 MB',
      uploadedAt: '05 Sep 2026',
      policyNumber: 'LIQP-NSW-2026-44',
      expiryDate: '2028-12-31',
      notes: 'Commercial kitchen hygiene certificate and responsible service of alcohol accreditation.',
      status: 'active',
    },
    {
      id: 'doc_4',
      weddingId: wedding.id,
      vendorName: 'Groove & Brass Collective',
      vendorCategory: 'Music & Entertainment',
      docType: 'contract',
      title: 'Signed Performance Agreement & Acoustic Rider',
      fileName: 'Groove_Brass_Performance_Contract.pdf',
      fileSize: '620 KB',
      uploadedAt: '22 Oct 2026',
      policyNumber: 'GBC-AGR-2026',
      expiryDate: '2026-11-15',
      notes: 'Outlines set timings, sound curfew at 11:30 PM, stage power requirements, and meal rider.',
      status: 'active',
    },
    {
      id: 'doc_5',
      weddingId: wedding.id,
      vendorName: 'Clara Davis Ceremonies',
      vendorCategory: 'Celebrant',
      docType: 'permit',
      title: 'Commonwealth Registered Marriage Celebrant Certificate',
      fileName: 'Clara_Davis_Celebrant_Registration.pdf',
      fileSize: '410 KB',
      uploadedAt: '01 Nov 2026',
      policyNumber: 'A14982',
      notes: 'Authorised civil marriage celebrant under the Marriage Act 1961.',
      status: 'active',
    }
  ], [wedding.id]);

  const allDocs: VendorDocument[] = useMemo(() => {
    if (wedding.vendorDocuments && wedding.vendorDocuments.length > 0) {
      return wedding.vendorDocuments;
    }
    return DEFAULT_DOCS;
  }, [wedding.vendorDocuments, DEFAULT_DOCS]);

  const [showDocModal, setShowDocModal] = useState<boolean>(false);
  const [editingDoc, setEditingDoc] = useState<VendorDocument | null>(null);
  const [viewingDoc, setViewingDoc] = useState<VendorDocument | null>(null);
  const [docSearchQuery, setDocSearchQuery] = useState<string>('');
  const [docCategoryFilter, setDocCategoryFilter] = useState<string>('all');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('all');

  // Form State for Vendor Documents
  const [docFormVendorName, setDocFormVendorName] = useState('');
  const [docFormCategory, setDocFormCategory] = useState('Florals & Styling');
  const [docFormDocType, setDocFormDocType] = useState<'insurance' | 'contract' | 'permit' | 'invoice' | 'other'>('insurance');
  const [docFormTitle, setDocFormTitle] = useState('');
  const [docFormPolicyNumber, setDocFormPolicyNumber] = useState('');
  const [docFormExpiryDate, setDocFormExpiryDate] = useState('');
  const [docFormNotes, setDocFormNotes] = useState('');
  const [docFormFileName, setDocFormFileName] = useState('');
  const [docFormFileSize, setDocFormFileSize] = useState('');
  const [docFormDataUrl, setDocFormDataUrl] = useState<string>('');
  const docFileInputRef = useRef<HTMLInputElement | null>(null);

  const resetDocForm = () => {
    setDocFormVendorName('');
    setDocFormCategory('Florals & Styling');
    setDocFormDocType('insurance');
    setDocFormTitle('');
    setDocFormPolicyNumber('');
    setDocFormExpiryDate('');
    setDocFormNotes('');
    setDocFormFileName('');
    setDocFormFileSize('');
    setDocFormDataUrl('');
    setEditingDoc(null);
  };

  const handleOpenAddDocModal = (prefillVendorName?: string, prefillCategory?: string) => {
    resetDocForm();
    if (prefillVendorName) setDocFormVendorName(prefillVendorName);
    if (prefillCategory) setDocFormCategory(prefillCategory);
    setShowDocModal(true);
  };

  const handleOpenEditDocModal = (doc: VendorDocument) => {
    setEditingDoc(doc);
    setDocFormVendorName(doc.vendorName || '');
    setDocFormCategory(doc.vendorCategory || 'Florals & Styling');
    setDocFormDocType(doc.docType || 'insurance');
    setDocFormTitle(doc.title || '');
    setDocFormPolicyNumber(doc.policyNumber || '');
    setDocFormExpiryDate(doc.expiryDate || '');
    setDocFormNotes(doc.notes || '');
    setDocFormFileName(doc.fileName || '');
    setDocFormFileSize(doc.fileSize || '');
    setDocFormDataUrl(doc.fileDataUrl || '');
    setShowDocModal(true);
  };

  const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocFormFileName(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setDocFormFileSize(sizeMb === '0.0' ? `${Math.round(file.size / 1024) || 1} KB` : `${sizeMb} MB`);
    if (!docFormTitle.trim()) {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setDocFormTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setDocFormDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFormVendorName.trim() || !docFormTitle.trim()) {
      showToast('Please enter both vendor name and document title', 'error');
      return;
    }

    const currentDocs = wedding.vendorDocuments || [];
    const dateFormatted = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });

    let updatedDocs: VendorDocument[];
    if (editingDoc) {
      updatedDocs = currentDocs.map(d => {
        if (d.id === editingDoc.id) {
          return {
            ...d,
            vendorName: docFormVendorName.trim(),
            vendorCategory: docFormCategory,
            docType: docFormDocType,
            title: docFormTitle.trim(),
            policyNumber: docFormPolicyNumber.trim() || undefined,
            expiryDate: docFormExpiryDate || undefined,
            notes: docFormNotes.trim() || undefined,
            fileName: docFormFileName || d.fileName,
            fileSize: docFormFileSize || d.fileSize,
            fileDataUrl: docFormDataUrl || d.fileDataUrl,
          };
        }
        return d;
      });
      showToast(`Updated document "${docFormTitle.trim()}"`, 'success');
    } else {
      const newDoc: VendorDocument = {
        id: 'vdoc_' + Date.now(),
        weddingId: wedding.id,
        vendorName: docFormVendorName.trim(),
        vendorCategory: docFormCategory,
        docType: docFormDocType,
        title: docFormTitle.trim(),
        fileName: docFormFileName || `${docFormVendorName.replace(/[^a-zA-Z0-9]/g, '_')}_Document.pdf`,
        fileSize: docFormFileSize || '1.2 MB',
        uploadedAt: dateFormatted,
        policyNumber: docFormPolicyNumber.trim() || undefined,
        expiryDate: docFormExpiryDate || undefined,
        notes: docFormNotes.trim() || undefined,
        fileDataUrl: docFormDataUrl || undefined,
        status: 'active',
      };
      updatedDocs = [newDoc, ...currentDocs];
      showToast(`Uploaded "${docFormTitle.trim()}" for ${docFormVendorName.trim()}`, 'success');
      logAudit(
        state,
        setState,
        'Vendor Document Uploaded',
        wedding.couple,
        'couple',
        `Uploaded ${docFormDocType} for ${docFormVendorName.trim()}: "${docFormTitle.trim()}"`,
        'Vendor Documents'
      );
    }

    if (onUpdateWedding) {
      onUpdateWedding({ ...wedding, vendorDocuments: updatedDocs });
    } else {
      const updatedWeddings = (state.weddings || []).map(w => w.id === wedding.id ? { ...w, vendorDocuments: updatedDocs } : w);
      setState({ ...state, weddings: updatedWeddings });
    }
    setShowDocModal(false);
    resetDocForm();
  };

  const handleDeleteDoc = (docId: string, docTitle: string) => {
    if (!window.confirm(`Are you sure you want to remove "${docTitle}" from your vendor documents vault?`)) {
      return;
    }
    const currentDocs = wedding.vendorDocuments || [];
    const updatedDocs = currentDocs.filter(d => d.id !== docId);
    if (onUpdateWedding) {
      onUpdateWedding({ ...wedding, vendorDocuments: updatedDocs });
    } else {
      const updatedWeddings = (state.weddings || []).map(w => w.id === wedding.id ? { ...w, vendorDocuments: updatedDocs } : w);
      setState({ ...state, weddings: updatedWeddings });
    }
    showToast(`Removed "${docTitle}"`, 'info');
  };

  const handleDownloadDoc = (doc: VendorDocument) => {
    const content = `TAP & TOAST • VENDOR DOCUMENT RECORD\n\nWedding: ${wedding.couple}\nDate: ${wedding.dateDisplay || wedding.date}\nVenue: ${wedding.venue}\n\nVendor Name: ${doc.vendorName}\nCategory: ${doc.vendorCategory}\nDocument Type: ${doc.docType.toUpperCase()}\nDocument Title: ${doc.title}\nFile: ${doc.fileName} (${doc.fileSize || 'On File'})\nPolicy / Reference Number: ${doc.policyNumber || 'N/A'}\nExpiry Date: ${doc.expiryDate || 'N/A'}\nUploaded Date: ${doc.uploadedAt}\nNotes: ${doc.notes || 'None'}\n\nStatus: Verified and Stored in Couple Compliance Vault\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName || `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded "${doc.fileName || doc.title}"`, 'success');
  };

  // Filtered documents calculation
  const filteredDocs = allDocs.filter((doc) => {
    if (docSearchQuery.trim()) {
      const q = docSearchQuery.toLowerCase();
      const matchesTitle = doc.title.toLowerCase().includes(q);
      const matchesVendor = doc.vendorName.toLowerCase().includes(q);
      const matchesPolicy = (doc.policyNumber || '').toLowerCase().includes(q);
      const matchesNotes = (doc.notes || '').toLowerCase().includes(q);
      if (!matchesTitle && !matchesVendor && !matchesPolicy && !matchesNotes) return false;
    }
    if (docCategoryFilter !== 'all' && doc.vendorCategory !== docCategoryFilter) {
      return false;
    }
    if (docTypeFilter !== 'all' && doc.docType !== docTypeFilter) {
      return false;
    }
    return true;
  });

  const insuranceCount = allDocs.filter((d) => d.docType === 'insurance').length;
  const permitCount = allDocs.filter((d) => d.docType === 'permit').length;
  const contractCount = allDocs.filter((d) => d.docType === 'contract').length;
  const uniqueVendorsCount = new Set(allDocs.map((d) => d.vendorName.toLowerCase())).size;

  const getDocTypeBadge = (docType: string) => {
    switch (docType) {
      case 'insurance':
        return { label: 'Insurance (PLI)', bg: 'bg-[#faf4ec] text-[#936932] border-[#ebd3a8]' };
      case 'contract':
        return { label: 'Contract', bg: 'bg-[#f4effa] text-[#713f96] border-[#d8c2ea]' };
      case 'permit':
        return { label: 'Permit & License', bg: 'bg-[#eef8f2] text-emerald-800 border-[#b7e3c6]' };
      case 'invoice':
        return { label: 'Invoice / Receipt', bg: 'bg-[#f0f4f8] text-[#2c5282] border-[#bee3f8]' };
      default:
        return { label: 'Document', bg: 'bg-[#f5f5f5] text-[#555] border-[#e0e0e0]' };
    }
  };

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
            {readOnly
              ? 'WEDDING CONCIERGE • VENDOR DIRECTORY'
              : activeSubView === 'directory'
              ? 'COUPLE CONTENT • VENDOR DIRECTORY'
              : 'COUPLE COMPLIANCE • VENDOR DOCUMENTS'}
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#15110e]">
            {activeSubView === 'directory' ? 'Wedding Vendor Directory' : 'Vendor Documents & Compliance Vault'}
          </h2>
          <p className="text-xs text-[#8b7b6b] mt-1 max-w-2xl leading-relaxed">
            {activeSubView === 'directory'
              ? (readOnly
                  ? 'View and reference all confirmed wedding vendor details, contact persons, phone numbers, and service deliverables.'
                  : 'Maintain all your wedding vendor details, contact persons, phone numbers, and service deliverables in one central directory.')
              : 'Store and organize vendor insurance certificates (Public Liability Insurance), signed contracts, council/venue permits, and invoices in one secure vault.'}
          </p>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            {activeSubView === 'directory' ? (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span className="text-base font-bold">+</span>
                <span>Add New Vendor</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenAddDocModal()}
                className="bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span className="text-base font-bold">+</span>
                <span>Upload Vendor Document</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sub-view Navigation Switcher Pills */}
      <div className="flex items-center gap-2 border-b border-[#e8ded0] pb-2">
        <button
          type="button"
          onClick={() => setActiveSubView('directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubView === 'directory'
              ? 'bg-[#15110e] text-[#faf8f5] shadow-xs'
              : 'bg-white text-[#736355] border border-[#e8ded0] hover:bg-[#faf8f5]'
          }`}
        >
          <span>📋</span>
          <span>Supplier Directory</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubView('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubView === 'documents'
              ? 'bg-[#15110e] text-[#faf8f5] shadow-xs'
              : 'bg-white text-[#736355] border border-[#e8ded0] hover:bg-[#faf8f5]'
          }`}
        >
          <span>📄</span>
          <span>Vendor Documents &amp; Vault</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* 1. SUPPLIER DIRECTORY SUB-VIEW                                     */}
      {/* =================================================================== */}
      {activeSubView === 'directory' && (
        <div className="space-y-6">
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
                  <span className="font-bold text-[#15110e]">Vendor Directory</span>
                </div>
                <div className="text-[11px] text-[#8b7b6b]">
                  {selectedCategory !== 'All' && `Category: ${selectedCategory}`}
                </div>
              </div>

              {/* Table Element */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#faf8f5] border-b border-[#ebdcc9] text-[#736355] text-[10.5px] uppercase tracking-wider font-bold">
                      <th className="py-3 px-3.5 whitespace-nowrap w-[150px]">Category</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[170px]">Business Name &amp; Docs</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[140px]">Contact Person</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[170px]">Phone &amp; Email</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[160px]">Website &amp; Social</th>
                      <th className="py-3 px-3.5 min-w-[200px]">Deliverables &amp; Notes</th>
                      {!readOnly && (
                        <th className="py-3 px-3.5 whitespace-nowrap text-center w-[80px]">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2ede4]">
                    {filteredVendors.map((vendor) => {
                      const vendorDocs = allDocs.filter(
                        (d) =>
                          d.vendorName.toLowerCase() === vendor.businessName.toLowerCase() ||
                          d.vendorName.toLowerCase().includes(vendor.businessName.toLowerCase()) ||
                          vendor.businessName.toLowerCase().includes(d.vendorName.toLowerCase())
                      );

                      return (
                        <tr
                          key={vendor.id}
                          className="hover:bg-[#faf6f0]/70 transition-colors group"
                        >
                          {/* Category */}
                          <td className="py-3.5 px-3.5 align-middle">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#15110e] bg-[#f7f2ea] border border-[#dfd2c0] px-2.5 py-1 rounded-md whitespace-nowrap shadow-2xs">
                              {getCategoryIcon(vendor.category)}
                              <span>{vendor.category}</span>
                            </span>
                          </td>

                          {/* Business Name & Docs */}
                          <td className="py-3.5 px-3.5 align-middle">
                            <div className="font-semibold text-xs text-[#15110e] leading-snug">
                              {vendor.businessName}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {vendorDocs.length > 0 ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDocSearchQuery(vendor.businessName);
                                    setActiveSubView('documents');
                                  }}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded hover:bg-emerald-100 cursor-pointer transition-colors"
                                  title={`View ${vendorDocs.length} document(s) on file for ${vendor.businessName}`}
                                >
                                  <span>✓ {vendorDocs.length} doc{vendorDocs.length > 1 ? 's' : ''} on file</span>
                                </button>
                              ) : (
                                !readOnly && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAddDocModal(vendor.businessName, vendor.category)}
                                    className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8b7b6b] hover:text-[#bd9661] bg-[#faf8f5] hover:bg-[#f5ede2] border border-[#e8ded0] px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                    title={`Upload insurance or document for ${vendor.businessName}`}
                                  >
                                    <span>+ Add Doc</span>
                                  </button>
                                )
                              )}
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
                      );
                    })}
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
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. VENDOR DOCUMENTS & COMPLIANCE VAULT SUB-VIEW                     */}
      {/* =================================================================== */}
      {activeSubView === 'documents' && (
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs">
              <div className="text-[10.5px] uppercase font-bold text-[#8b7b6b] tracking-wider mb-1">
                Total Documents
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#15110e]">
                {allDocs.length}
              </div>
              <div className="text-[11px] text-[#8b7b6b] mt-0.5">On file in secure vault</div>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs">
              <div className="text-[10.5px] uppercase font-bold text-[#8b7b6b] tracking-wider mb-1">
                Insurance Policies
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#bd9661]">
                {insuranceCount}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Public liability verified</div>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs">
              <div className="text-[10.5px] uppercase font-bold text-[#8b7b6b] tracking-wider mb-1">
                Suppliers Covered
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#15110e]">
                {uniqueVendorsCount}
              </div>
              <div className="text-[11px] text-[#8b7b6b] mt-0.5">Photographers, Florists &amp; Crew</div>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs">
              <div className="text-[10.5px] uppercase font-bold text-[#8b7b6b] tracking-wider mb-1">
                Contracts &amp; Permits
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#15110e]">
                {contractCount + permitCount}
              </div>
              <div className="text-[11px] text-[#8b7b6b] mt-0.5">Signed agreements &amp; hygiene</div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-[280px]">
              {/* Search Input */}
              <div className="relative flex-1 min-w-[180px] max-w-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7b6b] pointer-events-none">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search documents, suppliers, policy #..."
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl pl-8 pr-7 py-2 text-xs text-[#15110e] placeholder-[#a09080] focus:outline-none focus:border-[#bd9661]"
                />
                {docSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setDocSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8b7b6b] hover:text-[#15110e] cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <select
                value={docCategoryFilter}
                onChange={(e) => setDocCategoryFilter(e.target.value)}
                className="bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] text-[#15110e] text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option value="all">All Vendor Categories</option>
                <option value="Photography & Cinema">Photography &amp; Cinema</option>
                <option value="Florals & Styling">Florals &amp; Styling</option>
                <option value="Catering & Bar">Catering &amp; Bar</option>
                <option value="Music & Entertainment">Music &amp; Entertainment</option>
                <option value="Transport & Shuttles">Transport &amp; Shuttles</option>
                <option value="Hire & Styling">Hire &amp; Styling</option>
                <option value="Celebrant">Celebrant</option>
                <option value="Venue Management">Venue Management</option>
                <option value="Other">Other Vendors</option>
              </select>

              {/* Doc Type Filter */}
              <select
                value={docTypeFilter}
                onChange={(e) => setDocTypeFilter(e.target.value)}
                className="bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] text-[#15110e] text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option value="all">All Document Types</option>
                <option value="insurance">Insurance Certificates</option>
                <option value="contract">Signed Contracts</option>
                <option value="permit">Permits &amp; Accreditations</option>
                <option value="invoice">Invoices &amp; Receipts</option>
                <option value="other">Other Documents</option>
              </select>
            </div>

            <div className="text-xs text-[#8b7b6b] font-medium">
              Showing <strong className="text-[#15110e]">{filteredDocs.length}</strong> of {allDocs.length} documents
            </div>
          </div>

          {/* Documents Tabular View with columns: Doc Name, Vendor Name, Vendor Category, Doc Type, View (Eye Icon) */}
          {filteredDocs.length === 0 ? (
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-10 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#faf4ec] text-[#bd9661] flex items-center justify-center mx-auto text-xl">
                📁
              </div>
              <h3 className="font-serif text-lg font-bold text-[#15110e]">No documents found</h3>
              <p className="text-xs text-[#8b7b6b] max-w-md mx-auto">
                {allDocs.length === 0
                  ? 'Upload supplier certificates, insurance policies, or contracts collected directly from your wedding vendors.'
                  : 'No documents match your active search or category filters.'}
              </p>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleOpenAddDocModal()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  + Upload First Document
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white border border-[#e8ded0] rounded-2xl shadow-xs overflow-hidden">
              {/* Table Header Bar */}
              <div className="px-5 py-3.5 bg-[#fbf9f6] border-b border-[#ebdcc9] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-[#15110e]">Compliance &amp; Vendor Documents</span>
                </div>
                <div className="text-[11px] text-[#8b7b6b]">
                  {docTypeFilter !== 'all' && `Filtered by: ${docTypeFilter}`}
                </div>
              </div>

              {/* Table Element */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#faf8f5] border-b border-[#ebdcc9] text-[#736355] text-[10.5px] uppercase tracking-wider font-bold">
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[200px]">Doc Name</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[170px]">Vendor Name</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[150px]">Vendor Category</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[130px]">Doc Type</th>
                      <th className="py-3 px-3.5 whitespace-nowrap text-center w-[90px]">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2ede4]">
                    {filteredDocs.map((doc) => {
                      const badge = getDocTypeBadge(doc.docType);
                      return (
                        <tr
                          key={doc.id}
                          className="hover:bg-[#faf6f0]/70 transition-colors group"
                        >
                          {/* 1. Doc Name: Keep only bold written name, remove below name */}
                          <td className="py-3.5 px-3.5 align-middle">
                            <div className="font-semibold text-xs text-[#15110e] leading-snug">
                              {doc.title}
                            </div>
                          </td>

                          {/* 2. Vendor Name */}
                          <td className="py-3.5 px-3.5 align-middle">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#15110e] text-[#dfc194] font-bold text-[10px] inline-flex items-center justify-center shrink-0 border border-[#bd9661]/40 shadow-2xs">
                                {doc.vendorName ? doc.vendorName.charAt(0) : '—'}
                              </span>
                              <span className="text-xs text-[#15110e] font-medium">
                                {doc.vendorName}
                              </span>
                            </div>
                          </td>

                          {/* 3. Vendor Category */}
                          <td className="py-3.5 px-3.5 align-middle">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#15110e] bg-[#f7f2ea] border border-[#dfd2c0] px-2.5 py-1 rounded-md whitespace-nowrap shadow-2xs">
                              {getCategoryIcon(doc.vendorCategory)}
                              <span>{doc.vendorCategory}</span>
                            </span>
                          </td>

                          {/* 4. Doc Type */}
                          <td className="py-3.5 px-3.5 align-middle">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider border whitespace-nowrap ${badge.bg}`}>
                              {badge.label}
                            </span>
                          </td>

                          {/* 5. View (Eye Icon) */}
                          <td className="py-3.5 px-3.5 align-middle text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Eye icon to open and view the actual uploaded document */}
                              <button
                                type="button"
                                onClick={() => setViewingDoc(doc)}
                                className="w-8 h-8 rounded-lg bg-[#faf8f5] hover:bg-[#15110e] text-[#15110e] hover:text-[#dfc194] border border-[#dfd2c0] flex items-center justify-center transition-all cursor-pointer shadow-2xs group/eye"
                                title="View actual uploaded document"
                                aria-label="View document"
                              >
                                <svg className="w-4 h-4 transition-transform group-hover/eye:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </button>

                              {/* Download File */}
                              <button
                                type="button"
                                onClick={() => handleDownloadDoc(doc)}
                                className="w-7 h-7 rounded-lg text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#faf6f0] border border-[#dfd2c0] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                title="Download Document Record"
                                aria-label="Download Document Record"
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                              </button>

                              {!readOnly && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditDocModal(doc)}
                                    className="w-7 h-7 rounded-lg text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#faf6f0] border border-[#dfd2c0] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                    title="Edit Document Info"
                                    aria-label="Edit Document Info"
                                  >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 20h9"/>
                                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDoc(doc.id, doc.title)}
                                    className="w-7 h-7 rounded-lg text-[#8b7b6b] hover:text-rose-600 hover:bg-rose-50 border border-[#dfd2c0] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                    title="Remove Document"
                                    aria-label="Remove Document"
                                  >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6"/>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-5 py-3 bg-[#faf8f5] border-t border-[#e8ded0] flex items-center justify-between text-[11px] text-[#8b7b6b]">
                <span>Showing {filteredDocs.length} of {allDocs.length} total documents</span>
                <span>All documents are securely archived in the wedding compliance vault</span>
              </div>
            </div>
          )}        </div>
      )}

      {/* =================================================================== */}
      {/* 3. MODALS                                                          */}
      {/* =================================================================== */}
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

      {/* Upload / Edit Vendor Document Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full my-auto shadow-2xl border border-[#ebd3a8] overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-[#e8ded0] bg-[#faf8f5] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                  COMPLIANCE VAULT
                </div>
                <h3 className="font-serif text-xl font-bold text-[#15110e]">
                  {editingDoc ? 'Edit Vendor Document' : 'Upload Vendor Document'}
                </h3>
                <p className="text-xs text-[#8b7b6b] mt-0.5">
                  Store insurance certificates and compliance files collected directly from your suppliers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDocModal(false);
                  resetDocForm();
                }}
                className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="p-5 space-y-4 text-xs">
              {/* Vendor Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#4a3b2c] mb-1">
                    Vendor / Supplier Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Willow & Wolf Cinematography"
                    value={docFormVendorName}
                    onChange={(e) => setDocFormVendorName(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs text-[#15110e] focus:outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#4a3b2c] mb-1">
                    Vendor Category *
                  </label>
                  <select
                    value={docFormCategory}
                    onChange={(e) => setDocFormCategory(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs text-[#15110e] focus:outline-none focus:border-[#bd9661]"
                  >
                    <option value="Photography & Cinema">Photography &amp; Cinema</option>
                    <option value="Florals & Styling">Florals &amp; Styling</option>
                    <option value="Catering & Bar">Catering &amp; Bar</option>
                    <option value="Music & Entertainment">Music &amp; Entertainment</option>
                    <option value="Transport & Shuttles">Transport &amp; Shuttles</option>
                    <option value="Hire & Styling">Hire &amp; Styling</option>
                    <option value="Celebrant">Celebrant</option>
                    <option value="Venue Management">Venue Management</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Document Type & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#4a3b2c] mb-1">
                    Document Type *
                  </label>
                  <select
                    value={docFormDocType}
                    onChange={(e) => setDocFormDocType(e.target.value as any)}
                    className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs text-[#15110e] focus:outline-none focus:border-[#bd9661]"
                  >
                    <option value="insurance">Insurance Certificate of Currency (PLI)</option>
                    <option value="contract">Signed Supplier Contract</option>
                    <option value="permit">Permit / Health &amp; Safety License</option>
                    <option value="invoice">Invoice / Booking Receipt</option>
                    <option value="other">Other Wedding Document</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#4a3b2c] mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Public Liability Insurance ($20M)"
                    value={docFormTitle}
                    onChange={(e) => setDocFormTitle(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs text-[#15110e] focus:outline-none focus:border-[#bd9661]"
                  />
                </div>
              </div>

              {/* Policy Number & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#4a3b2c] mb-1">
                    Policy / Reference Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PL-AU-883910-X (optional)"
                    value={docFormPolicyNumber}
                    onChange={(e) => setDocFormPolicyNumber(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs text-[#15110e] focus:outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#4a3b2c] mb-1">
                    Expiry / Renewal Date
                  </label>
                  <input
                    type="date"
                    value={docFormExpiryDate}
                    onChange={(e) => setDocFormExpiryDate(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs text-[#15110e] focus:outline-none focus:border-[#bd9661]"
                  />
                </div>
              </div>

              {/* File Upload Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#4a3b2c] mb-1">
                  Document File (.pdf, .png, .jpg, .docx, .xlsx)
                </label>
                <input
                  type="file"
                  ref={docFileInputRef}
                  onChange={handleDocFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.csv"
                />
                <div
                  onClick={() => docFileInputRef.current?.click()}
                  className="p-4 border-2 border-dashed border-[#d5c7b5] hover:border-[#bd9661] bg-[#faf8f5] rounded-xl text-center cursor-pointer transition-colors"
                >
                  {docFormFileName ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#15110e]">
                      <span>📄</span>
                      <span>{docFormFileName}</span>
                      {docFormFileSize && <span className="text-[#8b7b6b]">({docFormFileSize})</span>}
                      <span className="text-[11px] text-[#bd9661] underline ml-2">Change File</span>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-semibold text-[#15110e]">
                        Click to select document from your device
                      </div>
                      <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                        PDF certificates, scanned policies, contracts or receipts
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes / Instructions */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#4a3b2c] mb-1">
                  Notes &amp; Venue Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Required by venue coordinator for drone access or heavy equipment..."
                  value={docFormNotes}
                  onChange={(e) => setDocFormNotes(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs text-[#15110e] focus:outline-none focus:border-[#bd9661]"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-[#e8ded0] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowDocModal(false);
                    resetDocForm();
                  }}
                  className="px-4 py-2 border border-[#d5c7b5] text-[#15110e] hover:bg-[#faf8f5] rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {editingDoc ? 'Update Document' : 'Save Document to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Document Modal (opened by clicking the Eye Icon) */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-[#ebd3a8] overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#e8ded0] bg-[#faf8f5] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#15110e] text-[#dfc194] flex items-center justify-center text-base shrink-0 border border-[#bd9661]/40">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                    COMPLIANCE VAULT • DOCUMENT RECORD
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#15110e] leading-snug">
                    {viewingDoc.title}
                  </h3>
                  <div className="text-xs text-[#8b7b6b] flex items-center gap-2 mt-0.5">
                    <span>🏢 {viewingDoc.vendorName}</span>
                    <span>&bull;</span>
                    <span>{viewingDoc.vendorCategory}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close document viewer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Document Preview */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#fcfbfa]">
              {/* Document Metadata Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-white border border-[#e8ded0] rounded-xl text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8b7b6b] block">Document Type</span>
                  <span className="font-semibold text-[#15110e] capitalize">{viewingDoc.docType}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8b7b6b] block">Policy / Reference</span>
                  <span className="font-mono text-[#15110e]">{viewingDoc.policyNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8b7b6b] block">Coverage Expiry</span>
                  <span className="font-semibold text-emerald-800">{viewingDoc.expiryDate || 'Active'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8b7b6b] block">File Size</span>
                  <span className="text-[#15110e] font-mono">{viewingDoc.fileSize || 'On File'}</span>
                </div>
              </div>

              {/* Actual Document Sheet / Certificate Viewer */}
              {viewingDoc.fileDataUrl ? (
                <div className="bg-white border border-[#ebdcc9] rounded-xl p-4 shadow-inner">
                  {viewingDoc.fileName.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/) ? (
                    <img
                      src={viewingDoc.fileDataUrl}
                      alt={viewingDoc.title}
                      className="max-h-[440px] mx-auto object-contain rounded-lg border border-[#e8ded0]"
                    />
                  ) : (
                    <iframe
                      src={viewingDoc.fileDataUrl}
                      title={viewingDoc.title}
                      className="w-full h-[440px] rounded-lg border border-[#e8ded0]"
                    />
                  )}
                </div>
              ) : (
                /* High-fidelity official digital certificate preview */
                <div className="bg-white border-2 border-[#ebd3a8] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs relative overflow-hidden">
                  {/* Decorative background watermark */}
                  <div className="absolute right-4 bottom-4 pointer-events-none opacity-5 font-serif text-8xl font-black text-[#bd9661] select-none">
                    T&amp;T
                  </div>

                  {/* Header */}
                  <div className="border-b border-[#ebdcc9] pb-4 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[2px] text-[#bd9661]">
                        TAP &amp; TOAST COMPLIANCE REGISTRY
                      </div>
                      <h4 className="font-serif text-xl font-bold text-[#15110e] mt-1">
                        Certificate of Compliance &amp; Record
                      </h4>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      <span>✓</span>
                      <span>Verified On File</span>
                    </div>
                  </div>

                  {/* Certificate Body */}
                  <div className="space-y-3 text-xs leading-relaxed text-[#4a3b2c]">
                    <p>
                      This certifies that <strong>{viewingDoc.vendorName}</strong> has registered the document{' '}
                      <strong>"{viewingDoc.title}"</strong> for the wedding celebration of{' '}
                      <strong>{wedding.couple}</strong> at <strong>{wedding.venue}</strong>.
                    </p>

                    <div className="p-3 bg-[#faf8f5] border border-[#e8ded0] rounded-xl space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#8b7b6b]">Official File Name:</span>
                        <span className="text-[#15110e] font-semibold">{viewingDoc.fileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b7b6b]">Classification:</span>
                        <span className="text-[#15110e] font-semibold uppercase">{viewingDoc.docType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b7b6b]">Policy / License Number:</span>
                        <span className="text-[#15110e] font-semibold">{viewingDoc.policyNumber || 'On Record (Vault-Secured)'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b7b6b]">Recorded Upload Date:</span>
                        <span className="text-[#15110e] font-semibold">{viewingDoc.uploadedAt}</span>
                      </div>
                    </div>

                    {viewingDoc.notes && (
                      <div className="p-3 bg-[#faf4ec] border border-[#ebd3a8] rounded-xl text-xs text-[#735122]">
                        <span className="font-bold block text-[10px] uppercase mb-0.5 text-[#936932]">
                          Venue Logistics &amp; Endorsement Notes:
                        </span>
                        <span>"{viewingDoc.notes}"</span>
                      </div>
                    )}
                  </div>

                  {/* Official Verification Seal Footer */}
                  <div className="pt-4 border-t border-[#ebdcc9] flex items-center justify-between text-[11px] text-[#8b7b6b]">
                    <span>Registry ID: {viewingDoc.id}</span>
                    <span className="font-semibold text-[#bd9661]">
                      Digital Seal: Validated &bull; Tap &amp; Toast Secure
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#e8ded0] bg-[#faf8f5] flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => handleDownloadDoc(viewingDoc)}
                className="bg-white hover:bg-[#faf4ec] border border-[#bd9661] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download Document File</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-5 py-2 bg-[#15110e] hover:bg-[#2b221b] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDirectorySection;
