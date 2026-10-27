import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppState, setStoredSession, showToast } from '../lib/state';

interface RegisterViewProps {
  onSelectView?: (view: string) => void;
}

export default function RegisterView({ onSelectView }: RegisterViewProps) {
  const { state, setState } = useAppState();

  const getInitialAccountType = (): 'mc' | 'couple' => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('register-mc') || hash.includes('type=mc')) return 'mc';
    return 'couple'; // Default to Couple registration
  };

  const [accountType, setAccountType] = useState<'mc' | 'couple'>(getInitialAccountType);

  // Sync accountType if hash changes
  useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('register-mc') || hash.includes('type=mc')) {
      setAccountType('mc');
    } else if (hash.includes('register-couple') || hash === '#register') {
      setAccountType('couple');
    }
  }, []);

  // MC Multi-Step Flow: details -> plan_payment
  const [mcStep, setMcStep] = useState<'details' | 'plan_payment'>('details');
  const [selectedMcPlanId, setSelectedMcPlanId] = useState<string>('mc_base');
  const [expandedMcPlanId, setExpandedMcPlanId] = useState<string | null>(null);
  const [mcCardName, setMcCardName] = useState('Robert Galati');
  const [mcCardNumber, setMcCardNumber] = useState('•••• •••• •••• 4242');
  const [mcCardExpiry, setMcCardExpiry] = useState('12/28');
  const [mcCardCvc, setMcCardCvc] = useState('888');
  const [mcPromoCode, setMcPromoCode] = useState('');
  const [mcDiscountPercent, setMcDiscountPercent] = useState(0);

  // MC SaaS Plan Directory
  const MC_PLANS = [
    {
      id: 'mc_base',
      name: 'Community Host (Base)',
      tierKey: 'Starter',
      price: 0,
      monthlyPrice: 0,
      badge: 'BASE TIER · FREE FOREVER',
      tagline: 'Ideal for solo hosts coordinating a private nominated celebration',
      isListed: false,
      features: [
        '1 Active Wedding coordination at a time',
        'Interactive live run sheets & timing cues',
        'Direct runsheet sync with nominated couple',
        'Private speech timers & prompter access',
        '⚠️ Unlisted — Does NOT appear in Public MC Directory',
        'Standard email & community support',
      ],
    },
    {
      id: 'mc_pro',
      name: 'Pro Master of Ceremonies',
      tierKey: 'Pro',
      price: 149,
      monthlyPrice: 149,
      badge: 'RECOMMENDED · DIRECTORY LISTED',
      tagline: 'Get booked by couples with public directory certification & Joey AI referrals',
      isListed: true,
      features: [
        '★ Public Certified Directory Listing (Couples can find & book you)',
        'Up to 5 Active Weddings simultaneously',
        'Joey AI Matchmaker recommendations to newly registered couples',
        '5.0 Star verified client review badge & public profile showcase',
        'Stripe Connect automated client payout split (97.5% net)',
        'Catering & venue dietary export summaries',
        'Live run sheet collaboration with wedding coordinators',
      ],
    },
    {
      id: 'mc_agency',
      name: 'Boutique Agency / Host',
      tierKey: 'Enterprise',
      price: 299,
      monthlyPrice: 299,
      badge: 'ENTERPRISE HOST',
      tagline: 'Top-tier directory placement for luxury MC firms & multi-coordinator agencies',
      isListed: true,
      features: [
        '★ Priority Top Featured Placement at top of Certified MC Directory',
        'Unlimited Active Weddings simultaneously',
        'Multiple Coordinator sub-logins with granular permissions',
        'Automated Xero accounting sync for all client invoices',
        'Custom white-label branding on runsheets & client QA packs',
        'Dedicated VIP Account Concierge & 24/7 phone support',
      ],
    },
  ];

  // MC fields
  const [mcName, setMcName] = useState('');
  const [mcBusiness, setMcBusiness] = useState('');
  const [mcEmail, setMcEmail] = useState('');
  const [mcMobile, setMcMobile] = useState('');
  const [mcAbn, setMcAbn] = useState('');
  const [mcPassword, setMcPassword] = useState('');
  const [mcConfirmPassword, setMcConfirmPassword] = useState('');
  const [mcShowPwd, setMcShowPwd] = useState(false);
  const [mcShowConfirm, setMcShowConfirm] = useState(false);

  // Couple Onboarding Multi-Step: registration -> payment -> choose_mc -> dashboard
  const [coupleStep, setCoupleStep] = useState<'registration' | 'payment' | 'choose_mc'>('registration');

  // Couple fields
  const [groomName, setGroomName] = useState('James Wilson');
  const [groomEmail, setGroomEmail] = useState('james.wilson@example.com');
  const [groomMobile, setGroomMobile] = useState('0412 345 678');
  const [brideName, setBrideName] = useState('Sophie Carter');
  const [brideEmail, setBrideEmail] = useState('sophie.carter@example.com');
  const [brideMobile, setBrideMobile] = useState('0423 456 789');

  // Additional Wedding Details (Wedding Date is Compulsory)
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingDateError, setWeddingDateError] = useState(false);
  const [venue, setVenue] = useState('Fernwood Estate, Hunter Valley');
  const [guestCount, setGuestCount] = useState<number>(110);
  const [weddingStyle, setWeddingStyle] = useState('Modern Luxury & Black Tie');

  const [couplePassword, setCouplePassword] = useState('TapToast2026!');
  const [coupleConfirmPassword, setCoupleConfirmPassword] = useState('TapToast2026!');
  const [coupleShowPwd, setCoupleShowPwd] = useState(false);
  const [coupleShowConfirm, setCoupleShowConfirm] = useState(false);

  // Couple SaaS Subscription & Payment state
  const [selectedPlanId, setSelectedPlanId] = useState<string>('signature');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null); // For accordion dropdown
  const [billingCycle, setBillingCycle] = useState<'onetime' | 'monthly'>('onetime');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardName, setCardName] = useState('Sophie Carter');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // MC Selection Dropdown state & Preferred MC mode
  const [mcChoiceMode, setMcChoiceMode] = useState<'certified' | 'own'>('certified');
  const [selectedMcId, setSelectedMcId] = useState<string>('mc_robert');
  const [isMcDropdownOpen, setIsMcDropdownOpen] = useState(false);
  const [showMcInfoModal, setShowMcInfoModal] = useState(false);
  const [customMcEmail, setCustomMcEmail] = useState('');

  // Couple's Own Preferred MC info (SuperAdmin will send invite to this email)
  const [ownMcName, setOwnMcName] = useState('');
  const [ownMcEmail, setOwnMcEmail] = useState('');
  const [ownMcPhone, setOwnMcPhone] = useState('');
  const [ownMcAgency, setOwnMcAgency] = useState('');
  const [ownMcNotes, setOwnMcNotes] = useState('');

  // MC Matchmaker Concierge Floating Chatbot State for Joey AI
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'joey' | 'couple'; text: string; time: string }>>([
    {
      id: 'm1',
      sender: 'joey',
      text: "Hello Sophie & James! I am **Joey**, your certified MC Concierge.",
      time: "Just now",
    },
    {
      id: 'm2',
      sender: 'joey',
      text: "I am here specifically to help you compare, evaluate, and choose the perfect Master of Ceremonies for your wedding day. Ask me anything about our certified hosts — who has the most experience, who has 5.0-star reviews, who fits your budget, or who matches your celebration style!",
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Audited Preferences State
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<string, string>>({
    vibe: 'High-Energy Dance Party with Sophisticated Cocktails',
    speeches: 'Grouped before mains (MC Recommended pacing)',
    entrance: 'Explosive upbeat grand entrance with MC hype fanfare',
    family: 'Family-friendly with dedicated Kids meals and family tables',
  });
  const [customPrompts, setCustomPrompts] = useState<string[]>([
    'Keep father-of-the-bride speech strictly under 5 minutes',
    'Kids table should have coloring books ready at seats',
  ]);
  const [coupleAuditApproved, setCoupleAuditApproved] = useState<boolean>(true);

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatTyping]);

  // Password strength logic for MC
  const hasMinLength = mcPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(mcPassword);
  const hasLower = /[a-z]/.test(mcPassword);
  const hasNum = /[0-9]/.test(mcPassword);
  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNum].filter(Boolean).length;
  const strengthColor = strengthScore <= 1 ? '#d9534f' : strengthScore <= 3 ? '#e0a96d' : '#5ea866';
  const strengthLabel = strengthScore === 0 ? 'Password strength' : strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Medium' : 'Strong';
  const passwordsMatch = mcPassword && mcConfirmPassword && mcPassword === mcConfirmPassword;

  // Password strength logic for Couple
  const coupleHasMinLength = couplePassword.length >= 8;
  const coupleHasUpper = /[A-Z]/.test(couplePassword);
  const coupleHasLower = /[a-z]/.test(couplePassword);
  const coupleHasNum = /[0-9]/.test(couplePassword);
  const coupleStrengthScore = [coupleHasMinLength, coupleHasUpper, coupleHasLower, coupleHasNum].filter(Boolean).length;
  const coupleStrengthColor = coupleStrengthScore <= 1 ? '#d9534f' : coupleStrengthScore <= 3 ? '#e0a96d' : '#5ea866';
  const coupleStrengthLabel = coupleStrengthScore === 0 ? 'Password strength' : coupleStrengthScore <= 1 ? 'Weak' : coupleStrengthScore <= 3 ? 'Medium' : 'Strong';
  const couplePasswordsMatch = couplePassword && coupleConfirmPassword && couplePassword === coupleConfirmPassword;

  const formatAuMobile = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 10);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.substring(0, 4)} ${digits.substring(4)}`;
    return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
  };

  // COUPLE PLANS
  const COUPLE_PLANS = [
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
      badge: 'MOST POPULAR',
      tagline: 'Complete wedding intelligence with MC sync & Joey AI',
      features: [
        'Up to 250 Invited Guests',
        'Dedicated MC & Coordinator Portal Integration',
        'Live Run Sheet Cues & Audio Timing Sync',
        'Joey AI Concierge (Adults vs Kids breakdown, auto-seat)',
        'Gift & Go Wishing Well (0% transaction fee)',
        'Floor Plan Drag & Drop Table Builder',
        'Live Speech Prompter for MC',
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
        '3D Realistic Venue Floor Plan Preview',
        'Multi-Day Itinerary (Rehearsal + Reception + Brunch)',
        'Full Change Audit Trail & Live Video Sync',
        'Priority 24/7 Telephone & In-App Support',
      ],
    },
  ];

  // CERTIFIED MCS DIRECTORY (With Schedule & Booked/Unavailable Dates)
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
      recommended: true,
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
      recommended: false,
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
      recommended: false,
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
      image: '/chatbot-avatar.png',
      recommended: false,
      unavailableDates: [] as string[],
    },
  ];

  // Step 1: Proceed to MC Plan Selection
  const handleProceedToMcPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to the Terms of Service', 'error');
      return;
    }
    setMcStep('plan_payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Host profile saved! Please select your MC SaaS Plan.', 'info');
  };

  // Step 2: Complete MC Registration & Activate SaaS Plan via Stripe
  const handleCompleteMcRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenPlan = MC_PLANS.find(p => p.id === selectedMcPlanId) || MC_PLANS[0];

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newTenantId = 'tenant_' + Date.now();
      const newUser = {
        id: 'user_' + Date.now(),
        email: mcEmail,
        role: 'mc' as const,
        name: mcName,
        businessName: mcBusiness,
        tenantId: newTenantId,
        weddingId: null,
      };

      const newTenant = {
        id: newTenantId,
        businessName: mcBusiness,
        contactName: mcName,
        email: mcEmail,
        phone: mcMobile,
        abn: mcAbn || undefined,
        plan: chosenPlan.name,
        mrr: chosenPlan.price,
        status: 'Active' as const,
        isListed: chosenPlan.isListed,
        weddingsCount: 1,
        createdAt: new Date().toISOString(),
      };

      const auditEntry = {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        action: 'MC Registered & Subscribed',
        user: mcName,
        role: 'mc' as const,
        category: 'Billing',
        details: `Registered ${mcBusiness} (${mcName}) on ${chosenPlan.name} (${chosenPlan.price}/mo via Stripe). Directory listing: ${chosenPlan.isListed ? 'Listed' : 'Unlisted'}.`,
      };

      setState({
        ...state,
        users: [...state.users, newUser],
        tenants: [newTenant, ...(state.tenants || [])],
        auditLog: [auditEntry, ...(state.auditLog || [])],
      });

      setStoredSession({
        role: 'mc',
        email: mcEmail,
        name: mcName,
        businessName: mcBusiness,
        tenantId: newTenantId,
        weddingId: null,
        keepSignedIn: true,
        at: Date.now(),
      });

      showToast(`Welcome to Tap & Toast, ${mcName}! Activated ${chosenPlan.name}.`, 'success');
      if (onSelectView) onSelectView('mc');
    }, 450);
  };

  const handleApplyMcPromo = () => {
    if (mcPromoCode.trim().toUpperCase() === 'WELCOME10') {
      setMcDiscountPercent(10);
      showToast('Promo code applied: 10% off your MC plan!', 'success');
    } else {
      showToast('Invalid promo code', 'error');
    }
  };

  // Step 1: Proceed to Payment (Enforces Compulsory Wedding Date)
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weddingDate || !weddingDate.trim()) {
      setWeddingDateError(true);
      showToast('Wedding Date is mandatory. Please select your wedding date.', 'error');
      return;
    }
    if (!couplePasswordsMatch) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to the Terms of Service', 'error');
      return;
    }
    setWeddingDateError(false);
    setCoupleStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Registration details saved. Please choose your Couple Plan.', 'info');
  };

  // Step 2: Proceed to MC & AI Setup
  const handleProceedToMcAndAi = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const plan = COUPLE_PLANS.find(p => p.id === selectedPlanId) || COUPLE_PLANS[1];
      showToast(`Payment successful! Welcome to the ${plan.name}.`, 'success');
      setCoupleStep('choose_mc');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  // Filter MCs strictly by availability on the selected wedding date
  const availableMcs = useMemo(() => {
    if (!weddingDate || !weddingDate.trim()) {
      return MC_DIRECTORY;
    }
    const cleanDate = weddingDate.trim().slice(0, 10);
    return MC_DIRECTORY.filter((mc) => {
      if (mc.id === 'mc_custom') return true;
      if (mc.unavailableDates && mc.unavailableDates.includes(cleanDate)) {
        return false;
      }
      return true;
    });
  }, [weddingDate]);

  // Keep selectedMcId synced with availableMcs
  useEffect(() => {
    if (availableMcs.length > 0 && !availableMcs.some((m) => m.id === selectedMcId)) {
      setSelectedMcId(availableMcs[0].id);
    }
  }, [availableMcs, selectedMcId]);

  // Step 3: Handle MC Concierge Chatbot Messages (Strictly MC Knowledge & Availability Aware)
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

      // 1. Direct Selection Commands (Enforces Availability)
      if (q.includes('select robert') || q.includes('choose robert') || q.includes('book robert') || q.includes('pick robert')) {
        if (!availableMcs.some(m => m.id === 'mc_robert')) {
          botResponse = `Unfortunately, **Robert Galati** is already booked on your wedding date (${weddingDate || 'this date'}). Only certified hosts available on your date can be selected. Available options: ${availableMcs.map(m => m.name).join(', ')}.`;
          showToast('Robert Galati is unavailable on this date', 'error');
        } else {
          setSelectedMcId('mc_robert');
          botResponse = "Excellent choice! I have selected **Robert Galati** ($1,850 AUD · 5.0 ⭐) for your wedding. You can review his profile above and click **Confirm MC & Launch Dashboard** below to proceed.";
          showToast('MC Selected: Robert Galati', 'success');
        }
      } else if (q.includes('select marcus') || q.includes('choose marcus') || q.includes('book marcus') || q.includes('pick marcus')) {
        if (!availableMcs.some(m => m.id === 'mc_marcus')) {
          botResponse = `Unfortunately, **Marcus Thorne** is already booked on your wedding date (${weddingDate || 'this date'}). Only certified hosts available on your date can be selected. Available options: ${availableMcs.map(m => m.name).join(', ')}.`;
          showToast('Marcus Thorne is unavailable on this date', 'error');
        } else {
          setSelectedMcId('mc_marcus');
          botResponse = "Splendid! I have selected **Marcus Thorne** ($1,650 AUD · 4.9 ⭐) for your wedding. You can review his profile above and click **Confirm MC & Launch Dashboard** below to proceed.";
          showToast('MC Selected: Marcus Thorne', 'success');
        }
      } else if (q.includes('select elena') || q.includes('choose elena') || q.includes('book elena') || q.includes('pick elena')) {
        if (!availableMcs.some(m => m.id === 'mc_elena')) {
          botResponse = `Unfortunately, **Elena Rostova** is already booked on your wedding date (${weddingDate || 'this date'}). Only certified hosts available on your date can be selected. Available options: ${availableMcs.map(m => m.name).join(', ')}.`;
          showToast('Elena Rostova is unavailable on this date', 'error');
        } else {
          setSelectedMcId('mc_elena');
          botResponse = "Wonderful! I have selected **Elena Rostova** ($1,750 AUD · 5.0 ⭐) for your wedding. You can review her profile above and click **Confirm MC & Launch Dashboard** below to proceed.";
          showToast('MC Selected: Elena Rostova', 'success');
        }
      } else if (q.includes('select own') || q.includes('choose own') || q.includes('select external') || q.includes('bring my own')) {
        setSelectedMcId('mc_custom');
        botResponse = "You got it! I have set your choice to **Invite My Own MC / Coordinator** ($0 AUD platform fee). Enter their email in the field above to dispatch their portal link.";
        showToast('MC Selected: External Coordinator', 'info');
      }
      // Availability Queries
      else if (q.includes('available') || q.includes('who is free') || q.includes('who is available') || q.includes('availability') || q.includes('who can host')) {
        const availableNames = availableMcs.map(m => m.name).join(', ');
        const unavailable = MC_DIRECTORY.filter(m => !availableMcs.some(am => am.id === m.id));
        botResponse = `For your wedding date on **${weddingDate || 'your date'}**, here is our certified host availability:\n\n• **Available Hosts**: ${availableNames}\n` +
          (unavailable.length > 0 ? `• **Already Booked**: ${unavailable.map(m => m.name).join(', ')}\n\n` : '\n') +
          "Our system automatically filters out booked hosts so you only select from certified MCs ready for your celebration.";
      }
      // 2. Experience Queries
      else if (q.includes('experience') || q.includes('experienced') || q.includes('years') || q.includes('how many wedding') || q.includes('veteran') || q.includes('track record') || q.includes('senior') || q.includes('most wedding')) {
        botResponse = "**Robert Galati** is our most experienced host, having orchestrated **142+ luxury weddings** over 10+ years across Sydney and the Hunter Valley.\n\nHere is how our certified MCs rank by verified experience:\n• **Robert Galati**: 142+ weddings (10+ years experience) · $1,850 AUD\n• **Elena Rostova**: 115+ weddings (9 years experience) · $1,750 AUD\n• **Marcus Thorne**: 98+ weddings (8 years experience) · $1,650 AUD\n\nWould you like me to select Robert Galati for your celebration?";
      }
      // 3. Reviews & Ratings Queries
      else if (q.includes('review') || q.includes('rating') || q.includes('star') || q.includes('5.0') || q.includes('best review') || q.includes('highest rated') || q.includes('feedback') || q.includes('trust')) {
        botResponse = "Both **Robert Galati** and **Elena Rostova** hold a flawless **5.0 ⭐ verified rating** from Australian couples!\n\n• **Robert Galati**: ⭐ **5.0** (142 verified reviews) — Praised for electrifying grand entrances and seamless AV direction.\n• **Elena Rostova**: ⭐ **5.0** (115 verified reviews) — Celebrated for bespoke emotional pacing and romantic storytelling.\n• **Marcus Thorne**: ⭐ **4.9** (98 verified reviews) — Commended for dignified black-tie decorum.\n\nBoth Robert and Elena have 100% 5-star satisfaction.";
      }
      // 4. Cost / Pricing / Budget Queries (e.g. falls under this cost / under $1,800)
      else if (q.includes('cost') || q.includes('price') || q.includes('rate') || q.includes('budget') || q.includes('under 1800') || q.includes('under $1800') || q.includes('1800') || q.includes('cheap') || q.includes('afford') || q.includes('how much') || q.includes('fee')) {
        botResponse = "Here is the exact pricing breakdown for our certified MCs:\n\n• **Marcus Thorne**: **$1,650 AUD** (★ Best value host under $1,800)\n• **Elena Rostova**: **$1,750 AUD** (★ Best value 5.0 ⭐ host under $1,800)\n• **Robert Galati**: **$1,850 AUD** (Premier luxury tier host)\n• **External MC**: **$0 AUD** platform fee (coordinate directly with your own MC)\n\nIf your target is under $1,800, **Marcus Thorne ($1,650)** or **Elena Rostova ($1,750)** are your best choices! Shall I select one for you?";
      }
      // 5. Style & Comparison Queries
      else if (q.includes('style') || q.includes('compare') || q.includes('difference') || q.includes('vibe') || q.includes('robert vs') || q.includes('marcus vs') || q.includes('elena vs') || q.includes('recommend') || q.includes('which mc') || q.includes('who should')) {
        botResponse = "Here is how our hosts compare in energy and presentation style:\n\n• **Robert Galati** ($1,850 · 5.0 ⭐): *Modern Luxury & High-Energy* — Ideal for vibrant dance celebrations, hype grand intros, and multilingual Italian/English guests.\n• **Marcus Thorne** ($1,650 · 4.9 ⭐): *Classic Formal & Aristocratic* — Ideal for black-tie estates, structured royal protocol, and eloquent timekeeping.\n• **Elena Rostova** ($1,750 · 5.0 ⭐): *Warm & Romantic Storytelling* — Ideal for intimate vineyard celebrations, heartfelt couple toasts, and bespoke emotional pacing.";
      }
      // 6. External / Own MC Queries
      else if (q.includes('own mc') || q.includes('external') || q.includes('bring my own') || q.includes('friend') || q.includes('coordinator') || q.includes('family member')) {
        botResponse = "Yes! You can invite your own MC or coordinator at **$0 platform fee**. Select the **'Invite My Own MC / Coordinator'** option in the dropdown above, and we will grant them dedicated portal access with live cue sync and prompter tools.";
      }
      // 7. Off-Topic / General Guard (Strictly MC info only)
      else {
        botResponse = "I am Joey, your certified **MC Concierge**! I am here specifically to help you compare, evaluate, and choose your Master of Ceremonies.\n\nPlease ask me about our MCs:\n• *Who is available on my date?*\n• *Which MC is more experienced?*\n• *Who has the best 5.0 reviews?*\n• *Which MC falls under $1,800?*\n• *Compare Robert Galati vs Marcus Thorne vs Elena Rostova*";
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
    }, 380);
  };

  // Step 3: Complete Onboarding & Launch Dashboard
  const handleCompleteCoupleOnboarding = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bName = brideName.trim() || 'Sophie';
      const gName = groomName.trim() || 'James';
      const coupleName = `${bName} & ${gName}`;
      const primaryEmail = brideEmail.trim() || groomEmail.trim() || 'couple@example.com';
      const newWeddingId = 'wedding_' + Date.now();

      const bEmail = brideEmail.trim();
      const gEmail = groomEmail.trim();
      const coupleUsers: any[] = [];

      if (bEmail) {
        coupleUsers.push({
          id: 'user_bride_' + Date.now(),
          email: bEmail,
          role: 'couple' as const,
          name: `${bName} (${coupleName})`,
          partner1: bName,
          partner2: gName,
          tenantId: 'tenant_galati',
          weddingId: newWeddingId,
        });
      }
      if (gEmail && gEmail.toLowerCase() !== bEmail.toLowerCase()) {
        coupleUsers.push({
          id: 'user_groom_' + Date.now(),
          email: gEmail,
          role: 'couple' as const,
          name: `${gName} (${coupleName})`,
          partner1: bName,
          partner2: gName,
          tenantId: 'tenant_galati',
          weddingId: newWeddingId,
        });
      }
      if (coupleUsers.length === 0) {
        coupleUsers.push({
          id: 'user_' + Date.now(),
          email: 'couple@example.com',
          role: 'couple' as const,
          name: coupleName,
          partner1: bName,
          partner2: gName,
          tenantId: 'tenant_galati',
          weddingId: newWeddingId,
        });
      }

      const daysCalc = Math.max(1, Math.ceil((new Date(weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
      const chosenPlan = COUPLE_PLANS.find(p => p.id === selectedPlanId) || COUPLE_PLANS[1];
      const chosenMc = availableMcs.find(m => m.id === selectedMcId) || availableMcs[0] || MC_DIRECTORY[0];

      const newWedding = {
        id: newWeddingId,
        tenantId: 'tenant_galati',
        couple: coupleName,
        partner1: bName,
        partner2: gName,
        date: weddingDate,
        dateDisplay: new Date(weddingDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        venue: venue.trim() || 'Fernwood Estate, Hunter Valley',
        region: 'NSW',
        daysRemaining: isNaN(daysCalc) ? 22 : daysCalc,
        invited: guestCount || 110,
        confirmed: 0,
        declined: 0,
        awaiting: guestCount || 110,
        tablesSeated: 0,
        totalTables: Math.ceil((guestCount || 110) / 10),
        giftsTotal: 0,
        status: 'Planning',
        subscriptionPlan: {
          id: chosenPlan.id,
          name: chosenPlan.name,
          price: chosenPlan.price,
          status: 'Active',
          activatedAt: new Date().toISOString(),
        },
        selectedMc: mcChoiceMode === 'own' ? {
          id: 'mc_preferred_own',
          name: ownMcName.trim() || 'Preferred Wedding MC',
          email: ownMcEmail.trim(),
          phone: ownMcPhone.trim(),
          businessName: ownMcAgency.trim() || 'Couple Preferred MC',
          rating: '5.0',
          status: 'Invite Pending from SuperAdmin',
          isPreferredOwn: true,
          notes: ownMcNotes.trim(),
        } : {
          id: chosenMc.id,
          name: chosenMc.id === 'mc_custom' ? (customMcEmail || 'External MC') : chosenMc.name,
          businessName: chosenMc.business,
          rating: chosenMc.rating,
          status: 'Confirmed',
        },
        aiOnboardingAnswers: {
          ...onboardingAnswers,
          customNotes: customPrompts,
          auditedAt: new Date().toISOString(),
          auditedByCouple: true,
        },
        giftingPresets: [50, 100, 200, 300],
        tasks: [
          { id: 't1', text: 'Confirm floral arrangements & ceremony arch', completed: false, due: 'This week' },
          { id: 't2', text: mcChoiceMode === 'own' ? `Review cue sheet with ${ownMcName || 'your MC'}` : `Review run sheet with ${chosenMc.name}`, completed: false, due: 'This week' },
          { id: 't3', text: 'Finalize dietary requirements for venue catering', completed: false, due: 'Next week' },
          { id: 't4', text: 'Share digital QaRd invitation with wedding party', completed: true, due: 'Done' },
        ],
      };

      const auditEntry = {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        action: 'Couple Onboarding Completed',
        user: coupleName,
        role: 'couple' as const,
        category: 'Onboarding',
        details: mcChoiceMode === 'own'
          ? `Registered ${coupleName} for ${newWedding.venue}. Requested SuperAdmin to dispatch platform invite to preferred MC: ${ownMcName.trim() || 'MC'} (${ownMcEmail.trim()}). Plan: ${chosenPlan.name}.`
          : `Registered ${coupleName} for ${newWedding.venue}. Selected ${chosenMc.name} ($${chosenMc.price}) with plan ${chosenPlan.name}. Onboarding preferences & questions audited.`,
      };

      setState({
        ...state,
        weddings: [...state.weddings, newWedding as any],
        users: [...state.users, ...coupleUsers],
        auditLog: [auditEntry, ...(state.auditLog || [])],
      });

      setStoredSession({
        role: 'couple',
        email: primaryEmail,
        name: coupleName,
        tenantId: 'tenant_galati',
        weddingId: newWeddingId,
        keepSignedIn: true,
        at: Date.now(),
      });

      if (mcChoiceMode === 'own' && ownMcEmail.trim()) {
        showToast(`Welcome ${coupleName}! Preferred MC invitation scheduled for SuperAdmin to send to ${ownMcEmail}.`, 'success');
      } else {
        showToast(`Welcome, ${coupleName}! Your wedding portal is active.`, 'success');
      }
      if (onSelectView) onSelectView('couple');
    }, 450);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'WELCOME10' || promoCode.trim().toUpperCase() === 'ROYAL10') {
      setDiscountPercent(10);
      showToast('Promo code applied: 10% discount!', 'success');
    } else if (promoCode.trim().toUpperCase() === 'VIP20') {
      setDiscountPercent(20);
      showToast('VIP Promo code applied: 20% discount!', 'success');
    } else {
      showToast('Invalid promo code. Try WELCOME10', 'error');
    }
  };

  const activePlan = COUPLE_PLANS.find(p => p.id === selectedPlanId) || COUPLE_PLANS[1];
  const selectedMc = availableMcs.find(m => m.id === selectedMcId) || availableMcs[0] || MC_DIRECTORY[0];
  const basePrice = billingCycle === 'onetime' ? activePlan.price : activePlan.monthlyPrice;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const finalPrice = Math.max(0, basePrice - discountAmount);

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-[40%_60%] min-h-[calc(100vh-45px)] bg-[#f8f6f2] font-sans">
      {/* Left Hero Panel */}
      <div className="hidden md:flex bg-[#15110e] text-[#f8f6f2] p-10 lg:p-14 flex-col justify-between border-r border-[#29211a] relative">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-[38px] h-[38px] border-[1.5px] border-[#bd9661] rounded-[4px] flex items-center justify-center text-[#bd9661] font-serif font-bold text-base">
              T
            </div>
            <div className="font-serif text-[24px] font-semibold text-white tracking-[0.5px]">
              Tap &amp; Toast
            </div>
          </div>

          <div className="my-3">
            <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
              <path d="M10 54V30C10 18.9543 18.9543 10 30 10C41.0457 10 50 18.9543 50 30V54" stroke="#bd9661" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 54V30C16 22.268 22.268 16 30 16C37.732 16 44 22.268 44 30V54" stroke="#bd9661" strokeWidth="0.75" strokeDasharray="3 3" />
              <circle cx="30" cy="30" r="2.5" fill="#bd9661" />
            </svg>
          </div>

          <h1 className="font-serif text-[30px] leading-[1.2] text-white mb-2 max-w-[400px]">
            Every wedding, beautifully run.
          </h1>

          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-6">
            AUSTRALIA'S PREMIER COUPLE &amp; WEDDING MC SUITE
          </div>

          <ul className="list-none p-0 m-0 max-w-[340px] text-left flex flex-col gap-3 text-[#c9bbae] text-[13px] leading-[1.4]">
            <li className="flex items-start gap-2.5">
              <span className="text-[#bd9661] font-bold">✓</span>
              <span><strong>Couple-First SaaS</strong>: Dedicated subscription for couples with live MC collaboration</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#bd9661] font-bold">✓</span>
              <span><strong>Joey AI Prompting &amp; Audit</strong>: Interactive wedding concierge with live couple approval</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#bd9661] font-bold">✓</span>
              <span><strong>Smart Guest Management</strong>: Adult &amp; kid party breakdown, seating builder, &amp; wishing well</span>
            </li>
          </ul>
        </div>

        {/* Bottom Trust Badge */}
        <div className="pt-6 border-t border-[#29211a]/80 text-xs text-[#8b7b6b] flex items-center justify-between">
          <span>🔒 256-Bit Encrypted &amp; Stripe Verified</span>
          <span className="text-[#bd9661] font-semibold">Sydney · Melbourne · Hunter Valley</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="bg-[#f8f6f2] px-3.5 py-4 sm:px-6 md:p-8 lg:p-10 flex flex-col items-center justify-start overflow-y-auto w-full">
        {/* Mobile Header Banner */}
        <div className="md:hidden flex flex-col items-center justify-center text-center mb-4 w-full max-w-[620px] pt-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 border-[1.5px] border-[#bd9661] rounded-[4px] flex items-center justify-center text-[#bd9661] font-serif font-bold text-base bg-[#15110e]">
              T
            </div>
            <div className="font-serif text-xl font-bold text-[#15110e] tracking-[0.5px]">
              Tap &amp; Toast
            </div>
          </div>
          <p className="text-[11px] text-[#8b7b6b] font-medium">
            Every wedding, beautifully run
          </p>
        </div>

        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-2xl w-full max-w-[680px] p-5 sm:p-7 md:p-8 shadow-sm relative my-1 sm:my-2 transition-all duration-200">
          {/* Account Mode Selector (Only on Step 1) */}
          {coupleStep === 'registration' && (
            <div className="grid grid-cols-2 gap-2 bg-[#f0ebe3] p-1.5 rounded-xl mb-6 border border-[#e2d8cb]">
              <button
                type="button"
                onClick={() => {
                  setAccountType('couple');
                  window.location.hash = 'register';
                }}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  accountType === 'couple'
                    ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                    : 'text-[#6b5847] hover:text-[#15110e] hover:bg-[#e8ded0]/50'
                }`}
              >
                <span className="text-sm">👰🤵</span>
                <div className="text-left">
                  <div className="leading-tight font-bold">Couple Portal</div>
                  <div className="text-[10px] font-normal opacity-75">Couple Onboarding</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAccountType('mc');
                  window.location.hash = 'register-mc';
                }}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  accountType === 'mc'
                    ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                    : 'text-[#6b5847] hover:text-[#15110e] hover:bg-[#e8ded0]/50'
                }`}
              >
                <span className="text-sm">🎙️</span>
                <div className="text-left">
                  <div className="leading-tight font-bold">MC / Planner</div>
                  <div className="text-[10px] font-normal opacity-75">Business Account</div>
                </div>
              </button>
            </div>
          )}

          {/* MC ONBOARDING PROGRESS STEPPER */}
          {accountType === 'mc' && (
            <div className="mb-6 pb-4 border-b border-[#ebdcc9]">
              <div className="flex items-center justify-between text-xs">
                {/* Step 1 */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      mcStep === 'details'
                        ? 'bg-[#15110e] text-[#dfc194] ring-2 ring-[#bd9661]'
                        : 'bg-[#bd9661] text-[#15110e]'
                    }`}
                  >
                    {mcStep !== 'details' ? '✓' : '1'}
                  </div>
                  <span className={`text-xs font-semibold ${mcStep === 'details' ? 'text-[#15110e]' : 'text-[#8b7b6b]'}`}>
                    Host Profile
                  </span>
                </div>

                <div className="h-0.5 flex-1 bg-[#ebdcc9] mx-4">
                  <div
                    className="h-full bg-[#bd9661] transition-all duration-300"
                    style={{ width: mcStep === 'details' ? '0%' : '100%' }}
                  />
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      mcStep === 'plan_payment'
                        ? 'bg-[#15110e] text-[#dfc194] ring-2 ring-[#bd9661]'
                        : 'bg-[#ebdcc9] text-[#8b7b6b]'
                    }`}
                  >
                    2
                  </div>
                  <span className={`text-xs font-semibold ${mcStep === 'plan_payment' ? 'text-[#15110e]' : 'text-[#8b7b6b]'}`}>
                    SaaS Plan &amp; Stripe Billing
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* COUPLE ONBOARDING PROGRESS STEPPER */}
          {accountType === 'couple' && (
            <div className="mb-6 pb-4 border-b border-[#ebdcc9]">
              <div className="flex items-center justify-between text-xs">
                {/* Step 1 */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      coupleStep === 'registration'
                        ? 'bg-[#15110e] text-[#dfc194] ring-2 ring-[#bd9661]'
                        : 'bg-[#bd9661] text-[#15110e]'
                    }`}
                  >
                    {coupleStep !== 'registration' ? '✓' : '1'}
                  </div>
                  <span className={`text-xs font-semibold ${coupleStep === 'registration' ? 'text-[#15110e]' : 'text-[#8b7b6b]'}`}>
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
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      coupleStep === 'payment'
                        ? 'bg-[#15110e] text-[#dfc194] ring-2 ring-[#bd9661]'
                        : coupleStep === 'choose_mc'
                        ? 'bg-[#bd9661] text-[#15110e]'
                        : 'bg-[#ebdcc9] text-[#8b7b6b]'
                    }`}
                  >
                    {coupleStep === 'choose_mc' ? '✓' : '2'}
                  </div>
                  <span className={`text-xs font-semibold ${coupleStep === 'payment' ? 'text-[#15110e]' : 'text-[#8b7b6b]'}`}>
                    Plan &amp; Payment
                  </span>
                </div>

                <div className="h-0.5 flex-1 bg-[#ebdcc9] mx-2">
                  <div
                    className="h-full bg-[#bd9661] transition-all duration-300"
                    style={{ width: coupleStep === 'choose_mc' ? '100%' : '0%' }}
                  />
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      coupleStep === 'choose_mc'
                        ? 'bg-[#15110e] text-[#dfc194] ring-2 ring-[#bd9661]'
                        : 'bg-[#ebdcc9] text-[#8b7b6b]'
                    }`}
                  >
                    3
                  </div>
                  <span className={`text-xs font-semibold ${coupleStep === 'choose_mc' ? 'text-[#15110e]' : 'text-[#8b7b6b]'}`}>
                    MC Setup
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MC MULTI-STEP FLOW (STEP 1: DETAILS, STEP 2: PLAN & STRIPE) */}
          {accountType === 'mc' ? (
            mcStep === 'details' ? (
              /* STEP 1: MC HOST PROFILE & SECURITY */
              <form onSubmit={handleProceedToMcPlan} className="space-y-5">
                <div>
                  <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-1">
                    STEP 1 OF 2 · PRO MC &amp; COORDINATOR ACCOUNT
                  </div>
                  <h2 className="font-serif text-[22px] font-bold text-[#15110e] leading-tight">
                    Register Certified MC Account
                  </h2>
                  <p className="text-xs text-[#8b7b6b] mt-0.5">
                    Manage multiple couple run sheets, client audio cues, and seamless wedding coordination.
                  </p>
                </div>

                {/* Business & Personal Details Card */}
                <div className="bg-[#faf8f5] p-4 rounded-xl border border-[#e8ded0] space-y-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] pb-1 border-b border-[#ebdcc9] flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#bd9661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Host Profile &amp; Business Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                        Full Name *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-[#bd9661]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Robert Galati"
                          value={mcName}
                          onChange={(e) => setMcName(e.target.value)}
                          className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg pl-9 pr-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                        Business Name *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-[#bd9661]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Galati MC Services"
                          value={mcBusiness}
                          onChange={(e) => setMcBusiness(e.target.value)}
                          className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg pl-9 pr-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                        Email Address *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-[#bd9661]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="robert@galatimc.com.au"
                          value={mcEmail}
                          onChange={(e) => setMcEmail(e.target.value)}
                          className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg pl-9 pr-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                        Australian Mobile *
                      </label>
                      <div className="flex rounded-lg overflow-hidden border border-[#d5c7b5] focus-within:border-[#bd9661] focus-within:ring-1 focus-within:ring-[#bd9661] bg-white shadow-2xs">
                        <span className="inline-flex items-center px-3 bg-[#f5ede2] text-xs font-bold text-[#6b5847] border-r border-[#e2d8cb] select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="0412 345 678"
                          value={mcMobile}
                          onChange={(e) => setMcMobile(formatAuMobile(e.target.value))}
                          className="w-full px-3 py-2 text-xs text-[#15110e] outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c]">
                        Australian Business Number (ABN)
                      </label>
                      <span className="text-[10px] text-[#8b7b6b] font-medium">(Optional for Tax Invoicing)</span>
                    </div>
                    <input
                      type="text"
                      placeholder="12 345 678 901"
                      value={mcAbn}
                      onChange={(e) => setMcAbn(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs"
                    />
                  </div>
                </div>

                {/* Password & Security Card */}
                <div className="bg-[#faf8f5] p-4 rounded-xl border border-[#e8ded0] space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] pb-1 border-b border-[#ebdcc9] flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#bd9661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Account Security</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={mcShowPwd ? 'text' : 'password'}
                          required
                          placeholder="Create a secure password"
                          value={mcPassword}
                          onChange={(e) => setMcPassword(e.target.value)}
                          className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 pr-14 text-xs text-[#15110e] outline-none shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setMcShowPwd(!mcShowPwd)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#bd9661] font-semibold hover:underline cursor-pointer"
                        >
                          {mcShowPwd ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <div className="w-full bg-[#e8ded0] h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{ width: `${(strengthScore / 4) * 100}%`, backgroundColor: strengthColor }}
                        />
                      </div>
                      <div className="text-[10px] text-[#8b7b6b] mt-0.5">{strengthLabel}</div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={mcShowConfirm ? 'text' : 'password'}
                          required
                          placeholder="Re-enter password"
                          value={mcConfirmPassword}
                          onChange={(e) => setMcConfirmPassword(e.target.value)}
                          className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 pr-14 text-xs text-[#15110e] outline-none shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setMcShowConfirm(!mcShowConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#bd9661] font-semibold hover:underline cursor-pointer"
                        >
                          {mcShowConfirm ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      {mcConfirmPassword && (
                        <div className={`text-[10.5px] mt-1 font-semibold ${passwordsMatch ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="pt-0.5">
                  <label className="flex items-start gap-2.5 text-xs text-[#6b5847] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#bd9661] focus:ring-[#bd9661]"
                    />
                    <span>
                      I agree to the <a href="#terms" className="text-[#bd9661] underline font-semibold">Terms of Service</a> and <a href="#privacy" className="text-[#bd9661] underline font-semibold">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Proceed to Choose MC Plan &amp; Billing</span>
                  <span>→</span>
                </button>
              </form>
            ) : (
              /* STEP 2: MC PLAN SELECTION & STRIPE BILLING */
              <form onSubmit={handleCompleteMcRegistration} className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-1">
                    STEP 2 OF 2 · MC SAAS PLAN &amp; STRIPE BILLING
                  </div>
                  <h2 className="font-serif text-[22px] font-bold text-[#15110e] leading-tight mb-1">
                    Select Your MC Subscription Plan
                  </h2>
                  <p className="text-xs text-[#8b7b6b]">
                    Choose a base tier to manage private weddings or a certified paid tier to be listed and booked on the Tap &amp; Toast platform.
                  </p>
                </div>

                {/* Plan Selection Cards: Accordion / Dropdown Style identical to Couple Registration */}
                <div className="space-y-2.5">
                  {MC_PLANS.map((plan) => {
                    const isSelected = selectedMcPlanId === plan.id;
                    const isExpanded = expandedMcPlanId === plan.id;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedMcPlanId(plan.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#bd9661] bg-[#fdfbf7] shadow-xs ring-1 ring-[#bd9661]'
                            : 'border-[#e8ded0] bg-white hover:border-[#d5c7b5]'
                        }`}
                      >
                        {/* Top Header Row: Name, Badges, Pricing, and Expand Dropdown Arrow */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="mcPlanChoice"
                              checked={isSelected}
                              onChange={() => setSelectedMcPlanId(plan.id)}
                              className="text-[#bd9661] focus:ring-[#bd9661] cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-serif text-sm font-bold text-[#15110e]">
                                  {plan.name}
                                </span>
                                {plan.badge && (
                                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                    plan.price === 0
                                      ? 'bg-[#e2d8cb] text-[#4a3b2c]'
                                      : 'bg-[#bd9661] text-[#15110e]'
                                  }`}>
                                    {plan.badge}
                                  </span>
                                )}
                                {plan.isListed ? (
                                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Public Directory Listed
                                  </span>
                                ) : (
                                  <span className="text-[9.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                    ⚠️ Unlisted (Private Link Only)
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                                {plan.tagline}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="font-serif text-base font-bold text-[#15110e]">
                                ${plan.price}
                              </div>
                              <div className="text-[9.5px] text-[#8b7b6b] uppercase">
                                {plan.price === 0 ? 'Free forever' : 'AUD / mo'}
                              </div>
                            </div>

                            {/* Dropdown Chevron button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedMcPlanId(isExpanded ? null : plan.id);
                              }}
                              className="p-1 rounded text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#f0ebe3] transition-colors cursor-pointer"
                              title={isExpanded ? 'Collapse features' : 'Expand features'}
                            >
                              <svg
                                width="16"
                                height="16"
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

                        {/* Expandable Features Dropdown */}
                        {isExpanded && (
                          <div className="mt-2.5 pt-2.5 border-t border-[#f0ede6] transition-all">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                              Plan Features:
                            </div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-[#524438]">
                              {plan.features.map((feat, fIdx) => (
                                <li key={fIdx} className="flex items-center gap-1.5 text-[11px]">
                                  <span className="text-[#bd9661] font-bold text-xs shrink-0">✓</span>
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

                {/* Selected Tier Action Notice & Payment Fields (Free green box removed per user request) */}
                {selectedMcPlanId !== 'mc_base' && (
                  /* Paid Plan: Stripe Card Section */
                  <div className="bg-[#faf8f5] p-4 rounded-xl border border-[#e8ded0] space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-[#ebdcc9]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#15110e]">Stripe Secure Payment</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-1.5 py-0.2 rounded">
                          256-Bit Encrypted
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMcCardNumber('4242 •••• •••• 4242');
                          setMcCardExpiry('12/28');
                          setMcCardCvc('888');
                          setMcCardName(mcName || 'Robert Galati');
                          showToast('Demo test card filled', 'info');
                        }}
                        className="text-[10.5px] text-[#bd9661] font-bold hover:underline cursor-pointer"
                      >
                        Use Demo Test Card
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        CARDHOLDER NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={mcCardName}
                        onChange={(e) => setMcCardName(e.target.value)}
                        className="w-full bg-white border border-[#d5c7b5] rounded-md px-3 py-1.5 text-xs outline-none focus:border-[#bd9661]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        CARD NUMBER
                      </label>
                      <input
                        type="text"
                        required
                        value={mcCardNumber}
                        onChange={(e) => setMcCardNumber(e.target.value)}
                        className="w-full bg-white border border-[#d5c7b5] rounded-md px-3 py-1.5 text-xs outline-none focus:border-[#bd9661]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                          EXPIRY DATE
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={mcCardExpiry}
                          onChange={(e) => setMcCardExpiry(e.target.value)}
                          className="w-full bg-white border border-[#d5c7b5] rounded-md px-3 py-1.5 text-xs outline-none focus:border-[#bd9661]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="123"
                          value={mcCardCvc}
                          onChange={(e) => setMcCardCvc(e.target.value)}
                          className="w-full bg-white border border-[#d5c7b5] rounded-md px-3 py-1.5 text-xs outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>

                    {/* Promo Code Input */}
                    <div className="flex gap-2 pt-0.5">
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. WELCOME10)"
                        value={mcPromoCode}
                        onChange={(e) => setMcPromoCode(e.target.value)}
                        className="flex-1 bg-white border border-[#d5c7b5] rounded-md px-3 py-1.5 text-xs uppercase outline-none focus:border-[#bd9661]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyMcPromo}
                        className="bg-[#15110e] text-[#dfc194] px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#2b221a] cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-white p-2.5 rounded-lg border border-[#ebdcc9] text-xs space-y-1">
                      {(() => {
                        const plan = MC_PLANS.find(p => p.id === selectedMcPlanId) || MC_PLANS[1];
                        const discount = Math.round((plan.price * mcDiscountPercent) / 100);
                        const finalPrice = Math.max(0, plan.price - discount);
                        return (
                          <>
                            <div className="flex justify-between text-[#8b7b6b]">
                              <span>{plan.name} (Monthly Subscription)</span>
                              <span>${plan.price}.00 AUD</span>
                            </div>
                            {mcDiscountPercent > 0 && (
                              <div className="flex justify-between text-emerald-600 font-semibold">
                                <span>Promo Discount ({mcDiscountPercent}%)</span>
                                <span>-${discount}.00 AUD</span>
                              </div>
                            )}
                            <div className="flex justify-between text-[#8b7b6b]">
                              <span>Certified Directory Listing Badge</span>
                              <span className="text-emerald-700 font-semibold">✓ Active &amp; Bookable</span>
                            </div>
                            <div className="flex justify-between text-[#8b7b6b]">
                              <span>Australian GST (10%)</span>
                              <span>Included</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-[#15110e] pt-1 border-t border-[#f0ede6]">
                              <span>Total Due Today:</span>
                              <span className="text-[#bd9661] text-sm font-serif">${finalPrice}.00 AUD</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Navigation CTA Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setMcStep('details')}
                    className="px-3 py-2 border border-[#d5c7b5] text-[#6b5847] hover:text-[#15110e] hover:bg-[#faf7f2] rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    ← Back to Profile
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-5 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    {(() => {
                      const plan = MC_PLANS.find(p => p.id === selectedMcPlanId) || MC_PLANS[0];
                      const discount = Math.round((plan.price * mcDiscountPercent) / 100);
                      const finalPrice = Math.max(0, plan.price - discount);
                      return (
                        <span>
                          {isSubmitting
                            ? 'Activating Plan...'
                            : plan.price === 0
                            ? 'Activate Free Base Plan & Launch MC Portal'
                            : `Pay via Stripe (${finalPrice}/mo) & Launch MC Portal`}
                        </span>
                      );
                    })()}
                    <span>→</span>
                  </button>
                </div>
              </form>
            )
          ) : coupleStep === 'registration' ? (
            /* STEP 1: COUPLE REGISTRATION (POLISHED LUXURY UI) */
/* STEP 1: COUPLE REGISTRATION (POLISHED LUXURY UI) */
            <form onSubmit={handleProceedToPayment} noValidate className="space-y-4">
              <div>
                <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-1">
                  STEP 1 OF 3 · COUPLE ONBOARDING
                </div>
                <h2 className="font-serif text-[22px] font-bold text-[#15110e] leading-tight">
                  Couple Registration
                </h2>
                <p className="text-xs text-[#8b7b6b] mt-0.5">
                  Enter details for both partners to configure guest management, digital RSVPs, and live runsheet sync.
                </p>
              </div>

              {/* Groom / Partner 1 Card */}
              <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#e8ded0] space-y-3">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#bd9661] pb-1 border-b border-[#ebdcc9] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#bd9661]" />
                    <span>Groom / Partner 1</span>
                  </div>
                  <span className="text-[9.5px] text-[#8b7b6b] font-medium">Co-Host Access</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                    Full Name *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#bd9661]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. James Wilson"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg pl-9 pr-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Email Address *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#bd9661]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="james.wilson@example.com"
                        value={groomEmail}
                        onChange={(e) => setGroomEmail(e.target.value)}
                        className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg pl-9 pr-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Australian Mobile *
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-[#d5c7b5] focus-within:border-[#bd9661] focus-within:ring-1 focus-within:ring-[#bd9661] bg-white shadow-2xs">
                      <span className="inline-flex items-center px-3 bg-[#f5ede2] text-xs font-bold text-[#6b5847] border-r border-[#e2d8cb] select-none">
                        +61
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="0412 345 678"
                        value={groomMobile}
                        onChange={(e) => setGroomMobile(formatAuMobile(e.target.value))}
                        className="w-full px-3 py-2 text-xs text-[#15110e] outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bride / Partner 2 Card */}
              <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#e8ded0] space-y-3">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#bd9661] pb-1 border-b border-[#ebdcc9] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#bd9661]" />
                    <span>Bride / Partner 2</span>
                  </div>
                  <span className="text-[9.5px] text-[#8b7b6b] font-medium">Co-Host Access</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                    Full Name *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#bd9661]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sophie Carter"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg pl-9 pr-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Email Address *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#bd9661]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="sophie.carter@example.com"
                        value={brideEmail}
                        onChange={(e) => setBrideEmail(e.target.value)}
                        className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg pl-9 pr-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Australian Mobile *
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-[#d5c7b5] focus-within:border-[#bd9661] focus-within:ring-1 focus-within:ring-[#bd9661] bg-white shadow-2xs">
                      <span className="inline-flex items-center px-3 bg-[#f5ede2] text-xs font-bold text-[#6b5847] border-r border-[#e2d8cb] select-none">
                        +61
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="0423 456 789"
                        value={brideMobile}
                        onChange={(e) => setBrideMobile(formatAuMobile(e.target.value))}
                        className="w-full px-3 py-2 text-xs text-[#15110e] outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Wedding & Celebration Details Card */}
              <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#e8ded0] space-y-3">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#bd9661] pb-1 border-b border-[#ebdcc9] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#bd9661]" />
                    <span>Celebration Details</span>
                  </div>
                  <span className="text-[9.5px] text-[#8b7b6b] font-medium">Venue &amp; Schedule</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c]">
                        Wedding Date *
                      </label>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded">
                        Mandatory*
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#bd9661]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
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
                            ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                            : 'border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661]'
                        } rounded-lg pl-9 pr-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs font-semibold`}
                      />
                    </div>
                    {weddingDateError && (
                      <p className="text-[10.5px] text-rose-600 font-semibold mt-1">
                        ✕ Wedding Date is mandatory. Please choose your wedding date to proceed.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Estimated Guest Count
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#bd9661]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                      <input
                        type="number"
                        min={10}
                        max={800}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg pl-9 pr-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Venue Location *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#bd9661]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Fernwood Estate, Hunter Valley"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg pl-9 pr-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Celebration Style / Theme
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#bd9661]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </span>
                      <select
                        value={weddingStyle}
                        onChange={(e) => setWeddingStyle(e.target.value)}
                        className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg pl-9 pr-3 py-2 text-xs text-[#15110e] outline-none shadow-2xs cursor-pointer"
                      >
                        <option value="Modern Luxury & Black Tie">Modern Luxury &amp; Black Tie</option>
                        <option value="Classic Ballroom Romance">Classic Ballroom Romance</option>
                        <option value="Rustic Vineyard & Estate">Rustic Vineyard &amp; Estate</option>
                        <option value="Bespoke Bohemian Garden">Bespoke Bohemian Garden</option>
                        <option value="Coastal Waterfront Elegance">Coastal Waterfront Elegance</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password & Security Card */}
              <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#e8ded0] space-y-3">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#bd9661] pb-1 border-b border-[#ebdcc9] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#bd9661]" />
                    <span>Shared Portal Security</span>
                  </div>
                  <span className="text-[9.5px] text-[#8b7b6b] font-medium">Couple Login Passcode</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={coupleShowPwd ? 'text' : 'password'}
                        required
                        placeholder="Create a password"
                        value={couplePassword}
                        onChange={(e) => setCouplePassword(e.target.value)}
                        className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 pr-14 text-xs text-[#15110e] outline-none shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setCoupleShowPwd(!coupleShowPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#bd9661] font-semibold hover:underline cursor-pointer"
                      >
                        {coupleShowPwd ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="w-full bg-[#e8ded0] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${(coupleStrengthScore / 4) * 100}%`, backgroundColor: coupleStrengthColor }}
                      />
                    </div>
                    <div className="text-[10px] text-[#8b7b6b] mt-0.5">{coupleStrengthLabel}</div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={coupleShowConfirm ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password"
                        value={coupleConfirmPassword}
                        onChange={(e) => setCoupleConfirmPassword(e.target.value)}
                        className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 pr-14 text-xs text-[#15110e] outline-none shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setCoupleShowConfirm(!coupleShowConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#bd9661] font-semibold hover:underline cursor-pointer"
                      >
                        {coupleShowConfirm ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {coupleConfirmPassword && (
                      <div className={`text-[10.5px] mt-1 font-semibold ${couplePasswordsMatch ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {couplePasswordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="pt-0.5">
                <label className="flex items-start gap-2.5 text-xs text-[#6b5847] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#bd9661] focus:ring-[#bd9661]"
                  />
                  <span>
                    I agree to the <a href="#terms" className="text-[#bd9661] underline font-semibold">Terms of Service</a> and <a href="#privacy" className="text-[#bd9661] underline font-semibold">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>Continue to Plan &amp; Payment</span>
                <span>→</span>
              </button>
            </form>
          ) : coupleStep === 'payment' ? (
            /* STEP 2: COUPLE SAAS SUBSCRIPTION & PAYMENT (With Feature Accordion / Dropdowns) */
            <form onSubmit={handleProceedToMcAndAi} className="space-y-4">
              <div>
                <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-1">
                  COUPLE WEDDING SAAS PLANS
                </div>
                <h2 className="font-serif text-[22px] font-bold text-[#15110e] leading-tight mb-1">
                  Step 2: Choose Your Plan &amp; Payment
                </h2>
                <p className="text-xs text-[#8b7b6b]">
                  Subscriptions are dedicated to the Couple's portal with full MC sync and Joey AI concierge.
                </p>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center gap-2 bg-[#f5efe6] p-1 rounded-xl border border-[#ebdcc9] text-xs">
                <button
                  type="button"
                  onClick={() => setBillingCycle('onetime')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'onetime'
                      ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                      : 'text-[#6b5847] hover:text-[#15110e]'
                  }`}
                >
                  One-Time Wedding Pass
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                      : 'text-[#6b5847] hover:text-[#15110e]'
                  }`}
                >
                  Monthly Planning Pass
                </button>
              </div>

              {/* REQUIREMENT 1: Expandable Plan Accordion/Dropdown (Initially only Plan Name & Price) */}
              <div className="space-y-2.5">
                {COUPLE_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const isExpanded = expandedPlanId === plan.id;
                  const priceToDisplay = billingCycle === 'onetime' ? plan.price : plan.monthlyPrice;
                  const periodLabel = billingCycle === 'onetime' ? 'one-time pass' : '/mo';

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#bd9661] bg-[#fdfbf7] shadow-xs ring-1 ring-[#bd9661]'
                          : 'border-[#e8ded0] bg-white hover:border-[#d5c7b5]'
                      }`}
                    >
                      {/* Top Header Row: Name, Badge, Pricing, and Expand Dropdown Arrow */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="couplePlan"
                            checked={isSelected}
                            onChange={() => setSelectedPlanId(plan.id)}
                            className="text-[#bd9661] focus:ring-[#bd9661] cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm font-bold text-[#15110e]">
                                {plan.name}
                              </span>
                              {plan.badge && (
                                <span className="bg-[#bd9661] text-[#15110e] text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                                  {plan.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#8b7b6b]">
                              {plan.tagline}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="font-serif text-base font-bold text-[#15110e]">
                              ${priceToDisplay}
                            </div>
                            <div className="text-[9.5px] text-[#8b7b6b] uppercase">
                              {periodLabel}
                            </div>
                          </div>

                          {/* Dropdown Chevron button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPlanId(isExpanded ? null : plan.id);
                            }}
                            className="p-1 rounded text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#f0ebe3] transition-colors cursor-pointer"
                            title={isExpanded ? 'Collapse features' : 'Expand features'}
                          >
                            <svg
                              width="16"
                              height="16"
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

                      {/* Expandable Features Dropdown */}
                      {isExpanded && (
                        <div className="mt-2.5 pt-2.5 border-t border-[#f0ede6] transition-all">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                            Plan Features:
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-[#524438]">
                            {plan.features.map((feat, i) => (
                              <li key={i} className="flex items-center gap-1.5">
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

              {/* Stripe Payment Simulation */}
              <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#e8ded0] space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-[#ebdcc9]">
                  <span className="text-xs font-bold text-[#15110e]">
                    CREDIT CARD OR DIGITAL WALLET (STRIPE SECURE)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCardNumber('4242 •••• •••• 4242');
                      setCardExpiry('12/28');
                      setCardCvc('123');
                      setCardName(brideName || 'Sophie Carter');
                      showToast('Test card details pre-filled!', 'info');
                    }}
                    className="text-[10px] font-bold text-[#bd9661] hover:underline cursor-pointer bg-white border border-[#ebdcc9] px-2 py-0.5 rounded shadow-2xs"
                  >
                    Use Demo Test Card
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                    CARDHOLDER NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] rounded-[4px] px-3 py-1.5 text-xs outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                    CARD NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] rounded-[4px] px-3 py-1.5 text-xs outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                      EXPIRY DATE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] rounded-[4px] px-3 py-1.5 text-xs outline-none focus:border-[#bd9661]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] rounded-[4px] px-3 py-1.5 text-xs outline-none focus:border-[#bd9661]"
                    />
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="flex gap-2 pt-0.5">
                  <input
                    type="text"
                    placeholder="Promo Code (e.g. WELCOME10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-white border border-[#d5c7b5] rounded-[4px] px-3 py-1.5 text-xs uppercase outline-none focus:border-[#bd9661]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-[#15110e] text-[#dfc194] px-3 py-1.5 rounded-[4px] text-xs font-bold hover:bg-[#2b221a] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white p-2.5 rounded-lg border border-[#ebdcc9] text-xs space-y-1">
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
                    <span className="text-[#bd9661] text-sm font-serif">${finalPrice}.00 AUD</span>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setCoupleStep('registration')}
                  className="px-3 py-2 border border-[#d5c7b5] text-[#6b5847] hover:text-[#15110e] hover:bg-[#faf7f2] rounded-[4px] text-xs font-bold transition-all cursor-pointer"
                >
                  ← Back to Details
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-[4px] text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Processing Payment...' : `Pay $${finalPrice} & Proceed to MC Setup`}</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          ) : (
            /* STEP 3: MC SETUP (CHOOSE CERTIFIED MC OR BRING OWN MC) */
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-1">
                  COUPLE ONBOARDING · STEP 3 OF 3
                </div>
                <h2 className="font-serif text-[22px] font-bold text-[#15110e] leading-tight mb-1">
                  MC Setup
                </h2>
                <p className="text-xs text-[#8b7b6b]">
                  Choose from our certified wedding MCs or prefer your own host. SuperAdmin will dispatch platform credentials accordingly.
                </p>
              </div>

              {/* MC CHOICE MODE SELECTOR: CERTIFIED VS PREFER OWN MC */}
              <div className="grid grid-cols-2 gap-2 bg-[#f4efe8] p-1.5 rounded-xl border border-[#ebdcc9]">
                <button
                  type="button"
                  onClick={() => setMcChoiceMode('certified')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
                  <span>Prefer / Bring Our Own MC</span>
                </button>
              </div>

              {/* OPTION A: CHOOSE FROM CERTIFIED WEDDING MCS */}
              {mcChoiceMode === 'certified' ? (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#15110e]">
                      SELECT YOUR CERTIFIED WEDDING MC
                    </label>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsMcDropdownOpen(!isMcDropdownOpen)}
                        className="w-full bg-white border border-[#d5c7b5] hover:border-[#bd9661] rounded-xl p-3.5 flex items-center justify-between text-left transition-all cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#15110e] border border-[#bd9661] flex items-center justify-center text-[#dfc194] font-serif font-bold text-xs shrink-0 overflow-hidden">
                            {selectedMc.image ? (
                              <img src={selectedMc.image} alt={selectedMc.name} className="w-full h-full object-cover" />
                            ) : (
                              selectedMc.name.split(' ').map(n => n[0]).join('')
                            )}
                          </div>
                          <div>
                            <div className="font-serif font-bold text-sm text-[#15110e]">
                              {selectedMc.name}
                            </div>
                            <div className="text-[11.5px] text-[#7d654c] mt-0.5 flex items-center gap-1.5 font-medium">
                              <span>{selectedMc.business}</span>
                              <span className="text-[#c5b5a2]">&bull;</span>
                              <span className="text-[#bd9661] font-bold">⭐ {selectedMc.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#8b7b6b]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMcInfoModal(true);
                            }}
                            title="View MC Details"
                            aria-label="View MC Info"
                            className="w-7 h-7 rounded-full bg-[#fbf8f3] hover:bg-[#ebdcc9] text-[#7d654c] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer border border-[#d5c7b5]"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <svg
                            width="15"
                            height="15"
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

                      {/* Dropdown Menu List */}
                      {isMcDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#e8ded0] rounded-xl shadow-xl z-30 max-h-[300px] overflow-y-auto divide-y divide-[#f5f1eb]">
                          {availableMcs.map((mc) => (
                            <div
                              key={mc.id}
                              onClick={() => {
                                setSelectedMcId(mc.id);
                                setIsMcDropdownOpen(false);
                                showToast(`Selected MC: ${mc.name}`, 'info');
                              }}
                              className={`p-3.5 hover:bg-[#faf7f2] transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                                selectedMcId === mc.id ? 'bg-[#fdfbf7]' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#15110e] border border-[#bd9661] flex items-center justify-center text-[#dfc194] font-serif font-bold text-xs shrink-0 overflow-hidden">
                                  {mc.image ? (
                                    <img src={mc.image} alt={mc.name} className="w-full h-full object-cover" />
                                  ) : (
                                    mc.name.split(' ').map(n => n[0]).join('')
                                  )}
                                </div>
                                <div>
                                  <div className="font-serif font-bold text-xs text-[#15110e]">
                                    {mc.name}
                                  </div>
                                  <div className="text-[11px] text-[#7d654c] mt-0.5 flex items-center gap-1.5 font-medium">
                                    <span>{mc.business}</span>
                                    <span className="text-[#c5b5a2]">&bull;</span>
                                    <span className="text-[#bd9661] font-bold">⭐ {mc.rating}</span>
                                  </div>
                                </div>
                              </div>
                              {selectedMcId === mc.id ? (
                                <span className="text-emerald-700 font-bold text-xs shrink-0 flex items-center gap-1">
                                  ✓ Selected
                                </span>
                              ) : (
                                <span className="text-xs text-[#bd9661] hover:underline font-semibold shrink-0">
                                  Select →
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DISTINCT STYLED AI CONCIERGE BANNER (ONLY IN CERTIFIED MC VIEW) */}
                  <div className="bg-gradient-to-r from-[#fbf6ed] to-[#f6ede0] border-l-4 border-l-[#bd9661] border-y border-r border-[#dfcfb9] rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#bd9661] bg-[#181310] flex items-center justify-center shrink-0 shadow-xs ring-2 ring-[#bd9661]/20">
                        <img src="/chatbot-avatar.png" alt="Joey AI" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-xs font-bold text-[#15110e]">
                            Need help deciding? Ask Joey AI Concierge
                          </h4>
                          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#9e763a] bg-[#ebdcc9]/70 px-1.5 py-0.5 rounded border border-[#dfcca8]">
                            AI Matchmaker
                          </span>
                        </div>
                        <p className="text-[11px] text-[#786450] mt-0.5">
                          Chat live to compare host experience, 5-star reviews, and rates
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
                      className="px-3.5 py-2 bg-[#15110e] hover:bg-[#2b221a] text-[#dfc194] hover:text-white border border-[#bd9661]/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                    >
                      <span>💬</span>
                      <span>{isFloatingChatOpen ? 'Close Chat' : 'Open Chat'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* OPTION B: PREFER / BRING OWN MC */
                <div className="bg-[#faf8f5] border border-[#ebdcc9] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs animate-in fade-in duration-200">
                  <div className="border-b border-[#f0ede4] pb-2.5">
                    <h3 className="font-serif font-bold text-base text-[#15110e]">
                      Couple's Preferred Wedding MC
                    </h3>
                    <p className="text-xs text-[#8b7b6b] mt-1 leading-relaxed">
                      Prefer to have your own friend, family member, or professional MC host your wedding? Enter their contact details below.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        MC Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ownMcName}
                        onChange={(e) => setOwnMcName(e.target.value)}
                        placeholder="e.g. Anthony Rossi"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        MC Mobile / Phone Number
                      </label>
                      <input
                        type="tel"
                        value={ownMcPhone}
                        onChange={(e) => setOwnMcPhone(e.target.value)}
                        placeholder="e.g. 0412 888 777"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        MC Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={ownMcEmail}
                        onChange={(e) => setOwnMcEmail(e.target.value)}
                        placeholder="e.g. anthony.rossi@mcservices.com.au"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        Business / Agency Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={ownMcAgency}
                        onChange={(e) => setOwnMcAgency(e.target.value)}
                        placeholder="e.g. Rossi Event Hosting"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation CTA Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCoupleStep('payment')}
                  className="px-4 py-2.5 border border-[#d5c7b5] text-[#6b5847] hover:text-[#15110e] hover:bg-[#faf7f2] rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  ← Back to Plan
                </button>
                <button
                  type="button"
                  onClick={handleCompleteCoupleOnboarding}
                  disabled={isSubmitting || (mcChoiceMode === 'own' && (!ownMcName.trim() || !ownMcEmail.trim()))}
                  className="flex-1 py-3 px-5 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>
                    {isSubmitting
                      ? 'Launching Dashboard...'
                      : mcChoiceMode === 'own'
                      ? 'Confirm Preferred MC & Launch Dashboard'
                      : 'Confirm MC & Launch Dashboard'}
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom link to Login (Displayed only on initial registration step, not on payment or MC step) */}
          {(accountType === 'couple' ? coupleStep === 'registration' : mcStep === 'details') && (
            <div className="mt-5 text-center text-xs text-[#8b7b6b]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onSelectView && onSelectView('login')}
                className="text-[#bd9661] font-bold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MC INFO POP-UP MODAL (Closes when clicking outside or clicking Close) */}
      {showMcInfoModal && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowMcInfoModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e8ded0] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#15110e] text-white flex justify-between items-center border-b border-[#29211a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#241c16] border border-[#bd9661] text-[#dfc194] font-serif font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden">
                  {selectedMc.image ? (
                    <img src={selectedMc.image} alt={selectedMc.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedMc.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div>
                  <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                    MASTER OF CEREMONIES PROFILE
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <span>{selectedMc.name}</span>
                    {selectedMc.recommended && (
                      <span className="bg-[#bd9661] text-[#15110e] text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMcInfoModal(false)}
                className="text-white/70 hover:text-[#bd9661] text-xl font-bold cursor-pointer transition-colors p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3.5 text-xs overflow-y-auto max-h-[75vh]">
              {/* Key Details Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Business / Agency</div>
                  <div className="text-[#15110e] font-semibold mt-0.5">{selectedMc.business}</div>
                </div>
                <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Standard Fee</div>
                  <div className="text-[#bd9661] font-bold text-sm mt-0.5">
                    {selectedMc.price > 0 ? `$${selectedMc.price.toLocaleString()} AUD` : '$0 Platform Fee'}
                  </div>
                </div>
                <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Rating &amp; Reviews</div>
                  <div className="text-[#15110e] font-semibold mt-0.5">
                    ⭐ {selectedMc.rating} ({selectedMc.reviews} weddings)
                  </div>
                </div>
                <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Primary Region</div>
                  <div className="text-[#15110e] font-semibold mt-0.5">{selectedMc.location}</div>
                </div>
              </div>

              {/* Experience */}
              <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#ebdcc9] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">Experience &amp; Track Record</div>
                <p className="text-[#15110e] font-medium leading-relaxed">{selectedMc.experience}</p>
              </div>

              {/* Style & Vibe */}
              <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#ebdcc9] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">Hosting Style &amp; Vibe</div>
                <p className="text-[#524438] leading-relaxed">{selectedMc.vibe}</p>
              </div>

              {/* Specialties */}
              <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#ebdcc9] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">Key Specialties</div>
                <p className="text-[#524438] leading-relaxed">{selectedMc.specialty}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-[#faf8f5] border-t border-[#e8ded0] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowMcInfoModal(false)}
                className="py-1.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded text-xs font-bold transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JOEY AI CHAT MODAL (TRIGGERED ONLY VIA 'OPEN CHAT' IN CERTIFIED MC SETUP) */}
      {accountType === 'couple' && coupleStep === 'choose_mc' && mcChoiceMode === 'certified' && isFloatingChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[410px] max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-[#bd9661] shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4">
              {/* Floating Header */}
              <div className="bg-[#15110e] text-white p-3.5 flex items-center justify-between border-b border-[#29211a]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#bd9661] bg-[#181310] flex items-center justify-center shrink-0">
                    <img src="/chatbot-avatar.png" alt="Joey AI" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-[#dfc194]">Joey AI · MC Matchmaker Concierge</h4>
                    <p className="text-[10px] text-[#a8988a]">Ask about MC experience, 5.0 reviews, rates &amp; styles</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFloatingChatOpen(false)}
                  className="text-[#a8988a] hover:text-white p-1 transition-colors text-lg font-bold leading-none cursor-pointer"
                  title="Minimize Joey AI"
                >
                  &times;
                </button>
              </div>

              {/* Messages Area */}
              <div className="p-3.5 space-y-2.5 max-h-[290px] min-h-[200px] overflow-y-auto text-xs bg-[#fdfbf7]">
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'couple' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2 leading-relaxed shadow-2xs text-xs ${
                        m.sender === 'couple'
                          ? 'bg-[#15110e] text-[#dfc194] rounded-br-xs'
                          : 'bg-white text-[#15110e] border border-[#ebdcc9] rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">
                        {m.text.split('**').map((part, i) =>
                          i % 2 === 1 ? <strong key={i} className="text-[#bd9661]">{part}</strong> : part
                        )}
                      </div>
                    </div>
                    <span className="text-[9px] text-[#a69888] mt-0.5 px-1">{m.time}</span>
                  </div>
                ))}

                {isChatTyping && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8b7b6b] bg-white border border-[#ebdcc9] w-fit px-2.5 py-1 rounded-xl">
                    <span>Joey is typing</span>
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 bg-[#bd9661] rounded-full animate-bounce" />
                      <span className="w-1 h-1 bg-[#bd9661] rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1 h-1 bg-[#bd9661] rounded-full animate-bounce [animation-delay:0.3s]" />
                    </span>
                  </div>
                )}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* Suggestions */}
              <div className="px-3 py-2 bg-[#f4efe8] border-t border-[#ebdcc9] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                <span className="text-[10px] text-[#8b7b6b] uppercase font-bold shrink-0">Ask:</span>
                {[
                  'Who is available on my date?',
                  availableMcs.some(m => m.id === 'mc_robert') ? 'Why choose Robert Galati?' : 'Who has the best 5-star reviews?',
                  'Which available MCs are under $1,800?',
                  'Can I bring my own MC?',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSendChatMessage(chip)}
                    className="bg-white hover:bg-[#faf6ee] text-[#6b5847] hover:text-[#15110e] border border-[#d5c7b5] text-[10px] px-2.5 py-1 rounded-full shrink-0 transition-colors cursor-pointer shadow-2xs font-medium"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="p-2.5 bg-white border-t border-[#ebdcc9] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Joey about MCs..."
                  className="flex-1 bg-[#fbf9f6] border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="bg-[#15110e] disabled:opacity-40 hover:bg-[#2b221a] text-[#dfc194] px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Send</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      );
    }
