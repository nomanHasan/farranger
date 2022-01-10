#!/usr/bin/env node


import fsex from 'fs-extra';
import fs from 'fs';
import { readdir } from 'fs/promises';


// const arrangeTarget='./arrange-target';

console.log(`Process CWD ${process.cwd()}`)
// const arrangeTarget='./arrange-target';
const arrangeTarget = process.cwd();

let farranger = {};
try {
    const data = fs.readFileSync(`${arrangeTarget}/farranger.json`, 'utf8')
    farranger = JSON.parse(data);
} catch (error) {
    console.log(`Provide a valid farranger.json file in the Current Directory->   ${arrangeTarget}`);
    process.exit(1);
}

(async () => {
    console.log(`Reading Directory from->    ${arrangeTarget}`);
    
    const files = await readdir(arrangeTarget, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            console.log(`${file.name} is a Directory.`);
            continue;
        }

        const filename = file.name;

        for (let dir in farranger) {
            const patterns = farranger[dir] || [];
            for (let pattern of patterns) {
                const matched = filename.match(pattern);
                if (matched) {
                    console.log(`Moving ${arrangeTarget}/${filename} to ${arrangeTarget}/${dir}/${filename}`, { pattern, dir });
                    fsex.moveSync(`${arrangeTarget}/${filename}`, `${arrangeTarget}/${dir}/${filename}`);
                    break;
                }
            }
        }
    }
})();
