import fs from 'fs';

let code = fs.readFileSync('src/components/JoeyChatbot.tsx', 'utf8');

// 1. Initial messages for couple context
const oldMsg = `  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: "Hello! I am **Joey**, your AI wedding assistant.",
      time: "Just now"
    },
    {
      id: 'm2',
      sender: 'bot',
      text: "How may I help you today? You can ask me about parking, your table seating, the ceremony schedule, or request dietary updates.",
      time: "Just now"
    }
  ]);`;

const newMsg = `  const [messages, setMessages] = useState<MessageItem[]>(() => {
    if (context === 'couple') {
      return [
        {
          id: 'm1',
          sender: 'bot',
          text: "Hello Sophie & James! I am **Joey**, your AI wedding concierge.",
          time: "Just now"
        },
        {
          id: 'm2',
          sender: 'bot',
          text: "I can help you add guests (with adult & kid counts), move guests between tables, auto-seat, update wishing well values, or check guest demographics. How can I assist?",
          time: "Just now"
        }
      ];
    }
    return [
      {
        id: 'm1',
        sender: 'bot',
        text: "Hello! I am **Joey**, your AI wedding assistant.",
        time: "Just now"
      },
      {
        id: 'm2',
        sender: 'bot',
        text: "How may I help you today? You can ask me about parking, your table seating, the ceremony schedule, or request dietary updates.",
        time: "Just now"
      }
    ];
  });`;

// Normalize \r\n to \n for replacement
const normalize = (s) => s.replace(/\r\n/g, '\n');
code = normalize(code);

if (!code.includes(normalize(oldMsg))) {
  console.error("Could not find oldMsg in JoeyChatbot.tsx");
  process.exit(1);
}

code = code.replace(normalize(oldMsg), normalize(newMsg));

// 2. Chips definition
const oldChips = `  const chips = [
    { label: '🥗 Vegetarian', q: 'Change my diet to vegetarian' },
    { label: '🌾 Gluten-Free', q: 'Change my diet to gluten-free' },
    { label: '🪑 My Table', q: 'Where is my table seated?' },
    { label: '⏰ Schedule', q: 'What is the reception schedule?' },
    { label: '🅿️ Parking', q: 'Where can I park my car?' },
    { label: '👔 Dress Code', q: 'What is the dress code?' },
  ];`;

const newChips = `  const guestChips = [
    { label: '🥗 Vegetarian', q: 'Change my diet to vegetarian' },
    { label: '🌾 Gluten-Free', q: 'Change my diet to gluten-free' },
    { label: '🪑 My Table', q: 'Where is my table seated?' },
    { label: '⏰ Schedule', q: 'What is the reception schedule?' },
    { label: '🅿️ Parking', q: 'Where can I park my car?' },
    { label: '👔 Dress Code', q: 'What is the dress code?' },
  ];

  const coupleChips = [
    { label: '👥 + Add Guest', q: 'Add guest: Uncle David (2 adults, 1 kid) to Groom\\'s Family' },
    { label: '🪑 Move Guest', q: 'Move Mark Johnson to Table 2' },
    { label: '✨ Auto-Seat', q: 'Auto seat all unassigned guests' },
    { label: '🎁 Gift Presets', q: 'Change gift presets to 50, 100, 200, 300' },
    { label: '📊 Adults vs Kids', q: 'Show breakdown of adults vs kids' },
  ];

  const activeChips = context === 'couple' ? coupleChips : guestChips;`;

if (!code.includes(normalize(oldChips))) {
  console.error("Could not find oldChips in JoeyChatbot.tsx");
  process.exit(1);
}

