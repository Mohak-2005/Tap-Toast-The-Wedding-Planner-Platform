import fs from 'fs';

const filePath = 'src/components/McView.tsx';
let c = fs.readFileSync(filePath, 'utf8');

// 1. Update imports
c = c.replace(
  `import { PrivateRunSheetItem, Client, Invoice, Wedding, Guest } from '../lib/types';`,
  `import { PrivateRunSheetItem, Client, Invoice, Wedding, Guest, TeamMember } from '../lib/types';\nimport JoeyChatbot from './JoeyChatbot';`
);

// 2. Add Team Member modal states & handlers
const oldStateMarker = `  const [cueChimeSound, setCueChimeSound] = useState('Soft Bell');`;

const newTeamStates = `  const [cueChimeSound, setCueChimeSound] = useState('Soft Bell');

  // Team Member & Access Control States
  const [showInviteMemberModal, setShowInviteMemberModal] = useState<boolean>(false);
  const [selectedMemberForAccess, setSelectedMemberForAccess] = useState<TeamMember | null>(null);

  // Invite Form State
  const [invName, setInvName] = useState<string>('');
  const [invRole, setInvRole] = useState<string>('Associate MC & Host');
  const [invEmail, setInvEmail] = useState<string>('');
  const [invPhone, setInvPhone] = useState<string>('');
  const [invAccessLevel, setInvAccessLevel] = useState<'Full Access' | 'Host & Run Sheet' | 'Seating & Guests' | 'Audio & AV Lead'>('Host & Run Sheet');
  const [invWeddingScope, setInvWeddingScope] = useState<'all' | 'custom'>('all');
  const [invSelectedWeddings, setInvSelectedWeddings] = useState<string[]>(['w1']);
  const [invCanRunsheet, setInvCanRunsheet] = useState<boolean>(true);
  const [invCanSeating, setInvCanSeating] = useState<boolean>(false);
  const [invCanDietary, setInvCanDietary] = useState<boolean>(true);
  const [invCanMessaging, setInvCanMessaging] = useState<boolean>(true);

  // Handlers for Team Members
  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName.trim() || !invEmail.trim()) {
      showToast('Please enter member name and email address', 'error');
      return;
    }

    const newMember: TeamMember = {
      id: \`tm_\${Date.now()}\`,
      name: invName.trim(),
      role: invRole.trim() || 'Associate Host',
      email: invEmail.trim(),
      phone: invPhone.trim() || '0400 123 456',
      status: 'Active',
      accessLevel: invAccessLevel,
      assignedWeddings: invWeddingScope === 'all' ? ['all'] : invSelectedWeddings,
      permissions: {
        canEditRunsheet: invCanRunsheet,
        canEditSeating: invCanSeating,
        canViewDietary: invCanDietary,
        canMessageClients: invCanMessaging,
      },
    };

    setState({
      ...state,
      team: [...(state.team || []), newMember],
    });

    showToast(\`Invitation sent to \${newMember.name} with \${newMember.accessLevel} access!\`, 'success');
    setShowInviteMemberModal(false);
    setInvName('');
    setInvEmail('');
    setInvPhone('');
  };

  const handleUpdateMemberAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForAccess) return;

    const updatedTeam = (state.team || []).map((m) => {
      if (m.id === selectedMemberForAccess.id) {
        return selectedMemberForAccess;
      }
      return m;
    });

    setState({ ...state, team: updatedTeam });
    showToast(\`Access permissions updated for \${selectedMemberForAccess.name}!\`, 'success');
    setSelectedMemberForAccess(null);
  };

  const handleRemoveMember = (memberId: string) => {
    const member = (state.team || []).find(m => m.id === memberId);
    const updatedTeam = (state.team || []).filter(m => m.id !== memberId);
    setState({ ...state, team: updatedTeam });
    showToast(\`Removed \${member?.name || 'team member'} from agency team\`, 'info');
    if (selectedMemberForAccess?.id === memberId) {
      setSelectedMemberForAccess(null);
    }
  };`;

c = c.replace(oldStateMarker, newTeamStates);

