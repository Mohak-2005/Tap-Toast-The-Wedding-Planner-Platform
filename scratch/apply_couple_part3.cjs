const fs = require('fs');
const filePath = 'C:/Users/Mohak/Desktop/tap&toast - Copy/src/components/CoupleView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Event Filter dropdown right after guestFilter select
const guestFilterMarker = `                  <select
                    value={guestFilter}
                    onChange={(e) => setGuestFilter(e.target.value as any)}
                    className="bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none cursor-pointer"
                  >
                    <option value="all">All RSVP Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="awaiting">Awaiting</option>
                    <option value="declined">Declined</option>
                  </select>`;

const guestFilterReplacement = `                  <select
                    value={guestFilter}
                    onChange={(e) => setGuestFilter(e.target.value as any)}
                    className="bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none cursor-pointer"
                  >
                    <option value="all">All RSVP Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="awaiting">Awaiting</option>
                    <option value="declined">Declined</option>
                  </select>

                  <select
                    value={guestEventFilter}
                    onChange={(e) => setGuestEventFilter(e.target.value)}
                    className="bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none cursor-pointer font-medium"
                  >
                    <option value="all">All Events ({(wedding.events || []).length})</option>
                    {(wedding.events || []).map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.name}
                      </option>
                    ))}
                  </select>`;

content = content.replace(guestFilterMarker, guestFilterReplacement);

// 2. Add event pill badges in individual guest row below household
const guestNameCellMarker = `                              <td className="py-3 px-3">
                                <strong className="text-sm text-[#15110e] block">{g.name}</strong>
                                <span className="text-[11px] text-[#8b7b6b]">{g.household}</span>
                              </td>`;

const guestNameCellReplacement = `                              <td className="py-3 px-3">
                                <strong className="text-sm text-[#15110e] block">{g.name}</strong>
                                <span className="text-[11px] text-[#8b7b6b] block">{g.household}</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {(wedding.events || []).filter(e => (g.invitedEventIds || []).includes(e.id)).map(e => (
                                    <span
                                      key={e.id}
                                      className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#f4ece1] text-[#7a5933] border border-[#e4d6c4]"
                                    >
                                      {e.category === 'ceremony' ? '💍 ' : e.category === 'reception' ? '🥂 ' : e.category === 'sangeet' ? '✨ ' : ''}{e.name}
                                    </span>
                                  ))}
                                </div>
                              </td>`;

content = content.replace(guestNameCellMarker, guestNameCellReplacement);

// 3. Add Event selection checkboxes in showAddGuestModal
const addGuestDietMarker = `                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Dietary Requirements</label>
                      <input
                        type="text"
                        value={newGuestDiet}
                        onChange={(e) => setNewGuestDiet(e.target.value)}
                        placeholder="e.g. Vegetarian, Gluten-free"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661]"
                      />
                    </div>`;

const addGuestDietReplacement = `                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Dietary Requirements</label>
                      <input
                        type="text"
                        value={newGuestDiet}
                        onChange={(e) => setNewGuestDiet(e.target.value)}
                        placeholder="e.g. Vegetarian, Gluten-free"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase">Invite to Events</label>
                        <span className="text-[10px] text-[#bd9661] font-semibold">{newGuestEventIds.length} events selected</span>
                      </div>
                      <div className="space-y-1 bg-[#faf8f5] p-2.5 rounded-xl border border-[#e8ded0] max-h-36 overflow-y-auto">
                        {(wedding.events || []).map((evt) => (
                          <label key={evt.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                            <input
                              type="checkbox"
                              checked={newGuestEventIds.includes(evt.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewGuestEventIds(prev => [...prev, evt.id]);
                                } else {
                                  setNewGuestEventIds(prev => prev.filter(id => id !== evt.id));
                                }
                              }}
                              className="accent-[#bd9661] rounded cursor-pointer"
                            />
                            <span className="text-xs text-[#15110e] font-medium">{evt.name}</span>
                            <span className="text-[10px] text-[#8b7b6b] ml-auto">({evt.time})</span>
                          </label>
                        ))}
                      </div>
                    </div>`;

content = content.replace(addGuestDietMarker, addGuestDietReplacement);

// 4. In Content & Stories, insert Guided Story Builder & Cheers AI strip
const storyContentMarker = `                  <div>
                    <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PAGE STORY &amp; CONTENT</label>
                    <textarea
                      value={contentPages[contentSubTab].content}
                      onChange={(e) => setContentPages({
                        ...contentPages,
                        [contentSubTab]: { ...contentPages[contentSubTab], content: e.target.value }
                      })}
                      rows={6}
                      className="w-full bg-white border border-[#e8ded0] rounded-lg p-2.5 outline-none focus:border-[#bd9661] resize-none"
                    />
                  </div>`;

