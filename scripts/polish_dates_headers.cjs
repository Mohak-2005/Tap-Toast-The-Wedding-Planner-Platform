const fs = require('fs');

// 1. PlannerView.tsx polish
let planner = fs.readFileSync('src/components/PlannerView.tsx', 'utf8');

// Format date in PlannerView
const dateTarget = `<p className="text-xs text-[#8b7b6b] mt-1">
                    {activeWedding.venue} &bull;{' '}
                    <span className="font-semibold text-[#15110e]">{activeWedding.date}</span>
                  </p>`;

const dateReplacement = `<p className="text-xs text-[#8b7b6b] mt-1">
                    {activeWedding.venue} &bull;{' '}
                    <span className="font-semibold text-[#15110e]">
                      {(() => {
                        try {
                          const d = new Date(activeWedding.date);
                          if (!isNaN(d.getTime())) {
                            return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
                          }
                        } catch {}
                        return activeWedding.date;
                      })()}
                    </span>
                  </p>`;

// Remove duplicate Seating header in PlannerView
const seatingHeaderTarget = `          {/* ------------------------------------------------------------ */}
          {/* TAB 2: SEATING PLANNER (EMBEDDED)                            */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'seating' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  SEATING STUDIO
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Visual Reception Seating Planner
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Interactive canvas floor plan, table capacity drilldown, and automated AI seating solver.
                </p>
              </div>

              <SeatingPlannerSection
                weddingId={activeWedding.id}
                onSelectView={onSelectView}
                isMcView={true}
              />
            </div>
          )}`;

const seatingHeaderReplacement = `          {/* ------------------------------------------------------------ */}
          {/* TAB 2: SEATING PLANNER (EMBEDDED)                            */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'seating' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <SeatingPlannerSection
                weddingId={activeWedding.id}
                onSelectView={onSelectView}
                isMcView={true}
              />
            </div>
          )}`;

// Replace literal &middot; in VIP notes with ·
planner = planner.replace(/&middot;/g, '·');

planner = planner.replace(dateTarget.replace(/\r\n/g, '\n'), dateReplacement.replace(/\r\n/g, '\n'));
planner = planner.replace(seatingHeaderTarget.replace(/\r\n/g, '\n'), seatingHeaderReplacement.replace(/\r\n/g, '\n'));

fs.writeFileSync('src/components/PlannerView.tsx', planner, 'utf8');
console.log('PlannerView polished successfully!');

// 2. SuperAdminView.tsx polish for date formatting in Couple Directory
let superAdmin = fs.readFileSync('src/components/SuperAdminView.tsx', 'utf8');

const superDateTarget = `<div className="font-mono text-xs font-semibold text-[#15110e]">
                              {w.date}
                            </div>`;

const superDateReplacement = `<div className="font-mono text-xs font-semibold text-[#15110e]">
                              {(() => {
                                try {
                                  const d = new Date(w.date);
                                  if (!isNaN(d.getTime())) {
                                    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
                                  }
                                } catch {}
                                return w.date;
                              })()}
                            </div>`;

superAdmin = superAdmin.replace(superDateTarget.replace(/\r\n/g, '\n'), superDateReplacement.replace(/\r\n/g, '\n'));
fs.writeFileSync('src/components/SuperAdminView.tsx', superAdmin, 'utf8');
console.log('SuperAdminView polished successfully!');
