import { PrivateRunSheetItem } from './types';

export interface RunSheetTemplate {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  items: Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'>[];
}

export const STANDARD_RUN_SHEET_TEMPLATES: RunSheetTemplate[] = [
  {
    id: 'classic-vineyard',
    name: 'Classic Garden & Vineyard Celebration',
    subtitle: 'Afternoon ceremony with seated dinner banquet',
    badge: 'Popular',
    description: 'A timeless flow designed for estate and vineyard weddings. Includes morning bridal prep, 3:00 PM vows, golden hour photography, and structured evening toasts.',
    items: [
      {
        time: '09:00',
        activity: 'Bridal Party Hair & Makeup Bump-In',
        notes: 'Styling team arrives at bridal suite. Champagne & breakfast platter provided.',
        privateNotes: 'Lead stylist contact: +61 412 888 111. Room access key code: 4421.',
        section: 'morning',
        category: 'setup',
        vendorRole: 'Hair & Makeup',
      },
      {
        time: '11:00',
        activity: 'Florist & Ceremony Arch Installation',
        notes: 'Arbour floristry and aisle markers setup on the central lawn.',
        privateNotes: 'Hydration buckets behind pavilion. Final inspection by planner at 12:30.',
        section: 'morning',
        category: 'setup',
        vendorRole: 'Florist',
      },
      {
        time: '13:30',
        activity: 'Photographer & Videographer Arrival',
        notes: 'Capturing bridal details, gown flat-lays, groom prep & buttonhole pinning.',
        privateNotes: 'Photographer shot list: bridal robe gifts, heirloom jewelry, perfume bottle.',
        section: 'afternoon',
        category: 'vendor',
        vendorRole: 'Photographer',
      },
      {
        time: '14:30',
        activity: 'Guest Arrival & Welcome Music',
        notes: 'Acoustic duo begins playing on lawn. Welcome sparkling water served.',
        privateNotes: 'Ushers hand out ceremony order-of-service cards.',
        section: 'afternoon',
        category: 'ceremony',
        vendorRole: 'Musicians',
      },
      {
        time: '15:00',
        activity: 'Wedding Ceremony & Processional',
        notes: 'Celebrant welcome, bridal entrance, exchange of vows & rings, first kiss.',
        privateNotes: 'Celebrant mic check confirmed. Signing table pens and certificate ready.',
        section: 'afternoon',
        category: 'ceremony',
        vendorRole: 'Celebrant',
      },
      {
        time: '15:45',
        activity: 'Confetti Toss & Congratulatory Mingle',
        notes: 'Couple walks down aisle to petal toss. Group photo on main steps.',
        privateNotes: 'Drone permitted for 5-minute overhead group portrait.',
        section: 'afternoon',
        category: 'ceremony',
        vendorRole: 'Photographer',
      },
      {
        time: '16:15',
        activity: 'Cocktail Hour & Roaming Canapés',
        notes: 'Beverage bar opens. Canapés served on the garden terrace.',
        privateNotes: 'Reserved canapé platter delivered directly to couple during portrait session.',
        section: 'afternoon',
        category: 'reception',
        vendorRole: 'Catering',
      },
      {
        time: '17:30',
        activity: 'Golden Hour Sunset Bridal Portraits',
        notes: 'Couple and bridal party slip away to vineyard rows for sunset shoot.',
        privateNotes: 'Golf cart escort booked with venue coordinator.',
        section: 'evening',
        category: 'vendor',
        vendorRole: 'Photographer',
      },
      {
        time: '18:00',
        activity: 'Guests Seated in Grand Ballroom',
        notes: 'MC asks guests to locate their tables and take their seats.',
        privateNotes: 'MC mic live check. Table water carafes filled and bread rolls placed.',
        section: 'evening',
        category: 'mc',
        vendorRole: 'Master of Ceremonies',
      },
      {
        time: '18:15',
        activity: 'Bridal Grand Entrance & Welcome Toast',
        notes: 'MC introduces bridal party and newlyweds to upbeat entrance track.',
        privateNotes: 'Entrance track: "Signed, Sealed, Delivered" queued at 0:15 mark.',
        section: 'evening',
        category: 'mc',
        vendorRole: 'Master of Ceremonies',
      },
      {
        time: '18:30',
        activity: 'Entrée Service & Wine Pairing',
        notes: 'Plated entrée served to all tables. Ambient jazz playlist.',
        privateNotes: 'Special dietary meals delivered first (Tables 3 and 7).',
        section: 'evening',
        category: 'reception',
        vendorRole: 'Catering',
      },
      {
        time: '19:15',
        activity: 'Welcome Speeches (Parents & Maid of Honor)',
        notes: 'Father of the Bride and Maid of Honor toasts.',
        privateNotes: 'MC introduces each speaker with brief background. 5-minute timer guide.',
        section: 'evening',
        category: 'mc',
        vendorRole: 'Master of Ceremonies',
      },
      {
        time: '19:45',
        activity: 'Main Banquet Course Service',
        notes: 'Alternate drop mains served with tableside red & white wines.',
        privateNotes: 'Vendor meal service in side room during guest dinner.',
        section: 'evening',
        category: 'reception',
        vendorRole: 'Catering',
      },
      {
        time: '20:45',
        activity: 'Cake Cutting & Official First Dance',
        notes: 'Couple cuts two-tier wedding cake, followed immediately by first dance.',
        privateNotes: 'Cake knife and server on dessert table. Low-fog machine activation cue.',
        section: 'evening',
        category: 'mc',
        vendorRole: 'Master of Ceremonies',
      },
      {
        time: '21:00',
        activity: 'Open Dance Floor & Live Band',
        notes: 'Party set commences. Desserts and wedding cake served roving.',
        privateNotes: 'Band 45-minute high energy set followed by DJ transition.',
        section: 'evening',
        category: 'reception',
        vendorRole: 'Band / DJ',
      },
      {
        time: '22:45',
        activity: 'Bouquet Toss & Sparkler Farewell Arch',
        notes: 'Guests assemble outside portico with sparklers for couple farewell.',
        privateNotes: 'Safety buckets with sand at both ends of the driveway.',
        section: 'evening',
        category: 'mc',
        vendorRole: 'Master of Ceremonies',
      },
      {
        time: '23:00',
        activity: 'Guest Departure & Event Pack-Down',
        notes: 'Guest shuttles depart for city hotels. Venue bump-out begins.',
        privateNotes: 'Florals loaded into bridal family vehicle. Hire decor packed into crates.',
        section: 'evening',
        category: 'packdown',
        vendorRole: 'Hire & Styling',
      },
    ],
  },
  {
    id: 'twilight-black-tie',
    name: 'Modern Twilight Black-Tie',
    subtitle: 'Chic late afternoon ceremony and luxury cocktail party',
    badge: 'Formal',
    description: 'Sleek metropolitan timeline featuring a 5:30 PM twilight ceremony, champagne tower pour, seated 3-course dinner, live horn section, and midnight car send-off.',
    items: [
      {
        time: '13:00',
        activity: 'Production & Lighting Bump-In',
        notes: 'Sound, intelligent lighting, stage and dance floor installations.',
        privateNotes: 'Loading dock pass 04. Venue electrical tech on site.',
        section: 'afternoon',
        category: 'setup',
        vendorRole: 'AV & Production',
      },
      {
        time: '15:30',
        activity: 'Couple First Look & Editorial Shoot',
        notes: 'Private first look in courtyard followed by urban portraits.',
        privateNotes: 'Driver standing by for transfer between photo locations.',
        section: 'afternoon',
        category: 'vendor',
        vendorRole: 'Photographer',
      },
      {
        time: '17:00',
        activity: 'Welcome Bar & String Quartet',
        notes: 'Guests arrive dressed in black-tie. Welcome martinis and prosecco.',
        privateNotes: 'Coat check staffed at main foyer.',
        section: 'afternoon',
        category: 'ceremony',
        vendorRole: 'Musicians',
      },
      {
        time: '17:30',
        activity: 'Twilight Candlelit Vows',
        notes: 'Dramatic candlelit runway aisle. Modern ceremony and personalized vows.',
        privateNotes: 'Dim hall lights to 30% right before processional cue.',
        section: 'evening',
        category: 'ceremony',
        vendorRole: 'Celebrant',
      },
      {
        time: '18:15',
        activity: 'Champagne Tower Pour & Caviar Station',
        notes: '5-tier coupe glass champagne tower pour by the newlyweds.',
        privateNotes: '6 bottles of chilled champagne ready with linen cloths.',
        section: 'evening',
        category: 'reception',
        vendorRole: 'Catering',
      },
      {
        time: '19:15',
        activity: 'Grand Ballroom Doors Reveal',
        notes: 'Curtains open to dramatic black-tie dining room with custom floral clouds.',
        privateNotes: 'MC mic active. Verify spotlight on head table.',
        section: 'evening',
        category: 'mc',
        vendorRole: 'Master of Ceremonies',
      },
      {
        time: '19:30',
        activity: 'Seated 3-Course Banquet & Speeches',
        notes: 'First course and paired wines. Toasts from Best Man and Groom.',
        privateNotes: 'Keep speeches strictly under 6 minutes each.',
        section: 'evening',
        category: 'reception',
        vendorRole: 'Catering',
      },
      {
        time: '21:15',
        activity: 'Couple First Dance & Cold Sparks',
        notes: 'Choreographed slow dance transitioning into upbeat party set.',
        privateNotes: 'Cold spark pyrotechnics operator cue on chorus beat.',
        section: 'evening',
        category: 'mc',
        vendorRole: 'Master of Ceremonies',
      },
      {
        time: '21:30',
        activity: '7-Piece Live Brass Band',
        notes: 'Full party band playing funk, motown, and contemporary chart-toppers.',
        privateNotes: 'Cocktail bar transitions to espresso martinis and negronis.',
        section: 'evening',
        category: 'reception',
        vendorRole: 'Band / DJ',
      },
      {
        time: '23:30',
        activity: 'Late Night Gourmet Sliders & Fries',
        notes: 'Mini brioche burgers and truffle fries passed on dance floor.',
        privateNotes: 'Late night snack catering confirmed for 110 pax.',
        section: 'evening',
        category: 'reception',
        vendorRole: 'Catering',
      },
      {
        time: '00:00',
        activity: 'Midnight Classic Car Send-Off',
        notes: 'Couple departs in vintage Rolls Royce amid cheering guests.',
        privateNotes: 'Driver parked outside front canopy at 23:45.',
        section: 'evening',
        category: 'packdown',
        vendorRole: 'Transport',
      },
    ],
  },
  {
    id: 'multicultural-fusion',
    name: 'Multicultural Fusion Celebration',
    subtitle: 'Baraat procession, sacred vows, and high-energy reception',
    badge: 'Cultural',
    description: 'Dynamic multi-part celebration combining morning cultural processions, sacred rituals, afternoon tea, evening dinner banquet, and choreographed dance performances.',
    items: [
      {
        time: '10:00',
        activity: 'Mandap Floral Architecture & Altar Setup',
        notes: 'Stage backdrop, four-pillar floral canopy, and ceremonial fire pit arrangement.',
        privateNotes: 'Mandap inspection by family elders at 11:30 AM.',
        section: 'morning',
        category: 'setup',
        vendorRole: 'Hire & Styling',
      },
      {
        time: '13:00',
        activity: 'Groom Baraat Procession & Dhol Drummers',
        notes: 'High-energy arrival with live dhol players, family dancing down driveway.',
        privateNotes: 'Permit confirmed for private road entry. Milni garlands ready at entrance.',
        section: 'afternoon',
        category: 'ceremony',
        vendorRole: 'Musicians',
      },
      {
        time: '14:00',
        activity: 'Sacred Ceremony & Pheras',
        notes: 'Bridal entrance, Jai Mala exchange, seven sacred vows around holy fire.',
        privateNotes: 'Priest microphone check and translation monitor ready.',
        section: 'afternoon',
        category: 'ceremony',
        vendorRole: 'Celebrant',
      },
      {
        time: '16:00',
        activity: 'Afternoon High Tea & Sweets Reception',
        notes: 'Masala chai, savoury bites, and traditional bridal party photo sessions.',
        privateNotes: 'Couple rest break in private green room from 16:45 to 17:45.',
        section: 'afternoon',
        category: 'reception',
        vendorRole: 'Catering',
      },
      {
        time: '18:30',
        activity: 'Evening Reception Doors Open',
        notes: 'Cocktails and canapés served in the ballroom foyer. Red carpet photo wall.',
        privateNotes: 'DJ testing heavy bass and stage monitors.',
        section: 'evening',
        category: 'reception',
        vendorRole: 'Band / DJ',
      },
      {
        time: '19:00',
        activity: 'Royal Grand Entrance of Newlyweds',
        notes: 'Grand fanfare entrance with bridal party choreographed routine.',
        privateNotes: 'MC introduces bride and groom with full customary honorifics.',
        section: 'evening',
        category: 'mc',
        vendorRole: 'Master of Ceremonies',
      },
      {
        time: '19:30',
        activity: 'Family Sangeet & Choreographed Performances',
        notes: 'Friends and family dance routines followed by couple slow dance.',
        privateNotes: 'Lighting spotlights programmed for each performance sequence.',
        section: 'evening',
        category: 'mc',
        vendorRole: 'Master of Ceremonies',
      },
      {
        time: '20:30',
        activity: 'Royal Buffet Feast Dinner Service',
        notes: 'Multi-course luxury banquet service with live tandoor and chef stations.',
        privateNotes: 'VIP tables 1 and 2 served family-style at table.',
        section: 'evening',
        category: 'reception',
        vendorRole: 'Catering',
      },
      {
        time: '21:45',
        activity: 'Open Dance Floor & Live Dhol Fusion',
        notes: 'DJ mixes Bollywood, Bhangra, and top 40 pop with live percussionist.',
        privateNotes: 'Keep cold water stations topped up on sides of dance floor.',
        section: 'evening',
        category: 'reception',
        vendorRole: 'Band / DJ',
      },
      {
        time: '23:45',
        activity: 'Vidaai / Final Emotional Farewell',
        notes: 'Traditional farewell ritual with immediate families.',
        privateNotes: 'Private departure car waiting at garden porte-cochère.',
        section: 'evening',
        category: 'packdown',
        vendorRole: 'Transport',
      },
    ],
  },
];

