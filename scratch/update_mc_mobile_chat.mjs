import fs from 'fs';

const filePath = 'src/components/McMobileView.tsx';
let c = fs.readFileSync(filePath, 'utf8');

// 1. Update chatMessages state to support attachment
const oldChatState = `  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'joey' | 'user';
    text: string;
    time: string;
  }>>([`;

const newChatState = `  const [attachedFile, setAttachedFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile({
      name: file.name,
      size: file.size,
      type: file.type || 'document',
    });
    showToast(\`Attached: \${file.name}\`, 'info');
  };

  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'joey' | 'user';
    text: string;
    time: string;
    attachment?: {
      name: string;
      size: number;
      type: string;
    };
  }>>([`;

c = c.replace(oldChatState, newChatState);

// 2. Update handleJoeyPrompt
const oldHandleJoey = `  const handleJoeyPrompt = (prompt: string) => {
    const userMsg = { id: 'u_' + Date.now(), sender: 'user' as const, text: prompt, time: 'Just now' };
    let replyText = '';

    if (prompt.toLowerCase().includes('dietary')) {
      replyText = \`🍽️ Dietary Alerts (\${vegCount + veganCount + gfCount + nutCount + otherDietCount} special meals):\\n• Vegetarian: \${vegCount}\\n• Vegan: \${veganCount}\\n• Gluten-free: \${gfCount}\\n• Nut Allergies: \${nutCount}\\nCheck the Catering tab for table-by-table drops.\`;
    } else if (prompt.toLowerCase().includes('next cue')) {
      const upcoming = weddingRunSheet.find(c => !c.done);
      replyText = upcoming
        ? \`Next cue on schedule: \${upcoming.time} — \${upcoming.activity}.\`
        : 'All run sheet cues have been completed!';
    } else if (prompt.toLowerCase().includes('head table')) {
      replyText = \`HEAD TABLE has 8 seated VIPs including bride Sophie and groom James.\`;
    } else if (prompt.toLowerCase().includes('venue phone')) {
      replyText = \`\${activeWedding.venue.split(',')[0]} Concierge: (02) 4871 2000. Sarah Lin (Venue Manager): 0412 345 678.\`;
    } else {
      replyText = \`I have updated your console with "\${prompt}". All data is synchronized across mobile and desktop dashboards.\`;
    }

    setChatMessages([...chatMessages, userMsg, {
      id: 'j_' + Date.now(),
      sender: 'joey' as const,
      text: replyText,
      time: 'Just now',
    }]);
  };`;

const newHandleJoey = `  const handleJoeyPrompt = (prompt: string, fileAttachment?: { name: string; size: number; type: string } | null) => {
    const file = fileAttachment !== undefined ? fileAttachment : attachedFile;
    if (file) setAttachedFile(null);

    const userMsg = {
      id: 'u_' + Date.now(),
      sender: 'user' as const,
      text: prompt || (file ? \`Attached file: \${file.name}\` : ''),
      attachment: file || undefined,
      time: 'Just now',
    };
    let replyText = '';

    if (file) {
      replyText = \`📎 Received & analyzed "\${file.name}" (\${(file.size / 1024).toFixed(1)} KB)!\\n\` +
        (prompt.trim() ? \`Regarding: "\${prompt}"\\n\\n\` : '') +
        \`I have parsed and indexed this document into \${activeWedding.couple}'s console. Relevant cues, dietary notes, and stage timeline items are synchronized with your MC console.\`;
    } else if (prompt.toLowerCase().includes('dietary')) {
      replyText = \`🍽️ Dietary Alerts (\${vegCount + veganCount + gfCount + nutCount + otherDietCount} special meals):\\n• Vegetarian: \${vegCount}\\n• Vegan: \${veganCount}\\n• Gluten-free: \${gfCount}\\n• Nut Allergies: \${nutCount}\\nCheck the Catering tab for table-by-table drops.\`;
    } else if (prompt.toLowerCase().includes('next cue')) {
      const upcoming = weddingRunSheet.find(c => !c.done);
      replyText = upcoming
        ? \`Next cue on schedule: \${upcoming.time} — \${upcoming.activity}.\`
        : 'All run sheet cues have been completed!';
    } else if (prompt.toLowerCase().includes('head table')) {
      replyText = \`HEAD TABLE has 8 seated VIPs including bride Sophie and groom James.\`;
    } else if (prompt.toLowerCase().includes('venue phone')) {
      replyText = \`\${activeWedding.venue.split(',')[0]} Concierge: (02) 4871 2000. Sarah Lin (Venue Manager): 0412 345 678.\`;
    } else {
      replyText = \`I have updated your console with "\${prompt}". All data is synchronized across mobile and desktop dashboards.\`;
    }

    setChatMessages(prev => [...prev, userMsg, {
      id: 'j_' + Date.now(),
      sender: 'joey' as const,
      text: replyText,
      time: 'Just now',
    }]);
  };`;