// 3. Replace Tab 5: Team section
const oldTeamSection = `        {/* ==================================================================== */}
        {/* TAB 5: TEAM (Screenshot 38)                                          */}
        {/* ==================================================================== */}
        {activeTab === 'team' && !selectedWeddingId && (
          <section className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  STAFF &amp; CREW
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  MC Team &amp; Crew
                </h1>
              </div>
              <button
                type="button"
                onClick={() => showToast('Invitation dispatched to team collaborator via email', 'success')}
                className="btn btn-gold btn-sm"
              >
                + Invite Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(state.team || []).map(m => (
                <div
                  key={m.id}
                  className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-xl p-5 shadow-sm space-y-3"
                >
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#15110e]">{m.name}</h3>
                    <div className="text-xs text-[#bd9661] font-bold mt-0.5">{m.role}</div>
                  </div>
                  <div className="space-y-1 text-xs text-[#8b7b6b]">
                    <div>{m.email}</div>
                    <div>{m.phone}</div>
                  </div>
                  <div className="pt-2">
                    <span className="tt-pill green text-[10px]">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}`;

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
                onClick={() => setShowInviteMemberModal(true)}
                className="btn btn-gold btn-sm flex items-center gap-1.5 shadow-2xs"
              >
                <span>+ Invite Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(state.team || []).map((m) => {
                const access = m.accessLevel || 'Host & Run Sheet';
                const assignedWedCount = m.assignedWeddings && m.assignedWeddings.includes('all')
                  ? 'All Weddings'
                  : \`\${(m.assignedWeddings || []).length} Assigned Wedding(s)\`;

                return (
                  <div
                    key={m.id}
                    className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      {/* Top: Avatar, Name, Role & Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#15110e] text-[#dfc194] border border-[#bd9661]/40 flex items-center justify-center font-bold font-serif text-sm shrink-0">
                            {m.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-serif text-base font-bold text-[#15110e] leading-snug">{m.name}</h3>
                            <div className="text-xs text-[#bd9661] font-semibold">{m.role}</div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full shrink-0">
                          {m.status}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-1 text-xs text-[#8b7b6b] bg-[#faf8f5] p-2.5 rounded-lg border border-[#f0ede4]">
                        <div className="flex items-center gap-2">
                          <span>✉</span>
                          <span className="truncate">{m.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📞</span>
                          <span>{m.phone}</span>
                        </div>
                      </div>

                      {/* Access Level & Scope */}
                      <div className="space-y-2 pt-1 border-t border-[#f0ede4]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8b7b6b] font-medium">Access Tier:</span>
                          <span className={\`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full \${
                            access === 'Full Access'
                              ? 'bg-[#faf6f0] text-[#8e6e42] border border-[#ebd3a8]'
                              : access === 'Host & Run Sheet'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : access === 'Audio & AV Lead'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-purple-50 text-purple-800 border border-purple-200'
                          }\`}>
                            {access}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8b7b6b] font-medium">Wedding Scope:</span>
                          <span className="text-[#15110e] font-semibold text-[11px]">
                            {assignedWedCount}
                          </span>
                        </div>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {m.permissions?.canEditRunsheet && (
                            <span className="bg-[#faf5ee] border border-[#ebd3a8] text-[#544332] text-[10px] px-2 py-0.5 rounded">
                              ✓ Run Sheet
                            </span>
                          )}
                          {m.permissions?.canEditSeating && (
                            <span className="bg-[#faf5ee] border border-[#ebd3a8] text-[#544332] text-[10px] px-2 py-0.5 rounded">
                              ✓ Seating Canvas
                            </span>
                          )}
                          {m.permissions?.canViewDietary && (
                            <span className="bg-[#faf5ee] border border-[#ebd3a8] text-[#544332] text-[10px] px-2 py-0.5 rounded">
                              ✓ Dietary Alerts
                            </span>
                          )}
                          {m.permissions?.canMessageClients && (
                            <span className="bg-[#faf5ee] border border-[#ebd3a8] text-[#544332] text-[10px] px-2 py-0.5 rounded">
                              ✓ Client Chat
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-[#f0ede4] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMemberForAccess(m)}
                        className="px-3 py-1.5 rounded-lg bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] hover:text-white font-bold text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
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

c = c.replace(oldTeamSection, newTeamSection);

// 4. Add the Invite Member Modal and Manage Access Modal before the final closing div
const closingDivMarker = `      {selectedClient && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex justify-end"
          onClick={() => setSelectedClient(null)}
        >`;

const newModalsAndChatbot = `      {/* ==================================================================== */}
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
                    <span>Select Specific Weddings</span>
                  </label>
                </div>

                {invWeddingScope === 'custom' && (
                  <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 space-y-1.5 mt-2">
                    <span className="text-[10.5px] text-[#8b7b6b] block">Check all weddings this member can access:</span>
                    {(state.weddings || []).map((w) => {
                      const isChecked = invSelectedWeddings.includes(w.id);
                      return (
                        <label key={w.id} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#15110e]">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setInvSelectedWeddings(invSelectedWeddings.filter(id => id !== w.id));
                              } else {
                                setInvSelectedWeddings([...invSelectedWeddings, w.id]);
                              }
                            }}
                            className="accent-[#bd9661]"
                          />
                          <span>{w.couple} &bull; <small className="text-[#8b7b6b] font-normal">{w.date}</small></span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Granular Permission Toggles */}
              <div className="space-y-2 pt-1 border-t border-[#f0ede4]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Granular Feature Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-[#faf8f5] rounded-lg border border-[#e8ded0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invCanRunsheet}
                      onChange={(e) => setInvCanRunsheet(e.target.checked)}
                      className="accent-[#bd9661]"
                    />
                    <span>Edit Run Sheet &amp; Stage Cues</span>
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
                    <span>View Guest Dietary Alerts</span>
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

              {/* Footer */}
              <div className="pt-3 border-t border-[#e8ded0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteMemberModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e8ded0] text-[#8b7b6b] hover:bg-[#faf8f5] font-bold cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm px-5 py-2 font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Send Invitation</span>
                  <span>✉</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: MANAGE TEAM MEMBER ACCESS PERMISSIONS                         */}
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
                  PERMISSIONS &amp; ACCESS CONTROL
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
              <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e8ded0] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#15110e] text-sm">{selectedMemberForAccess.name}</div>
                  <div className="text-[11px] text-[#8b7b6b]">{selectedMemberForAccess.role} &bull; {selectedMemberForAccess.email}</div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                  {selectedMemberForAccess.status}
                </span>
              </div>

              {/* Role Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={selectedMemberForAccess.role}
                  onChange={(e) => setSelectedMemberForAccess({ ...selectedMemberForAccess, role: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                />
              </div>

              {/* Access Tier */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Access Level Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'Full Access', title: '👑 Full Access' },
                    { id: 'Host & Run Sheet', title: '🎤 Host & Run Sheet' },
                    { id: 'Seating & Guests', title: '🪑 Seating & Guests' },
                    { id: 'Audio & AV Lead', title: '🎧 Audio & AV Lead' },
                  ].map((level) => (
                    <div
                      key={level.id}
                      onClick={() => setSelectedMemberForAccess({ ...selectedMemberForAccess, accessLevel: level.id as any })}
                      className={\`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between \${
                        selectedMemberForAccess.accessLevel === level.id
                          ? 'border-[#bd9661] bg-[#faf5ed] text-[#15110e] font-bold'
                          : 'border-[#e8ded0] bg-white hover:bg-[#faf8f5] text-[#544332]'
                      }\`}
                    >
                      <span>{level.title}</span>
                      {selectedMemberForAccess.accessLevel === level.id && <span className="text-[#bd9661]">✓</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Weddings Scope */}
              <div className="space-y-1.5 pt-1 border-t border-[#f0ede4]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Assigned Wedding Access
                </label>
                <div className="space-y-1">
                  {(state.weddings || []).map((w) => {
                    const isAll = (selectedMemberForAccess.assignedWeddings || []).includes('all');
                    const isAssigned = isAll || (selectedMemberForAccess.assignedWeddings || []).includes(w.id);

                    return (
                      <label key={w.id} className="flex items-center justify-between p-2 rounded-lg bg-[#faf8f5] border border-[#e8ded0] cursor-pointer">
                        <span className="font-semibold text-[#15110e]">{w.couple} <small className="text-[#8b7b6b] font-normal">({w.date})</small></span>
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={() => {
                            let updated: string[];
                            if (isAll) {
                              updated = (state.weddings || []).filter(other => other.id !== w.id).map(other => other.id);
                            } else if (isAssigned) {
                              updated = (selectedMemberForAccess.assignedWeddings || []).filter(id => id !== w.id);
                            } else {
                              updated = [...(selectedMemberForAccess.assignedWeddings || []), w.id];
                            }
                            setSelectedMemberForAccess({ ...selectedMemberForAccess, assignedWeddings: updated });
                          }}
                          className="accent-[#bd9661]"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Feature Permissions */}
              <div className="space-y-2 pt-1 border-t border-[#f0ede4]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Granted Feature Permissions
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
                    <span>Edit Run Sheet &amp; Cues</span>
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

      {selectedClient && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex justify-end"
          onClick={() => setSelectedClient(null)}
        >`;

c = c.replace(closingDivMarker, newModalsAndChatbot);

fs.writeFileSync(filePath, c, 'utf8');
console.log('Updated McView.tsx successfully');
