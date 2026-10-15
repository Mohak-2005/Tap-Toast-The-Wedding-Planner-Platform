export interface Task {
  id: string;
  text: string;
  completed: boolean;
  due: string;
}

export interface RunSheetItem {
  id: string;
  time: string;
  note: string;
  done: boolean;
}

export interface PrivateRunSheetItem {
  id: string;
  time: string;
  activity: string;
  notes: string;
  privateNotes: string;
  done: boolean;
  order: number;
}

export interface Wedding {
  id: string;
  couple: string;
  partner1: string;
  partner2: string;
  date: string;
  dateDisplay: string;
  timeDisplay: string;
  venue: string;
  venueAddress: string;
  parking: string;
  dressCode: string;
  registry: string;
  invited: number;
  confirmed?: number;
  status: 'Finalising' | 'On track' | 'Planning' | string;
  tasks: Task[];
  runSheet: RunSheetItem[];
  privateRunSheet?: PrivateRunSheetItem[];
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  isHead: boolean;
}

export interface Guest {
  id: string;
  name: string;
  initials: string;
  household: string;
  email: string;
  phone: string;
  rsvpStatus: 'confirmed' | 'declined' | 'awaiting';
  guestCount: number;
  dietary: string;
  song?: string;
  plusOne?: boolean;
  reminderSent: boolean;
  tableId: string | null;
  seatIndex: number | null;
}

export interface Gift {
  id: string;
  guestName: string;
  amount: number;
  type: string;
  date: string;
  message: string;
  thankYouSent: boolean;
  thankYouStatus?: 'Not Started' | 'Drafted' | 'Sent' | 'Completed';
}

export interface Tenant {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  plan: string;
  status: 'Active' | 'Trial' | 'Suspended';
  weddingsCount: number;
  mrr: number;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  role: string;
  details: string;
  category: string;
}

export interface User {
  id: string;
  email: string;
  role: 'mc' | 'couple' | 'superadmin';
  name: string;
  passwordHash: string;
  businessName?: string;
  tenantId?: string;
  weddingId?: string;
  partner1?: string;
  partner2?: string;
}

export interface Session {
  role: 'mc' | 'couple' | 'superadmin';
  email: string;
  name: string;
  businessName?: string;
  tenantId?: string;
  weddingId?: string;
  partner1?: string;
  partner2?: string;
  keepSignedIn?: boolean;
  at?: number;
  impersonating?: boolean;
  expired?: boolean;
}

export interface DemoState {
  version: number;
  currentWeddingId: string;
  weddings: Wedding[];
  tables: Table[];
  guests: Guest[];
  gifts: Gift[];
  tenants: Tenant[];
  auditLog: AuditLogEntry[];
  users: User[];
  usedInvites?: string[];
}
