#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function removeSpanTags(text) {
    return text
        .replace(/<\/?span\b[^>]*>/gi, "")
        .replace(/\[\/?span[^\]]*\]/gi, "");
}

function usage() {
    console.log("Usage:");
    console.log("  node scripts/remove-span-tags.mjs <file>");
    console.log("  node scripts/remove-span-tags.mjs <inputDir> [globExt]");
    console.log("");
    console.log("Examples:");
    console.log("  node scripts/remove-span-tags.mjs docs/cs/os/note/chap8.md");
    console.log("  node scripts/remove-span-tags.mjs docs .md");
}

function walkFiles(dirPath, ext, files = []) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            walkFiles(fullPath, ext, files);
        } else if (entry.isFile() && fullPath.toLowerCase().endsWith(ext.toLowerCase())) {
            files.push(fullPath);
        }
    }
    return files;
}

function processFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const updated = removeSpanTags(content);

    if (content !== updated) {
        fs.writeFileSync(filePath, updated, "utf8");
        console.log(`updated: ${filePath}`);
        return 1;
    }

    console.log(`unchanged: ${filePath}`);
    return 0;
}

const target = process.argv[2];
const ext = process.argv[3] || ".md";

if (!target) {
    usage();
    process.exit(1);
}

if (!fs.existsSync(target)) {
    console.error(`Path not found: ${target}`);
    process.exit(1);
}

const stat = fs.statSync(target);
let changed = 0;

if (stat.isFile()) {
    processFile(target);
} else if (stat.isDirectory()) {
    const files = walkFiles(target, ext);
    for (const filePath of files) {
        changed += processFile(filePath);
    }
    console.log(`\nProcessed ${files.length} files, changed ${changed}.`);
} else {
    console.error(`Unsupported path type: ${target}`);
    process.exit(1);
}
