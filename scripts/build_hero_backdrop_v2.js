const sharp = require('sharp');
const fs = require('fs');

async function buildHeroBackdrop() {
  const ref = sharp('public/assets/hero_wanted_reference.jpg');
  const meta = await ref.metadata();
  console.log('Source image dimensions:', meta.width, 'x', meta.height);

  // Target ultra-high 3K canvas: 2880 x 954 (exact 3.018:1 aspect ratio)
  const targetW = 2880;
  const targetH = 954;

  const scale = targetW / meta.width; // 2880 / 1024 = 2.8125
  const tableY = Math.round(242 * (targetH / meta.height)); // ~681px
  const tableH = targetH - tableY; // ~273px

  // Golden Arch geometry calibrated to source
  const cx = Math.round(512 * scale); // 1440
  const cy = tableY; // 681
  const rx = Math.round(297 * scale); // 835
  const ry = Math.round(226 * (targetH / meta.height)); // 636

  const x1 = cx - rx; // 605
  const x2 = cx + rx; // 2275

  // 1. Synthesize pristine central wall & table SVG base with natural organic gradients
  const baseSvg = `
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Soft natural sunbeam radial gradient from upper left -->
        <radialGradient id="sunlight" cx="28%" cy="12%" r="75%">
          <stop offset="0%" stop-color="#FCFAF5" />
          <stop offset="22%" stop-color="#F6F9F3" />
          <stop offset="50%" stop-color="#EEF4EC" />
          <stop offset="85%" stop-color="#E5EDE3" />
          <stop offset="100%" stop-color="#DCE4DA" />
        </radialGradient>

        <!-- Golden arch gradient with luminous champagne metallic luster -->
        <linearGradient id="archGold" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stop-color="#C59F42" stop-opacity="0.80" />
          <stop offset="25%" stop-color="#E5C772" stop-opacity="0.95" />
          <stop offset="50%" stop-color="#FFF0BE" stop-opacity="1.0" />
          <stop offset="75%" stop-color="#E5C772" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#B69038" stop-opacity="0.80" />
        </linearGradient>

        <!-- Marble table lighting gradient (warmer on left, cool shadow on right) -->
        <linearGradient id="tableGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#D9D3C7" />
          <stop offset="5%" stop-color="#EAE4D8" />
          <stop offset="22%" stop-color="#F5F1E8" />
          <stop offset="60%" stop-color="#FAF7F2" />
          <stop offset="100%" stop-color="#FAF7F2" />
        </linearGradient>

        <linearGradient id="tableHoriz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ECE7DC" stop-opacity="0.85" />
          <stop offset="45%" stop-color="#F6F3EB" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#DCD6C8" stop-opacity="0.85" />
        </linearGradient>
      </defs>

      <!-- Background wall with sunlight -->
      <rect width="${targetW}" height="${targetH}" fill="url(#sunlight)" />

      <!-- Golden Arch Primary Stroke -->
      <path d="M ${x1} ${cy} A ${rx} ${ry} 0 0 1 ${x2} ${cy}" stroke="url(#archGold)" stroke-width="5.5" fill="none" />
      <!-- Golden Arch Inner Specular Highlight -->
      <path d="M ${x1 + 7} ${cy} A ${rx - 7} ${ry - 6} 0 0 1 ${x2 - 7} ${cy}" stroke="#FFF7DE" stroke-width="1.8" fill="none" opacity="0.65" />

      <!-- Marble Tabletop across full bottom width -->
      <rect x="0" y="${tableY}" width="${targetW}" height="${tableH}" fill="url(#tableGrad)" />
      <rect x="0" y="${tableY}" width="${targetW}" height="${tableH}" fill="url(#tableHoriz)" opacity="0.30" />

      <!-- Crisp Table Edge Specular Line and Shadow Bevel -->
      <line x1="0" y1="${tableY}" x2="${targetW}" y2="${tableY}" stroke="#FFFFFF" stroke-width="2.0" opacity="0.95" />
      <line x1="0" y1="${tableY + 2.0}" x2="${targetW}" y2="${tableY + 2.0}" stroke="#B8B0A0" stroke-width="2.5" opacity="0.6" />
    </svg>
  `;

  const baseBuf = await sharp(Buffer.from(baseSvg)).png().toBuffer();

  // 2. Extract LEFT Apothecary scene (strictly x: 0 to 252)
  // Preserves oil bottle, cork, leaves, flower, and all hanging top-left leaves with 0 text
  const leftExtractW = 252;
  const leftDestW = Math.round(leftExtractW * scale); // 709px

  const leftRaw = await sharp('public/assets/hero_wanted_reference.jpg')
    .extract({ left: 0, top: 0, width: leftExtractW, height: meta.height })
    .resize(leftDestW, targetH, {
      kernel: sharp.kernel.lanczos3,
      fit: 'fill'
    })
    .sharpen({ sigma: 1.25, m1: 1.1, m2: 2.2 })
    .png()
    .toBuffer();

  // Left feather mask: solid 1.0 up to 80% of leftDestW, then gently tapering to 0 at 100%
  const leftMaskSvg = `
    <svg width="${leftDestW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="80%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="92%" stop-color="#ffffff" stop-opacity="0.65" />
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

  // 3. Extract RIGHT Apothecary scene (strictly x: 692 to 1024)
  // Preserves mortar & pestle, herb sprig, white flower, leaves, and all hanging top-right leaves
  const rightExtractX = 692;
  const rightExtractW = meta.width - rightExtractX; // 332px
  const rightDestW = Math.round(rightExtractW * scale); // 934px

  const rightRaw = await sharp('public/assets/hero_wanted_reference.jpg')
    .extract({ left: rightExtractX, top: 0, width: rightExtractW, height: meta.height })
    .resize(rightDestW, targetH, {
      kernel: sharp.kernel.lanczos3,
      fit: 'fill'
    })
    .sharpen({ sigma: 1.25, m1: 1.1, m2: 2.2 })
    .png()
    .toBuffer();

  // Right feather mask: tapering from 0 at left edge to solid 1.0 at 20% of rightDestW
  const rightMaskSvg = `
    <svg width="${rightDestW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="8%" stop-color="#ffffff" stop-opacity="0.65" />
          <stop offset="20%" stop-color="#ffffff" stop-opacity="1" />
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

  // 4. Composite final 3K ultra-clarity backdrop
  const finalImage = await sharp(baseBuf)
    .composite([
      { input: leftFeathered, top: 0, left: 0 },
      { input: rightFeathered, top: 0, left: targetW - rightDestW }
    ])
    .jpeg({ quality: 98, chromaSubsampling: '4:4:4' })
    .toFile('public/assets/hero_apothecary_stage_backdrop.jpg');

  console.log('Successfully generated 3K backdrop public/assets/hero_apothecary_stage_backdrop.jpg:', finalImage);
}

buildHeroBackdrop().catch(console.error);
