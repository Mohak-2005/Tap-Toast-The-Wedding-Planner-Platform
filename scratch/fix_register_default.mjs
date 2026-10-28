import fs from 'fs';

// 1. Update App.tsx
const appPath = 'src/App.tsx';
let appCode = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

appCode = appCode.replace(
  `      case 'register':
        return <RegisterView onSelectView={handleSelectView} />;`,
  `      case 'register':
      case 'register-mc':
      case 'register-couple':
        return <RegisterView onSelectView={handleSelectView} />;`
);

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('✓ Updated App.tsx');

// 2. Update RegisterView.tsx
const regPath = 'src/components/RegisterView.tsx';
let regCode = fs.readFileSync(regPath, 'utf8').replace(/\r\n/g, '\n');

// Default accountType to 'couple' unless hash explicitly says 'register-mc'
const oldAccountState = `  const [accountType, setAccountType] = useState<'mc' | 'couple'>('mc');`;
const newAccountState = `  const getInitialAccountType = (): 'mc' | 'couple' => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('register-mc') || hash.includes('type=mc')) return 'mc';
    return 'couple'; // Default to Couple registration
  };
  const [accountType, setAccountType] = useState<'mc' | 'couple'>(getInitialAccountType);

  // Sync accountType if hash changes
  React.useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('register-mc') || hash.includes('type=mc')) {
      setAccountType('mc');
    } else if (hash.includes('register-couple') || hash === '#register') {
      setAccountType('couple');
    }
  }, []);`;

if (regCode.includes(oldAccountState)) {
  regCode = regCode.replace(oldAccountState, newAccountState);
  console.log('✓ Updated accountType default to couple');
} else {
  console.log('Could not find oldAccountState');
}

// Update the toggle buttons at the top of the registration card to be prominent & high-end
const oldToggle = `          {/* Segmented Mode Toggle: MC vs Couple */}
          <div className="flex bg-[#f0ebe3] p-1 rounded-md mb-6">
            <button
              type="button"
              onClick={() => setAccountType('mc')}
              className={\`flex-1 py-2 text-xs font-bold rounded transition-all cursor-pointer \${
                accountType === 'mc'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                  : 'text-[#8b7b6b] hover:text-[#15110e]'
              }\`}
            >
              I'm an MC / Planner
            </button>
            <button
              type="button"
              onClick={() => setAccountType('couple')}
              className={\`flex-1 py-2 text-xs font-bold rounded transition-all cursor-pointer \${
                accountType === 'couple'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                  : 'text-[#8b7b6b] hover:text-[#15110e]'
              }\`}
            >
              I'm a Couple
            </button>
          </div>`;

const newToggle = `          {/* Prominent Account Mode Selector */}
          <div className="grid grid-cols-2 gap-2 bg-[#f0ebe3] p-1.5 rounded-xl mb-6 border border-[#e2d8cb]">
            <button
              type="button"
              onClick={() => {
                setAccountType('couple');
                window.location.hash = 'register';
              }}
              className={\`py-2.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 \${
                accountType === 'couple'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-md ring-1 ring-[#bd9661]'
                  : 'text-[#6b5847] hover:text-[#15110e] hover:bg-[#e8ded0]/50'
              }\`}
            >
              <span className="text-base">👰🤵</span>
              <div className="text-left">
                <div className="leading-tight font-bold">Couple Portal</div>
                <div className="text-[10px] font-normal opacity-75">Groom &amp; Bride Registration</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setAccountType('mc');
                window.location.hash = 'register-mc';
              }}
              className={\`py-2.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 \${
                accountType === 'mc'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-md ring-1 ring-[#bd9661]'
                  : 'text-[#6b5847] hover:text-[#15110e] hover:bg-[#e8ded0]/50'
              }\`}
            >
              <span className="text-base">🎙️</span>
              <div className="text-left">
                <div className="leading-tight font-bold">MC / Planner</div>
                <div className="text-[10px] font-normal opacity-75">Business &amp; ABN Account</div>
              </div>
            </button>
          </div>`;

if (regCode.includes(oldToggle)) {
  regCode = regCode.replace(oldToggle, newToggle);
  console.log('✓ Updated mode toggle in RegisterView.tsx');
} else {
  console.log('Could not find oldToggle in RegisterView.tsx');
}

fs.writeFileSync(regPath, regCode, 'utf8');
console.log('✓ Saved RegisterView.tsx');
