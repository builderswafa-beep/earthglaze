const sharp = require('sharp');
const fs = require('fs');

async function buildTargetBackdrop() {
  const refFile = 'C:/Users/Administrator/.gemini/antigravity/brain/d860ea31-6985-4caa-8e20-94e94d1fe6d6/.user_uploaded/media_1794483456350_df78bf9c.jpg';
  const meta = await sharp(refFile).metadata();
  console.log('Source image dimensions:', meta.width, 'x', meta.height);

  // Target 3K canvas matching exact 3:1 aspect ratio of source (1024 x 341 -> 2880 x 960)
  const targetW = 2880;
  const targetH = 960;

  const scale = targetW / meta.width; // 2.8125
  const tableY = Math.round(281 * (targetH / meta.height)); // 791px
  const tableH = targetH - tableY; // 169px

  // Arch geometry:
  // Golden arch in target image enters table at x=78 and x=946 in 1024 coords
  // In 2880 coords:
  const archX1 = Math.round(78 * scale); // 219px
  const archX2 = Math.round(946 * scale); // 2660px
  const cx = Math.round((archX1 + archX2) / 2); // 1440px
  const rx = Math.round((archX2 - archX1) / 2); // 1220px
  const cy = tableY; // 791px
  // Apex at y=22 in 1024 coords -> 22 * (960/341) = 62px
  const ry = cy - Math.round(22 * (targetH / meta.height)); // 791 - 62 = 729px

  // 1. Synthesize pristine central base SVG
  const baseSvg = `
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Outer wall plaster (sage green) -->
        <linearGradient id="outerWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#CCD5C0" />
          <stop offset="10%" stop-color="#D4DCC8" />
          <stop offset="50%" stop-color="#DEE5D2" />
          <stop offset="90%" stop-color="#D4DCC8" />
          <stop offset="100%" stop-color="#CCD5C0" />
        </linearGradient>

        <!-- Inner recessed arch alcove glow (warm luminous ivory) -->
        <radialGradient id="archInterior" cx="50%" cy="25%" r="70%">
          <stop offset="0%" stop-color="#FCFAF2" />
          <stop offset="35%" stop-color="#F7F5EA" />
          <stop offset="70%" stop-color="#EAEFD9" />
          <stop offset="100%" stop-color="#D8DEC8" />
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
          <stop offset="0%" stop-color="#D5D0C4" />
          <stop offset="6%" stop-color="#E8E3D8" />
          <stop offset="22%" stop-color="#F6F2EB" />
          <stop offset="65%" stop-color="#FCFAF6" />
          <stop offset="100%" stop-color="#FAF7F2" />
        </linearGradient>

        <linearGradient id="tableHoriz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#EBE6DC" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#F8F6EF" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#DCD6CA" stop-opacity="0.9" />
        </linearGradient>
      </defs>

      <!-- Background outer wall -->
      <rect width="${targetW}" height="${targetH}" fill="url(#outerWall)" />

      <!-- Inner Arch Alcove Fill -->
      <path d="M ${archX1} ${cy} A ${rx} ${ry} 0 0 1 ${archX2} ${cy} Z" fill="url(#archInterior)" />

      <!-- Golden Arch Primary Stroke -->
      <path d="M ${archX1} ${cy} A ${rx} ${ry} 0 0 1 ${archX2} ${cy}" stroke="url(#archGold)" stroke-width="6.5" fill="none" />
      <!-- Golden Arch Inner Specular Highlight -->
      <path d="M ${archX1 + 6} ${cy} A ${rx - 6} ${ry - 5} 0 0 1 ${archX2 - 6} ${cy}" stroke="#FFF8E0" stroke-width="2.2" fill="none" opacity="0.75" />

      <!-- Marble Tabletop across full bottom width -->
      <rect x="0" y="${tableY}" width="${targetW}" height="${tableH}" fill="url(#tableGrad)" />
      <rect x="0" y="${tableY}" width="${targetW}" height="${tableH}" fill="url(#tableHoriz)" opacity="0.30" />

      <!-- Crisp Table Edge Specular Line and Shadow Bevel -->
      <line x1="0" y1="${tableY}" x2="${targetW}" y2="${tableY}" stroke="#FFFFFF" stroke-width="2.2" opacity="0.95" />
      <line x1="0" y1="${tableY + 2.2}" x2="${targetW}" y2="${tableY + 2.2}" stroke="#B8B0A2" stroke-width="2.5" opacity="0.65" />
    </svg>
  `;

  const baseBuf = await sharp(Buffer.from(baseSvg)).png().toBuffer();

  // 2. Extract LEFT Apothecary scene (x: 0 to 186)
  // Contains the oil bottle, cork stopper, and golden reflection on the marble table.
  // Stops before the carousel arrow `<` button (which is at x=195)!
  const leftExtractW = 186;
  const leftDestW = Math.round(leftExtractW * scale); // 523px

  const leftRaw = await sharp(refFile)
    .extract({ left: 0, top: 0, width: leftExtractW, height: meta.height })
    .resize(leftDestW, targetH, {
      kernel: sharp.kernel.lanczos3,
      fit: 'fill'
    })
    .sharpen({ sigma: 1.25, m1: 1.1, m2: 2.2 })
    .png()
    .toBuffer();

  // Left feather mask
  const leftMaskSvg = `
    <svg width="${leftDestW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="78%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="92%" stop-color="#ffffff" stop-opacity="0.6" />
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

  // 3. Extract RIGHT Apothecary scene (x: 788 to 1024)
  // Contains the speckled stone mortar and pestle on the marble table.
  // Starts after the carousel arrow `>` button (which ends at x=785)!
  const rightExtractX = 788;
  const rightExtractW = meta.width - rightExtractX; // 236px
  const rightDestW = Math.round(rightExtractW * scale); // 664px

  const rightRaw = await sharp(refFile)
    .extract({ left: rightExtractX, top: 0, width: rightExtractW, height: meta.height })
    .resize(rightDestW, targetH, {
      kernel: sharp.kernel.lanczos3,
      fit: 'fill'
    })
    .sharpen({ sigma: 1.25, m1: 1.1, m2: 2.2 })
    .png()
    .toBuffer();

  // Right feather mask
  const rightMaskSvg = `
    <svg width="${rightDestW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="10%" stop-color="#ffffff" stop-opacity="0.6" />
          <stop offset="24%" stop-color="#ffffff" stop-opacity="1" />
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

  // 4. Extract realistic Carrara marble texture from left table and seamlessly tile across center
  const marblePatch = await sharp(refFile)
    .extract({ left: 20, top: 285, width: 140, height: meta.height - 285 })
    .resize(targetW, tableH, { fit: 'fill' })
    .blur(0.8)
    .png()
    .toBuffer();

  // Composite final 3K backdrop
  const finalImage = await sharp(baseBuf)
    .composite([
      // Real marble texture overlay on table
      { input: marblePatch, top: tableY, left: 0, blend: 'overlay' },
      // Left still life
      { input: leftFeathered, top: 0, left: 0 },
      // Right still life
      { input: rightFeathered, top: 0, left: targetW - rightDestW }
    ])
    .jpeg({ quality: 98, chromaSubsampling: '4:4:4' })
    .toFile('public/assets/hero_apothecary_stage_backdrop.jpg');

  console.log('Successfully generated public/assets/hero_apothecary_stage_backdrop.jpg:', finalImage);
}

buildTargetBackdrop().catch(console.error);
