import fs from 'fs';

const filePath = 'src/components/SuperAdminView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the buttons from the top page header
const topHeaderOld = `            {/* Top Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#e8ded0]">
              <div>
                <div className="header-eyebrow text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  SUBSCRIPTIONS &amp; BILLING
                </div>
                <h1 className="header-title font-serif text-3xl font-bold text-[#15110e]">
                  Plans &amp; Billing
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Manage MC subscription tiers, review live transaction activity, and reconcile general ledgers in Xero.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowXeroModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-white border border-[#e8ded0] hover:bg-[#faf8f5] text-xs font-bold text-[#15110e] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span className="font-serif font-bold text-[#bd9661]">X</span>
                  <span>Open Xero Ledger</span>
                  <span className="text-[#bd9661]">↗</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewPlanKey('');
                    setNewPlanTagline('');
                    setNewPlanPrice(249);
                    setNewPlanBilling('AUD / mo');
                    setNewPlanBadge('');
                    setNewPlanFeatured(false);
                    setNewPlanFeatures('Up to 5 active weddings at a time\\\\nQaRd physical QR code printing\\\\nAI Seating Optimization Assistant\\\\nFull client messaging suite');
                    setShowAddPlanModal(true);
                  }}
                  className="btn btn-gold btn-sm"
                >
                  + Add Plan
                </button>
              </div>
            </div>`;

// Let's use flexible string matching for the top header
const topHeaderRegex = /\{\/\* Top Page Header \*\/[\s\S]*?\{\/\* Xero Accounting Notice & Gateway/;

const newTopHeader = `{/* Top Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#e8ded0]">
              <div>
                <div className="header-eyebrow text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  SUBSCRIPTIONS &amp; BILLING
                </div>
                <h1 className="header-title font-serif text-3xl font-bold text-[#15110e]">
                  Plans &amp; Billing
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Manage MC subscription tiers, review live transaction activity, and reconcile general ledgers in Xero.
                </p>
              </div>
            </div>

            {/* Xero Accounting Notice & Gateway`;

if (!topHeaderRegex.test(content)) {
  console.error('topHeaderRegex did not match!');
  process.exit(1);
}

content = content.replace(topHeaderRegex, newTopHeader);
console.log('Removed top buttons from page header successfully');

// 2. Add the "+ Add Plan" button to SaaS Subscription Tier Cards Grid header
const tierHeaderRegex = /\{\/\* 3\. SAAS SUBSCRIPTION TIER CARDS GRID[\s\S]*?<div className="flex items-center justify-between">[\s\S]*?<\/div>\s*<\/div>/;

const newTierHeader = `{/* 3. SAAS SUBSCRIPTION TIER CARDS GRID                           */}
            {/* ============================================================== */}
            {(billingSectionFocus === 'all' || billingSectionFocus === 'plans') && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#bd9661]">
                      TIER CATALOGUE
                    </div>
                    <h2 className="font-serif text-xl font-bold text-[#15110e] mt-0.5">
                      SaaS Subscription Tiers &amp; Pricing
                    </h2>
                    <p className="text-xs text-[#8b7b6b] mt-0.5">
                      {plans.length} configured plans available for self-service or invited MCs
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setNewPlanKey('');
                      setNewPlanTagline('');
                      setNewPlanPrice(249);
                      setNewPlanBilling('AUD / mo');
                      setNewPlanBadge('');
                      setNewPlanFeatured(false);
                      setNewPlanFeatures('Up to 5 active weddings at a time\\nQaRd physical QR code printing\\nAI Seating Optimization Assistant\\nFull client messaging suite');
                      setShowAddPlanModal(true);
                    }}
                    className="btn btn-gold btn-sm self-start sm:self-auto flex items-center gap-1.5"
                  >
                    <span>+ Add Plan</span>
                  </button>
                </div>`;

if (!tierHeaderRegex.test(content)) {
  console.error('tierHeaderRegex did not match!');
  process.exit(1);
}

content = content.replace(tierHeaderRegex, newTierHeader);
console.log('Added + Add Plan button to SaaS tier catalogue header successfully');

fs.writeFileSync(filePath, content, 'utf8');
console.log('File successfully updated!');
