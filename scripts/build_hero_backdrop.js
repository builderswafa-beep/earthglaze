const sharp = require('sharp');
const fs = require('fs');

async function buildHeroBackdrop() {
  const src = sharp('public/assets/hero_wanted_reference.jpg');
  const meta = await src.metadata();
  console.log('Original dimensions:', meta.width, 'x', meta.height);

  const targetW = 2048;
  const targetH = 800;

  // 1. Create center base SVG with seamless wall, golden arch, and tabletop
  const tableTopY = Math.round(targetH * 0.72); // ~576px
  const tableH = targetH - tableTopY; // ~224px

  const centerSvg = `
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunlight" cx="30%" cy="15%" r="70%">
          <stop offset="0%" stop-color="#FCFAF5" />
          <stop offset="35%" stop-color="#F5F9F4" />
          <stop offset="100%" stop-color="#EAF3EB" />
        </radialGradient>
        <linearGradient id="tableGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E4DDD3" />
          <stop offset="12%" stop-color="#EFE9DF" />
          <stop offset="55%" stop-color="#F7F2EA" />
          <stop offset="100%" stop-color="#FAF7F2" />
        </linearGradient>
        <linearGradient id="goldArch" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.65" />
          <stop offset="50%" stop-color="#ECCF78" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#D4AF37" stop-opacity="0.65" />
        </linearGradient>
      </defs>
      <!-- Base wall -->
      <rect width="${targetW}" height="${targetH}" fill="url(#sunlight)" />
      <!-- Golden Arch in center -->
      <path d="M 400 ${tableTopY} A 624 450 0 0 1 1648 ${tableTopY}" stroke="url(#goldArch)" stroke-width="4.5" fill="none" opacity="0.75" />
      <path d="M 408 ${tableTopY} A 616 442 0 0 1 1640 ${tableTopY}" stroke="#FFF8DE" stroke-width="1.8" fill="none" opacity="0.5" />
      <!-- Marble tabletop surface across bottom -->
      <rect x="0" y="${tableTopY}" width="${targetW}" height="${tableH}" fill="url(#tableGrad)" />
      <!-- Table top edge highlight & shadow line -->
      <line x1="0" y1="${tableTopY}" x2="${targetW}" y2="${tableTopY}" stroke="#FFFFFF" stroke-width="1.5" opacity="0.9" />
      <line x1="0" y1="${tableTopY + 1.5}" x2="${targetW}" y2="${tableTopY + 1.5}" stroke="#D1C8BC" stroke-width="2" opacity="0.6" />
    </svg>
  `;

  const baseBuf = await sharp(Buffer.from(centerSvg)).png().toBuffer();

  // 2. Extract Left side (Oil bottle, cork, leaves, flower, marble table)
  // in 1024x339, extract left 0..320
  const leftW = Math.round(targetW * 0.35); // ~717px
  const leftRaw = await sharp('public/assets/hero_wanted_reference.jpg')
    .extract({ left: 0, top: 0, width: 320, height: meta.height })
    .resize(leftW, targetH, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  // Create feather mask for left image (opaque on left, fading to transparent on right)
  const leftMaskSvg = `
    <svg width="${leftW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="65%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="85%" stop-color="#ffffff" stop-opacity="0.65" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="${leftW}" height="${targetH}" fill="url(#fadeL)" />
    </svg>
  `;
  const leftMaskBuf = await sharp(Buffer.from(leftMaskSvg)).png().toBuffer();

  const leftFeathered = await sharp(leftRaw)
    .composite([{ input: leftMaskBuf, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 3. Extract Right side (Mortar & pestle, leaves, flower, marble table)
  // in 1024x339, extract right 704..1024 (width 320)
  const rightW = Math.round(targetW * 0.35); // ~717px
  const rightRaw = await sharp('public/assets/hero_wanted_reference.jpg')
    .extract({ left: 704, top: 0, width: 320, height: meta.height })
    .resize(rightW, targetH, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  // Create feather mask for right image (fading from transparent on left to opaque on right)
  const rightMaskSvg = `
    <svg width="${rightW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="15%" stop-color="#ffffff" stop-opacity="0.65" />
          <stop offset="35%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect width="${rightW}" height="${targetH}" fill="url(#fadeR)" />
    </svg>
  `;
  const rightMaskBuf = await sharp(Buffer.from(rightMaskSvg)).png().toBuffer();

  const rightFeathered = await sharp(rightRaw)
    .composite([{ input: rightMaskBuf, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 4. Extract Top Leaves Foliage (top left & top right framing)
  // In addition, let's composite the leftFeathered and rightFeathered onto baseBuf
  const finalBackdrop = await sharp(baseBuf)
    .composite([
      { input: leftFeathered, top: 0, left: 0 },
      { input: rightFeathered, top: 0, left: targetW - rightW }
    ])
    .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
    .toFile('public/assets/hero_apothecary_stage_backdrop.jpg');

  console.log('Successfully generated public/assets/hero_apothecary_stage_backdrop.jpg:', finalBackdrop);
}

buildHeroBackdrop().catch(console.error);
