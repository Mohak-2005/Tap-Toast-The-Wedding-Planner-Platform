import fs from 'fs';

let content = fs.readFileSync('src/lib/seedData.ts', 'utf8');

const newCouplePlans = `export const initialPlans: SaaSPlan[] = [
  {
    id: "plan_couple_essential",
    key: "Essential",
    tagline: "Smart Wedding Essentials",
    price: 149,
    billingCycle: "AUD / one-time pass",
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
    features: [
      "Everything in Signature Pro",
      "VIP MC Concierge Matchmaking & custom contract",
      "Multi-Event Run Sheets (Rehearsal, Reception, Recovery Brunch)",
      "Custom domain & personalized couple branding",
      "Priority 24/7 Australian wedding support concierge",
      "Full export package (CSV, PDF run sheets, table cards)",
    ],
  },
];`;

content = content.replace(/export const initialPlans: SaaSPlan\[\] = \[[\s\S]*?\];/, newCouplePlans);

// Update Sophie & James wedding with selectedMc, subscriptionPlan, aiOnboardingAnswers, giftingPresets
const weddingAddition = `      invited: 118,
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
      ],`;

content = content.replace(/      invited: 118,\r?\n      status: "Finalising",/, weddingAddition);

fs.writeFileSync('src/lib/seedData.ts', content, 'utf8');
console.log('seedData.ts plans and wedding updated!');
