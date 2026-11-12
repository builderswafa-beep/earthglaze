const sharp = require('sharp');
const fs = require('fs');

async function processCutouts() {
  const bottleSrc = 'C:/Users/Administrator/.gemini/antigravity/brain/d860ea31-6985-4caa-8e20-94e94d1fe6d6/earthglaze_apothecary_elixir_bottle_1794484698666.jpg';
  const mortarSrc = 'C:/Users/Administrator/.gemini/antigravity/brain/d860ea31-6985-4caa-8e20-94e94d1fe6d6/earthglaze_stone_mortar_pestle_1794484720000.jpg';

  // 1. Process Bottle to Transparent PNG
  console.log('Processing bottle to transparent PNG...');
  const { data: bData, info: bInfo } = await sharp(bottleSrc)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bChannels = bInfo.channels; // 4 (RGBA)
  const bOut = Buffer.from(bData);

  for (let i = 0; i < bOut.length; i += bChannels) {
    const r = bOut[i];
    const g = bOut[i + 1];
    const b = bOut[i + 2];

    // Background is pure white / near-white (#FFFFFF / >250)
    // Calculate distance from pure white (255, 255, 255)
    const dist = Math.sqrt(Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2));

    if (dist < 15) {
      // Pure background white
      bOut[i + 3] = 0;
    } else if (dist < 45) {
      // Smooth anti-aliased edge feathering
      const alpha = Math.round(((dist - 15) / 30) * 255);
      bOut[i + 3] = alpha;
    }
  }

  // Trim transparent padding and save
  await sharp(bOut, {
    raw: {
      width: bInfo.width,
      height: bInfo.height,
      channels: 4
    }
  })
    .trim()
    .sharpen({ sigma: 1.1, m1: 1.0, m2: 2.0 })
    .png()
    .toFile('public/assets/hero_bottle_prop_transparent.png');

  console.log('Successfully created public/assets/hero_bottle_prop_transparent.png');

  // 2. Process Mortar to Transparent PNG
  console.log('Processing mortar to transparent PNG...');
  const { data: mData, info: mInfo } = await sharp(mortarSrc)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const mChannels = mInfo.channels;
  const mOut = Buffer.from(mData);

  for (let i = 0; i < mOut.length; i += mChannels) {
    const r = mOut[i];
    const g = mOut[i + 1];
    const b = mOut[i + 2];

    const dist = Math.sqrt(Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2));

    if (dist < 15) {
      mOut[i + 3] = 0;
    } else if (dist < 45) {
      const alpha = Math.round(((dist - 15) / 30) * 255);
      mOut[i + 3] = alpha;
    }
  }

  await sharp(mOut, {
    raw: {
      width: mInfo.width,
      height: mInfo.height,
      channels: 4
    }
  })
    .trim()
    .sharpen({ sigma: 1.1, m1: 1.0, m2: 2.0 })
    .png()
    .toFile('public/assets/hero_mortar_prop_transparent.png');

  console.log('Successfully created public/assets/hero_mortar_prop_transparent.png');
}

processCutouts().catch(console.error);
