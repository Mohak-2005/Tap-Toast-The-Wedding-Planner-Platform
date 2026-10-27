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
  weddingName?: string;
  brideName?: string;
  groomName?: string;
  brideEmail?: string;
  groomEmail?: string;
  date: string;
  dateDisplay?: string;
  timeDisplay?: string;
  venue: string;
  venueAddress?: string;
  parking?: string;
  dressCode?: string;
  registry?: string;
  invited: number;
  confirmed?: number;
  declined?: number;
  region?: string;
  daysRemaining?: number;
  status?: 'Finalising' | 'On track' | 'Planning' | string;
  tasks: Task[];
  runSheet?: RunSheetItem[];
  privateRunSheet?: PrivateRunSheetItem[];
  tenantId?: string;
  tablesTotal?: number;
  giftsTotal?: number;
  selectedMc?: {
    id: string;
    name: string;
    businessName?: string;
    business?: string;
    email?: string;
    phone?: string;
    rate?: number;
    rating?: string;
    status?: string;
    avatar?: string;
    style?: string;
  };
  subscriptionPlan?: {
    id: string;
    name: string;
    price: number;
    billing?: string;
    status?: string;
    paymentMethod?: string;
    features?: string[];
    activatedAt?: string;
  };
  aiOnboardingAnswers?: Array<{
    questionId: string;
    question: string;
    answer: string;
    category: string;
    audited: boolean;
  }> | Record<string, any>;
  giftingPresets?: number[];
  savedSeatingArrangements?: SavedSeatingArrangement[];
  danceFloorPos?: { x: number; y: number };
}

export interface SavedSeatingArrangement {
  id: string;
  weddingId: string;
  name: string;
  savedAt: string;
  savedBy: string;
  role: 'couple' | 'mc';
  notes?: string;
  danceFloorPos?: { x: number; y: number };
  tables: Table[];
  guestAssignments: Array<{
    guestId: string;
    tableId: string | null;
    seatIndex?: number | null;
  }>;
}

export type TableShape = 'round' | 'rectangular' | 'king';

export interface Table {
  id: string;
  weddingId?: string;
  name: string;
  capacity: number;
  isHead: boolean;
  shape?: TableShape;
  x?: number;
  y?: number;
  mobileX?: number;
  mobileY?: number;
  category?: string;
  zone?: string;
}

export interface Guest {
  id: string;
  weddingId?: string;
  name: string;
  initials?: string;
  household: string;
  email: string;
  phone: string;
  rsvpStatus: 'confirmed' | 'declined' | 'awaiting';
  guestCount?: number;
  partySize?: number;
  adults?: number;
  kids?: number;
  dietary: string;
  song?: string;
  plusOne?: boolean;
  reminderSent?: boolean;
  tableId?: string | null;
  seatIndex?: number | null;
  category?: string;
  notes?: string;
}

export interface Gift {
  id: string;
  guestName: string;
  amount: number;
  type: string;
  date: string;
  message: string;
  thankYouSent: boolean;
  thankYouStatus?: 'Not Started' | 'Drafted' | 'Sent' | 'Completed' | 'Due';
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
  passwordHash?: string;
  businessName?: string;
  tenantId?: string;
  weddingId?: string | null;
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

export interface SupportTicket {
  id: string;
  tenant: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
  messages: Array<{
    sender: string;
    time: string;
    text: string;
    isAdmin?: boolean;
  }>;
}

export interface FeatureFlags {
  digitalGifting: boolean;
  aiSeating: boolean;
  qardPrinting: boolean;
  photoModeration: boolean;
  smsReminders: boolean;
}

export interface Client {
  id: string;
  couple: string;
  weddingDate: string;
  venue: string;
  tier: string;
  deposit: string;
  phone: string;
  email: string;
  notes: string;
}

export interface Invoice {
  id: string;
  couple: string;
  date: string;
  venue: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Draft';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  accessLevel?: 'Full MC Dashboard Access' | 'Full Access' | 'Host & Run Sheet' | 'Seating & Guests' | 'Audio & AV Lead';
  assignedWeddings?: string[];
  permissions?: {
    canEditRunsheet?: boolean;
    canEditSeating?: boolean;
    canViewDietary?: boolean;
    canMessageClients?: boolean;
    canViewGiftLedger?: boolean;
  };
}

export interface SaaSPlan {
  id: string;
  key: string;
  tagline: string;
  price: number;
  billingCycle?: string;
  features: string[];
  activeSubscribers?: number;
  badge?: string;
  featured?: boolean;
}

export interface ReferralCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 15 for 15% or 100 for $100
  description: string;
  usesCount: number;
  mcRewardValue: number; // e.g. 150 for $150
  status: 'active' | 'inactive';
  createdDate: string;
}

export interface ReferredCouple {
  id: string;
  coupleName: string;
  weddingDate: string;
  codeUsed: string;
  discountSaved: number;
  mcCommission: number;
  commissionStatus: 'Paid' | 'Pending';
  dateReferred: string;
}

export interface McTransaction {
  id: string;
  date: string;
  tenantId: string;
  mcName: string;
  businessName: string;
  type: 'subscription' | 'client_invoice' | 'platform_fee' | 'payout';
  description: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: 'Settled' | 'Paid' | 'Pending' | 'Refunded';
  paymentMethod: string;
  xeroStatus: 'Synced' | 'Pending' | 'Failed';
  xeroInvoiceId?: string;
  weddingCouple?: string;
  invoiceId?: string;
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
  plans?: SaaSPlan[];
  usedInvites?: string[];
  supportTickets?: SupportTicket[];
  featureFlags?: FeatureFlags;
  clients?: Client[];
  invoices?: Invoice[];
  team?: TeamMember[];
  referralCodes?: ReferralCode[];
  referredCouples?: ReferredCouple[];
  mcTransactions?: McTransaction[];
}

