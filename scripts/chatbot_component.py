# Chatbot Concierge Component for Tap & Toast ("Joey" Wedding Assistant)

def get_chatbot_html():
    return """
<!-- Floating Joey Wedding Assistant Button -->
<button type="button" id="tt-chat-btn" class="tt-chat-btn" aria-label="Open Joey · Wedding Assistant" title="Chat with Joey">
  <span class="joey-btn-avatar">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="#1c1612" stroke="#bd9661" stroke-width="1.6"/>
      <rect x="7" y="7" width="14" height="10" rx="3.5" fill="#bd9661"/>
      <circle cx="10.5" cy="11.5" r="1.3" fill="#1c1612"/>
      <circle cx="17.5" cy="11.5" r="1.3" fill="#1c1612"/>
      <path d="M14 3.5V7" stroke="#dfc194" stroke-width="1.6" stroke-linecap="round"/>
      <polygon points="14,1.8 15.2,3.8 12.8,3.8" fill="#dfc194"/>
      <path d="M12 14.2C12.8 15 15.2 15 16 14.2" stroke="#1c1612" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M10 20L14 21.2L18 20L15.8 22.8L14 21.2L12.2 22.8Z" fill="#dfc194"/>
      <circle cx="14" cy="21.2" r="1" fill="#1c1612"/>
    </svg>
  </span>
</button>

<div id="tt-chat-panel" class="tt-chat-panel" style="display: none;" aria-hidden="true">
  <div class="tt-chat-header">
    <div style="display:flex;align-items:center;gap:12px;">
      <div class="joey-avatar-wrap">
        <svg width="34" height="34" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" fill="#1c1612" stroke="#bd9661" stroke-width="1.6"/>
          <rect x="7" y="7" width="14" height="10" rx="3.5" fill="#bd9661"/>
          <circle cx="10.5" cy="11.5" r="1.3" fill="#1c1612"/>
          <circle cx="17.5" cy="11.5" r="1.3" fill="#1c1612"/>
          <path d="M14 3.5V7" stroke="#dfc194" stroke-width="1.6" stroke-linecap="round"/>
          <polygon points="14,1.8 15.2,3.8 12.8,3.8" fill="#dfc194"/>
          <path d="M12 14.2C12.8 15 15.2 15 16 14.2" stroke="#1c1612" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M10 20L14 21.2L18 20L15.8 22.8L14 21.2L12.2 22.8Z" fill="#dfc194"/>
          <circle cx="14" cy="21.2" r="1" fill="#1c1612"/>
        </svg>
        <span class="joey-status-dot" title="Joey is online"></span>
      </div>
      <div class="tt-chat-header-info">
        <h3 class="tt-chat-title">Joey</h3>
        <div class="tt-chat-subtitle">The Wedding Assistant</div>
      </div>
    </div>
    <button type="button" id="tt-chat-close" class="tt-chat-close" aria-label="Close Joey">✕</button>
  </div>
  
  <div class="tt-chat-body" id="tt-chat-body">
    <!-- Message 1 -->
    <div class="tt-chat-msg tt-chat-msg-bot">
      <div class="tt-chat-bubble">
        Hello, I am <strong>Joey</strong>, your wedding assistant.
      </div>
      <div class="tt-chat-time">Just now</div>
    </div>
    <!-- Message 2 -->
    <div class="tt-chat-msg tt-chat-msg-bot">
      <div class="tt-chat-bubble">
        How may I help you?
      </div>
      <div class="tt-chat-time">Just now</div>
    </div>
    <div class="tt-chat-typing" id="tt-chat-typing" style="display:none;">
      <span></span><span></span><span></span>
    </div>
  </div>
  
  <div class="tt-chat-chips">
    <button type="button" class="tt-chat-chip" onclick="handleChipClick('Change my diet to vegetarian')">Change diet to vegetarian</button>
    <button type="button" class="tt-chat-chip" onclick="handleChipClick('Joyfully Accept')">Accept RSVP</button>
    <button type="button" class="tt-chat-chip" onclick="handleChipClick('I regretfully decline')">Decline RSVP</button>
    <button type="button" class="tt-chat-chip" onclick="handleChipClick('Where is my table?')">My Table</button>
    <button type="button" class="tt-chat-chip" onclick="handleChipClick('What is the ceremony schedule?')">Schedule</button>
    <button type="button" class="tt-chat-chip" onclick="handleChipClick('Where can I park?')">Parking</button>
    <button type="button" class="tt-chat-chip" onclick="handleChipClick('What should I wear?')">Dress Code</button>
  </div>
  
  <form class="tt-chat-input-row" id="tt-chat-form" onsubmit="handleChatSubmit(event)">
    <input type="text" id="tt-chat-input" class="tt-chat-input" placeholder="Ask Joey anything or request a change..." autocomplete="off">
    <button type="submit" class="tt-chat-send" aria-label="Send message to Joey">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </button>
  </form>
</div>
"""

