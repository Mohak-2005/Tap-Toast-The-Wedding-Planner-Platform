const fs = require('fs');

let content = fs.readFileSync('src/components/CoupleView.tsx', 'utf8');

const storyModalTarget = `{/* Right: Guest View Live Preview */}`;
const storyModalMarkup = `{/* 🥂 CHEERS AI INTERACTIVE STORY CHATBOT CONCIERGE */}
            {showCheersAiModal && (
              <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-hidden">
                <div className="bg-white border border-[#bd9661] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Modal Header */}
                  <div className="p-4 border-b border-[#e8ded0] flex items-center justify-between bg-[#15110e] text-white shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#291f17] border border-[#bd9661]/40 flex items-center justify-center text-lg shadow-inner">
                        🥂
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#dfc194]">
                          CHEERS AI STORYTELLER
                        </div>
                        <h3 className="font-serif text-lg font-bold text-white">
                          Couple Story &amp; Content Chatbot
                        </h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCheersAiModal(false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#dfc194] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Quick Style Suggestions Bar */}
                  <div className="px-4 py-2 bg-[#faf8f5] border-b border-[#e8ded0] flex items-center gap-2 overflow-x-auto text-xs shrink-0">
                    <span className="text-[10px] font-bold uppercase text-[#8b7b6b] shrink-0">Refine Style:</span>
                    {[
                      { label: '✨ Romantic & Poetic', query: 'Make it romantic and poetic' },
                      { label: '🎉 Playful & Joyful', query: 'Make it playful with light humor' },
                      { label: '📖 Warm & Concise', query: 'Make it brief and concise' },
                      { label: '🌟 Highlight Cherished Moments', query: 'Emphasize what we cherish together' },
                    ].map((pill, pidx) => (
                      <button
                        key={pidx}
                        type="button"
                        onClick={() => handleSendStoryChatMessage(pill.query)}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-[#ede5d8] border border-[#d5c7b5] text-[#15110e] font-semibold text-[11px] whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  {/* Chat Messages Body */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#fbf9f6] text-xs">
                    {storyChatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={\`flex flex-col \${msg.sender === 'user' ? 'items-end' : 'items-start'}\`}
                      >
                        <div
                          className={\`max-w-[88%] rounded-2xl p-3.5 shadow-2xs whitespace-pre-wrap leading-relaxed \${
                            msg.sender === 'user'
                              ? 'bg-[#15110e] text-[#dfc194] rounded-br-xs'
                              : 'bg-white text-[#15110e] border border-[#e8ded0] rounded-bl-xs'
                          }\`}
                        >
                          <p>{msg.text}</p>

                          {/* Story Draft Card with 1-Click Apply */}
                          {msg.draft && (
                            <div className="mt-3 p-3.5 bg-[#faf8f5] border border-[#bd9661]/40 rounded-xl space-y-2.5 text-xs">
                              <div className="flex items-center justify-between border-b border-[#ebdcc9] pb-1.5">
                                <span className="font-serif font-bold text-[#15110e]">Story Proposal</span>
                                <span className="text-[10px] text-[#bd9661] font-bold">✨ Cheers AI</span>
                              </div>
                              <p className="italic text-[#594939] leading-relaxed font-serif bg-white p-2.5 rounded-lg border border-[#e8ded0]">
                                "{msg.draft}"
                              </p>
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setContentPages((prev) => ({
                                      ...prev,
                                      ourStory: {
                                        ...prev.ourStory,
                                        content: msg.draft!,
                                        status: 'Published',
                                      },
                                    }));
                                    setShowCheersAiModal(false);
                                    showToast('✓ Story applied to wedding website!', 'success');
                                  }}
                                  className="px-4 py-1.5 bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                                >
                                  <span>✓</span>
                                  <span>Apply to Our Story</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="text-[9.5px] text-[#8b7b6b] mt-0.5 px-1 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input Bar with File Upload */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendStoryChatMessage();
                    }}
                    className="p-3 bg-white border-t border-[#e8ded0] flex items-center gap-2 shrink-0"
                  >
                    <input
                      ref={storyFileInputRef}
                      type="file"
                      accept=".txt,.docx,.pdf,.md"
                      className="hidden"
                      onChange={handleStoryFileUpload}
                    />
                    <button
                      type="button"
                      onClick={() => storyFileInputRef.current?.click()}
                      className="p-2 text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#faf7f2] rounded-xl transition-colors cursor-pointer shrink-0 border border-[#e8ded0] flex items-center justify-center"
                      title="Upload notes, diaries, or vows (.txt, .docx, .pdf)"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      placeholder="Ask Cheers AI to refine story, adjust tone, or upload notes..."
                      value={storyChatInput}
                      onChange={(e) => setStoryChatInput(e.target.value)}
                      className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!storyChatInput.trim()}
                      className="bg-[#15110e] hover:bg-[#251b14] disabled:opacity-40 text-[#dfc194] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                    >
                      <span>Send</span>
                      <span>&rarr;</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Right: Guest View Live Preview */}`;

if (content.includes(storyModalTarget)) {
  content = content.replace(storyModalTarget, storyModalMarkup);
  console.log('✓ Added Cheers AI Story Chatbot Modal');
  fs.writeFileSync('src/components/CoupleView.tsx', content, 'utf8');
} else {
  console.warn('✗ Could not match storyModalTarget');
}
