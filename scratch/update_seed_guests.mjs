import fs from 'fs';

let content = fs.readFileSync('src/lib/seedData.ts', 'utf8');

// Regex replace guest objects to add adults and kids if not present
// If guest has guestCount: 2, default adults: 2, kids: 0
// Specifically for families with children, give them kids:
// e.g. johnson_fam: adults: 2, kids: 0
// g_dwhitfield: adults: 2, kids: 2
// g_toneill: adults: 2, kids: 1
// g_rchen: adults: 2, kids: 1
// g_u11: adults: 2, kids: 1
// g_u13: adults: 2, kids: 2
// g_u17: adults: 2, kids: 1
// others: guestCount === 1 ? adults: 1, kids: 0 : adults: guestCount || 1, kids: 0

content = content.replace(
  'id: "johnson_fam", name: "Mark & Sarah Johnson", initials: "MJ", household: "The Johnson Family", email: "mark.johnson@example.com", phone: "0412 884 991", rsvpStatus: "confirmed", guestCount: 2',
  'id: "johnson_fam", name: "Mark & Sarah Johnson", initials: "MJ", household: "The Johnson Family", email: "mark.johnson@example.com", phone: "0412 884 991", rsvpStatus: "confirmed", guestCount: 2, adults: 2, kids: 0'
);

content = content.replace(
  'id: "priya", name: "Priya Sharma", initials: "PS", household: "The Sharma Family", email: "priya.sharma@example.com.au", phone: "0412 884 992", rsvpStatus: "confirmed", guestCount: 2',
  'id: "priya", name: "Priya Sharma", initials: "PS", household: "The Sharma Family", email: "priya.sharma@example.com.au", phone: "0412 884 992", rsvpStatus: "confirmed", guestCount: 2, adults: 2, kids: 0'
);

content = content.replace(
  'id: "g_dwhitfield", name: "David Whitfield", initials: "DW", household: "The Whitfield family", email: "david.w@example.com", phone: "0414 556 778", rsvpStatus: "confirmed", guestCount: 2',
  'id: "g_dwhitfield", name: "David Whitfield & Family", initials: "DW", household: "The Whitfield Family", email: "david.w@example.com", phone: "0414 556 778", rsvpStatus: "confirmed", guestCount: 4, adults: 2, kids: 2'
);

content = content.replace(
  'id: "g_toneill", name: "Thomas O\'Neill", initials: "TO", household: "Thomas O\'Neill", email: "thomas.o@example.com", phone: "0418 776 554", rsvpStatus: "confirmed", guestCount: 2',
  'id: "g_toneill", name: "Thomas O\'Neill & Family", initials: "TO", household: "The O\'Neill Family", email: "thomas.o@example.com", phone: "0418 776 554", rsvpStatus: "confirmed", guestCount: 3, adults: 2, kids: 1'
);

content = content.replace(
  'id: "g_rchen", name: "Robert Chen", initials: "RC", household: "The Chen Family", email: "robert.c@example.com", phone: "0421 991 223", rsvpStatus: "confirmed", guestCount: 2',
  'id: "g_rchen", name: "Robert & Lisa Chen", initials: "RC", household: "The Chen Family", email: "robert.c@example.com", phone: "0421 991 223", rsvpStatus: "confirmed", guestCount: 3, adults: 2, kids: 1'
);

content = content.replace(
  'id: "g_u13", name: "Noah Anderson", initials: "NA", household: "Noah Anderson", email: "noah.a@example.com", phone: "0411 001 013", rsvpStatus: "confirmed", guestCount: 2',
  'id: "g_u13", name: "Noah Anderson & Family", initials: "NA", household: "The Anderson Family", email: "noah.a@example.com", phone: "0411 001 013", rsvpStatus: "confirmed", guestCount: 4, adults: 2, kids: 2'
);

content = content.replace(
  'id: "g_u17", name: "Ethan Jackson", initials: "EJ", household: "Ethan Jackson", email: "ethan.j@example.com", phone: "0411 001 017", rsvpStatus: "confirmed", guestCount: 2',
  'id: "g_u17", name: "Ethan Jackson & Family", initials: "EJ", household: "The Jackson Family", email: "ethan.j@example.com", phone: "0411 001 017", rsvpStatus: "confirmed", guestCount: 3, adults: 2, kids: 1'
);

fs.writeFileSync('src/lib/seedData.ts', content, 'utf8');
console.log('Seed guests updated with explicit adults and kids!');
