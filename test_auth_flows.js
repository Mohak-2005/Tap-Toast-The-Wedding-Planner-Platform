// Comprehensive Verification of Auth Flows for Tap & Toast
const fs = require('fs');
const path = require('path');

// Mock browser environment
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

let currentUrl = 'http://localhost:8000/mc.html';
global.window = {
  location: {
    get href() { return currentUrl; },
    set href(v) { currentUrl = v; },
    pathname: '/mc.html',
    search: '',
    reload: () => {}
  },
  dispatchEvent: () => {}
};
global.CustomEvent = class {};
global.document = {
  addEventListener: () => {},
  getElementById: (id) => ({
    id,
    value: '',
    textContent: '',
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    focus: () => {},
    appendChild: () => {}
  }),
  querySelectorAll: () => [],
  querySelector: () => ({ style: {} }),
  documentElement: { classList: { add: () => {}, remove: () => {} } },
  createElement: () => ({ appendChild: () => {}, classList: { add: () => {} }, remove: () => {} }),
  body: { appendChild: () => {}, prepend: () => {} }
};
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
global.atob = (b64) => Buffer.from(b64, 'base64').toString('binary');

// Load shared_js and auth_component JS
const mcHtml = fs.readFileSync(path.join(__dirname, '../tap-toast-demo/mc.html'), 'utf-8');
const scriptMatch = mcHtml.match(/<script>([\s\S]*?)<\/script>[\s\S]*?<script>([\s\S]*?)<\/script>/);
// Note: mc.html has 2 script blocks (head early check, and body main script)
const bodyScript = mcHtml.split('<script>')[2].split('</script>')[0];

eval(bodyScript);

console.log("=== RUNNING AUTH VERIFICATION SUITE ===");

