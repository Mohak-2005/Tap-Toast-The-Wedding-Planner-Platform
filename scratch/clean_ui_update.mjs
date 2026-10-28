import fs from 'fs';

const filePath = 'src/components/SuperAdminView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const startTarget = "{/* TAB 3: PLANS, MC TRANSACTIONS & XERO BILLING";
const endTarget = "{/* Sub-Section Filter / Focus Tabs */}";

const sIndex = content.indexOf(startTarget);
const eIndex = content.indexOf(endTarget);

console.log('sIndex:', sIndex, 'eIndex:', eIndex);

// Find beginning of line of startTarget
const lineStart = content.lastIndexOf('\n', sIndex);
// Go back one more line for the separator comment
const prevLineStart = content.lastIndexOf('\n', lineStart - 1);

console.log('prevLineStart:', prevLineStart);

const newTopSection = `
        {/* ================================================================ */}
        {/* TAB 3: PLANS, MC TRANSACTIONS & XERO BILLING                     */}
        {/* ================================================================ */}
        {activeTab === 'plans' && (
          <section className="space-y-6 animate-in fade-in duration-150">
            {/* Top Page Header */}
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
                    setNewPlanFeatures('Up to 5 active weddings at a time\\nQaRd physical QR code printing\\nAI Seating Optimization Assistant\\nFull client messaging suite');
                    setShowAddPlanModal(true);
                  }}
                  className="btn btn-gold btn-sm"
                >
                  + Add Plan
                </button>
              </div>
            </div>

            {/* Xero Accounting Notice & Gateway (Clean UI Colors) */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#15110e] text-[#bd9661] font-serif font-bold text-lg flex items-center justify-center shrink-0 border border-[#bd9661]/40">
                  X
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-bold text-base text-[#15110e]">Xero Cloud Accounting</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Sync Connected &bull; Tap &amp; Toast Pty Ltd
                    </span>
                  </div>
                  <p className="text-xs text-[#8b7b6b] mt-0.5">
                    For actual accounting, statutory tax compliance (BAS / GST), and bank reconciliations, the SuperAdmin uses Xero.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSyncToXero}
                  disabled={isSyncingXero}
                  className="px-3 py-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#f2ede4] border border-[#e8ded0] text-xs font-bold text-[#15110e] flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60"
                  title="Sync pending transactions to Xero"
                >
                  <span className={\`text-[#bd9661] \${isSyncingXero ? 'animate-spin' : ''}\`}>⟳</span>
                  <span>{isSyncingXero ? 'Syncing...' : 'Sync Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowXeroModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] hover:text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span>Open Xero</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* Quick Financial KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-xl p-4 shadow-2xs">
                <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">Total MC Monthly MRR</div>
                <div className="text-2xl font-serif font-bold text-[#15110e] mt-1">
                  $1,496<span className="text-xs font-sans text-[#8b7b6b] font-normal"> / mo AUD</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <span>&uarr; 18.4%</span> across 4 MC agencies
                </div>
              </div>

              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-xl p-4 shadow-2xs">
                <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">MC Transaction Volume (30D)</div>
                <div className="text-2xl font-serif font-bold text-[#15110e] mt-1">
                  $24,850<span className="text-xs font-sans text-[#8b7b6b] font-normal"> .00 AUD</span>
                </div>
                <div className="text-[11px] text-[#8b7b6b] mt-1">
                  {mcTransactions.length} processed wedding &amp; SaaS records
                </div>
              </div>

              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-xl p-4 shadow-2xs">
                <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">Platform Take (2.5%)</div>
                <div className="text-2xl font-serif font-bold text-[#15110e] mt-1">
                  $621<span className="text-xs font-sans text-[#8b7b6b] font-normal"> .25 AUD</span>
                </div>
                <div className="text-[11px] text-[#8b7b6b] mt-1">
                  Auto-split via Stripe Connect
                </div>
              </div>

              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-xl p-4 shadow-2xs">
                <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">Xero Sync Health</div>
                <div className="text-2xl font-serif font-bold text-[#15110e] mt-1 flex items-center gap-1.5">
                  <span>96.4%</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">Healthy</span>
                </div>
                <div className="text-[11px] text-[#8b7b6b] mt-1">
                  Synced to Chart of Accounts
                </div>
              </div>
            </div>

            `;

content = content.slice(0, prevLineStart) + newTopSection + content.slice(eIndex);
console.log('Top section replaced successfully');

// 2. Also update Xero Sync badge in transactions table
content = content.replace(
  `span className="bg-[#e4f7fc] border border-[#a2e2f3] text-[#00607d]`,
  `span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#8e6e42]`
);

// 3. Update Xero Modal styling
const modalStartTarget = "{/* XERO ACCOUNTING PORTAL MODAL";
const modalEndTarget = "{/* TRANSACTION RECEIPT / DETAIL MODAL";

const msIndex = content.indexOf(modalStartTarget);
const meIndex = content.indexOf(modalEndTarget);

console.log('msIndex:', msIndex, 'meIndex:', meIndex);

const mLineStart = content.lastIndexOf('\n', msIndex);
const mPrevLineStart = content.lastIndexOf('\n', mLineStart - 1);

