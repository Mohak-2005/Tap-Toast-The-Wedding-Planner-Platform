import fs from 'fs';

const filePath = 'src/components/RegisterView.tsx';
let c = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Update state declarations for Couple
const oldCoupleStates = `  // Couple fields
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [weddingDate, setWeddingDate] = useState('2026-11-14');
  const [venue, setVenue] = useState('');
  const [coupleEmail, setCoupleEmail] = useState('');
  const [couplePassword, setCouplePassword] = useState('');
  const [coupleConfirmPassword, setCoupleConfirmPassword] = useState('');

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);`;

const newCoupleStates = `  // Couple fields
  const [groomName, setGroomName] = useState('');
  const [groomEmail, setGroomEmail] = useState('');
  const [groomMobile, setGroomMobile] = useState('');
  const [brideName, setBrideName] = useState('');
  const [brideEmail, setBrideEmail] = useState('');
  const [brideMobile, setBrideMobile] = useState('');

  // Additional Wedding Details (added per client request)
  const [weddingDate, setWeddingDate] = useState('2026-11-14');
  const [venue, setVenue] = useState('Fernwood Estate, Hunter Valley');
  const [guestCount, setGuestCount] = useState<number>(110);
  const [weddingStyle, setWeddingStyle] = useState('Modern Luxury & Black Tie');
  const [preferredMc, setPreferredMc] = useState('Robert Galati (Galati MC Services)');

  const [couplePassword, setCouplePassword] = useState('');
  const [coupleConfirmPassword, setCoupleConfirmPassword] = useState('');
  const [coupleShowPwd, setCoupleShowPwd] = useState(false);
  const [coupleShowConfirm, setCoupleShowConfirm] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Couple Password strength logic
  const coupleHasMinLength = couplePassword.length >= 8;
  const coupleHasUpper = /[A-Z]/.test(couplePassword);
  const coupleHasLower = /[a-z]/.test(couplePassword);
  const coupleHasNum = /[0-9]/.test(couplePassword);
  const coupleStrengthScore = [coupleHasMinLength, coupleHasUpper, coupleHasLower, coupleHasNum].filter(Boolean).length;

  const coupleStrengthColor =
    coupleStrengthScore <= 1 ? '#d9534f' : coupleStrengthScore <= 3 ? '#e0a96d' : '#5ea866';
  const coupleStrengthLabel =
    coupleStrengthScore === 0
      ? 'Password strength'
      : coupleStrengthScore <= 1
      ? 'Weak'
      : coupleStrengthScore <= 3
      ? 'Medium'
      : 'Strong';

  const couplePasswordsMatch = couplePassword && coupleConfirmPassword && couplePassword === coupleConfirmPassword;`;

c = c.replace(oldCoupleStates, newCoupleStates);

// 2. Update handleRegisterCouple
const oldHandleCouple = `  const handleRegisterCouple = (e: React.FormEvent) => {
    e.preventDefault();
    if (couplePassword !== coupleConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const coupleName = \`\${partner1} & \${partner2}\`;
      const newWeddingId = 'wedding_' + Date.now();
      const newUser = {
        id: 'user_' + Date.now(),
        email: coupleEmail,
        role: 'couple' as const,
        name: coupleName,
        tenantId: 'tenant_galati',
        weddingId: newWeddingId,
      };

      const newWedding = {
        id: newWeddingId,
        tenantId: 'tenant_galati',
        couple: coupleName,
        partner1,
        partner2,
        date: weddingDate,
        venue: venue || 'Southern Highlands Estate',
        region: 'NSW',
        daysRemaining: 30,
        invited: 100,
        confirmed: 0,
        declined: 0,
        awaiting: 100,
        tablesSeated: 0,
        totalTables: 12,
        giftsTotal: 0,
        status: 'Planning',
        tasks: [
          { id: 't1', text: 'Confirm floral arrangements', completed: false, due: 'This week' },
          { id: 't2', text: 'Review run sheet with MC Robert', completed: false, due: 'This week' },
        ],
      };

      setState({
        ...state,
        users: [...state.users, newUser],
        weddings: [...state.weddings, newWedding],
      });

      setStoredSession({
        role: 'couple',
        email: coupleEmail,
        name: coupleName,
        tenantId: 'tenant_galati',
        weddingId: newWeddingId,
        keepSignedIn: true,
        at: Date.now(),
      });

      showToast(\`Welcome, \${coupleName}! Your wedding portal is ready.\`, 'success');
      if (onSelectView) onSelectView('couple');
    }, 500);
  };`;

