import { useState, useEffect } from 'react';
import { DemoState, Session, Wedding, Guest, Table, Gift, Tenant, AuditLogEntry, User } from './types';
import { SEED_DATA } from './seedData';

const STORAGE_KEY = 'tt_demo_v1';
const SESSION_KEY = 'tt_session';

let inMemoryState: DemoState | null = null;
let inMemorySession: Session | null = null;

export function getStoredState(): DemoState {
  if (typeof window === 'undefined') return SEED_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...SEED_DATA,
          ...parsed,
          tenants: Array.isArray(parsed.tenants) && parsed.tenants.length > 0 ? parsed.tenants : SEED_DATA.tenants,
          auditLog: Array.isArray(parsed.auditLog) && parsed.auditLog.length > 0 ? parsed.auditLog : SEED_DATA.auditLog,
          plans: Array.isArray(parsed.plans) && parsed.plans.length > 0 ? parsed.plans : SEED_DATA.plans,
          supportTickets: Array.isArray(parsed.supportTickets) && parsed.supportTickets.length > 0 ? parsed.supportTickets : (SEED_DATA.supportTickets || []),
          featureFlags: parsed.featureFlags && typeof parsed.featureFlags === 'object' ? { ...SEED_DATA.featureFlags, ...parsed.featureFlags } : SEED_DATA.featureFlags,
          weddings: Array.isArray(parsed.weddings) && parsed.weddings.length > 0 ? parsed.weddings.map((w: Wedding) => {
            const seedW = (SEED_DATA.weddings || []).find((sw: Wedding) => sw.id === w.id);
            return {
              ...w,
              danceFloorPos: w.danceFloorPos || seedW?.danceFloorPos || { x: 50, y: 50 },
              privateRunSheet: (Array.isArray(w.privateRunSheet) && w.privateRunSheet.length > 0)
                ? w.privateRunSheet
                : (seedW?.privateRunSheet || []),
              savedSeatingArrangements: (Array.isArray(w.savedSeatingArrangements) && w.savedSeatingArrangements.length > 0)
                ? w.savedSeatingArrangements
                : (seedW?.savedSeatingArrangements || [])
            };
          }) : SEED_DATA.weddings,
          guests: Array.isArray(parsed.guests) ? (() => {
            const rawList = parsed.guests.map((g: Guest) => ({
              ...g,
              weddingId: g.weddingId || 'w1'
            }));
            // Auto-migrate legacy combined guests (e.g. 'johnson_fam', combined Chen, Whitfield, etc.)
            const hasLegacy = rawList.some((g: Guest) =>
              g.id === 'johnson_fam' ||
              g.id === 'g_rchen' ||
              g.id === 'g_dwhitfield' ||
              g.id === 'g_toneill' ||
              g.id === 'g_u13' ||
              g.id === 'g_u17' ||
              g.name === 'Mark & Sarah Johnson'
            );
            let list = rawList;
            if (hasLegacy) {
              const seedW1 = (SEED_DATA.guests || []).filter(g => !g.weddingId || g.weddingId === 'w1');
              const nonLegacy = rawList.filter((g: Guest) =>
                g.id !== 'johnson_fam' &&
                g.id !== 'g_rchen' &&
                g.id !== 'g_dwhitfield' &&
                g.id !== 'g_toneill' &&
                g.id !== 'g_u13' &&
                g.id !== 'g_u17' &&
                g.name !== 'Mark & Sarah Johnson' &&
                !g.name.includes(' & Family')
              );
              const presentIds = new Set(nonLegacy.map((g: Guest) => g.id));
              const missingSeedW1 = seedW1.filter(g => !presentIds.has(g.id));
              list = [...nonLegacy, ...missingSeedW1];
            }
            const hasW2 = list.some((g: Guest) => g.weddingId === 'w2');
            const hasW3 = list.some((g: Guest) => g.weddingId === 'w3');
            const missingSeed = (SEED_DATA.guests || []).filter((g: Guest) =>
              (!hasW2 && g.weddingId === 'w2') || (!hasW3 && g.weddingId === 'w3')
            );
            return [...list, ...missingSeed];
          })() : SEED_DATA.guests,
          tables: Array.isArray(parsed.tables) ? (() => {
            const list = parsed.tables.map((t: Table) => ({
              ...t,
              weddingId: t.weddingId || 'w1'
            }));
            const hasW2 = list.some((t: Table) => t.weddingId === 'w2');
            const hasW3 = list.some((t: Table) => t.weddingId === 'w3');
            const missingSeed = (SEED_DATA.tables || []).filter((t: Table) =>
              (!hasW2 && t.weddingId === 'w2') || (!hasW3 && t.weddingId === 'w3')
            );
            return [...list, ...missingSeed];
          })() : SEED_DATA.tables,
          gifts: Array.isArray(parsed.gifts) ? parsed.gifts : SEED_DATA.gifts,
          users: Array.isArray(parsed.users) ? parsed.users : SEED_DATA.users,
          clients: Array.isArray(parsed.clients) ? parsed.clients : (SEED_DATA.clients || []),
          invoices: Array.isArray(parsed.invoices) ? parsed.invoices : (SEED_DATA.invoices || []),
          team: Array.isArray(parsed.team) ? parsed.team : (SEED_DATA.team || []),
          referralCodes: Array.isArray(parsed.referralCodes) && parsed.referralCodes.length > 0 ? parsed.referralCodes : (SEED_DATA.referralCodes || []),
          mcTransactions: Array.isArray(parsed.mcTransactions) && parsed.mcTransactions.length > 0 ? parsed.mcTransactions : (SEED_DATA.mcTransactions || []),
          referredCouples: Array.isArray(parsed.referredCouples) && parsed.referredCouples.length > 0 ? parsed.referredCouples : (SEED_DATA.referredCouples || []),
        };
      }
    }
  } catch (err) {
    console.warn('localStorage state read error', err);
  }
  if (!inMemoryState) {
    inMemoryState = JSON.parse(JSON.stringify(SEED_DATA));
  }
  return inMemoryState!;
}

