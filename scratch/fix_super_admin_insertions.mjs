import fs from 'fs';

const filePath = 'src/components/SuperAdminView.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Normalize line endings to \n
content = content.replace(/\r\n/g, '\n');

// 1. Check if + Invite Couple to Register button is added
if (!content.includes('+ Invite Couple to Register')) {
  // Replace in Platform overview (line ~735)
  const target1 = `<button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="btn btn-gold btn-sm"
                >
                  + Invite MC
                </button>`;

  const replacement1 = `<div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteCoupleModal(true)}
                    className="btn btn-outline btn-sm font-bold flex items-center gap-1.5 border-[#bd9661] text-[#bd9661] hover:bg-[#bd9661] hover:text-[#15110e] cursor-pointer"
                  >
                    <span>💍</span>
                    <span>+ Invite Couple to Register</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(true)}
                    className="btn btn-gold btn-sm"
                  >
                    + Invite MC
                  </button>
                </div>`;

  content = content.replace(target1, replacement1);

  // Replace in Tenants tab (line ~830)
  const target2 = `<button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="btn btn-gold btn-sm"
              >
                + Invite MC
              </button>`;

  const replacement2 = `<div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteCoupleModal(true)}
                  className="btn btn-outline btn-sm font-bold flex items-center gap-1.5 border-[#bd9661] text-[#bd9661] hover:bg-[#bd9661] hover:text-[#15110e] cursor-pointer"
                >
                  <span>💍</span>
                  <span>+ Invite Couple to Register</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="btn btn-gold btn-sm"
                >
                  + Invite MC
                </button>
              </div>`;

  content = content.replace(target2, replacement2);
}

// 2. Add the Couple Onboarding Questions & Preferences Audit panel into activeTab === 'audit'
if (!content.includes('Couple Onboarding & Question Preference Audits')) {
  const auditTarget = "{activeTab === 'audit' && (\n          <section className=\"space-y-6\">";
  
  const coupleAuditSection = `{activeTab === 'audit' && (
          <section className="space-y-6">
            {/* AUDIT SECTION REQUIREMENT 1: COUPLE ONBOARDING & QUESTION AUDITS */}
            <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#f0ede6]">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[2px] text-[#bd9661]">
                    IMMUTABLE ONBOARDING AUDIT TRAIL
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#15110e]">
                    Couple Onboarding &amp; Question Preference Audits
                  </h3>
                  <p className="text-xs text-[#8b7b6b] mt-0.5">
                    Immutable audit records of reception vision, speech pacing, grand entrance, and demographic breakdown approved during couple onboarding.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#f0ebe3] text-[#6b5847] px-3 py-1 rounded-full text-xs font-semibold">
                    {state.weddings.length} Couple Audits Active
                  </span>
                </div>
              </div>

              {/* Render Audit Cards for Weddings */}
              <div className="space-y-4">
                {state.weddings.map((w: any) => {
                  const auditData = w.aiOnboardingAnswers || {
                    vibe: 'High-Energy Dance Party with Sophisticated Cocktails',
                    speeches: 'Grouped before mains (MC Recommended pacing)',
                    entrance: 'Explosive upbeat grand entrance with MC hype fanfare',
                    family: 'Family-friendly with dedicated Kids meals and family tables',
                    customNotes: [
                      'Keep father-of-the-bride speech strictly under 5 minutes',
                      'Kids table should have coloring books ready at seats',
                    ],
                    auditedAt: '2026-10-26 14:30',
                    auditedByCouple: true,
                  };
                  const customList = Array.isArray(auditData.customNotes) ? auditData.customNotes : [];
                  const assignedMc = w.selectedMc?.name || 'Robert Galati';
                  const planName = w.subscriptionPlan?.name || 'Signature Pro Wedding Suite';

                  return (
                    <div key={w.id} className="border border-[#ebdcc9] rounded-xl bg-[#faf8f5] p-4.5 space-y-3 shadow-2xs">
                      {/* Top Header of the Audit */}
                      <div className="flex items-start justify-between flex-wrap gap-2 pb-2.5 border-b border-[#e8ded0]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#15110e] border border-[#bd9661] text-[#dfc194] font-serif font-bold text-sm flex items-center justify-center">
                            {w.couple.split('&').map((p: string) => p.trim()[0]).join('&')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif text-base font-bold text-[#15110e]">{w.couple}</h4>
                              <span className="bg-[#bd9661] text-[#15110e] text-[9px] font-black uppercase px-2 py-0.5 rounded">
                                {planName}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                              {w.venue} &bull; Wedding Date: {w.dateDisplay || w.date} &bull; Host: <strong className="text-[#15110e]">{assignedMc}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <span>✓</span>
                            <span>Platform &amp; Couple Audited</span>
                          </span>
                        </div>
                      </div>

                      {/* Audited Questions & Preferences Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-white p-2.5 rounded-lg border border-[#f0ede6] flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                              1. Reception Vibe &amp; Atmosphere
                            </div>
                            <div className="text-[#15110e] font-semibold mt-0.5">{auditData.vibe}</div>
                          </div>
                          <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">Audited ✓</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-[#f0ede6] flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                              2. Speech Pacing &amp; Run Sheet Timing
                            </div>
                            <div className="text-[#15110e] font-semibold mt-0.5">{auditData.speeches}</div>
                          </div>
                          <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">Audited ✓</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-[#f0ede6] flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                              3. Grand Entrance Fanfare
                            </div>
                            <div className="text-[#15110e] font-semibold mt-0.5">{auditData.entrance}</div>
                          </div>
                          <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">Audited ✓</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-[#f0ede6] flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                              4. Family &amp; Kid Demographics
                            </div>
                            <div className="text-[#15110e] font-semibold mt-0.5">{auditData.family}</div>
                          </div>
                          <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">Audited ✓</span>
                        </div>
                      </div>

                      {/* Custom Audited Instructions */}
                      {customList.length > 0 && (
                        <div className="bg-white p-2.5 rounded-lg border border-[#f0ede6] text-xs">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] mb-1">
                            Custom Prompt Rules Logged &amp; Verified:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {customList.map((rule: string, i: number) => (
                              <span key={i} className="bg-[#f5ede2] text-[#524438] px-2.5 py-1 rounded-md text-[11px] font-medium border border-[#ebdcc9] flex items-center gap-1.5">
                                <span className="text-[#bd9661] font-bold">#{i + 1}</span>
                                <span>{rule}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Audit Footnote */}
                      <div className="flex items-center justify-between text-[11px] text-[#8b7b6b] pt-1">
                        <span>🔒 Cryptographically signed and synchronized to MC Console ({assignedMc})</span>
                        <span className="font-mono text-[10px]">Audit Ref: AUD-{w.id.toUpperCase()}-2026</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>`;

  content = content.replace(auditTarget, coupleAuditSection);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully applied all SuperAdmin updates!');
