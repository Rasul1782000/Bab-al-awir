import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiUrl = process.env.API_URL || "https://bab-al-awir.onrender.com/api";

const content = `export const environment = {
  production: true,
  apiUrl: ${JSON.stringify(apiUrl)},
};
`;

writeFileSync(resolve(__dirname, "../src/environments/environment.prod.ts"), content);
console.log(`[gen-env] environment.prod.ts apiUrl = ${apiUrl}`);