const endDivIndex = content.lastIndexOf('</div>', meIndex);
const closingDivEnd = content.indexOf('\n', endDivIndex);

const newXeroModal = `
      {/* ============================================================== */}
      {/* XERO ACCOUNTING PORTAL MODAL                                   */}
      {/* ============================================================== */}
      {showXeroModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#e8ded0] overflow-hidden space-y-0">
            {/* Xero Header */}
            <div className="bg-[#15110e] text-white p-5 flex items-start justify-between border-b border-[#29211a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2a2119] text-[#bd9661] border border-[#bd9661]/40 font-serif font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
                  X
                </div>
                <div>
                  <div className="text-[10px] tracking-widest uppercase font-bold text-[#bd9661]">
                    Xero Cloud Accounting Integration
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                    Tap &amp; Toast Pty Ltd &bull; General Ledger
                  </h3>
                  <div className="text-[11px] text-[#a09080]">
                    Connected Organisation: <strong>Tap &amp; Toast Pty Ltd (ABN 48 619 204 881)</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowXeroModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-base cursor-pointer transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-3.5 text-[#544332] space-y-1">
                <div className="font-bold text-[12px] flex items-center gap-1.5 text-[#15110e]">
                  <span className="text-[#bd9661]">📘</span> Direct General Ledger &amp; Reconciliation Notice
                </div>
                <p className="leading-relaxed">
                  For actual accounting, BAS / GST tax returns, and bank reconciliation, the SuperAdmin uses Xero. All transactions below are automatically synchronized with your Xero Invoices &amp; Stripe Bank Feed.
                </p>
              </div>

              {/* Xero Chart of Accounts Mapping */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8b7b6b]">
                  Xero Chart of Accounts Mapping:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#faf8f5] border border-[#e8ded0] p-3 rounded-xl">
                    <div className="text-[10px] text-[#8b7b6b]">Account 400 (Revenue)</div>
                    <div className="font-bold text-[#15110e] text-xs mt-0.5">SaaS MC Subscriptions</div>
                    <div className="font-mono text-emerald-700 font-semibold text-[11px] mt-1">$1,496.00 AUD/mo</div>
                  </div>
                  <div className="bg-[#faf8f5] border border-[#e8ded0] p-3 rounded-xl">
                    <div className="text-[10px] text-[#8b7b6b]">Account 410 (Commission)</div>
                    <div className="font-bold text-[#15110e] text-xs mt-0.5">Platform Booking Fees (2.5%)</div>
                    <div className="font-mono text-emerald-700 font-semibold text-[11px] mt-1">$621.25 AUD</div>
                  </div>
                </div>
              </div>

              {/* Direct Links to Xero Portals */}
              <div className="space-y-2 pt-1 border-t border-[#f0ede4]">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8b7b6b]">
                  Quick Access to Xero Modules:
                </div>
                <div className="space-y-1.5">
                  <a
                    href="https://go.xero.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#faf8f5] hover:bg-[#f2ede4] rounded-xl border border-[#e8ded0] text-xs text-[#15110e] font-semibold transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[#bd9661]">📊</span>
                      <span>Xero Dashboard &amp; Bank Reconciliation</span>
                    </span>
                    <span className="text-[#8b7b6b] group-hover:text-[#bd9661] font-bold">↗</span>
                  </a>

                  <a
                    href="https://go.xero.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#faf8f5] hover:bg-[#f2ede4] rounded-xl border border-[#e8ded0] text-xs text-[#15110e] font-semibold transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-700">🧾</span>
                      <span>Xero Sales Invoices &amp; Customer Ledger (38 synced)</span>
                    </span>
                    <span className="text-[#8b7b6b] group-hover:text-[#bd9661] font-bold">↗</span>
                  </a>

                  <a
                    href="https://go.xero.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#faf8f5] hover:bg-[#f2ede4] rounded-xl border border-[#e8ded0] text-xs text-[#15110e] font-semibold transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[#bd9661]">🏛️</span>
                      <span>Australian GST / BAS Summary Reports</span>
                    </span>
                    <span className="text-[#8b7b6b] group-hover:text-[#bd9661] font-bold">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#faf8f5] border-t border-[#e8ded0] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSyncToXero}
                disabled={isSyncingXero}
                className="px-3.5 py-2 rounded-xl bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] text-xs font-bold cursor-pointer transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                <span className={isSyncingXero ? 'animate-spin text-[#bd9661]' : 'text-[#bd9661]'}>⟳</span>
                <span>{isSyncingXero ? 'Syncing...' : 'Sync Pending to Xero'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowXeroModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#e8ded0] bg-white hover:bg-[#faf8f5] text-xs font-bold text-[#8b7b6b] cursor-pointer"
                >
                  Close
                </button>
                <a
                  href="https://go.xero.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#bd9661] hover:bg-[#a6804d] text-white text-xs font-bold cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                >
                  <span>Open go.xero.com</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      `;

content = content.slice(0, mPrevLineStart) + newXeroModal + content.slice(closingDivEnd);
console.log('Modal section replaced successfully');

// 4. Update Receipt modal Xero badge
content = content.replace(
  `span className="bg-[#e4f7fc] border border-[#a2e2f3] text-[#00607d]`,
  `span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#8e6e42]`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated SuperAdminView.tsx!');
