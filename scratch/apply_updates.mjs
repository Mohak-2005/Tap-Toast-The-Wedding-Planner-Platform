import fs from 'fs';

// ----------------------------------------------------------------------
// 1. Update JoeyChatbot.tsx
// ----------------------------------------------------------------------
const joeyPath = 'src/components/JoeyChatbot.tsx';
let joey = fs.readFileSync(joeyPath, 'utf8').replace(/\r\n/g, '\n');

const oldJoeyForm = `          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-[#ebdcc9] flex items-center gap-2"
          >
            {allowFileUpload && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach document or file"
                  className="p-2 text-[#8b7b6b] hover:text-[#bd9661] hover:bg-[#faf5ed] rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
              </>
            )}

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={allowFileUpload ? "Ask Joey or attach wedding files..." : "Ask Joey anything or change diet..."}
              className="flex-1 bg-[#fbf9f6] border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() && !attachedFile}
              className="bg-[#181310] disabled:opacity-40 hover:bg-[#bd9661] hover:text-[#15110e] text-white p-2 rounded-lg transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>`;

const newJoeyForm = `          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-[#ebdcc9] flex items-center gap-2"
          >
            {/* 1. Text box */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={allowFileUpload ? "Ask Joey or attach wedding files..." : "Ask Joey anything or change diet..."}
              className="flex-1 bg-[#fbf9f6] border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
            />

            {/* 2. Attach File Button (to the left of arrow) */}
            {allowFileUpload && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach document or file"
                  className="p-2 text-[#8b7b6b] hover:text-[#bd9661] hover:bg-[#faf5ed] rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
              </>
            )}

            {/* 3. Send Message Arrow */}
            <button
              type="submit"
              disabled={!inputValue.trim() && !attachedFile}
              className="bg-[#181310] disabled:opacity-40 hover:bg-[#bd9661] hover:text-[#15110e] text-white p-2 rounded-lg transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>`;

if (joey.includes(oldJoeyForm)) {
  joey = joey.replace(oldJoeyForm, newJoeyForm);
  fs.writeFileSync(joeyPath, joey, 'utf8');
  console.log('✓ Updated JoeyChatbot.tsx: Text Box -> Attach File -> Send Arrow');
} else {
  console.error('Could not find oldJoeyForm in JoeyChatbot.tsx');
}

// ----------------------------------------------------------------------
// 2. Update McMobileView.tsx
// ----------------------------------------------------------------------
const mobilePath = 'src/components/McMobileView.tsx';
let mobile = fs.readFileSync(mobilePath, 'utf8').replace(/\r\n/g, '\n');

const oldMobileForm = `            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim() && !attachedFile) return;
                handleJoeyPrompt(chatInput, attachedFile);
                setChatInput('');
                setAttachedFile(null);
              }}
              className="p-2.5 bg-white border-t border-[#e8ded0] flex items-center gap-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
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

const newMobileForm = `            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim() && !attachedFile) return;
                handleJoeyPrompt(chatInput, attachedFile);
                setChatInput('');
                setAttachedFile(null);
              }}
              className="p-2.5 bg-white border-t border-[#e8ded0] flex items-center gap-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* 1. Text box */}
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Joey or attach wedding files..."
                className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
              />

              {/* 2. Attach File Button (to the left of arrow) */}
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

              {/* 3. Send Message Arrow */}
              <button
                type="submit"
                disabled={!chatInput.trim() && !attachedFile}
                className="w-8 h-8 rounded-xl bg-[#bd9661] text-[#15110e] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-[#a8824f] disabled:opacity-50 shrink-0"
              >
                ➤
              </button>
            </form>`;

if (mobile.includes(oldMobileForm)) {
  mobile = mobile.replace(oldMobileForm, newMobileForm);
  fs.writeFileSync(mobilePath, mobile, 'utf8');
  console.log('✓ Updated McMobileView.tsx: Text Box -> Attach File -> Send Arrow');
} else {
  console.error('Could not find oldMobileForm in McMobileView.tsx');
}
