const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'SuperAdminView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix scrollbar: change <main className="flex-1 p-6 md:p-9 overflow-y-auto max-w-[1400px]"> to w-full min-w-0 with inner wrapper
content = content.replace(
  '<main className="flex-1 p-6 md:p-9 overflow-y-auto max-w-[1400px]">',
  '<main className="flex-1 p-6 md:p-9 overflow-y-auto w-full min-w-0">\r\n        <div className="max-w-[1400px] w-full mx-auto space-y-7">'
);
if (!content.includes('min-w-0">')) {
  content = content.replace(
    '<main className="flex-1 p-6 md:p-9 overflow-y-auto max-w-[1400px]">',
    '<main className="flex-1 p-6 md:p-9 overflow-y-auto w-full min-w-0">\n        <div className="max-w-[1400px] w-full mx-auto space-y-7">'
  );
}

// Close the inner wrapper div right before </main>
content = content.replace(
  '</main>',
  '</div>\r\n      </main>'
);

// 2. Card 1: Active Couple Tenants
content = content.replace(
  `<div className="text-3xl font-serif font-bold text-[#15110e]">{activeTenantsCount}</div>\r\n                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Active MC Tenants</div>`,
  `<div className="text-3xl font-serif font-bold text-[#15110e]">{(state.weddings || []).length}</div>\r\n                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Active Couple Tenants</div>`
);
content = content.replace(
  `<div className="text-3xl font-serif font-bold text-[#15110e]">{activeTenantsCount}</div>\n                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Active MC Tenants</div>`,
  `<div className="text-3xl font-serif font-bold text-[#15110e]">{(state.weddings || []).length}</div>\n                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Active Couple Tenants</div>`
);

// 3. Replace MC Tenant Directory table with Couple Directory table on Overview tab
const oldMcTableBlock = `            {/* Quick Tenant Table */}
            <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#15110e]">
                    MC Tenant Directory
                  </h3>
                  <div className="text-xs text-[#8b7b6b]">
                    Manage active multi-tenant instances
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(true)}
                    className="btn btn-gold btn-sm"
                  >
                    + Invite Tenant
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>MC Business & Contact</th>
                      <th>Plan Tier</th>
                      <th>Active Weddings</th>
                      <th>MRR</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map(t => (
                      <tr key={t.id}>
                        <td>
                          <strong className="text-sm font-semibold text-[#15110e] block">{t.businessName}</strong>
                          <span className="text-[11px] text-[#8b7b6b]">{t.contactName} • {t.email}{t.phone ? \` • \${t.phone}\` : ''}</span>
                        </td>
                        <td>
                          <select
                            value={getTenantPlanKey(t.plan)}
                            onChange={(e) => handleChangeTenantPlan(t.id, e.target.value)}
                            className="text-input py-1 px-2 text-xs max-w-[130px] font-medium"
                          >
                            {plans.map(p => (
                              <option key={p.id} value={p.key}>{p.key} (\${p.price}/mo)</option>
                            ))}
                          </select>
                        </td>
                        <td className="font-semibold">{t.weddingsCount} weddings</td>
                        <td className="font-bold text-emerald-700">\${t.mrr}/mo</td>
                        <td>
                          <span
                            onClick={() => handleToggleTenantStatus(t.id)}
                            className={\`tt-pill \${t.status === 'Active' ? 'green' : t.status === 'Trial' ? 'warm' : 'danger'} cursor-pointer\`}
                            title="Click to toggle status"
                          >
                            {t.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleTenantStatus(t.id)}
                              className="btn btn-outline btn-xs"
                            >
                              {t.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedTenant(t)}
                              className="btn btn-outline btn-xs"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>`;

const newCoupleTableBlock = `            {/* Quick Couple Directory Table */}
            <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#15110e]">
                    Couple Directory
                  </h3>
                  <div className="text-xs text-[#8b7b6b]">
                    Manage active couple wedding suites &amp; subscriptions
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteCoupleModal(true)}
                    className="btn btn-gold btn-sm"
                  >
                    + Invite Couple
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Couple &amp; Celebration</th>
                      <th>Wedding Date &amp; Venue</th>
                      <th>SaaS Pass Tier</th>
                      <th>Assigned MC / Host</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(state.weddings || []).map((w: any) => {
                      const rawPlanName = w.subscriptionPlan?.name || 'Signature Pro Wedding Suite';
                      const cleanPlan = rawPlanName.replace(' Wedding Suite', '').replace(' Plan', '');
                      const statusStr = w.subscriptionPlan?.status || w.status || 'Active';
                      const coupleEmail = w.brideEmail || w.groomEmail || \`\${(w.partner1 || 'couple').toLowerCase()}@demo.test\`;

                      return (
                        <tr
                          key={w.id}
                          onClick={() => setSelectedCoupleTenant(w)}
                          className="cursor-pointer hover:bg-[#faf7f2] transition-colors"
                        >
                          <td>
                            <strong className="text-sm font-semibold text-[#15110e] block">{w.couple}</strong>
                            <span className="text-[11px] text-[#8b7b6b]">{coupleEmail}</span>
                          </td>
                          <td>
                            <div className="font-medium text-[#15110e]">{w.date}</div>
                            <div className="text-[11px] text-[#8b7b6b]">{w.venue}</div>
                          </td>
                          <td>
                            <span className="bg-[#fcf8f2] text-[#8b6932] border border-[#ebd3a8] px-2 py-0.5 rounded text-xs font-bold">
                              {cleanPlan}
                            </span>
                          </td>
                          <td>
                            <div className="font-medium text-[#15110e]">Robert Galati</div>
                            <div className="text-[11px] text-[#8b7b6b]">Certified MC</div>
                          </td>
                          <td>
                            <span className="tt-pill green">
                              {statusStr}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCoupleTenant(w);
                                }}
                                className="btn btn-outline btn-xs"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>`;

if (content.includes(oldMcTableBlock.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldMcTableBlock.replace(/\n/g, '\r\n'), newCoupleTableBlock.replace(/\n/g, '\r\n'));
} else if (content.includes(oldMcTableBlock)) {
  content = content.replace(oldMcTableBlock, newCoupleTableBlock);
} else {
  console.log('Searching for regex match for MC table');
  content = content.replace(
    /\{\/\* Quick Tenant Table \*\/\}[\s\S]*?<h3 className="font-serif text-lg font-bold text-\[#15110e\]">\s*MC Tenant Directory[\s\S]*?<\/table>\s*<\/div>\s*<\/div>/,
    newCoupleTableBlock
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated SuperAdminView.tsx!');
