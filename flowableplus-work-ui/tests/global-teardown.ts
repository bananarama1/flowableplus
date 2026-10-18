import { execFileSync } from 'node:child_process'

export default function globalTeardown() {
  execFileSync('docker', [
    'compose',
    '-p',
    'flowableplus-playwright',
    '-f',
    '../compose.playwright.yaml',
    'down',
    '--volumes',
    '--remove-orphans',
  ], {
    cwd: process.cwd(),
    stdio: 'inherit',
})
}