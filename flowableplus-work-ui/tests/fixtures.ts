import { expect, test as base } from '@playwright/test'

const authorization = `Basic ${Buffer.from('demo:demo').toString('base64')}`

type FlowableApp = {
  deploy: (resourcePath: string, tenantId?: string) => Promise<string>
}

export const test = base.extend<{ flowableApp: FlowableApp }>({
  flowableApp: [async ({ request }, use) => {
    const headers = { Authorization: authorization, 'Content-Type': 'application/json' }
    const deploymentIds: string[] = []
    const deploy = async (resourcePath: string, tenantId = '') => {
      const response = await request.post('/api/plus/test/app-deployments', {
        headers,
        data: { resourcePath, tenantId },
      })
      expect(response.ok(), 'deploy isolated test app').toBeTruthy()
      const { deploymentId } = (await response.json()) as { deploymentId: string }
      deploymentIds.push(deploymentId)
      return deploymentId
    }

    try {
      await deploy('flowablePlus/apps/simple-approval')
      await use({ deploy })
    } finally {
      for (const deploymentId of deploymentIds.reverse()) {
        const response = await request.delete(`/api/plus/test/app-deployments/${deploymentId}`, { headers })
        expect(response.status(), 'delete isolated test app').toBeLessThan(300)
      }
    }
  }, { auto: true }],
})

export { expect }
