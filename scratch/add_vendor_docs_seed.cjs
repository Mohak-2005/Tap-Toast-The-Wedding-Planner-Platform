const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('src/lib/seedData.ts');
let content = fs.readFileSync(targetFile, 'utf8');

const docsSnippet = `      vendorDocuments: [
        {
          id: 'vdoc_1',
          weddingId: 'w1',
          vendorName: 'Willow & Wolf Cinematography',
          vendorCategory: 'Photography & Cinema',
          docType: 'insurance',
          title: 'Public Liability Certificate of Currency ($20M)',
          fileName: 'Willow_Wolf_Public_Liability_2026.pdf',
          fileSize: '1.4 MB',
          uploadedAt: '12 Oct 2026',
          expiryDate: '2027-04-30',
          policyNumber: 'PL-AU-883910-X',
          notes: 'Required by Fernwood Estate for drone operations and on-site crew coverage.',
          status: 'active',
        },
        {
          id: 'vdoc_2',
          weddingId: 'w1',
          vendorName: 'Fleur & Botanica Studio',
          vendorCategory: 'Florals & Styling',
          docType: 'insurance',
          title: 'Certificate of Currency - Public & Products Liability',
          fileName: 'Fleur_Botanica_Insurance_Cert.pdf',
          fileSize: '840 KB',
          uploadedAt: '18 Oct 2026',
          expiryDate: '2027-01-15',
          policyNumber: 'QBE-PL-99210-F',
          notes: 'Covers floral installation on the garden arch and pavilion chandeliers.',
          status: 'active',
        },
        {
          id: 'vdoc_3',
          weddingId: 'w1',
          vendorName: 'Fernwood Estate Culinary & Cellar',
          vendorCategory: 'Catering & Bar',
          docType: 'permit',
          title: 'NSW Food Authority Hygiene & Safety Accreditation',
          fileName: 'Fernwood_Food_Safety_Accreditation.pdf',
          fileSize: '2.1 MB',
          uploadedAt: '05 Sep 2026',
          expiryDate: '2027-08-20',
          policyNumber: 'NSW-FA-4491-CAT',
          notes: 'Certified commercial kitchen operation and liquor licensing compliance.',
          status: 'active',
        },
        {
          id: 'vdoc_4',
          weddingId: 'w1',
          vendorName: 'Groove & Brass Collective',
          vendorCategory: 'Music & Entertainment',
          docType: 'insurance',
          title: 'Public Liability Insurance Policy ($10M)',
          fileName: 'Groove_Brass_Insurance_Policy.pdf',
          fileSize: '950 KB',
          uploadedAt: '24 Sep 2026',
          expiryDate: '2026-12-31',
          policyNumber: 'ALLIANZ-AU-31092-B',
          notes: 'Covers PA sound gear, electrical cables, and stage equipment setup.',
          status: 'active',
        },
        {
          id: 'vdoc_5',
          weddingId: 'w1',
          vendorName: 'Highlands Luxury Chauffeurs',
          vendorCategory: 'Transport',
          docType: 'permit',
          title: 'Point to Point Transport Operator Accreditation',
          fileName: 'Highlands_Chauffeurs_Accreditation.pdf',
          fileSize: '1.1 MB',
          uploadedAt: '02 Nov 2026',
          expiryDate: '2027-06-30',
          policyNumber: 'P2P-NSW-7720-OP',
          notes: 'Bridal getaway car and 2 guest shuttle buses accreditation certificate.',
          status: 'active',
        },
      ],
`;

if (!content.includes('vendorDocuments: [')) {
  const insertMarker = 'danceFloorPos: { x: 50, y: 50 },';
  const idx = content.indexOf(insertMarker);
  if (idx !== -1) {
    content = content.slice(0, idx) + docsSnippet + content.slice(idx);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('Successfully added vendorDocuments to seedData.ts');
  } else {
    console.error('Could not find insertMarker in seedData.ts');
  }
} else {
  console.log('vendorDocuments already present in seedData.ts');
}
