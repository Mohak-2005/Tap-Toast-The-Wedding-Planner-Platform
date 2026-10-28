import fs from 'fs';

let content = fs.readFileSync('src/lib/types.ts', 'utf8');

const weddingAddition = `  tenantId?: string;
  tablesTotal?: number;
  giftsTotal?: number;
  selectedMc?: {
    id: string;
    name: string;
    businessName: string;
    email: string;
    phone: string;
    rate: number;
    avatar?: string;
    style?: string;
  };
  subscriptionPlan?: {
    id: string;
    name: string;
    price: number;
    billing: string;
    status: 'active' | 'trial';
    paymentMethod?: string;
    features?: string[];
  };
  aiOnboardingAnswers?: Array<{
    questionId: string;
    question: string;
    answer: string;
    category: string;
    audited: boolean;
  }>;
  giftingPresets?: number[];`;

content = content.replace(/  tenantId\?: string;\r?\n  tablesTotal\?: number;\r?\n  giftsTotal\?: number;/, weddingAddition);

const guestAddition = `  guestCount?: number;
  partySize?: number;
  adults?: number;
  kids?: number;`;

content = content.replace(/  guestCount\?: number;\r?\n  partySize\?: number;/, guestAddition);

fs.writeFileSync('src/lib/types.ts', content, 'utf8');
console.log('types.ts updated successfully!');