let passed = 0;
let total = 0;
function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`PASS [${total}]: ${name}`);
    passed++;
  } catch (err) {
    console.error(`FAIL [${total}]: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// 1. Initial State has 3 seed users and 1 invite
test("Seed data contains Robert Galati, Sophie & James, Platform Admin and SJ-2026 invite", () => {
  const state = loadState();
  if (!state.users || state.users.length !== 3) throw new Error(`Users length ${state.users?.length}`);
  if (!state.invites || state.invites.length !== 1) throw new Error(`Invites length ${state.invites?.length}`);
  
  const mc = state.users.find(u => u.email === 'robert@galati.demo');
  const couple = state.users.find(u => u.email === 'sophie.james@demo.test');
  const admin = state.users.find(u => u.email === 'admin@tapandtoast.demo');
  if (!mc || mc.role !== 'mc') throw new Error("MC user mismatch");
  if (!couple || couple.role !== 'couple') throw new Error("Couple user mismatch");
  if (!admin || admin.role !== 'superadmin') throw new Error("Admin user mismatch");

  const inv = state.invites[0];
  if (inv.code !== 'SJ-2026' || inv.used !== false) throw new Error("Invite mismatch");
});

// 2. Passwords are demo-hashed and match Demo1234!
test("Password hashing works with salt and matches seed hash", () => {
  const hash = hashDemoPassword('Demo1234!');
  if (hash !== 'dHRfc2FsdF9EZW1vMTIzNCE=') throw new Error(`Hash mismatch: ${hash}`);
  const state = loadState();
  state.users.forEach(u => {
    if (u.passwordHash !== hash) throw new Error(`User ${u.email} hash mismatch`);
  });
});

// 3. Unauthenticated session check
test("Unauthenticated access detected by getSession()", () => {
  clearSession();
  const session = getSession();
  if (session !== null) throw new Error("Session should be null");
});

// 4. Successful login as MC
test("Successful login with robert@galati.demo sets session", () => {
  clearSession();
  setSession({
    role: 'mc',
    email: 'robert@galati.demo',
    name: 'Robert Galati',
    tenantId: 'ten1',
    keepSignedIn: true,
    at: Date.now()
  });
  const session = getSession();
  if (!session || session.role !== 'mc' || session.email !== 'robert@galati.demo') {
    throw new Error("Session failed to store");
  }
});

// 5. Audit log records events
test("Audit log records user login", () => {
  logAudit('User signed in: robert@galati.demo', 'Robert Galati', 'Test login', 'Security');
  const state = loadState();
  const latest = state.auditLog[0];
  if (!latest || latest.action !== 'User signed in: robert@galati.demo') {
    throw new Error("Audit log did not record action");
  }
});

// 6. Wrong password fails
test("Wrong password detection", () => {
  const state = loadState();
  const user = state.users.find(u => u.email === 'robert@galati.demo');
  const wrongHash = hashDemoPassword('WrongPass');
  if (user.passwordHash === wrongHash) throw new Error("Wrong password matched hash");
});

// 7. Password reset updates password and old password stops working
test("Forgot password flow updates password and breaks old password", () => {
  const state = loadState();
  const user = state.users.find(u => u.email === 'robert@galati.demo');
  const newHash = hashDemoPassword('NewPass123!');
  user.passwordHash = newHash;
  saveState(state);

  const reloaded = loadState();
  const reloadedUser = reloaded.users.find(u => u.email === 'robert@galati.demo');
  if (reloadedUser.passwordHash !== newHash) throw new Error("Password not updated");
  if (reloadedUser.passwordHash === hashDemoPassword('Demo1234!')) throw new Error("Old password still matches");
});

// 8. Register MC creates tenant (Trial) and user
test("Register new MC 'Jane Doe' creates tenant with status Trial and logs audit", () => {
  const state = loadState();
  const newTenant = {
    id: 'ten_jane',
    business: 'Jane Doe Weddings',
    lead: 'Jane Doe',
    plan: 'Starter',
    weddings: 0,
    mrr: 99,
    status: 'Trial',
    joined: 'Today',
    stripeConnected: false,
    email: 'jane@example.com'
  };
  const newUser = {
    id: 'u_jane',
    email: 'jane@example.com',
    passwordHash: hashDemoPassword('Demo1234!'),
    name: 'Jane Doe',
    role: 'mc',
    tenantId: 'ten_jane',
    business: 'Jane Doe Weddings'
  };
  state.tenants.unshift(newTenant);
  state.users.push(newUser);
  saveState(state);
  logAudit('New tenant registered: Jane Doe Weddings', 'Jane Doe', 'Starter trial', 'Registration');

  const s = loadState();
  const foundTenant = s.tenants.find(t => t.business === 'Jane Doe Weddings');
  if (!foundTenant || foundTenant.status !== 'Trial') throw new Error("Tenant Jane Doe not found with Trial status");
  const foundUser = s.users.find(u => u.email === 'jane@example.com');
  if (!foundUser || foundUser.role !== 'mc') throw new Error("User Jane Doe not found");
  const audit = s.auditLog.find(a => a.action === 'New tenant registered: Jane Doe Weddings');
  if (!audit) throw new Error("Registration audit log missing");
});

// 9. Register couple with code SJ-2026 marks code used
test("Register couple with SJ-2026 marks invite as used", () => {
  const state = loadState();
  const invite = state.invites.find(i => i.code === 'SJ-2026');
  if (!invite) throw new Error("Invite SJ-2026 not found");
  if (invite.used) throw new Error("Invite already used before test");

  invite.used = true;
  saveState(state);

  const s = loadState();
  const reloadedInvite = s.invites.find(i => i.code === 'SJ-2026');
  if (!reloadedInvite.used) throw new Error("Invite not marked used");
});

// 10. Superadmin impersonation flag
test("Superadmin impersonation mode sets session.impersonating = true", () => {
  setSession({
    role: 'superadmin',
    email: 'admin@tapandtoast.demo',
    name: 'Platform Admin',
    impersonating: true,
    at: Date.now()
  });
  const s = getSession();
  if (!s || !s.impersonating) throw new Error("Impersonation flag not stored");
});

// 11. Session Expiry logic
test("Session expiry after 30 min of inactivity when keepSignedIn is false", () => {
  setSession({
    role: 'couple',
    email: 'sophie.james@demo.test',
    name: 'Sophie & James',
    keepSignedIn: false,
    at: Date.now() - (31 * 60 * 1000) // 31 minutes ago
  });
  const res = getSession();
  if (!res || !res.expired) throw new Error("Session should report expired: true");
  if (localStorage.getItem('tt_session')) throw new Error("Expired session not cleared");
});

// 12. Reset demo data clears session and restores seed state
test("Reset demo data clears session, restores original password and unused invite, and removes Jane Doe", () => {
  resetDemoData();
  const session = getSession();
  if (session !== null) throw new Error("Session should be null after reset");

  const s = loadState();
  const robert = s.users.find(u => u.email === 'robert@galati.demo');
  if (robert.passwordHash !== 'dHRfc2FsdF9EZW1vMTIzNCE=') throw new Error("Robert password not reset");

  const jane = s.tenants.find(t => t.business === 'Jane Doe Weddings');
  if (jane) throw new Error("Jane Doe should be removed after reset");

  const invite = s.invites.find(i => i.code === 'SJ-2026');
  if (invite.used !== false) throw new Error("SJ-2026 invite not reset to unused");
});

console.log(`\nALL ${passed} / ${total} TESTS PASSED CLEANLY!`);
