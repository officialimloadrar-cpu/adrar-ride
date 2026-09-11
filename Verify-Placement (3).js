const fs = require('fs');
const path = require('path');

const base = './src';

const checks = [
  { file: 'shared/lib/shift.ts', mustContain: ['NIGHT_MULTIPLIER = 1.25', 'NIGHT_START = 21', 'BASE_PRICING'], mustNotContain: [] },
  { file: 'features/ride/ui/RideRequest.tsx', mustContain: ['getIsNight', 'getPricing'], mustNotContain: [] },
  { file: 'features/colis/ui/ColisRequest.tsx', mustContain: ["getPricing('colis', false)", 'is_night: false'], mustNotContain: ['getIsNight'] },
  { file: 'features/cargo/ui/CargoRequest.tsx', mustContain: ["getPricing('cargo', false)", 'is_night: false'], mustNotContain: ['getIsNight'] },
  { file: 'features/rental/ui/RentalRequest.tsx', mustContain: ["getPricing('rental', false)", 'is_night: false'], mustNotContain: ['getIsNight'] },
  { file: 'features/makla/ui/MaklaRequest.tsx', mustContain: ["getPricing('makla', false)", 'is_night: false'], mustNotContain: ['getIsNight'] },
  { file: 'pages/AdrarPage.tsx', mustContain: ['ColisRequest', 'CargoRequest', 'RentalRequest', 'MaklaRequest', 'RideRequest'], mustNotContain: [] },
];

let allOk = true;

checks.forEach(c => {
  const fullPath = path.join(base, c.file);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ MISSING: ${c.file}`);
    allOk = false;
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  let ok = true;
  c.mustContain.forEach(str => {
    if (!content.includes(str)) {
      console.log(`❌ ${c.file} -> missing: ${str}`);
      ok = false;
      allOk = false;
    }
  });
  c.mustNotContain.forEach(str => {
    if (content.includes(str)) {
      console.log(`❌ ${c.file} -> should NOT contain: ${str}`);
      ok = false;
      allOk = false;
    }
  });
  if (ok) console.log(`✅ OK: ${c.file}`);
});

if (allOk) console.log('\n🎉 كل شيء في مكانه الصحيح!');
else console.log('\n⚠️ يوجد أخطاء، راجع القائمة فوق');
