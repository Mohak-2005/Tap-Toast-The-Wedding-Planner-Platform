const fs = require('fs');

const file = 'src/components/PlannerView.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update state declarations
const oldStateBlock = `  // Settings State
  const [allowCoupleSeatingEdit, setAllowCoupleSeatingEdit] = useState<boolean>(true);
  const [runsheetSyncVendors, setRunsheetSyncVendors] = useState<boolean>(true);
  const [autoSmsReminders, setAutoSmsReminders] = useState<boolean>(false);
  const [plannerNotes, setPlannerNotes] = useState<string>(
    'Coordinate with Bowral Florist for 1:30 PM arch setup. Head Table floral garland must not obstruct bride/groom sightlines.'
  );`;

const newStateBlock = `  // Planner Profile & Settings (Matching MC Settings)
  const [plannerName, setPlannerName] = useState<string>('Anthony Rossi');
  const [plannerBiz, setPlannerBiz] = useState<string>('Rossi Event Management');
  const [plannerEmail, setPlannerEmail] = useState<string>('anthony@rossievents.demo');
  const [plannerPhone, setPlannerPhone] = useState<string>('0421 884 991');
  const [plannerRole, setPlannerRole] = useState<string>('Lead Wedding Coordinator & Event Director');
  const [plannerEmergencyPhone, setPlannerEmergencyPhone] = useState<string>('0419 772 311');
  const [plannerAgencyTagline, setPlannerAgencyTagline] = useState<string>('Luxury Estate & Destination Wedding Architecture');
  const [plannerBio, setPlannerBio] = useState<string>(
    'Over 12 years of luxury wedding coordination experience across Southern Highlands, Sydney, and Hunter Valley. Dedicated to meticulous day-of runsheet execution, vendor synergy, and bride & groom peace of mind.'
  );
  const [plannerNotes, setPlannerNotes] = useState<string>(
    'Coordinate with Bowral Florist for 1:30 PM arch setup. Head Table floral garland must not obstruct bride/groom sightlines.'
  );`;

// 2. Update Sidebar tab label: "Settings & Controls" -> "Settings"
const oldSettingsTab = `    {
      id: 'settings',
      label: 'Settings & Controls',`;

const newSettingsTab = `    {
      id: 'settings',
      label: 'Settings',`;

// 3. Update sidebar footer to use plannerName and plannerBiz
const oldSidebarFooter = `<div className="text-[10px] uppercase tracking-wider text-[#8c7b6c] mb-1 font-bold">
            Lead Coordinator
          </div>
          <div className="font-semibold text-[#dfc194]">Anthony Rossi</div>
          <div className="text-[11px] text-[#8c7b6c] mb-3 truncate">Rossi Event Management</div>`;

const newSidebarFooter = `<div className="text-[10px] uppercase tracking-wider text-[#8c7b6c] mb-1 font-bold">
            Lead Coordinator
          </div>
          <div className="font-semibold text-[#dfc194]">{plannerName}</div>
          <div className="text-[11px] text-[#8c7b6c] mb-3 truncate">{plannerBiz}</div>`;

// 4. Remove client dropdown on Overview
const oldClientDropdownBlock = `<div className="flex items-center gap-3 flex-wrap">
                  {/* Assigned Wedding Switcher Dropdown */}
                  <div className="bg-[#faf8f5] border border-[#ebdcc9] rounded-xl px-3.5 py-2 flex items-center gap-2.5 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                      Client:
                    </span>
                    <select
                      value={selectedWeddingId}
                      onChange={(e) => setSelectedWeddingId(e.target.value)}
                      className="bg-transparent text-[#15110e] font-serif font-bold text-xs sm:text-sm outline-none cursor-pointer border-none pr-1"
                    >
                      {state.weddings.map((w) => (
                        <option key={w.id} value={w.id} className="bg-white text-[#15110e]">
                          {w.couple} &mdash; {w.venue.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{activeWedding.status || 'On Track'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleExportBrief}
                    className="bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>📄</span>
                    <span>Export Dossier</span>
                  </button>
                </div>`;

const newClientDropdownBlock = `<div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{activeWedding.status || 'Finalising'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleExportBrief}
                    className="bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>📄</span>
                    <span>Export Dossier</span>
                  </button>
                </div>`;

