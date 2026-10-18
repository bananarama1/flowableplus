import { Page } from '@playwright/test'
import { expect, test } from './fixtures'

async function login(page: Page) {
  await page.goto('/')
  await page.getByLabel('Username').fill('demo')
  await page.getByLabel('Password').fill('demo')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Process definitions' })).toBeVisible()
}

test('REQ-APP-001 authenticate the user', async ({ page }) => {
  await login(page)
  await expect(page.getByText('simpleApprovalProcess')).toBeVisible()
})

test('REQ-APP-002 reject unauthenticated API access', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('session is not authenticated')
  await expect(page.getByRole('heading', { name: 'Sign in to your work platform' })).toBeVisible()
})

test('REQ-APP-003 list deployed process definitions', async ({ page }) => {
  await login(page)
  const processRow = page.locator('.process-row').filter({ hasText: 'simpleApprovalProcess' })
  await expect(processRow).toContainText('Deployed')
})

test('REQ-APP-004 start an approval process', async () => {
  throw new Error('REQ-APP-004 not implemented')
})

test('REQ-APP-005 view the candidate task', async () => {
  throw new Error('REQ-APP-005 not implemented')
})

test('REQ-APP-006 claim the task', async () => {
  throw new Error('REQ-APP-006 not implemented')
})

test('REQ-APP-007 complete the assigned task', async () => {
  throw new Error('REQ-APP-007 not implemented')
})

test('REQ-APP-008 reject unauthorized task completion', async () => {
  throw new Error('REQ-APP-008 not implemented')
})

test('REQ-APP-009 report task conflicts', async () => {
  throw new Error('REQ-APP-009 not implemented')
})

test('REQ-APP-010 report Flowable validation errors', async () => {
  throw new Error('REQ-APP-010 not implemented')
})