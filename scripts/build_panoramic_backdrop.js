const sharp = require('sharp');
const fs = require('fs');

async function buildPanoramicBackdrop() {
  const aiFile = 'C:/Users/Administrator/.gemini/antigravity/brain/d860ea31-6985-4caa-8e20-94e94d1fe6d6/earthglaze_hero_banner_large_flanks_1794482226530.jpg';
  const meta = await sharp(aiFile).metadata();
  console.log('AI Source dimensions:', meta.width, 'x', meta.height);

  const targetW = 2880;
  const targetH = 1000; // Perfect 2.88:1 panoramic ratio for modern desktop viewports

  // In AI source:
  // Table horizon is at y = 600 (out of 768) -> 78% of height
  const tableTopY = Math.round(targetH * 0.77); // 770px
  const tableH = targetH - tableTopY; // 230px

  // Golden Arch geometry
  const cx = Math.round(targetW / 2); // 1440
  const cy = tableTopY; // 770
  const rx = 800;
  const ry = 620;
  const x1 = cx - rx; // 640
  const x2 = cx + rx; // 2240

  // 1. Create panoramic base with sunlight wall, golden arch, and Carrara marble table
  const centerSvg = `
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Soft natural morning sunbeam gradient from top-left -->
        <radialGradient id="sunlight" cx="30%" cy="10%" r="75%">
          <stop offset="0%" stop-color="#FCFAF5" />
          <stop offset="25%" stop-color="#F5F8F2" />
          <stop offset="55%" stop-color="#ECF2EB" />
          <stop offset="85%" stop-color="#E2EAE0" />
          <stop offset="100%" stop-color="#D8E2D6" />
        </radialGradient>

        <!-- Golden arch gradient with soft champagne metallic luster -->
        <linearGradient id="archGold" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stop-color="#C59F42" stop-opacity="0.80" />
          <stop offset="25%" stop-color="#E5C772" stop-opacity="0.95" />
          <stop offset="50%" stop-color="#FFF0BE" stop-opacity="1.0" />
          <stop offset="75%" stop-color="#E5C772" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#B69038" stop-opacity="0.80" />
        </linearGradient>

        <!-- Marble table lighting gradient -->
        <linearGradient id="tableGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#D5D0C4" />
          <stop offset="5%" stop-color="#E6E0D4" />
          <stop offset="20%" stop-color="#F3EFE6" />
          <stop offset="60%" stop-color="#FAF7F2" />
          <stop offset="100%" stop-color="#FAF7F2" />
        </linearGradient>

        <linearGradient id="tableHoriz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ECE7DC" stop-opacity="0.85" />
          <stop offset="50%" stop-color="#F6F3EB" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#DCD6C8" stop-opacity="0.85" />
        </linearGradient>
      </defs>

      <!-- Background wall with sunlight -->
      <rect width="${targetW}" height="${targetH}" fill="url(#sunlight)" />

      <!-- Golden Arch Primary Stroke -->
      <path d="M ${x1} ${cy} A ${rx} ${ry} 0 0 1 ${x2} ${cy}" stroke="url(#archGold)" stroke-width="5.5" fill="none" />
      <!-- Golden Arch Inner Specular Highlight -->
      <path d="M ${x1 + 6} ${cy} A ${rx - 6} ${ry - 5} 0 0 1 ${x2 - 6} ${cy}" stroke="#FFF8E2" stroke-width="1.8" fill="none" opacity="0.65" />

      <!-- Marble Tabletop across full bottom width -->
      <rect x="0" y="${tableTopY}" width="${targetW}" height="${tableH}" fill="url(#tableGrad)" />
      <rect x="0" y="${tableTopY}" width="${targetW}" height="${tableH}" fill="url(#tableHoriz)" opacity="0.30" />

      <!-- Crisp Table Edge Specular Line and Shadow Bevel -->
      <line x1="0" y1="${tableTopY}" x2="${targetW}" y2="${tableTopY}" stroke="#FFFFFF" stroke-width="2.0" opacity="0.95" />
      <line x1="0" y1="${tableTopY + 2.0}" x2="${targetW}" y2="${tableTopY + 2.0}" stroke="#B5ADA0" stroke-width="2.5" opacity="0.6" />
    </svg>
  `;

  const baseBuf = await sharp(Buffer.from(centerSvg)).png().toBuffer();

  // 2. Extract LEFT still life (oil bottle, cork, flowers, leaves, hanging top leaves)
  // In AI image (1376x768), left 370px contains the complete left apothecary arrangement
  const leftSourceW = 370;
  const leftDestW = 860;

  const leftRaw = await sharp(aiFile)
    .extract({ left: 0, top: 0, width: leftSourceW, height: meta.height })
    .resize(leftDestW, targetH, {
      kernel: sharp.kernel.lanczos3,
      fit: 'fill'
    })
    .sharpen({ sigma: 1.2, m1: 1.1, m2: 2.2 })
    .png()
    .toBuffer();

  // Left feather mask
  const maskLSvg = `
    <svg width="${leftDestW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#fff" stop-opacity="1" />
          <stop offset="76%" stop-color="#fff" stop-opacity="1" />
          <stop offset="90%" stop-color="#fff" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="${leftDestW}" height="${targetH}" fill="url(#fL)" />
    </svg>
  `;
  const leftFeathered = await sharp(leftRaw)
    .composite([{ input: Buffer.from(maskLSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 3. Extract RIGHT still life (stone mortar, herbs, flowers, leaves, hanging top leaves)
  // In AI image (1376x768), right 370px (from 1006 to 1376) contains the complete right arrangement
  const rightSourceX = 1006;
  const rightSourceW = meta.width - rightSourceX; // 370px
  const rightDestW = 860;

  const rightRaw = await sharp(aiFile)
    .extract({ left: rightSourceX, top: 0, width: rightSourceW, height: meta.height })
    .resize(rightDestW, targetH, {
      kernel: sharp.kernel.lanczos3,
      fit: 'fill'
    })
    .sharpen({ sigma: 1.2, m1: 1.1, m2: 2.2 })
    .png()
    .toBuffer();

  // Right feather mask
  const maskRSvg = `
    <svg width="${rightDestW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#fff" stop-opacity="0" />
          <stop offset="10%" stop-color="#fff" stop-opacity="0.6" />
          <stop offset="24%" stop-color="#fff" stop-opacity="1" />
          <stop offset="100%" stop-color="#fff" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect width="${rightDestW}" height="${targetH}" fill="url(#fR)" />
    </svg>
  `;
  const rightFeathered = await sharp(rightRaw)
    .composite([{ input: Buffer.from(maskRSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 4. Composite final razor-sharp 2880 x 1000 panoramic backdrop
  const finalImage = await sharp(baseBuf)
    .composite([
      { input: leftFeathered, top: 0, left: 0 },
      { input: rightFeathered, top: 0, left: targetW - rightDestW }
    ])
    .jpeg({ quality: 98, chromaSubsampling: '4:4:4' })
    .toFile('public/assets/hero_apothecary_stage_backdrop.jpg');

  console.log('Successfully generated public/assets/hero_apothecary_stage_backdrop.jpg:', finalImage);
}

buildPanoramicBackdrop().catch(console.error);
