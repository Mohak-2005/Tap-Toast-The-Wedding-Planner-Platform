import fs from 'fs';

const filePath = 'src/components/SuperAdminView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

let norm = content.replace(/\r\n/g, '\n');

// 1. payoutSchedule in state
const target1 = `    platformFeePercent: 2.5,
    payoutSchedule: 'Rolling T+2 Business Days',
    primaryCurrency: 'AUD ($)',`;

const replacement1 = `    platformFeePercent: 2.5,
    payoutSchedule: 'Inbound SaaS Subscriptions (No System Payouts to MCs)',
    primaryCurrency: 'AUD ($)',`;

if (norm.includes(target1)) {
  norm = norm.replace(target1, replacement1);
  console.log('1. Settings state updated!');
} else {
  console.error('1. Target 1 NOT found!');
}

// 2. Settings form field
const target2 = `                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Payout Schedule
                  </label>
                  <input
                    type="text"
                    value={saSettings.payoutSchedule}
                    onChange={(e) => setSaSettings({ ...saSettings, payoutSchedule: e.target.value })}
                    className="text-input"
                  />`;

const replacement2 = `                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    MC Subscription Billing Model
                  </label>
                  <input
                    type="text"
                    value={saSettings.payoutSchedule}
                    onChange={(e) => setSaSettings({ ...saSettings, payoutSchedule: e.target.value })}
                    className="text-input"
                  />
                  <span className="text-[10px] text-[#8b7b6b] block mt-0.5">
                    MCs pay monthly SaaS subscriptions to Tap & Toast. The platform does not disburse payouts to MCs.
                  </span>`;

if (norm.includes(target2)) {
  norm = norm.replace(target2, replacement2);
  console.log('2. Settings form updated!');
} else {
  console.error('2. Target 2 NOT found!');
}

// 3. Connect Status pill
const target3 = `<span className="tt-pill green">Verified &amp; Payouts Active</span>`;
const replacement3 = `<span className="tt-pill green">Inbound SaaS Subscriptions Active (No MC Payouts)</span>`;

if (norm.includes(target3)) {
  norm = norm.replace(target3, replacement3);
  console.log('3. Pill updated!');
} else {
  console.error('3. Target 3 NOT found!');
}

// 4. Add Platform Business & Pricing Model Notice to Plans & Billing tab
const target4 = `            {/* Xero Accounting Notice & Gateway (Clean UI Colors) */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">`;

const replacement4 = `            {/* Platform Business & Pricing Model Notice */}
            <div className="bg-[#faf6ee] border border-[#ebd4b7] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0">🏛️</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-bold text-sm text-[#15110e]">Platform SaaS Revenue Model</span>
                    <span className="text-[10px] bg-[#bd9661] text-[#15110e] font-bold px-2 py-0.5 rounded-full">
                      B2B Inbound Subscriptions
                    </span>
                  </div>
                  <p className="text-xs text-[#544332] mt-0.5 leading-snug">
                    <strong>MC SaaS Subscriptions:</strong> MCs subscribe directly to Tap &amp; Toast via monthly SaaS tiers ($149–$299/mo). Tap &amp; Toast does not remit payouts or salaries to MCs.<br />
                    <strong>Couple Access:</strong> Couple portal access is 100% complimentary (sponsored under the host's active MC plan; couples do not pay platform fees).
                  </p>
                </div>
              </div>
            </div>

            {/* Xero Accounting Notice & Gateway (Clean UI Colors) */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">`;

if (norm.includes(target4)) {
  norm = norm.replace(target4, replacement4);
  console.log('4. Model notice inserted!');
} else {
  console.error('4. Target 4 NOT found!');
}

fs.writeFileSync(filePath, norm, 'utf8');
console.log('SuperAdminView.tsx updated!');
