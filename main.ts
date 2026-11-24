import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I asked it to remove one unused import. It removed the import, then the function it had belonged to, then the route that called it, and the homepage 404'd.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const chars = [...LINE];
if (chars.length < 1 || chars.length > 400) {
  throw new Error(`entry must be 1-400 characters, got ${chars.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n")) {
  throw new Error("entry must be a single line");
}
const sentences = LINE.split(".").filter((part) => part.trim().length > 0);
if (sentences.length !== 2) {
  throw new Error(`entry must be exactly two sentences, got ${sentences.length}`);
}

const bytes = Buffer.byteLength(LINE, "utf8");
if (bytes < 1 || bytes > 400) {
  throw new Error(`entry must be 1-400 bytes, got ${bytes}`);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
const readBack = readFileSync(outPath, "utf8");
if (readBack !== LINE) {
  throw new Error("read-back mismatch: written bytes differ from the entry");
}