// 5. Replace Settings tab content
const oldSettingsSection = `          {/* ------------------------------------------------------------ */}
          {/* TAB 6: SETTINGS & CONTROLS                                  */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  GOVERNANCE &amp; PROTOCOLS
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Settings &amp; Controls
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Manage client collaboration access, runsheet synchronization, and emergency protocols.
                </p>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
                {/* Permission Toggle 1 */}
                <div className="flex items-center justify-between p-4 bg-[#faf8f5] border border-[#ebdcc9] rounded-xl">
                  <div>
                    <div className="font-bold text-sm text-[#15110e]">
                      Allow Couple to Edit Seating Plan
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-0.5">
                      When enabled, Sophie &amp; James can move guests directly on their dashboard.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAllowCoupleSeatingEdit(!allowCoupleSeatingEdit);
                      showToast(
                        !allowCoupleSeatingEdit ? 'Couple seating edit unlocked' : 'Couple seating edit locked to Planner only',
                        'info'
                      );
                    }}
                    className={\`w-12 h-6 rounded-full transition-colors relative cursor-pointer \${
                      allowCoupleSeatingEdit ? 'bg-[#bd9661]' : 'bg-[#d5c7b5]'
                    }\`}
                  >
                    <span
                      className={\`block w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 \${
                        allowCoupleSeatingEdit ? 'translate-x-7' : 'translate-x-1'
                      }\`}
                    />
                  </button>
                </div>

                {/* Permission Toggle 2 */}
                <div className="flex items-center justify-between p-4 bg-[#faf8f5] border border-[#ebdcc9] rounded-xl">
                  <div>
                    <div className="font-bold text-sm text-[#15110e]">
                      Live Runsheet Broadcast to MC &amp; Vendors
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-0.5">
                      Pushes real-time schedule modifications directly to Robert Galati and catering team.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRunsheetSyncVendors(!runsheetSyncVendors);
                      showToast('Vendor runsheet broadcast setting updated', 'info');
                    }}
                    className={\`w-12 h-6 rounded-full transition-colors relative cursor-pointer \${
                      runsheetSyncVendors ? 'bg-[#bd9661]' : 'bg-[#d5c7b5]'
                    }\`}
                  >
                    <span
                      className={\`block w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 \${
                        runsheetSyncVendors ? 'translate-x-7' : 'translate-x-1'
                      }\`}
                    />
                  </button>
                </div>

                {/* Permission Toggle 3 */}
                <div className="flex items-center justify-between p-4 bg-[#faf8f5] border border-[#ebdcc9] rounded-xl">
                  <div>
                    <div className="font-bold text-sm text-[#15110e]">
                      Automated SMS Reminders to Awaiting Guests
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-0.5">
                      Triggers polite reminders at 14 days and 7 days prior to RSVP cut-off.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSmsReminders(!autoSmsReminders);
                      showToast('Automated SMS reminders toggled', 'info');
                    }}
                    className={\`w-12 h-6 rounded-full transition-colors relative cursor-pointer \${
                      autoSmsReminders ? 'bg-[#bd9661]' : 'bg-[#d5c7b5]'
                    }\`}
                  >
                    <span
                      className={\`block w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 \${
                        autoSmsReminders ? 'translate-x-7' : 'translate-x-1'
                      }\`}
                    />
                  </button>
                </div>

                {/* Planner Internal Notes */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b7b6b]">
                    Coordinator Private Dossier &amp; Briefing Notes
                  </label>
                  <textarea
                    rows={4}
                    value={plannerNotes}
                    onChange={(e) => setPlannerNotes(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ebdcc9] rounded-xl p-3.5 text-xs outline-none focus:border-[#bd9661] text-[#15110e] leading-relaxed shadow-2xs"
                    placeholder="Enter private coordinator notes, load-in specifications, or vendor reminders..."
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => showToast('Planner configuration saved successfully', 'success')}
                    className="px-6 py-2.5 bg-[#15110e] text-[#dfc194] hover:text-white rounded-xl font-bold text-xs border border-[#bd9661] shadow-md cursor-pointer transition-colors"
                  >
                    Save Settings &amp; Protocols
                  </button>
                </div>
              </div>
            </div>
          )}`;

