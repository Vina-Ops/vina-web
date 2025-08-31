const fs = require("fs");
const path = require("path");

// Create a simple SVG icon for testing
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#013F25"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" fill="#83CD20"/>
  <text x="${size / 2}" y="${
  size / 2 + size / 20
}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${
  size / 8
}" font-weight="bold">V</text>
</svg>
`;

// Icon sizes needed for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Ensure icons directory exists
const iconsDir = path.join(__dirname, "../public/icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons
iconSizes.forEach((size) => {
  const svg = createIconSVG(size);
  const filePath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated icon: icon-${size}x${size}.svg`);
});

// Generate shortcut icons
const shortcutIcons = [
  { name: "chat-shortcut", size: 96 },
  { name: "therapists-shortcut", size: 96 },
  { name: "profile-shortcut", size: 96 },
];

shortcutIcons.forEach(({ name, size }) => {
  const svg = createIconSVG(size);
  const filePath = path.join(iconsDir, `${name}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated shortcut icon: ${name}.svg`);
});

console.log("\nPWA icons generated successfully!");
console.log(
  "Note: These are placeholder SVG icons. For production, replace with proper PNG icons."
);
