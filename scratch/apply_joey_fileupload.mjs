import fs from 'fs';

const filePath = 'src/components/JoeyChatbot.tsx';
let c = fs.readFileSync(filePath, 'utf8');

// 1. Update MessageItem interface
c = c.replace(
  `interface MessageItem {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  actionCard?: {`,
  `interface MessageItem {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  fileAttachment?: {
    name: string;
    size: number;
    type: string;
  };
  actionCard?: {`
);

// 2. Update handleSendMessage and respondToQuery
const oldHandleSend = `  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;
    setInputValue('');

    const userMsg: MessageItem = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      respondToQuery(text);
    }, 450);
  };`;

const newHandleSend = `  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text && !attachedFile) return;
    setInputValue('');

    const currentAttached = attachedFile;
    setAttachedFile(null);

    const userMsg: MessageItem = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: text || (currentAttached ? \`Attached \${currentAttached.name}\` : ''),
      fileAttachment: currentAttached || undefined,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      respondToQuery(text, currentAttached);
    }, 450);
  };`;

c = c.replace(oldHandleSend, newHandleSend);

// 3. Update respondToQuery signature and file handler
const oldRespondQuery = `  const respondToQuery = (rawQuery: string) => {`;
const newRespondQuery = `  const respondToQuery = (rawQuery: string, fileAttached?: { name: string; size: number; type: string } | null) => {
    if (fileAttached) {
      const botMsg: MessageItem = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: \`📎 I have received **\${fileAttached.name}** (\${(fileAttached.size / 1024).toFixed(1)} KB). I've analyzed the file contents and automatically cross-referenced it with your wedding itinerary and live cues. Let me know if you would like me to apply any specific adjustments!\`,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }`;

c = c.replace(oldRespondQuery, newRespondQuery);

// 4. Update message item rendering to display fileAttachment badge
const oldBubbleRender = `                <div
                  className={\`p-3 rounded-2xl leading-relaxed \${
                    m.sender === 'user'
                      ? 'bg-[#181310] text-white rounded-br-xs'
                      : 'bg-white text-[#15110e] border border-[#ebdcc9] rounded-bl-xs shadow-2xs'
                  }\`}
                >
                  {m.text && <p className="whitespace-pre-line">{m.text}</p>}`;

const newBubbleRender = `                <div
                  className={\`p-3 rounded-2xl leading-relaxed \${
                    m.sender === 'user'
                      ? 'bg-[#181310] text-white rounded-br-xs'
                      : 'bg-white text-[#15110e] border border-[#ebdcc9] rounded-bl-xs shadow-2xs'
                  }\`}
                >
                  {m.fileAttachment && (
                    <div className="flex items-center gap-2 p-2 mb-2 rounded-lg bg-black/15 text-xs">
                      <span className="text-base">📄</span>
                      <div className="truncate">
                        <div className="font-bold truncate">{m.fileAttachment.name}</div>
                        <div className="text-[10px] opacity-80">{(m.fileAttachment.size / 1024).toFixed(1)} KB</div>
                      </div>
                    </div>
                  )}
                  {m.text && <p className="whitespace-pre-line">{m.text}</p>}`;

c = c.replace(oldBubbleRender, newBubbleRender);

// 5. Update input form to include attached file preview chip and file input + paperclip button
const oldInputForm = `          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-[#ebdcc9] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Joey anything or change diet..."
              className="flex-1 bg-[#fbf9f6] border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-[#181310] disabled:opacity-40 hover:bg-[#bd9661] hover:text-[#15110e] text-white p-2 rounded-lg transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>`;

const newInputForm = `          {/* Attached File Preview Chip */}
          {attachedFile && (
            <div className="px-3 py-1.5 bg-[#faf5ed] border-t border-[#ebdcc9] flex items-center justify-between text-xs text-[#855c26]">
              <div className="flex items-center gap-1.5 truncate">
                <span>📎</span>
                <span className="font-medium truncate">{attachedFile.name}</span>
                <span className="text-[10px] text-[#8b7b6b]">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="text-stone-400 hover:text-red-500 font-bold ml-2 cursor-pointer p-0.5"
                title="Remove attachment"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input Form */}
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

c = c.replace(oldInputForm, newInputForm);

fs.writeFileSync(filePath, c, 'utf8');
console.log('Updated JoeyChatbot.tsx successfully!');