export function saveStoredState(state: DemoState) {
  inMemoryState = state;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('localStorage state save error', err);
  }
  window.dispatchEvent(new CustomEvent('tt_state_updated', { detail: state }));
}

export function resetStoredState(): DemoState {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.warn('localStorage reset error', err);
  }
  inMemoryState = JSON.parse(JSON.stringify(SEED_DATA));
  inMemorySession = null;
  saveStoredState(inMemoryState);
  window.dispatchEvent(new CustomEvent('tt_session_updated', { detail: null }));
  return inMemoryState;
}

export function getStoredSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const sess = JSON.parse(raw);
      const now = Date.now();
      const maxAge = sess.keepSignedIn ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
      if (sess.at && now - sess.at > maxAge) {
        clearStoredSession();
        return { ...sess, expired: true };
      }
      return sess;
    }
  } catch (err) {
    console.warn('localStorage session read error', err);
  }
  return inMemorySession;
}

export function setStoredSession(session: Session) {
  session.at = Date.now();
  inMemorySession = session;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('localStorage session save error', err);
  }
  window.dispatchEvent(new CustomEvent('tt_session_updated', { detail: session }));
}

export function clearStoredSession() {
  inMemorySession = null;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.warn('localStorage session clear error', err);
  }
  window.dispatchEvent(new CustomEvent('tt_session_updated', { detail: null }));
}

export function setDemoSessionForRole(role: 'mc' | 'couple' | 'superadmin') {
  let user: Session;
  if (role === 'mc') {
    user = {
      role: 'mc',
      email: 'robert@galati.demo',
      name: 'Robert Galati',
      businessName: 'Galati MC & Entertainment',
      keepSignedIn: true,
      at: Date.now()
    };
  } else if (role === 'superadmin') {
    user = {
      role: 'superadmin',
      email: 'admin@tapandtoast.demo',
      name: 'Platform Admin',
      keepSignedIn: true,
      at: Date.now()
    };
  } else {
    user = {
      role: 'couple',
      email: 'sophie.james@demo.test',
      name: 'Sophie & James',
      partner1: 'Sophie',
      partner2: 'James',
      weddingId: 'w1',
      keepSignedIn: true,
      at: Date.now()
    };
  }
  setStoredSession(user);
  return user;
}

