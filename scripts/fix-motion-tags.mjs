import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (p.endsWith('.tsx')) fix(p)
  }
}

function fix(p) {
  let s = readFileSync(p, 'utf8')
  if (!/<\/?motion\b/.test(s)) return
  s = s.replace(/<\/?motion\b/g, (m) => m.replace('motion', 'div'))
  writeFileSync(p, s)
  console.log('fixed', p)
}

function fixAll(dir) {
  walk(dir)
}
fixAll('src')
