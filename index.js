const fs = require('fs');
const path = require('path');

const base = 'auth-service';

const structure = [
  'src/config',
  'src/controllers',
  'src/routes',
  'src/services',
  'src/models',
  'src/middlewares',
  'src/utils',
  'prisma/migrations'
];

const files = [
  'src/app.ts',
  'src/server.ts',
  '.env',
  'Dockerfile',
  'package.json',
  'tsconfig.json',
  'prisma/schema.prisma'
];

// Ensure base folder exists
if (!fs.existsSync(base)) {
  fs.mkdirSync(base);
}

// Create folders
structure.forEach(dir => {
  const fullPath = path.join(base, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`📁 Created folder: ${fullPath}`);
});

// Create empty files
files.forEach(file => {
  const filePath = path.join(base, file);
  fs.writeFileSync(filePath, '');
  console.log(`📄 Created file: ${filePath}`);
});

console.log('✅ auth-service structure created successfully!');