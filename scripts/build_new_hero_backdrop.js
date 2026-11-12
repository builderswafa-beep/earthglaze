const sharp = require('sharp');
const fs = require('fs');

async function buildNewHeroBackdrop() {
  const refFile = 'public/assets/hero_reference_new_clean.jpg';
  const meta = await sharp(refFile).metadata();
  console.log('Source image dimensions:', meta.width, 'x', meta.height);

  // High-clarity 3K canvas matching exact 3:1 aspect ratio of source (1024 x 341 -> 2880 x 960)
  const targetW = 2880;
  const targetH = 960;

  const scale = targetW / meta.width; // 2.8125
  const tableY = Math.round(281 * (targetH / meta.height)); // 791px
  const tableH = targetH - tableY; // 169px

  // Arch geometry calibrated to source
  const cx = Math.round(512 * scale); // 1440
  const cy = tableY; // 791
  const rx = Math.round(437 * scale); // 1229
  const ry = Math.round(275 * (targetH / meta.height)); // 774

  const x1 = cx - rx; // 211
  const x2 = cx + rx; // 2669

  // 1. Synthesize pristine central alcove base with golden arch and Carrara marble table
  const baseSvg = `
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Outer wall plaster (sage-cream tint) -->
        <linearGradient id="outerWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#D0D7C4" />
          <stop offset="12%" stop-color="#D7DEC9" />
          <stop offset="50%" stop-color="#DFE5D1" />
          <stop offset="88%" stop-color="#D7DEC9" />
          <stop offset="100%" stop-color="#CBD2BE" />
        </linearGradient>

        <!-- Inner recessed arch wall glow -->
        <radialGradient id="archInterior" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#FBF8EE" />
          <stop offset="35%" stop-color="#F4F3E5" />
          <stop offset="70%" stop-color="#E7EBD8" />
          <stop offset="100%" stop-color="#D8DEC9" />
        </radialGradient>

        <!-- Golden arch frame gradient with warm metallic luster -->
        <linearGradient id="archGold" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stop-color="#C59F3E" stop-opacity="0.85" />
          <stop offset="25%" stop-color="#ECC665" stop-opacity="0.95" />
          <stop offset="50%" stop-color="#FFF2BF" stop-opacity="1.0" />
          <stop offset="75%" stop-color="#ECC665" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#B68E35" stop-opacity="0.85" />
        </linearGradient>

        <!-- Marble table lighting gradient -->
        <linearGradient id="tableGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#D7D2C7" />
          <stop offset="6%" stop-color="#EAE5DC" />
          <stop offset="22%" stop-color="#F6F3EC" />
          <stop offset="65%" stop-color="#FCFAF6" />
          <stop offset="100%" stop-color="#FAF7F2" />
        </linearGradient>

        <linearGradient id="tableHoriz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ECE7DE" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#F8F6EF" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#DCD6CA" stop-opacity="0.9" />
        </linearGradient>
      </defs>

      <!-- Background outer wall -->
      <rect width="${targetW}" height="${targetH}" fill="url(#outerWall)" />

      <!-- Inner Arch Alcove Fill -->
      <path d="M ${x1} ${cy} A ${rx} ${ry} 0 0 1 ${x2} ${cy} Z" fill="url(#archInterior)" />

      <!-- Golden Arch Primary Stroke -->
      <path d="M ${x1} ${cy} A ${rx} ${ry} 0 0 1 ${x2} ${cy}" stroke="url(#archGold)" stroke-width="6.0" fill="none" />
      <!-- Golden Arch Inner Specular Highlight -->
      <path d="M ${x1 + 6} ${cy} A ${rx - 6} ${ry - 5} 0 0 1 ${x2 - 6} ${cy}" stroke="#FFF8E0" stroke-width="2.0" fill="none" opacity="0.75" />

      <!-- Marble Tabletop across full bottom width -->
      <rect x="0" y="${tableY}" width="${targetW}" height="${tableH}" fill="url(#tableGrad)" />
      <rect x="0" y="${tableY}" width="${targetW}" height="${tableH}" fill="url(#tableHoriz)" opacity="0.30" />

      <!-- Crisp Table Edge Specular Line and Shadow Bevel -->
      <line x1="0" y1="${tableY}" x2="${targetW}" y2="${tableY}" stroke="#FFFFFF" stroke-width="2.0" opacity="0.95" />
      <line x1="0" y1="${tableY + 2.0}" x2="${targetW}" y2="${tableY + 2.0}" stroke="#B8B0A2" stroke-width="2.5" opacity="0.65" />
    </svg>
  `;

  const baseBuf = await sharp(Buffer.from(baseSvg)).png().toBuffer();

  // 2. Extract LEFT Apothecary scene (strictly x: 0 to 312)
  // Preserves the crystal clear glass oil bottle, golden oil, and wooden cork stopper sitting on the marble table
  const leftExtractW = 312;
  const leftDestW = Math.round(leftExtractW * scale); // 878px

  const leftRaw = await sharp(refFile)
    .extract({ left: 0, top: 0, width: leftExtractW, height: meta.height })
    .resize(leftDestW, targetH, {
      kernel: sharp.kernel.lanczos3,
      fit: 'fill'
    })
    .sharpen({ sigma: 1.25, m1: 1.1, m2: 2.2 })
    .png()
    .toBuffer();

  // Left feather mask: solid 1.0 up to 78% of leftDestW, then tapering smoothly to 0 at 100%
  const leftMaskSvg = `
    <svg width="${leftDestW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="78%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="90%" stop-color="#ffffff" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="${leftDestW}" height="${targetH}" fill="url(#fadeL)" />
    </svg>
  `;
  const leftMaskBuf = await sharp(Buffer.from(leftMaskSvg)).png().toBuffer();

  const leftFeathered = await sharp(leftRaw)
    .composite([{ input: leftMaskBuf, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 3. Extract RIGHT Apothecary scene (strictly x: 688 to 1024)
  // Preserves the speckled stone mortar and pestle sitting on the marble table
  const rightExtractX = 688;
  const rightExtractW = meta.width - rightExtractX; // 336px
  const rightDestW = Math.round(rightExtractW * scale); // 945px

  const rightRaw = await sharp(refFile)
    .extract({ left: rightExtractX, top: 0, width: rightExtractW, height: meta.height })
    .resize(rightDestW, targetH, {
      kernel: sharp.kernel.lanczos3,
      fit: 'fill'
    })
    .sharpen({ sigma: 1.25, m1: 1.1, m2: 2.2 })
    .png()
    .toBuffer();

  // Right feather mask: tapering smoothly from 0 at left edge to solid 1.0 at 22% of rightDestW
  const rightMaskSvg = `
    <svg width="${rightDestW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="10%" stop-color="#ffffff" stop-opacity="0.6" />
          <stop offset="22%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect width="${rightDestW}" height="${targetH}" fill="url(#fadeR)" />
    </svg>
  `;
  const rightMaskBuf = await sharp(Buffer.from(rightMaskSvg)).png().toBuffer();

  const rightFeathered = await sharp(rightRaw)
    .composite([{ input: rightMaskBuf, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 4. Composite final 3K backdrop
  const finalImage = await sharp(baseBuf)
    .composite([
      { input: leftFeathered, top: 0, left: 0 },
      { input: rightFeathered, top: 0, left: targetW - rightDestW }
    ])
    .jpeg({ quality: 98, chromaSubsampling: '4:4:4' })
    .toFile('public/assets/hero_apothecary_stage_backdrop.jpg');

  console.log('Successfully updated public/assets/hero_apothecary_stage_backdrop.jpg:', finalImage);
}

buildNewHeroBackdrop().catch(console.error);
