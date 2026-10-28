import fs from 'fs';

const filePath = 'src/components/McView.tsx';
let c = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// Verify TeamMember and JoeyChatbot import
if (!c.includes('TeamMember')) {
  c = c.replace(
    `import { PrivateRunSheetItem, Client, Invoice, Wedding, Guest } from '../lib/types';`,
    `import { PrivateRunSheetItem, Client, Invoice, Wedding, Guest, TeamMember } from '../lib/types';\nimport JoeyChatbot from './JoeyChatbot';`
  );
}

// Check if old team section exists
const oldTeamHeader = `<div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">\n                  STAFF &amp; CREW\n                </div>`;
console.log('Old team section header found:', c.includes(oldTeamHeader));

const newTeamSection = `        {/* ==================================================================== */}
        {/* TAB 5: TEAM & CREW ACCESS MANAGEMENT                                 */}
        {/* ==================================================================== */}
        {activeTab === 'team' && !selectedWeddingId && (
          <section className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4 pb-3 border-b border-[#e8ded0]">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  STAFF &amp; COLLABORATORS
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  MC Team &amp; Crew
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1 max-w-2xl">
                  Manage agency team members, assign specific weddings, and customize granular stage &amp; console access permissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInvName('');
                  setInvEmail('');
                  setInvPhone('');
                  setInvRole('Associate MC & Host');
                  setInvAccessLevel('Host & Run Sheet');
                  setInvWeddingScope('all');
                  setInvSelectedWeddings(state.weddings.map(w => w.id));
                  setInvCanRunsheet(true);
                  setInvCanSeating(false);
                  setInvCanDietary(true);
                  setInvCanMessaging(true);
                  setShowInviteMemberModal(true);
                }}
                className="btn btn-gold btn-sm px-4 py-2 font-bold flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>+ Invite Member</span>
              </button>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(state.team || []).map(m => {
                const accessBadgeStyle = {
                  'Full Access': 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
                  'Host & Run Sheet': 'bg-sky-50 text-sky-800 border-sky-200 font-semibold',
                  'Seating & Guests': 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
                  'Audio & AV Lead': 'bg-purple-50 text-purple-800 border-purple-200 font-semibold',
                }[m.accessLevel || 'Host & Run Sheet'] || 'bg-stone-100 text-stone-700 border-stone-200';

                const assignedNames = (m.assignedWeddings && !m.assignedWeddings.includes('all'))
                  ? state.weddings.filter(w => m.assignedWeddings?.includes(w.id)).map(w => w.coupleNames).join(', ')
                  : 'All Assigned Weddings';

                return (
                  <div
                    key={m.id}
                    className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#15110e]">{m.name}</h3>
                        <div className="text-xs text-[#bd9661] font-bold mt-0.5">{m.role}</div>
                      </div>
                      <span className="tt-pill green text-[10px]">{m.status || 'Active'}</span>
                    </div>

                    {/* Access Tier Tag */}
                    <div className="pt-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#8b7b6b] mb-1">
                        Access Level
                      </div>
                      <span className={\`inline-block px-2.5 py-1 rounded-md text-[11px] border \${accessBadgeStyle}\`}>
                        {m.accessLevel || 'Host & Run Sheet'}
                      </span>
                    </div>

                    {/* Assigned Scope */}
                    <div className="text-xs text-[#544332] bg-[#faf8f5] p-2.5 rounded-xl border border-[#f0ede4] space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#8b7b6b]">
                        Wedding Scope
                      </div>
                      <div className="truncate text-xs font-medium text-[#15110e]">
                        {assignedNames}
                      </div>
                    </div>

                    {/* Granular Permission Tags */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#8b7b6b]">
                        Active Permissions
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {m.permissions?.canEditRunsheet && (
                          <span className="px-2 py-0.5 bg-[#f4ece1] text-[#785b34] rounded text-[10px] font-medium">
                            Run Sheet
                          </span>
                        )}
                        {m.permissions?.canEditSeating && (
                          <span className="px-2 py-0.5 bg-[#f4ece1] text-[#785b34] rounded text-[10px] font-medium">
                            Seating Canvas
                          </span>
                        )}
                        {m.permissions?.canViewDietary && (
                          <span className="px-2 py-0.5 bg-[#f4ece1] text-[#785b34] rounded text-[10px] font-medium">
                            Dietary Alerts
                          </span>
                        )}
                        {m.permissions?.canMessageClients && (
                          <span className="px-2 py-0.5 bg-[#f4ece1] text-[#785b34] rounded text-[10px] font-medium">
                            Client Messaging
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1 text-xs text-[#8b7b6b] pt-2 border-t border-[#f0ede4]">
                      <div className="flex items-center gap-1.5">
                        <span>✉</span>
                        <span className="truncate">{m.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>📞</span>
                        <span>{m.phone}</span>
                      </div>
                    </div>

                    {/* Manage Access Action Button */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#f0ede4]">
                      <button
                        type="button"
                        onClick={() => setSelectedMemberForAccess(m)}
                        className="px-3 py-1.5 text-xs font-bold bg-[#faf5ed] hover:bg-[#bd9661] text-[#855c26] hover:text-white rounded-lg border border-[#e0cbb2] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Manage Access</span>
                        <span>⚙</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.id)}
                        className="text-xs text-[#8b7b6b] hover:text-red-700 font-semibold cursor-pointer p-1"
                        title="Remove member from agency"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}`;

