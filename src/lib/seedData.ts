import { DemoState, SaaSPlan, McTransaction } from './types';

export const initialPlans: SaaSPlan[] = [
  {
    id: "plan_couple_essential",
    key: "Essential",
    tagline: "Smart Wedding Essentials",
    price: 149,
    billingCycle: "AUD / one-time pass",
    category: "couple",
    features: [
      "Guest list manager with Adults & Kids RSVP counts",
      "Digital QaRd mobile invitations & dietary tracking",
      "Gift & Wishing Well ledger (0% platform fee)",
      "Standard seating table builder",
      "Email RSVP reminders",
    ],
  },
  {
    id: "plan_couple_signature",
    key: "Signature Pro",
    tagline: "Complete Couple & MC Experience",
    price: 299,
    billingCycle: "AUD / one-time pass",
    badge: "MOST POPULAR",
    featured: true,
    category: "couple",
    features: [
      "Everything in Essential",
      "Joey AI Wedding Concierge & Prompting Assistant",
      "Smart Seating Planner with AI auto-seat solver",
      "MC Matchmaker & Live Run-Sheet Collaboration",
      "Live Celebration Feed & Photo Sharing for guests",
      "Digital Wedding Vault & post-wedding keepsake",
    ],
  },
  {
    id: "plan_couple_couture",
    key: "Couture Luxury",
    tagline: "VIP Concierge & Full-Service Suite",
    price: 499,
    billingCycle: "AUD / one-time pass",
    category: "couple",
    features: [
      "Everything in Signature Pro",
      "VIP MC Concierge Matchmaking & custom contract",
      "Multi-Event Run Sheets (Rehearsal, Reception, Recovery Brunch)",
      "Custom domain & personalized couple branding",
      "Priority 24/7 Australian wedding support concierge",
      "Full export package (CSV, PDF run sheets, table cards)",
    ],
  },
  {
    id: "plan_mc_starter",
    key: "Community Host (Base)",
    tagline: "Essential Private MC Host",
    price: 0,
    billingCycle: "AUD / free",
    badge: "BASE PLAN",
    category: "mc",
    features: [
      "1 active wedding coordination at a time",
      "Interactive live run sheets & timing cues",
      "Direct client runsheet sync with nominated couple",
      "⚠️ Unlisted — Does NOT appear in Public MC Directory",
      "Standard community support",
    ],
  },
  {
    id: "plan_mc_pro",
    key: "Pro Master of Ceremonies",
    tagline: "Certified Public Directory Host",
    price: 149,
    billingCycle: "AUD / mo",
    badge: "MOST POPULAR",
    featured: true,
    category: "mc",
    features: [
      "★ Certified Public Directory Listing (Bookable by couples)",
      "Up to 5 active weddings simultaneously",
      "Joey AI Matchmaker recommendations to couples",
      "Stripe Connect automated client payout split",
      "Live interactive run sheets & speech prompter",
    ],
  },
  {
    id: "plan_mc_agency",
    key: "Boutique Agency / Host",
    tagline: "Top-Tier Agency & Multi-Coordinator Suite",
    price: 299,
    billingCycle: "AUD / mo",
    badge: "ENTERPRISE",
    category: "mc",
    features: [
      "★ Priority Top Featured Placement in Couple Directory",
      "Unlimited active weddings simultaneously",
      "Multi-coordinator staff logins & permissions",
      "Automated Xero accounting sync for invoices",
      "Custom white-label branding on runsheets",
      "Dedicated VIP Account Concierge",
    ],
  },
];

export const initialMcTransactions: McTransaction[] = [
  {
    id: "TXN-8841",
    date: "23 Oct 2026, 09:15",
    tenantId: "ten1",
    mcName: "Robert Galati",
    businessName: "Galati MC & Entertainment",
    type: "subscription",
    description: "Pro Plan Monthly SaaS Subscription Renewal",
    amount: 299.00,
    platformFee: 7.48,
    netAmount: 291.52,
    status: "Paid",
    paymentMethod: "Stripe (Mastercard •••• 8812)",
    xeroStatus: "Synced",
    xeroInvoiceId: "XERO-SUB-1092"
  },
  {
    id: "TXN-8835",
    date: "21 Oct 2026, 16:40",
    tenantId: "ten1",
    mcName: "Robert Galati",
    businessName: "Galati MC & Entertainment",
    type: "client_invoice",
    description: "Wedding MC & Reception Host: Sophie & James (INV-1081)",
    amount: 1850.00,
    platformFee: 46.25,
    netAmount: 1803.75,
    status: "Settled",
    paymentMethod: "Stripe (Visa •••• 4242)",
    xeroStatus: "Synced",
    xeroInvoiceId: "XERO-INV-8835",
    weddingCouple: "Sophie & James",
    invoiceId: "INV-1081"
  },
  {
    id: "TXN-8839",
    date: "22 Oct 2026, 14:10",
    tenantId: "ten2",
    mcName: "Marcus Thorne",
    businessName: "Coastal Celebrations MC",
    type: "subscription",
    description: "Pro Plan Monthly SaaS Subscription Renewal",
    amount: 299.00,
    platformFee: 7.48,
    netAmount: 291.52,
    status: "Paid",
    paymentMethod: "Stripe (Amex •••• 3001)",
    xeroStatus: "Synced",
    xeroInvoiceId: "XERO-SUB-1091"
  },
  {
    id: "TXN-8831",
    date: "20 Oct 2026, 18:25",
    tenantId: "ten3",
    mcName: "Elena Rostova",
    businessName: "Sydney Vows & Beats",
    type: "subscription",
    description: "Standard Plan Monthly SaaS Subscription Renewal",
    amount: 199.00,
    platformFee: 4.98,
    netAmount: 194.02,
    status: "Paid",
    paymentMethod: "Stripe (Visa •••• 9021)",
    xeroStatus: "Synced",
    xeroInvoiceId: "XERO-SUB-1090"
  },
  {
    id: "TXN-8828",
    date: "19 Oct 2026, 13:45",
    tenantId: "ten2",
    mcName: "Marcus Thorne",
    businessName: "Coastal Celebrations MC",
    type: "client_invoice",
    description: "Wedding Host Full Package: Liam & Chloe",
    amount: 2100.00,
    platformFee: 52.50,
    netAmount: 2047.50,
    status: "Settled",
    paymentMethod: "Stripe (Visa •••• 1144)",
    xeroStatus: "Synced",
    xeroInvoiceId: "XERO-INV-8828",
    weddingCouple: "Liam & Chloe"
  },
  {
    id: "TXN-8822",
    date: "18 Oct 2026, 11:20",
    tenantId: "ten1",
    mcName: "Robert Galati",
    businessName: "Galati MC & Entertainment",
    type: "client_invoice",
    description: "Reception Coordination Deposit: Aisha & Marcus (INV-1082)",
    amount: 1650.00,
    platformFee: 41.25,
    netAmount: 1608.75,
    status: "Paid",
    paymentMethod: "Direct Bank Debit",
    xeroStatus: "Synced",
    xeroInvoiceId: "XERO-INV-8822",
    weddingCouple: "Aisha & Marcus",
    invoiceId: "INV-1082"
  },
  {
    id: "TXN-8815",
    date: "16 Oct 2026, 09:30",
    tenantId: "ten2",
    mcName: "Marcus Thorne",
    businessName: "Coastal Celebrations MC",
    type: "client_invoice",
    description: "Boutique Reception Host: Sarah & Luke",
    amount: 1750.00,
    platformFee: 43.75,
    netAmount: 1706.25,
    status: "Paid",
    paymentMethod: "Apple Pay",
    xeroStatus: "Synced",
    xeroInvoiceId: "XERO-INV-8815",
    weddingCouple: "Sarah & Luke"
  },
  {
    id: "TXN-8810",
    date: "15 Oct 2026, 14:05",
    tenantId: "ten1",
    mcName: "Robert Galati",
    businessName: "Galati MC & Entertainment",
    type: "platform_fee",
    description: "Tap & Toast 2.5% Platform Take: INV-1081 & INV-1082",
    amount: 87.50,
    platformFee: 0.00,
    netAmount: 87.50,
    status: "Settled",
    paymentMethod: "Stripe Split Payout",
    xeroStatus: "Synced",
    xeroInvoiceId: "XERO-FEE-8810"
  },
  {
    id: "TXN-8805",
    date: "14 Oct 2026, 15:50",
    tenantId: "ten3",
    mcName: "Elena Rostova",
    businessName: "Sydney Vows & Beats",
    type: "client_invoice",
    description: "Bilingual Ceremony & Reception Host: David & Mei",
    amount: 1800.00,
    platformFee: 45.00,
    netAmount: 1755.00,
    status: "Settled",
    paymentMethod: "Direct Debit",
    xeroStatus: "Synced",
    xeroInvoiceId: "XERO-INV-8805",
    weddingCouple: "David & Mei"
  },
  {
    id: "TXN-8795",
    date: "12 Oct 2026, 10:00",
    tenantId: "ten1",
    mcName: "Robert Galati",
    businessName: "Galati MC & Entertainment",
    type: "client_invoice",
    description: "Bridal Host Deposit: Emma & Tom (INV-1083)",
    amount: 1950.00,
    platformFee: 48.75,
    netAmount: 1901.25,
    status: "Pending",
    paymentMethod: "EFT / Bank Wire",
    xeroStatus: "Pending",
    weddingCouple: "Emma & Tom",
    invoiceId: "INV-1083"
  },
  {
    id: "TXN-8780",
    date: "01 Oct 2026, 08:00",
    tenantId: "ten4",
    mcName: "Julian Brooks",
    businessName: "Melbourne Elite Hosts",
    type: "subscription",
    description: "Starter Plan Subscription Charge (Payment Failed - Expired Card)",
    amount: 99.00,
    platformFee: 0.00,
    netAmount: 0.00,
    status: "Pending",
    paymentMethod: "Stripe (Visa •••• 0019)",
    xeroStatus: "Pending"
  }
];

