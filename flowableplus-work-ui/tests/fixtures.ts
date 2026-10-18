import { expect, test as base } from '@playwright/test'

const authorization = `Basic ${Buffer.from('demo:demo').toString('base64')}`

// Track only deployments created by the current UI test.
export const test = base.extend<{ flowableApp: { deploy: (resourcePath: string, tenantId?: string) => Promise<string> } }>({
  flowableApp: async ({ request }, use) => {
    const headers = { Authorization: authorization, 'Content-Type': 'application/json' }
    const deploymentIds: string[] = []
    await use({
      deploy: async (resourcePath, tenantId = '') => {
        const response = await request.post('/api/flowableplus-api/plus/test/app-deployments', {
          headers,
          data: { resourcePath, tenantId },
        })
        expect(response.ok(), 'deploy isolated test app').toBeTruthy()
        const { deploymentId } = (await response.json()) as { deploymentId: string }
        deploymentIds.push(deploymentId)
        return deploymentId
      },
    })
    for (const deploymentId of deploymentIds.reverse()) {
      const response = await request.delete(`/api/flowableplus-api/plus/test/app-deployments/${deploymentId}`, { headers })
      expect(response.status(), 'delete isolated test app').toBeLessThan(300)
    }
  },
})

export { expect }
