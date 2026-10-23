import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";

async function generateOGImage() {
  const width = 1200;
  const height = 630;

  // Read brand logo as base64
  const logoBuffer = await readFile(path.join(process.cwd(), "public", "brand-logo.png"));
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a192f" />
        <stop offset="45%" stop-color="#0e2a47" />
        <stop offset="100%" stop-color="#003566" />
      </linearGradient>
      
      <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0071e3" />
        <stop offset="50%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#0284c7" />
      </linearGradient>

      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgba(255, 255, 255, 0.12)" />
        <stop offset="100%" stop-color="rgba(255, 255, 255, 0.04)" />
      </linearGradient>

      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
    <rect width="${width}" height="${height}" fill="url(#grid)" />

    <!-- Ambient glowing circles -->
    <circle cx="1050" cy="120" r="280" fill="#0071e3" opacity="0.18" filter="blur(70px)" />
    <circle cx="150" cy="520" r="240" fill="#38bdf8" opacity="0.12" filter="blur(60px)" />

    <!-- Top Badge Row -->
    <g transform="translate(80, 70)">
      <rect x="0" y="0" width="340" height="38" rx="19" fill="rgba(0, 113, 227, 0.25)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5"/>
      <circle cx="20" cy="19" r="5" fill="#22c55e" />
      <text x="36" y="24" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="700" fill="#bae6fd" letter-spacing="1">
        NIGERIA'S CERTIFIED MEDICAL DISTRIBUTOR
      </text>
    </g>

    <!-- Brand Logo in light badge card -->
    <g transform="translate(80, 130)">
      <rect x="0" y="0" width="480" height="110" rx="20" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
      <image href="${logoBase64}" x="30" y="20" width="420" height="70" preserveAspectRatio="xMidYMid meet" />
    </g>

    <!-- Main Headline -->
    <text x="80" y="300" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="44" font-weight="800" fill="#ffffff" letter-spacing="-0.02em">
      Certified Medical Equipment &amp;
    </text>
    <text x="80" y="354" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="44" font-weight="800" fill="url(#accentGlow)" letter-spacing="-0.02em">
      Laboratory Test Diagnostics
    </text>

    <!-- Subtitle -->
    <text x="80" y="415" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="20" font-weight="400" fill="#94a3b8">
      Supplying hospitals, clinical laboratories, surgical theatres &amp; healthcare providers nationwide.
    </text>

    <!-- 3 Category Pills -->
    <g transform="translate(80, 460)">
      <!-- Pill 1 -->
      <rect x="0" y="0" width="280" height="46" rx="14" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1"/>
      <text x="20" y="28" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="600" fill="#e2e8f0">
        🔬 Laboratory Diagnostic Kits
      </text>

      <!-- Pill 2 -->
      <rect x="300" y="0" width="280" height="46" rx="14" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1"/>
      <text x="320" y="28" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="600" fill="#e2e8f0">
        🩺 Surgical Consumables
      </text>

      <!-- Pill 3 -->
      <rect x="600" y="0" width="280" height="46" rx="14" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1"/>
      <text x="620" y="28" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="600" fill="#e2e8f0">
        ⚡ Hospital Equipment
      </text>
    </g>

    <!-- Footer Bar -->
    <g transform="translate(80, 560)">
      <line x1="0" y1="0" x2="1040" y2="0" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
      
      <!-- Location -->
      <text x="0" y="30" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="16" font-weight="600" fill="#cbd5e1">
        📍 24 Alubomimu Street, Idumota, Lagos Island, Nigeria
      </text>

      <!-- Domain -->
      <text x="1040" y="30" text-anchor="end" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="17" font-weight="700" fill="#38bdf8">
        www.pezustandardmedics.com
      </text>
    </g>
  </svg>
  `;

  const svgBuffer = Buffer.from(svg);
  const outPathPublic = path.join(process.cwd(), "public", "opengraph-image.png");
  const outPathApp = path.join(process.cwd(), "src", "app", "opengraph-image.png");

  await sharp(svgBuffer)
    .png({ quality: 95 })
    .toFile(outPathPublic);

  await sharp(svgBuffer)
    .png({ quality: 95 })
    .toFile(outPathApp);

  console.log("Successfully generated opengraph-image.png (1200x630) in public and src/app!");
}

generateOGImage().catch(console.error);
