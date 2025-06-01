import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
  { width: 16, height: 16, name: 'favicon-16x16.png' },
  { width: 32, height: 32, name: 'favicon-32x32.png' },
  { width: 180, height: 180, name: 'apple-touch-icon.png' },
  { width: 192, height: 192, name: 'android-chrome-192x192.png' },
  { width: 512, height: 512, name: 'android-chrome-512x512.png' },
];

async function generateFavicons() {
  const inputSvg = await fs.readFile(join(__dirname, '../public/favicon.svg'));
  
  for (const size of sizes) {
    await sharp(inputSvg)
      .resize(size.width, size.height)
      .png()
      .toFile(join(__dirname, '../public', size.name));
    
    console.log(`Generated ${size.name}`);
  }
}

generateFavicons().catch(console.error); 