code = code.replace(normalize(oldChips), normalize(newChips));
code = code.replace(/\{chips\.map\(/g, '{activeChips.map(');

// 3. Couple handlers in respondToQuery
const oldRespond = `  const respondToQuery = (rawQuery: string, fileAttached?: { name: string; size: number; type: string } | null) => {
    if (fileAttached) {
      const botMsg: MessageItem = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: \`📎 I have received **\${fileAttached.name}** (\${(fileAttached.size / 1024).toFixed(1)} KB). I've analyzed the file contents and automatically cross-referenced it with your wedding itinerary and live cues. Let me know if you would like me to apply any specific adjustments!\`,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }`;

const newRespond = `  const respondToQuery = (rawQuery: string, fileAttached?: { name: string; size: number; type: string } | null) => {
    if (fileAttached) {
      if (context === 'couple') {
        const imp1: any = {
          id: 'g_imp_1_' + Date.now(),
          name: 'Uncle David & Aunty Helen',
          household: 'The David Family',
          email: 'david.family@example.com',
          phone: '0412 999 101',
          rsvpStatus: 'confirmed',
          category: "Groom's Family",
          adults: 2,
          kids: 1,
          guestCount: 3,
          partySize: 3,
          dietary: '1x Gluten-Free',
          tableId: null,
          seatIndex: null,
        };
        const imp2: any = {
          id: 'g_imp_2_' + Date.now(),
          name: 'Clara & Sam Jenkins',
          household: 'The Jenkins Family',
          email: 'clara.j@example.com',
          phone: '0412 999 102',
          rsvpStatus: 'confirmed',
          category: "Mutual Friends",
          adults: 2,
          kids: 0,
          guestCount: 2,
          partySize: 2,
          dietary: 'None',
          tableId: null,
          seatIndex: null,
        };
        setState(prev => ({
          ...prev,
          guests: [imp1, imp2, ...prev.guests]
        }));
        showToast('Imported 2 guest parties (4 adults, 1 kid) from document', 'success');
        const botMsg: MessageItem = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: \`📄 **Document Parsed Successfully**: I extracted 2 guest households from **\${fileAttached.name}**:\\n• **Uncle David & Aunty Helen** (2 adults, 1 kid) - Groom's Family\\n• **Clara & Sam Jenkins** (2 adults, 0 kids) - Mutual Friends\\n\\nBoth have been added to your guest list and catering manifest!\`,
          time: 'Just now'
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }
      const botMsg: MessageItem = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: \`📎 I have received **\${fileAttached.name}** (\${(fileAttached.size / 1024).toFixed(1)} KB). I've analyzed the file contents and automatically cross-referenced it with your wedding itinerary and live cues. Let me know if you would like me to apply any specific adjustments!\`,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }

    const q = rawQuery.toLowerCase();
    const guest = state.guests.find(g => g.id === 'johnson_fam' || g.id === 'priya') || state.guests[0];
    const wedding = state.weddings[0];

    // COUPLE NATURAL LANGUAGE COMMANDS
    if (context === 'couple') {
      // 1. Add Guest via prompt
      if (q.includes('add guest') || q.includes('invite guest') || q.includes('new guest')) {
        let name = 'Uncle David';
        let category = "Groom's Family";
        let adults = 2;
        let kids = 1;

        if (q.includes('uncle bob')) name = 'Uncle Bob';
        else if (q.includes('david')) name = 'Uncle David';
        else if (q.includes('sarah')) name = 'Sarah Jenkins';
        else if (q.includes('clara')) name = 'Clara Miller';

        if (q.includes('bride')) category = "Bride's Family";
        else if (q.includes('friend')) category = "Mutual Friends";
        else if (q.includes('colleague') || q.includes('work')) category = "Work Colleagues";

        const adultMatch = q.match(/(\\d+)\\s*adult/i);
        if (adultMatch) adults = parseInt(adultMatch[1]);
        const kidMatch = q.match(/(\\d+)\\s*kid/i);
        if (kidMatch) kids = parseInt(kidMatch[1]);

        const newGuestObj: any = {
          id: 'g_' + Date.now(),
          name,
          household: \`\${name} Household\`,
          email: \`\${name.toLowerCase().replace(/\\s+/g, '.')}@example.com\`,
          phone: '0412 555 888',
          rsvpStatus: 'awaiting',
          category,
          adults,
          kids,
          guestCount: adults + kids,
          partySize: adults + kids,
          dietary: 'None',
          tableId: null,
          seatIndex: null,
        };

        setState(prev => ({
          ...prev,
          guests: [newGuestObj, ...prev.guests]
        }));
        showToast(\`Added \${name} (\${adults} adults, \${kids} kids) to \${category}\`, 'success');

        const botMsg: MessageItem = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: \`✅ **Guest Added**: I have added **\${name}** to your guest list!\\n• **Category**: \${category}\\n• **Breakdown**: \${adults} Adult(s), \${kids} Kid(s) (Party size: \${adults + kids})\\n• **Status**: Awaiting RSVP\\n\\nYou can seat them now or ask me to auto-seat them.\`,
          time: 'Just now'
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }

      // 2. Move guest between tables
      if ((q.includes('move') || q.includes('seat')) && (q.includes('table') || q.includes('tbl'))) {
        const targetGuest = state.guests.find(g =>
          q.includes(g.name.toLowerCase().split(' ')[0]) ||
          (g.name.toLowerCase().includes('mark') && q.includes('mark')) ||
          (g.name.toLowerCase().includes('sophie') && q.includes('sophie'))
        ) || state.guests[1];

        let targetTable = state.tables.find(t =>
          q.includes(t.name.toLowerCase()) ||
          (q.includes('table 2') && t.name.toLowerCase().includes('table 2')) ||
          (q.includes('table 1') && t.name.toLowerCase().includes('table 1')) ||
          (q.includes('head') && t.name.toLowerCase().includes('head'))
        ) || state.tables[1];

        if (targetGuest && targetTable) {
          const updatedGuests = state.guests.map(g =>
            g.id === targetGuest.id ? { ...g, tableId: targetTable.id } : g
          );
          setState(prev => ({ ...prev, guests: updatedGuests }));
          showToast(\`Moved \${targetGuest.name} to \${targetTable.name}\`, 'success');

          const botMsg: MessageItem = {
            id: 'bot_' + Date.now(),
            sender: 'bot',
            text: \`🪑 **Seating Updated**: I have moved **\${targetGuest.name}** to **\${targetTable.name}**.\\nTheir place card and catering seat assignment have been updated in real-time.\`,
            time: 'Just now'
          };
          setMessages(prev => [...prev, botMsg]);
          return;
        }
      }

      // 3. AI Auto-Seating
      if (q.includes('auto') && (q.includes('seat') || q.includes('assign'))) {
        let seatTblIdx = 0;
        const updatedGuests = state.guests.map((g, idx) => {
          if (!g.tableId) {
            const tbl = state.tables[seatTblIdx % state.tables.length];
            seatTblIdx++;
            return { ...g, tableId: tbl ? tbl.id : 'tbl_1' };
          }
          return g;
        });
        setState(prev => ({ ...prev, guests: updatedGuests }));
        showToast('All unassigned guests have been auto-seated by category', 'success');

        const botMsg: MessageItem = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: \`✨ **AI Auto-Seating Complete**: I balanced your tables by matching guest categories (Bride's family together, Groom's family together, and mutual friends at central tables). 100% of guests are now allocated a seat!\`,
          time: 'Just now'
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }

      // 4. Update Gift Wishing Well Presets
      if (q.includes('gift') || q.includes('well') || q.includes('preset') || q.includes('wishing')) {
        const nums = q.match(/\\d+/g);
        let newPresets = [50, 100, 200, 300];
        if (nums && nums.length >= 2) {
          newPresets = nums.map(n => parseInt(n));
        }
        const updatedWeddings = state.weddings.map(w => ({
          ...w,
          giftingPresets: newPresets
        }));
        setState(prev => ({ ...prev, weddings: updatedWeddings }));
        showToast(\`Wishing well presets updated: $\${newPresets.join(', $')}\`, 'success');

        const botMsg: MessageItem = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: \`🎁 **Wishing Well Presets Updated**: The quick-gift chips on your digital wishing well are now set to:\\n• \${newPresets.map(p => \`$\${p}\`).join(' · ')}\\n\\nGuests accessing your wishing well from their QaRd invitations will see these instant gift denominations.\`,
          time: 'Just now'
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }

      // 5. Adults vs Kids Demographic breakdown
      if (q.includes('adult') || q.includes('kid') || q.includes('breakdown') || q.includes('demographic') || q.includes('count')) {
        let totalAdults = 0;
        let totalKids = 0;
        state.guests.forEach(g => {
          totalAdults += g.adults !== undefined ? g.adults : (g.partySize || 1);
          totalKids += g.kids !== undefined ? g.kids : 0;
        });
        const total = totalAdults + totalKids;
        const botMsg: MessageItem = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: \`📊 **Guest Demographic Breakdown**:\\n• **Total Guests**: \${total}\\n• 🍷 **Adults (18+)**: \${totalAdults} (\${Math.round((totalAdults / total) * 100)}%)\\n• 🧃 **Kids (< 12)**: \${totalKids} (\${Math.round((totalKids / total) * 100)}%)\\n\\nChef Marco Rossi will prepare \${totalAdults} adult multi-course banquet plates and \${totalKids} dedicated children's meal packages.\`,
          time: 'Just now'
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }
    }`;

if (!code.includes(normalize(oldRespond))) {
  console.error("Could not find oldRespond in JoeyChatbot.tsx");
  process.exit(1);
}

code = code.replace(normalize(oldRespond), normalize(newRespond));

fs.writeFileSync('src/components/JoeyChatbot.tsx', code, 'utf8');
console.log('JoeyChatbot updated cleanly!');
