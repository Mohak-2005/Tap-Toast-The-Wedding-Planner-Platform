const fs = require('fs');
const path = require('path');

// 1. Update DemoBar.tsx
const demobarPath = path.join(__dirname, '..', 'src', 'components', 'DemoBar.tsx');
let demobar = fs.readFileSync(demobarPath, 'utf8');

if (!demobar.includes("id: 'planner'")) {
  demobar = demobar.replace(
    "{ id: 'couple', label: 'Couple Dashboard', role: 'couple' },",
    "{ id: 'couple', label: 'Couple Dashboard', role: 'couple' },\r\n    { id: 'planner', label: 'Wedding Planner', role: 'planner' },"
  );
  if (!demobar.includes("id: 'planner'")) {
    demobar = demobar.replace(
      "{ id: 'couple', label: 'Couple Dashboard', role: 'couple' },",
      "{ id: 'couple', label: 'Couple Dashboard', role: 'couple' },\n    { id: 'planner', label: 'Wedding Planner', role: 'planner' },"
    );
  }
  fs.writeFileSync(demobarPath, demobar, 'utf8');
  console.log('Updated DemoBar.tsx with Wedding Planner');
} else {
  console.log('DemoBar.tsx already has planner');
}

// 2. Update App.tsx
const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
let app = fs.readFileSync(appPath, 'utf8');

if (!app.includes("import PlannerView")) {
  app = app.replace(
    "import RegisterView from './components/RegisterView';",
    "import RegisterView from './components/RegisterView';\r\nimport PlannerView from './components/PlannerView';"
  );
  if (!app.includes("import PlannerView")) {
    app = app.replace(
      "import RegisterView from './components/RegisterView';",
      "import RegisterView from './components/RegisterView';\nimport PlannerView from './components/PlannerView';"
    );
  }
}

if (!app.includes("'planner'")) {
  app = app.replace(
    "'couple',",
    "'couple',\r\n      'planner',"
  );
  if (!app.includes("'planner'")) {
    app = app.replace(
      "'couple',",
      "'couple',\n      'planner',"
    );
  }
}

if (!app.includes("<PlannerView")) {
  app = app.replace(
    "case 'couple':\r\n        return <CoupleView onSelectView={handleSelectView} />;",
    "case 'couple':\r\n        return <CoupleView onSelectView={handleSelectView} />;\r\n      case 'planner':\r\n        return <PlannerView onSelectView={handleSelectView} />;"
  );
  if (!app.includes("<PlannerView")) {
    app = app.replace(
      "case 'couple':\n        return <CoupleView onSelectView={handleSelectView} />;",
      "case 'couple':\n        return <CoupleView onSelectView={handleSelectView} />;\n      case 'planner':\n        return <PlannerView onSelectView={handleSelectView} />;"
    );
  }
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('Updated App.tsx with PlannerView');