const newSettingsSection = `          {/* ------------------------------------------------------------ */}
          {/* TAB 6: PLANNER SETTINGS & PROFILE                            */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  PLANNER PROFILE &amp; INFORMATION
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Coordinator Settings &amp; Profile
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Maintain your professional coordinator credentials, agency contact details, and private day-of briefing dossier.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Planner profile and settings updated successfully', 'success');
                }}
                className="space-y-6"
              >
                {/* Card 1: Professional Identity & Agency Details */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">📋</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">
                      Coordinator Identity &amp; Agency Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Planner Full Name *
                      </label>
                      <input
                        type="text"
                        value={plannerName}
                        onChange={(e) => setPlannerName(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-medium shadow-2xs"
                        placeholder="e.g. Anthony Rossi"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Agency / Business Name *
                      </label>
                      <input
                        type="text"
                        value={plannerBiz}
                        onChange={(e) => setPlannerBiz(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-medium shadow-2xs"
                        placeholder="e.g. Rossi Event Management"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Professional Title / Role
                      </label>
                      <input
                        type="text"
                        value={plannerRole}
                        onChange={(e) => setPlannerRole(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-medium shadow-2xs"
                        placeholder="e.g. Lead Wedding Coordinator &amp; Event Director"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Specialty / Focus
                      </label>
                      <input
                        type="text"
                        value={plannerAgencyTagline}
                        onChange={(e) => setPlannerAgencyTagline(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-medium shadow-2xs"
                        placeholder="e.g. Luxury Estate &amp; Destination Weddings"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 2: Direct Contact Credentials */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">📞</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">
                      Direct Contact &amp; Emergency Reachability
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Direct Phone *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold font-mono text-[#6b5847] rounded-l-xl select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          value={plannerPhone}
                          onChange={(e) => setPlannerPhone(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-r-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-mono shadow-2xs"
                          placeholder="421 884 991"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Professional Email *
                      </label>
                      <input
                        type="email"
                        value={plannerEmail}
                        onChange={(e) => setPlannerEmail(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] shadow-2xs"
                        placeholder="anthony@rossievents.demo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Day-Of Emergency Hotline
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold font-mono text-[#6b5847] rounded-l-xl select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          value={plannerEmergencyPhone}
                          onChange={(e) => setPlannerEmergencyPhone(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-r-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-mono shadow-2xs"
                          placeholder="419 772 311"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Bio & Background */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">📝</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">
                      Coordinator Bio &amp; Experience Overview
                    </h3>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                      Professional Background
                    </label>
                    <textarea
                      rows={3}
                      value={plannerBio}
                      onChange={(e) => setPlannerBio(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-3.5 text-xs outline-none focus:border-[#bd9661] text-[#15110e] leading-relaxed shadow-2xs"
                      placeholder="Describe your coordination experience, past venues, and hosting philosophy..."
                    />
                  </div>
                </div>

                {/* Card 4: Coordinator Private Notes */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">🔒</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">
                      Coordinator Private Dossier &amp; Briefing Notes
                    </h3>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                      Private Day-Of Operational Notes
                    </label>
                    <textarea
                      rows={4}
                      value={plannerNotes}
                      onChange={(e) => setPlannerNotes(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-3.5 text-xs outline-none focus:border-[#bd9661] text-[#15110e] leading-relaxed shadow-2xs"
                      placeholder="Enter private coordinator notes, load-in specifications, or vendor reminders..."
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#15110e] text-[#dfc194] hover:text-white rounded-xl font-bold text-xs border border-[#bd9661] shadow-md cursor-pointer transition-colors"
                  >
                    Save Planner Profile &amp; Settings
                  </button>
                </div>
              </form>
            </div>
          )}`;

// Normalize for replacement
function norm(str) {
  return str.replace(/\r\n/g, '\n');
}

const isCrlf = content.includes('\r\n');
let c = norm(content);

if (c.includes(norm(oldStateBlock))) {
  c = c.replace(norm(oldStateBlock), norm(newStateBlock));
  console.log('1. Replaced state block');
} else {
  console.log('Failed to match state block');
}

if (c.includes(norm(oldSettingsTab))) {
  c = c.replace(norm(oldSettingsTab), norm(newSettingsTab));
  console.log('2. Replaced settings tab label');
} else {
  console.log('Failed to match settings tab');
}

if (c.includes(norm(oldSidebarFooter))) {
  c = c.replace(norm(oldSidebarFooter), norm(newSidebarFooter));
  console.log('3. Replaced sidebar footer');
} else {
  console.log('Failed to match sidebar footer');
}

if (c.includes(norm(oldClientDropdownBlock))) {
  c = c.replace(norm(oldClientDropdownBlock), norm(newClientDropdownBlock));
  console.log('4. Removed client dropdown block on Overview');
} else {
  console.log('Failed to match client dropdown block');
}

if (c.includes(norm(oldSettingsSection))) {
  c = c.replace(norm(oldSettingsSection), norm(newSettingsSection));
  console.log('5. Replaced Settings section');
} else {
  console.log('Failed to match Settings section');
}

fs.writeFileSync(file, isCrlf ? c.replace(/\n/g, '\r\n') : c, 'utf8');
console.log('Finished updating PlannerView.tsx');
