import fs from 'fs';

const filePath = 'src/components/LoginView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = `                  <div
                    onClick={() => handle1ClickFill('couple', 'sophie.james@demo.test')}
                    className="p-2 border border-[#ebd4b7] rounded bg-white hover:border-[#bd9661] cursor-pointer transition-colors flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-[#15110e]">Sophie &amp; James</strong>{' '}
                      <span className="text-[#bd9661] font-semibold">(Couple)</span>
                      <div className="text-[11px] text-[#8b7b6b]">sophie.james@demo.test &bull; Demo1234!</div>
                    </div>
                    <span className="text-xs text-[#bd9661] font-bold">Use &rarr;</span>
                  </div>`;

const replacement = `                  <div
                    onClick={() => handle1ClickFill('couple', 'sophie@demo.test')}
                    className="p-2 border border-[#ebd4b7] rounded bg-white hover:border-[#bd9661] cursor-pointer transition-colors flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-[#15110e]">Sophie Bell (Bride)</strong>{' '}
                      <span className="text-[#bd9661] font-semibold">(Shared Couple Portal)</span>
                      <div className="text-[11px] text-[#8b7b6b]">sophie@demo.test &bull; Demo1234!</div>
                    </div>
                    <span className="text-xs text-[#bd9661] font-bold">Use &rarr;</span>
                  </div>

                  <div
                    onClick={() => handle1ClickFill('couple', 'james@demo.test')}
                    className="p-2 border border-[#ebd4b7] rounded bg-white hover:border-[#bd9661] cursor-pointer transition-colors flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-[#15110e]">James Gordon (Groom)</strong>{' '}
                      <span className="text-[#bd9661] font-semibold">(Shared Couple Portal)</span>
                      <div className="text-[11px] text-[#8b7b6b]">james@demo.test &bull; Demo1234!</div>
                    </div>
                    <span className="text-xs text-[#bd9661] font-bold">Use &rarr;</span>
                  </div>`;

const normContent = content.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');

if (normContent.includes(normTarget)) {
  content = normContent.replace(normTarget, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('LoginView.tsx updated with dual email couple logins!');
} else {
  console.error('Target in LoginView.tsx NOT found!');
}