const newHandleCouple = `  const handleRegisterCouple = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couplePasswordsMatch) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to the Terms of Service', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bName = brideName.trim() || 'Sophie';
      const gName = groomName.trim() || 'James';
      const coupleName = \`\${bName} & \${gName}\`;
      const primaryEmail = brideEmail.trim() || groomEmail.trim() || 'couple@example.com';
      const newWeddingId = 'wedding_' + Date.now();

      const newUser = {
        id: 'user_' + Date.now(),
        email: primaryEmail,
        role: 'couple' as const,
        name: coupleName,
        tenantId: 'tenant_galati',
        weddingId: newWeddingId,
      };

      const daysCalc = Math.max(1, Math.ceil((new Date(weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

      const newWedding = {
        id: newWeddingId,
        tenantId: 'tenant_galati',
        couple: coupleName,
        partner1: bName,
        partner2: gName,
        date: weddingDate,
        dateDisplay: new Date(weddingDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        venue: venue || 'Fernwood Estate, Hunter Valley',
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
        tasks: [
          { id: 't1', text: 'Confirm floral arrangements & ceremony arch', completed: false, due: 'This week' },
          { id: 't2', text: \`Review run sheet with \${preferredMc.split(' ')[0] || 'MC Robert'}\`, completed: false, due: 'This week' },
          { id: 't3', text: 'Finalize dietary requirements for venue catering', completed: false, due: 'Next week' },
          { id: 't4', text: 'Share digital QaRd invitation with wedding party', completed: true, due: 'Done' },
        ],
      };

      setState({
        ...state,
        users: [...state.users, newUser],
        weddings: [...state.weddings, newWedding],
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

      showToast(\`Welcome, \${coupleName}! Your wedding portal is ready.\`, 'success');
      if (onSelectView) onSelectView('couple');
    }, 500);
  };`;

c = c.replace(oldHandleCouple, newHandleCouple);

// 3. Make Right Form Container wider for Couple
c = c.replace(
  `        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-lg w-full max-w-[480px] p-9 shadow-md relative my-6">`,
  `        <div className={\`bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-lg w-full \${accountType === 'couple' ? 'max-w-[580px]' : 'max-w-[480px]'} p-8 md:p-9 shadow-md relative my-6 transition-all duration-200\`}>`
);

// 4. Replace the old Couple form JSX
const coupleFormStartMarker = `          ) : (\n            /* COUPLE REGISTRATION FORM */`;
const coupleFormEndMarker = `          )}\n\n          <div className="mt-6 text-center text-xs text-[#8b7b6b]">`;

const coupleFormStartIdx = c.indexOf(coupleFormStartMarker);
const coupleFormEndIdx = c.indexOf(coupleFormEndMarker);

console.log('coupleFormStartIdx:', coupleFormStartIdx, 'coupleFormEndIdx:', coupleFormEndIdx);