export function useAppState() {
  const [state, setState] = useState<DemoState>(getStoredState);

  useEffect(() => {
    const handleUpdate = () => {
      setState(getStoredState());
    };
    window.addEventListener('tt_state_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('tt_state_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return { state, setState: saveStoredState, resetState: resetStoredState };
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(getStoredSession);

  useEffect(() => {
    const handleUpdate = () => {
      setSession(getStoredSession());
    };
    window.addEventListener('tt_session_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('tt_session_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return { session, setSession: setStoredSession, clearSession: clearStoredSession };
}

export function getWeddingCountdown(dateStr?: string) {
  if (!dateStr) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: '0 days : 0 hrs : 0 mins : 0 secs remaining',
      upperFormatted: '0 DAYS : 0 HRS : 0 MINS : 0 SECS REMAINING'
    };
  }
  const target = new Date(dateStr);
  const now = new Date();
  let diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: 'Wedding Day!',
      upperFormatted: 'WEDDING DAY!'
    };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);
  const seconds = Math.floor(diff / 1000);
  return {
    days,
    hours,
    minutes,
    seconds,
    formatted: `${days} days : ${hours} hrs : ${minutes} mins : ${seconds} secs remaining`,
    upperFormatted: `${days} DAYS : ${hours} HRS : ${minutes} MINS : ${seconds} SECS REMAINING`
  };
}

export function formatAUD(amount: number | string): string {
  return '$' + Number(amount || 0).toLocaleString('en-AU');
}

export function showToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
  window.dispatchEvent(new CustomEvent('tt_show_toast', { detail: { message, type } }));
}

export function generateQrSvg(dataStr: string, size = 180): string {
  const N = 25;
  const grid: number[][] = Array.from({ length: N }, () => Array(N).fill(0));

  function addFinder(r: number, c: number) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6) grid[r + i][c + j] = 1;
        else if (i >= 2 && i <= 4 && j >= 2 && j <= 4) grid[r + i][c + j] = 1;
        else grid[r + i][c + j] = 0;
      }
    }
  }

  addFinder(0, 0);
  addFinder(0, N - 7);
  addFinder(N - 7, 0);

  for (let i = 8; i < N - 8; i++) {
    grid[6][i] = i % 2 === 0 ? 1 : 0;
    grid[i][6] = i % 2 === 0 ? 1 : 0;
  }

  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) {
    hash = ((hash << 5) - hash + dataStr.charCodeAt(i)) | 0;
  }
  let rng = Math.abs(hash) || 42;

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= N - 8;
      const inBottomLeft = r >= N - 8 && c < 8;
      if (inTopLeft || inTopRight || inBottomLeft) continue;
      if (r === 6 || c === 6) continue;
      rng = (rng * 1664525 + 1013904223) | 0;
      grid[r][c] = Math.abs(rng) % 100 > 46 ? 1 : 0;
    }
  }

  const cellSize = (size / N).toFixed(2);
  let rects = '';
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c] === 1) {
        rects += `<rect x="${(c * Number(cellSize)).toFixed(2)}" y="${(r * Number(cellSize)).toFixed(2)}" width="${cellSize}" height="${cellSize}" fill="#15110e" />`;
      }
    }
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="display:block;background:#ffffff;border-radius:6px;padding:8px;box-sizing:border-box;">${rects}</svg>`;
}

export function logAudit(
  state: DemoState,
  setState: (s: DemoState) => void,
  action: string,
  user: string,
  role: string,
  details: string,
  category: string
) {
  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
  const newEntry: AuditLogEntry = {
    id: 'aud_' + Date.now(),
    timestamp: dateStr,
    action,
    user,
    role,
    details,
    category
  };
  setState({
    ...state,
    auditLog: [newEntry, ...(state.auditLog || [])]
  });
}
