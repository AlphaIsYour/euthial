/**
 * scripts/switch-db.js
 * Utility to toggle active Prisma schema between SQLite (local dev) and PostgreSQL (Supabase/Prod)
 * Usage: node scripts/switch-db.js [sqlite|postgres]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetMode = (process.argv[2] || '').toLowerCase();
const rootDir = path.resolve(__dirname, '..');
const activeSchemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
const postgresSchemaPath = path.join(rootDir, 'prisma', 'schema.postgresql.prisma');

if (!['sqlite', 'postgres', 'postgresql'].includes(targetMode)) {
  console.error('❌ Usage: node scripts/switch-db.js <sqlite|postgres>');
  process.exit(1);
}

console.log(`🔄 Switching Prisma datasource to: ${targetMode.toUpperCase()}...`);

if (targetMode === 'sqlite') {
  let content = fs.readFileSync(activeSchemaPath, 'utf8');
  content = content.replace(/datasource db \{[\s\S]*?\}/, `datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}`);
  fs.writeFileSync(activeSchemaPath, content, 'utf8');
  console.log('✅ Updated prisma/schema.prisma to SQLite mode.');
} else {
  // Postgres mode
  let content = fs.readFileSync(postgresSchemaPath, 'utf8');
  fs.writeFileSync(activeSchemaPath, content, 'utf8');
  console.log('✅ Updated prisma/schema.prisma to PostgreSQL / Supabase mode.');
}

try {
  console.log('⚡ Generating Prisma Client...');
  execSync('pnpm prisma generate', { stdio: 'inherit', cwd: rootDir });
  console.log('✨ Prisma Client successfully regenerated!');
} catch (err) {
  console.error('⚠️ Failed to run prisma generate:', err.message);
}
