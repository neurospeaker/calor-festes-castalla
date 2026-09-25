import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "data.json",
  "README.md",
  "SECURITY.md",
  "CITATION.cff",
];

for (const path of requiredFiles) {
  await access(resolve(root, path), constants.R_OK);
}

const html = await readFile(resolve(root, "index.html"), "utf8");
const data = JSON.parse(await readFile(resolve(root, "data.json"), "utf8"));

for (const key of ["historical", "projection"]) {
  if (!(key in data)) throw new Error(`data.json: falta la clau ${key}`);
}

const attributes = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map(
  ([, value]) => value,
);
const localPaths = attributes
  .filter((value) => !/^(?:https?:|data:|mailto:|tel:|#)/.test(value))
  .map((value) => decodeURIComponent(value.split(/[?#]/, 1)[0]))
  .filter(Boolean);

const missing = [];
for (const path of new Set(localPaths)) {
  try {
    await access(resolve(root, path), constants.R_OK);
  } catch {
    missing.push(path);
  }
}

if (missing.length) {
  throw new Error(`Enllaços locals sense destí: ${missing.join(", ")}`);
}

console.log(
  `Validació correcta: ${requiredFiles.length} fitxers essencials, ${new Set(localPaths).size} recursos locals i data.json.`,
);

