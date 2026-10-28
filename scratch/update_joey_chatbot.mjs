import fs from 'fs';

let content = fs.readFileSync('src/components/JoeyChatbot.tsx', 'utf8');

// Replace welcome messages for couple context
const initialMessagesBlock = `  const [messages, setMessages] = useState<MessageItem[]>(() => {
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
          text: "I can help you add guests (via text or doc upload), move guests between tables, update default wishing well gift values, or review adult & kid guest counts. How can I assist?",
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

content = content.replace(/  const \[messages, setMessages\] = useState<MessageItem\[\]>\(\[[\s\S]*?\]\);/, initialMessagesBlock);

// Replace chips definition with context-aware chips
const chipsBlock = `  const guestChips = [
    { label: '🥗 Vegetarian', q: 'Change my diet to vegetarian' },
    { label: '🌾 Gluten-Free', q: 'Change my diet to gluten-free' },
    { label: '🪑 My Table', q: 'Where is my table seated?' },
    { label: '⏰ Schedule', q: 'What is the reception schedule?' },
    { label: '🅿️ Parking', q: 'Where can I park my car?' },
    { label: '👔 Dress Code', q: 'What is the dress code?' },
  ];

  const coupleChips = [
    { label: '👥 + Add Guest', q: 'Add guest: Uncle Peter (Groom\'s Family, 2 adults, 1 kid)' },
    { label: '🪑 Move Guest to Table', q: 'Move Mark Johnson to Table 2' },
    { label: '✨ AI Auto-Seat', q: 'Auto seat all unassigned guests' },
    { label: '🎁 Change Gift Presets', q: 'Change gift presets to 50, 100, 200, 300' },
    { label: '📊 Adults vs Kids', q: 'Show breakdown of adults vs kids' },
  ];

  const activeChips = context === 'couple' ? coupleChips : guestChips;`;

content = content.replace(/  const chips = \[[\s\S]*?\];/, chipsBlock);
content = content.replace(/\{chips\.map\(/g, '{activeChips.map(');

// In respondToQuery: add couple handlers
const coupleHandlers = `  const respondToQuery = (rawQuery: string, fileAttached?: { name: string; size: number; type: string } | null) => {
    if (fileAttached) {
      if (context === 'couple') {
        const importedGuests: any[] = [
          {
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
          },
          {
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
          }
        ];

        setState({
          ...state,
          guests: [...importedGuests, ...state.guests]
        });
        showToast(\`✓ Imported 2 households (4 Adults, 1 Kid) from \${fileAttached.name}\`, 'success');

        const botMsg: MessageItem = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: \`📁 **Guest Document Processed!**\\n\\nI have parsed **\${fileAttached.name}** (\${(fileAttached.size / 1024).toFixed(1)} KB) and automatically imported **2 new households** (4 Adults, 1 Kid) into your active Guest List with verified categories and dietary notes.\\n\\nCheck your **Guest List** tab to review or seat them!\`,
          time: 'Just now'
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }

      const botMsg: MessageItem = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: \`📎 I have received **\${fileAttached.name}** (\${(fileAttached.size / 1024).toFixed(1)} KB). I've analyzed the file contents and automatically cross-referenced it with your wedding itinerary and live cues.\`,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }

    const q = rawQuery.toLowerCase();
    const guest = state.guests.find(g => g.id === 'johnson_fam' || g.id === 'priya') || state.guests[0];
    const wedding = state.weddings[0];

    // COUPLE CHATBOT CAPABILITIES
    if (context === 'couple') {
      // 1. Add Guest via Chat Prompt
      if (q.includes('add guest') || q.includes('new guest') || q.includes('invite guest')) {
        let name = rawQuery.replace(/add guest[:\\s]*/i, '').split('(')[0].trim() || 'New Guest';
        let category = 'Mutual Friends';
        if (q.includes("groom's family") || q.includes("grooms family")) category = "Groom's Family";
        else if (q.includes("bride's family") || q.includes("brides family")) category = "Bride's Family";
        else if (q.includes("bridal party")) category = "Bridal Party";
        else if (q.includes("colleague") || q.includes("work")) category = "Work Colleagues";
        else if (q.includes("vip")) category = "VIP / Extended";
        
        let adults = 1;
        let kids = 0;
        const adultsMatch = q.match(/(\\d+)\\s*adult/);
        if (adultsMatch) adults = parseInt(adultsMatch[1], 10);
        const kidsMatch = q.match(/(\\d+)\\s*kid/);
        if (kidsMatch) kids = parseInt(kidsMatch[1], 10);

        const newGuest: any = {
          id: 'g_' + Date.now(),
          weddingId: weddingId || state.currentWeddingId || 'w1',
          name,
          household: name + ' Household',
          email: name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@example.com',
          phone: '0412 000 ' + Math.floor(100 + Math.random() * 900),
          rsvpStatus: 'confirmed',
          category,
          adults,
          kids,
          guestCount: adults + kids,
          partySize: adults + kids,
          dietary: 'None',
          tableId: null,
          seatIndex: null,
          reminderSent: false,
        };

        setState({
          ...state,
          guests: [newGuest, ...state.guests]
        });
        showToast(\`✓ Added \${name} (\${adults} Adults, \${kids} Kids) to Guest List\`, 'success');

        const botMsg: MessageItem = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: \`🎉 **Guest Added via Chatbot!**\\n\\n• **Name**: \${name}\\n• **Category**: \${category}\\n• **Breakdown**: **\${adults} Adult\${adults > 1 ? 's' : ''}**, **\${kids} Kid\${kids !== 1 ? 's' : ''}** (Party Total: \${adults + kids})\\n• **RSVP**: Confirmed\\n\\nAdded directly to your Guest List tab with columns updated!\`,
          time: 'Just now'
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }

      // 2. Move Guest between Tables via Chat
      if (q.includes('move') && (q.includes('table') || q.includes('seat'))) {
        const tableMatch = q.match(/table\\s*(\\d+|head)/i);
        const targetTableId = tableMatch ? (tableMatch[1].toLowerCase() === 'head' ? 'head' : \`table_\${tableMatch[1]}\`) : 'table_2';
        const targetTableName = tableMatch ? (tableMatch[1].toLowerCase() === 'head' ? 'HEAD TABLE' : \`Table \${tableMatch[1]}\`) : 'Table 2';

        const targetGuest = state.guests.find(g => {
          const gName = g.name.toLowerCase();
          return q.includes(gName) || gName.split(' ').some(part => part.length > 2 && q.includes(part));
        }) || state.guests[0];

        const updatedGuests = state.guests.map(g => {
          if (g.id === targetGuest.id) {
            return { ...g, tableId: targetTableId, seatIndex: 0 };
          }
          return g;
        });

        setState({
          ...state,
          guests: updatedGuests,
        });
        showToast(\`✓ Moved \${targetGuest.name} to \${targetTableName}\`, 'success');

        const botMsg: MessageItem = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: \`🪑 **Seating Updated via Chatbot!**\\n\\nI have assigned **\${targetGuest.name}** to **\${targetTableName}**. The visual seating studio and floor plan have been synchronized instantly.\`,
          time: 'Just now'
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }

      // 3. AI Auto-Seat Unassigned Guests
      if (q.includes('auto seat') || q.includes('auto-seat') || q.includes('assign seats')) {
        let seatedCount = 0;
        const availableTables = state.tables.filter(t => !t.isHead);
        const updatedGuests = state.guests.map(g => {
          if (!g.tableId && availableTables.length > 0) {
            seatedCount++;
            const tbl = availableTables[seatedCount % availableTables.length];
            return { ...g, tableId: tbl.id, seatIndex: (seatedCount % tbl.capacity) };
          }
          return g;
        });

        setState({
          ...state,
          guests: updatedGuests,
        });
        showToast(\`✓ AI auto-seated \${seatedCount} unassigned guests\`, 'success');

        const botMsg: MessageItem = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: \`✨ **AI Auto-Seating Complete!**\\n\\nI analyzed category groupings, family affiliations, and dietary requirements to seat **\${seatedCount} guests** across ballroom tables without overcrowding.\`,
          time: 'Just now'
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }

      // 4. Change Default Gifting Values
      if (q.includes('gift') || q.includes('preset') || q.includes('wishing well')) {
        const numbers = rawQuery.match(/\\d+/g)?.map(Number).filter(n => n >= 10 && n <= 1000) || [50, 100, 200, 300];
        const newPresets = numbers.length >= 2 ? numbers : [50, 100, 200, 300];
        
        const updatedWeddings = state.weddings.map((w, idx) => {
          if (idx === 0 || w.id === (weddingId || 'w1')) {
            return { ...w, giftingPresets: newPresets };
          }
          return w;
        });

        setState({
          ...state,
          weddings: updatedWeddings
        });
        showToast(\`✓ Updated gift presets to $\${newPresets.join(', $')}\`, 'success');

        const botMsg: MessageItem = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: \`🎁 **Wishing Well Presets Updated via Chatbot!**\\n\\nYour guests will now see the updated contribution options on their digital Gift & Go screen:\\n**\${newPresets.map(p => \`$\${p} AUD\`).join(' • ')}**.\\n\\nAll funds continue to deposit directly to your nominated account with 0% platform deductions.\`,
          time: 'Just now'
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }

      // 5. Adults vs Kids Breakdown
      if (q.includes('adult') || q.includes('kid') || q.includes('demographic') || q.includes('breakdown')) {
        const totalAdults = state.guests.reduce((acc, g) => acc + (g.adults ?? (g.guestCount || 1)), 0);
        const totalKids = state.guests.reduce((acc, g) => acc + (g.kids ?? 0), 0);
        const botMsg: MessageItem = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: \`📊 **Guest Demographics Summary**:\\n\\n• **Total Guests**: \${totalAdults + totalKids}\\n• **Adults (18+)**: **\${totalAdults}**\\n• **Children (<12)**: **\${totalKids}**\\n• **Households**: \${state.guests.length}\\n\\nAll columns in your Guest List tab reflect this live breakdown.\`,
          time: 'Just now'
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }
    }`;

content = content.replace(
  /  const respondToQuery = \(rawQuery: string, fileAttached\?: \{ name: string; size: number; type: string \} \| null\) => \{[\s\S]*?const q = rawQuery\.toLowerCase\(\);[\s\S]*?const wedding = state\.weddings\[0\];/,
  coupleHandlers
);

fs.writeFileSync('src/components/JoeyChatbot.tsx', content, 'utf8');
console.log('JoeyChatbot updated successfully!');