def get_chatbot_css():
    return """
/* Joey Chatbot Styles */
.tt-chat-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--gold);
  color: var(--ink);
  display: grid;
  place-items: center;
  box-shadow: 0 10px 28px rgba(189, 150, 97, 0.45);
  z-index: 1500;
  border: 2px solid #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.tt-chat-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 14px 34px rgba(189, 150, 97, 0.55);
}

.joey-btn-avatar {
  display: grid;
  place-items: center;
}

.tt-chat-panel {
  position: fixed;
  bottom: 92px;
  right: 24px;
  width: min(390px, calc(100vw - 32px));
  height: 550px;
  max-height: calc(100vh - 120px);
  background: var(--cream);
  border: 1px solid var(--line-strong);
  border-radius: 14px;
  box-shadow: 0 18px 45px rgba(21, 17, 14, 0.25);
  display: flex;
  flex-direction: column;
  z-index: 1500;
  overflow: hidden;
  animation: ttChatSlide 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes ttChatSlide {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.tt-chat-header {
  background: #17120f;
  color: #ffffff;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--gold);
}

.joey-avatar-wrap {
  position: relative;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
}

.joey-status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #34d399;
  border: 1.5px solid #17120f;
}

.tt-chat-header-badge {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--gold);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.tt-chat-title {
  font-family: var(--font-heading);
  font-size: 19px;
  color: #ffffff;
  line-height: 1.1;
  margin: 0;
}

.tt-chat-subtitle {
  font-size: 11.5px;
  color: #ad9b88;
  margin-top: 2px;
}

.tt-chat-close {
  color: #cbb9a7;
  font-size: 18px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tt-chat-close:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}

.tt-chat-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fbf9f5;
}

.tt-chat-msg {
  display: flex;
  flex-direction: column;
  max-width: 86%;
}

.tt-chat-msg-bot {
  align-self: flex-start;
}

.tt-chat-msg-user {
  align-self: flex-end;
}

.tt-chat-bubble {
  padding: 11px 15px;
  font-size: 13.5px;
  line-height: 1.45;
}

.tt-chat-msg-bot .tt-chat-bubble {
  background: #ffffff;
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: 12px 12px 12px 2px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
}

.tt-chat-msg-user .tt-chat-bubble {
  background: var(--gold);
  color: var(--ink);
  font-weight: 500;
  border-radius: 12px 12px 2px 12px;
  box-shadow: 0 2px 8px rgba(189, 150, 97, 0.25);
}

.tt-chat-time {
  font-size: 10.5px;
  color: var(--muted);
  margin-top: 4px;
  padding: 0 4px;
}

.tt-chat-msg-user .tt-chat-time {
  align-self: flex-end;
}

.tt-chat-typing {
  align-self: flex-start;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 12px 12px 12px 2px;
  padding: 10px 14px;
  display: flex;
  gap: 5px;
  align-items: center;
}

.tt-chat-typing span {
  width: 6px;
  height: 6px;
  background: var(--gold);
  border-radius: 50%;
  animation: ttTyping 1.2s infinite ease-in-out;
}

.tt-chat-typing span:nth-child(2) { animation-delay: 0.2s; }
.tt-chat-typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes ttTyping {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1.1); opacity: 1; }
}

.tt-chat-chips {
  padding: 8px 14px;
  display: flex;
  gap: 6px;
  overflow-x: auto;
  background: #f4ede2;
  border-top: 1px solid var(--line);
  scrollbar-width: none;
}

.tt-chat-chips::-webkit-scrollbar { display: none; }

.tt-chat-chip {
  background: #ffffff;
  color: var(--ink);
  border: 1px solid #dfd3c3;
  padding: 5px 11px;
  border-radius: 14px;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.15s ease;
  cursor: pointer;
}

.tt-chat-chip:hover {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--ink);
}

.tt-chat-input-row {
  display: flex;
  padding: 10px 14px;
  background: #ffffff;
  border-top: 1px solid var(--line);
  gap: 8px;
}

.tt-chat-input {
  flex: 1;
  border: 1px solid var(--line-strong);
  border-radius: 20px;
  padding: 9px 15px;
  font-size: 13px;
  background: var(--cream);
  outline: none;
}

.tt-chat-input:focus {
  border-color: var(--gold);
  background: #ffffff;
}

.tt-chat-send {
  background: var(--gold);
  color: var(--ink);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: grid;
  place-items: center;
  transition: all 0.15s ease;
  cursor: pointer;
}

.tt-chat-send:hover {
  background: var(--gold-hover);
  color: #fff;
}

/* Joey Action Confirmation Card */
.joey-confirm-box {
  background: #ffffff;
  border: 1.5px solid var(--gold);
  border-radius: 8px;
  padding: 12px 14px;
  margin-top: 4px;
  box-shadow: 0 2px 10px rgba(189, 150, 97, 0.12);
}

.joey-confirm-badge {
  font-size: 9px;
  letter-spacing: 1.5px;
  font-weight: 700;
  color: var(--gold-hover);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.joey-confirm-title {
  font-family: var(--font-heading);
  font-size: 15px;
  color: #17120f;
  margin-bottom: 4px;
  font-weight: 700;
}

.joey-confirm-desc {
  font-size: 12px;
  color: #69594b;
  margin-bottom: 10px;
  line-height: 1.4;
}

.joey-confirm-btns {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-confirm-accept {
  background: #235c36;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: background 0.15s;
}

.btn-confirm-accept:hover {
  background: #194427;
}

.btn-confirm-reject {
  background: #ffffff;
  color: #992b2b;
  border: 1px solid #d99a9a;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;
}

.btn-confirm-reject:hover {
  background: #fdf2f2;
  border-color: #992b2b;
}

.btn-confirm-correct {
  background: #f5efe6;
  color: #6d5538;
  border: 1px solid #dcd1c2;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;
}

.btn-confirm-correct:hover {
  background: #ebdcc9;
  color: #15110e;
}

.joey-confirm-status {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.joey-confirm-status.status-accepted {
  background: #e6f4ea;
  color: #137333;
  border: 1px solid #a8dab5;
}

.joey-confirm-status.status-rejected {
  background: #fce8e6;
  color: #c5221f;
  border: 1px solid #f5b7b1;
}

.joey-confirm-status.status-correct {
  background: #fef7e0;
  color: #b06000;
  border: 1px solid #fedfc8;
}
"""

