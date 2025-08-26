// scripts/validate.mjs
// Valida un archivo JSON de examen contra docs/exam.schema.json
// Uso: node scripts/validate.mjs ./data/sudamericana-trivia-v1.json

import fs from 'node:fs/promises';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const [,, targetPath = './data/sudamericana-trivia-v1.json'] = process.argv;

async function main() {
  const schema = JSON.parse(await fs.readFile('./docs/exam.schema.json', 'utf8'));
  const data = JSON.parse(await fs.readFile(targetPath, 'utf8'));

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const ok = validate(data);
  if (!ok) {
    console.error('❌ JSON inválido:\n', validate.errors);
    process.exit(1);
  }
  console.log('✅ JSON válido:', targetPath);
}

main().catch(err => {
  console.error('Error en validación:', err);
  process.exit(1);
});
