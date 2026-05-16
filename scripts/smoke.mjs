import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: true })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

console.log('[smoke] lint')
run('npm', ['run', 'lint'])

console.log('[smoke] test')
run('npm', ['run', 'test'])

console.log('[smoke] build')
run('npm', ['run', 'build'])

console.log('[smoke] PASS (mock only, no live execution)')