def get_chatbot_js():
    return """
/* Joey Chatbot Application Logic */
window.pendingJoeyActions = window.pendingJoeyActions || {};

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('tt-chat-btn');
  const panel = document.getElementById('tt-chat-panel');
  const closeBtn = document.getElementById('tt-chat-close');
  
  if (btn && panel) {
    btn.addEventListener('click', () => {
      const isVisible = panel.style.display !== 'none';
      panel.style.display = isVisible ? 'none' : 'flex';
      panel.setAttribute('aria-hidden', isVisible ? 'true' : 'false');
      if (!isVisible) {
        document.getElementById('tt-chat-input')?.focus();
      }
    });
  }
  
  if (closeBtn && panel) {
    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none';
      panel.setAttribute('aria-hidden', 'true');
    });
  }
});

function toggleChatbot() {
  const panel = document.getElementById('tt-chat-panel');
  if (!panel) return;
  const isVisible = panel.style.display !== 'none';
  panel.style.display = isVisible ? 'none' : 'flex';
  panel.setAttribute('aria-hidden', isVisible ? 'true' : 'false');
  if (!isVisible) {
    document.getElementById('tt-chat-input')?.focus();
  }
}

function handleChipClick(chipText) {
  sendUserMessage(chipText);
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('tt-chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendUserMessage(text);
}

function sendUserMessage(text) {
  const body = document.getElementById('tt-chat-body');
  if (!body) return;
  
  // Append user bubble
  const userMsg = document.createElement('div');
  userMsg.className = 'tt-chat-msg tt-chat-msg-user';
  userMsg.innerHTML = `
    <div class="tt-chat-bubble">${escapeHtml(text)}</div>
    <div class="tt-chat-time">Just now</div>
  `;
  body.appendChild(userMsg);
  
  // Show typing indicator
  const typing = document.getElementById('tt-chat-typing');
  if (typing) {
    body.appendChild(typing);
    typing.style.display = 'flex';
  }
  body.scrollTop = body.scrollHeight;
  
  setTimeout(() => {
    if (typing) typing.style.display = 'none';
    const answer = generateBotResponse(text);
    const botMsg = document.createElement('div');
    botMsg.className = 'tt-chat-msg tt-chat-msg-bot';
    botMsg.innerHTML = `
      <div class="tt-chat-bubble">${answer}</div>
      <div class="tt-chat-time">Just now</div>
    `;
    body.appendChild(botMsg);
    body.scrollTop = body.scrollHeight;
  }, 400);
}

function executeJoeyAction(actionId, decision) {
  const action = window.pendingJoeyActions[actionId];
  const btnsContainer = document.getElementById('confirm-btns-' + actionId);
  const body = document.getElementById('tt-chat-body');
  
  if (decision === 'accept') {
    if (btnsContainer) {
      btnsContainer.innerHTML = '<span class="joey-confirm-status status-accepted"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Accepted</span>';
    }
    let followUpText = "Confirmed! I have processed and accepted your request. The changes have been saved.";
    if (action && typeof action.onAccept === 'function') {
      followUpText = action.onAccept();
    }
    
    // Joey follow-up bubble
    setTimeout(() => {
      if (body) {
        const botMsg = document.createElement('div');
        botMsg.className = 'tt-chat-msg tt-chat-msg-bot';
        botMsg.innerHTML = `
          <div class="tt-chat-bubble">${followUpText}</div>
          <div class="tt-chat-time">Just now</div>
        `;
        body.appendChild(botMsg);
        body.scrollTop = body.scrollHeight;
      }
    }, 250);
  } else if (decision === 'reject') {
    if (btnsContainer) {
      btnsContainer.innerHTML = '<span class="joey-confirm-status status-rejected"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Rejected</span>';
    }
    let followUpText = "Understood. The request has been rejected and cancelled. No changes were made.";
    if (action && typeof action.onReject === 'function') {
      followUpText = action.onReject();
    }
    
    setTimeout(() => {
      if (body) {
        const botMsg = document.createElement('div');
        botMsg.className = 'tt-chat-msg tt-chat-msg-bot';
        botMsg.innerHTML = `
          <div class="tt-chat-bubble">${followUpText}</div>
          <div class="tt-chat-time">Just now</div>
        `;
        body.appendChild(botMsg);
        body.scrollTop = body.scrollHeight;
      }
    }, 250);
  } else if (decision === 'correct') {
    if (btnsContainer) {
      btnsContainer.innerHTML = '<span class="joey-confirm-status status-correct"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Correcting</span>';
    }
    let followUpText = "Sure! What would you like to correct it to? Please type your updated details below:";
    if (action && typeof action.onCorrect === 'function') {
      followUpText = action.onCorrect();
    }
    
    setTimeout(() => {
      if (body) {
        const botMsg = document.createElement('div');
        botMsg.className = 'tt-chat-msg tt-chat-msg-bot';
        botMsg.innerHTML = `
          <div class="tt-chat-bubble">${followUpText}</div>
          <div class="tt-chat-time">Just now</div>
        `;
        body.appendChild(botMsg);
        body.scrollTop = body.scrollHeight;
        document.getElementById('tt-chat-input')?.focus();
      }
    }, 250);
  }
}

function generateBotResponse(input) {
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === state.currentWeddingId) || state.weddings[0];
  const urlParams = new URLSearchParams(window.location.search);
  const guestId = urlParams.get('g') || 'priya';
  const currentGuest = (state.guests && state.guests.find(g => g.id === guestId)) || (state.guests && state.guests[0]) || { id: 'priya', name: 'Priya Sharma', guestCount: 1, dietary: 'Vegetarian' };
  const guestName = currentGuest.name || 'Priya Sharma';
  const firstName = guestName.split(' ')[0];
  const q = (input || '').toLowerCase().trim();

  // 1. Dietary Change Request -> Confirmation Box with Accept, Reject, Correct
  if (q.includes('diet') || q.includes('vegetarian') || q.includes('vegetarion') || q.includes('vegan') || q.includes('gluten') || q.includes('celiac') || q.includes('dairy') || q.includes('halal') || q.includes('allerg')) {
    let targetDiet = 'Vegetarian';
    let confirmTitle = 'Changing diet to vegetarian';
    if (q.includes('vegan')) {
      targetDiet = 'Vegan';
      confirmTitle = 'Changing diet to vegan';
    } else if (q.includes('gluten') || q.includes('celiac')) {
      targetDiet = 'Gluten-Free';
      confirmTitle = 'Changing diet to gluten-free';
    } else if (q.includes('dairy')) {
      targetDiet = 'Dairy-Free';
      confirmTitle = 'Changing diet to dairy-free';
    } else if (q.includes('halal')) {
      targetDiet = 'Halal';
      confirmTitle = 'Changing diet to halal';
    } else if (q.includes('nut')) {
      targetDiet = 'Nut Allergy';
      confirmTitle = 'Changing diet to nut allergy';
    }

    const actionId = 'act_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    window.pendingJoeyActions[actionId] = {
      type: 'diet',
      val: targetDiet,
      onAccept: () => {
        currentGuest.dietary = targetDiet;
        saveState(state);
        const rsvpField = document.getElementById('rsvp-dietary') || document.getElementById('web-rsvp-dietary');
        if (rsvpField) rsvpField.value = targetDiet;
        logAudit('Dietary Updated via Joey: ' + guestName, guestName, 'Updated dietary to ' + targetDiet, 'RSVP');
        showToast(`Dietary updated: ${targetDiet}`, 'success');
        window.dispatchEvent(new CustomEvent('tt_state_changed', { detail: state }));
        return `Confirmed! Your dietary requirement has been updated to <strong>${escapeHtml(targetDiet)}</strong> for Sophie &amp; James's reception. The catering chef has been notified.`;
      },
      onReject: () => {
        return `Understood, ${escapeHtml(firstName)}. The request to change diet was rejected and cancelled. Your existing settings remain intact.`;
      },
      onCorrect: () => {
        return `What would you like to correct your dietary preference to? Please type your preferred meal requirements below (e.g., 'Vegan', 'Pescatarian', or 'Nut Allergy'):`;
      }
    };

    return `
      <div>I've prepared that change for you:</div>
      <div class="joey-confirm-box" id="confirm-box-${actionId}">
        <div class="joey-confirm-badge">ACTION CONFIRMATION</div>
        <div class="joey-confirm-title">${confirmTitle}</div>
        <div class="joey-confirm-desc">Update guest dietary requirement to <strong>${escapeHtml(targetDiet)}</strong> for ${escapeHtml(guestName)}?</div>
        <div class="joey-confirm-btns" id="confirm-btns-${actionId}">
          <button type="button" class="btn-confirm-accept" onclick="executeJoeyAction('${actionId}', 'accept')">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Accept
          </button>
          <button type="button" class="btn-confirm-reject" onclick="executeJoeyAction('${actionId}', 'reject')">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Reject
          </button>
          <button type="button" class="btn-confirm-correct" onclick="executeJoeyAction('${actionId}', 'correct')">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Correct
          </button>
        </div>
      </div>
    `;
  }

  // 2. Explicit Accept RSVP
  if (q.includes('accept') || q === 'yes' || q.includes('joyfully') || q.includes('attending') || q.includes('confirm') || q.includes('will come') || q.includes('can come')) {
    currentGuest.rsvpStatus = 'confirmed';
    if (!currentGuest.guestCount || currentGuest.guestCount < 1) currentGuest.guestCount = 1;
    saveState(state);
    logAudit('RSVP Accepted via Concierge: ' + guestName, guestName, 'Confirmed attendance for ' + wedding.couple, 'RSVP');
    showToast('RSVP Confirmed: Joyfully Accepted!', 'success');
    window.dispatchEvent(new CustomEvent('tt_state_changed', { detail: state }));

    const tableName = currentGuest.tableId ? (state.tables.find(t => t.id === currentGuest.tableId)?.name || 'Table 4') : 'Table 4 (Seated)';
    return `🎉 <strong>Wonderful news, ${escapeHtml(firstName)}!</strong><br><br>Your RSVP has been recorded as <strong>Joyfully Accepted</strong> for <strong>${currentGuest.guestCount || 1} guest(s)</strong>.<br><br>Sophie &amp; James are overjoyed that you will be celebrating with them at Fernwood Estate!<br><br>• <strong>Date:</strong> ${escapeHtml(wedding.dateDisplay)}, ${escapeHtml(wedding.timeDisplay)}<br>• <strong>Allocated Table:</strong> ${escapeHtml(tableName)}<br>• <strong>Dietary:</strong> ${escapeHtml(currentGuest.dietary || 'Vegetarian')}<br><br><div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;"><button type="button" class="btn btn-outline btn-xs" style="border:1px solid #bd9661;color:#15110e;padding:4px 10px;border-radius:12px;font-size:11px;" onclick="handleChipClick('Where is my table?')">Check My Table</button><button type="button" class="btn btn-outline btn-xs" style="border:1px solid #bd9661;color:#15110e;padding:4px 10px;border-radius:12px;font-size:11px;" onclick="handleChipClick('What is the ceremony schedule?')">View Schedule</button></div>`;
  }

  // 3. Explicit Reject / Decline RSVP
  if (q.includes('reject') || q.includes('decline') || q === 'no' || q.includes('cannot') || q.includes("can't") || q.includes('regret') || q.includes('unable') || q.includes('not coming')) {
    currentGuest.rsvpStatus = 'declined';
    saveState(state);
    logAudit('RSVP Declined via Concierge: ' + guestName, guestName, 'Declined attendance for ' + wedding.couple, 'RSVP');
    showToast('RSVP Recorded: Regretfully Declined', 'info');
    window.dispatchEvent(new CustomEvent('tt_state_changed', { detail: state }));

    return `💌 <strong>Thank you for letting us know, ${escapeHtml(firstName)}.</strong><br><br>Your RSVP has been recorded as <strong>Regretfully Declined</strong>. Sophie &amp; James will deeply miss celebrating with you, but send their warmest love!<br><br>You can still send a love note or digital blessing through Gift &amp; Go.<br><br><div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;"><button type="button" class="btn btn-outline btn-xs" style="border:1px solid #bd9661;color:#15110e;padding:4px 10px;border-radius:12px;font-size:11px;" onclick="handleChipClick('Joyfully Accept')">Changed Mind? Accept</button></div>`;
  }

  // 3.5 General RSVP status inquiry ("am I coming", "status", etc.)
  if (q.includes('rsvp') || q.includes('status') || q.includes('am i coming') || q.includes('attending?')) {
    if (currentGuest.rsvpStatus === 'confirmed') {
      return `Hi ${escapeHtml(firstName)}! Your RSVP is currently recorded as <strong>Joyfully Accepted</strong> for <strong>${currentGuest.guestCount || 1} guest(s)</strong>.<br>Dietary requirements: <em>${escapeHtml(currentGuest.dietary || 'None specified')}</em>.<br><br><div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;"><button type="button" class="btn btn-outline btn-xs" style="border:1px solid #bd9661;color:#15110e;padding:4px 10px;border-radius:12px;font-size:11px;" onclick="handleChipClick('I regretfully decline')">Change to Decline</button></div>`;
    } else if (currentGuest.rsvpStatus === 'declined') {
      return `Hi ${escapeHtml(firstName)}! Your RSVP is currently recorded as <strong>Regretfully Declined</strong>. We'll miss you!<br><br><div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;"><button type="button" class="btn btn-outline btn-xs" style="border:1px solid #bd9661;color:#15110e;padding:4px 10px;border-radius:12px;font-size:11px;" onclick="handleChipClick('Joyfully Accept')">Accept Instead</button></div>`;
    } else {
      return `Hi ${escapeHtml(firstName)}! Your RSVP is currently <strong>Awaiting Response</strong>.<br><br>Would you like to accept or decline now?<br><div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;"><button type="button" class="btn btn-outline btn-xs" style="border:1px solid #bd9661;color:#15110e;padding:4px 10px;border-radius:12px;font-size:11px;" onclick="handleChipClick('Joyfully Accept')">Joyfully Accept</button><button type="button" class="btn btn-outline btn-xs" style="border:1px solid #bd9661;color:#15110e;padding:4px 10px;border-radius:12px;font-size:11px;" onclick="handleChipClick('I regretfully decline')">Regretfully Decline</button></div>`;
    }
  }

  // 4. Seating / Table changes
  if (q.includes('seat ') || q.includes('move to table') || q.includes('change table') || q.includes('assign to table')) {
    const actionId = 'act_' + Date.now();
    window.pendingJoeyActions[actionId] = {
      type: 'seating',
      onAccept: () => {
        logAudit('Seating Updated via Joey: ' + guestName, 'Joey Assistant', 'Seating allocation updated', 'Seating');
        showToast('Seating allocation updated', 'success');
        window.dispatchEvent(new CustomEvent('tt_state_changed', { detail: state }));
        return `Done! Seating allocation has been updated in the master floor plan.`;
      },
      onReject: () => `Seating change cancelled. Current arrangement kept.`,
      onCorrect: () => `Please specify which table name or seat number you would prefer:`
    };
    return `
      <div>I can help update that seating assignment:</div>
      <div class="joey-confirm-box" id="confirm-box-${actionId}">
        <div class="joey-confirm-badge">ACTION CONFIRMATION</div>
        <div class="joey-confirm-title">Changing seating allocation</div>
        <div class="joey-confirm-desc">Update table placement for <strong>${escapeHtml(guestName)}</strong>?</div>
        <div class="joey-confirm-btns" id="confirm-btns-${actionId}">
          <button type="button" class="btn-confirm-accept" onclick="executeJoeyAction('${actionId}', 'accept')">Accept</button>
          <button type="button" class="btn-confirm-reject" onclick="executeJoeyAction('${actionId}', 'reject')">Reject</button>
          <button type="button" class="btn-confirm-correct" onclick="executeJoeyAction('${actionId}', 'correct')">Correct</button>
        </div>
      </div>
    `;
  }

  // 5. Table / Seat / Seating info
  if (q.includes('table') || q.includes('sit') || q.includes('seat') || q.includes('placed')) {
    if (currentGuest.tableId) {
      const table = (state.tables && state.tables.find(t => t.id === currentGuest.tableId)) || { name: 'Table 4' };
      const tableName = table ? table.name : 'Table 4';
      const seatNo = (currentGuest.seatIndex !== null && currentGuest.seatIndex !== undefined) ? currentGuest.seatIndex + 1 : 3;
      const tablemates = (state.guests && state.guests.filter(g => g.tableId === currentGuest.tableId && g.id !== currentGuest.id).map(g => g.name)) || ['Alex Morgan', 'Liam Chen'];
      const matesList = tablemates.length > 0 ? `<br><br><strong>Your tablemates:</strong> ${tablemates.slice(0, 4).join(', ')}.` : '';
      return `Hi ${escapeHtml(firstName)}! You are seated at <strong>${escapeHtml(tableName)}, Seat ${seatNo}</strong>.${matesList}<br><br><em>(Note: As a guest, your seating is confirmed and view-only.)</em>`;
    } else {
      return `Hi ${escapeHtml(firstName)}! You are currently allocated to <strong>Table 4 (The Old Friends Table), Seat 3</strong>. Sophie &amp; James are finalising exact place cards!`;
    }
  }

  // 6. Ceremony Time & Schedule
  if (q.includes('time') || q.includes('schedule') || q.includes('ceremony') || q.includes('when') || q.includes('run-sheet') || q.includes('order')) {
    return `The celebration begins at <strong>${escapeHtml(wedding.timeDisplay)}</strong> on <strong>${escapeHtml(wedding.dateDisplay)}</strong> at <strong>${escapeHtml(wedding.venue)}</strong>.<br><br><strong>Day Schedule:</strong><br>• <strong>1:30 PM:</strong> Guest Arrival &amp; Welcome Drinks<br>• <strong>2:00 PM:</strong> Wedding Ceremony (Meadow Lawn)<br>• <strong>2:45 PM:</strong> Cocktails &amp; Canapés on Verandah<br>• <strong>4:00 PM:</strong> Grand Entrance into Pavilion<br>• <strong>5:30 PM:</strong> Dinner &amp; Speeches<br>• <strong>7:15 PM:</strong> Cake Cutting &amp; First Dance<br>• <strong>10:30 PM:</strong> Courtyard Sparkler Send-Off`;
  }

  // 7. Parking & Venue Directions
  if (q.includes('park') || q.includes('car') || q.includes('drive') || q.includes('venue') || q.includes('address') || q.includes('direction') || q.includes('location') || q.includes('map') || (q.includes('where') && !q.includes('table'))) {
    return `<strong>Venue &amp; Parking Details:</strong><br><strong>${escapeHtml(wedding.venue)}</strong><br><em>${escapeHtml(wedding.venueAddress)}</em><br><br>${escapeHtml(wedding.parking)}<br><br>Dedicated disabled and elderly drop-off bays are located directly adjacent to the main pavilion entrance.`;
  }

  // 8. Dress Code
  if (q.includes('dress') || q.includes('wear') || q.includes('attire') || q.includes('clothes') || q.includes('suit')) {
    return `The dress code is <strong>${escapeHtml(wedding.dressCode)}</strong>.<br><br>Ladies are warmly invited to wear elegant cocktail, midi, or floor-length dresses. Gentlemen are requested to wear dark suits or tuxedos. Southern Highlands evenings can be crisp, so a stylish shawl or light jacket is recommended!`;
  }

  // 9. Gifts / Wishing Well
  if (q.includes('gift') || q.includes('present') || q.includes('registry') || q.includes('wishing well') || q.includes('money') || q.includes('contribute')) {
    return `Your presence is our greatest present! For guests wishing to honour Sophie &amp; James with a gift, a digital wishing well is available directly in the <strong>Gift &amp; Go</strong> tab of this app (AU$ via cards, Apple Pay or direct transfer).`;
  }

  // 10. General Modification action (if starts with change/update/set)
  if (q.startsWith('change ') || q.startsWith('update ') || q.startsWith('set ') || q.startsWith('modify ')) {
    const actionId = 'act_' + Date.now();
    const actionDesc = input.trim();
    window.pendingJoeyActions[actionId] = {
      type: 'general',
      onAccept: () => {
        logAudit('Request Accepted via Joey: ' + actionDesc, guestName, actionDesc, 'Concierge');
        showToast('Request applied', 'success');
        return `Confirmed! Your request '${escapeHtml(actionDesc)}' has been accepted and recorded.`;
      },
      onReject: () => `Request cancelled. No changes were made.`,
      onCorrect: () => `Please specify the corrected details below:`
    };
    return `
      <div>I'm ready to update that:</div>
      <div class="joey-confirm-box" id="confirm-box-${actionId}">
        <div class="joey-confirm-badge">ACTION CONFIRMATION</div>
        <div class="joey-confirm-title">${escapeHtml(actionDesc)}</div>
        <div class="joey-confirm-desc">Would you like me to apply this update?</div>
        <div class="joey-confirm-btns" id="confirm-btns-${actionId}">
          <button type="button" class="btn-confirm-accept" onclick="executeJoeyAction('${actionId}', 'accept')">Accept</button>
          <button type="button" class="btn-confirm-reject" onclick="executeJoeyAction('${actionId}', 'reject')">Reject</button>
          <button type="button" class="btn-confirm-correct" onclick="executeJoeyAction('${actionId}', 'correct')">Correct</button>
        </div>
      </div>
    `;
  }

  // 11. Friendly Greeting / Help / Fallback
  return `Hi ${escapeHtml(firstName)}! I'm Joey, your Tap &amp; Toast wedding assistant. I can help with dietary requirements, RSVP, seating, timings, parking, or anything else for Sophie &amp; James's special day.<br><br><div style="display:flex;gap:6px;flex-wrap:wrap;"><button type="button" class="btn btn-outline btn-xs" style="border:1px solid #bd9661;padding:4px 8px;border-radius:12px;font-size:11px;" onclick="handleChipClick('Change my diet to vegetarian')">Change diet to vegetarian</button><button type="button" class="btn btn-outline btn-xs" style="border:1px solid #bd9661;padding:4px 8px;border-radius:12px;font-size:11px;" onclick="handleChipClick('Where is my table?')">My Table</button><button type="button" class="btn btn-outline btn-xs" style="border:1px solid #bd9661;padding:4px 8px;border-radius:12px;font-size:11px;" onclick="handleChipClick('What is the ceremony schedule?')">Schedule</button><button type="button" class="btn btn-outline btn-xs" style="border:1px solid #bd9661;padding:4px 8px;border-radius:12px;font-size:11px;" onclick="handleChipClick('Where can I park?')">Parking</button></div>`;
}
"""
