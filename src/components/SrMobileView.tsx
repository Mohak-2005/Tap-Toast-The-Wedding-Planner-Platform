import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppState, useSession, showToast, logAudit, setStoredSession } from '../lib/state';

interface SrMobileViewProps {
  onSelectView?: (view: string) => void;
}

export default function SrMobileView({ onSelectView }: SrMobileViewProps) {
  const MC_PLANS = [
    {
      id: 'mc_base',
      name: 'Community Host (Base)',
      price: 0,
      badge: 'BASE TIER · FREE FOREVER',
      tagline: 'Ideal for solo hosts coordinating a private celebration',
      features: [
        '1 Active Wedding coordination at a time',
        'Interactive live run sheets & timing cues',
        'Direct runsheet sync with nominated couple',
        'Standard email & community support',
      ],
    },
    {
      id: 'mc_pro',
      name: 'Pro Master of Ceremonies',
      price: 149,
      badge: 'RECOMMENDED',
      tagline: 'Get booked by couples with certified directory & Joey AI',
      features: [
        'Public Certified Directory Listing',
        'Up to 5 Active Weddings simultaneously',
        'Joey AI Matchmaker recommendations',
        'Stripe Connect automated client payout split',
      ],
    },
    {
      id: 'mc_agency',
      name: 'Boutique Agency / Host',
      price: 299,
      badge: 'ENTERPRISE HOST',
      tagline: 'Top placement for luxury MC firms & multi-coordinators',
      features: [
        'Priority Top Featured Placement',
        'Unlimited Active Weddings simultaneously',
        'Multiple Coordinator sub-logins',
        'Dedicated VIP Account Concierge',
      ],
    },
  ];

  const { state, setState } = useAppState();
  const { session, setSession } = useSession();

  // Mode: 'signin' or 'register'
  const [activeMode, setActiveMode] = useState<'signin' | 'register'>('signin');

  // ==========================================
  // SIGN IN STATE
  // ==========================================
  const [loginRole, setLoginRole] = useState<'mc' | 'couple' | 'superadmin'>('mc');
  const [loginEmail, setLoginEmail] = useState('robert@galati.demo');
  const [loginPassword, setLoginPassword] = useState('Demo1234!');
  const [loginShowPwd, setLoginShowPwd] = useState(false);
  const [loginRemember, setLoginRemember] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Quick fill handler
  const handleQuickFill = (email: string, role: 'mc' | 'couple' | 'superadmin', name: string) => {
    setLoginRole(role);
    setLoginEmail(email);
    setLoginPassword('Demo1234!');
    showToast(`Filled credentials for ${name}`, 'info');
  };

  // Sign in submit (Common sign-in: automatically recognizes user role from credentials)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      const emailLower = loginEmail.trim().toLowerCase();

      // Look up matching user in system state
      const foundUser = state.users.find(u => u.email.toLowerCase() === emailLower);

      let detectedRole: 'mc' | 'couple' | 'superadmin' = 'couple';
      let sessionName = 'User';
      let weddingId: string | undefined = undefined;
      let tenantId: string | undefined = undefined;

      if (foundUser) {
        detectedRole = foundUser.role === 'planner' ? 'mc' : foundUser.role;
        sessionName = foundUser.name;
        weddingId = foundUser.weddingId;
        tenantId = foundUser.tenantId;
      } else if (emailLower.includes('admin') || emailLower === 'admin@tapandtoast.demo') {
        detectedRole = 'superadmin';
        sessionName = 'Platform Admin';
      } else if (emailLower.includes('galati') || emailLower.includes('robert') || emailLower.includes('mc')) {
        detectedRole = 'mc';
        sessionName = 'Robert Galati';
        tenantId = 'tenant_galati';
      } else {
        detectedRole = 'couple';
        sessionName = 'Sophie & James';
        weddingId = 'w1';
      }

      setLoginRole(detectedRole);

      const newSession = {
        role: detectedRole,
        email: loginEmail,
        name: sessionName,
        weddingId,
        tenantId,
        keepSignedIn: loginRemember,
      };

      setStoredSession(newSession);
      setSession(newSession);
      logAudit(state, setState, 'User Login (Mobile)', sessionName, detectedRole, `Logged in via common mobile sign-in as ${detectedRole}`, 'Security');
      showToast(`Welcome back, ${sessionName}! (${detectedRole === 'superadmin' ? 'Super Admin' : detectedRole === 'mc' ? 'MC / Pro' : 'Couple'})`, 'success');

      if (onSelectView) {
        if (detectedRole === 'superadmin') onSelectView('superadmin');
        else if (detectedRole === 'couple') onSelectView('couple');
        else onSelectView('mc');
      }
    }, 400);
  };

  // ==========================================
  // REGISTER STATE
  // ==========================================
  const [regAccountType, setRegAccountType] = useState<'couple' | 'mc'>('couple');
  const [mcShowConfirm, setMcShowConfirm] = useState(false);
  const [coupleShowConfirm, setCoupleShowConfirm] = useState(false);
  const [weddingStyle, setWeddingStyle] = useState('Modern Luxury & Black Tie');
  const [mcChoiceMode, setMcChoiceMode] = useState<'certified' | 'own'>('certified');
  const [isMcDropdownOpen, setIsMcDropdownOpen] = useState(false);
  const mcDropdownRef = useRef<HTMLDivElement>(null);

  // Close MC dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mcDropdownRef.current && !mcDropdownRef.current.contains(event.target as Node)) {
        setIsMcDropdownOpen(false);
      }
    };
    if (isMcDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMcDropdownOpen]);

  // Couple's Own Preferred MC info
  const [ownMcName, setOwnMcName] = useState('');
  const [ownMcEmail, setOwnMcEmail] = useState('');
  const [ownMcPhone, setOwnMcPhone] = useState('');
  const [ownMcAgency, setOwnMcAgency] = useState('');
  const [ownMcNotes, setOwnMcNotes] = useState('');
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  // MC fields
  const [mcName, setMcName] = useState('');
  const [mcRegStep, setMcRegStep] = useState<'details' | 'plan_payment'>('details');
  const [selectedMcPlanId, setSelectedMcPlanId] = useState<string>('mc_base');
  const [expandedMcPlanId, setExpandedMcPlanId] = useState<string | null>(null);
  const [mcCardName, setMcCardName] = useState('Robert Galati');
  const [mcCardNumber, setMcCardNumber] = useState('•••• •••• •••• 4242');
  const [mcCardExpiry, setMcCardExpiry] = useState('12/28');
  const [mcCardCvc, setMcCardCvc] = useState('888');
  const [mcPromoCode, setMcPromoCode] = useState('');
  const [mcDiscountPercent, setMcDiscountPercent] = useState(0);

  const handleApplyMcPromo = () => {
    const code = mcPromoCode.trim().toUpperCase();
    if (!code) return;
    if (code === 'WELCOME10') {
      setMcDiscountPercent(10);
      showToast('Promo code applied: 10% discount', 'success');
    } else if (code === 'VIP20' || code === 'LAUNCH20') {
      setMcDiscountPercent(20);
      showToast('VIP promo applied: 20% discount', 'success');
    } else {
      showToast('Invalid promo code. Try WELCOME10', 'error');
    }
  };
  const [mcBusiness, setMcBusiness] = useState('');
  const [mcEmail, setMcEmail] = useState('');
  const [mcMobile, setMcMobile] = useState('');
  const [mcAbn, setMcAbn] = useState('');
  const [mcPassword, setMcPassword] = useState('');
  const [mcConfirmPassword, setMcConfirmPassword] = useState('');
  const [mcShowPwd, setMcShowPwd] = useState(false);

  // Couple fields
  const [groomName, setGroomName] = useState('');
  const [groomEmail, setGroomEmail] = useState('');
  const [groomMobile, setGroomMobile] = useState('');
  const [brideName, setBrideName] = useState('');
  const [brideEmail, setBrideEmail] = useState('');
  const [brideMobile, setBrideMobile] = useState('');
  // Couple step state ('registration' | 'payment' | 'mc')
  const [coupleStep, setCoupleStep] = useState<'registration' | 'payment' | 'mc'>('registration');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingDateError, setWeddingDateError] = useState(false);
  const [guestCount, setGuestCount] = useState<number>(110);
  const [venue, setVenue] = useState('');

  // Subscription Plans (Couple-centric SaaS model)
  const SUBSCRIPTION_PLANS = [
    {
      id: 'essential',
      name: 'Essential Wedding Pass',
      price: 149,
      monthlyPrice: 29,
      tagline: 'Ideal for intimate weddings & effortless digital RSVPs',
      features: [
        'Up to 100 Invited Guests',
        'QaRd NFC / QR Digital Invitations',
        'Real-time RSVP tracking & dietary collection',
        'Basic AI Seating Assistant',
        'Gift & Go Wishing Well',
      ],
    },
    {
      id: 'signature',
      name: 'Signature Pro Wedding Suite',
      price: 299,
      monthlyPrice: 49,
      badge: 'RECOMMENDED',
      tagline: 'Complete wedding intelligence with MC sync & Joey AI',
      features: [
        'Up to 250 Invited Guests',
        'Dedicated MC & Coordinator Portal Integration',
        'Live Run Sheet Cues & Audio Timing Sync',
        'Joey AI Concierge (Adults vs Kids breakdown, auto-seat)',
        'Gift & Go Wishing Well (0% fee)',
        'Floor Plan Drag & Drop Table Builder',
      ],
    },
    {
      id: 'couture',
      name: 'Couture Luxury Tier',
      price: 499,
      monthlyPrice: 89,
      tagline: 'White-glove concierge for grand luxury celebrations',
      features: [
        'Unlimited Invited Guests',
        'Dedicated Tap & Toast White Glove Concierge',
        '3D Venue Floor Plan Preview',
        'Multi-Day Itinerary (Rehearsal + Reception + Brunch)',
        'Full Change Audit Trail & Live Video Sync',
      ],
    },
  ];

  // Certified MC Directory with Booked Dates
  const MC_DIRECTORY = [
    {
      id: 'mc_robert',
      name: 'Robert Galati',
      business: 'Galati MC Services',
      rating: '5.0',
      reviews: 142,
      price: 1850,
      experience: '10+ years · 142 luxury weddings',
      location: 'Sydney & Hunter Valley, NSW',
      vibe: 'Modern Luxury, High-Energy & Smooth Multilingual (EN/IT)',
      specialty: 'High-energy entrances, seamless timing, bilingual Italian/English',
      image: '',
      unavailableDates: [
        '2026-11-20', '2026-11-21', '2026-11-28', '2026-12-12', '2026-12-25', '2026-12-31', '2027-01-01'
      ],
    },
    {
      id: 'mc_marcus',
      name: 'Marcus Thorne',
      business: 'Thorne Signature Hosts',
      rating: '4.9',
      reviews: 98,
      price: 1650,
      experience: '8+ years · 98 society & estate weddings',
      location: 'Melbourne & Yarra Valley, VIC',
      vibe: 'Classic Formal, Aristocratic & Eloquent Timing',
      specialty: 'Black-tie etiquette, historic estates, structured royal pacing',
      image: '',
      unavailableDates: [
        '2026-11-14', '2026-11-15', '2026-12-24', '2026-12-25', '2027-01-01', '2027-02-14'
      ],
    },
    {
      id: 'mc_elena',
      name: 'Elena Rostova',
      business: 'Artisan Wedding MCs',
      rating: '5.0',
      reviews: 115,
      price: 1750,
      experience: '9+ years · 115 bespoke celebrations',
      location: 'Southern Highlands & NSW Coast',
      vibe: 'Warm, Romantic Storytelling & Bespoke Pacing',
      specialty: 'Heartfelt storytelling, intimate vineyard romance, emotional pacing',
      image: '',
      unavailableDates: [
        '2026-11-07', '2026-11-14', '2026-11-28', '2026-12-25', '2026-12-31', '2027-03-20'
      ],
    },
    {
      id: 'mc_custom',
      name: 'Invite My Own MC / Coordinator',
      business: 'External Certified Host',
      rating: 'New',
      reviews: 0,
      price: 0,
      experience: 'Client Nominated Host',
      location: 'Australia-wide',
      vibe: 'Send invitation link to your own MC with full run sheet access',
      specialty: 'Coordinate directly with your private family friend or professional MC ($0 fee)',
      unavailableDates: [],
    },
  ];

  // Available MCs dynamically filtered by chosen Wedding Date
  const availableMcs = useMemo(() => {
    if (!weddingDate) return MC_DIRECTORY;
    return MC_DIRECTORY.filter(mc => !mc.unavailableDates.includes(weddingDate));
  }, [weddingDate]);

  // Plan selection & payment state
  const [selectedPlanId, setSelectedPlanId] = useState<string>('signature');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>('signature');
  const [billingCycle, setBillingCycle] = useState<'onetime' | 'monthly'>('onetime');
  const [promoCode, setPromoCode] = useState('');
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    if (code === 'WELCOME10') {
      setDiscountPercent(10);
      showToast('Promo code applied: 10% discount', 'success');
    } else if (code === 'VIP20' || code === 'LAUNCH20') {
      setDiscountPercent(20);
      showToast('VIP promo applied: 20% discount', 'success');
    } else {
      showToast('Invalid promo code. Try WELCOME10', 'error');
    }
  };
  const [discountPercent, setDiscountPercent] = useState(0);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const activePlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];
  const basePrice = billingCycle === 'onetime' ? activePlan.price : activePlan.monthlyPrice;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const finalPrice = Math.max(0, basePrice - discountAmount);

  // MC selection state
  const [selectedMcId, setSelectedMcId] = useState<string>('');
  const [selectedMcModal, setSelectedMcModal] = useState<any | null>(null);

  // Auto-sync selectedMcId if chosen MC is not available on date
  useEffect(() => {
    if (selectedMcId && availableMcs.length > 0 && !availableMcs.some(m => m.id === selectedMcId)) {
      setSelectedMcId(availableMcs[0].id);
    }
  }, [availableMcs, selectedMcId]);

  // Joey Chatbot state for Step 3
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'couple' | 'joey'; text: string; time: string }>>([
    {
      id: 'init_1',
      sender: 'joey',
      text: "G'day! I'm Joey, your AI MC Concierge. Ask me anything about our certified MCs (experience, reviews, pricing, availability on your date) to find your perfect match!",
      time: 'Just now',
    },
  ]);
  const [isChatTyping, setIsChatTyping] = useState(false);

  const handleSendChatMessage = (textToSend?: string) => {
    const rawText = (textToSend || chatInput).trim();
    if (!rawText) return;
    setChatInput('');

    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'couple' as const,
      text: rawText,
      time: 'Just now',
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatTyping(true);

    setTimeout(() => {
      setIsChatTyping(false);
      const q = rawText.toLowerCase();
      let botResponse = '';

      if (q.includes('select robert') || q.includes('choose robert') || q.includes('book robert')) {
        if (!availableMcs.some(m => m.id === 'mc_robert')) {
          botResponse = `Unfortunately, **Robert Galati** is already booked on ${weddingDate}. Available options on this date: ${availableMcs.map(m => m.name).join(', ')}.`;
          showToast('Robert is unavailable on this date', 'error');
        } else {
          setSelectedMcId('mc_robert');
          botResponse = "Selected **Robert Galati** ($1,850 · 5.0 ⭐)! Click Complete Registration below to proceed.";
          showToast('MC Selected: Robert Galati', 'success');
        }
      } else if (q.includes('select marcus') || q.includes('choose marcus') || q.includes('book marcus')) {
        if (!availableMcs.some(m => m.id === 'mc_marcus')) {
          botResponse = `Unfortunately, **Marcus Thorne** is already booked on ${weddingDate}. Available options on this date: ${availableMcs.map(m => m.name).join(', ')}.`;
          showToast('Marcus is unavailable on this date', 'error');
        } else {
          setSelectedMcId('mc_marcus');
          botResponse = "Selected **Marcus Thorne** ($1,650 · 4.9 ⭐)! Click Complete Registration below to proceed.";
          showToast('MC Selected: Marcus Thorne', 'success');
        }
      } else if (q.includes('select elena') || q.includes('choose elena') || q.includes('book elena')) {
        if (!availableMcs.some(m => m.id === 'mc_elena')) {
          botResponse = `Unfortunately, **Elena Rostova** is already booked on ${weddingDate}. Available options on this date: ${availableMcs.map(m => m.name).join(', ')}.`;
          showToast('Elena is unavailable on this date', 'error');
        } else {
          setSelectedMcId('mc_elena');
          botResponse = "Selected **Elena Rostova** ($1,750 · 5.0 ⭐)! Click Complete Registration below to proceed.";
          showToast('MC Selected: Elena Rostova', 'success');
        }
      } else if (q.includes('available') || q.includes('who is free') || q.includes('availability')) {
        const names = availableMcs.map(m => m.name).join(', ');
        const unavailable = MC_DIRECTORY.filter(m => !availableMcs.some(am => am.id === m.id));
        botResponse = `For **${weddingDate || 'your date'}**:\n• **Available Hosts**: ${names}\n` +
          (unavailable.length > 0 ? `• **Booked**: ${unavailable.map(m => m.name).join(', ')}` : '');
      } else if (q.includes('experience') || q.includes('experienced') || q.includes('years') || q.includes('how many')) {
        botResponse = "**Robert Galati** is our most experienced host with **142+ luxury weddings** (10+ years). Elena Rostova has 115+ weddings (9 years) and Marcus Thorne has 98+ weddings (8 years).";
      } else if (q.includes('review') || q.includes('rating') || q.includes('star') || q.includes('5.0')) {
        botResponse = "Both **Robert Galati** (142 reviews) and **Elena Rostova** (115 reviews) hold a perfect **5.0 ⭐** rating! Marcus Thorne holds **4.9 ⭐** (98 reviews).";
      } else if (q.includes('cost') || q.includes('price') || q.includes('rate') || q.includes('budget') || q.includes('under 1800') || q.includes('1800')) {
        botResponse = "Pricing breakdown:\n• **Marcus Thorne**: $1,650 AUD (Best under $1,800)\n• **Elena Rostova**: $1,750 AUD (5.0 ⭐ under $1,800)\n• **Robert Galati**: $1,850 AUD (Executive)\n• **Own MC**: $0 platform fee";
      } else {
        botResponse = "I can help evaluate and compare our MCs! Ask me about:\n• *Who is available on my date?*\n• *Who has 5.0 stars?*\n• *Which MC falls under $1,800?*\n• *Who has the most experience?*";
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: 'joey_' + Date.now(),
          sender: 'joey',
          text: botResponse,
          time: 'Just now',
        },
      ]);
    }, 350);
  };

  const [couplePassword, setCouplePassword] = useState('');
  const [coupleConfirmPassword, setCoupleConfirmPassword] = useState('');
  const [coupleShowPwd, setCoupleShowPwd] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  // Phone formatter
  const formatAuMobile = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 10);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.substring(0, 4)} ${digits.substring(4)}`;
    return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
  };

  // Password strength logic
  const activePassword = regAccountType === 'mc' ? mcPassword : couplePassword;
  const hasMinLength = activePassword.length >= 8;
  const hasUpper = /[A-Z]/.test(activePassword);
  const hasLower = /[a-z]/.test(activePassword);
  const hasNum = /[0-9]/.test(activePassword);
  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNum].filter(Boolean).length;
  const strengthColor =
    strengthScore === 0 ? '#e5e7eb' : strengthScore <= 2 ? '#ef4444' : strengthScore === 3 ? '#eab308' : '#10b981';
  const strengthLabel =
    strengthScore === 0 ? 'Empty' : strengthScore <= 2 ? 'Weak password' : strengthScore === 3 ? 'Medium strength' : 'Strong password';
  const passwordsMatch = Boolean(mcPassword && mcConfirmPassword && mcPassword === mcConfirmPassword);
  const couplePasswordsMatch = Boolean(couplePassword && coupleConfirmPassword && couplePassword === coupleConfirmPassword);
  const selectedMc = useMemo(() => {
    return MC_DIRECTORY.find(m => m.id === selectedMcId) || null;
  }, [selectedMcId]);

  // Registration submit: MC
  // MC Step 1: Proceed to Plan selection
  const handleProceedToMcPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcName || !mcBusiness || !mcEmail || !mcMobile) {
      showToast('Please fill out all required personal & agency details', 'error');
      return;
    }
    if (mcPassword !== mcConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to terms to proceed', 'error');
      return;
    }
    setMcRegStep('plan_payment');
  };

  // MC Step 2: Finalize MC Registration
  const handleFinalizeMcRegistration = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      const chosenPlan = MC_PLANS.find(p => p.id === selectedMcPlanId) || MC_PLANS[0];
      const newMcUser = {
        id: 'user_mc_' + Date.now(),
        email: mcEmail.trim(),
        role: 'mc' as const,
        name: mcName.trim() || 'New MC',
        tenantId: 'tenant_' + Date.now(),
      };
      setState({
        ...state,
        users: [...state.users, newMcUser],
      });
      const newSession = {
        role: 'mc' as const,
        email: mcEmail.trim(),
        name: mcName.trim() || 'New MC',
        keepSignedIn: true,
      };
      setStoredSession(newSession);
      setSession(newSession);
      logAudit(state, setState, 'MC Registration (Mobile)', newMcUser.name, 'mc', `New MC registered via S/R Mobile on plan ${chosenPlan.name}`, 'Security');
      showToast(`Welcome to Tap & Toast, ${newMcUser.name}!`, 'success');
      if (onSelectView) onSelectView('mc');
    }, 450);
  };

  // Couple Wizard Handlers
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setWeddingDateError(false);
    if (couplePassword !== coupleConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to terms', 'error');
      return;
    }
    setCoupleStep('payment');
    showToast('Details saved! Please select your subscription plan.', 'success');
  };

  const handleProceedToMc = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      setCoupleStep('mc');
      showToast('Payment confirmed! Select your certified MC.', 'success');
    }, 450);
  };

  // Final Registration submit: Couple (Step 3 -> Dashboard)
  const handleFinalizeCoupleRegistration = () => {
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      const bName = brideName.trim() || 'Sophie';
      const gName = groomName.trim() || 'James';
      const coupleName = `${bName} & ${gName}`;
      const newWeddingId = 'wedding_' + Date.now();
      const bEmail = brideEmail.trim();
      const gEmail = groomEmail.trim();
      const chosenMc = availableMcs.find(m => m.id === selectedMcId) || availableMcs[0] || MC_DIRECTORY[0];

      const newUsers: any[] = [];
      if (bEmail) {
        newUsers.push({
          id: 'user_bride_' + Date.now(),
          email: bEmail,
          role: 'couple' as const,
          name: `${bName} (${coupleName})`,
          partner1: bName,
          partner2: gName,
          tenantId: 'ten1',
          weddingId: newWeddingId,
        });
      }
      if (gEmail && gEmail.toLowerCase() !== bEmail.toLowerCase()) {
        newUsers.push({
          id: 'user_groom_' + Date.now(),
          email: gEmail,
          role: 'couple' as const,
          name: `${gName} (${coupleName})`,
          partner1: bName,
          partner2: gName,
          tenantId: 'ten1',
          weddingId: newWeddingId,
        });
      }
      if (newUsers.length === 0) {
        newUsers.push({
          id: 'user_' + Date.now(),
          email: 'couple@example.com',
          role: 'couple' as const,
          name: coupleName,
          partner1: bName,
          partner2: gName,
          tenantId: 'ten1',
          weddingId: newWeddingId,
        });
      }

      const newWedding = {
        id: newWeddingId,
        tenantId: 'tenant_galati',
        couple: coupleName,
        partner1: bName,
        partner2: gName,
        date: weddingDate,
        dateDisplay: new Date(weddingDate + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        venue: venue.trim() || 'Fernwood Estate, Hunter Valley',
        region: 'NSW',
        daysRemaining: 180,
        invited: guestCount || 110,
        confirmed: 0,
        declined: 0,
        awaiting: guestCount || 110,
        tablesSeated: 0,
        totalTables: Math.ceil((guestCount || 110) / 10),
        giftsTotal: 0,
        subscriptionPlan: {
          id: activePlan.id,
          name: activePlan.name,
          price: finalPrice,
          status: 'Active',
          billingCycle,
          activatedAt: new Date().toISOString(),
        },
        selectedMc: {
          id: chosenMc.id,
          name: chosenMc.name,
          businessName: chosenMc.business,
          rating: chosenMc.rating,
          status: 'Confirmed',
        },
        aiOnboardingAnswers: {
          vibe: 'Modern Luxury & High Energy',
          speeches: 'Grouped before mains',
          entrance: 'Upbeat grand entrance',
          family: 'Family-friendly (Adults & Kids)',
          auditedAt: new Date().toISOString(),
          auditedByCouple: true,
        },
        giftingPresets: [50, 100, 200, 300],
        status: 'Planning',
        tasks: [
          { id: 't1', text: 'Confirm floral arrangements & ceremony arch', completed: false, due: 'This week' },
          { id: 't2', text: `Review run sheet with MC ${chosenMc.name}`, completed: false, due: 'This week' },
        ],
      };

      setState({
        ...state,
        users: [...state.users, ...newUsers],
        weddings: [...state.weddings, newWedding],
      });

      const newSession = {
        role: 'couple' as const,
        email: bEmail || gEmail || 'couple@example.com',
        name: coupleName,
        weddingId: newWeddingId,
        keepSignedIn: true,
      };
      setStoredSession(newSession);
      setSession(newSession);
      logAudit(state, setState, 'Couple Registration (Mobile)', coupleName, 'couple', `Registered couple via S/R Mobile. Plan: ${activePlan.name}, MC: ${chosenMc.name}`, 'Security');
      showToast(`Welcome ${coupleName}! Your wedding workspace is ready.`, 'success');
      if (onSelectView) onSelectView('couple');
    }, 450);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-[radial-gradient(circle_at_50%_25%,_#f6f3ed_0%,_#e5e0d6_100%)] min-h-[calc(100vh-45px)] overflow-hidden font-sans select-none">
      {/* 402x874 Phone Chassis matching Guest & MC Mobile */}
      <div className="w-[402px] max-w-[402px] h-[874px] max-h-[calc(100vh-60px)] rounded-[46px] border-[4px] border-[#1c1511] bg-[#f8f6f2] shadow-[0_20px_60px_rgba(21,17,14,0.22),_0_4px_14px_rgba(21,17,14,0.08)] overflow-hidden relative flex flex-col">
        {/* Phone Status Bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-2 text-[13px] font-bold z-20 flex-shrink-0 bg-[#f8f6f2] text-[#15110e]">
          <span>9:41</span>
          <div className="w-20 h-4 bg-[#15110e] rounded-full mx-auto" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider text-[#bd9661] font-bold">5G</span>
            <div className="w-5 h-2.5 border-[1.5px] border-[#15110e] rounded-xs p-0.5 flex items-center relative">
              <div className="w-[85%] h-full bg-[#bd9661] rounded-[1px]" />
              <div className="absolute -right-1 top-0.5 w-[2px] h-1 rounded-r-xs bg-[#15110e]" />
            </div>
          </div>
        </div>

        {/* Brand App Bar */}
        <div className="px-5 pt-1.5 pb-2.5 bg-[#f8f6f2] border-b border-[#e8ded0] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#15110e] text-[#bd9661] font-serif font-bold text-sm rounded flex items-center justify-center border border-[#bd9661]/40">
              T
            </div>
            <div>
              <div className="font-serif text-sm font-bold text-[#15110e] leading-none">
                Tap &amp; Toast
              </div>
              <div className="text-[9px] text-[#8b7b6b] tracking-wider uppercase">
                Mobile Auth Suite
              </div>
            </div>
          </div>
          <span className="text-[10px] bg-[#bd9661]/15 text-[#8a6839] font-bold px-2 py-0.5 rounded-full border border-[#bd9661]/30">
            S/R Mobile
          </span>
        </div>

        {/* Primary Segment Switcher: Sign In vs Register */}
        <div className="p-3 bg-[#f8f6f2] border-b border-[#e8ded0] flex-shrink-0">
          <div className="grid grid-cols-2 p-1 bg-[#ede6da] rounded-xl border border-[#dfd4c3]">
            <button
              type="button"
              onClick={() => setActiveMode('signin')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeMode === 'signin'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                  : 'text-[#6b5847] hover:text-[#15110e]'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('register')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeMode === 'register'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                  : 'text-[#6b5847] hover:text-[#15110e]'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> Register
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeMode === 'signin' ? (
            /* ========================================================== */
            /* MODE 1: MOBILE SIGN IN                                      */
            /* ========================================================== */
            <div className="space-y-4">
              {/* Role selector pill tabs */}
              {/* Common Sign In Header */}
              <div>
                <h2 className="font-serif text-xl font-bold text-[#15110e]">
                  Sign in to Tap &amp; Toast
                </h2>
                <p className="text-xs text-[#8b7b6b] mt-0.5">
                  Enter your credentials below to access your dashboard.
                </p>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={loginShowPwd ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 pr-12 text-xs text-[#15110e] outline-none"
                      placeholder="Enter password"
                    />
                    <button
  type="button"
  onClick={() => setLoginShowPwd(!loginShowPwd)}
  aria-label={loginShowPwd ? 'Hide password' : 'Show password'}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7b6b] hover:text-[#15110e] transition-colors cursor-pointer p-0.5"
>
  {loginShowPwd ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )}
</button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8b7b6b] pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginRemember}
                      onChange={(e) => setLoginRemember(e.target.checked)}
                      className="rounded text-[#bd9661]"
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Password reset link sent to registered email', 'info');
                    }}
                    className="text-[#bd9661] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm mt-1"
                >
                  {isLoggingIn ? 'Signing In...' : 'Sign In →'}
                </button>
              </form>

              {/* Demo Accounts (1-Click Fill) */}
              <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-3 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Demo Accounts (1-Click Fill)
                </div>
                <div className="space-y-1.5 text-xs">
                  <div
                    onClick={() => handleQuickFill('robert@galati.demo', 'mc', 'Robert Galati (MC)')}
                    className="p-2 bg-white rounded-lg border border-[#ebdcc9] flex items-center justify-between cursor-pointer hover:border-[#bd9661] transition-all"
                  >
                    <div>
                      <div className="font-semibold text-[#15110e] text-[11px]">Robert Galati (MC / Pro)</div>
                      <div className="text-[10px] text-[#8b7b6b]">robert@galati.demo</div>
                    </div>
                    <span className="text-[#bd9661] font-bold text-[11px]">Use →</span>
                  </div>

                  <div
                    onClick={() => handleQuickFill('sophie@demo.test', 'couple', 'Sophie Bell (Bride)')}
                    className="p-2 bg-white rounded-lg border border-[#ebdcc9] flex items-center justify-between cursor-pointer hover:border-[#bd9661] transition-all"
                  >
                    <div>
                      <div className="font-semibold text-[#15110e] text-[11px]">Sophie Bell (Bride)</div>
                      <div className="text-[10px] text-[#8b7b6b]">sophie@demo.test</div>
                    </div>
                    <span className="text-[#bd9661] font-bold text-[11px]">Use →</span>
                  </div>

                  <div
                    onClick={() => handleQuickFill('james@demo.test', 'couple', 'James Gordon (Groom)')}
                    className="p-2 bg-white rounded-lg border border-[#ebdcc9] flex items-center justify-between cursor-pointer hover:border-[#bd9661] transition-all"
                  >
                    <div>
                      <div className="font-semibold text-[#15110e] text-[11px]">James Gordon (Groom)</div>
                      <div className="text-[10px] text-[#8b7b6b]">james@demo.test</div>
                    </div>
                    <span className="text-[#bd9661] font-bold text-[11px]">Use →</span>
                  </div>

                  <div
                    onClick={() => handleQuickFill('admin@tapandtoast.demo', 'superadmin', 'Platform Admin')}
                    className="p-2 bg-white rounded-lg border border-[#ebdcc9] flex items-center justify-between cursor-pointer hover:border-[#bd9661] transition-all"
                  >
                    <div>
                      <div className="font-semibold text-[#15110e] text-[11px]">Platform Super Admin</div>
                      <div className="text-[10px] text-[#8b7b6b]">admin@tapandtoast.demo</div>
                    </div>
                    <span className="text-[#bd9661] font-bold text-[11px]">Use →</span>
                  </div>
                </div>
              </div>

              {/* Bottom Switch Link */}
              <div className="text-center text-xs text-[#8b7b6b] pt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveMode('register')}
                  className="text-[#bd9661] font-bold hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================== */
            /* MODE 2: MOBILE REGISTER (SAME TO SAME AS WEB REGISTER IN MOBILE VIEW) */
            <div className="space-y-4">
              {/* Account Type Selector identical to Web Register */}
              <div className="grid grid-cols-2 gap-2 bg-[#f0ebe3] p-1.5 rounded-xl border border-[#e2d8cb]">
                <button
                  type="button"
                  onClick={() => {
                    setRegAccountType('couple');
                    setCoupleStep('registration');
                  }}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    regAccountType === 'couple'
                      ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                      : 'text-[#6b5847] hover:text-[#15110e] hover:bg-[#e8ded0]/50'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  <span>Couple Registration</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRegAccountType('mc');
                    setMcRegStep('details');
                  }}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    regAccountType === 'mc'
                      ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                      : 'text-[#6b5847] hover:text-[#15110e] hover:bg-[#e8ded0]/50'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /></svg>
                  <span>Certified MC Registration</span>
                </button>
              </div>

              {regAccountType === 'couple' ? (
                <div className="space-y-3.5">
                  {/* COUPLE ONBOARDING PROGRESS STEPPER */}
                  <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 flex items-center justify-between text-xs">
                    {/* Step 1 */}
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          coupleStep === 'registration'
                            ? 'bg-[#15110e] text-[#dfc194] ring-2 ring-[#bd9661]'
                            : 'bg-[#bd9661] text-[#15110e]'
                        }`}
                      >
                        {coupleStep !== 'registration' ? '✓' : '1'}
                      </div>
                      <span className={`text-[11px] font-semibold ${coupleStep === 'registration' ? 'text-[#15110e]' : 'text-[#8b7b6b]'}`}>
                        Registration
                      </span>
                    </div>

                    <div className="h-0.5 flex-1 bg-[#ebdcc9] mx-2">
                      <div
                        className="h-full bg-[#bd9661] transition-all duration-300"
                        style={{ width: coupleStep === 'registration' ? '0%' : coupleStep === 'payment' ? '50%' : '100%' }}
                      />
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          coupleStep === 'payment'
                            ? 'bg-[#15110e] text-[#dfc194] ring-2 ring-[#bd9661]'
                            : coupleStep === 'mc'
                            ? 'bg-[#bd9661] text-[#15110e]'
                            : 'bg-[#ebdcc9] text-[#8b7b6b]'
                        }`}
                      >
                        {coupleStep === 'mc' ? '✓' : '2'}
                      </div>
                      <span className={`text-[11px] font-semibold ${coupleStep === 'payment' ? 'text-[#15110e]' : 'text-[#8b7b6b]'}`}>
                        Plan &amp; Pay
                      </span>
                    </div>

                    <div className="h-0.5 flex-1 bg-[#ebdcc9] mx-2">
                      <div
                        className="h-full bg-[#bd9661] transition-all duration-300"
                        style={{ width: coupleStep === 'mc' ? '100%' : '0%' }}
                      />
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          coupleStep === 'mc'
                            ? 'bg-[#15110e] text-[#dfc194] ring-2 ring-[#bd9661]'
                            : 'bg-[#ebdcc9] text-[#8b7b6b]'
                        }`}
                      >
                        3
                      </div>
                      <span className={`text-[11px] font-semibold ${coupleStep === 'mc' ? 'text-[#15110e]' : 'text-[#8b7b6b]'}`}>
                        MC Setup
                      </span>
                    </div>
                  </div>

                  {coupleStep === 'registration' ? (
                    /* STEP 1: COUPLE REGISTRATION DETAILS */
                    <form noValidate onSubmit={handleProceedToPayment} className="space-y-3.5">
                      <div>
                        <div className="text-[9px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-0.5">
                          STEP 1 OF 3 · WEDDING &amp; COUPLE PROFILE
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#15110e] leading-tight">
                          Register Your Wedding
                        </h3>
                        <p className="text-[11px] text-[#8b7b6b] mt-0.5">
                          Set up your luxury celebration hub, digital stationery suite, and coordination workspace.
                        </p>
                      </div>

                      {/* Groom Section */}
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                        <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#ebdcc9]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#bd9661]" /> Groom Details
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#4a3b2c] mb-1">
                            Groom Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={groomName}
                            onChange={(e) => setGroomName(e.target.value)}
                            placeholder="James Wilson"
                            className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#4a3b2c] mb-1">
                            Groom Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={groomEmail}
                            onChange={(e) => setGroomEmail(e.target.value)}
                            placeholder="james.wilson@example.com"
                            className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#4a3b2c] mb-1">
                            Groom Contact Number *
                          </label>
                          <div className="flex rounded-lg overflow-hidden border border-[#d5c7b5] focus-within:border-[#bd9661] bg-white shadow-2xs">
                            <span className="inline-flex items-center px-2.5 bg-[#f5ede2] text-xs font-bold text-[#6b5847] border-r border-[#e2d8cb] select-none">
                              +61
                            </span>
                            <input
                              type="tel"
                              required
                              value={groomMobile}
                              onChange={(e) => setGroomMobile(formatAuMobile(e.target.value))}
                              placeholder="0412 345 678"
                              className="w-full px-2.5 py-1.5 text-xs text-[#15110e] outline-none bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bride Section */}
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                        <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#ebdcc9]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#bd9661]" /> Bride Details
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#4a3b2c] mb-1">
                            Bride Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={brideName}
                            onChange={(e) => setBrideName(e.target.value)}
                            placeholder="Sophie Carter"
                            className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#4a3b2c] mb-1">
                            Bride Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={brideEmail}
                            onChange={(e) => setBrideEmail(e.target.value)}
                            placeholder="sophie.carter@example.com"
                            className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#4a3b2c] mb-1">
                            Bride Contact Number *
                          </label>
                          <div className="flex rounded-lg overflow-hidden border border-[#d5c7b5] focus-within:border-[#bd9661] bg-white shadow-2xs">
                            <span className="inline-flex items-center px-2.5 bg-[#f5ede2] text-xs font-bold text-[#6b5847] border-r border-[#e2d8cb] select-none">
                              +61
                            </span>
                            <input
                              type="tel"
                              required
                              value={brideMobile}
                              onChange={(e) => setBrideMobile(formatAuMobile(e.target.value))}
                              placeholder="0423 456 789"
                              className="w-full px-2.5 py-1.5 text-xs text-[#15110e] outline-none bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Wedding & Celebration Details */}
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                        <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center justify-between pb-1 border-b border-[#ebdcc9]">
                          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#bd9661]" /> Wedding &amp; Venue Details</span>
                          <span className="text-[9.5px] text-[#8b7b6b] font-medium">Venue &amp; Schedule</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[10px] font-bold uppercase text-[#4a3b2c]">
                                Wedding Date
                              </label>
                              <span className="text-[9.5px] font-medium text-[#8b7b6b] bg-[#faf8f5] border border-[#e8ded0] px-1.5 py-0.5 rounded">
                                Optional
                              </span>
                            </div>
                            <input
                              type="date"
                              value={weddingDate}
                              onChange={(e) => setWeddingDate(e.target.value)}
                              className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2 py-1.5 text-xs text-[#15110e] outline-none font-semibold shadow-2xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#4a3b2c] mb-1">
                              Guests (Adults/Kids) *
                            </label>
                            <input
                              type="number"
                              required
                              min={1}
                              value={guestCount}
                              onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                              className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] font-bold shadow-2xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#4a3b2c] mb-1">
                            Ceremony &amp; Reception Venue <span className="font-normal lowercase text-[#8b7b6b]">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            placeholder="e.g. Fernwood Estate, Hunter Valley"
                            className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Password & Security */}
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                        <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#ebdcc9]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#bd9661]" /> Account Password
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#4a3b2c] mb-1">
                            Password *
                          </label>
                          <div className="relative">
                            <input
                              type={coupleShowPwd ? 'text' : 'password'}
                              required
                              value={couplePassword}
                              onChange={(e) => setCouplePassword(e.target.value)}
                              placeholder="Create password"
                              className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 pr-10 text-xs text-[#15110e] outline-none focus:border-[#bd9661] shadow-2xs"
                            />
                            <button
                              type="button"
                              onClick={() => setCoupleShowPwd(!coupleShowPwd)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7b6b] hover:text-[#15110e] cursor-pointer"
                            >
                              {coupleShowPwd ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          <div className="w-full bg-[#e8ded0] h-1 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="h-full transition-all duration-300"
                              style={{ width: `${(strengthScore / 4) * 100}%`, backgroundColor: strengthColor }}
                            />
                          </div>
                          <div className="text-[9.5px] text-[#8b7b6b] mt-0.5">{strengthLabel}</div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#4a3b2c] mb-1">
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <input
                              type={coupleShowConfirm ? 'text' : 'password'}
                              required
                              value={coupleConfirmPassword}
                              onChange={(e) => setCoupleConfirmPassword(e.target.value)}
                              placeholder="Re-enter password"
                              className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 pr-10 text-xs text-[#15110e] outline-none focus:border-[#bd9661] shadow-2xs"
                            />
                            <button
                              type="button"
                              onClick={() => setCoupleShowConfirm(!coupleShowConfirm)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7b6b] hover:text-[#15110e] cursor-pointer"
                            >
                              {coupleShowConfirm ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {coupleConfirmPassword && (
                            <div className={`text-[10px] mt-0.5 font-semibold ${couplePasswordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                              {couplePasswordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Terms */}
                      <label className="flex items-start gap-2 text-[11px] text-[#6b5847] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 rounded text-[#bd9661] focus:ring-[#bd9661]"
                        />
                        <span>
                          I agree to the <span className="text-[#bd9661] underline font-semibold">Terms of Service</span> and <span className="text-[#bd9661] underline font-semibold">Privacy Policy</span>
                        </span>
                      </label>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>Proceed to Choose Plan &amp; Payment</span>
                        <span>→</span>
                      </button>
                    </form>
                  ) : coupleStep === 'payment' ? (
                    /* STEP 2: COUPLE SUBSCRIPTION & STRIPE PAYMENT SIMULATION */
                    <form noValidate onSubmit={handleProceedToMc} className="space-y-3.5">
                      <div>
                        <div className="text-[9px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-0.5">
                          STEP 2 OF 3 · WEDDING SUITE PLANS
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#15110e] leading-tight">
                          Select Your Wedding Plan
                        </h3>
                        <p className="text-[11px] text-[#8b7b6b] mt-0.5">
                          Choose your digital wedding suite pass. Includes automated RSVP tracking, seating studio, and MC synchronization.
                        </p>
                      </div>

                      {/* Billing Cycle Toggle */}
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#ede6da] rounded-xl border border-[#dfd4c3]">
                        <button
                          type="button"
                          onClick={() => setBillingCycle('onetime')}
                          className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            billingCycle === 'onetime'
                              ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                              : 'text-[#6b5847]'
                          }`}
                        >
                          One-Time Wedding Pass
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingCycle('monthly')}
                          className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            billingCycle === 'monthly'
                              ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                              : 'text-[#6b5847]'
                          }`}
                        >
                          Monthly Subscription
                        </button>
                      </div>

                      {/* Dropdown Accordion Plans List identical to Web Register */}
                      <div className="space-y-2">
                        {SUBSCRIPTION_PLANS.map((plan) => {
                          const isSelected = selectedPlanId === plan.id;
                          const isExpanded = expandedPlanId === plan.id;
                          const planPrice = billingCycle === 'onetime' ? plan.price : plan.monthlyPrice;

                          return (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedPlanId(plan.id)}
                              className={`border-2 rounded-xl p-2.5 transition-all cursor-pointer bg-white ${
                                isSelected
                                  ? 'border-[#bd9661] shadow-xs ring-1 ring-[#bd9661]/25 bg-[#fdfbf7]'
                                  : 'border-[#e8ded0] hover:border-[#bd9661]/50'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="mobileSubscriptionPlan"
                                    checked={isSelected}
                                    onChange={() => setSelectedPlanId(plan.id)}
                                    className="text-[#bd9661] focus:ring-[#bd9661] cursor-pointer"
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-serif text-xs font-bold text-[#15110e]">
                                        {plan.name}
                                      </span>
                                      {plan.badge && (
                                        <span className="text-[8px] font-black uppercase bg-[#15110e] text-[#dfc194] px-1.5 py-0.2 rounded">
                                          {plan.badge === 'RECOMMENDED' ? 'MOST POPULAR' : plan.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="font-mono text-xs font-bold text-[#bd9661] mt-0.5">
                                      ${planPrice} AUD <span className="text-[9.5px] font-normal text-[#8b7b6b]">/{billingCycle === 'onetime' ? 'wedding' : 'mo'}</span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedPlanId(isExpanded ? null : plan.id);
                                  }}
                                  className="p-1 rounded text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#f0ebe3] cursor-pointer"
                                  title={isExpanded ? 'Collapse features' : 'Expand features'}
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                  >
                                    <polyline points="6 9 12 15 18 9" />
                                  </svg>
                                </button>
                              </div>

                              {/* Accordion Expandable Features */}
                              {isExpanded && (
                                <div className="mt-2 pt-2 border-t border-[#f0ede6] space-y-1 text-[10.5px] text-[#544332]">
                                  {plan.features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                      <span className="text-[#bd9661] font-bold">✓</span>
                                      <span>{feat}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Stripe Test Card Quick Fill */}
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2">
                        <div className="flex items-center justify-between pb-1 border-b border-[#ebdcc9]">
                          <span className="text-[10px] font-bold uppercase text-[#8b7b6b]">
                            STRIPE SECURE CHECKOUT
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCardName(brideName || 'Sophie Carter');
                              setCardNumber('4242 •••• •••• 4242');
                              setCardExpiry('12/28');
                              setCardCvc('123');
                              showToast('Demo card filled!', 'info');
                            }}
                            className="text-[9.5px] font-bold text-[#bd9661] bg-white border border-[#ebdcc9] px-2 py-0.5 rounded cursor-pointer"
                          >
                            Use Demo Test Card
                          </button>
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-bold uppercase text-[#8b7b6b] mb-0.5">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Sophie Carter"
                            className="w-full bg-white border border-[#d5c7b5] rounded-md px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-bold uppercase text-[#8b7b6b] mb-0.5">
                            Card Number
                          </label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 •••• •••• 4242"
                            className="w-full bg-white border border-[#d5c7b5] rounded-md px-2.5 py-1.5 text-xs text-[#15110e] outline-none font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9.5px] font-bold uppercase text-[#8b7b6b] mb-0.5">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="12/28"
                              className="w-full bg-white border border-[#d5c7b5] rounded-md px-2.5 py-1.5 text-xs text-[#15110e] outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[9.5px] font-bold uppercase text-[#8b7b6b] mb-0.5">
                              CVC
                            </label>
                            <input
                              type="text"
                              required
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="123"
                              className="w-full bg-white border border-[#d5c7b5] rounded-md px-2.5 py-1.5 text-xs text-[#15110e] outline-none font-mono"
                            />
                          </div>
                        </div>

                        {/* Promo Code Input */}
                        <div className="pt-0.5">
                          <label className="block text-[9.5px] font-bold uppercase text-[#8b7b6b] mb-0.5">Promo Code</label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              placeholder="e.g. WELCOME10"
                              className="flex-1 bg-white border border-[#d5c7b5] rounded-md px-2 py-1 text-xs uppercase outline-none focus:border-[#bd9661]"
                            />
                            <button
                              type="button"
                              onClick={handleApplyPromo}
                              className="bg-[#15110e] text-[#dfc194] px-2.5 py-1 rounded-md text-[11px] font-bold hover:bg-[#2b221a] cursor-pointer whitespace-nowrap"
                            >
                              Apply
                            </button>
                          </div>
                        </div>

                        {/* Price Total */}
                        <div className="bg-white p-2 rounded-lg border border-[#ebdcc9] text-[11px] space-y-1">
                          <div className="flex justify-between text-[#8b7b6b]">
                            <span>{activePlan.name} ({billingCycle === 'onetime' ? 'One-Time' : 'Monthly'})</span>
                            <span>${basePrice}.00 AUD</span>
                          </div>
                          {discountPercent > 0 && (
                            <div className="flex justify-between text-emerald-600 font-semibold">
                              <span>Promo Discount ({discountPercent}%)</span>
                              <span>-${discountAmount}.00 AUD</span>
                            </div>
                          )}
                          <div className="flex justify-between text-[#8b7b6b]">
                            <span>Australian GST (10%)</span>
                            <span>Included</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold text-[#15110e] pt-1 border-t border-[#f0ede6]">
                            <span>Total Due:</span>
                            <span className="text-[#bd9661] font-serif">${finalPrice}.00 AUD</span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setCoupleStep('registration')}
                          className="h-9 px-3 border border-[#d5c7b5] text-[#6b5847] hover:text-[#15110e] hover:bg-[#faf7f2] rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center"
                        >
                          ← Back to Details
                        </button>
                        <button
                          type="submit"
                          disabled={isRegistering}
                          className="h-9 flex-1 px-3 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <span>{isRegistering ? 'Processing...' : `Pay ${finalPrice} & Proceed to MC Setup →`}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* STEP 3: MC SETUP (DROPDOWN + JOEY AI IDENTICAL TO WEB REGISTER) */
                    <div className="space-y-3.5">
                      <div>
                        <div className="text-[9px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-0.5">
                          COUPLE ONBOARDING · STEP 3 OF 3
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#15110e] leading-tight">
                          MC Setup
                        </h3>
                        <p className="text-[11px] text-[#8b7b6b] mt-0.5">
                          Choose from our certified wedding MCs or prefer your own host. SuperAdmin will dispatch platform credentials accordingly.
                        </p>
                      </div>

                      {/* MC CHOICE MODE SELECTOR: CERTIFIED VS PREFER OWN MC */}
                      <div className="grid grid-cols-2 gap-1.5 bg-[#f4efe8] p-1 rounded-xl border border-[#ebdcc9]">
                        <button
                          type="button"
                          onClick={() => setMcChoiceMode('certified')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            mcChoiceMode === 'certified'
                              ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                              : 'text-[#6b5847] hover:text-[#15110e]'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          <span>Choose Certified MC</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMcChoiceMode('own');
                            setIsFloatingChatOpen(false);
                          }}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            mcChoiceMode === 'own'
                              ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                              : 'text-[#6b5847] hover:text-[#15110e]'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="22" y1="11" x2="16" y2="11" />
                          </svg>
                          <span>Prefer Our Own MC</span>
                        </button>
                      </div>

                      {/* OPTION A: CHOOSE FROM CERTIFIED WEDDING MCS (DROPDOWN) */}
                      {mcChoiceMode === 'certified' ? (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#15110e]">
                              SELECT YOUR CERTIFIED WEDDING MC
                            </label>

                            <div className="relative" ref={mcDropdownRef}>
                              <button
                                type="button"
                                onClick={() => setIsMcDropdownOpen(!isMcDropdownOpen)}
                                className="w-full bg-white border border-[#d5c7b5] hover:border-[#bd9661] rounded-xl p-2.5 flex items-center justify-between text-left transition-all cursor-pointer shadow-2xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                  <div className="w-9 h-9 rounded-full bg-[#15110e] border border-[#bd9661] flex items-center justify-center text-[#dfc194] font-serif font-bold text-xs shrink-0 overflow-hidden">
                                    {!selectedMcId ? (
                                      <span>🥂</span>
                                    ) : selectedMc?.image ? (
                                      <img src={selectedMc.image} alt={selectedMc.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span>{selectedMc ? selectedMc.name.split(' ').map((n: string) => n[0]).join('') : 'MC'}</span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-serif font-bold text-xs text-[#15110e] truncate">
                                      {!selectedMcId ? 'Select MC' : selectedMc?.name}
                                    </div>
                                    <div className="text-[10px] text-[#7d654c] mt-0.5 line-clamp-1 font-medium">
                                      {!selectedMcId ? (
                                        'Choose a certified MC according to your preference, or proceed without one to assign later'
                                      ) : (
                                        <span>{selectedMc?.business} &bull; <strong className="text-[#bd9661]">⭐ {selectedMc?.rating}</strong></span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-[#8b7b6b] shrink-0">
                                  {selectedMcId && selectedMc && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedMcModal(selectedMc);
                                      }}
                                      title="View MC Details"
                                      aria-label="View MC Info"
                                      className="w-6 h-6 rounded-full bg-[#fbf8f3] hover:bg-[#ebdcc9] text-[#7d654c] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer border border-[#d5c7b5]"
                                    >
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                      </svg>
                                    </button>
                                  )}
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`transition-transform duration-200 ${isMcDropdownOpen ? 'rotate-180 text-[#bd9661]' : ''}`}
                                  >
                                    <polyline points="6 9 12 15 18 9" />
                                  </svg>
                                </div>
                              </button>

                              {/* Dropdown Menu List with 'No MC' as First Option */}
                              {isMcDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#e8ded0] rounded-xl shadow-xl z-30 max-h-[260px] overflow-y-auto divide-y divide-[#f5f1eb]">
                                  {/* Option 1: No MC */}
                                  <div
                                    onClick={() => {
                                      setSelectedMcId('');
                                      setIsMcDropdownOpen(false);
                                      showToast('Proceeding without an MC', 'info');
                                    }}
                                    className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                                      !selectedMcId ? 'bg-[#fdfbf7]' : 'hover:bg-[#faf8f5]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="w-8 h-8 rounded-full bg-[#15110e] border border-[#bd9661] flex items-center justify-center text-xs shrink-0">
                                        🥂
                                      </div>
                                      <div className="min-w-0">
                                        <div className="font-serif font-bold text-xs text-[#15110e]">
                                          No MC
                                        </div>
                                        <div className="text-[10px] text-[#8b7b6b] truncate">
                                          Proceed without an MC and assign it later
                                        </div>
                                      </div>
                                    </div>

                                    {!selectedMcId ? (
                                      <span className="bg-[#15110e] text-[#dfc194] text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                        ✓ Picked
                                      </span>
                                    ) : (
                                      <span className="text-[11px] text-[#bd9661] hover:underline font-semibold shrink-0">
                                        Select →
                                      </span>
                                    )}
                                  </div>

                                  {/* Certified MCs */}
                                  {availableMcs.map((mc) => {
                                    const isSelected = selectedMcId === mc.id;
                                    return (
                                      <div
                                        key={mc.id}
                                        onClick={() => {
                                          setSelectedMcId(mc.id);
                                          setIsMcDropdownOpen(false);
                                          showToast(`Selected ${mc.name}!`, 'success');
                                        }}
                                        className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                                          isSelected ? 'bg-[#fdfbf7]' : 'hover:bg-[#faf8f5]'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <div className="w-8 h-8 rounded-full bg-[#15110e] border border-[#bd9661] flex items-center justify-center text-[#dfc194] font-serif font-bold text-[10px] shrink-0 overflow-hidden">
                                            {mc.image ? (
                                              <img src={mc.image} alt={mc.name} className="w-full h-full object-cover" />
                                            ) : (
                                              mc.name.split(' ').map((n: string) => n[0]).join('')
                                            )}
                                          </div>
                                          <div className="min-w-0">
                                            <div className="font-serif font-bold text-xs text-[#15110e] flex items-center gap-1">
                                              <span>{mc.name}</span>
                                              <span className="text-[9.5px] font-sans font-semibold text-[#bd9661]">
                                                ⭐ {mc.rating}
                                              </span>
                                            </div>
                                            <div className="text-[10px] text-[#8b7b6b] truncate">
                                              {mc.business} &bull; {mc.price > 0 ? `$${mc.price} AUD` : 'Included'}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedMcModal(mc);
                                            }}
                                            className="w-6 h-6 rounded-full bg-[#fbf8f3] hover:bg-[#ebdcc9] text-[#7d654c] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer border border-[#d5c7b5]"
                                            title="View details"
                                          >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                              <circle cx="12" cy="12" r="3" />
                                            </svg>
                                          </button>
                                          {isSelected ? (
                                            <span className="bg-[#15110e] text-[#dfc194] text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                              ✓ Picked
                                            </span>
                                          ) : (
                                            <span className="text-[11px] text-[#bd9661] hover:underline font-semibold shrink-0">
                                              Select →
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* DISTINCT STYLED AI CONCIERGE BANNER (ONLY IN CERTIFIED MC VIEW) */}
                          <div className="bg-gradient-to-r from-[#fbf6ed] to-[#f6ede0] border-l-4 border-l-[#bd9661] border-y border-r border-[#dfcfb9] rounded-xl p-3 flex items-center justify-between gap-2 shadow-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#bd9661] bg-[#181310] flex items-center justify-center shrink-0">
                                <img src="./chatbot-avatar.png" alt="Joey AI" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                                <span className="text-xs select-none">✨</span>
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-serif text-xs font-bold text-[#15110e] truncate">
                                  Need help deciding? Ask Joey AI
                                </h4>
                                <p className="text-[10px] text-[#786450] truncate">
                                  Chat live to compare host experience, reviews &amp; rates
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
                              className="px-2.5 py-1.5 bg-[#15110e] hover:bg-[#2b221a] text-[#dfc194] hover:text-white border border-[#bd9661]/40 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs whitespace-nowrap"
                            >
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                              <span>{isFloatingChatOpen ? 'Close Chat' : 'Open Chat'}</span>
                            </button>
                          </div>

                          </div>
                      ) : (
                        /* OPTION B: PREFER / BRING OWN MC */
                        <div className="bg-[#faf8f5] border border-[#ebdcc9] rounded-xl p-3 space-y-2.5 shadow-2xs">
                          <div className="border-b border-[#f0ede4] pb-1.5">
                            <h4 className="font-serif font-bold text-xs text-[#15110e]">
                              Couple's Preferred Wedding MC
                            </h4>
                            <p className="text-[10px] text-[#8b7b6b] mt-0.5">
                              Prefer to have your own friend, family member, or professional MC host your wedding? Enter their contact details below.
                            </p>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div>
                              <label className="block text-[9.5px] font-bold text-[#8b7b6b] uppercase mb-0.5">
                                MC Full Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={ownMcName}
                                onChange={(e) => setOwnMcName(e.target.value)}
                                placeholder="e.g. Anthony Rossi"
                                className="w-full bg-white border border-[#d5c7b5] rounded-lg p-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                              />
                            </div>

                            <div>
                              <label className="block text-[9.5px] font-bold text-[#8b7b6b] uppercase mb-0.5">
                                MC Mobile / Phone Number
                              </label>
                              <div className="flex">
                                <span className="inline-flex items-center px-2.5 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold text-[#6b5847] rounded-l-lg select-none">
                                  +61
                                </span>
                                <input
                                  type="tel"
                                  value={ownMcPhone}
                                  onChange={(e) => setOwnMcPhone(formatAuMobile(e.target.value))}
                                  placeholder="0412 888 777"
                                  className="w-full bg-white border border-[#d5c7b5] rounded-r-lg rounded-l-none p-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9.5px] font-bold text-[#8b7b6b] uppercase mb-0.5">
                                MC Email Address <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                required
                                value={ownMcEmail}
                                onChange={(e) => setOwnMcEmail(e.target.value)}
                                placeholder="e.g. anthony.rossi@mcservices.com.au"
                                className="w-full bg-white border border-[#d5c7b5] rounded-lg p-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                              />
                            </div>

                            <div>
                              <label className="block text-[9.5px] font-bold text-[#8b7b6b] uppercase mb-0.5">
                                Business / Agency Name (Optional)
                              </label>
                              <input
                                type="text"
                                value={ownMcAgency}
                                onChange={(e) => setOwnMcAgency(e.target.value)}
                                placeholder="e.g. Rossi Event Hosting"
                                className="w-full bg-white border border-[#d5c7b5] rounded-lg p-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation CTA Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setCoupleStep('payment')}
                          className="h-9 shrink-0 px-3 border border-[#d5c7b5] text-[#6b5847] hover:text-[#15110e] hover:bg-[#faf7f2] rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center"
                        >
                          ← Back to Plan
                        </button>
                        <button
                          type="button"
                          onClick={handleFinalizeCoupleRegistration}
                          disabled={isRegistering || (mcChoiceMode === 'own' && (!ownMcName.trim() || !ownMcEmail.trim()))}
                          className="h-9 flex-1 px-3 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1 disabled:opacity-50 text-center whitespace-nowrap"
                        >
                          <span>
                            {isRegistering
                              ? 'Launching...'
                              : mcChoiceMode === 'own'
                              ? 'Confirm & Launch →'
                              : !selectedMcId
                              ? 'Skip & Launch Dashboard →'
                              : 'Confirm & Launch →'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* MC MULTI-STEP REGISTRATION FORM (SAME TO SAME AS WEB REGISTER IN MOBILE VIEW) */
                <div className="space-y-3.5">
                  {/* 2-Step MC Wizard Breadcrumb */}
                  <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          mcRegStep === 'details'
                            ? 'bg-[#15110e] text-[#dfc194] ring-2 ring-[#bd9661]'
                            : 'bg-[#bd9661] text-[#15110e]'
                        }`}
                      >
                        {mcRegStep !== 'details' ? '✓' : '1'}
                      </div>
                      <span className={`text-[11px] font-semibold ${mcRegStep === 'details' ? 'text-[#15110e]' : 'text-[#8b7b6b]'}`}>
                        Host Profile
                      </span>
                    </div>

                    <div className="h-0.5 flex-1 bg-[#ebdcc9] mx-2">
                      <div
                        className="h-full bg-[#bd9661] transition-all duration-300"
                        style={{ width: mcRegStep === 'details' ? '0%' : '100%' }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          mcRegStep === 'plan_payment'
                            ? 'bg-[#15110e] text-[#dfc194] ring-2 ring-[#bd9661]'
                            : 'bg-[#ebdcc9] text-[#8b7b6b]'
                        }`}
                      >
                        2
                      </div>
                      <span className={`text-[11px] font-semibold ${mcRegStep === 'plan_payment' ? 'text-[#15110e]' : 'text-[#8b7b6b]'}`}>
                        SaaS Plan &amp; Pay
                      </span>
                    </div>
                  </div>

                  {mcRegStep === 'details' ? (
                    /* STEP 1: HOST DETAILS */
                    <form onSubmit={handleProceedToMcPlan} className="space-y-3.5">
                      <div>
                        <div className="text-[9px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-0.5">
                          STEP 1 OF 2 · PRO MC &amp; COORDINATOR ACCOUNT
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#15110e] leading-tight">
                          Register Certified MC Account
                        </h3>
                        <p className="text-[11px] text-[#8b7b6b] mt-0.5">
                          Manage multiple couple run sheets, client audio cues, and seamless wedding coordination.
                        </p>
                      </div>

                      {/* Business & Personal Details Card */}
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e8ded0] space-y-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] pb-1 border-b border-[#ebdcc9] flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#bd9661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Host Profile &amp; Business Information</span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Robert Galati"
                            value={mcName}
                            onChange={(e) => setMcName(e.target.value)}
                            className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                            Business Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Galati MC Services"
                            value={mcBusiness}
                            onChange={(e) => setMcBusiness(e.target.value)}
                            className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="robert@galatimc.com.au"
                            value={mcEmail}
                            onChange={(e) => setMcEmail(e.target.value)}
                            className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                            Australian Mobile *
                          </label>
                          <div className="flex rounded-lg overflow-hidden border border-[#d5c7b5] focus-within:border-[#bd9661] bg-white">
                            <span className="inline-flex items-center px-2.5 bg-[#f5ede2] text-xs font-bold text-[#6b5847] border-r border-[#e2d8cb] select-none">
                              +61
                            </span>
                            <input
                              type="tel"
                              required
                              placeholder="0412 345 678"
                              value={mcMobile}
                              onChange={(e) => setMcMobile(formatAuMobile(e.target.value))}
                              className="w-full px-2.5 py-1.5 text-xs text-[#15110e] outline-none bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4a3b2c]">
                              Australian Business Number (ABN)
                            </label>
                            <span className="text-[9.5px] text-[#8b7b6b]">(Optional)</span>
                          </div>
                          <input
                            type="text"
                            placeholder="12 345 678 901"
                            value={mcAbn}
                            onChange={(e) => setMcAbn(e.target.value)}
                            className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
                          />
                        </div>
                      </div>

                      {/* Password & Security Card */}
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e8ded0] space-y-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] pb-1 border-b border-[#ebdcc9] flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#bd9661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>Account Security</span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                            Password *
                          </label>
                          <div className="relative">
                            <input
                              type={mcShowPwd ? 'text' : 'password'}
                              required
                              placeholder="Create password"
                              value={mcPassword}
                              onChange={(e) => setMcPassword(e.target.value)}
                              className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2.5 py-1.5 pr-10 text-xs text-[#15110e] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setMcShowPwd(!mcShowPwd)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7b6b] hover:text-[#15110e] cursor-pointer"
                            >
                              {mcShowPwd ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          <div className="w-full bg-[#e8ded0] h-1 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="h-full transition-all duration-300"
                              style={{ width: `${(strengthScore / 4) * 100}%`, backgroundColor: strengthColor }}
                            />
                          </div>
                          <div className="text-[9.5px] text-[#8b7b6b] mt-0.5">{strengthLabel}</div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <input
                              type={mcShowConfirm ? 'text' : 'password'}
                              required
                              placeholder="Re-enter password"
                              value={mcConfirmPassword}
                              onChange={(e) => setMcConfirmPassword(e.target.value)}
                              className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2.5 py-1.5 pr-10 text-xs text-[#15110e] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setMcShowConfirm(!mcShowConfirm)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7b6b] hover:text-[#15110e] cursor-pointer"
                            >
                              {mcShowConfirm ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {mcConfirmPassword && (
                            <div className={`text-[10px] mt-0.5 font-semibold ${passwordsMatch ? 'text-emerald-700' : 'text-rose-600'}`}>
                              {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Terms */}
                      <label className="flex items-start gap-2 text-[11px] text-[#6b5847] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 rounded text-[#bd9661] focus:ring-[#bd9661]"
                        />
                        <span>
                          I agree to the <span className="text-[#bd9661] underline font-semibold">Terms of Service</span> and <span className="text-[#bd9661] underline font-semibold">Privacy Policy</span>
                        </span>
                      </label>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>Proceed to Choose MC Plan &amp; Billing</span>
                        <span>→</span>
                      </button>
                    </form>
                  ) : (
                    /* STEP 2: MC PLAN SELECTION & STRIPE BILLING */
                    <form onSubmit={handleFinalizeMcRegistration} className="space-y-3.5">
                      <div>
                        <div className="text-[9px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-0.5">
                          STEP 2 OF 2 · MC SAAS PLAN &amp; STRIPE BILLING
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#15110e] leading-tight">
                          Select Your MC Subscription Plan
                        </h3>
                        <p className="text-[11px] text-[#8b7b6b] mt-0.5">
                          Choose a base tier to manage private weddings or a certified paid tier to be listed and booked on the Tap &amp; Toast platform.
                        </p>
                      </div>

                      {/* Plan Selection Cards with Accordion Chevron Dropdown */}
                      <div className="space-y-2">
                        {MC_PLANS.map((plan) => {
                          const isSelected = selectedMcPlanId === plan.id;
                          const isExpanded = expandedMcPlanId === plan.id;

                          return (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedMcPlanId(plan.id)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#bd9661] bg-[#fdfbf7] shadow-xs ring-1 ring-[#bd9661]'
                                  : 'border-[#e8ded0] bg-white hover:border-[#d5c7b5]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="mobileMcPlanChoice"
                                    checked={isSelected}
                                    onChange={() => setSelectedMcPlanId(plan.id)}
                                    className="text-[#bd9661] focus:ring-[#bd9661] cursor-pointer"
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-serif text-xs font-bold text-[#15110e]">
                                        {plan.name}
                                      </span>
                                      {plan.badge && (
                                        <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                                          plan.price === 0
                                            ? 'bg-[#f0ebe3] text-[#5c4a3b]'
                                            : 'bg-[#bd9661]/15 text-[#8b6528] border border-[#bd9661]/30'
                                        }`}>
                                          {plan.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-[#8b7b6b] mt-0.5">
                                      {plan.tagline}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <div className="text-right">
                                    <div className="font-serif text-xs font-bold text-[#15110e]">
                                      ${plan.price}
                                    </div>
                                    <div className="text-[8.5px] text-[#8b7b6b] uppercase">
                                      {plan.price === 0 ? 'Free' : 'AUD / mo'}
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedMcPlanId(isExpanded ? null : plan.id);
                                    }}
                                    className="p-1 rounded text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#f0ebe3] cursor-pointer"
                                    title={isExpanded ? 'Collapse features' : 'Expand features'}
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                    >
                                      <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              {/* Accordion Expandable Features */}
                              {isExpanded && (
                                <div className="mt-2 pt-2 border-t border-[#f0ede6]">
                                  <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                                    Plan Features:
                                  </div>
                                  <ul className="space-y-1 text-[10.5px] text-[#524438]">
                                    {plan.features.map((feat, fIdx) => (
                                      <li key={fIdx} className="flex items-center gap-1.5">
                                        <span className="text-[#bd9661] font-bold text-xs">✓</span>
                                        <span>{feat}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Paid Plan Stripe Payment Simulation */}
                      {selectedMcPlanId !== 'mc_base' && (
                        <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-[#ebdcc9]">
                            <span className="text-[10px] font-bold uppercase text-[#8b7b6b]">Stripe Secure Payment</span>
                            <button
                              type="button"
                              onClick={() => {
                                setMcCardNumber('4242 •••• •••• 4242');
                                setMcCardName(mcName || 'Robert Galati');
                                setMcCardExpiry('12/28');
                                setMcCardCvc('888');
                                showToast('Test card filled', 'info');
                              }}
                              className="text-[9.5px] text-[#bd9661] font-bold hover:underline cursor-pointer"
                            >
                              Use Test Card
                            </button>
                          </div>

                          <div>
                            <label className="block text-[9.5px] font-bold uppercase text-[#8b7b6b] mb-0.5">Cardholder Name</label>
                            <input
                              type="text"
                              required
                              value={mcCardName}
                              onChange={(e) => setMcCardName(e.target.value)}
                              placeholder="Name on card"
                              className="w-full bg-white border border-[#d5c7b5] rounded-md px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[9.5px] font-bold uppercase text-[#8b7b6b] mb-0.5">Card Number</label>
                            <input
                              type="text"
                              required
                              value={mcCardNumber}
                              onChange={(e) => setMcCardNumber(e.target.value)}
                              placeholder="4242 •••• •••• 4242"
                              className="w-full bg-white border border-[#d5c7b5] rounded-md px-2.5 py-1.5 text-xs text-[#15110e] outline-none font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9.5px] font-bold uppercase text-[#8b7b6b] mb-0.5">Expiry Date</label>
                              <input
                                type="text"
                                required
                                value={mcCardExpiry}
                                onChange={(e) => setMcCardExpiry(e.target.value)}
                                placeholder="MM/YY"
                                className="w-full bg-white border border-[#d5c7b5] rounded-md px-2.5 py-1.5 text-xs text-[#15110e] outline-none font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9.5px] font-bold uppercase text-[#8b7b6b] mb-0.5">CVC / CVV</label>
                              <input
                                type="text"
                                required
                                value={mcCardCvc}
                                onChange={(e) => setMcCardCvc(e.target.value)}
                                placeholder="123"
                                className="w-full bg-white border border-[#d5c7b5] rounded-md px-2.5 py-1.5 text-xs text-[#15110e] outline-none font-mono"
                              />
                            </div>
                          </div>

                          {/* Promo Code Input */}
                          <div className="pt-0.5">
                            <label className="block text-[9.5px] font-bold uppercase text-[#8b7b6b] mb-0.5">Promo Code</label>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={mcPromoCode}
                                onChange={(e) => setMcPromoCode(e.target.value)}
                                placeholder="e.g. WELCOME10"
                                className="flex-1 bg-white border border-[#d5c7b5] rounded-md px-2 py-1 text-xs uppercase outline-none focus:border-[#bd9661]"
                              />
                              <button
                                type="button"
                                onClick={handleApplyMcPromo}
                                className="bg-[#15110e] text-[#dfc194] px-2.5 py-1 rounded-md text-[11px] font-bold hover:bg-[#2b221a] cursor-pointer whitespace-nowrap"
                              >
                                Apply
                              </button>
                            </div>
                          </div>

                          {/* Price Breakdown */}
                          <div className="bg-white p-2 rounded-lg border border-[#ebdcc9] text-[11px] space-y-1">
                            {(() => {
                              const plan = MC_PLANS.find(p => p.id === selectedMcPlanId) || MC_PLANS[1];
                              const discount = Math.round((plan.price * mcDiscountPercent) / 100);
                              const finalPrice = Math.max(0, plan.price - discount);
                              return (
                                <>
                                  <div className="flex justify-between text-[#8b7b6b]">
                                    <span>{plan.name}</span>
                                    <span>${plan.price}.00 AUD</span>
                                  </div>
                                  {mcDiscountPercent > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-semibold">
                                      <span>Promo Discount ({mcDiscountPercent}%)</span>
                                      <span>-${discount}.00 AUD</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-[#8b7b6b]">
                                    <span>Australian GST (10%)</span>
                                    <span>Included</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-bold text-[#15110e] pt-1 border-t border-[#f0ede6]">
                                    <span>Total Due Today:</span>
                                    <span className="text-[#bd9661] font-serif">${finalPrice}.00 AUD</span>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setMcRegStep('details')}
                          className="h-9 shrink-0 px-3 border border-[#d5c7b5] text-[#6b5847] hover:text-[#15110e] hover:bg-[#faf7f2] rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center"
                        >
                          ← Back to Details
                        </button>
                        <button
                          type="submit"
                          disabled={isRegistering}
                          className="h-9 flex-1 px-3 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-1 whitespace-nowrap"
                        >
                          <span>
                            {isRegistering
                              ? 'Activating...'
                              : selectedMcPlanId === 'mc_base'
                              ? 'Activate Free Tier →'
                              : 'Pay & Launch →'}
                          </span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Bottom Switch Link (Only on Step 1 for couple and MC) */}
              {(regAccountType === 'couple' ? coupleStep === 'registration' : mcRegStep === 'details') && (
                <div className="text-center text-xs text-[#8b7b6b] pt-2">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveMode('signin')}
                    className="text-[#bd9661] font-bold hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

                {/* ============================================================== */}
        {/* FLOATING POP-UP CHATBOT WINDOW FOR JOEY AI (MATCHING WEB REGISTRATION POP-UP) */}
        {/* ============================================================== */}
        {isFloatingChatOpen && (
          <div className="absolute inset-x-3 bottom-3 z-40 bg-white rounded-2xl border-2 border-[#bd9661] shadow-[0_16px_48px_rgba(21,17,14,0.35)] overflow-hidden flex flex-col max-h-[440px] animate-in fade-in slide-in-from-bottom-4">
            {/* Pop-up Header */}
            <div className="bg-[#15110e] text-white px-3.5 py-2.5 flex items-center justify-between border-b border-[#29211a] flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-serif text-xs font-bold text-[#dfc194]">
                  Joey AI MC Matchmaker
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsFloatingChatOpen(false)}
                className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                title="Close Chat"
              >
                ✕
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="p-3 overflow-y-auto space-y-2.5 flex-1 bg-[#faf8f5] text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'couple'
                      ? 'bg-[#15110e] text-[#dfc194] ml-6 shadow-xs'
                      : 'bg-white text-[#15110e] border border-[#ebdcc9] mr-6 shadow-2xs'
                  }`}
                >
                  <div className="font-semibold text-[9px] uppercase tracking-wider mb-1 opacity-70">
                    {msg.sender === 'couple' ? 'You' : 'Joey AI'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              ))}
              {isChatTyping && (
                <div className="bg-white text-[#8b7b6b] text-[10.5px] p-2 rounded-lg border border-[#ebdcc9] inline-block animate-pulse">
                  Joey is typing...
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 pt-2 pb-1 bg-white border-t border-[#f0ede6] flex gap-1.5 flex-wrap flex-shrink-0">
              <button
                type="button"
                onClick={() => handleSendChatMessage('Who is free on my date?')}
                className="text-[9.5px] font-semibold bg-[#faf8f5] hover:bg-[#ede6da] text-[#6b5847] border border-[#d5c7b5] px-2 py-0.5 rounded-full cursor-pointer transition-colors"
              >
                📅 Who is free?
              </button>
              <button
                type="button"
                onClick={() => handleSendChatMessage('Who has 5.0 stars?')}
                className="text-[9.5px] font-semibold bg-[#faf8f5] hover:bg-[#ede6da] text-[#6b5847] border border-[#d5c7b5] px-2 py-0.5 rounded-full cursor-pointer transition-colors"
              >
                ⭐ 5.0 Stars
              </button>
              <button
                type="button"
                onClick={() => handleSendChatMessage('Which MC is under $1,800?')}
                className="text-[9.5px] font-semibold bg-[#faf8f5] hover:bg-[#ede6da] text-[#6b5847] border border-[#d5c7b5] px-2 py-0.5 rounded-full cursor-pointer transition-colors"
              >
                💰 Under $1,800
              </button>
            </div>

            {/* Input Form */}
            <div className="p-2.5 bg-white border-t border-[#f0ede6] flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendChatMessage();
                  }
                }}
                placeholder="Ask about MC experience, rating, cost..."
                className="flex-1 bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
              />
              <button
                type="button"
                onClick={() => handleSendChatMessage()}
                className="bg-[#15110e] text-[#dfc194] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* MODAL: MC PROFILE EYE-VIEW POP-UP                              */}
        {/* ============================================================== */}
        {selectedMcModal && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setSelectedMcModal(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-xs w-full shadow-2xl border border-[#e8ded0] p-4 space-y-3 max-h-[82vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#15110e] border border-[#bd9661] flex items-center justify-center text-[#dfc194] font-bold text-xs overflow-hidden">
                    {selectedMcModal.image ? (
                      <img src={selectedMcModal.image} alt={selectedMcModal.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#15110e]">
                      {selectedMcModal.name}
                    </h3>
                    <div className="text-[10px] text-[#8b7b6b]">
                      {selectedMcModal.business}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMcModal(null)}
                  className="text-gray-400 hover:text-black font-bold text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-[#faf8f5] p-2 rounded-lg border border-[#ebdcc9] flex justify-between items-center">
                  <span className="text-[#8b7b6b] text-[10.5px]">Hosting Fee:</span>
                  <span className="font-bold text-[#15110e]">
                    {selectedMcModal.price > 0 ? `$${selectedMcModal.price} AUD` : 'Included ($0)'}
                  </span>
                </div>
                <div className="bg-[#faf8f5] p-2 rounded-lg border border-[#ebdcc9] flex justify-between items-center">
                  <span className="text-[#8b7b6b] text-[10.5px]">Experience:</span>
                  <span className="font-semibold text-[#15110e] text-[10.5px]">
                    {selectedMcModal.experience}
                  </span>
                </div>
                <div className="bg-[#faf8f5] p-2 rounded-lg border border-[#ebdcc9] flex justify-between items-center">
                  <span className="text-[#8b7b6b] text-[10.5px]">Rating:</span>
                  <span className="font-bold text-[#bd9661]">
                    ⭐ {selectedMcModal.rating} ({selectedMcModal.reviews} reviews)
                  </span>
                </div>
                <div className="bg-[#faf8f5] p-2 rounded-lg border border-[#ebdcc9]">
                  <span className="text-[#8b7b6b] text-[10.5px] block mb-0.5">Presentation Style:</span>
                  <p className="text-[11px] text-[#15110e] leading-snug">
                    {selectedMcModal.vibe}
                  </p>
                </div>
                <div className="bg-[#faf8f5] p-2 rounded-lg border border-[#ebdcc9]">
                  <span className="text-[#8b7b6b] text-[10.5px] block mb-0.5">Specialty &amp; AV Pacing:</span>
                  <p className="text-[11px] text-[#15110e] leading-snug">
                    {selectedMcModal.specialty}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedMcId(selectedMcModal.id);
                  setSelectedMcModal(null);
                  showToast(`Selected ${selectedMcModal.name}!`, 'success');
                }}
                className="w-full bg-[#15110e] text-[#dfc194] hover:text-white font-bold py-2 rounded-lg text-xs cursor-pointer shadow-xs"
              >
                Select {selectedMcModal.name}
              </button>
            </div>
          </div>
        )}

        {/* Phone Bottom Home Bar */}
        <div className="py-2 flex justify-center bg-[#f8f6f2] flex-shrink-0 border-t border-[#ebdcc9]/50">
          <div className="w-32 h-1 bg-[#15110e]/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
