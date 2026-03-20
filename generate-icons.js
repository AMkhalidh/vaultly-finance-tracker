const fs = require('fs');

const svg192 = `<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="40" fill="#7c6cfc"/>
  <polygon points="96,40 152,96 96,152 40,96" fill="none" stroke="white" stroke-width="12"/>
  <circle cx="96" cy="96" r="16" fill="white"/>
</svg>`;

const svg512 = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#7c6cfc"/>
  <polygon points="256,80 420,256 256,432 92,256" fill="none" stroke="white" stroke-width="28"/>
  <circle cx="256" cy="256" r="44" fill="white"/>
</svg>`;

fs.writeFileSync('/tmp/icon-192.svg', svg192);
fs.writeFileSync('/tmp/icon-512.svg', svg512);
console.log('SVG icons created');