const storyContentReplacement = `                  {contentSubTab === 'ourStory' && (
                    <div className="bg-[#faf7f2] border border-[#ebdcc9] rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#bd9661] text-[#15110e] flex items-center justify-center text-xs font-bold shadow-2xs">✨</span>
                          <div>
                            <h4 className="font-serif font-bold text-xs text-[#15110e]">Guided Story &amp; Cheers AI Assistant</h4>
                            <p className="text-[10px] text-[#8b7b6b]">Answer 3 short prompts and let Cheers draft your couple story</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!cheersDraftOutput) handleDraftWithCheers();
                            setShowCheersAiModal(true);
                          }}
                          className="px-3 py-1.5 bg-[#15110e] hover:bg-[#231c17] text-[#dfc194] font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                        >
                          <span>✨</span>
                          <span>Draft with Cheers AI</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className="bg-white p-2 rounded-lg border border-[#e8ded0]">
                          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#bd9661] block mb-0.5">1. How We Met</span>
                          <p className="text-[#594939] text-xs line-clamp-2 italic">"{storyPromptHowWeMet}"</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-[#e8ded0]">
                          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#bd9661] block mb-0.5">2. The Proposal</span>
                          <p className="text-[#594939] text-xs line-clamp-2 italic">"{storyPromptProposal}"</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-[#e8ded0]">
                          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#bd9661] block mb-0.5">3. What We Cherish</span>
                          <p className="text-[#594939] text-xs line-clamp-2 italic">"{storyPromptCherish}"</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PAGE STORY &amp; CONTENT</label>
                    <textarea
                      value={contentPages[contentSubTab].content}
                      onChange={(e) => setContentPages({
                        ...contentPages,
                        [contentSubTab]: { ...contentPages[contentSubTab], content: e.target.value }
                      })}
                      rows={6}
                      className="w-full bg-white border border-[#e8ded0] rounded-lg p-2.5 outline-none focus:border-[#bd9661] resize-none"
                    />
                  </div>`;

content = content.replace(storyContentMarker, storyContentReplacement);

// 5. Insert Cheers AI Modal inside the content pages section before the closing tag
const pagesEndMarker = `{/* TAB 5: DIGITAL INVITATIONS & QR CODES (Screenshot 18)        */}`;
const cheersModalCode = `{/* Modal: Cheers AI Story Drafter */}
            {showCheersAiModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#15110e] text-[#dfc194] flex items-center justify-center text-sm font-bold shadow-xs">
                        ✨
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#15110e]">
                          Cheers AI &bull; Story Assistant
                        </h3>
                        <p className="text-xs text-[#8b7b6b]">
                          Craft a heartfelt couple narrative from three simple prompts
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCheersAiModal(false)}
                      className="text-gray-400 hover:text-black font-bold text-lg cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        1. How and where did you two first cross paths?
                      </label>
                      <input
                        type="text"
                        value={storyPromptHowWeMet}
                        onChange={(e) => setStoryPromptHowWeMet(e.target.value)}
                        placeholder="e.g. A rainy autumn afternoon in Bowral at a small corner bookstore"
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        2. The proposal moment or turning point:
                      </label>
                      <input
                        type="text"
                        value={storyPromptProposal}
                        onChange={(e) => setStoryPromptProposal(e.target.value)}
                        placeholder="e.g. A sunset hike overlooking Lake Wakatipu with champagne"
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        3. What moments, adventures, or qualities do you cherish most together?
                      </label>
                      <input
                        type="text"
                        value={storyPromptCherish}
                        onChange={(e) => setStoryPromptCherish(e.target.value)}
                        placeholder="e.g. Cooking pasta together, road trips to coastal towns, and inside jokes"
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>

                    {/* Tone Selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        DESIRED NARRATIVE TONE
                      </label>
                      <div className="flex gap-2">
                        {[
                          { id: 'romantic', label: 'Romantic & Timeless' },
                          { id: 'warm', label: 'Warm & Candid' },
                          { id: 'playful', label: 'Playful & Joyful' },
                        ].map((tone) => (
                          <button
                            key={tone.id}
                            type="button"
                            onClick={() => setStoryAiTone(tone.id as any)}
                            className={\`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all \${
                              storyAiTone === tone.id
                                ? 'bg-[#15110e] text-[#dfc194] border-[#15110e] shadow-2xs font-bold'
                                : 'bg-[#faf8f5] text-[#6b5a4a] border-[#e8ded0] hover:bg-[#ede5d8]'
                            }\`}
                          >
                            {tone.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleDraftWithCheers}
                        disabled={cheersIsDrafting}
                        className="w-full py-2 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                      >
                        {cheersIsDrafting ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            <span>Cheers is crafting your story...</span>
                          </>
                        ) : (
                          <>
                            <span>✨</span>
                            <span>{cheersDraftOutput ? 'Regenerate Draft with Cheers' : 'Generate Story with Cheers'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Draft Output Preview */}
                    {cheersDraftOutput && (
                      <div className="space-y-2 pt-2 border-t border-[#f0ede4]">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase">
                            CHEERS AI DRAFT PREVIEW
                          </label>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ✓ Ready to apply
                          </span>
                        </div>
                        <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-3 text-xs text-[#2e261f] leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto font-serif">
                          {cheersDraftOutput}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-3 border-t border-[#e8ded0]">
                      <button
                        type="button"
                        onClick={() => setShowCheersAiModal(false)}
                        className="px-4 py-2 rounded-xl border border-[#e8ded0] text-[#8b7b6b] hover:bg-gray-50 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={!cheersDraftOutput}
                        onClick={handleApplyCheersDraft}
                        className={\`px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors \${
                          cheersDraftOutput
                            ? 'bg-[#15110e] hover:bg-[#231c17] text-[#dfc194] cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }\`}
                      >
                        Apply Story to Page
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        `;

content = content.replace(pagesEndMarker, cheersModalCode + '\n        ' + pagesEndMarker);

// Also update open add guest modal to initialize newGuestEventIds
const openModalMarker = `onClick={() => setShowAddGuestModal(true)}`;
const openModalReplacement = `onClick={() => { setNewGuestEventIds((wedding.events || []).map(e => e.id)); setShowAddGuestModal(true); }}`;
content = content.replace(openModalMarker, openModalReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully applied Part 3 to CoupleView.tsx');
