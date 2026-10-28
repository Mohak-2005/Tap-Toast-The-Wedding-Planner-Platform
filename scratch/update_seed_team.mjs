import fs from 'fs';

const file = 'src/lib/seedData.ts';
let c = fs.readFileSync(file, 'utf8');

const sIdx = c.indexOf('team: [');
const eIdx = c.indexOf('referralCodes: [');

const newTeam = `team: [
    {
      id: "tm_1",
      name: "Robert Galati",
      role: "Lead MC & Director",
      email: "robert@galati.demo",
      phone: "0418 223 901",
      status: "Active",
      accessLevel: "Full Access",
      assignedWeddings: ["all"],
      permissions: { canEditRunsheet: true, canEditSeating: true, canViewDietary: true, canMessageClients: true }
    },
    {
      id: "tm_2",
      name: "Sarah Jenkins",
      role: "Associate MC & Host",
      email: "sarah.j@galati.demo",
      phone: "0422 110 882",
      status: "Active",
      accessLevel: "Host & Run Sheet",
      assignedWeddings: ["wed_1", "wed_2"],
      permissions: { canEditRunsheet: true, canEditSeating: false, canViewDietary: true, canMessageClients: true }
    },
    {
      id: "tm_3",
      name: "Dave Miller",
      role: "Sound Engineer & AV Lead",
      email: "dave.sound@galati.demo",
      phone: "0433 991 445",
      status: "Active",
      accessLevel: "Audio & AV Lead",
      assignedWeddings: ["all"],
      permissions: { canEditRunsheet: false, canEditSeating: false, canViewDietary: false, canMessageClients: false }
    }
  ],
  `;

c = c.slice(0, sIdx) + newTeam + c.slice(eIdx);
fs.writeFileSync(file, c, 'utf8');
console.log('Updated team in seedData.ts');
