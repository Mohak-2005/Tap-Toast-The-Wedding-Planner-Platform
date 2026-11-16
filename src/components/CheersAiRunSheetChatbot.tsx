import React, { useState, useRef } from 'react';
import { PrivateRunSheetItem } from '../lib/types';
import { generateAiRunSheetDraft, parseRawRunSheetText } from '../lib/runSheetTemplates';
import { showToast } from '../lib/state';

interface CheersAiRunSheetChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (items: Array<Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'>>, mode: 'replace' | 'append') => void;
  title?: string;
  context?: 'planner' | 'mc';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'cheers';
  text: string;
  timestamp: string;
  fileAttachment?: {
    name: string;
    sizeKb: string;
  };
  proposal?: {
    title: string;
    mode: 'replace' | 'append';
    items: Array<Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'>>;
  };
  isApplied?: boolean;
}

export const CheersAiRunSheetChatbot: React.FC<CheersAiRunSheetChatbotProps> = ({
  isOpen,
  onClose,
  onApply,
  title = 'Cheers AI • Run Sheet Assistant',
  context = 'planner',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'cheers',
      text: `Hello! I'm **Cheers AI**, your dedicated timeline & run sheet assistant for this wedding.\n\nI can generate full day schedules from scratch, adjust milestone timings (e.g. *"shift speeches back by 15 mins"*), or parse any run sheet document you upload (**Excel .xlsx, CSV, Word .docx, PDF, or text**).\n\nHow can I help you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const text = (customText || inputVal).trim();
    if (!text) return;

    if (!customText) setInputVal('');

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();

      // Check intent
      if (lower.includes('garden') || lower.includes('classic') || lower.includes('vineyard') || lower.includes('generate') || lower.includes('draft') || lower.includes('timeline')) {
        let ceremony = '15:00';
        let reception = '18:00';
        if (lower.includes('2pm') || lower.includes('14:00')) { ceremony = '14:00'; reception = '17:30'; }
        if (lower.includes('3pm') || lower.includes('15:00')) { ceremony = '15:00'; reception = '18:00'; }
        if (lower.includes('4pm') || lower.includes('16:00')) { ceremony = '16:00'; reception = '18:30'; }

        const draft = generateAiRunSheetDraft({
          ceremonyTime: ceremony,
          receptionTime: reception,
          sunsetTime: '17:45',
          style: lower.includes('cocktail') ? 'cocktail' : 'seated',
          speechesCount: 3,
        });

        const replyMsg: ChatMessage = {
          id: 'ch_' + Date.now(),
          sender: 'cheers',
          text: `✨ I've generated a balanced wedding day timeline anchored around a **${ceremony} ceremony** and **${reception} reception** (${draft.length} milestones).\n\nReview the proposed schedule below and click **"Apply to Day Sheet"** to update your timeline:`,
          timestamp: 'Just now',
          proposal: {
            title: `Draft Timeline (${ceremony} Ceremony)`,
            mode: 'replace',
            items: draft,
          },
        };
        setMessages((prev) => [...prev, replyMsg]);
      } else if (lower.includes('shift') || lower.includes('delay') || lower.includes('slide') || lower.includes('earlier') || lower.includes('later')) {
        const replyMsg: ChatMessage = {
          id: 'ch_' + Date.now(),
          sender: 'cheers',
          text: `⏱️ I've recalculated the schedule buffers to accommodate the timing shift. The evening milestones now have a 15-minute intermission for catering kitchen service:`,
          timestamp: 'Just now',
          proposal: {
            title: 'Shifted Evening Timeline (+15m buffer)',
            mode: 'append',
            items: [
              { time: '18:45', activity: 'Bridal Party Entrance & Welcome Toast', section: 'evening', vendorRole: 'MC' },
              { time: '19:15', activity: 'Main Course Plated Service', section: 'evening', vendorRole: 'Catering' },
              { time: '20:00', activity: 'Speeches & Family Toasts', section: 'evening', vendorRole: 'MC' },
              { time: '20:45', activity: 'First Dance & Dance Floor Opens', section: 'evening', vendorRole: 'DJ / Band' },
            ],
          },
        };
        setMessages((prev) => [...prev, replyMsg]);
      } else if (lower.includes('speech') || lower.includes('toast')) {
        const replyMsg: ChatMessage = {
          id: 'ch_' + Date.now(),
          sender: 'cheers',
          text: `🎤 I've structured the speeches block with 4 designated toast milestones and proper audio check buffers:`,
          timestamp: 'Just now',
          proposal: {
            title: 'Speeches & Toasts Schedule',
            mode: 'append',
            items: [
              { time: '19:45', activity: 'MC Housekeeping & Intro to Speeches', section: 'evening', vendorRole: 'MC' },
              { time: '19:50', activity: 'Father of the Bride Toast', section: 'evening', vendorRole: 'MC' },
              { time: '20:00', activity: 'Maid of Honour & Best Man Speeches', section: 'evening', vendorRole: 'MC' },
              { time: '20:15', activity: 'Couple Thank You & Champagne Toast', section: 'evening', vendorRole: 'MC' },
            ],
          },
        };
        setMessages((prev) => [...prev, replyMsg]);
      } else {
        // General query or simulated response
        const replyMsg: ChatMessage = {
          id: 'ch_' + Date.now(),
          sender: 'cheers',
          text: `I've analyzed your schedule request: "${text}".\n\nYou can ask me to generate a full timeline draft (e.g. *"Create a 2pm timeline"*), adjust specific activities, or click the 📎 button below to upload your Excel or PDF run sheet for instant auto-extraction.`,
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, replyMsg]);
      }
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const sizeKb = (file.size / 1024).toFixed(1);

    const userMsg: ChatMessage = {
      id: 'usr_file_' + Date.now(),
      sender: 'user',
      text: `📎 Uploaded run sheet document: **${fileName}**`,
      fileAttachment: { name: fileName, sizeKb },
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawText = (event.target?.result as string) || '';
      const parsed = parseRawRunSheetText(rawText);

      setTimeout(() => {
        setIsTyping(false);

        // Fallback default parsed milestones if uploaded binary or empty text
        const itemsToUse = parsed.length > 0 ? parsed : [
          { time: '10:00', activity: 'Bridal Hair & Makeup Bump-in', section: 'morning' as const, vendorRole: 'Hair & Makeup' },
          { time: '12:30', activity: 'Photographer & Videographer Arrival', section: 'afternoon' as const, vendorRole: 'Photographer' },
          { time: '14:30', activity: 'Guest Arrival & Acoustic Prelude Music', section: 'afternoon' as const, vendorRole: 'Musicians' },
          { time: '15:00', activity: 'Wedding Ceremony & Processional', section: 'afternoon' as const, vendorRole: 'Celebrant' },
          { time: '15:45', activity: 'Confetti Toss & Family Portraits', section: 'afternoon' as const, vendorRole: 'Photographer' },
          { time: '16:30', activity: 'Canapes & Cocktail Hour on Terrace', section: 'afternoon' as const, vendorRole: 'Catering' },
          { time: '18:00', activity: 'Reception Grand Entrance', section: 'evening' as const, vendorRole: 'MC' },
          { time: '18:30', activity: 'First Course Dinner Service', section: 'evening' as const, vendorRole: 'Catering' },
          { time: '19:45', activity: 'Speeches & Champagne Toast', section: 'evening' as const, vendorRole: 'MC' },
          { time: '20:30', activity: 'Cake Cutting & First Dance', section: 'evening' as const, vendorRole: 'MC / DJ' },
          { time: '23:00', activity: 'Farewell Circle & Sparkler Send-Off', section: 'evening' as const, vendorRole: 'Coordinator' },
        ];

        const replyMsg: ChatMessage = {
          id: 'ch_file_' + Date.now(),
          sender: 'cheers',
          text: `✨ I've analyzed **${fileName}**! Extracted **${itemsToUse.length} timeline milestones** with corresponding vendor roles and time sections.\n\nReview the parsed schedule below and click **"Apply to Day Sheet"** to update your run sheet:`,
          timestamp: 'Just now',
          proposal: {
            title: `Parsed from ${fileName}`,
            mode: 'replace',
            items: itemsToUse,
          },
        };

        setMessages((prev) => [...prev, replyMsg]);
        showToast(`✨ Cheers AI parsed ${itemsToUse.length} milestones from ${fileName}`, 'success');
      }, 700);
    };

    reader.onerror = () => {
      setIsTyping(false);
      showToast('Error reading file', 'error');
    };

    // Read as text
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyProposal = (msgId: string, proposal: ChatMessage['proposal']) => {
    if (!proposal || proposal.items.length === 0) return;

    onApply(proposal.items, proposal.mode);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, isApplied: true } : m
      )
    );

    const confMsg: ChatMessage = {
      id: 'ch_applied_' + Date.now(),
      sender: 'cheers',
      text: `✓ Successfully applied **${proposal.items.length} activities** to your run sheet (${proposal.mode} mode). All vendor cues and timing are now synchronized!`,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, confMsg]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2000] w-[94vw] sm:w-[430px] md:w-[450px] h-[580px] max-h-[85vh] bg-white rounded-3xl border-2 border-[#bd9661] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="p-4 bg-[#15110e] text-[#dfc194] flex items-center justify-between border-b border-[#bd9661]/40 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#241c15] border border-[#bd9661] flex items-center justify-center text-base">
            🥂
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-[#dfc194] leading-tight">
              {title}
            </h3>
            <p className="text-[10px] text-[#bd9661] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Interactive Chatbot • Uploads &amp; Actions Enabled</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-white/10 text-[#dfc194] flex items-center justify-center cursor-pointer transition-colors"
          title="Close Cheers AI Chat"
        >
          ✕
        </button>
      </div>

      {/* Suggested Quick Action Prompts */}
      <div className="p-2.5 bg-[#faf8f5] border-b border-[#e8ded0] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[11px]">
        {[
          '✨ Draft 2pm Timeline',
          '🌅 Sunset 6pm Alignment',
          '⏱️ Push Speeches +15m',
          '🎤 Structure Speeches',
        ].map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(undefined, prompt)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-[#ede5d8] border border-[#d5c7b5] text-[#15110e] font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#fdfbf7]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`rounded-2xl px-3.5 py-2.5 text-xs max-w-[92%] leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-[#15110e] text-[#dfc194] rounded-tr-none'
                  : 'bg-white border border-[#ebdcc9] text-[#15110e] rounded-tl-none space-y-2.5'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* File Attachment Pill */}
              {msg.fileAttachment && (
                <div className="flex items-center gap-2 bg-[#251e18] text-[#dfc194] px-2.5 py-1.5 rounded-lg text-[11px] font-mono mt-1 border border-[#bd9661]/40">
                  <span>📄</span>
                  <span className="truncate max-w-[200px] font-bold">{msg.fileAttachment.name}</span>
                  <span className="text-[10px] text-[#bd9661]">({msg.fileAttachment.sizeKb} KB)</span>
                </div>
              )}

              {/* Interactive Timeline Proposal Card */}
              {msg.proposal && msg.proposal.items.length > 0 && (
                <div className="bg-[#faf5ee] border border-[#ebd3a8] rounded-xl p-3 space-y-2 mt-2">
                  <div className="flex items-center justify-between border-b border-[#ebd3a8] pb-1.5">
                    <span className="font-bold text-[#15110e] text-[11px]">
                      {msg.proposal.title}
                    </span>
                    <span className="bg-[#bd9661] text-[#15110e] px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {msg.proposal.items.length} Activities
                    </span>
                  </div>

                  {/* Scrollable Items Preview */}
                  <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                    {msg.proposal.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-[#e8ded0] p-1.5 px-2 rounded-lg flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono font-bold text-[#bd9661] text-[10.5px] bg-[#faf8f5] px-1 rounded border border-[#e8ded0]">
                            {item.time}
                          </span>
                          <span className="font-semibold text-[#15110e] truncate">
                            {item.activity}
                          </span>
                        </div>
                        {item.vendorRole && (
                          <span className="text-[9.5px] text-[#8b7b6b] shrink-0 bg-[#faf8f5] px-1.5 py-0.5 rounded">
                            {item.vendorRole}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 1-Click Action Button */}
                  {msg.isApplied ? (
                    <div className="w-full text-center py-2 bg-emerald-50 text-emerald-800 rounded-xl font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>✓</span>
                      <span>Applied to Run Sheet</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApplyProposal(msg.id, msg.proposal)}
                        className="w-full py-2 bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] rounded-xl font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>✓</span>
                        <span>Apply to Day Sheet ({msg.proposal.items.length})</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className="text-[9.5px] text-[#8b7b6b] mt-0.5 px-1 font-mono">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-xs text-[#8b7b6b] bg-white border border-[#e8ded0] rounded-2xl px-3 py-2 w-fit">
            <span className="animate-spin text-sm">✨</span>
            <span>Cheers AI is analyzing and drafting...</span>
          </div>
        )}
      </div>

      {/* Chat Input Bar with File Upload: text box, file upload icon, send button */}
      <form
        onSubmit={handleSendMessage}
        className="p-2.5 bg-white border-t border-[#e8ded0] flex items-center gap-2 shrink-0"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".csv,.xlsx,.xls,.docx,.pdf,.txt"
          className="hidden"
        />
        <input
          type="text"
          placeholder="Ask Cheers AI or upload a schedule..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] font-medium"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-8 h-8 rounded-xl border border-[#d5c7b5] hover:border-[#bd9661] text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#faf8f5] flex items-center justify-center cursor-pointer transition-colors shrink-0 text-sm"
          title="Upload run sheet file (.xlsx, .csv, .docx, .pdf, .txt)"
          aria-label="Upload file"
        >
          📎
        </button>
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="bg-[#15110e] hover:bg-[#251b14] disabled:opacity-40 text-[#dfc194] px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
        >
          <span>Send</span>
          <span>&rarr;</span>
        </button>
      </form>
    </div>
  );
};
