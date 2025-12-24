import * as bcrypt from 'bcryptjs';

async function generatePinHash() {
  const pin = '1234';
  const hash = await bcrypt.hash(pin, 10);
  
  console.log('\n=== PIN Hash Generated ===');
  console.log('PIN:', pin);
  console.log('Hash:', hash);
  console.log('\n=== SQL to Insert Test User ===');
  console.log(`
INSERT INTO users (phone, name, pin)
VALUES (
  '+256781234567',
  'Test User',
  '${hash}'
);
  `);
  console.log('\n=== To verify it works ===');
  const isValid = await bcrypt.compare(pin, hash);
  console.log('Verification test:', isValid ? '✅ PASS' : '❌ FAIL');
}

generatePinHash();