c = c.replace(oldHandleJoey, newHandleJoey);

// 3. Update message list rendering to display attachment
const oldMsgMap = `                  <div
                    className={\`max-w-[85%] p-2.5 rounded-xl shadow-xs leading-relaxed whitespace-pre-line \${
                      msg.sender === 'user'
                        ? 'bg-[#bd9661] text-[#15110e] font-medium'
                        : 'bg-white text-[#15110e] border border-[#e8ded0]'
                    }\`}
                  >
                    {msg.text}
                  </div>`;

const newMsgMap = `                  <div
                    className={\`max-w-[85%] p-2.5 rounded-xl shadow-xs leading-relaxed whitespace-pre-line \${
                      msg.sender === 'user'
                        ? 'bg-[#bd9661] text-[#15110e] font-medium'
                        : 'bg-white text-[#15110e] border border-[#e8ded0]'
                    }\`}
                  >
                    {msg.attachment && (
                      <div className="flex items-center gap-2 mb-1.5 p-2 rounded-lg bg-black/10 border border-black/10 text-left">
                        <span className="text-base">📄</span>
                        <div className="truncate">
                          <div className="font-bold text-[11px] truncate">{msg.attachment.name}</div>
                          <div className="text-[9px] opacity-80">{(msg.attachment.size / 1024).toFixed(1)} KB • Document</div>
                        </div>
                      </div>
                    )}
                    {msg.text}
                  </div>`;

c = c.replace(oldMsgMap, newMsgMap);

// 4. Update the input form to add attachment preview & paperclip button
const oldInputForm = `            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim()) return;
                handleJoeyPrompt(chatInput);
                setChatInput('');
              }}
              className="p-2.5 bg-white border-t border-[#e8ded0] flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Joey about cues, guests, tables..."
                className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-[#bd9661] text-[#15110e] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-[#a8824f]"
              >
                ➤
              </button>
            </form>`;

const newInputForm = `            {/* Attached file preview chip */}
            {attachedFile && (
              <div className="px-3 py-1.5 bg-[#faf5ed] border-t border-[#ebd3a8] flex items-center justify-between text-xs text-[#544332]">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[#bd9661]">📎</span>
                  <span className="font-semibold truncate max-w-[200px]">{attachedFile.name}</span>
                  <span className="text-[10px] text-[#8b7b6b]">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="text-[#8b7b6b] hover:text-red-700 font-bold p-0.5 cursor-pointer ml-2 text-sm"
                  title="Remove attached file"
                >
                  ✕
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim() && !attachedFile) return;
                handleJoeyPrompt(chatInput);
                setChatInput('');
              }}
              className="p-2.5 bg-white border-t border-[#e8ded0] flex items-center gap-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-xl border border-[#e8ded0] bg-[#faf8f5] hover:bg-[#f2ede4] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center cursor-pointer transition-colors shrink-0"
                title="Attach file (Run sheet, seating list, floorplan, catering spec)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Joey or attach wedding files..."
                className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() && !attachedFile}
                className="w-8 h-8 rounded-xl bg-[#bd9661] text-[#15110e] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-[#a8824f] disabled:opacity-50 shrink-0"
              >
                ➤
              </button>
            </form>`;

c = c.replace(oldInputForm, newInputForm);

fs.writeFileSync(filePath, c, 'utf8');
console.log('Updated McMobileView.tsx successfully');
