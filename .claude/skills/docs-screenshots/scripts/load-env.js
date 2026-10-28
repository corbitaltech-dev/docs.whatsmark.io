// Load settings from a simple KEY=value file into process.env without overwriting
// variables that are already set. Looks for SHOT_ENV_FILE, then `.env.screenshots`
// in the current folder and its parents (so it works from the docs repo root).
const fs = require('fs');
const path = require('path');

function find() {
  if (process.env.SHOT_ENV_FILE) return process.env.SHOT_ENV_FILE;
  let dir = process.cwd();
  for (;;) {
    const f = path.join(dir, '.env.screenshots');
    if (fs.existsSync(f)) return f;
    const up = path.dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

const file = find();
if (file && fs.existsSync(file)) {
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}