const newCoupleFormJSX = `          ) : (
            /* COUPLE REGISTRATION FORM - ENHANCED WITH GROOM, BRIDE & WEDDING DETAILS */
            <form onSubmit={handleRegisterCouple} className="space-y-5">
              {/* SECTION 1: GROOM DETAILS */}
              <div className="bg-[#faf8f5] p-4 rounded-lg border border-[#e8ded0] space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#ebdcc9]">
                  <span className="text-[#bd9661] text-xs font-bold uppercase tracking-wider">🤵 GROOM DETAILS</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    GROOM FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="James Wilson"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      GROOM EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="james.wilson@example.com"
                      value={groomEmail}
                      onChange={(e) => setGroomEmail(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      GROOM CONTACT NO. (AU) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0412 345 678"
                      value={groomMobile}
                      onChange={(e) => setGroomMobile(formatAuMobile(e.target.value))}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: BRIDE DETAILS */}
              <div className="bg-[#faf8f5] p-4 rounded-lg border border-[#e8ded0] space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#ebdcc9]">
                  <span className="text-[#bd9661] text-xs font-bold uppercase tracking-wider">👰 BRIDE DETAILS</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    BRIDE FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sophie Carter"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      BRIDE EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sophie.carter@example.com"
                      value={brideEmail}
                      onChange={(e) => setBrideEmail(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      BRIDE CONTACT NO. (AU) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0423 456 789"
                      value={brideMobile}
                      onChange={(e) => setBrideMobile(formatAuMobile(e.target.value))}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: WEDDING & EVENT DETAILS (Added according to your will) */}
              <div className="bg-[#faf8f5] p-4 rounded-lg border border-[#e8ded0] space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#ebdcc9]">
                  <span className="text-[#bd9661] text-xs font-bold uppercase tracking-wider">💒 WEDDING &amp; VENUE DETAILS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      WEDDING DATE *
                    </label>
                    <input
                      type="date"
                      required
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      ESTIMATED GUEST COUNT
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={800}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    CEREMONY &amp; RECEPTION VENUE
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fernwood Estate, Hunter Valley"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      CELEBRATION STYLE / THEME
                    </label>
                    <select
                      value={weddingStyle}
                      onChange={(e) => setWeddingStyle(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-xs text-[#15110e] outline-none cursor-pointer"
                    >
                      <option value="Modern Luxury & Black Tie">Modern Luxury & Black Tie</option>
                      <option value="Classic Ballroom Romance">Classic Ballroom Romance</option>
                      <option value="Rustic Vineyard & Estate">Rustic Vineyard & Estate</option>
                      <option value="Bespoke Bohemian Garden">Bespoke Bohemian Garden</option>
                      <option value="Coastal Waterfront Elegance">Coastal Waterfront Elegance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      PREFERRED MC / HOST
                    </label>
                    <select
                      value={preferredMc}
                      onChange={(e) => setPreferredMc(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-xs text-[#15110e] outline-none cursor-pointer"
                    >
                      <option value="Robert Galati (Galati MC Services)">Robert Galati (Galati MC Services)</option>
                      <option value="Sarah Jenkins (Associate Host)">Sarah Jenkins (Associate Host)</option>
                      <option value="Dave Miller (Audio & AV Lead)">Dave Miller (Audio & AV Lead)</option>
                      <option value="I will select an MC later">I will select an MC later</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: ACCOUNT SECURITY (Matching Image 2 password UI) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={coupleShowPwd ? 'text' : 'password'}
                      required
                      placeholder="Create a password"
                      value={couplePassword}
                      onChange={(e) => setCouplePassword(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 pr-14 text-sm text-[#15110e] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setCoupleShowPwd(!coupleShowPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#bd9661] font-semibold hover:underline cursor-pointer"
                    >
                      {coupleShowPwd ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  <div className="w-full bg-[#e8ded0] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: \`\${(coupleStrengthScore / 4) * 100}%\`,
                        backgroundColor: coupleStrengthColor,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#8b7b6b] mt-1">
                    <span>{coupleStrengthLabel}</span>
                  </div>

                  {/* Rules checklist */}
                  <ul className="mt-2 space-y-0.5 text-[11.5px] text-[#8b7b6b]">
                    <li className={\`flex items-center gap-1.5 \${coupleHasMinLength ? 'text-emerald-700 font-semibold' : ''}\`}>
                      <span>•</span> 8+ characters
                    </li>
                    <li className={\`flex items-center gap-1.5 \${coupleHasUpper ? 'text-emerald-700 font-semibold' : ''}\`}>
                      <span>•</span> Uppercase letter
                    </li>
                    <li className={\`flex items-center gap-1.5 \${coupleHasLower ? 'text-emerald-700 font-semibold' : ''}\`}>
                      <span>•</span> Lowercase letter
                    </li>
                    <li className={\`flex items-center gap-1.5 \${coupleHasNum ? 'text-emerald-700 font-semibold' : ''}\`}>
                      <span>•</span> Number
                    </li>
                  </ul>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={coupleShowConfirm ? 'text' : 'password'}
                      required
                      placeholder="Confirm password"
                      value={coupleConfirmPassword}
                      onChange={(e) => setCoupleConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 pr-14 text-sm text-[#15110e] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setCoupleShowConfirm(!coupleShowConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#bd9661] font-semibold hover:underline cursor-pointer"
                    >
                      {coupleShowConfirm ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {coupleConfirmPassword && (
                    <div className={\`text-[11px] mt-1 font-semibold \${couplePasswordsMatch ? 'text-emerald-600' : 'text-red-500'}\`}>
                      {couplePasswordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 5: TERMS & SUBMIT */}
              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-[#8b7b6b] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#bd9661]"
                  />
                  <span>
                    I agree to the <a href="#terms" className="text-[#bd9661] underline">Terms of Service</a> and <a href="#privacy" className="text-[#bd9661] underline">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-[4px] text-sm font-bold tracking-wide transition-all cursor-pointer mt-4 shadow-md"
              >
                {isSubmitting ? 'Creating couple portal...' : 'Create Couple Wedding Portal \u2192'}
              </button>
            </form>
`;

if (coupleFormStartIdx !== -1 && coupleFormEndIdx !== -1) {
  c = c.substring(0, coupleFormStartIdx) + newCoupleFormJSX + c.substring(coupleFormEndIdx);
  fs.writeFileSync(filePath, c, 'utf8');
  console.log('✓ Updated RegisterView.tsx with full Couple form');
} else {
  console.error('Could not locate coupleForm markers in RegisterView.tsx');
}