// Find start and end of activeTab === 'team'
const teamStartIdx = c.indexOf("{activeTab === 'team' && !selectedWeddingId && (");
const teamEndMarker = `        {/* TAB 6: SETTINGS (Screenshot 39)`;
const teamEndIdx = c.indexOf(teamEndMarker, teamStartIdx);

if (teamStartIdx !== -1 && teamEndIdx !== -1) {
  // Find opening of section
  const sectionStart = c.lastIndexOf('{/* ==================================================================== */}', teamStartIdx);
  c = c.substring(0, sectionStart) + newTeamSection + '\n\n        ' + c.substring(teamEndIdx);
  console.log('Replaced team section successfully!');
} else {
  console.error('Could not locate team section indices:', { teamStartIdx, teamEndIdx });
}

// Now check Modals and Joey chatbot insertion
const clientMarker = `{selectedClient && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex justify-end"
          onClick={() => setSelectedClient(null)}
        >`;

const modalsCode = `      {/* ==================================================================== */}
      {/* MODAL: INVITE TEAM MEMBER & CONFIGURE ACCESS                        */}
      {/* ==================================================================== */}
      {showInviteMemberModal && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInviteMemberModal(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#e8ded0] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#15110e] text-white flex justify-between items-center border-b border-[#29211a]">
              <div>
                <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                  STAFF ONBOARDING
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Invite Team Member
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteMemberModal(false)}
                className="text-white/70 hover:text-[#bd9661] text-xl font-bold cursor-pointer transition-colors p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jessica Alva"
                    value={invName}
                    onChange={(e) => setInvName(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Role / Stage Title *
                  </label>
                  <select
                    value={invRole}
                    onChange={(e) => setInvRole(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white cursor-pointer"
                  >
                    <option value="Associate MC & Host">Associate MC & Host</option>
                    <option value="Day-of Wedding Coordinator">Day-of Wedding Coordinator</option>
                    <option value="Sound Engineer & AV Lead">Sound Engineer & AV Lead</option>
                    <option value="Stage Assistant & Floor Director">Stage Assistant & Floor Director</option>
                    <option value="Lighting & Effects Specialist">Lighting & Effects Specialist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jessica@galati.demo"
                    value={invEmail}
                    onChange={(e) => setInvEmail(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0422 990 112"
                    value={invPhone}
                    onChange={(e) => setInvPhone(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>
              </div>

              {/* Access Level Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Team Member Access Level *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'Full Access',
                      title: '👑 Full Access',
                      desc: 'Full console access: Run sheet, seating canvas, catering, messaging.',
                    },
                    {
                      id: 'Host & Run Sheet',
                      title: '🎤 Host & Run Sheet',
                      desc: 'Interactive cues, private runsheet notes, timeline checkoffs.',
                    },
                    {
                      id: 'Seating & Guests',
                      title: '🪑 Seating & Guests',
                      desc: 'Drag & drop seating canvas, RSVP checks, dietary summaries.',
                    },
                    {
                      id: 'Audio & AV Lead',
                      title: '🎧 Audio & AV Lead',
                      desc: 'Stage music timeline, mic cues, sound technical notes.',
                    },
                  ].map((level) => (
                    <div
                      key={level.id}
                      onClick={() => setInvAccessLevel(level.id as any)}
                      className={\`p-3 rounded-xl border cursor-pointer transition-all \${
                        invAccessLevel === level.id
                          ? 'border-[#bd9661] bg-[#faf5ed] text-[#15110e] shadow-2xs'
                          : 'border-[#e8ded0] bg-white hover:bg-[#faf8f5] text-[#544332]'
                      }\`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{level.title}</span>
                        {invAccessLevel === level.id && <span className="text-[#bd9661]">✓</span>}
                      </div>
                      <p className="text-[10.5px] text-[#8b7b6b] mt-1 leading-normal">{level.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Weddings Scope */}
              <div className="space-y-1.5 pt-1 border-t border-[#f0ede4]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Assigned Wedding Scope
                </label>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#15110e]">
                    <input
                      type="radio"
                      name="invScope"
                      checked={invWeddingScope === 'all'}
                      onChange={() => setInvWeddingScope('all')}
                      className="accent-[#bd9661]"
                    />
                    <span>All Agency Weddings</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#15110e]">
                    <input
                      type="radio"
                      name="invScope"
                      checked={invWeddingScope === 'custom'}
                      onChange={() => setInvWeddingScope('custom')}
                      className="accent-[#bd9661]"
                    />
                    <span>Specific Weddings Only</span>
                  </label>
                </div>

                {invWeddingScope === 'custom' && (
                  <div className="p-2.5 bg-[#faf8f5] rounded-xl border border-[#e8ded0] space-y-1.5 mt-2">
                    <span className="text-[10px] uppercase font-bold text-[#8b7b6b]">Select Weddings:</span>
                    <div className="space-y-1">
                      {state.weddings.map((w) => (
                        <label key={w.id} className="flex items-center gap-2 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={invSelectedWeddings.includes(w.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setInvSelectedWeddings([...invSelectedWeddings, w.id]);
                              } else {
                                setInvSelectedWeddings(invSelectedWeddings.filter(id => id !== w.id));
                              }
                            }}
                            className="accent-[#bd9661]"
                          />
                          <span className="font-medium text-[#15110e]">{w.coupleNames}</span>
                          <span className="text-[10px] text-[#8b7b6b]">({w.date})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Granular Feature Permissions */}
              <div className="space-y-1.5 pt-1 border-t border-[#f0ede4]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Feature Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invCanRunsheet}
                      onChange={(e) => setInvCanRunsheet(e.target.checked)}
                      className="accent-[#bd9661]"
                    />
                    <span>Edit Live Run Sheet</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invCanSeating}
                      onChange={(e) => setInvCanSeating(e.target.checked)}
                      className="accent-[#bd9661]"
                    />
                    <span>Modify Seating Canvas</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invCanDietary}
                      onChange={(e) => setInvCanDietary(e.target.checked)}
                      className="accent-[#bd9661]"
                    />
                    <span>View Dietary Alerts</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invCanMessaging}
                      onChange={(e) => setInvCanMessaging(e.target.checked)}
                      className="accent-[#bd9661]"
                    />
                    <span>Chat with Couples via Joey</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#e8ded0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteMemberModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e8ded0] text-[#8b7b6b] hover:bg-[#faf8f5] font-bold cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm px-5 py-2 font-bold shadow-2xs"
                >
                  Send Invitation &amp; Set Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: MANAGE EXISTING TEAM MEMBER ACCESS                           */}
      {/* ==================================================================== */}
      {selectedMemberForAccess && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMemberForAccess(null);
          }}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#e8ded0] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#15110e] text-white flex justify-between items-center border-b border-[#29211a]">
              <div>
                <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                  PERMISSIONS &amp; SCOPE
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Manage Access: {selectedMemberForAccess.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMemberForAccess(null)}
                className="text-white/70 hover:text-[#bd9661] text-xl font-bold cursor-pointer transition-colors p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateMemberAccess} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Role / Stage Designation
                </label>
                <input
                  type="text"
                  value={selectedMemberForAccess.role}
                  onChange={(e) => setSelectedMemberForAccess({ ...selectedMemberForAccess, role: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                />
              </div>

              {/* Access Tier */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Assigned Access Level Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'Full Access',
                      title: '👑 Full Access',
                      desc: 'Full console access: Run sheet, seating canvas, catering, messaging.',
                    },
                    {
                      id: 'Host & Run Sheet',
                      title: '🎤 Host & Run Sheet',
                      desc: 'Interactive cues, private runsheet notes, timeline checkoffs.',
                    },
                    {
                      id: 'Seating & Guests',
                      title: '🪑 Seating & Guests',
                      desc: 'Drag & drop seating canvas, RSVP checks, dietary summaries.',
                    },
                    {
                      id: 'Audio & AV Lead',
                      title: '🎧 Audio & AV Lead',
                      desc: 'Stage music timeline, mic cues, sound technical notes.',
                    },
                  ].map((level) => (
                    <div
                      key={level.id}
                      onClick={() => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        accessLevel: level.id as any
                      })}
                      className={\`p-3 rounded-xl border cursor-pointer transition-all \${
                        selectedMemberForAccess.accessLevel === level.id
                          ? 'border-[#bd9661] bg-[#faf5ed] text-[#15110e] shadow-2xs'
                          : 'border-[#e8ded0] bg-white hover:bg-[#faf8f5] text-[#544332]'
                      }\`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{level.title}</span>
                        {selectedMemberForAccess.accessLevel === level.id && <span className="text-[#bd9661]">✓</span>}
                      </div>
                      <p className="text-[10.5px] text-[#8b7b6b] mt-1 leading-normal">{level.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Scope */}
              <div className="space-y-1.5 pt-1 border-t border-[#f0ede4]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Assigned Wedding Scope
                </label>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#15110e]">
                    <input
                      type="radio"
                      name="manageScope"
                      checked={selectedMemberForAccess.assignedWeddings?.includes('all') || !selectedMemberForAccess.assignedWeddings}
                      onChange={() => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        assignedWeddings: ['all']
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>All Agency Weddings</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#15110e]">
                    <input
                      type="radio"
                      name="manageScope"
                      checked={!selectedMemberForAccess.assignedWeddings?.includes('all') && (selectedMemberForAccess.assignedWeddings?.length || 0) > 0}
                      onChange={() => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        assignedWeddings: ['w1']
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>Specific Weddings Only</span>
                  </label>
                </div>

                {!selectedMemberForAccess.assignedWeddings?.includes('all') && selectedMemberForAccess.assignedWeddings && (
                  <div className="p-2.5 bg-[#faf8f5] rounded-xl border border-[#e8ded0] space-y-1.5 mt-2">
                    <span className="text-[10px] uppercase font-bold text-[#8b7b6b]">Select Weddings:</span>
                    <div className="space-y-1">
                      {state.weddings.map((w) => {
                        const isAssigned = (selectedMemberForAccess.assignedWeddings || []).includes(w.id);
                        return (
                          <label key={w.id} className="flex items-center gap-2 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={(e) => {
                                const curr = selectedMemberForAccess.assignedWeddings || [];
                                const updated = e.target.checked
                                  ? [...curr, w.id]
                                  : curr.filter(id => id !== w.id);
                                setSelectedMemberForAccess({
                                  ...selectedMemberForAccess,
                                  assignedWeddings: updated.length ? updated : ['w1']
                                });
                              }}
                              className="accent-[#bd9661]"
                            />
                            <span className="font-medium text-[#15110e]">{w.coupleNames}</span>
                            <span className="text-[10px] text-[#8b7b6b]">({w.date})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Granular Feature Permissions */}
              <div className="space-y-1.5 pt-1 border-t border-[#f0ede4]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Feature Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedMemberForAccess.permissions?.canEditRunsheet}
                      onChange={(e) => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        permissions: { ...selectedMemberForAccess.permissions, canEditRunsheet: e.target.checked }
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>Edit Live Run Sheet</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedMemberForAccess.permissions?.canEditSeating}
                      onChange={(e) => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        permissions: { ...selectedMemberForAccess.permissions, canEditSeating: e.target.checked }
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>Modify Seating Canvas</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedMemberForAccess.permissions?.canViewDietary}
                      onChange={(e) => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        permissions: { ...selectedMemberForAccess.permissions, canViewDietary: e.target.checked }
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>View Dietary Alerts</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedMemberForAccess.permissions?.canMessageClients}
                      onChange={(e) => setSelectedMemberForAccess({
                        ...selectedMemberForAccess,
                        permissions: { ...selectedMemberForAccess.permissions, canMessageClients: e.target.checked }
                      })}
                      className="accent-[#bd9661]"
                    />
                    <span>Chat with Couples via Joey</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#e8ded0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleRemoveMember(selectedMemberForAccess.id)}
                  className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer"
                >
                  Remove Member
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMemberForAccess(null)}
                    className="px-4 py-2 rounded-xl border border-[#e8ded0] text-[#8b7b6b] hover:bg-[#faf8f5] font-bold cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-gold btn-sm px-5 py-2 font-bold shadow-2xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Joey AI Assistant for Desktop MC */}
      <JoeyChatbot context="mc" />

`;

if (!c.includes('showInviteMemberModal && (')) {
  if (c.includes(clientMarker)) {
    c = c.replace(clientMarker, modalsCode + clientMarker);
    console.log('Inserted modals and Joey chatbot successfully!');
  } else {
    console.error('Could not find clientMarker in McView.tsx');
  }
} else {
  console.log('Modals already present in McView.tsx');
}

fs.writeFileSync(filePath, c, 'utf8');
console.log('Done!');
