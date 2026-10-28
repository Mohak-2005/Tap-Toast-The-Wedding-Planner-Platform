import fs from 'fs';

// ----------------------------------------------------------------------
// 1. PATCH REGISTERVIEW.TSX
// ----------------------------------------------------------------------
const regPath = 'src/components/RegisterView.tsx';
let regContent = fs.readFileSync(regPath, 'utf8');
let regNorm = regContent.replace(/\r\n/g, '\n');

// A. Hide left hero on mobile
const regHeroTarget = `      {/* Left Hero Panel */}
      <div className="bg-[#15110e] text-[#f8f6f2] p-10 md:p-14 flex flex-col justify-center items-center text-center border-r border-[#29211a] relative">`;

const regHeroReplacement = `      {/* Left Hero Panel (Desktop Only) */}
      <div className="hidden md:flex bg-[#15110e] text-[#f8f6f2] p-10 md:p-14 flex-col justify-center items-center text-center border-r border-[#29211a] relative">`;

if (regNorm.includes(regHeroTarget)) {
  regNorm = regNorm.replace(regHeroTarget, regHeroReplacement);
  console.log('Reg 1: Hero made hidden on mobile');
} else {
  console.error('Reg 1 NOT found!');
}

// B. Mobile friendly right container & card padding + mobile header
const regContainerTarget = `      {/* Right Form Container */}
      <div className="bg-[#f8f6f2] p-6 md:p-10 flex items-start justify-center overflow-y-auto">
        <div className={\`bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-lg w-full \${accountType === 'couple' ? 'max-w-[580px]' : 'max-w-[480px]'} p-8 md:p-9 shadow-md relative my-4 transition-all duration-200\`}>`;

const regContainerReplacement = `      {/* Right Form Container */}
      <div className="bg-[#f8f6f2] px-3.5 py-4 sm:px-6 md:p-10 flex flex-col items-center justify-start overflow-y-auto w-full">
        {/* Mobile Header Banner */}
        <div className="md:hidden flex flex-col items-center justify-center text-center mb-4 w-full max-w-[580px] pt-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 border-[1.5px] border-[#bd9661] rounded-[4px] flex items-center justify-center text-[#bd9661] font-serif font-bold text-base bg-[#15110e]">
              T
            </div>
            <div className="font-serif text-xl font-bold text-[#15110e] tracking-[0.5px]">
              Tap &amp; Toast
            </div>
          </div>
          <p className="text-[11px] text-[#8b7b6b] font-medium">
            Every wedding, beautifully run
          </p>
        </div>

        <div className={\`bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-2xl w-full \${accountType === 'couple' ? 'max-w-[580px]' : 'max-w-[480px]'} p-4 sm:p-7 md:p-9 shadow-sm relative my-1 sm:my-3 transition-all duration-200\`}>`;

if (regNorm.includes(regContainerTarget)) {
  regNorm = regNorm.replace(regContainerTarget, regContainerReplacement);
  console.log('Reg 2: Responsive container and card padding applied');
} else {
  console.error('Reg 2 NOT found!');
}

// C. Remove the shared account message box completely
const regSharedBoxTarget = `              {/* Couple Dual Email / Shared Account Notice */}
              <div className="bg-[#faf6ee] border border-[#ebd4b7] rounded-lg p-3.5 flex items-start gap-3 shadow-2xs">
                <span className="text-2xl shrink-0">👫</span>
                <div className="text-xs text-[#544332] leading-snug">
                  <strong className="text-[#15110e] block font-serif font-bold text-sm mb-0.5">
                    Shared Couple Account &bull; Dual Partner Emails
                  </strong>
                  Bride and Groom each register their own individual email address. Both partners will have full access to log into this exact same shared wedding portal.
                </div>
              </div>
`;

