import React, { useState, useRef, useEffect } from 'react';
import { useAppState, showToast } from '../lib/state';

interface JoeyChatbotProps {
  embeddedInPhone?: boolean;
  context?: string;
  role?: string;
  weddingId?: string;
}

interface MessageItem {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  fileAttachment?: {
    name: string;
    size: number;
    type: string;
  };
  actionCard?: {
    id: string;
    title: string;
    description: string;
    dietaryVal?: string;
    rsvpVal?: 'confirmed' | 'declined';
    status: 'pending' | 'accepted' | 'rejected' | 'correcting';
  };
  time: string;
}

export default function JoeyChatbot({ embeddedInPhone = false, context = 'guest' }: JoeyChatbotProps) {
  const { state, setState } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const allowFileUpload = context === 'couple' || context === 'mc';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile({
      name: file.name,
      size: file.size,
      type: file.type || 'document'
    });
    showToast(`Attached: ${file.name}`, 'info');
  };

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: "Hello! I am **Joey**, your AI wedding assistant.",
      time: "Just now"
    },
    {
      id: 'm2',
      sender: 'bot',
      text: "How may I help you today? You can ask me about parking, your table seating, the ceremony schedule, or request dietary updates.",
      time: "Just now"
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;
    setInputValue('');

    const currentAttached = attachedFile;
    setAttachedFile(null);

    const userMsg: MessageItem = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: text || (currentAttached ? `Attached ${currentAttached.name}` : ''),
      fileAttachment: currentAttached || undefined,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      respondToQuery(text, currentAttached);
    }, 450);
  };

  const respondToQuery = (rawQuery: string, fileAttached?: { name: string; size: number; type: string } | null) => {
    if (fileAttached) {
      const botMsg: MessageItem = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: `📎 I have received **${fileAttached.name}** (${(fileAttached.size / 1024).toFixed(1)} KB). I've analyzed the file contents and automatically cross-referenced it with your wedding itinerary and live cues. Let me know if you would like me to apply any specific adjustments!`,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }
    const q = rawQuery.toLowerCase();
    const guest = state.guests.find(g => g.id === 'johnson_fam' || g.id === 'priya') || state.guests[0];
    const wedding = state.weddings[0];

    // Dietary Change Query
    if (q.includes('diet') || q.includes('vegetarian') || q.includes('vegetarion') || q.includes('vegan') || q.includes('gluten') || q.includes('celiac') || q.includes('dairy') || q.includes('halal') || q.includes('nut')) {
      let targetDiet = 'Vegetarian';
      if (q.includes('vegan')) targetDiet = 'Vegan';
      else if (q.includes('gluten') || q.includes('celiac')) targetDiet = 'Gluten-Free';
      else if (q.includes('dairy')) targetDiet = 'Dairy-Free';
      else if (q.includes('halal')) targetDiet = 'Halal';
      else if (q.includes('nut')) targetDiet = 'Nut Allergy';

      const cardId = 'act_' + Date.now();
      const botMsg: MessageItem = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        actionCard: {
          id: cardId,
          title: `Update Dietary to ${targetDiet}`,
          description: `Would you like me to update the dietary requirement to **${targetDiet}** for **${guest.name}**?`,
          dietaryVal: targetDiet,
          status: 'pending'
        },
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }

    // Seating Table Query
    if (q.includes('table') || q.includes('seat')) {
      const botMsg: MessageItem = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: `You and your party (**${guest.name}**) are warmly seated at **Table 4 (Seats 1 & 2)** in the Grand Pavilion. Would you like me to show the seating floor plan?`,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }

    // Parking Query
    if (q.includes('park') || q.includes('car') || q.includes('drive')) {
      const botMsg: MessageItem = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: `🅿️ **Parking Details**: Complimentary on-site guest parking is available at the Main Lawn entrance of ${wedding.venue} (${wedding.venueAddress}). Directional signs and parking attendants will guide you upon arrival.`,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }

    // Schedule Query
    if (q.includes('schedule') || q.includes('time') || q.includes('program') || q.includes('when')) {
      const botMsg: MessageItem = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: `⏰ **Wedding Day Schedule (${wedding.dateDisplay})**:\n• **1:30 PM**: Guest arrival & prelude music\n• **2:00 PM**: Ceremony processional\n• **2:45 PM**: Cocktail hour & lawn canapés\n• **4:00 PM**: Grand Entrance & Reception banquet\n• **7:15 PM**: First Dance & Cake cutting\n• **10:15 PM**: Sparkler courtyard farewell!`,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }

    // Dress Code Query
    if (q.includes('dress') || q.includes('wear') || q.includes('attire') || q.includes('suit')) {
      const botMsg: MessageItem = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: `👔 **Dress Code**: ${wedding.dressCode}. Formal suits and elegant evening dresses are welcomed. Southern Highlands evenings can be crisp, so a light jacket or shawl is recommended for the outdoor terrace!`,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }

    // General fallback
    const botMsg: MessageItem = {
      id: 'bot_' + Date.now(),
      sender: 'bot',
      text: `I'm here to ensure you have a flawless wedding experience with Sophie & James! You can ask me to update your dietary, check your table number, get parking directions, or review the day-of timeline.`,
      time: 'Just now'
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const handleActionDecision = (cardId: string, decision: 'accept' | 'reject' | 'correct', dietaryVal?: string) => {
    setMessages(prev => prev.map(m => {
      if (m.actionCard && m.actionCard.id === cardId) {
        return {
          ...m,
          actionCard: {
            ...m.actionCard,
            status: decision === 'accept' ? 'accepted' : decision === 'reject' ? 'rejected' : 'correcting'
          }
        };
      }
      return m;
    }));

    if (decision === 'accept' && dietaryVal) {
      // Update in global state
      const updatedGuests = state.guests.map(g => {
        if (g.id === 'johnson_fam' || g.id === 'priya') {
          return { ...g, dietary: dietaryVal };
        }
        return g;
      });
      const newAudit: any = {
        id: 'aud_' + Date.now(),
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        action: 'Dietary Updated via Joey',
        user: 'Mark & Sarah Johnson',
        role: 'guest',
        details: `Updated dietary to ${dietaryVal}`,
        category: 'RSVP'
      };
      setState({
        ...state,
        guests: updatedGuests,
        auditLog: [newAudit, ...(state.auditLog || [])]
      });
      showToast(`✓ Dietary updated to ${dietaryVal}`, 'success');

      // Bot follow-up message
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'bot_conf_' + Date.now(),
            sender: 'bot',
            text: `Wonderful! I have updated your dietary preference to **${dietaryVal}** in the catering manifest for Executive Chef Marco Rossi.`,
            time: 'Just now'
          }
        ]);
      }, 300);
    } else if (decision === 'reject') {
      showToast('Dietary change cancelled', 'info');
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'bot_rej_' + Date.now(),
            sender: 'bot',
            text: `Understood! I cancelled that change. Your current dietary settings remain untouched.`,
            time: 'Just now'
          }
        ]);
      }, 300);
    } else {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'bot_corr_' + Date.now(),
            sender: 'bot',
            text: `Sure thing! What would you like to set your dietary requirement to? Just type it below.`,
            time: 'Just now'
          }
        ]);
      }, 300);
    }
  };

  const chips = [
    { label: '🥗 Vegetarian', q: 'Change my diet to vegetarian' },
    { label: '🌾 Gluten-Free', q: 'Change my diet to gluten-free' },
    { label: '🪑 My Table', q: 'Where is my table seated?' },
    { label: '⏰ Schedule', q: 'What is the reception schedule?' },
    { label: '🅿️ Parking', q: 'Where can I park my car?' },
    { label: '👔 Dress Code', q: 'What is the dress code?' },
  ];

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Joey · Wedding Assistant"
        title="Chat with Joey"
        className={
          embeddedInPhone
            ? "absolute bottom-[74px] right-[14px] w-12 h-12 rounded-full bg-[#dfc194] border-2 border-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-[120] overflow-hidden p-0"
            : "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#dfc194] border-2 border-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform z-[990] overflow-hidden p-0"
        }
      >
        <img src="/chatbot-avatar.png" alt="Joey AI" className="w-full h-full object-cover" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={
            embeddedInPhone
              ? "absolute inset-x-0 bottom-0 top-11 bg-white flex flex-col z-[150] rounded-b-[36px] shadow-2xl overflow-hidden border-t border-[#bd9661]"
              : "fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-32px)] h-[540px] max-h-[calc(100vh-120px)] bg-white flex flex-col z-[999] rounded-xl shadow-2xl overflow-hidden border border-[#d5c7b5]"
          }
        >
          {/* Header */}
          <div className="bg-[#181310] text-white p-3.5 flex items-center justify-between border-b border-[#382c20]">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#bd9661] flex items-center justify-center">
                  <img src="/chatbot-avatar.png" alt="Joey AI" className="w-full h-full object-cover" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#181310]" />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold leading-tight text-[#dfc194]">Joey</h3>
                <p className="text-[11px] text-[#a8988a]">AI Wedding Assistant · Online</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded text-[#c9b8a6] hover:text-white hover:bg-[#2b221a] flex items-center justify-center text-sm"
              aria-label="Close Joey"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#fdfbf7] text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-[#181310] text-[#f7f3ee] rounded-br-xs'
                      : 'bg-white text-[#15110e] border border-[#ebdcc9] rounded-bl-xs'
                  }`}
                >
                  {m.text && (
                    <div className="whitespace-pre-line text-[13px]">
                      {m.text.split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i} className="text-[#bd9661]">{part}</strong> : part
                      )}
                    </div>
                  )}

                  {m.actionCard && (
                    <div className="mt-1 pt-1 text-left">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#916c3d] mb-1 flex items-center gap-1">
                        <span>⚡</span> Action Confirmation
                      </div>
                      <div className="text-[12.5px] font-semibold text-[#15110e] mb-1">
                        {m.actionCard.title}
                      </div>
                      <p className="text-[12px] text-[#6b5b4e] mb-2.5">
                        {m.actionCard.description}
                      </p>

                      {m.actionCard.status === 'pending' && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleActionDecision(m.actionCard!.id, 'accept', m.actionCard!.dietaryVal)}
                            className="bg-[#2e6d3c] hover:bg-[#22522c] text-white text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
                          >
                            ✓ Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActionDecision(m.actionCard!.id, 'reject')}
                            className="bg-white hover:bg-red-50 text-[#a8382c] border border-[#e8a39c] text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
                          >
                            ✕ Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActionDecision(m.actionCard!.id, 'correct')}
                            className="bg-[#f0ebe3] hover:bg-[#e4dcce] text-[#6d5538] text-[11px] font-semibold px-2.5 py-1 rounded transition-colors"
                          >
                            ✎ Correct
                          </button>
                        </div>
                      )}

                      {m.actionCard.status === 'accepted' && (
                        <div className="inline-flex items-center gap-1 bg-[#e8eee4] text-[#3c6a42] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#c4dbc1]">
                          <span>✓</span> Request Accepted &amp; Saved
                        </div>
                      )}

                      {m.actionCard.status === 'rejected' && (
                        <div className="inline-flex items-center gap-1 bg-[#fbeae8] text-[#a8382c] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#f3c2be]">
                          <span>✕</span> Action Declined
                        </div>
                      )}

                      {m.actionCard.status === 'correcting' && (
                        <div className="inline-flex items-center gap-1 bg-[#fef7e0] text-[#b06000] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#fedfc8]">
                          <span>✎</span> Ready for new input
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#a69888] mt-0.5 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-[#8b7b6b] bg-white border border-[#ebdcc9] w-fit px-3 py-2 rounded-2xl">
                <span className="animate-pulse">Joey is typing</span>
                <span className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-[#bd9661] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#bd9661] rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 bg-[#bd9661] rounded-full animate-bounce [animation-delay:0.3s]" />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-[#f4efe8] border-t border-[#ebdcc9] flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.q)}
                className="bg-white hover:bg-[#fff9f0] border border-[#d5c7b5] hover:border-[#bd9661] text-[#6b5847] hover:text-[#15110e] text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Attached File Preview Chip */}
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
          </form>
        </div>
      )}
    </>
  );
}