export const SEED_DATA: DemoState = {
  version: 2,
  plans: initialPlans,
  currentWeddingId: "w1",
  weddings: [
    {
      id: "w1",
      couple: "Sophie & James",
      partner1: "Sophie",
      partner2: "James",
      date: "2026-11-14T14:00:00",
      dateDisplay: "14 Nov 2026",
      timeDisplay: "2:00 PM",
      venue: "Fernwood Estate, Southern Highlands",
      venueAddress: "124 Range Road, Mittagong NSW 2575",
      parking: "Complimentary on-site guest parking is available at the Main Lawn entrance. Follow the directional signs upon arrival.",
      dressCode: "Black Tie Optional / Formal Elegance",
      registry: "Digital wishing well via Gift & Go",
      invited: 118,
      status: "Finalising",
      selectedMc: {
        id: "mc_robert_galati",
        name: "Robert Galati",
        businessName: "Galati MC & Entertainment",
        email: "robert@galati.demo",
        phone: "0418 223 901",
        rate: 1850,
        style: "Premier Luxury & High Energy"
      },
      subscriptionPlan: {
        id: "plan_couple_signature",
        name: "Signature Pro Couple Plan",
        price: 299,
        billing: "AUD / one-time pass",
        status: "active",
        paymentMethod: "Stripe (Mastercard •••• 4242)",
        features: [
          "Joey AI Wedding Concierge",
          "AI Seating Optimization",
          "MC Live Run-Sheet Collaboration",
          "Adults & Kids RSVP Tracker",
          "0% Fee Digital Wishing Well"
        ]
      },
      giftingPresets: [50, 100, 150, 250],
      danceFloorPos: { x: 50, y: 50 },
      savedSeatingArrangements: [
        {
          id: 'arr_1',
          weddingId: 'w1',
          name: 'Seating Arrangement 1 (Classic Ballroom)',
          savedAt: '2026-10-25 11:30',
          savedBy: 'Sophie & James (Couple)',
          role: 'couple',
          danceFloorPos: { x: 50, y: 50 },
          notes: 'Classic banquet layout with central dance floor and balanced round/rectangle tables',
          tables: [
            { id: 'head', weddingId: 'w1', name: 'HEAD TABLE', capacity: 8, isHead: true, shape: 'king', category: 'Bridal Party', zone: 'Stage & VIP Wing', x: 50, y: 15 },
            { id: 'table_1', weddingId: 'w1', name: 'Table 1', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 25, y: 35 },
            { id: 'table_2', weddingId: 'w1', name: 'Table 2', capacity: 8, isHead: false, shape: 'round', category: 'Family', zone: 'Left Terrace', x: 40, y: 35 },
            { id: 'table_3', weddingId: 'w1', name: 'Table 3', capacity: 8, isHead: false, shape: 'rectangular', category: 'Friends', zone: 'Right Garden', x: 60, y: 35 },
            { id: 'table_4', weddingId: 'w1', name: 'Table 4', capacity: 8, isHead: false, shape: 'round', category: 'Family', zone: 'Right Garden', x: 75, y: 35 },
            { id: 'table_5', weddingId: 'w1', name: 'Table 5', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Left Terrace', x: 25, y: 65 },
            { id: 'table_6', weddingId: 'w1', name: 'Table 6', capacity: 8, isHead: false, shape: 'rectangular', category: 'Family', zone: 'Center Ballroom', x: 40, y: 65 },
            { id: 'table_7', weddingId: 'w1', name: 'Table 7', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 60, y: 65 }
          ],
          guestAssignments: [
            { guestId: 'g1', tableId: 'head', seatIndex: 0 },
            { guestId: 'g2', tableId: 'head', seatIndex: 1 },
            { guestId: 'g3', tableId: 'head', seatIndex: 2 },
            { guestId: 'g4', tableId: 'head', seatIndex: 3 },
            { guestId: 'g5', tableId: 'table_1', seatIndex: 0 },
            { guestId: 'g6', tableId: 'table_1', seatIndex: 1 },
            { guestId: 'g7', tableId: 'table_2', seatIndex: 0 },
            { guestId: 'g8', tableId: 'table_2', seatIndex: 1 },
            { guestId: 'g9', tableId: 'table_3', seatIndex: 0 },
            { guestId: 'g10', tableId: 'table_4', seatIndex: 0 }
          ]
        },
        {
          id: 'arr_2',
          weddingId: 'w1',
          name: 'Arrangement 2 (MC Pacing Optimized)',
          savedAt: '2026-10-25 16:45',
          savedBy: 'Robert Galati (MC)',
          role: 'mc',
          danceFloorPos: { x: 50, y: 50 },
          notes: 'VIP family tables closer to bridal stage for smooth microphone handover during speeches',
          tables: [
            { id: 'head', weddingId: 'w1', name: 'HEAD TABLE', capacity: 8, isHead: true, shape: 'king', category: 'Bridal Party', zone: 'Stage & VIP Wing', x: 50, y: 12 },
            { id: 'table_2', weddingId: 'w1', name: 'Table 2', capacity: 8, isHead: false, shape: 'round', category: 'Family', zone: 'VIP Stage Left', x: 28, y: 28 },
            { id: 'table_4', weddingId: 'w1', name: 'Table 4', capacity: 8, isHead: false, shape: 'round', category: 'Family', zone: 'VIP Stage Right', x: 72, y: 28 },
            { id: 'table_1', weddingId: 'w1', name: 'Table 1', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 22, y: 48 },
            { id: 'table_3', weddingId: 'w1', name: 'Table 3', capacity: 8, isHead: false, shape: 'rectangular', category: 'Friends', zone: 'Right Garden', x: 78, y: 48 },
            { id: 'table_5', weddingId: 'w1', name: 'Table 5', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Left Terrace', x: 28, y: 72 },
            { id: 'table_6', weddingId: 'w1', name: 'Table 6', capacity: 8, isHead: false, shape: 'rectangular', category: 'Family', zone: 'Center Ballroom', x: 50, y: 74 },
            { id: 'table_7', weddingId: 'w1', name: 'Table 7', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 72, y: 72 }
          ],
          guestAssignments: [
            { guestId: 'g1', tableId: 'head', seatIndex: 0 },
            { guestId: 'g2', tableId: 'head', seatIndex: 1 },
            { guestId: 'g3', tableId: 'head', seatIndex: 2 },
            { guestId: 'g4', tableId: 'head', seatIndex: 3 },
            { guestId: 'g7', tableId: 'table_2', seatIndex: 0 },
            { guestId: 'g8', tableId: 'table_2', seatIndex: 1 },
            { guestId: 'g10', tableId: 'table_4', seatIndex: 0 },
            { guestId: 'g5', tableId: 'table_1', seatIndex: 0 },
            { guestId: 'g6', tableId: 'table_1', seatIndex: 1 },
            { guestId: 'g9', tableId: 'table_3', seatIndex: 0 }
          ]
        }
      ],
      aiOnboardingAnswers: [
        {
          questionId: "vibe",
          question: "What overall vibe and energy do you envision for your reception?",
          answer: "High-energy celebration with sophisticated black-tie elegance and full dance floor participation.",
          category: "Atmosphere & Energy",
          audited: true
        },
        {
          questionId: "mc_role",
          question: "How involved should your MC be during the evening formalities?",
          answer: "Active host: engaging crowd during games, keeping speeches strictly on time, and leading high-energy grand entrance.",
          category: "MC Responsibilities",
          audited: true
        },
        {
          questionId: "traditions",
          question: "Are there any bilingual requirements or special cultural traditions?",
          answer: "Bilingual Italian-Australian welcome remarks, tarantella group dance, and traditional wedding cake toast.",
          category: "Culture & Formality",
          audited: true
        },
        {
          questionId: "guests_mix",
          question: "What is your anticipated mix of adult vs children attendees?",
          answer: "Predominantly adults (approx. 90%) with 8-10 kids seated at designated family-friendly tables with activity packs.",
          category: "Guest Demographics",
          audited: true
        }
      ],
      tasks: [
        { id: "t1", text: "Send save-the-dates", completed: true, due: "" },
        { id: "t2", text: "Finalise table 9 & 10 seating", completed: false, due: "Due Fri" },
        { id: "t3", text: "Send RSVP reminder to 22 guests", completed: false, due: "Due Mon" }
      ],
      runSheet: [
        { id: "rs1", time: "13:30", note: "MC arrival, audio check with AV tech & Celebrant Sarah", done: false },
        { id: "rs2", time: "14:00", note: "Guest seating & ceremony processional commences", done: false },
        { id: "rs3", time: "14:45", note: "Announce cocktail hour, direct guests to Verandah for canapés & bar", done: false },
        { id: "rs4", time: "15:45", note: "Sound dinner bell, usher guests into Grand Pavilion", done: false },
        { id: "rs5", time: "16:00", note: "Grand Entrance introduction for bridal party & Sophie & James", done: false },
        { id: "rs6", time: "16:15", note: "Welcome remarks & housekeeping, introduce entrée service", done: false },
        { id: "rs7", time: "17:30", note: "Call for main speeches: Father of the Bride, Maid of Honour, Best Man", done: false },
        { id: "rs8", time: "19:15", note: "Invite couple for Cake Cutting, direct guests to Dance Floor for First Dance", done: false },
        { id: "rs9", time: "22:15", note: "Last drinks call & organise guests with sparklers for courtyard send-off", done: false }
      ],
      privateRunSheet: [
        { id: "pmc1", time: "13:30", activity: "MC Arrival & AV Sound Check", notes: "Run sound check on cordless mic #1 & #2 with AV tech Dave. Test Celebrant Sarah's lavalier mic.", privateNotes: "PA speaker #3 has minor ground hum when dimmers are at 50%; keep master gain at -3dB.", done: false, order: 1 },
        { id: "pmc2", time: "14:00", activity: "Guest Seating & Ceremony Processional", notes: "Strings quartet plays processional. Ushers guide front rows for VIP parents.", privateNotes: "Grandmother Arthur requires walking assistance; ensure front row aisle 1 is clear.", done: false, order: 2 },
        { id: "pmc3", time: "14:45", activity: "Cocktail Hour Announcement", notes: "Direct guests to Verandah for canapés, champagne & acoustic duo.", privateNotes: "Bride's father has surprise vintage Jaguar parked in courtyard for quick photo at 15:10.", done: false, order: 3 },
        { id: "pmc4", time: "15:45", activity: "Sound Dinner Bell & Seating Call", notes: "Sound luxury brass chime. Encourage guests to find their circular tables.", privateNotes: "Caterer Head Chef Marco confirmed main course plating strictly starts at 16:30.", done: false, order: 4 },
        { id: "pmc5", time: "16:00", activity: "Grand Entrance: Bridal Party & Couple", notes: "High energy entrance song: 'Higher Love' (Kygo remix). Hype crowd applause.", privateNotes: "Couple enters through French glass doors on South terrace, not main hall foyer.", done: false, order: 5 },
        { id: "pmc6", time: "16:15", activity: "MC Welcome Remarks & Housekeeping", notes: "Warm welcome, emergency exits, bar closing time (22:00), digital wishing well QR reminder.", privateNotes: "Keep remarks under 3 minutes; kitchen is ready with hot entrée drop immediately after.", done: false, order: 6 },
        { id: "pmc7", time: "17:30", activity: "Speeches: Parents & Bridal Party", notes: "1. Father of Bride (David), 2. Maid of Honour (Chloe), 3. Best Man (Harrison).", privateNotes: "Best Man Harrison requested slideshow cue on projector right after slide 4 joke.", done: false, order: 7 },
        { id: "pmc8", time: "19:15", activity: "Cake Cutting & First Dance", notes: "Invite guests to surround dance floor. First dance: 'Lover' by Taylor Swift.", privateNotes: "Sparkler cold-fountain machines 1 & 2 trigger on chorus 2 at 1:42 mark.", done: false, order: 8 },
        { id: "pmc9", time: "22:15", activity: "Last Drinks & Courtyard Sparkler Send-Off", notes: "Final DJ anthem, marshal guests outside with 45cm wedding sparklers.", privateNotes: "Getaway vintage car driver Greg on mobile 0411 999 888 parked at circular driveway.", done: false, order: 9 }
      ]
    },
    {
      id: "w2",
      couple: "Aisha & Marcus",
      partner1: "Aisha",
      partner2: "Marcus",
      date: "2027-05-02T15:00:00",
      dateDisplay: "2 May 2027",
      timeDisplay: "3:00 PM",
      venue: "Doltone House, Sydney",
      venueAddress: "Jones Bay Wharf, Pyrmont NSW",
      parking: "Valet parking available at Jones Bay Wharf.",
      dressCode: "Cocktail Attire",
      registry: "Gift & Go wishing well",
      invited: 86,
      confirmed: 46,
      status: "On track",
      tasks: [
        { id: "t21", text: "Book floral designer", completed: true, due: "" },
        { id: "t22", text: "Send digital invitations", completed: true, due: "" },
        { id: "t23", text: "Taste menu options", completed: false, due: "Due next month" }
      ],
      runSheet: [
        { id: "rs21", time: "14:30", note: "MC setup & audio check", done: false },
        { id: "rs22", time: "15:00", note: "Ceremony begins", done: false }
      ],
      privateRunSheet: [
        { id: "pmc_w2_1", time: "14:00", activity: "MC Arrival & Doltone Wharf Sound Check", notes: "Check wireless mic coverage across terrace and grand ballroom.", privateNotes: "Audio tech Dave is at the back mixing console. Master fader preset 3.", done: false, order: 1 },
        { id: "pmc_w2_2", time: "14:45", activity: "Waterfront Cocktail Reception", notes: "Direct guests to outdoor wharf promenade for sparkling wine and canapés.", privateNotes: "Bride & Groom arrive by water taxi at East pier around 15:15.", done: false, order: 2 },
        { id: "pmc_w2_3", time: "15:30", activity: "Ballroom Grand Entrance", notes: "Welcome wedding party followed by Aisha & Marcus.", privateNotes: "Smoke fountains cue on final chorus drop.", done: false, order: 3 },
        { id: "pmc_w2_4", time: "17:00", activity: "Speeches & Champagne Toast", notes: "Father of the Bride, Best Man, followed by Groom.", privateNotes: "Ensure roaming microphone is sanitized and ready for parents table.", done: false, order: 4 },
        { id: "pmc_w2_5", time: "19:30", activity: "Cake Cutting & First Dance", notes: "Invite all guests to surround center dance floor.", privateNotes: "First dance song: Until I Found You (acoustic version).", done: false, order: 5 }
      ]
    },
    {
      id: "w3",
      couple: "Emma & Tom",
      partner1: "Emma",
      partner2: "Tom",
      date: "2027-06-20T14:30:00",
      dateDisplay: "20 Jun 2027",
      timeDisplay: "2:30 PM",
      venue: "Dunbar House, Watsons Bay",
      venueAddress: "9 Marine Parade, Watsons Bay NSW",
      parking: "Robertson Park street parking and Watsons Bay ferry wharf.",
      dressCode: "Lounge Suit / Garden Formal",
      registry: "Gift & Go wishing well",
      invited: 140,
      confirmed: 31,
      status: "Planning",
      tasks: [
        { id: "t31", text: "Confirm celebrant", completed: true, due: "" },
        { id: "t32", text: "Draft guest list", completed: false, due: "Due next week" }
      ],
      runSheet: [
        { id: "rs31", time: "14:00", note: "Guest arrival at Dunbar lawn", done: false }
      ],
      privateRunSheet: [
        { id: "pmc_w3_1", time: "13:30", activity: "MC Sound & Heritage Lawn Check", notes: "Test battery PA on outdoor fig tree lawn.", privateNotes: "Check ferry frequency band to avoid maritime radio static.", done: false, order: 1 },
        { id: "pmc_w3_2", time: "14:30", activity: "Garden Lawn Ceremony", notes: "Acoustic duo begins prelude. Welcome guests.", privateNotes: "Reserved seats for grandparents in front row left.", done: false, order: 2 },
        { id: "pmc_w3_3", time: "16:00", activity: "Harbour Balcony Canapés", notes: "Announce group family portrait under historic fig tree.", privateNotes: "Golden hour sunset lighting is at 16:45.", done: false, order: 3 },
        { id: "pmc_w3_4", time: "17:30", activity: "Heritage Dining Room Seating Call", notes: "Sound traditional brass dinner bell. Usher guests inside.", privateNotes: "Chef Marco confirmed entrée plating starts strictly 17:45.", done: false, order: 4 }
      ]
    },
    {
      id: "w4",
      couple: "Katie & Rob",
      partner1: "Katie",
      partner2: "Rob",
      date: "2027-07-11T15:00:00",
      dateDisplay: "11 Jul 2027",
      timeDisplay: "3:00 PM",
      venue: "Dunbar House, Watsons Bay",
      venueAddress: "9 Marine Parade, Watsons Bay NSW",
      parking: "Dunbar House dedicated parking bays.",
      dressCode: "Black Tie",
      registry: "Gift & Go wishing well",
      invited: 95,
      confirmed: 9,
      status: "Planning",
      tasks: [
        { id: "t41", text: "Lock in photographer", completed: false, due: "Due in 2 weeks" }
      ],
      runSheet: [
        { id: "rs41", time: "14:30", note: "Prelude music starts", done: false }
      ]
    }
  ],
  tables: [
    // Wedding 1: Sophie & James (w1)
    { id: "head", weddingId: "w1", name: "HEAD TABLE", capacity: 8, isHead: true, shape: 'king', category: 'Bridal Party', zone: 'Stage & VIP Wing', x: 50, y: 15 },
    { id: "table_1", weddingId: "w1", name: "Table 1", capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 25, y: 35 },
    { id: "table_2", weddingId: "w1", name: "Table 2", capacity: 8, isHead: false, shape: 'round', category: 'Family', zone: 'Left Terrace', x: 40, y: 35 },
    { id: "table_3", weddingId: "w1", name: "Table 3", capacity: 8, isHead: false, shape: 'rectangular', category: 'Friends', zone: 'Right Garden', x: 60, y: 35 },
    { id: "table_4", weddingId: "w1", name: "Table 4", capacity: 8, isHead: false, shape: 'round', category: 'Family', zone: 'Right Garden', x: 75, y: 35 },
    { id: "table_5", weddingId: "w1", name: "Table 5", capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Left Terrace', x: 25, y: 65 },
    { id: "table_6", weddingId: "w1", name: "Table 6", capacity: 8, isHead: false, shape: 'rectangular', category: 'Family', zone: 'Center Ballroom', x: 40, y: 65 },
    { id: "table_7", weddingId: "w1", name: "Table 7", capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 60, y: 65 },

    // Wedding 2: Aisha & Marcus (w2)
    { id: "w2_head", weddingId: "w2", name: "HEAD TABLE", capacity: 8, isHead: true, shape: 'king', category: 'Bridal Party', zone: 'Harbour Stage', x: 50, y: 15 },
    { id: "w2_t1", weddingId: "w2", name: "Table 1", capacity: 10, isHead: false, shape: 'round', category: 'Family', zone: 'Harbour Terrace', x: 25, y: 35 },
    { id: "w2_t2", weddingId: "w2", name: "Table 2", capacity: 10, isHead: false, shape: 'round', category: 'Friends', zone: 'Harbour Terrace', x: 75, y: 35 },
    { id: "w2_t3", weddingId: "w2", name: "Table 3", capacity: 10, isHead: false, shape: 'rectangular', category: 'Colleagues', zone: 'Harbour Terrace', x: 50, y: 75 },

    // Wedding 3: Emma & Tom (w3)
    { id: "w3_head", weddingId: "w3", name: "HEAD TABLE", capacity: 8, isHead: true, shape: 'king', category: 'Bridal Party', zone: 'Lawn Pavilion', x: 50, y: 15 },
    { id: "w3_t1", weddingId: "w3", name: "Table 1", capacity: 12, isHead: false, shape: 'rectangular', category: 'Family', zone: 'Lawn Pavilion', x: 30, y: 35 },
    { id: "w3_t2", weddingId: "w3", name: "Table 2", capacity: 10, isHead: false, shape: 'round', category: 'Friends', zone: 'Lawn Pavilion', x: 70, y: 35 }
  ],
  guests: [
    // Mark Johnson (The Johnson Family, Table 4 Seat 1)
    { id: "mark_johnson", name: "Mark Johnson", initials: "MJ", household: "The Johnson Family", email: "mark.johnson@example.com", phone: "0412 884 991", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "Vegetarian", song: "Signed, Sealed, Delivered - Stevie Wonder", reminderSent: false, tableId: "table_4", seatIndex: 1, category: "Bride's Family" },
    // Sarah Johnson (The Johnson Family, Table 4 Seat 2)
    { id: "sarah_johnson", name: "Sarah Johnson", initials: "SJ", household: "The Johnson Family", email: "sarah.johnson@example.com", phone: "0412 884 991", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "Gluten-Free", song: "Signed, Sealed, Delivered - Stevie Wonder", reminderSent: false, tableId: "table_4", seatIndex: 2, category: "Bride's Family" },
    // Priya Sharma (Table 4, Seat 3)
    { id: "priya", name: "Priya Sharma", initials: "PS", household: "The Sharma Family", email: "priya.sharma@example.com.au", phone: "0412 884 992", rsvpStatus: "confirmed", guestCount: 2, adults: 2, kids: 0, dietary: "Vegetarian", song: "September - Earth, Wind & Fire", reminderSent: false, tableId: "table_4", seatIndex: 3 },
    
    // Head Table (8 seats)
    { id: "g_ht1", name: "Sophie Bell", initials: "SB", household: "Sophie Bell", email: "sophie.bell@example.com", phone: "0400 111 222", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "At Last - Etta James", reminderSent: false, tableId: "head", seatIndex: 0, category: "Bridal Party" },
    { id: "g_ht2", name: "James Gordon", initials: "JG", household: "James Gordon", email: "james.gordon@example.com", phone: "0400 222 333", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "You Are The Best Thing", reminderSent: false, tableId: "head", seatIndex: 1, category: "Bridal Party" },
    { id: "g_ht3", name: "Hannah Martin", initials: "HM", household: "Hannah Martin", email: "hannah.m@example.com", phone: "0400 333 444", rsvpStatus: "confirmed", guestCount: 1, dietary: "Vegetarian", song: "Dancing Queen", reminderSent: false, tableId: "head", seatIndex: 2 },
    { id: "g_ht4", name: "Oliver Vance", initials: "OV", household: "Oliver Vance", email: "oliver.v@example.com", phone: "0400 444 555", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Mr. Brightside", reminderSent: false, tableId: "head", seatIndex: 3 },
    { id: "g_ht5", name: "Charlotte Evans", initials: "CE", household: "Charlotte Evans", email: "charlotte.e@example.com", phone: "0400 555 666", rsvpStatus: "confirmed", guestCount: 1, dietary: "Gluten-free", song: "Levitating", reminderSent: false, tableId: "head", seatIndex: 4 },
    { id: "g_ht6", name: "Liam Fletcher", initials: "LF", household: "Liam Fletcher", email: "liam.f@example.com", phone: "0400 666 777", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Uptown Funk", reminderSent: false, tableId: "head", seatIndex: 5 },
    { id: "g_ht7", name: "Grace Kelly", initials: "GK", household: "Grace Kelly", email: "grace.k@example.com", phone: "0400 777 888", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "I Wanna Dance with Somebody", reminderSent: false, tableId: "head", seatIndex: 6 },
    { id: "g_ht8", name: "Alexander Wright", initials: "AW", household: "Alexander Wright", email: "alex.w@example.com", phone: "0400 888 999", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Superstition", reminderSent: false, tableId: "head", seatIndex: 7 },

    // Table 1 (8 seated)
    { id: "g_t1_1", name: "Michael Chen", initials: "MC", household: "Michael Chen", email: "michael.chen@example.com", phone: "0411 223 901", rsvpStatus: "confirmed", guestCount: 2, dietary: "Vegetarian", song: "Stayin' Alive", reminderSent: false, tableId: "table_1", seatIndex: 0, category: "Bride's Family" },
    { id: "g_t1_2", name: "David Vance", initials: "DV", household: "David Vance", email: "david.vance@example.com", phone: "0411 223 902", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Don't Stop Me Now", reminderSent: false, tableId: "table_1", seatIndex: 1 },
    { id: "g_t1_3", name: "Jessica White", initials: "JW", household: "Jessica White", email: "jessica.white@example.com", phone: "0411 223 903", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Blinding Lights", reminderSent: false, tableId: "table_1", seatIndex: 2 },
    { id: "g_t1_4", name: "Aunty Carol Evans", initials: "AC", household: "Aunty Carol", email: "carol.evans@example.com", phone: "0411 223 904", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Sweet Caroline", reminderSent: false, tableId: "table_1", seatIndex: 3, category: "Bride's Family" },
    { id: "g_t1_5", name: "Robert King", initials: "RK", household: "Robert King", email: "robert.king@example.com", phone: "0411 223 905", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Billie Jean", reminderSent: false, tableId: "table_1", seatIndex: 4 },
    { id: "g_t1_6", name: "Lucy Palmer", initials: "LP", household: "Lucy Palmer", email: "lucy.palmer@example.com", phone: "0411 223 906", rsvpStatus: "confirmed", guestCount: 1, dietary: "Nut allergy", song: "Can't Stop the Feeling!", reminderSent: false, tableId: "table_1", seatIndex: 5 },
    { id: "g_t1_7", name: "Edward Lewis", initials: "EL", household: "Edward Lewis", email: "edward.lewis@example.com", phone: "0411 223 907", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Shake It Off", reminderSent: false, tableId: "table_1", seatIndex: 6 },
    { id: "g_t1_8", name: "Chloe Jenkins", initials: "CJ", household: "Chloe Jenkins", email: "chloe.jenkins@example.com", phone: "0411 223 908", rsvpStatus: "confirmed", guestCount: 1, dietary: "Gluten-free", song: "Single Ladies", reminderSent: false, tableId: "table_1", seatIndex: 7 },

    // Table 2 (6 seated)
    { id: "g_t2_1", name: "Nathan Knight", initials: "NK", household: "Nathan Knight", email: "nathan.k@example.com", phone: "0412 334 001", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Hey Ya!", reminderSent: false, tableId: "table_2", seatIndex: 0, category: "Groom's Family" },
    { id: "g_t2_2", name: "Georgia Hall", initials: "GH", household: "Georgia Hall", email: "georgia.h@example.com", phone: "0412 334 002", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Shut Up and Dance", reminderSent: false, tableId: "table_2", seatIndex: 1 },
    { id: "g_t2_3", name: "William Ford", initials: "WF", household: "William Ford", email: "william.f@example.com", phone: "0412 334 003", rsvpStatus: "confirmed", guestCount: 1, dietary: "Vegetarian", song: "Wonderwall", reminderSent: false, tableId: "table_2", seatIndex: 2 },
    { id: "g_t2_4", name: "Fiona Scott", initials: "FS", household: "Fiona Scott", email: "fiona.s@example.com", phone: "0412 334 004", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Happy - Pharrell", reminderSent: false, tableId: "table_2", seatIndex: 3 },
    { id: "g_t2_5", name: "George Miller", initials: "GM", household: "George Miller", email: "george.m@example.com", phone: "0412 334 005", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Sugar - Maroon 5", reminderSent: false, tableId: "table_2", seatIndex: 4 },
    { id: "g_t2_6", name: "Quinn Nelson", initials: "QN", household: "Quinn Nelson", email: "quinn.n@example.com", phone: "0412 334 006", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Crazy in Love", reminderSent: false, tableId: "table_2", seatIndex: 5 },

    // Table 3 (4 seated)
    { id: "g_t3_1", name: "Ian Patel", initials: "IP", household: "Ian Patel", email: "ian.p@example.com", phone: "0413 445 001", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "24K Magic", reminderSent: false, tableId: "table_3", seatIndex: 0, category: "Mutual Friends" },
    { id: "g_t3_2", name: "Grace Turner", initials: "GT", household: "Grace Turner", email: "grace.t@example.com", phone: "0413 445 002", rsvpStatus: "confirmed", guestCount: 1, dietary: "Gluten-free", song: "Treasure", reminderSent: false, tableId: "table_3", seatIndex: 1 },
    { id: "g_t3_3", name: "Yasmine Abbas", initials: "YA", household: "Yasmine Abbas", email: "yasmine.a@example.com", phone: "0413 445 003", rsvpStatus: "confirmed", guestCount: 1, dietary: "Halal", song: "Levitating", reminderSent: false, tableId: "table_3", seatIndex: 2 },
    { id: "g_t3_4", name: "Zachary Webb", initials: "ZW", household: "Zachary Webb", email: "zachary.w@example.com", phone: "0413 445 004", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Get Lucky", reminderSent: false, tableId: "table_3", seatIndex: 3 },

    // Table 4 (8 seated)
    { id: "g_t4_1", name: "Benjamin Ross", initials: "BR", household: "Benjamin Ross", email: "ben.ross@example.com", phone: "0414 556 001", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", song: "Good 4 U", reminderSent: false, tableId: "table_4", seatIndex: 0, category: "Work Colleagues" },
    { id: "g_t4_2", name: "Isabella Foster", initials: "IF", household: "Isabella Foster", email: "isabella.f@example.com", phone: "0414 556 002", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", song: "Valerie", reminderSent: false, tableId: "table_4", seatIndex: 7, category: "Work Colleagues" },
    { id: "g_t4_3", name: "Oliver Thomas", initials: "OT", household: "Oliver Thomas", email: "oliver.t@example.com", phone: "0414 556 003", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "Vegetarian", song: "Mamma Mia", reminderSent: false, tableId: "table_4", seatIndex: 4, category: "Work Colleagues" },
    { id: "g_t4_5", name: "Yuvraj Rao", initials: "YR", household: "Yuvraj Rao", email: "yuvraj.r@example.com", phone: "0414 556 005", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", song: "Dynamite", reminderSent: false, tableId: "table_4", seatIndex: 5, category: "Work Colleagues" },
    { id: "g_t4_6", name: "Natasha Price", initials: "NP", household: "Natasha Price", email: "natasha.p@example.com", phone: "0414 556 006", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", song: "About Damn Time", reminderSent: false, tableId: "table_4", seatIndex: 6, category: "Work Colleagues" },

    // Table 5 (4 seated)
    { id: "g_t5_1", name: "Harper Lewis", initials: "HL", household: "Harper Lewis", email: "harper.l@example.com", phone: "0415 667 001", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", song: "Dance Monkey", reminderSent: false, tableId: "table_5", seatIndex: 0 },
    { id: "g_t5_2", name: "Kian Thorne", initials: "KT", household: "Kian Thorne", email: "kian.t@example.com", phone: "0415 667 002", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", song: "Wake Me Up", reminderSent: false, tableId: "table_5", seatIndex: 1 },
    { id: "g_t5_3", name: "Chloe Lin", initials: "CL", household: "Chloe Lin", email: "chloe.l@example.com", phone: "0415 667 003", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "Gluten-free", song: "Roar", reminderSent: false, tableId: "table_5", seatIndex: 2 },
    { id: "g_t4_7", name: "Julian Taylor", initials: "JT", household: "Julian Taylor", email: "julian.t@example.com", phone: "0414 556 007", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", song: "Shape of You", reminderSent: false, tableId: "table_5", seatIndex: 3 },

    // Unassigned guests (Confirmed guests matching Screenshot 24)
    // The Chen Family (3 members: Robert, Lisa, Leo)
    { id: "robert_chen", name: "Robert Chen", initials: "RC", household: "The Chen Family", email: "robert.c@example.com", phone: "0421 991 223", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "Vegetarian", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Bride's Family" },
    { id: "lisa_chen", name: "Lisa Chen", initials: "LC", household: "The Chen Family", email: "lisa.c@example.com", phone: "0421 991 223", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Bride's Family" },
    { id: "leo_chen", name: "Leo Chen", initials: "LC", household: "The Chen Family", email: "robert.c@example.com", phone: "0421 991 223", rsvpStatus: "confirmed", guestCount: 1, adults: 0, kids: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Bride's Family" },

    { id: "g_slee", name: "Sarah Lee", initials: "SL", household: "Sarah Lee", email: "sarah.lee@example.com", phone: "0433 112 445", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },

    // Uncle David Household (5 members demo: 2 adults, 3 kids, Vegan & Nut allergy, Table 6)
    { id: "uncle_david", name: "Uncle David", initials: "UD", household: "Uncle David Household", email: "uncle.david@example.com", phone: "0412 555 888", rsvpStatus: "awaiting", guestCount: 5, adults: 2, kids: 3, dietary: "Vegan, Nut allergy", plusOne: false, reminderSent: false, tableId: "table_6", seatIndex: null, category: "Groom's Family" },

    // The Whitfield Family (4 members: David, Claire, Sam, Emma)
    { id: "david_whitfield", name: "David Whitfield", initials: "DW", household: "The Whitfield Family", email: "david.w@example.com", phone: "0414 556 778", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Groom's Family" },
    { id: "claire_whitfield", name: "Claire Whitfield", initials: "CW", household: "The Whitfield Family", email: "claire.w@example.com", phone: "0414 556 778", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Groom's Family" },
    { id: "sam_whitfield", name: "Sam Whitfield", initials: "SW", household: "The Whitfield Family", email: "david.w@example.com", phone: "0414 556 778", rsvpStatus: "confirmed", guestCount: 1, adults: 0, kids: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Groom's Family" },
    { id: "emma_whitfield", name: "Emma Whitfield", initials: "EW", household: "The Whitfield Family", email: "david.w@example.com", phone: "0414 556 778", rsvpStatus: "confirmed", guestCount: 1, adults: 0, kids: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Groom's Family" },

    { id: "g_mkapoor", name: "Maya Kapoor", initials: "MK", household: "Maya Kapoor", email: "maya.k@example.com", phone: "0400 334 556", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "Gluten-free", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },

    // The O'Neill Family (3 members: Thomas, Mary, Jack)
    { id: "thomas_oneill", name: "Thomas O'Neill", initials: "TO", household: "The O'Neill Family", email: "thomas.o@example.com", phone: "0418 776 554", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Mutual Friends" },
    { id: "mary_oneill", name: "Mary O'Neill", initials: "MO", household: "The O'Neill Family", email: "mary.o@example.com", phone: "0418 776 554", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Mutual Friends" },
    { id: "jack_oneill", name: "Jack O'Neill", initials: "JO", household: "The O'Neill Family", email: "thomas.o@example.com", phone: "0418 776 554", rsvpStatus: "confirmed", guestCount: 1, adults: 0, kids: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Mutual Friends" },

    { id: "g_jbrown", name: "Jessica Brown", initials: "JB", household: "Jessica Brown", email: "jessica.b@example.com", phone: "0422 998 112", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_lscott", name: "Liam Scott", initials: "LS", household: "Liam Scott", email: "liam.s@example.com", phone: "0411 223 344", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_ctaylor", name: "Chloe Taylor", initials: "CT", household: "Chloe Taylor", email: "chloe.t@example.com", phone: "0422 334 455", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "Vegan", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u9", name: "Daniel Miller", initials: "DM", household: "Daniel Miller", email: "daniel.m@example.com", phone: "0411 001 009", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u10", name: "Emily Davis", initials: "ED", household: "Emily Davis", email: "emily.d@example.com", phone: "0411 001 010", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "Gluten-free", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u11", name: "Lucas Wilson", initials: "LW", household: "Lucas Wilson", email: "lucas.w@example.com", phone: "0411 001 011", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u12", name: "Sophia Martinez", initials: "SM", household: "Sophia Martinez", email: "sophia.m@example.com", phone: "0411 001 012", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },

    // The Anderson Family (4 members: Noah, Sophia, Lucas, Grace)
    { id: "noah_anderson", name: "Noah Anderson", initials: "NA", household: "The Anderson Family", email: "noah.a@example.com", phone: "0411 001 013", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "Vegetarian", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Work Colleagues" },
    { id: "sophia_anderson", name: "Sophia Anderson", initials: "SA", household: "The Anderson Family", email: "sophia.a@example.com", phone: "0411 001 013", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "Vegetarian", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Work Colleagues" },
    { id: "lucas_anderson", name: "Lucas Anderson", initials: "LA", household: "The Anderson Family", email: "noah.a@example.com", phone: "0411 001 013", rsvpStatus: "confirmed", guestCount: 1, adults: 0, kids: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Work Colleagues" },
    { id: "grace_anderson", name: "Grace Anderson", initials: "GA", household: "The Anderson Family", email: "noah.a@example.com", phone: "0411 001 013", rsvpStatus: "confirmed", guestCount: 1, adults: 0, kids: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Work Colleagues" },

    { id: "g_u14", name: "Ava Thomas", initials: "AT", household: "Ava Thomas", email: "ava.t@example.com", phone: "0411 001 014", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u15", name: "Mason Taylor", initials: "MT", household: "Mason Taylor", email: "mason.t@example.com", phone: "0411 001 015", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u16", name: "Isabella Moore", initials: "IM", household: "Isabella Moore", email: "isabella.m@example.com", phone: "0411 001 016", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "Nut allergy", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },

    // The Jackson Family (3 members: Ethan, Olivia, Mason)
    { id: "ethan_jackson", name: "Ethan Jackson", initials: "EJ", household: "The Jackson Family", email: "ethan.j@example.com", phone: "0411 001 017", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Mutual Friends" },
    { id: "olivia_jackson", name: "Olivia Jackson", initials: "OJ", household: "The Jackson Family", email: "olivia.j@example.com", phone: "0411 001 017", rsvpStatus: "confirmed", guestCount: 1, adults: 1, kids: 0, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Mutual Friends" },
    { id: "mason_jackson", name: "Mason Jackson", initials: "MJ", household: "The Jackson Family", email: "ethan.j@example.com", phone: "0411 001 017", rsvpStatus: "confirmed", guestCount: 1, adults: 0, kids: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null, category: "Mutual Friends" },
    { id: "g_u18", name: "Mia Martin", initials: "MM", household: "Mia Martin", email: "mia.m@example.com", phone: "0411 001 018", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u19", name: "Aiden Lee", initials: "AL", household: "Aiden Lee", email: "aiden.l@example.com", phone: "0411 001 019", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u20", name: "Harper Perez", initials: "HP", household: "Harper Perez", email: "harper.p@example.com", phone: "0411 001 020", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u21", name: "Elijah Thompson", initials: "ET", household: "Elijah Thompson", email: "elijah.t@example.com", phone: "0411 001 021", rsvpStatus: "confirmed", guestCount: 2, dietary: "Halal", plusOne: true, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u22", name: "Evelyn White", initials: "EW", household: "Evelyn White", email: "evelyn.w@example.com", phone: "0411 001 022", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u23", name: "James Harris", initials: "JH", household: "James Harris", email: "james.h@example.com", phone: "0411 001 023", rsvpStatus: "confirmed", guestCount: 2, dietary: "None", plusOne: true, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u24", name: "Amelia Sanchez", initials: "AS", household: "Amelia Sanchez", email: "amelia.s@example.com", phone: "0411 001 024", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u25", name: "Benjamin Clark", initials: "BC", household: "Benjamin Clark", email: "benjamin.c@example.com", phone: "0411 001 025", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u26", name: "Charlotte Ramirez", initials: "CR", household: "Charlotte Ramirez", email: "charlotte.r@example.com", phone: "0411 001 026", rsvpStatus: "confirmed", guestCount: 2, dietary: "Gluten-free", plusOne: true, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u27", name: "Alexander Lewis", initials: "AL", household: "Alexander Lewis", email: "alexander.l@example.com", phone: "0411 001 027", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u28", name: "Abigail Robinson", initials: "AR", household: "Abigail Robinson", email: "abigail.r@example.com", phone: "0411 001 028", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u29", name: "Henry Walker", initials: "HW", household: "Henry Walker", email: "henry.w@example.com", phone: "0411 001 029", rsvpStatus: "confirmed", guestCount: 2, dietary: "None", plusOne: true, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u30", name: "Ella Young", initials: "EY", household: "Ella Young", email: "ella.y@example.com", phone: "0411 001 030", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u31", name: "Sebastian Allen", initials: "SA", household: "Sebastian Allen", email: "sebastian.a@example.com", phone: "0411 001 031", rsvpStatus: "confirmed", guestCount: 1, dietary: "Vegetarian", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u32", name: "Aria King", initials: "AK", household: "Aria King", email: "aria.k@example.com", phone: "0411 001 032", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    // Wedding 2: Aisha & Marcus (w2)
    { id: "g_w2_1", weddingId: "w2", name: "Aisha Al-Mansoor", initials: "AA", household: "Aisha & Marcus", email: "aisha.m@example.com", phone: "0422 111 001", rsvpStatus: "confirmed", guestCount: 1, dietary: "Halal", reminderSent: false, tableId: "w2_head", seatIndex: 0 },
    { id: "g_w2_2", weddingId: "w2", name: "Marcus Vance", initials: "MV", household: "Aisha & Marcus", email: "marcus.v@example.com", phone: "0422 111 002", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", reminderSent: false, tableId: "w2_head", seatIndex: 1 },
    { id: "g_w2_3", weddingId: "w2", name: "Tariq Al-Mansoor", initials: "TM", household: "The Al-Mansoor Family", email: "tariq.m@example.com", phone: "0422 111 003", rsvpStatus: "confirmed", guestCount: 2, dietary: "Halal", reminderSent: false, tableId: "w2_t1", seatIndex: 0 },
    { id: "g_w2_4", weddingId: "w2", name: "Fatima Al-Mansoor", initials: "FM", household: "The Al-Mansoor Family", email: "fatima.m@example.com", phone: "0422 111 004", rsvpStatus: "confirmed", guestCount: 1, dietary: "Halal", reminderSent: false, tableId: "w2_t1", seatIndex: 1 },
    { id: "g_w2_5", weddingId: "w2", name: "Olivia Vance", initials: "OV", household: "The Vance Family", email: "olivia.v@example.com", phone: "0422 111 005", rsvpStatus: "confirmed", guestCount: 1, dietary: "Vegetarian", reminderSent: false, tableId: "w2_t2", seatIndex: 0 },
    { id: "g_w2_6", weddingId: "w2", name: "Lucas Vance", initials: "LV", household: "The Vance Family", email: "lucas.v@example.com", phone: "0422 111 006", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", reminderSent: false, tableId: "w2_t2", seatIndex: 1 },
    { id: "g_w2_7", weddingId: "w2", name: "Zayn Malik", initials: "ZM", household: "Zayn Malik", email: "zayn.m@example.com", phone: "0422 111 007", rsvpStatus: "confirmed", guestCount: 1, dietary: "Halal", reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_w2_8", weddingId: "w2", name: "Layla Hassan", initials: "LH", household: "Layla Hassan", email: "layla.h@example.com", phone: "0422 111 008", rsvpStatus: "confirmed", guestCount: 1, dietary: "Gluten-free", reminderSent: false, tableId: null, seatIndex: null },

    // Wedding 3: Emma & Tom (w3)
    { id: "g_w3_1", weddingId: "w3", name: "Emma Wilson", initials: "EW", household: "Emma & Tom", email: "emma.w@example.com", phone: "0433 222 001", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", reminderSent: false, tableId: "w3_head", seatIndex: 0 },
    { id: "g_w3_2", weddingId: "w3", name: "Tom Davies", initials: "TD", household: "Emma & Tom", email: "tom.d@example.com", phone: "0433 222 002", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", reminderSent: false, tableId: "w3_head", seatIndex: 1 },
    { id: "g_w3_3", weddingId: "w3", name: "David Wilson", initials: "DW", household: "The Wilson Family", email: "david.w@example.com", phone: "0433 222 003", rsvpStatus: "confirmed", guestCount: 2, dietary: "None", reminderSent: false, tableId: "w3_t1", seatIndex: 0 },
    { id: "g_w3_4", weddingId: "w3", name: "Sarah Wilson", initials: "SW", household: "The Wilson Family", email: "sarah.w@example.com", phone: "0433 222 004", rsvpStatus: "confirmed", guestCount: 1, dietary: "Vegetarian", reminderSent: false, tableId: "w3_t1", seatIndex: 1 },
    { id: "g_w3_5", weddingId: "w3", name: "Harry Davies", initials: "HD", household: "Harry Davies", email: "harry.d@example.com", phone: "0433 222 005", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_w3_6", weddingId: "w3", name: "Chloe Taylor", initials: "CT", household: "Chloe Taylor", email: "chloe.t@example.com", phone: "0433 222 006", rsvpStatus: "confirmed", guestCount: 1, dietary: "Gluten-free", reminderSent: false, tableId: null, seatIndex: null }
  ],
  gifts: [
    { id: "gf1", guestName: "The Whitfield family", amount: 250, type: "wishing-well", date: "Today", message: "Wishing you both a lifetime of love and happiness!", thankYouSent: false, thankYouStatus: "Drafted" },
    { id: "gf2", guestName: "Sarah & Michael Chen", amount: 300, type: "wishing-well", date: "Yesterday", message: "So thrilled for you Sophie and James!", thankYouSent: false, thankYouStatus: "Drafted" },
    { id: "gf3", guestName: "Aunty Carol & Uncle Peter", amount: 500, type: "wishing-well", date: "2 days ago", message: "With all our love and blessings on your special day.", thankYouSent: false, thankYouStatus: "Not Started" },
    { id: "gf4", guestName: "Emma & David Wilson", amount: 200, type: "wishing-well", date: "3 days ago", message: "Congratulations to the wonderful couple!", thankYouSent: false, thankYouStatus: "Not Started" },
    { id: "gf5", guestName: "Marcus & Olivia Vance", amount: 350, type: "wishing-well", date: "4 days ago", message: "Enjoy every second of the celebration!", thankYouSent: true, thankYouStatus: "Sent" },
    { id: "gf6", guestName: "The O'Connor Family", amount: 400, type: "wishing-well", date: "5 days ago", message: "Huge congratulations Sophie and James!", thankYouSent: false, thankYouStatus: "Not Started" },
    { id: "gf7", guestName: "Jessica & Liam Taylor", amount: 180, type: "wishing-well", date: "6 days ago", message: "Can't wait to raise a glass to you both!", thankYouSent: false, thankYouStatus: "Not Started" },
    { id: "gf8", guestName: "Rob & Chloe Martin", amount: 250, type: "wishing-well", date: "1 week ago", message: "So happy for you guys!", thankYouSent: false, thankYouStatus: "Drafted" },
    { id: "gf9", guestName: "Grandma Evelyn", amount: 500, type: "wishing-well", date: "1 week ago", message: "May God bless your beautiful marriage.", thankYouSent: false, thankYouStatus: "Not Started" },
    { id: "gf10", guestName: "Uncle Arthur", amount: 500, type: "wishing-well", date: "2 weeks ago", message: "All our love.", thankYouSent: true, thankYouStatus: "Completed" },
    { id: "gf11", guestName: "Fiona & George Miller", amount: 350, type: "wishing-well", date: "2 weeks ago", message: "Cheers to your future together!", thankYouSent: true, thankYouStatus: "Completed" },
    { id: "gf12", guestName: "The Davis Family", amount: 500, type: "wishing-well", date: "3 weeks ago", message: "Warmest congratulations!", thankYouSent: true, thankYouStatus: "Completed" }
  ],
  tenants: [
    { id: "ten1", businessName: "Galati MC & Entertainment", contactName: "Robert Galati", email: "robert@galati.demo", phone: "0412 884 991", plan: "Pro ($299/mo)", status: "Active", weddingsCount: 7, mrr: 299, createdAt: "12 Jan 2025" },
    { id: "ten2", businessName: "Coastal Celebrations MC", contactName: "Marcus Thorne", email: "marcus@coastalmc.com.au", phone: "0413 772 109", plan: "Pro ($299/mo)", status: "Active", weddingsCount: 5, mrr: 299, createdAt: "04 Mar 2025" },
    { id: "ten3", businessName: "Sydney Vows & Beats", contactName: "Elena Rostova", email: "elena@sydneyvows.com.au", phone: "0414 661 882", plan: "Standard ($199/mo)", status: "Active", weddingsCount: 3, mrr: 199, createdAt: "18 May 2025" },
    { id: "ten4", businessName: "Melbourne Elite Hosts", contactName: "Julian Brooks", email: "julian@melbourneelite.com.au", phone: "0415 550 773", plan: "Starter ($99/mo)", status: "Suspended", weddingsCount: 1, mrr: 99, createdAt: "01 Aug 2025" }
  ],
  auditLog: [
    {
      id: "aud_onboard_1",
      timestamp: "2026-10-26 14:30",
      action: "Couple Onboarding Audited",
      user: "Sophie Carter",
      role: "couple",
      wedding: "Carter & Wilson Wedding",
      details: "Audited reception vision (High-Energy Dance Party), speeches (Grouped before mains), grand entrance fanfare, and demographics with MC Robert Galati",
      category: "Onboarding",
      ipAddress: "101.188.67.21 (Sydney, AU)",
      channel: "Web Portal",
      status: "Success"
    },
    {
      id: "aud_onboard_2",
      timestamp: "2026-10-26 14:28",
      action: "MC Selection & Booking",
      user: "Sophie Carter",
      role: "couple",
      wedding: "Carter & Wilson Wedding",
      details: "Selected and confirmed MC Robert Galati (Galati MC & Entertainment) for Signature Pro Wedding Suite",
      category: "Onboarding",
      ipAddress: "101.188.67.21 (Sydney, AU)",
      channel: "Web Portal",
      status: "Success"
    },
    {
      id: "aud_onboard_3",
      timestamp: "2026-10-26 14:25",
      action: "Subscription Payment Processed",
      user: "James Wilson",
      role: "couple",
      wedding: "Carter & Wilson Wedding",
      details: "Paid $299 AUD for Signature Pro Wedding Suite via Stripe Connect (ch_3N12a89)",
      category: "Billing",
      ipAddress: "101.188.67.21 (Sydney, AU)",
      channel: "Stripe Checkout",
      status: "Success"
    },
    {
      id: "aud_mc_1",
      timestamp: "2026-10-26 11:15",
      action: "Runsheet Milestone Approved",
      user: "Robert Galati",
      role: "mc",
      wedding: "Carter & Wilson Wedding",
      details: "Approved cake cutting milestone at 20:45 with acoustic intro cue for DJ sync",
      category: "Run Sheet",
      ipAddress: "124.171.32.9 (Hunter Valley, AU)",
      channel: "MC Pro Web",
      status: "Success"
    },
    {
      id: "aud_rsvp_1",
      timestamp: "2026-10-25 14:15",
      action: "RSVP Confirmed & Dietary Flagged",
      user: "Michael Chen",
      role: "guest",
      wedding: "Carter & Wilson Wedding",
      details: "Confirmed attendance (+1 guest, Vegetarian & Severe Peanut Allergy noted)",
      category: "RSVP",
      ipAddress: "203.217.44.12 (Melbourne, AU)",
      channel: "Mobile PWA",
      status: "Success"
    },
    {
      id: "aud_gift_1",
      timestamp: "2026-10-24 13:42",
      action: "Gift & Go Wishing Well",
      user: "The Whitfield Family",
      role: "guest",
      wedding: "Carter & Wilson Wedding",
      details: "Sent $250.00 AUD digital wedding gift with heartfelt congratulations note",
      category: "Gifting",
      ipAddress: "110.142.18.90 (Brisbane, AU)",
      channel: "Mobile PWA",
      status: "Success"
    },
    {
      id: "aud_feed_1",
      timestamp: "2026-10-24 12:10",
      action: "Celebration Feed Note",
      user: "Aunty Carol",
      role: "guest",
      wedding: "Carter & Wilson Wedding",
      details: "Posted verified Love Note on digital guest memory wall",
      category: "Feed",
      ipAddress: "139.130.4.5 (Sydney, AU)",
      channel: "Web Portal",
      status: "Success"
    },
    {
      id: "aud_seat_1",
      timestamp: "2026-10-23 09:20",
      action: "Table Assignment Finalized",
      user: "Sophie Carter",
      role: "couple",
      wedding: "Carter & Wilson Wedding",
      details: "Assigned Johnson family (4 adults, 1 child) to Table 4 (Garden Terrace)",
      category: "Seating",
      ipAddress: "101.188.67.21 (Sydney, AU)",
      channel: "Web Portal",
      status: "Success"
    },
    {
      id: "aud_tenant_1",
      timestamp: "2026-10-22 16:40",
      action: "MC SaaS Plan Onboarding",
      user: "Robert Galati",
      role: "mc",
      wedding: "Platform Global",
      details: "Registered Galati MC & Entertainment on Pro Master of Ceremonies SaaS tier ($149/mo)",
      category: "Tenants",
      ipAddress: "124.171.32.9 (Hunter Valley, AU)",
      channel: "Web Portal",
      status: "Success"
    },
    {
      id: "aud_admin_1",
      timestamp: "2026-10-21 10:00",
      action: "SuperAdmin Security Verification",
      user: "Platform Admin",
      role: "superadmin",
      wedding: "Platform Global",
      details: "Verified 2FA enforcement and Stripe Connect webhook integrity checks",
      category: "Security",
      ipAddress: "192.168.1.1 (Corporate VPN)",
      channel: "Admin Console",
      status: "Success"
    }
  ],
  users: [
    { id: "u_mc1", email: "robert@galati.demo", passwordHash: "dHRfc2FsdF9EZW1vMTIzNCE=", name: "Robert Galati", role: "mc", tenantId: "ten1", businessName: "Galati MC & Entertainment" },
    { id: "u_couple1", email: "sophie.james@demo.test", passwordHash: "dHRfc2FsdF9EZW1vMTIzNCE=", name: "Sophie & James (Joint)", role: "couple", weddingId: "w1", partner1: "Sophie", partner2: "James" },
    { id: "u_couple_bride", email: "sophie@demo.test", passwordHash: "dHRfc2FsdF9EZW1vMTIzNCE=", name: "Sophie Bell (Bride)", role: "couple", weddingId: "w1", partner1: "Sophie", partner2: "James" },
    { id: "u_couple_groom", email: "james@demo.test", passwordHash: "dHRfc2FsdF9EZW1vMTIzNCE=", name: "James Gordon (Groom)", role: "couple", weddingId: "w1", partner1: "Sophie", partner2: "James" },
    { id: "u_mc_sarah", email: "sarah.j@galati.demo", passwordHash: "dHRfc2FsdF9EZW1vMTIzNCE=", name: "Sarah Jenkins (MC Co-Pilot)", role: "mc", tenantId: "ten1", businessName: "Galati MC & Entertainment" },
    { id: "u_admin1", email: "admin@tapandtoast.demo", passwordHash: "dHRfc2FsdF9EZW1vMTIzNCE=", name: "Platform Admin", role: "superadmin" }
  ],
  usedInvites: [],
  featureFlags: {
    digitalGifting: true,
    aiSeating: true,
    qardPrinting: true,
    photoModeration: false,
    smsReminders: true
  },
  supportTickets: [
    {
      id: "TCK-401",
      tenant: "Galati MC & Entertainment",
      subject: "QaRd High-Res Export Failure for 300dpi print",
      priority: "High",
      status: "In Progress",
      date: "2 hours ago",
      messages: [
        { sender: "Robert Galati", time: "10:15 AM", text: "When exporting the vector QaRd badge for Fernwood Estate, the bleed margin overlaps by 2mm. Can you check printer profile?" },
        { sender: "Super Admin Support", time: "11:00 AM", text: "Investigating the PDF bleed template; we pushed a patch to vector rendering pipeline.", isAdmin: true }
      ]
    },
    {
      id: "TCK-398",
      tenant: "Coastal Celebrations MC",
      subject: "Stripe Payout Split on Joint Wedding Well",
      priority: "Medium",
      status: "Open",
      date: "Yesterday",
      messages: [
        { sender: "Marcus Thorne", time: "Yesterday 4:20 PM", text: "Client wants to split registry deposit 50/50 between two Australian bank BSBs. Is split-transfer supported?" }
      ]
    },
    {
      id: "TCK-385",
      tenant: "Sydney Vows & Beats",
      subject: "Domain SSL DNS propagation question",
      priority: "Low",
      status: "Resolved",
      date: "3 days ago",
      messages: [
        { sender: "Elena Rostova", time: "3 days ago", text: "CNAME records configured for portal.sydneyvows.com.au. Certificate issued successfully." },
        { sender: "Super Admin Support", time: "3 days ago", text: "Certificate verified and active on Cloudflare Edge.", isAdmin: true }
      ]
    }
  ],
  clients: [
    {
      id: "cl_1",
      couple: "Sophie & James",
      weddingDate: "14 Nov 2026",
      venue: "Fernwood Estate, Southern Highlands",
      tier: "Platinum MC + Live Audio",
      deposit: "Paid ($500)",
      phone: "0418 223 901",
      email: "sophie.james@demo.test",
      notes: "Couple prefers upbeat introductions. First dance at 19:15 sharp."
    },
    {
      id: "cl_2",
      couple: "Aisha & Marcus",
      weddingDate: "2 May 2027",
      venue: "Doltone House, Sydney",
      tier: "Executive Lead MC",
      deposit: "Paid ($500)",
      phone: "0422 998 112",
      email: "aisha.marcus@demo.test",
      notes: "Strict cultural run sheet timings for afternoon tea ceremony."
    },
    {
      id: "cl_3",
      couple: "Emma & Tom",
      weddingDate: "20 Jun 2027",
      venue: "Dunbar House, Watsons Bay",
      tier: "Standard MC Host",
      deposit: "Pending",
      phone: "0431 887 234",
      email: "emma.tom@demo.test",
      notes: "Acoustic duo during cocktail hour, requested wireless handheld mic for vows."
    },
    {
      id: "cl_4",
      couple: "Katie & Rob",
      weddingDate: "18 Sep 2027",
      venue: "Bendooley Estate, Berrima",
      tier: "Executive Lead MC",
      deposit: "Paid ($500)",
      phone: "0419 443 219",
      email: "katie.rob@demo.test",
      notes: "Book barn setting, outdoor ceremony contingent on weather."
    }
  ],
  invoices: [
    {
      id: "INV-1081",
      couple: "Sophie & James",
      date: "15 Oct 2026",
      venue: "Fernwood Estate",
      amount: 1850,
      status: "Pending"
    },
    {
      id: "INV-1082",
      couple: "Aisha & Marcus",
      date: "12 Oct 2026",
      venue: "Doltone House",
      amount: 1650,
      status: "Paid"
    },
    {
      id: "INV-1083",
      couple: "Emma & Tom",
      date: "05 Oct 2026",
      venue: "Dunbar House",
      amount: 1950,
      status: "Pending"
    },
    {
      id: "INV-1084",
      couple: "Katie & Rob",
      date: "28 Sep 2026",
      venue: "Bendooley Estate",
      amount: 1750,
      status: "Draft"
    }
  ],
  team: [
    {
      id: "tm_1",
      name: "Robert Galati",
      role: "Lead MC & Director",
      email: "robert@galati.demo",
      phone: "0418 223 901",
      status: "Active",
      accessLevel: "Full MC Dashboard Access",
      assignedWeddings: ["all"],
      permissions: { canEditRunsheet: true, canEditSeating: true, canViewDietary: true, canMessageClients: true, canViewGiftLedger: true }
    },
    {
      id: "tm_2",
      name: "Sarah Jenkins",
      role: "Associate MC & Host",
      email: "sarah.j@galati.demo",
      phone: "0422 110 882",
      status: "Active",
      accessLevel: "Full MC Dashboard Access",
      assignedWeddings: ["all"],
      permissions: { canEditRunsheet: true, canEditSeating: true, canViewDietary: true, canMessageClients: true, canViewGiftLedger: true }
    },
    {
      id: "tm_3",
      name: "Dave Miller",
      role: "Sound Engineer & AV Lead",
      email: "dave.sound@galati.demo",
      phone: "0433 991 445",
      status: "Active",
      accessLevel: "Full MC Dashboard Access",
      assignedWeddings: ["all"],
      permissions: { canEditRunsheet: true, canEditSeating: true, canViewDietary: true, canMessageClients: true, canViewGiftLedger: true }
    }
  ],
  referralCodes: [
    {
      id: "ref_1",
      code: "ROBERT-VIP-15",
      discountType: "percentage",
      discountValue: 15,
      description: "Exclusive 15% booking discount for Robert Galati couples",
      usesCount: 12,
      mcRewardValue: 150,
      status: "active",
      createdDate: "01 Jan 2026"
    },
    {
      id: "ref_2",
      code: "BRIDALEXPO2027",
      discountType: "fixed",
      discountValue: 100,
      description: "$100 AUD off platform deposit for Sydney Bridal Expo couples",
      usesCount: 4,
      mcRewardValue: 100,
      status: "active",
      createdDate: "15 Feb 2026"
    },
    {
      id: "ref_3",
      code: "SUMMERLOVE",
      discountType: "percentage",
      discountValue: 10,
      description: "10% off summer 2027 packages & rehearsal direction",
      usesCount: 2,
      mcRewardValue: 150,
      status: "active",
      createdDate: "01 Jun 2026"
    },
    {
      id: "ref_4",
      code: "WINTERVIP",
      discountType: "fixed",
      discountValue: 150,
      description: "$150 flat off off-peak winter weddings",
      usesCount: 0,
      mcRewardValue: 150,
      status: "active",
      createdDate: "10 Jul 2026"
    }
  ],
  mcTransactions: initialMcTransactions,
  referredCouples: [
    {
      id: "rc_1",
      coupleName: "Sophie & James",
      weddingDate: "14 Nov 2026",
      codeUsed: "ROBERT-VIP-15",
      discountSaved: 225,
      mcCommission: 150,
      commissionStatus: "Paid",
      dateReferred: "12 Oct 2026"
    },
    {
      id: "rc_2",
      coupleName: "Aisha & Marcus",
      weddingDate: "02 May 2027",
      codeUsed: "BRIDALEXPO2027",
      discountSaved: 100,
      mcCommission: 100,
      commissionStatus: "Paid",
      dateReferred: "28 Sep 2026"
    },
    {
      id: "rc_3",
      coupleName: "Emma & Tom",
      weddingDate: "20 Jun 2027",
      codeUsed: "SUMMERLOVE",
      discountSaved: 185,
      mcCommission: 150,
      commissionStatus: "Paid",
      dateReferred: "05 Aug 2026"
    },
    {
      id: "rc_4",
      coupleName: "Liam & Chloe",
      weddingDate: "18 Sep 2027",
      codeUsed: "ROBERT-VIP-15",
      discountSaved: 225,
      mcCommission: 150,
      commissionStatus: "Pending",
      dateReferred: "18 Oct 2026"
    },
    {
      id: "rc_5",
      coupleName: "Harrison & Grace",
      weddingDate: "24 Oct 2027",
      codeUsed: "ROBERT-VIP-15",
      discountSaved: 225,
      mcCommission: 150,
      commissionStatus: "Pending",
      dateReferred: "19 Oct 2026"
    }
  ]
};
