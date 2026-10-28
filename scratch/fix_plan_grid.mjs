import fs from 'fs';

const filePath = 'src/components/SuperAdminView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Use index of unique markers
const sTarget = '<span>+ Add Plan</span>';
const eTarget = '{/* TAB 4: FEATURE FLAGS';

const sIdx = content.indexOf(sTarget);
const eIdx = content.indexOf(eTarget);

console.log('sIdx:', sIdx, 'eIdx:', eIdx);

const newSlice = `<span>+ Add Plan</span>
                  </button>
                </div>

                <div className="plan-cards-grid">
                  {plans.map((p) => {
                    const subCount = tenants.filter(t => getTenantPlanKey(t?.plan).toLowerCase() === p.key.toLowerCase()).length;
                    return (
                      <div
                        key={p.id}
                        className={\`plan-card \${p.featured ? 'featured' : ''} relative flex flex-col justify-between\`}
                      >
                        {p.badge && (
                          <div className="plan-featured-badge">{p.badge}</div>
                        )}
                        <div>
                          <div className={\`text-xs tracking-wider font-bold uppercase \${p.featured ? 'text-[#bd9661]' : 'text-[#8b7b6b]'}\`}>
                            {p.key}
                          </div>
                          <h3 className="font-serif text-2xl font-bold text-[#15110e] mt-1">
                            {p.tagline}
                          </h3>
                          <div className="plan-price mt-3">
                            \${p.price} <small className="text-sm text-[#8b7b6b] font-normal">{p.billingCycle || 'AUD / mo'}</small>
                          </div>
                          <ul className="text-xs text-[#5a4b3d] space-y-2 list-none p-0 mt-4">
                            {(p.features || []).map((feat, fIdx) => (
                              <li key={fIdx}>✓ {feat}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-6 border-t border-[#e8ded0] pt-4 text-xs text-[#8b7b6b] flex justify-between items-center">
                          <span>
                            Active Subscribers: <strong className="text-[#15110e]">{subCount}</strong>
                          </span>
                          <span className="text-[11px] text-[#bd9661] font-semibold">
                            \${p.price * subCount}/mo MRR
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        `;

// Replace from sIdx to eIdx
content = content.slice(0, sIdx) + newSlice + content.slice(eIdx);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Plan grid restored successfully!');
