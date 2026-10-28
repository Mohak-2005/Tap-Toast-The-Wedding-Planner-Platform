import fs from 'fs';

const filePath = 'src/components/RegisterView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Dual emails in handleRegisterCouple
const target1 = `      const newUser = {
        id: 'user_' + Date.now(),
        email: primaryEmail,
        role: 'couple' as const,
        name: coupleName,
        tenantId: 'tenant_galati',
        weddingId: newWeddingId,
      };`;

const replacement1 = `      const bEmail = brideEmail.trim();
      const gEmail = groomEmail.trim();
      const coupleUsers: any[] = [];

      if (bEmail) {
        coupleUsers.push({
          id: 'user_bride_' + Date.now(),
          email: bEmail,
          role: 'couple' as const,
          name: \`\${bName} (\${coupleName})\`,
          partner1: bName,
          partner2: gName,
          tenantId: 'ten1',
          weddingId: newWeddingId,
        });
      }
      if (gEmail && gEmail.toLowerCase() !== bEmail.toLowerCase()) {
        coupleUsers.push({
          id: 'user_groom_' + Date.now(),
          email: gEmail,
          role: 'couple' as const,
          name: \`\${gName} (\${coupleName})\`,
          partner1: bName,
          partner2: gName,
          tenantId: 'ten1',
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
          tenantId: 'ten1',
          weddingId: newWeddingId,
        });
      }`;

if (content.includes(target1)) {
  content = content.replace(target1, replacement1);
  console.log('Target 1 replaced!');
} else {
  // Normalize CRLF to LF and check
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedTarget1 = target1.replace(/\r\n/g, '\n');
  if (normalizedContent.includes(normalizedTarget1)) {
    content = normalizedContent.replace(normalizedTarget1, replacement1);
    console.log('Target 1 replaced (after normalization)!');
  } else {
    console.error('Target 1 NOT found!');
  }
}

// 2. setState users
const target2 = `        users: [...state.users, newUser],`;
const replacement2 = `        users: [...state.users, ...coupleUsers],`;
content = content.replace(target2, replacement2);

// 3. venue fallback to 'Venue TBD'
const target3 = `venue: venue || 'Fernwood Estate, Hunter Valley',`;
const replacement3 = `venue: venue.trim() || 'Venue TBD (To be confirmed)',`;
content = content.replace(target3, replacement3);

// 4. Update venue label and placeholder
const target4 = `                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    CEREMONY &amp; RECEPTION VENUE
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fernwood Estate, Hunter Valley"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />`;

const replacement4 = `                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    CEREMONY &amp; RECEPTION VENUE <span className="text-[#bd9661] font-normal normal-case">(OPTIONAL — Can be confirmed later)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Optional — e.g. Fernwood Estate, Hunter Valley (can be set later)"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />`;

const normContent = content.replace(/\r\n/g, '\n');
const normTarget4 = target4.replace(/\r\n/g, '\n');
if (normContent.includes(normTarget4)) {
  content = normContent.replace(normTarget4, replacement4);
  console.log('Target 4 replaced!');
} else {
  console.error('Target 4 NOT found!');
}

// 5. Add callout above couple registration form
const target5 = `<form onSubmit={handleRegisterCouple} className="space-y-5">`;
const replacement5 = `<form onSubmit={handleRegisterCouple} className="space-y-5">
              {/* Couple Dual Email / Shared Account Notice */}
              <div className="bg-[#faf6ee] border border-[#ebd4b7] rounded-lg p-3.5 flex items-start gap-3 shadow-2xs">
                <span className="text-2xl shrink-0">👫</span>
                <div className="text-xs text-[#544332] leading-snug">
                  <strong className="text-[#15110e] block font-serif font-bold text-sm mb-0.5">
                    Shared Couple Account &bull; Dual Partner Emails
                  </strong>
                  Bride and Groom each register their own individual email address. Both partners will have full access to log into this exact same shared wedding portal.
                </div>
              </div>`;

if (content.includes(target5)) {
  content = content.replace(target5, replacement5);
  console.log('Target 5 replaced!');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('RegisterView.tsx updated successfully!');
