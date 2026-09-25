import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const baseUrl = process.env.WORK_APP_URL || 'http://127.0.0.1:8081';

test('authenticated work shell loads the client-scoped catalog and responsive layout', async (t) => {
    const browser = await chromium.launch({ headless: true });
    t.after(() => browser.close());

    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const tokenResponse = await context.request.post(`${baseUrl}/api/auth/token`, {
        data: { username: 'alice', password: 'local-password' }
    });
    assert.equal(tokenResponse.status(), 200);
    const token = await tokenResponse.json();
    await context.addInitScript((accessToken) => {
        window.localStorage.setItem('flowableplus.accessToken', accessToken);
    }, token.accessToken);

    const page = await context.newPage();
    await page.goto(`${baseUrl}/?clientId=client-local`);
    await page.waitForFunction(() => document.querySelector('#task-items .empty-state') !== null);
    await page.getByRole('button', { name: 'Start work' }).click();
    await page.waitForFunction(() => document.querySelector('#catalog-panel').hidden === false);
    await page.waitForFunction(() => document.querySelector('#start-message').textContent.includes('No active definitions'));

    assert.equal(await page.title(), 'Flowable Plus Work');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth), true);
});

test('unauthenticated work shell cannot read the task inbox', async (t) => {
    const browser = await chromium.launch({ headless: true });
    t.after(() => browser.close());

    const page = await browser.newPage();
    await page.goto(`${baseUrl}/?clientId=client-local`);
    await page.waitForFunction(() => document.querySelector('#global-message').textContent.includes('Sign in is required'));

    assert.match(await page.locator('#global-message').textContent(), /Sign in is required/);
});