import React, { useState, useMemo, useEffect } from 'react';
import { useAppState, useSession, showToast, logAudit, setStoredSession } from '../lib/state';

interface SrMobileViewProps {
  onSelectView?: (view: string) => void;
}

export default function SrMobileView({ onSelectView }: SrMobileViewProps) {
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

  // Sign in submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      let sessionName = 'Robert Galati';
      let weddingId: string | undefined = undefined;

      if (loginRole === 'superadmin') {
        sessionName = 'Platform Admin';
      } else if (loginRole === 'couple') {
        const found = state.users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
        sessionName = found ? found.name : 'Sophie & James';
        weddingId = found?.weddingId || 'w1';
      } else {
        sessionName = 'Robert Galati';
      }

      const newSession = {
        role: loginRole,
        email: loginEmail,
        name: sessionName,
        weddingId,
        keepSignedIn: loginRemember,
      };

      setStoredSession(newSession);
      setSession(newSession);
      logAudit(state, setState, 'User Login (Mobile)', sessionName, loginRole, `Logged in via S/R Mobile as ${loginRole}`, 'Security');
      showToast(`Welcome back, ${sessionName}!`, 'success');

      if (onSelectView) {
        if (loginRole === 'superadmin') onSelectView('superadmin');
        else if (loginRole === 'couple') onSelectView('couple');
        else onSelectView('mc');
      }
    }, 400);
  };

  // ==========================================
  // REGISTER STATE
  // ==========================================
  const [regAccountType, setRegAccountType] = useState<'couple' | 'mc'>('couple');

  // MC fields
  const [mcName, setMcName] = useState('');
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
      image: '/chatbot-avatar.png',
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
      image: '/chatbot-avatar.png',
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
      image: '/chatbot-avatar.png',
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
  const [selectedMcId, setSelectedMcId] = useState<string>('mc_robert');
  const [selectedMcModal, setSelectedMcModal] = useState<any | null>(null);

  // Auto-sync selectedMcId if chosen MC is not available on date
  useEffect(() => {
    if (availableMcs.length > 0 && !availableMcs.some(m => m.id === selectedMcId)) {
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

  // Registration submit: MC
  const handleRegisterMC = (e: React.FormEvent) => {
    e.preventDefault();
    if (mcPassword !== mcConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to terms', 'error');
      return;
    }
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
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
      logAudit(state, setState, 'MC Registration (Mobile)', newMcUser.name, 'mc', 'New MC registered via S/R Mobile', 'Security');
      showToast(`Welcome to Tap & Toast, ${newMcUser.name}!`, 'success');
      if (onSelectView) onSelectView('mc');
    }, 450);
  };

  // Couple Wizard Handlers
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weddingDate) {
      setWeddingDateError(true);
      showToast('Wedding Date is compulsory. Please choose your wedding date to proceed.', 'error');
      return;
    }
    if (couplePassword !== coupleConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to terms', 'error');
      return;
    }
    setWeddingDateError(false);
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
              <span>🔑</span> Sign In
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
              <span>📝</span> Register
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
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  Select Login Portal
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#ede6da] rounded-xl border border-[#dfd4c3]">
                  {(['mc', 'couple', 'superadmin'] as const).map((r) => {
                    const label = r === 'mc' ? 'MC / Pro' : r === 'couple' ? 'Couple' : 'Super Admin';
                    const active = loginRole === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setLoginRole(r);
                          if (r === 'mc') setLoginEmail('robert@galati.demo');
                          else if (r === 'couple') setLoginEmail('sophie@demo.test');
                          else setLoginEmail('admin@tapandtoast.demo');
                        }}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                          active
                            ? 'bg-white text-[#15110e] shadow-xs border border-[#bd9661]'
                            : 'text-[#6b5847] hover:text-[#15110e]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Header */}
              <div>
                <h2 className="font-serif text-xl font-bold text-[#15110e]">
                  Sign in to your {loginRole === 'mc' ? 'MC / Pro' : loginRole === 'couple' ? 'Couple' : 'Super Admin'} account
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#bd9661] font-semibold hover:underline cursor-pointer"
                    >
                      {loginShowPwd ? 'Hide' : 'Show'}
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
            /* MODE 2: MOBILE REGISTER                                     */
            /* ========================================================== */
            <div className="space-y-4">
              {/* Account Type Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  Select Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegAccountType('couple')}
                    className={`py-2 px-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      regAccountType === 'couple'
                        ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                        : 'bg-white border border-[#d5c7b5] text-[#6b5847] hover:text-[#15110e]'
                    }`}
                  >
                    <span>👰🤵</span> Couple Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegAccountType('mc')}
                    className={`py-2 px-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      regAccountType === 'mc'
                        ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                        : 'bg-white border border-[#d5c7b5] text-[#6b5847] hover:text-[#15110e]'
                    }`}
                  >
                    <span>🎙️</span> MC / Planner
                  </button>
                </div>
              </div>

              {regAccountType === 'couple' ? (
                <div className="space-y-3.5">
                  {/* 3-Step Couple Wizard Breadcrumb */}
                  <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2 flex items-center justify-between text-[10px]">
                    <div className={`flex items-center gap-1 font-bold ${
                      coupleStep === 'registration' ? 'text-[#bd9661]' : 'text-[#8b7b6b]'
                    }`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                        coupleStep === 'registration' ? 'bg-[#15110e] text-[#dfc194]' : 'bg-[#e8ded0] text-[#15110e]'
                      }`}>
                        1
                      </span>
                      <span>Details</span>
                    </div>
                    <span className="text-[#d5c7b5]">→</span>
                    <div className={`flex items-center gap-1 font-bold ${
                      coupleStep === 'payment' ? 'text-[#bd9661]' : 'text-[#8b7b6b]'
                    }`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                        coupleStep === 'payment' ? 'bg-[#15110e] text-[#dfc194]' : 'bg-[#e8ded0] text-[#15110e]'
                      }`}>
                        2
                      </span>
                      <span>Plan &amp; Pay</span>
                    </div>
                    <span className="text-[#d5c7b5]">→</span>
                    <div className={`flex items-center gap-1 font-bold ${
                      coupleStep === 'mc' ? 'text-[#bd9661]' : 'text-[#8b7b6b]'
                    }`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                        coupleStep === 'mc' ? 'bg-[#15110e] text-[#dfc194]' : 'bg-[#e8ded0] text-[#15110e]'
                      }`}>
                        3
                      </span>
                      <span>Select MC</span>
                    </div>
                  </div>

                  {coupleStep === 'registration' ? (
                    /* STEP 1: COUPLE REGISTRATION DETAILS */
                    <form noValidate onSubmit={handleProceedToPayment} className="space-y-3.5">
                      {/* Groom Section */}
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                        <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-[#ebdcc9]">
                          <span>🤵</span> Groom Details
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                            Groom Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={groomName}
                            onChange={(e) => setGroomName(e.target.value)}
                            placeholder="James Wilson"
                            className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                            Groom Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={groomEmail}
                            onChange={(e) => setGroomEmail(e.target.value)}
                            placeholder="james@example.com"
                            className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                            Groom Contact Number *
                          </label>
                          <div className="flex">
                            <span className="inline-flex items-center px-2.5 py-1.5 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold text-[#6b5847] rounded-l-lg select-none">
                              +61
                            </span>
                            <input
                              type="tel"
                              required
                              value={groomMobile}
                              onChange={(e) => setGroomMobile(formatAuMobile(e.target.value))}
                              placeholder="0412 345 678"
                              className="w-full bg-white border border-[#d5c7b5] rounded-r-lg rounded-l-none px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bride Section */}
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                        <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-[#ebdcc9]">
                          <span>👰</span> Bride Details
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                            Bride Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={brideName}
                            onChange={(e) => setBrideName(e.target.value)}
                            placeholder="Sophie Carter"
                            className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                            Bride Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={brideEmail}
                            onChange={(e) => setBrideEmail(e.target.value)}
                            placeholder="sophie@example.com"
                            className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                            Bride Contact Number *
                          </label>
                          <div className="flex">
                            <span className="inline-flex items-center px-2.5 py-1.5 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold text-[#6b5847] rounded-l-lg select-none">
                              +61
                            </span>
                            <input
                              type="tel"
                              required
                              value={brideMobile}
                              onChange={(e) => setBrideMobile(formatAuMobile(e.target.value))}
                              placeholder="0423 456 789"
                              className="w-full bg-white border border-[#d5c7b5] rounded-r-lg rounded-l-none px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Wedding & Celebration Details */}
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                        <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center justify-between pb-1 border-b border-[#ebdcc9]">
                          <span className="flex items-center gap-1">💒 Wedding &amp; Venue</span>
                          <span className="text-[9.5px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            Date Compulsory
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[10px] font-bold uppercase text-[#8b7b6b]">
                                Date *
                              </label>
                            </div>
                            <input
                              type="date"
                              required
                              value={weddingDate}
                              onChange={(e) => {
                                setWeddingDate(e.target.value);
                                if (e.target.value) setWeddingDateError(false);
                              }}
                              className={`w-full bg-white border ${
                                weddingDateError
                                  ? 'border-rose-400 ring-1 ring-rose-200'
                                  : 'border-[#d5c7b5] focus:border-[#bd9661]'
                              } rounded-lg px-2 py-1.5 text-xs text-[#15110e] outline-none font-semibold`}
                            />
                            {weddingDateError && (
                              <p className="text-[9px] text-rose-600 font-semibold mt-0.5">
                                ✕ Wedding Date is compulsory.
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                              Guests (Adults/Kids) *
                            </label>
                            <input
                              type="number"
                              required
                              min={1}
                              value={guestCount}
                              onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                              className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] font-bold"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                            Ceremony &amp; Reception Venue <span className="font-normal lowercase">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            placeholder="e.g. Fernwood Estate, Hunter Valley"
                            className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                          />
                        </div>
                      </div>

                      {/* Password & Security */}
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                        <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-[#ebdcc9]">
                          <span>🔒</span> Account Password
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                            Password *
                          </label>
                          <div className="relative">
                            <input
                              type={coupleShowPwd ? 'text' : 'password'}
                              required
                              value={couplePassword}
                              onChange={(e) => setCouplePassword(e.target.value)}
                              placeholder="Create password"
                              className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 pr-12 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                            />
                            <button
                              type="button"
                              onClick={() => setCoupleShowPwd(!coupleShowPwd)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#bd9661] font-bold"
                            >
                              {coupleShowPwd ? 'Hide' : 'Show'}
                            </button>
                          </div>
                          <div className="w-full bg-[#e8ded0] h-1 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="h-full transition-all duration-300"
                              style={{
                                width: `${(strengthScore / 4) * 100}%`,
                                backgroundColor: strengthColor,
                              }}
                            />
                          </div>
                          <div className="text-[10px] text-[#8b7b6b] mt-0.5">{strengthLabel}</div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                            Confirm Password *
                          </label>
                          <input
                            type={coupleShowPwd ? 'text' : 'password'}
                            required
                            value={coupleConfirmPassword}
                            onChange={(e) => setCoupleConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                          />
                          {coupleConfirmPassword && (
                            <div
                              className={`text-[10px] mt-0.5 font-semibold ${
                                couplePassword === coupleConfirmPassword ? 'text-emerald-600' : 'text-red-500'
                              }`}
                            >
                              {couplePassword === coupleConfirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Terms */}
                      <label className="flex items-start gap-2 text-[11px] text-[#8b7b6b] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 rounded text-[#bd9661]"
                        />
                        <span>I agree to the Terms of Service &amp; Privacy Policy</span>
                      </label>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm"
                      >
                        Proceed to Select Plan →
                      </button>
                    </form>
                  ) : coupleStep === 'payment' ? (
                    /* STEP 2: COUPLE SUBSCRIPTION & STRIPE PAYMENT SIMULATION */
                    <form noValidate onSubmit={handleProceedToMc} className="space-y-3.5">
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-[#bd9661]">
                          STEP 2 &bull; COUPLE SUBSCRIPTION
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#15110e]">
                          Choose Couple Plan
                        </h3>
                        <p className="text-[11px] text-[#8b7b6b] mt-0.5">
                          Tap &amp; Toast is centered around the Couple. MC collaboration is included in your suite.
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

                      {/* Dropdown Accordion Plans List */}
                      <div className="space-y-2">
                        {SUBSCRIPTION_PLANS.map((plan) => {
                          const isSelected = selectedPlanId === plan.id;
                          const isExpanded = expandedPlanId === plan.id;
                          const planPrice = billingCycle === 'onetime' ? plan.price : plan.monthlyPrice;

                          return (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedPlanId(plan.id)}
                              className={`border-2 rounded-xl p-3 transition-all cursor-pointer bg-white ${
                                isSelected
                                  ? 'border-[#bd9661] shadow-xs ring-1 ring-[#bd9661]/25'
                                  : 'border-[#e8ded0] hover:border-[#bd9661]/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="mobileSubscriptionPlan"
                                    checked={isSelected}
                                    onChange={() => setSelectedPlanId(plan.id)}
                                    className="text-[#bd9661]"
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-serif text-xs font-bold text-[#15110e]">
                                        {plan.name}
                                      </span>
                                      {plan.badge && (
                                        <span className="text-[8px] font-black uppercase bg-[#15110e] text-[#dfc194] px-1.5 py-0.2 rounded">
                                          {plan.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="font-mono text-xs font-bold text-[#bd9661] mt-0.5">
                                      ${planPrice} AUD <span className="text-[10px] font-normal text-[#8b7b6b]">/{billingCycle === 'onetime' ? 'wedding' : 'mo'}</span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedPlanId(isExpanded ? null : plan.id);
                                  }}
                                  className="text-xs text-[#8b7b6b] hover:text-[#15110e] p-1 cursor-pointer font-bold"
                                  title={isExpanded ? 'Collapse features' : 'Expand features'}
                                >
                                  {isExpanded ? '▲' : '▼'}
                                </button>
                              </div>

                              {/* Accordion Expandable Features */}
                              {isExpanded && (
                                <div className="mt-2 pt-2 border-t border-[#f0ede6] space-y-1 text-[11px] text-[#544332]">
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
                        <div className="flex items-center justify-between">
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
                            className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
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
                            className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9.5px] font-bold uppercase text-[#8b7b6b] mb-0.5">
                              Expiry
                            </label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="12/28"
                              className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none font-mono"
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
                              className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none font-mono"
                            />
                          </div>
                        </div>

                        {/* Price Total */}
                        <div className="pt-2 border-t border-[#ebdcc9] flex justify-between items-center text-xs font-bold text-[#15110e]">
                          <span>Total Due (incl. GST):</span>
                          <span className="font-serif text-sm font-bold text-[#bd9661]">
                            ${finalPrice}.00 AUD
                          </span>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setCoupleStep('registration')}
                          className="px-3 py-2 bg-[#f0ede4] hover:bg-[#e5ded2] text-[#15110e] font-bold text-xs rounded-lg cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          disabled={isRegistering}
                          className="flex-1 py-2 px-3 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm text-center"
                        >
                          {isRegistering ? 'Processing...' : `Pay $${finalPrice} & Select MC →`}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* STEP 3: SELECTING MC & JOEY CONCIERGE (DATE-FILTERED) */
                    <div className="space-y-3.5">
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-[#bd9661]">
                          STEP 3 &bull; CERTIFIED MC SELECTION
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#15110e]">
                          Select Certified MC
                        </h3>
                        <p className="text-[11px] text-[#8b7b6b] mt-0.5">
                          Chat with Joey AI to compare and audit reception preferences.
                        </p>
                      </div>

                      {/* MC Cards with Photo, Name, Service, Rating, Eye-View Pop-up */}
                      <div className="space-y-2">
                        {availableMcs.map((mc) => {
                          const isSelected = selectedMcId === mc.id;

                          return (
                            <div
                              key={mc.id}
                              onClick={() => setSelectedMcId(mc.id)}
                              className={`bg-white border-2 rounded-xl p-2.5 transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'border-[#bd9661] shadow-xs ring-1 ring-[#bd9661]/25'
                                  : 'border-[#e8ded0] hover:border-[#bd9661]/50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-[#15110e] border border-[#bd9661] flex items-center justify-center text-[#dfc194] font-bold text-xs shrink-0 overflow-hidden">
                                  {mc.image ? (
                                    <img src={mc.image} alt={mc.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span>🎤</span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-serif text-xs font-bold text-[#15110e] truncate">
                                    {mc.name}
                                  </div>
                                  <div className="text-[10px] text-[#8b7b6b] truncate">
                                    {mc.business}
                                  </div>
                                  <div className="text-[10px] font-bold text-[#bd9661] flex items-center gap-1">
                                    <span>⭐ {mc.rating}</span>
                                    {mc.reviews > 0 && <span className="text-[9px] text-[#8b7b6b]">({mc.reviews})</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Eye View Pop-up Button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMcModal(mc);
                                  }}
                                  className="w-7 h-7 rounded-lg bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] border border-[#d5c7b5] flex items-center justify-center text-xs cursor-pointer"
                                  title={`View details for ${mc.name}`}
                                >
                                  👁️
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedMcId(mc.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors ${
                                    isSelected
                                      ? 'bg-[#15110e] text-[#dfc194]'
                                      : 'bg-[#faf8f5] text-[#15110e] border border-[#d5c7b5]'
                                  }`}
                                >
                                  {isSelected ? '✓ Picked' : 'Select'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Joey AI Concierge Chatbot */}
                      <div className="bg-white border border-[#e8ded0] rounded-2xl overflow-hidden shadow-2xs">
                        <div className="px-3 py-2 bg-[#15110e] text-white flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">🤖</span>
                            <span className="font-serif text-xs font-bold">Joey AI MC Concierge</span>
                          </div>
                          <span className="text-[9px] text-[#bd9661] uppercase font-bold tracking-wider">
                            MC Questions Only
                          </span>
                        </div>

                        {/* Chat Messages */}
                        <div className="p-2.5 max-h-36 overflow-y-auto space-y-2 bg-[#fbf9f5] text-[11px]">
                          {chatMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.sender === 'couple' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[85%] p-2 rounded-xl whitespace-pre-line ${
                                  msg.sender === 'couple'
                                    ? 'bg-[#15110e] text-[#dfc194]'
                                    : 'bg-white text-[#15110e] border border-[#ebdcc9] shadow-2xs'
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          ))}
                          {isChatTyping && (
                            <div className="text-[10px] text-[#8b7b6b] italic">
                              Joey is thinking...
                            </div>
                          )}
                        </div>

                        {/* Quick Prompts */}
                        <div className="px-2 py-1 bg-white border-t border-[#f0ede6] flex gap-1 overflow-x-auto no-scrollbar">
                          {[
                            'Who is available?',
                            'Who has 5.0 stars?',
                            'Most experienced?',
                            'Under $1,800?',
                          ].map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => handleSendChatMessage(chip)}
                              className="text-[9.5px] bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] border border-[#ebdcc9] rounded-full px-2 py-0.5 whitespace-nowrap cursor-pointer shrink-0 font-medium"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>

                        {/* Chat Input */}
                        <div className="p-2 bg-white border-t border-[#f0ede6] flex gap-1.5">
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
                            className="flex-1 bg-[#faf8f5] border border-[#d5c7b5] rounded-lg px-2.5 py-1 text-[11px] text-[#15110e] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSendChatMessage()}
                            className="bg-[#15110e] text-[#dfc194] px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            Send
                          </button>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setCoupleStep('payment')}
                          className="px-3 py-2 bg-[#f0ede4] hover:bg-[#e5ded2] text-[#15110e] font-bold text-xs rounded-lg cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={handleFinalizeCoupleRegistration}
                          disabled={isRegistering}
                          className="flex-1 py-2.5 px-3 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm text-center"
                        >
                          {isRegistering ? 'Launching Workspace...' : 'Complete & Launch Dashboard →'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* MC REGISTRATION FORM */
                <form onSubmit={handleRegisterMC} className="space-y-3.5">
                  <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                    <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-[#ebdcc9]">
                      <span>🎙️</span> MC Profile Details
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={mcName}
                        onChange={(e) => setMcName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={mcBusiness}
                        onChange={(e) => setMcBusiness(e.target.value)}
                        placeholder="Jane Doe Weddings"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={mcEmail}
                        onChange={(e) => setMcEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Mobile Number *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 py-1.5 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold text-[#6b5847] rounded-l-lg select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          required
                          value={mcMobile}
                          onChange={(e) => setMcMobile(formatAuMobile(e.target.value))}
                          placeholder="0412 345 678"
                          className="w-full bg-white border border-[#d5c7b5] rounded-r-lg rounded-l-none px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        ABN <span className="font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={mcAbn}
                        onChange={(e) => setMcAbn(e.target.value)}
                        placeholder="12 345 678 901"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                    <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-[#ebdcc9]">
                      <span>🔒</span> Password
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={mcShowPwd ? 'text' : 'password'}
                          required
                          value={mcPassword}
                          onChange={(e) => setMcPassword(e.target.value)}
                          placeholder="Create password"
                          className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 pr-12 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                        <button
                          type="button"
                          onClick={() => setMcShowPwd(!mcShowPwd)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#bd9661] font-bold"
                        >
                          {mcShowPwd ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <div className="w-full bg-[#e8ded0] h-1 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${(strengthScore / 4) * 100}%`,
                            backgroundColor: strengthColor,
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-[#8b7b6b] mt-0.5">{strengthLabel}</div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type={mcShowPwd ? 'text' : 'password'}
                        required
                        value={mcConfirmPassword}
                        onChange={(e) => setMcConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2 text-[11px] text-[#8b7b6b] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#bd9661]"
                    />
                    <span>I agree to the Terms of Service &amp; Privacy Policy</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-2.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm"
                  >
                    {isRegistering ? 'Creating MC Account...' : 'Create MC Account →'}
                  </button>
                </form>
              )}

              {/* Bottom Switch Link (Only on Step 1 for couple) */}
              {(regAccountType === 'mc' || coupleStep === 'registration') && (
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
                      <span>🎤</span>
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
