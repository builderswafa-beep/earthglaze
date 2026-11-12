const sharp = require('sharp');
const fs = require('fs');

async function buildCleanStage() {
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
  const archX1 = Math.round(78 * scale); // 219px
  const archX2 = Math.round(946 * scale); // 2660px
  const cx = Math.round((archX1 + archX2) / 2); // 1440px
  const rx = Math.round((archX2 - archX1) / 2); // 1220px
  const cy = tableY; // 791px
  const ry = cy - Math.round(22 * (targetH / meta.height)); // 729px

  // 1. Synthesize pristine architectural backdrop (Sage wall + Golden Arch + Ivory Alcove + Marble Table)
  // ZERO bottles, ZERO mortars, ZERO text, ZERO products
  const baseSvg = `
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Outer wall plaster (sage green) -->
        <linearGradient id="outerWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#C8D2BD" />
          <stop offset="8%" stop-color="#D2DBC5" />
          <stop offset="50%" stop-color="#DFE6D3" />
          <stop offset="92%" stop-color="#D2DBC5" />
          <stop offset="100%" stop-color="#C8D2BD" />
        </linearGradient>

        <!-- Inner recessed arch alcove glow (warm luminous ivory) -->
        <radialGradient id="archInterior" cx="50%" cy="25%" r="70%">
          <stop offset="0%" stop-color="#FCFAF3" />
          <stop offset="35%" stop-color="#F8F6EB" />
          <stop offset="70%" stop-color="#EBF0DB" />
          <stop offset="100%" stop-color="#D8DFC9" />
        </radialGradient>

        <!-- Golden arch frame gradient with warm metallic luster -->
        <linearGradient id="archGold" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stop-color="#C59F3E" stop-opacity="0.90" />
          <stop offset="25%" stop-color="#ECC665" stop-opacity="0.98" />
          <stop offset="50%" stop-color="#FFF2BF" stop-opacity="1.0" />
          <stop offset="75%" stop-color="#ECC665" stop-opacity="0.98" />
          <stop offset="100%" stop-color="#B68E35" stop-opacity="0.90" />
        </linearGradient>

        <!-- Marble table lighting gradient -->
        <linearGradient id="tableGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#D2CDC1" />
          <stop offset="5%" stop-color="#E6E1D6" />
          <stop offset="20%" stop-color="#F4F0E9" />
          <stop offset="60%" stop-color="#FAF8F3" />
          <stop offset="100%" stop-color="#F7F5EF" />
        </linearGradient>

        <linearGradient id="tableHoriz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#E8E3D8" stop-opacity="0.85" />
          <stop offset="50%" stop-color="#F8F6EF" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#DAD4C8" stop-opacity="0.85" />
        </linearGradient>
      </defs>

      <!-- Background outer wall -->
      <rect width="${targetW}" height="${targetH}" fill="url(#outerWall)" />

      <!-- Inner Arch Alcove Fill -->
      <path d="M ${archX1} ${cy} A ${rx} ${ry} 0 0 1 ${archX2} ${cy} Z" fill="url(#archInterior)" />

      <!-- Golden Arch Primary Stroke -->
      <path d="M ${archX1} ${cy} A ${rx} ${ry} 0 0 1 ${archX2} ${cy}" stroke="url(#archGold)" stroke-width="7.0" fill="none" />
      <!-- Golden Arch Inner Specular Highlight -->
      <path d="M ${archX1 + 6} ${cy} A ${rx - 6} ${ry - 5} 0 0 1 ${archX2 - 6} ${cy}" stroke="#FFF8E0" stroke-width="2.2" fill="none" opacity="0.80" />

      <!-- Marble Tabletop across full bottom width -->
      <rect x="0" y="${tableY}" width="${targetW}" height="${tableH}" fill="url(#tableGrad)" />
      <rect x="0" y="${tableY}" width="${targetW}" height="${tableH}" fill="url(#tableHoriz)" opacity="0.30" />

      <!-- Crisp Table Edge Specular Line and Shadow Bevel -->
      <line x1="0" y1="${tableY}" x2="${targetW}" y2="${tableY}" stroke="#FFFFFF" stroke-width="2.2" opacity="0.95" />
      <line x1="0" y1="${tableY + 2.2}" x2="${targetW}" y2="${tableY + 2.2}" stroke="#B8B0A2" stroke-width="2.5" opacity="0.65" />
    </svg>
  `;

  // Extract Carrara marble texture from reference table (x=20..220, y=285..338) and tile across full width
  const marbleTexture = await sharp(refFile)
    .extract({ left: 20, top: 285, width: 200, height: meta.height - 285 })
    .resize(targetW, tableH, { fit: 'fill' })
    .blur(0.6)
    .png()
    .toBuffer();

  const finalBackdrop = await sharp(Buffer.from(baseSvg))
    .composite([
      { input: marbleTexture, top: tableY, left: 0, blend: 'overlay' }
    ])
    .jpeg({ quality: 98, chromaSubsampling: '4:4:4' })
    .toFile('public/assets/hero_apothecary_stage_backdrop.jpg');

  console.log('Successfully created clean stage (no bottle, no mortar):', finalBackdrop);
}

buildCleanStage().catch(console.error);
