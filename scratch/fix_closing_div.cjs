const fs = require('fs');

let content = fs.readFileSync('src/components/SeatingPlannerSection.tsx', 'utf8');

const target = `                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDE: UNALLOCATED GUESTS & FAMILIES PANEL */}`;

const replacement = `                    </div>
                  );
                })}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: UNALLOCATED GUESTS & FAMILIES PANEL */}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/SeatingPlannerSection.tsx', content, 'utf8');
  console.log('SUCCESSFULLY_INSERTED_CLOSING_DIV');
} else {
  // Try CRLF
  const targetCRLF = target.replace(/\n/g, '\r\n');
  const replacementCRLF = replacement.replace(/\n/g, '\r\n');
  if (content.includes(targetCRLF)) {
    content = content.replace(targetCRLF, replacementCRLF);
    fs.writeFileSync('src/components/SeatingPlannerSection.tsx', content, 'utf8');
    console.log('SUCCESSFULLY_INSERTED_CLOSING_DIV_CRLF');
  } else {
    console.log('TARGET NOT FOUND');
  }
}
