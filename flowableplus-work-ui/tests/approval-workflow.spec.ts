import { test } from '@playwright/test'

function notImplemented(requirement: string): never {
  throw new Error(`${requirement} not implemented`)
}

test('REQ-APP-001 authenticate the user', async () => {
  notImplemented('REQ-APP-001')
})

test('REQ-APP-002 reject unauthenticated API access', async () => {
  notImplemented('REQ-APP-002')
})

test('REQ-APP-003 list deployed process definitions', async () => {
  notImplemented('REQ-APP-003')
})

test('REQ-APP-004 start an approval process', async () => {
  notImplemented('REQ-APP-004')
})

test('REQ-APP-005 view the candidate task', async () => {
  notImplemented('REQ-APP-005')
})

test('REQ-APP-006 claim the task', async () => {
  notImplemented('REQ-APP-006')
})

test('REQ-APP-007 complete the assigned task', async () => {
  notImplemented('REQ-APP-007')
})

test('REQ-APP-008 reject unauthorized task completion', async () => {
  notImplemented('REQ-APP-008')
})

test('REQ-APP-009 report task conflicts', async () => {
  notImplemented('REQ-APP-009')
})

test('REQ-APP-010 report Flowable validation errors', async () => {
  notImplemented('REQ-APP-010')
})