export interface AiDraftGeneratorOptions {
  ceremonyTime: string;
  receptionTime: string;
  style: 'seated' | 'cocktail' | 'buffet' | 'twilight';
  speechesCount: number;
  sunsetTime: string;
}

/**
 * Calculates a balanced, customized run sheet using milestone offsets
 */
export function generateAiRunSheetDraft(options: AiDraftGeneratorOptions): Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'>[] {
  const { ceremonyTime, receptionTime, style, speechesCount, sunsetTime } = options;

  const parseMins = (t: string): number => {
    const parts = t.replace(/[^\d:]/g, '').split(':');
    let h = parseInt(parts[0], 10) || 15;
    const m = parseInt(parts[1], 10) || 0;
    if (t.toLowerCase().includes('pm') && h < 12) h += 12;
    return h * 60 + m;
  };

  const formatMins = (mins: number): string => {
    let h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}`;
  };

  const cerMins = parseMins(ceremonyTime || '15:30');
  const recMins = parseMins(receptionTime || '18:00');
  const sunMins = parseMins(sunsetTime || '17:45');

  const draft: Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'>[] = [];

  // Morning Prep
  draft.push({
    time: formatMins(Math.max(480, cerMins - 360)), // 6h before
    activity: 'Bridal & Groom Morning Preparation',
    notes: 'Hair, makeup, groom party suit fittings, breakfast and champagne.',
    privateNotes: 'Photographer arrives 2 hours before ceremony for detail shots.',
    section: 'morning',
    category: 'setup',
    vendorRole: 'Hair & Makeup',
  });

  // Vendor Setup
  draft.push({
    time: formatMins(cerMins - 180), // 3h before
    activity: 'Vendor Bump-In & Room Styling Setup',
    notes: 'Floristry installations, ceremony sound check, welcome signs placed.',
    privateNotes: 'Venue coordinator checks arbour stability and aisle markers.',
    section: 'morning',
    category: 'setup',
    vendorRole: 'Coordinator & Vendor',
  });

  // Guest Arrival
  draft.push({
    time: formatMins(cerMins - 30),
    activity: 'Guest Arrival & Pre-Ceremony Music',
    notes: 'Guests arrive, ambient acoustic music, order of service distributed.',
    privateNotes: 'Groom in position 20 minutes prior to processional.',
    section: 'afternoon',
    category: 'ceremony',
    vendorRole: 'Musicians',
  });

  // Ceremony
  draft.push({
    time: formatMins(cerMins),
    activity: 'Wedding Ceremony',
    notes: 'Processional, reading of vows, ring exchange, first kiss & certificate signing.',
    privateNotes: 'Celebrant sound confirmed. Signing table pens and legal papers checked.',
    section: 'afternoon',
    category: 'ceremony',
    vendorRole: 'Celebrant',
  });

  // Congratulatory Mingle & Photos
  draft.push({
    time: formatMins(cerMins + 45),
    activity: 'Petal Toss & Family Group Portraits',
    notes: 'Confetti aisle exit followed by immediate family and bridal party portraits.',
    privateNotes: 'Photographer has printed VIP group shot list.',
    section: 'afternoon',
    category: 'ceremony',
    vendorRole: 'Photographer',
  });

  // Cocktail Hour
  draft.push({
    time: formatMins(cerMins + 75),
    activity: 'Cocktail Hour & Roaming Canapés',
    notes: 'Bar service opens, chef specialty canapés served on lawn or terrace.',
    privateNotes: 'Beverage package active. Canape platter saved for bridal party.',
    section: 'afternoon',
    category: 'reception',
    vendorRole: 'Catering',
  });

  // Sunset Photos (Golden hour anchor)
  draft.push({
    time: formatMins(sunMins - 20),
    activity: 'Golden Hour Couple Sunset Portraits',
    notes: 'Quiet 25-minute romantic photo and video session during optimal golden light.',
    privateNotes: 'Veil and bouquet touch-up before heading out to grounds.',
    section: 'evening',
    category: 'vendor',
    vendorRole: 'Photographer',
  });

  // Guests Seated
  draft.push({
    time: formatMins(recMins),
    activity: 'Guests Invited into Reception Room',
    notes: 'MC invites guests to find their seats. House music transitions to entrance track.',
    privateNotes: 'MC mic live check. Table water filled.',
    section: 'evening',
    category: 'mc',
    vendorRole: 'Master of Ceremonies',
  });

  // Grand Entrance
  draft.push({
    time: formatMins(recMins + 15),
    activity: 'Bridal Grand Entrance & Welcome by MC',
    notes: 'High-energy introduction of parents, wedding party, and newlyweds.',
    privateNotes: 'Audio track queued. Confetti canons or spotlights timed with entrance.',
    section: 'evening',
    category: 'mc',
    vendorRole: 'Master of Ceremonies',
  });

  // Dinner Service & Speeches Pacing
  if (style === 'seated') {
    draft.push({
      time: formatMins(recMins + 30),
      activity: 'Entrée Course Service',
      notes: 'Plated entrée service with sommelier wine pouring.',
      privateNotes: 'Special diets (vegan, GF) delivered first.',
      section: 'evening',
      category: 'reception',
      vendorRole: 'Catering',
    });

    draft.push({
      time: formatMins(recMins + 75),
      activity: `First Speeches (${Math.min(2, speechesCount)} speakers)`,
      notes: 'MC introduces first block of speakers (Parents / Maid of Honor).',
      privateNotes: 'Champagne poured in all glasses prior to toasts.',
      section: 'evening',
      category: 'mc',
      vendorRole: 'Master of Ceremonies',
    });

    draft.push({
      time: formatMins(recMins + 105),
      activity: 'Main Banquet Course Service',
      notes: 'Alternate drop main course served with warm crusty bread & seasonal sides.',
      privateNotes: 'Vendor dinners served in vendor crew lounge.',
      section: 'evening',
      category: 'reception',
      vendorRole: 'Catering',
    });

    if (speechesCount > 2) {
      draft.push({
        time: formatMins(recMins + 165),
        activity: `Final Speeches (${speechesCount - Math.min(2, speechesCount)} speakers: Best Man & Newlyweds)`,
        notes: 'Best Man toast followed by couple thank-you address to guests.',
        privateNotes: 'MC brings handheld wireless mic to couple table.',
        section: 'evening',
        category: 'mc',
        vendorRole: 'Master of Ceremonies',
      });
    }
  } else {
    // Cocktail or Buffet style
    draft.push({
      time: formatMins(recMins + 30),
      activity: 'Dinner Service Commences (Buffet / Live Stations)',
      notes: 'MC invites tables sequentially to visit the culinary live stations.',
      privateNotes: 'Head table and family tables invited first.',
      section: 'evening',
      category: 'reception',
      vendorRole: 'Catering',
    });

    draft.push({
      time: formatMins(recMins + 90),
      activity: `Speeches & Toasts (${speechesCount} speakers)`,
      notes: 'All toasts presented together while guests enjoy dinner & drinks.',
      privateNotes: 'Champagne topped up across all high-top tables.',
      section: 'evening',
      category: 'mc',
      vendorRole: 'Master of Ceremonies',
    });
  }

  // Cake Cutting & First Dance
  draft.push({
    time: formatMins(recMins + (style === 'seated' ? 195 : 135)),
    activity: 'Official Cake Cutting & Romantic First Dance',
    notes: 'Couple cuts cake for photos, then steps directly to the dance floor for first dance.',
    privateNotes: 'Dessert plating commences in kitchen immediately after cake cut.',
    section: 'evening',
    category: 'mc',
    vendorRole: 'Master of Ceremonies',
  });

  // Dance Floor Open
  draft.push({
    time: formatMins(recMins + (style === 'seated' ? 210 : 150)),
    activity: 'Dance Floor Opens & Live Band / DJ Set',
    notes: 'Bridal party joins dance floor, followed by all guests. Party vibes till late!',
    privateNotes: 'Volume levels permitted up to 98dB until 23:30.',
    section: 'evening',
    category: 'reception',
    vendorRole: 'Band / DJ',
  });

  // Grand Exit & Pack-Down
  draft.push({
    time: formatMins(recMins + (style === 'seated' ? 300 : 270)),
    activity: 'Farewell Circle / Sparkler Send-Off',
    notes: 'Final song, farewell circle around newlyweds, and exit through sparkler tunnel.',
    privateNotes: 'Luggage packed into getaway car. Sparkler lighters ready.',
    section: 'evening',
    category: 'mc',
    vendorRole: 'Master of Ceremonies',
  });

  draft.push({
    time: formatMins(recMins + (style === 'seated' ? 320 : 290)),
    activity: 'Event Conclusion & Venue Pack-Down',
    notes: 'Guests depart on shuttles. Florals and gifts secured, bump-out begins.',
    privateNotes: 'Wishing well cash box handed to nominated family member.',
    section: 'evening',
    category: 'packdown',
    vendorRole: 'Coordinator & Vendor',
  });

  return draft;
}

/**
 * Parses freeform text or imported text files into structured run sheet cues
 */
export function parseRawRunSheetText(rawText: string): Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'>[] {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'>[] = [];

  const timeRegex = /(\b\d{1,2}:\d{2}\s*(?:am|pm)?\b|\b\d{1,2}\s*(?:am|pm)\b)/i;

  for (const line of lines) {
    const match = line.match(timeRegex);
    let timeStr = '12:00';
    let content = line;

    if (match) {
      timeStr = match[0].trim();
      content = line.replace(match[0], '').replace(/^[-–—:\s]+|[-–—:\s]+$/g, '').trim();
    }

    if (!content) content = 'Activity';

    // Split activity title and extra notes if delimited by hyphen or dash or parens
    let activity = content;
    let notes = '';

    if (content.includes(' - ') || content.includes(' – ') || content.includes(' — ')) {
      const parts = content.split(/\s*[-–—]\s*/);
      activity = parts[0].trim();
      notes = parts.slice(1).join(' - ').trim();
    } else if (content.includes('(') && content.includes(')')) {
      const openIdx = content.indexOf('(');
      activity = content.slice(0, openIdx).trim();
      notes = content.slice(openIdx + 1, content.lastIndexOf(')')).trim();
    }

    // Determine category
    const actLower = activity.toLowerCase();
    let category = 'setup';
    let role = 'Coordinator & Vendor';
    if (actLower.includes('ceremony') || actLower.includes('vow') || actLower.includes('altar') || actLower.includes('procession')) {
      category = 'ceremony';
      role = 'Celebrant';
    } else if (actLower.includes('speach') || actLower.includes('speech') || actLower.includes('toast') || actLower.includes('mc') || actLower.includes('entrance') || actLower.includes('cake') || actLower.includes('first dance')) {
      category = 'mc';
      role = 'Master of Ceremonies';
    } else if (actLower.includes('photo') || actLower.includes('shoot') || actLower.includes('portrait')) {
      category = 'vendor';
      role = 'Photographer';
    } else if (actLower.includes('dinner') || actLower.includes('canapé') || actLower.includes('canape') || actLower.includes('food') || actLower.includes('drink') || actLower.includes('entrée') || actLower.includes('mains')) {
      category = 'reception';
      role = 'Catering';
    } else if (actLower.includes('pack') || actLower.includes('departure') || actLower.includes('send') || actLower.includes('bump-out')) {
      category = 'packdown';
      role = 'Coordinator & Vendor';
    }

    // Standardize time formatting
    let normalizedTime = timeStr;
    const cleanTime = timeStr.toLowerCase().replace(/\s+/g, '');
    if (cleanTime.includes('am') || cleanTime.includes('pm')) {
      const isPm = cleanTime.includes('pm');
      const numPart = cleanTime.replace(/[^\d:]/g, '');
      let [hStr, mStr] = numPart.split(':');
      let h = parseInt(hStr, 10);
      let m = mStr ? parseInt(mStr, 10) : 0;
      if (isPm && h < 12) h += 12;
      if (!isPm && h === 12) h = 0;
      normalizedTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    const hour = parseInt(normalizedTime.split(':')[0], 10) || 12;
    const section: 'morning' | 'afternoon' | 'evening' = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

    items.push({
      time: normalizedTime,
      activity: activity.slice(0, 100),
      notes,
      privateNotes: '',
      section,
      category,
      vendorRole: role,
    });
  }

  return items;
}