if (regNorm.includes(regSharedBoxTarget)) {
  regNorm = regNorm.replace(regSharedBoxTarget, '');
  console.log('Reg 3: Shared account message box removed');
} else {
  console.error('Reg 3 NOT found!');
}

// D. Make Optional Venue message small
const regVenueTarget = `                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    CEREMONY &amp; RECEPTION VENUE <span className="text-[#bd9661] font-normal normal-case">(OPTIONAL — Can be confirmed later)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Optional — e.g. Fernwood Estate, Hunter Valley (can be set later)"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />`;

const regVenueReplacement = `                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    CEREMONY &amp; RECEPTION VENUE <span className="text-[10px] text-[#8b7b6b] font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fernwood Estate, Hunter Valley (optional)"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 text-sm text-[#15110e] outline-none"
                  />`;

if (regNorm.includes(regVenueTarget)) {
  regNorm = regNorm.replace(regVenueTarget, regVenueReplacement);
  console.log('Reg 4: Venue optional label made small and subtle');
} else {
  console.error('Reg 4 NOT found!');
}

fs.writeFileSync(regPath, regNorm, 'utf8');
console.log('RegisterView.tsx successfully updated!');

// ----------------------------------------------------------------------
// 2. PATCH LOGINVIEW.TSX
// ----------------------------------------------------------------------
const loginPath = 'src/components/LoginView.tsx';
let loginContent = fs.readFileSync(loginPath, 'utf8');
let loginNorm = loginContent.replace(/\r\n/g, '\n');

// A. Hide left hero on mobile
const loginHeroTarget = `      {/* Left Hero Panel */}
      <div className="bg-[#15110e] text-[#f8f6f2] p-10 md:p-14 flex flex-col justify-center items-center text-center border-r border-[#29211a] relative">`;

const loginHeroReplacement = `      {/* Left Hero Panel (Desktop Only) */}
      <div className="hidden md:flex bg-[#15110e] text-[#f8f6f2] p-10 md:p-14 flex-col justify-center items-center text-center border-r border-[#29211a] relative">`;

if (loginNorm.includes(loginHeroTarget)) {
  loginNorm = loginNorm.replace(loginHeroTarget, loginHeroReplacement);
  console.log('Login 1: Hero made hidden on mobile');
} else {
  console.error('Login 1 NOT found!');
}

// B. Mobile friendly right container & card padding + mobile header
const loginContainerTarget = `      {/* Right Form Container */}
      <div className="bg-[#f8f6f2] p-8 md:p-12 flex items-center justify-center overflow-y-auto">
        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-lg w-full max-w-[480px] p-9 shadow-md relative">`;

const loginContainerReplacement = `      {/* Right Form Container */}
      <div className="bg-[#f8f6f2] px-3.5 py-6 sm:px-6 md:p-12 flex flex-col items-center justify-center overflow-y-auto w-full">
        {/* Mobile Header Banner */}
        <div className="md:hidden flex flex-col items-center justify-center text-center mb-5 w-full max-w-[460px] pt-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 border-[1.5px] border-[#bd9661] rounded-[4px] flex items-center justify-center text-[#bd9661] font-serif font-bold text-base bg-[#15110e]">
              T
            </div>
            <div className="font-serif text-xl font-bold text-[#15110e] tracking-[0.5px]">
              Tap &amp; Toast
            </div>
          </div>
          <p className="text-[11px] text-[#8b7b6b] font-medium">
            Every wedding, beautifully run
          </p>
        </div>

        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-2xl w-full max-w-[460px] p-5 sm:p-7 md:p-9 shadow-sm relative">`;

if (loginNorm.includes(loginContainerTarget)) {
  loginNorm = loginNorm.replace(loginContainerTarget, loginContainerReplacement);
  console.log('Login 2: Responsive container and card padding applied');
} else {
  console.error('Login 2 NOT found!');
}

fs.writeFileSync(loginPath, loginNorm, 'utf8');
console.log('LoginView.tsx successfully updated!');
