import { execFileSync } from 'node:child_process'

const composeFile = '../compose.playwright.yaml'
const composeProject = 'flowableplus-playwright'
const backendUrl = 'http://127.0.0.1:18080'

function compose(...args: string[]) {
  execFileSync('docker', ['compose', '-p', composeProject, '-f', composeFile, ...args], {
    cwd: process.cwd(),
    stdio: 'inherit',
})
}

export default async function globalSetup() {
  compose('up', '--build', '-d', 'playwright-backend')

  const authorization = `Basic ${Buffer.from('demo:demo').toString('base64')}`
  const deadline = Date.now() + 120_000
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${backendUrl}/flowableplus-api/repository/process-definitions?size=1`, {
        headers: { Authorization: authorization },
      })
      if (response.ok) {
        return
      }
    } catch {
      // The backend may still be starting while the container is healthy.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error(`Playwright backend did not become ready at ${backendUrl}`)
}