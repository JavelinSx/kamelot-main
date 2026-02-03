const fs = require('fs');

const html = fs.readFileSync('lighthouse.html', 'utf8');
const match = html.match(/window\.__LIGHTHOUSE_JSON__ = ({.*?});<\/script>/s);
const data = JSON.parse(match[1]);

console.log('=== DETAILED ANALYSIS ===\n');

// Text compression
console.log('1. FILES WITHOUT COMPRESSION:');
const compression = data.audits['uses-text-compression'];
if (compression && compression.details && compression.details.items) {
  compression.details.items.slice(0, 10).forEach(item => {
    console.log(`   ${item.url.substring(item.url.lastIndexOf('/') + 1)} - ${Math.round(item.totalBytes / 1024)} KB -> ${Math.round(item.wastedBytes / 1024)} KB savings`);
  });
}

// Unminified JavaScript
console.log('\n2. UNMINIFIED JAVASCRIPT:');
const unminified = data.audits['unminified-javascript'];
if (unminified && unminified.details && unminified.details.items) {
  unminified.details.items.slice(0, 10).forEach(item => {
    console.log(`   ${item.url.substring(item.url.lastIndexOf('/') + 1)} - ${Math.round(item.wastedBytes / 1024)} KB savings`);
  });
}

// Unused JavaScript
console.log('\n3. UNUSED JAVASCRIPT:');
const unused = data.audits['unused-javascript'];
if (unused && unused.details && unused.details.items) {
  unused.details.items.slice(0, 10).forEach(item => {
    console.log(`   ${item.url.substring(item.url.lastIndexOf('/') + 1)} - ${Math.round(item.wastedBytes / 1024)} KB savings`);
  });
}

// Images
console.log('\n4. IMAGE PROBLEMS:');
const modernFormats = data.audits['modern-image-formats'];
if (modernFormats && modernFormats.details && modernFormats.details.items) {
  console.log('   Modern formats needed:');
  modernFormats.details.items.slice(0, 5).forEach(item => {
    console.log(`   - ${item.url.substring(item.url.lastIndexOf('/') + 1)} - ${Math.round(item.wastedBytes / 1024)} KB savings`);
  });
}

const imageSize = data.audits['uses-responsive-images'];
if (imageSize && imageSize.details && imageSize.details.items) {
  console.log('\n   Wrong image sizes:');
  imageSize.details.items.slice(0, 5).forEach(item => {
    console.log(`   - ${item.url.substring(item.url.lastIndexOf('/') + 1)} - ${Math.round(item.wastedBytes / 1024)} KB savings`);
  });
}

// Render blocking
console.log('\n5. RENDER-BLOCKING RESOURCES:');
const renderBlocking = data.audits['render-blocking-resources'];
if (renderBlocking && renderBlocking.details && renderBlocking.details.items) {
  renderBlocking.details.items.forEach(item => {
    console.log(`   ${item.url.substring(item.url.lastIndexOf('/') + 1)} - ${Math.round(item.wastedMs)} ms`);
  });
}

// Duplicate modules
console.log('\n6. DUPLICATE MODULES:');
const duplicates = data.audits['duplicated-javascript'];
if (duplicates && duplicates.details && duplicates.details.items) {
  duplicates.details.items.forEach(item => {
    console.log(`   ${item.source} - ${Math.round(item.wastedBytes / 1024)} KB wasted`);
  });
}

// Main thread work
console.log('\n7. MAIN THREAD WORK:');
const mainThread = data.audits['mainthread-work-breakdown'];
if (mainThread && mainThread.details && mainThread.details.items) {
  mainThread.details.items.slice(0, 5).forEach(item => {
    console.log(`   ${item.groupLabel}: ${Math.round(item.duration)} ms`);
  });
}
