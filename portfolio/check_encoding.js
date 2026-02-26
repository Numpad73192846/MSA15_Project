const fs = require('fs');
const iconv = require('./node_modules/iconv-lite') || null;

// Read as binary buffer
const buf = fs.readFileSync('src/main/resources/templates/index.html');

// Try to decode: PowerShell likely read UTF-8 as CP949, then wrote as UTF-8
// So we need: read as UTF-8 -> get mojibake string -> encode to CP949 -> decode as UTF-8
const text = buf.toString('utf8');

// Check if first line is OK
const firstLine = text.split('\n')[0];
console.log('First line:', firstLine);
console.log('File size:', buf.length, 'bytes');
console.log('Lines:', text.split('\n').length);

// Check meta description line for corruption
const lines = text.split('\n');
for (let i = 0; i < 15; i++) {
    console.log(`Line ${i + 1}: ${lines[i].substring(0, 80)}`);
}
