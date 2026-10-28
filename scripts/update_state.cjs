const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'lib', 'state.ts');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  "export function setDemoSessionForRole(role: 'mc' | 'couple' | 'superadmin')",
  "export function setDemoSessionForRole(role: 'mc' | 'couple' | 'superadmin' | 'planner')"
);

const superAdminBlockEnd = "email: 'admin@tapandtoast.demo',\r\n      name: 'Platform Admin',\r\n      keepSignedIn: true,\r\n      at: Date.now()\r\n    };\r\n  } else {";
const superAdminBlockEndLF = "email: 'admin@tapandtoast.demo',\n      name: 'Platform Admin',\n      keepSignedIn: true,\n      at: Date.now()\n    };\n  } else {";

const plannerAddition = `email: 'admin@tapandtoast.demo',
      name: 'Platform Admin',
      keepSignedIn: true,
      at: Date.now()
    };
  } else if (role === 'planner') {
    user = {
      role: 'planner',
      email: 'anthony@rossievents.demo',
      name: 'Anthony Rossi',
      businessName: 'Rossi Event Management & Planning',
      keepSignedIn: true,
      at: Date.now()
    };
  } else {`;

if (content.includes(superAdminBlockEnd)) {
  content = content.replace(superAdminBlockEnd, plannerAddition.replace(/\n/g, '\r\n'));
} else if (content.includes(superAdminBlockEndLF)) {
  content = content.replace(superAdminBlockEndLF, plannerAddition);
} else {
  console.log('Searching for regex match');
  content = content.replace(
    /(name:\s*'Platform Admin'[\s\S]*?at:\s*Date\.now\(\)\s*\}\;\s*\}\s*else\s*\{)/,
    `name: 'Platform Admin',\n      keepSignedIn: true,\n      at: Date.now()\n    };\n  } else if (role === 'planner') {\n    user = {\n      role: 'planner',\n      email: 'anthony@rossievents.demo',\n      name: 'Anthony Rossi',\n      businessName: 'Rossi Event Management & Planning',\n      keepSignedIn: true,\n      at: Date.now()\n    };\n  } else {`
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated state.ts');
