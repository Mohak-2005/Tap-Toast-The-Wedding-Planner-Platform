import fs from 'fs';

let content = fs.readFileSync('src/lib/seedData.ts', 'utf8');
content = content.replace(/\r\n/g, '\n');

const target = '      giftingPresets: [50, 100, 150, 250],';
const replacement = `      giftingPresets: [50, 100, 150, 250],
      savedSeatingArrangements: [
        {
          id: 'arr_1',
          weddingId: 'w1',
          name: 'Seating Arrangement 1 (Classic Ballroom)',
          savedAt: '2026-10-25 11:30',
          savedBy: 'Sophie & James (Couple)',
          role: 'couple',
          notes: 'Classic banquet layout with central dance floor and balanced round/rectangle tables',
          tables: [
            { id: 'head', weddingId: 'w1', name: 'HEAD TABLE', capacity: 8, isHead: true, shape: 'king', category: 'Bridal Party', zone: 'Stage & VIP Wing', x: 50, y: 15 },
            { id: 'table_1', weddingId: 'w1', name: 'Table 1', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 25, y: 35 },
            { id: 'table_2', weddingId: 'w1', name: 'Table 2', capacity: 8, isHead: false, shape: 'round', category: 'Family', zone: 'Left Terrace', x: 40, y: 35 },
            { id: 'table_3', weddingId: 'w1', name: 'Table 3', capacity: 8, isHead: false, shape: 'rectangular', category: 'Friends', zone: 'Right Garden', x: 60, y: 35 },
            { id: 'table_4', weddingId: 'w1', name: 'Table 4', capacity: 8, isHead: false, shape: 'round', category: 'Family', zone: 'Right Garden', x: 75, y: 35 },
            { id: 'table_5', weddingId: 'w1', name: 'Table 5', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Left Terrace', x: 25, y: 65 },
            { id: 'table_6', weddingId: 'w1', name: 'Table 6', capacity: 8, isHead: false, shape: 'rectangular', category: 'Family', zone: 'Center Ballroom', x: 40, y: 65 },
            { id: 'table_7', weddingId: 'w1', name: 'Table 7', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 60, y: 65 }
          ],
          guestAssignments: [
            { guestId: 'g1', tableId: 'head', seatIndex: 0 },
            { guestId: 'g2', tableId: 'head', seatIndex: 1 },
            { guestId: 'g3', tableId: 'head', seatIndex: 2 },
            { guestId: 'g4', tableId: 'head', seatIndex: 3 },
            { guestId: 'g5', tableId: 'table_1', seatIndex: 0 },
            { guestId: 'g6', tableId: 'table_1', seatIndex: 1 },
            { guestId: 'g7', tableId: 'table_2', seatIndex: 0 },
            { guestId: 'g8', tableId: 'table_2', seatIndex: 1 },
            { guestId: 'g9', tableId: 'table_3', seatIndex: 0 },
            { guestId: 'g10', tableId: 'table_4', seatIndex: 0 }
          ]
        },
        {
          id: 'arr_2',
          weddingId: 'w1',
          name: 'Arrangement 2 (MC Pacing Optimized)',
          savedAt: '2026-10-25 16:45',
          savedBy: 'Robert Galati (MC)',
          role: 'mc',
          notes: 'VIP family tables closer to bridal stage for smooth microphone handover during speeches',
          tables: [
            { id: 'head', weddingId: 'w1', name: 'HEAD TABLE', capacity: 8, isHead: true, shape: 'king', category: 'Bridal Party', zone: 'Stage & VIP Wing', x: 50, y: 12 },
            { id: 'table_2', weddingId: 'w1', name: 'Table 2 (Family VIP)', capacity: 8, isHead: false, shape: 'round', category: 'Family', zone: 'VIP Stage Left', x: 28, y: 28 },
            { id: 'table_4', weddingId: 'w1', name: 'Table 4 (Family VIP)', capacity: 8, isHead: false, shape: 'round', category: 'Family', zone: 'VIP Stage Right', x: 72, y: 28 },
            { id: 'table_1', weddingId: 'w1', name: 'Table 1', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 22, y: 48 },
            { id: 'table_3', weddingId: 'w1', name: 'Table 3', capacity: 8, isHead: false, shape: 'rectangular', category: 'Friends', zone: 'Right Garden', x: 78, y: 48 },
            { id: 'table_5', weddingId: 'w1', name: 'Table 5', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Left Terrace', x: 28, y: 72 },
            { id: 'table_6', weddingId: 'w1', name: 'Table 6', capacity: 8, isHead: false, shape: 'rectangular', category: 'Family', zone: 'Center Ballroom', x: 50, y: 74 },
            { id: 'table_7', weddingId: 'w1', name: 'Table 7', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 72, y: 72 }
          ],
          guestAssignments: [
            { guestId: 'g1', tableId: 'head', seatIndex: 0 },
            { guestId: 'g2', tableId: 'head', seatIndex: 1 },
            { guestId: 'g3', tableId: 'head', seatIndex: 2 },
            { guestId: 'g4', tableId: 'head', seatIndex: 3 },
            { guestId: 'g7', tableId: 'table_2', seatIndex: 0 },
            { guestId: 'g8', tableId: 'table_2', seatIndex: 1 },
            { guestId: 'g10', tableId: 'table_4', seatIndex: 0 },
            { guestId: 'g5', tableId: 'table_1', seatIndex: 0 },
            { guestId: 'g6', tableId: 'table_1', seatIndex: 1 },
            { guestId: 'g9', tableId: 'table_3', seatIndex: 0 }
          ]
        }
      ],`;

if (!content.includes(target)) {
  console.error('Target not found in seedData.ts');
  process.exit(1);
}

content = content.replace(target, replacement);
fs.writeFileSync('src/lib/seedData.ts', content, 'utf8');
console.log('Successfully updated seedData.ts');
