import fs from 'fs';

let code = fs.readFileSync('src/components/SrMobileView.tsx', 'utf8');
const normalize = (s) => s.replace(/\r\n/g, '\n');
code = normalize(code);

const oldTarget = `      const newWedding = {
        id: newWeddingId,
        tenantId: 'tenant_galati',
        couple: coupleName,
        partner1: bName,
        partner2: gName,
        date: weddingDate,
        dateDisplay: new Date(weddingDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        venue: venue.trim() || 'Venue TBD',
        region: 'NSW',
        daysRemaining: 180,
        invited: guestCount || 110,
        confirmed: 0,
        declined: 0,
        awaiting: guestCount || 110,
        tablesSeated: 0,
        totalTables: Math.ceil((guestCount || 110) / 10),
        giftsTotal: 0,
        status: 'Planning',
        tasks: [
          { id: 't1', text: 'Confirm floral arrangements & ceremony arch', completed: false, due: 'This week' },
          { id: 't2', text: 'Review run sheet with MC Robert', completed: false, due: 'This week' },
        ],
      };`;

const newTarget = `      const newWedding = {
        id: newWeddingId,
        tenantId: 'tenant_galati',
        couple: coupleName,
        partner1: bName,
        partner2: gName,
        date: weddingDate,
        dateDisplay: new Date(weddingDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
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
          id: 'signature',
          name: 'Signature Pro Wedding Suite',
          price: 299,
          status: 'Active',
          activatedAt: new Date().toISOString(),
        },
        selectedMc: {
          id: 'mc_robert',
          name: 'Robert Galati',
          businessName: 'Galati MC Services',
          rating: '5.0',
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
          { id: 't2', text: 'Review run sheet with MC Robert', completed: false, due: 'This week' },
        ],
      };`;

if (!code.includes(normalize(oldTarget))) {
  console.error("Could not find oldTarget in SrMobileView.tsx");
  process.exit(1);
}

code = code.replace(normalize(oldTarget), normalize(newTarget));
fs.writeFileSync('src/components/SrMobileView.tsx', code, 'utf8');
console.log('SrMobileView updated successfully!');
