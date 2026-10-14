# Client-side JavaScript Core for Tap & Toast Demo Suite
import json
from data_template import SEED_STATE

def get_shared_js():
    seed_json = json.dumps(SEED_STATE)
    return f"""
/* Tap & Toast Shared Client-Side Core */
const STORAGE_KEY = 'tt_demo_v1';
const SEED_DATA = {seed_json};
const SESSION_KEY = 'tt_session';

window._tt_in_memory_state = null;
window._tt_in_memory_session = null;

/* demo only hash */
function hashDemoPassword(pwd) {{
  try {{
    return btoa('tt_salt_' + pwd);
  }} catch (e) {{
    return 'tt_hash_' + pwd;
  }}
}}

function getSession() {{
  let session = null;
  try {{
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {{
      session = JSON.parse(raw);
    }}
  }} catch (e) {{
    console.warn('localStorage session read error', e);
  }}
  if (!session && window._tt_in_memory_session) {{
    session = window._tt_in_memory_session;
  }}
  if (!session && typeof window !== 'undefined' && window.parent && window.parent !== window && window.parent._tt_in_memory_session) {{
    session = window.parent._tt_in_memory_session;
  }}
  if (!session) return null;
  
  // Check expiration: 30 minutes if !keepSignedIn, 7 days if keepSignedIn
  const now = Date.now();
  const maxAge = session.keepSignedIn ? (7 * 24 * 60 * 60 * 1000) : (30 * 60 * 1000);
  if (session.at && (now - session.at > maxAge)) {{
    clearSession();
    return {{ expired: true }};
  }}
  
  // Refresh activity timestamp
  session.at = now;
  try {{
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }} catch (e) {{}}
  window._tt_in_memory_session = session;
  if (typeof window !== 'undefined' && window.parent && window.parent !== window) {{
    try {{ window.parent._tt_in_memory_session = session; }} catch (e) {{}}
  }}
  return session;
}}

function setSession(sessionData) {{
  if (!sessionData.at) sessionData.at = Date.now();
  window._tt_in_memory_session = sessionData;
  if (typeof window !== 'undefined' && window.parent && window.parent !== window) {{
    try {{ window.parent._tt_in_memory_session = sessionData; }} catch (e) {{}}
  }}
  try {{
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  }} catch (e) {{
    console.warn('localStorage session write error', e);
  }}
}}

function clearSession() {{
  window._tt_in_memory_session = null;
  if (typeof window !== 'undefined' && window.parent && window.parent !== window) {{
    try {{ window.parent._tt_in_memory_session = null; }} catch (e) {{}}
  }}
  try {{
    localStorage.removeItem(SESSION_KEY);
  }} catch (e) {{}}
}}

function setDemoSessionForRole(role) {{
  let user;
  if (role === 'mc') {{
    user = {{ role: 'mc', email: 'robert@galati.demo', name: 'Robert Galati', businessName: 'Galati MC & Entertainment', keepSignedIn: true, at: Date.now() }};
  }} else if (role === 'superadmin') {{
    user = {{ role: 'superadmin', email: 'admin@tapandtoast.demo', name: 'Platform Admin', keepSignedIn: true, at: Date.now() }};
  }} else {{
    user = {{ role: 'couple', email: 'sophie.james@demo.test', name: 'Sophie & James', partner1: 'Sophie', partner2: 'James', keepSignedIn: true, at: Date.now() }};
  }}
  setSession(user);
  return user;
}}

function handleDemobarNav(event, targetRole, targetHref) {{
  if (targetRole) {{
    setDemoSessionForRole(targetRole);
  }}
  if (typeof window !== 'undefined' && window.parent && window.parent !== window && typeof window.parent.loadEmbeddedRole === 'function') {{
    if (event && event.preventDefault) event.preventDefault();
    window.parent.loadEmbeddedRole(targetRole || targetHref);
    return;
  }}
  if (targetHref && (!event || !event.defaultPrevented)) {{
    window.location.href = targetHref;
  }}
}}

function quickDemoLogin(role) {{
  const user = setDemoSessionForRole(role);
  const authOverlay = document.getElementById('tt-auth-overlay');
  const appShell = document.querySelector('.app-shell');
  if (authOverlay) authOverlay.style.display = 'none';
  if (appShell) appShell.style.display = '';
  if (typeof updateSidebarUserInfo === 'function') {{
    updateSidebarUserInfo(user);
  }}
  if (typeof showToast === 'function') {{
    showToast('Signed in as ' + user.name, 'success');
  }}
}}

function loadState() {{
  try {{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {{
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 2) {{
        window._tt_in_memory_state = parsed;
        return parsed;
      }}
    }}
  }} catch (e) {{
    console.warn('localStorage read error, using memory fallback', e);
  }}
  if (window._tt_in_memory_state && window._tt_in_memory_state.version === 2) {{
    return window._tt_in_memory_state;
  }}
  if (typeof window !== 'undefined' && window.parent && window.parent !== window && window.parent._tt_in_memory_state && window.parent._tt_in_memory_state.version === 2) {{
    window._tt_in_memory_state = window.parent._tt_in_memory_state;
    return window._tt_in_memory_state;
  }}
  const initial = JSON.parse(JSON.stringify(SEED_DATA));
  saveState(initial);
  return initial;
}}

function saveState(state) {{
  window._tt_in_memory_state = state;
  if (typeof window !== 'undefined' && window.parent && window.parent !== window) {{
    try {{ window.parent._tt_in_memory_state = state; }} catch (e) {{}}
  }}
  try {{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }} catch (e) {{
    console.warn('localStorage write error', e);
  }}
  window.dispatchEvent(new CustomEvent('tt_state_changed', {{ detail: state }}));
}}

function resetDemoData() {{
  try {{
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
  }} catch (e) {{}}
  window._tt_in_memory_state = null;
  window._tt_in_memory_session = null;
  const initial = JSON.parse(JSON.stringify(SEED_DATA));
  saveState(initial);
  showToast('Demo data & session reset to seed state', 'success');
  setTimeout(() => {{
    window.location.reload();
  }}, 400);
}}

function logAudit(action, actor, details, category = 'General') {{
  const state = loadState();
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  const ts = `${{d.getFullYear()}}-${{pad(d.getMonth()+1)}}-${{pad(d.getDate())}} ${{pad(d.getHours())}}:${{pad(d.getMinutes())}}`;
  const entry = {{
    id: 'aud_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    timestamp: ts,
    actor: actor || 'System',
    action: action,
    details: details || '',
    category: category
  }};
  if (!state.auditLog) state.auditLog = [];
  state.auditLog.unshift(entry);
  if (state.auditLog.length > 100) state.auditLog.pop();
  saveState(state);
}}

function getDaysToGo(dateStr) {{
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}}

function getWeddingCountdown(dateStr) {{
  if (!dateStr) return {{ days: 0, hours: 0, minutes: 0, seconds: 0, formatted: '0 days : 0 hrs : 0 mins : 0 secs remaining', upperFormatted: '0 DAYS : 0 HRS : 0 MINS : 0 SECS REMAINING' }};
  const target = new Date(dateStr);
  const now = new Date();
  let diff = target.getTime() - now.getTime();
  if (diff <= 0) {{
    return {{ days: 0, hours: 0, minutes: 0, seconds: 0, formatted: 'Wedding Day!', upperFormatted: 'WEDDING DAY!' }};
  }}
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);
  const seconds = Math.floor(diff / 1000);
  return {{
    days,
    hours,
    minutes,
    seconds,
    formatted: `${{days}} days : ${{hours}} hrs : ${{minutes}} mins : ${{seconds}} secs remaining`,
    upperFormatted: `${{days}} DAYS : ${{hours}} HRS : ${{minutes}} MINS : ${{seconds}} SECS REMAINING`
  }};
}}

function formatAUD(amount) {{
  return '$' + Number(amount || 0).toLocaleString('en-AU');
}}

function showToast(message, type = 'info') {{
  let container = document.getElementById('tt-toast-container');
  if (!container) {{
    container = document.createElement('div');
    container.id = 'tt-toast-container';
    container.className = 'tt-toast-container';
    document.body.appendChild(container);
  }}
  const toast = document.createElement('div');
  toast.className = 'tt-toast tt-toast-' + type;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span class="tt-toast-icon">${{icon}}</span><span class="tt-toast-msg">${{escapeHtml(message)}}</span>`;
  container.appendChild(toast);
  setTimeout(() => {{
    toast.classList.add('tt-toast-fadeout');
    setTimeout(() => toast.remove(), 300);
  }}, 3000);
}}

function escapeHtml(str) {{
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}}

function getGuestMetrics(state) {{
  const guests = state.guests || [];
  const confirmed = guests.filter(g => g.rsvpStatus === 'confirmed');
  const confirmedCount = confirmed.reduce((sum, g) => sum + (g.guestCount || 1), 0);
  const declined = guests.filter(g => g.rsvpStatus === 'declined');
  const declinedCount = declined.length;
  const awaiting = guests.filter(g => g.rsvpStatus === 'awaiting');
  const awaitingCount = awaiting.length;
  const totalInvited = 118;
  const gifts = state.gifts || [];
  const giftsTotal = gifts.reduce((sum, g) => sum + Number(g.amount || 0), 0);
  const thankYousDue = gifts.filter(g => !g.thankYouSent).length;
  
  // Tables seated count
  const tables = state.tables || [];
  let seatedTablesCount = 0;
  tables.forEach(t => {{
    const count = guests.filter(g => g.tableId === t.id).length;
    if (count > 0) seatedTablesCount++;
  }});
  
  return {{
    totalInvited,
    confirmedCount,
    declinedCount,
    awaitingCount,
    giftsTotal,
    thankYousDue,
    seatedTablesCount,
    totalTables: tables.length
  }};
}}

function generateQrSvg(dataStr, size = 180) {{
  // Deterministic 25x25 QR-style SVG with exact 7x7 finder patterns
  const N = 25;
  const grid = Array.from({{ length: N }}, () => Array(N).fill(0));
  
  function addFinder(r, c) {{
    for (let i = 0; i < 7; i++) {{
      for (let j = 0; j < 7; j++) {{
        if (i === 0 || i === 6 || j === 0 || j === 6) grid[r + i][c + j] = 1;
        else if (i >= 2 && i <= 4 && j >= 2 && j <= 4) grid[r + i][c + j] = 1;
        else grid[r + i][c + j] = 0;
      }}
    }}
  }}
  
  // Finders at top-left, top-right, bottom-left
  addFinder(0, 0);
  addFinder(0, N - 7);
  addFinder(N - 7, 0);
  
  // Timing patterns
  for (let i = 8; i < N - 8; i++) {{
    grid[6][i] = i % 2 === 0 ? 1 : 0;
    grid[i][6] = i % 2 === 0 ? 1 : 0;
  }}
  
  // Hash data string to populate remaining cells
  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) {{
    hash = ((hash << 5) - hash + dataStr.charCodeAt(i)) | 0;
  }}
  let rng = Math.abs(hash) || 42;
  
  for (let r = 0; r < N; r++) {{
    for (let c = 0; c < N; c++) {{
      // Skip finders & separators
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= N - 8;
      const inBottomLeft = r >= N - 8 && c < 8;
      if (inTopLeft || inTopRight || inBottomLeft) continue;
      if (r === 6 || c === 6) continue;
      rng = (rng * 1664525 + 1013904223) | 0;
      grid[r][c] = (Math.abs(rng) % 100) > 46 ? 1 : 0;
    }}
  }}
  
  const cellSize = (size / N).toFixed(2);
  let rects = '';
  for (let r = 0; r < N; r++) {{
    for (let c = 0; c < N; c++) {{
      if (grid[r][c] === 1) {{
        rects += `<rect x="${{(c * cellSize).toFixed(2)}}" y="${{(r * cellSize).toFixed(2)}}" width="${{cellSize}}" height="${{cellSize}}" fill="#15110e" />`;
      }}
    }}
  }}
  
  return `<svg width="${{size}}" height="${{size}}" viewBox="0 0 ${{size}} ${{size}}" style="display:block;background:#ffffff;border-radius:6px;padding:8px;box-sizing:border-box;">${{rects}}</svg>`;
}}

// Global modal dismiss when clicking outside modal dialog
document.addEventListener('click', (e) => {{
  if (e.target && e.target.classList && e.target.classList.contains('tt-modal-backdrop')) {{
    e.target.style.display = 'none';
    e.target.setAttribute('aria-hidden', 'true');
  }}
}});
"""
