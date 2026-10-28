import fs from 'fs';

const filePath = 'src/components/McView.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove invoicing nav item
const navItemPattern = /\s*\{\s*id:\s*'invoicing',\s*label:\s*'Invoicing'[\s\S]*?\},\s*/;
content = content.replace(navItemPattern, '\n');

// 2. Remove gifts sub-tab
const giftsSubTabPattern = /\s*\{\s*id:\s*'gifts',\s*label:\s*'🎁 Gift & Wishing Well Ledger'\s*\},?/;
content = content.replace(giftsSubTabPattern, '');

// 3. Remove sub-pane 5 (detailSubTab === 'gifts')
const subPane5Pattern = /\s*\{\/\*\s*Sub-pane 5: Gift & Wishing Well Ledger\s*\*\/\}[\s\S]*?\{detailSubTab === 'gifts' && \([\s\S]*?<\/>\s*\)\s*\}\s*;/;
// Let's check how sub-pane 5 ends
const subPane5Simple = /\{\/\*\s*Sub-pane 5: Gift & Wishing Well Ledger\s*\*\/\}[\s\S]*?\{detailSubTab === 'gifts' && \([\s\S]*?<\/div>\s*\}\s*\)/;

// Let's use a targeted match for sub-pane 5
const subPane5Target = content.indexOf("{/* Sub-pane 5: Gift & Wishing Well Ledger */}");
if (subPane5Target !== -1) {
  const endSection = content.indexOf("</section>", subPane5Target);
  if (endSection !== -1) {
    content = content.substring(0, subPane5Target) + content.substring(endSection);
  }
}

// 4. Remove activeTab === 'invoicing'
const invTabTarget = content.indexOf("{/* TAB 4: INVOICING");
if (invTabTarget !== -1) {
  const nextTabTarget = content.indexOf("{/* TAB 5: TEAM", invTabTarget);
  if (nextTabTarget !== -1) {
    // Find the end before next tab
    const beforeNext = content.lastIndexOf(")}", nextTabTarget);
    if (beforeNext !== -1 && beforeNext > invTabTarget) {
      content = content.substring(0, invTabTarget) + content.substring(nextTabTarget);
    }
  }
}

// 5. Remove showNewInvoiceModal
const newInvModalTarget = content.indexOf("{showNewInvoiceModal && (");
if (newInvModalTarget !== -1) {
  const modalComment = content.lastIndexOf("{/* ==================================================================== */", newInvModalTarget);
  const endModal = content.indexOf("</form>\n          </div>\n        </div>\n      )}", newInvModalTarget);
  const endModalAlt = content.indexOf(")}", newInvModalTarget);
  const startCut = modalComment !== -1 ? modalComment : newInvModalTarget;
  // find matching close
  const nextSection = content.indexOf("{/* ==================================================================== */", newInvModalTarget + 50);
  if (nextSection !== -1) {
    content = content.substring(0, startCut) + content.substring(nextSection);
  }
}

// 6. Remove showMcAddGiftModal
const addGiftModalTarget = content.indexOf("{showMcAddGiftModal && (");
if (addGiftModalTarget !== -1) {
  const modalComment = content.lastIndexOf("{/* MC ADD GIFT / ENVELOPE MODAL */", addGiftModalTarget);
  const startCut = modalComment !== -1 ? modalComment : addGiftModalTarget;
  const lastDiv = content.lastIndexOf("</div>\n  );");
  if (lastDiv !== -1 && lastDiv > addGiftModalTarget) {
    content = content.substring(0, startCut) + content.substring(lastDiv);
  }
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully cleaned McView.tsx');
