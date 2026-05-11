const fs = require('fs');
const path = require('path');

const createPNG = (width, height) => {
  const png = [];
  png.push(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A);
  
  const ihdr = [
    (width >> 24) & 0xFF, (width >> 16) & 0xFF, (width >> 8) & 0xFF, width & 0xFF,
    (height >> 24) & 0xFF, (height >> 16) & 0xFF, (height >> 8) & 0xFF, height & 0xFF,
    8, 6, 0, 0, 0
  ];
  const ihdrCrc = crc32([0x49, 0x48, 0x44, 0x52, ...ihdr]);
  png.push(0, 0, 0, 13);
  png.push(0x49, 0x48, 0x44, 0x52);
  png.push(...ihdr);
  png.push((ihdrCrc >> 24) & 0xFF, (ihdrCrc >> 16) & 0xFF, (ihdrCrc >> 8) & 0xFF, ihdrCrc & 0xFF);
  
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      const cx = width / 2, cy = height / 2;
      const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
      const maxDist = Math.min(width, height) / 2 - 4;
      if (dist <= maxDist) {
        rawData.push(30, 30, 30, 255);
      } else {
        rawData.push(26, 26, 26, 255);
      }
    }
  }
  
  const chunks = [];
  for (let i = 0; i < rawData.length; i += 65536) {
    chunks.push(rawData.slice(i, Math.min(i + 65536, rawData.length)));
  }
  
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idatCrc = crc32([0x49, 0x44, 0x41, 0x54, ...compressed]);
  const len = compressed.length;
  png.push((len >> 24) & 0xFF, (len >> 16) & 0xFF, (len >> 8) & 0xFF, len & 0xFF);
  png.push(0x49, 0x44, 0x41, 0x54);
  png.push(...compressed);
  png.push((idatCrc >> 24) & 0xFF, (idatCrc >> 16) & 0xFF, (idatCrc >> 8) & 0xFF, idatCrc & 0xFF);
  
  const iendCrc = crc32([0x49, 0x45, 0x4E, 0x44]);
  png.push(0, 0, 0, 0);
  png.push(0x49, 0x45, 0x4E, 0x44);
  png.push((iendCrc >> 24) & 0xFF, (iendCrc >> 16) & 0xFF, (iendCrc >> 8) & 0xFF, iendCrc & 0xFF);
  
  return Buffer.from(png);
};

const crc32Table = (() => {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table.push(c >>> 0);
  }
  return table;
})();

const crc32 = (data) => {
  let crc = 0xFFFFFFFF;
  for (const byte of data) {
    crc = crc32Table[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
};

const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), createPNG(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), createPNG(512, 512));

console.log('Icons generated successfully!');