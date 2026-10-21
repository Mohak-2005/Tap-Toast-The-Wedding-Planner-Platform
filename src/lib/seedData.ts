import { DemoState, SaaSPlan } from './types';

export const initialPlans: SaaSPlan[] = [
  {
    id: "plan_starter",
    key: "Starter",
    tagline: "Independent Host",
    price: 149,
    billingCycle: "AUD / mo",
    features: [
      "1 active wedding at a time",
      "Digital RSVPs & basic seating",
      "Digital wishing well",
      "Standard community support",
    ],
  },
  {
    id: "plan_standard",
    key: "Standard",
    tagline: "Boutique Host",
    price: 199,
    billingCycle: "AUD / mo",
    features: [
      "Up to 3 active weddings",
      "Custom guest QR links",
      "Drag-and-drop seating studio",
      "Standard email & chat support",
    ],
  },
  {
    id: "plan_pro",
    key: "Pro",
    tagline: "Master of Ceremonies",
    price: 299,
    billingCycle: "AUD / mo",
    features: [
      "Unlimited active weddings",
      "QaRd physical QR generation",
      "AI Seating Optimization Assistant",
      "Live interactive run sheets & cues",
      "Collaborative coordinator logins",
    ],
    badge: "MOST POPULAR",
    featured: true,
  },
  {
    id: "plan_enterprise",
    key: "Enterprise",
    tagline: "Multi-Host Agency",
    price: 599,
    billingCycle: "AUD / mo",
    features: [
      "Up to 10 MC performers",
      "Custom domain & white-label branding",
      "Priority 24/7 Australian telephone concierge",
      "Dedicated account manager",
    ],
  },
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
    { id: "head", name: "HEAD TABLE", capacity: 8, isHead: true },
    { id: "table_1", name: "Table 1", capacity: 8, isHead: false },
    { id: "table_2", name: "Table 2", capacity: 8, isHead: false },
    { id: "table_3", name: "Table 3", capacity: 8, isHead: false },
    { id: "table_4", name: "Table 4", capacity: 8, isHead: false },
    { id: "table_5", name: "Table 5", capacity: 8, isHead: false },
    { id: "table_6", name: "Table 6", capacity: 8, isHead: false }
  ],
  guests: [
    // Mark & Sarah Johnson (Guest Mobile persona at Table 4, seats 1 & 2)
    { id: "johnson_fam", name: "Mark & Sarah Johnson", initials: "MJ", household: "The Johnson Family", email: "mark.johnson@example.com", phone: "0412 884 991", rsvpStatus: "confirmed", guestCount: 2, dietary: "1x Vegetarian, 1x Gluten-Free", song: "Signed, Sealed, Delivered - Stevie Wonder", reminderSent: false, tableId: "table_4", seatIndex: 1 },
    // Priya Sharma (Table 4, Seat 3)
    { id: "priya", name: "Priya Sharma", initials: "PS", household: "The Sharma Family", email: "priya.sharma@example.com.au", phone: "0412 884 992", rsvpStatus: "confirmed", guestCount: 2, dietary: "Vegetarian", song: "September - Earth, Wind & Fire", reminderSent: false, tableId: "table_4", seatIndex: 3 },
    
    // Head Table (8 seats)
    { id: "g_ht1", name: "Sophie Bell", initials: "SB", household: "Sophie Bell", email: "sophie.bell@example.com", phone: "0400 111 222", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "At Last - Etta James", reminderSent: false, tableId: "head", seatIndex: 0 },
    { id: "g_ht2", name: "James Gordon", initials: "JG", household: "James Gordon", email: "james.gordon@example.com", phone: "0400 222 333", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "You Are The Best Thing", reminderSent: false, tableId: "head", seatIndex: 1 },
    { id: "g_ht3", name: "Hannah Martin", initials: "HM", household: "Hannah Martin", email: "hannah.m@example.com", phone: "0400 333 444", rsvpStatus: "confirmed", guestCount: 1, dietary: "Vegetarian", song: "Dancing Queen", reminderSent: false, tableId: "head", seatIndex: 2 },
    { id: "g_ht4", name: "Oliver Vance", initials: "OV", household: "Oliver Vance", email: "oliver.v@example.com", phone: "0400 444 555", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Mr. Brightside", reminderSent: false, tableId: "head", seatIndex: 3 },
    { id: "g_ht5", name: "Charlotte Evans", initials: "CE", household: "Charlotte Evans", email: "charlotte.e@example.com", phone: "0400 555 666", rsvpStatus: "confirmed", guestCount: 1, dietary: "Gluten-free", song: "Levitating", reminderSent: false, tableId: "head", seatIndex: 4 },
    { id: "g_ht6", name: "Liam Fletcher", initials: "LF", household: "Liam Fletcher", email: "liam.f@example.com", phone: "0400 666 777", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Uptown Funk", reminderSent: false, tableId: "head", seatIndex: 5 },
    { id: "g_ht7", name: "Grace Kelly", initials: "GK", household: "Grace Kelly", email: "grace.k@example.com", phone: "0400 777 888", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "I Wanna Dance with Somebody", reminderSent: false, tableId: "head", seatIndex: 6 },
    { id: "g_ht8", name: "Alexander Wright", initials: "AW", household: "Alexander Wright", email: "alex.w@example.com", phone: "0400 888 999", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Superstition", reminderSent: false, tableId: "head", seatIndex: 7 },

    // Table 1 (8 seated)
    { id: "g_t1_1", name: "Michael Chen", initials: "MC", household: "Michael Chen", email: "michael.chen@example.com", phone: "0411 223 901", rsvpStatus: "confirmed", guestCount: 2, dietary: "Vegetarian", song: "Stayin' Alive", reminderSent: false, tableId: "table_1", seatIndex: 0 },
    { id: "g_t1_2", name: "David Vance", initials: "DV", household: "David Vance", email: "david.vance@example.com", phone: "0411 223 902", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Don't Stop Me Now", reminderSent: false, tableId: "table_1", seatIndex: 1 },
    { id: "g_t1_3", name: "Jessica White", initials: "JW", household: "Jessica White", email: "jessica.white@example.com", phone: "0411 223 903", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Blinding Lights", reminderSent: false, tableId: "table_1", seatIndex: 2 },
    { id: "g_t1_4", name: "Aunty Carol Evans", initials: "AC", household: "Aunty Carol", email: "carol.evans@example.com", phone: "0411 223 904", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Sweet Caroline", reminderSent: false, tableId: "table_1", seatIndex: 3 },
    { id: "g_t1_5", name: "Robert King", initials: "RK", household: "Robert King", email: "robert.king@example.com", phone: "0411 223 905", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Billie Jean", reminderSent: false, tableId: "table_1", seatIndex: 4 },
    { id: "g_t1_6", name: "Lucy Palmer", initials: "LP", household: "Lucy Palmer", email: "lucy.palmer@example.com", phone: "0411 223 906", rsvpStatus: "confirmed", guestCount: 1, dietary: "Nut allergy", song: "Can't Stop the Feeling!", reminderSent: false, tableId: "table_1", seatIndex: 5 },
    { id: "g_t1_7", name: "Edward Lewis", initials: "EL", household: "Edward Lewis", email: "edward.lewis@example.com", phone: "0411 223 907", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Shake It Off", reminderSent: false, tableId: "table_1", seatIndex: 6 },
    { id: "g_t1_8", name: "Chloe Jenkins", initials: "CJ", household: "Chloe Jenkins", email: "chloe.jenkins@example.com", phone: "0411 223 908", rsvpStatus: "confirmed", guestCount: 1, dietary: "Gluten-free", song: "Single Ladies", reminderSent: false, tableId: "table_1", seatIndex: 7 },

    // Table 2 (6 seated)
    { id: "g_t2_1", name: "Nathan Knight", initials: "NK", household: "Nathan Knight", email: "nathan.k@example.com", phone: "0412 334 001", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Hey Ya!", reminderSent: false, tableId: "table_2", seatIndex: 0 },
    { id: "g_t2_2", name: "Georgia Hall", initials: "GH", household: "Georgia Hall", email: "georgia.h@example.com", phone: "0412 334 002", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Shut Up and Dance", reminderSent: false, tableId: "table_2", seatIndex: 1 },
    { id: "g_t2_3", name: "William Ford", initials: "WF", household: "William Ford", email: "william.f@example.com", phone: "0412 334 003", rsvpStatus: "confirmed", guestCount: 1, dietary: "Vegetarian", song: "Wonderwall", reminderSent: false, tableId: "table_2", seatIndex: 2 },
    { id: "g_t2_4", name: "Fiona Scott", initials: "FS", household: "Fiona Scott", email: "fiona.s@example.com", phone: "0412 334 004", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Happy - Pharrell", reminderSent: false, tableId: "table_2", seatIndex: 3 },
    { id: "g_t2_5", name: "George Miller", initials: "GM", household: "George Miller", email: "george.m@example.com", phone: "0412 334 005", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Sugar - Maroon 5", reminderSent: false, tableId: "table_2", seatIndex: 4 },
    { id: "g_t2_6", name: "Quinn Nelson", initials: "QN", household: "Quinn Nelson", email: "quinn.n@example.com", phone: "0412 334 006", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Crazy in Love", reminderSent: false, tableId: "table_2", seatIndex: 5 },

    // Table 3 (4 seated)
    { id: "g_t3_1", name: "Ian Patel", initials: "IP", household: "Ian Patel", email: "ian.p@example.com", phone: "0413 445 001", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "24K Magic", reminderSent: false, tableId: "table_3", seatIndex: 0 },
    { id: "g_t3_2", name: "Grace Turner", initials: "GT", household: "Grace Turner", email: "grace.t@example.com", phone: "0413 445 002", rsvpStatus: "confirmed", guestCount: 1, dietary: "Gluten-free", song: "Treasure", reminderSent: false, tableId: "table_3", seatIndex: 1 },
    { id: "g_t3_3", name: "Yasmine Abbas", initials: "YA", household: "Yasmine Abbas", email: "yasmine.a@example.com", phone: "0413 445 003", rsvpStatus: "confirmed", guestCount: 1, dietary: "Halal", song: "Levitating", reminderSent: false, tableId: "table_3", seatIndex: 2 },
    { id: "g_t3_4", name: "Zachary Webb", initials: "ZW", household: "Zachary Webb", email: "zachary.w@example.com", phone: "0413 445 004", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Get Lucky", reminderSent: false, tableId: "table_3", seatIndex: 3 },

    // Table 4
    { id: "g_t4_1", name: "Benjamin Ross", initials: "BR", household: "Benjamin Ross", email: "ben.ross@example.com", phone: "0414 556 001", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Good 4 U", reminderSent: false, tableId: "table_4", seatIndex: 0 },
    { id: "g_t4_2", name: "Isabella Foster", initials: "IF", household: "Isabella Foster", email: "isabella.f@example.com", phone: "0414 556 002", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Valerie", reminderSent: false, tableId: "table_4", seatIndex: 2 },
    { id: "g_t4_3", name: "Oliver Thomas", initials: "OT", household: "Oliver Thomas", email: "oliver.t@example.com", phone: "0414 556 003", rsvpStatus: "confirmed", guestCount: 1, dietary: "Vegetarian", song: "Mamma Mia", reminderSent: false, tableId: "table_4", seatIndex: 4 },
    { id: "g_t4_5", name: "Yuvraj Rao", initials: "YR", household: "Yuvraj Rao", email: "yuvraj.r@example.com", phone: "0414 556 005", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Dynamite", reminderSent: false, tableId: "table_4", seatIndex: 5 },
    { id: "g_t4_6", name: "Natasha Price", initials: "NP", household: "Natasha Price", email: "natasha.p@example.com", phone: "0414 556 006", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "About Damn Time", reminderSent: false, tableId: "table_4", seatIndex: 6 },
    { id: "g_t4_7", name: "Julian Taylor", initials: "JT", household: "Julian Taylor", email: "julian.t@example.com", phone: "0414 556 007", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Shape of You", reminderSent: false, tableId: "table_4", seatIndex: 7 },

    // Table 5 (3 seated)
    { id: "g_t5_1", name: "Harper Lewis", initials: "HL", household: "Harper Lewis", email: "harper.l@example.com", phone: "0415 667 001", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Dance Monkey", reminderSent: false, tableId: "table_5", seatIndex: 0 },
    { id: "g_t5_2", name: "Kian Thorne", initials: "KT", household: "Kian Thorne", email: "kian.t@example.com", phone: "0415 667 002", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", song: "Wake Me Up", reminderSent: false, tableId: "table_5", seatIndex: 1 },
    { id: "g_t5_3", name: "Chloe Lin", initials: "CL", household: "Chloe Lin", email: "chloe.l@example.com", phone: "0415 667 003", rsvpStatus: "confirmed", guestCount: 1, dietary: "Gluten-free", song: "Roar", reminderSent: false, tableId: "table_5", seatIndex: 2 },

    // Unassigned guests (32 confirmed guests matching Screenshot 24)
    { id: "g_rchen", name: "Robert Chen", initials: "RC", household: "The Chen Family", email: "robert.c@example.com", phone: "0421 991 223", rsvpStatus: "confirmed", guestCount: 2, dietary: "Vegetarian", plusOne: true, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_slee", name: "Sarah Lee", initials: "SL", household: "Sarah Lee", email: "sarah.lee@example.com", phone: "0433 112 445", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_dwhitfield", name: "David Whitfield", initials: "DW", household: "The Whitfield family", email: "david.w@example.com", phone: "0414 556 778", rsvpStatus: "confirmed", guestCount: 2, dietary: "None", plusOne: true, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_mkapoor", name: "Maya Kapoor", initials: "MK", household: "Maya Kapoor", email: "maya.k@example.com", phone: "0400 334 556", rsvpStatus: "confirmed", guestCount: 1, dietary: "Gluten-free", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_toneill", name: "Thomas O'Neill", initials: "TO", household: "Thomas O'Neill", email: "thomas.o@example.com", phone: "0418 776 554", rsvpStatus: "confirmed", guestCount: 2, dietary: "None", plusOne: true, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_jbrown", name: "Jessica Brown", initials: "JB", household: "Jessica Brown", email: "jessica.b@example.com", phone: "0422 998 112", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_lscott", name: "Liam Scott", initials: "LS", household: "Liam Scott", email: "liam.s@example.com", phone: "0411 223 344", rsvpStatus: "confirmed", guestCount: 2, dietary: "None", plusOne: true, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_ctaylor", name: "Chloe Taylor", initials: "CT", household: "Chloe Taylor", email: "chloe.t@example.com", phone: "0422 334 455", rsvpStatus: "confirmed", guestCount: 1, dietary: "Vegan", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u9", name: "Daniel Miller", initials: "DM", household: "Daniel Miller", email: "daniel.m@example.com", phone: "0411 001 009", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u10", name: "Emily Davis", initials: "ED", household: "Emily Davis", email: "emily.d@example.com", phone: "0411 001 010", rsvpStatus: "confirmed", guestCount: 1, dietary: "Gluten-free", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u11", name: "Lucas Wilson", initials: "LW", household: "Lucas Wilson", email: "lucas.w@example.com", phone: "0411 001 011", rsvpStatus: "confirmed", guestCount: 2, dietary: "None", plusOne: true, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u12", name: "Sophia Martinez", initials: "SM", household: "Sophia Martinez", email: "sophia.m@example.com", phone: "0411 001 012", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u13", name: "Noah Anderson", initials: "NA", household: "Noah Anderson", email: "noah.a@example.com", phone: "0411 001 013", rsvpStatus: "confirmed", guestCount: 2, dietary: "Vegetarian", plusOne: true, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u14", name: "Ava Thomas", initials: "AT", household: "Ava Thomas", email: "ava.t@example.com", phone: "0411 001 014", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u15", name: "Mason Taylor", initials: "MT", household: "Mason Taylor", email: "mason.t@example.com", phone: "0411 001 015", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u16", name: "Isabella Moore", initials: "IM", household: "Isabella Moore", email: "isabella.m@example.com", phone: "0411 001 016", rsvpStatus: "confirmed", guestCount: 1, dietary: "Nut allergy", plusOne: false, reminderSent: false, tableId: null, seatIndex: null },
    { id: "g_u17", name: "Ethan Jackson", initials: "EJ", household: "Ethan Jackson", email: "ethan.j@example.com", phone: "0411 001 017", rsvpStatus: "confirmed", guestCount: 2, dietary: "None", plusOne: true, reminderSent: false, tableId: null, seatIndex: null },
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
    { id: "g_u32", name: "Aria King", initials: "AK", household: "Aria King", email: "aria.k@example.com", phone: "0411 001 032", rsvpStatus: "confirmed", guestCount: 1, dietary: "None", plusOne: false, reminderSent: false, tableId: null, seatIndex: null }
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
    { id: "ten1", businessName: "Galati MC & Entertainment", contactName: "Robert Galati", email: "robert@galati.demo", plan: "Pro ($299/mo)", status: "Active", weddingsCount: 7, mrr: 299, createdAt: "12 Jan 2025" },
    { id: "ten2", businessName: "Coastal Celebrations MC", contactName: "Marcus Thorne", email: "marcus@coastalmc.com.au", plan: "Pro ($299/mo)", status: "Active", weddingsCount: 5, mrr: 299, createdAt: "04 Mar 2025" },
    { id: "ten3", businessName: "Sydney Vows & Beats", contactName: "Elena Rostova", email: "elena@sydneyvows.com.au", plan: "Standard ($199/mo)", status: "Active", weddingsCount: 3, mrr: 199, createdAt: "18 May 2025" },
    { id: "ten4", businessName: "Melbourne Elite Hosts", contactName: "Julian Brooks", email: "julian@melbourneelite.com.au", plan: "Starter ($99/mo)", status: "Suspended", weddingsCount: 1, mrr: 99, createdAt: "01 Aug 2025" }
  ],
  auditLog: [
    { id: "aud1", timestamp: "2026-10-15 14:15", action: "RSVP Confirmed", user: "Michael Chen", role: "guest", details: "Confirmed attendance (+1 guest, vegetarian)", category: "RSVP" },
    { id: "aud2", timestamp: "2026-10-15 13:42", action: "Gift & Go Received", user: "The Whitfield family", role: "guest", details: "Sent $250 AUD gift with message", category: "Gifting" },
    { id: "aud3", timestamp: "2026-10-15 12:10", action: "Feed Note Posted", user: "Aunty Carol", role: "guest", details: "Posted a Love Note on celebration feed", category: "Feed" },
    { id: "aud4", timestamp: "2026-10-15 11:00", action: "Photo Uploaded", user: "Priya Sharma", role: "guest", details: "Added photo to wedding photo wall", category: "Photos" },
    { id: "aud5", timestamp: "2026-10-15 09:20", action: "Seating Updated", user: "Sophie & James", role: "couple", details: "Assigned Table 4 seating arrangement", category: "Seating" },
    { id: "aud6", timestamp: "2026-10-14 17:00", action: "Run Sheet Updated", user: "Robert Galati", role: "mc", details: "Updated reception timings and speech order", category: "Run Sheet" }
  ],
  users: [
    { id: "u_mc1", email: "robert@galati.demo", passwordHash: "dHRfc2FsdF9EZW1vMTIzNCE=", name: "Robert Galati", role: "mc", tenantId: "ten1", businessName: "Galati MC & Entertainment" },
    { id: "u_couple1", email: "sophie.james@demo.test", passwordHash: "dHRfc2FsdF9EZW1vMTIzNCE=", name: "Sophie & James", role: "couple", weddingId: "w1", partner1: "Sophie", partner2: "James" },
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
      status: "Active"
    },
    {
      id: "tm_2",
      name: "Sarah Jenkins",
      role: "Associate MC & Host",
      email: "sarah.j@galati.demo",
      phone: "0422 110 882",
      status: "Active"
    },
    {
      id: "tm_3",
      name: "Dave Miller",
      role: "Sound Engineer & AV Lead",
      email: "dave.sound@galati.demo",
      phone: "0433 991 445",
      status: "Active"
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
