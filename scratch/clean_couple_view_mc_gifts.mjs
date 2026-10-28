import fs from 'fs';

const filePath = 'src/components/CoupleView.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

// 1. Hide gifts tab from sidebar when isMcView is true
const giftsTabTarget = `              {
                id: 'gifts',
                label: isMcView ? 'Gift & Wishing Well Ledger' : 'Gift & Thank-You',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                ),
              },`;

const giftsTabReplacement = `              ...(!isMcView ? [
                {
                  id: 'gifts' as const,
                  label: 'Gift & Thank-You',
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 12 20 22 4 22 4 12" />
                      <rect x="2" y="7" width="20" height="5" />
                      <line x1="12" y1="22" x2="12" y2="7" />
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                    </svg>
                  ),
                },
              ] : []),`;

content = content.replace(giftsTabTarget, giftsTabReplacement);

// 2. Hide activeTab === 'gifts' section when isMcView is true
const sectionTarget = "{activeTab === 'gifts' && (";
const sectionReplacement = "{activeTab === 'gifts' && !isMcView && (";
content = content.replace(sectionTarget, sectionReplacement);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated CoupleView.tsx to remove gifts for MC');
