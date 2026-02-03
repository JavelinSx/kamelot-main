const fs = require('fs');

// Extract JSON from HTML
const html = fs.readFileSync('lighthouse.html', 'utf8');
const match = html.match(/window\.__LIGHTHOUSE_JSON__ = ({.*?});<\/script>/s);
if (!match) {
  console.error('Could not find Lighthouse data');
  process.exit(1);
}

const data = JSON.parse(match[1]);

const perf = data.categories.performance;
console.log('Performance Score:', Math.round(perf.score * 100));

console.log('\nKey Metrics:');
const metrics = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
  'interactive'
];

metrics.forEach(metric => {
  const audit = data.audits[metric];
  if (audit) {
    console.log(`- ${audit.title}: ${audit.displayValue || audit.score}`);
  }
});

console.log('\nOpportunities (что нужно исправить):');
const opportunities = Object.entries(data.audits)
  .filter(([k, v]) => v.details && v.details.type === 'opportunity' && v.score < 1)
  .sort((a, b) => (b[1].numericValue || 0) - (a[1].numericValue || 0))
  .slice(0, 10);

opportunities.forEach(([key, audit]) => {
  console.log(`- ${audit.title}`);
  console.log(`  Savings: ${audit.displayValue || 'N/A'}`);
});

console.log('\nDiagnostics:');
const diagnostics = Object.entries(data.audits)
  .filter(([k, v]) => v.details && v.score !== null && v.score < 1)
  .slice(0, 5);

diagnostics.forEach(([key, audit]) => {
  console.log(`- ${audit.title}: ${audit.displayValue || audit.score}`);
});
