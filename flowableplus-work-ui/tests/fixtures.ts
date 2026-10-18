import { expect, test as base } from '@playwright/test'

const authorization = `Basic ${Buffer.from('demo:demo').toString('base64')}`

// Mirrors FlowableAppDeploymentTestExecutionListener: every test starts and ends
// without runtime state left behind by earlier UI tests.
export const test = base.extend<{ cleanRuntimeState: void }>({
  cleanRuntimeState: [
    async ({ request }, use) => {
      await use()
      const headers = { Authorization: authorization }
      const response = await request.get('/api/flowableplus-api/runtime/process-instances?size=1000', { headers })
      expect(response.ok(), 'list process instances for cleanup').toBeTruthy()
      const { data } = (await response.json()) as { data: Array<{ id: string }> }
      for (const instance of data) {
        const deleted = await request.delete(`/api/flowableplus-api/runtime/process-instances/${instance.id}`, { headers })
        expect(deleted.status(), 'delete process instance during cleanup').toBeLessThan(300)
      }
    },
    { auto: true },
  ],
})

export { expect }
