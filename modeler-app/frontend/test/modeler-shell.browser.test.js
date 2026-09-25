import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const baseUrl = process.env.MODELER_APP_URL || 'http://127.0.0.1:8080';
const modelXml = '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"><process id="browser-process" name="Browser process"><startEvent id="start"/></process></definitions>';

test('authenticated modeler opens a client-scoped draft responsively', async (t) => {
    const browser = await chromium.launch({ headless: true });
    t.after(() => browser.close());

    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const tokenResponse = await context.request.post(`${baseUrl}/api/auth/token`, {
        data: { username: 'modeler', password: 'local-password' }
    });
    assert.equal(tokenResponse.status(), 200);
    const token = await tokenResponse.json();
    const key = `browser-${Date.now()}`;
    const projectResponse = await context.request.post(`${baseUrl}/api/modeler/projects?clientId=client-local`, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
        data: { modelKey: key, modelType: 'BPMN', displayName: 'Browser project', ownerId: 'modeler' }
    });
    assert.equal(projectResponse.status(), 200);
    const project = await projectResponse.json();
    const versionResponse = await context.request.post(`${baseUrl}/api/modeler/projects/${project.id}/versions?clientId=client-local`, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
        data: { xml: modelXml }
    });
    assert.equal(versionResponse.status(), 200);
    const version = await versionResponse.json();

    await context.addInitScript((accessToken) => {
        window.sessionStorage.setItem('flowableplus.accessToken', accessToken);
    }, token.accessToken);
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?clientId=client-local&projectId=${project.id}&versionId=${version.id}`);
    await page.waitForFunction(() => document.querySelector('#source-xml').value.includes('browser-process'));

    assert.equal(await page.getByText('Browser project', { exact: true }).count() > 0, true);
    assert.equal(await page.locator('#source-xml').inputValue(), modelXml);

    const updateResponse = page.waitForResponse((response) => response.request().method() === 'PUT' && response.url().includes(`/api/modeler/versions/${version.id}`));
    await page.locator('#save-draft').click();
    assert.equal((await updateResponse).status(), 200);

    const validationResponse = await context.request.post(`${baseUrl}/api/modeler/versions/${version.id}/validate?clientId=client-local`, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
        data: { modelType: 'BPMN', formSchema: null, correlationId: `browser-validate-${Date.now()}` }
    });
    assert.equal(validationResponse.status(), 200);

    const publishedVersion = { ...version, state: 'PUBLISHED' };
    const draftVersion = { ...publishedVersion, id: `browser-draft-${Date.now()}`, versionNumber: version.versionNumber + 1, state: 'DRAFT' };
    let draftCreated = false;
    await page.route(new RegExp(`/api/modeler/projects/${project.id}/versions\\?clientId=client-local$`), async (route) => {
        const response = await route.fetch();
        const versions = await response.json();
        const visibleVersions = versions.map((item) => ({ ...item, state: 'PUBLISHED' }));
        if (draftCreated) {
            visibleVersions.push(draftVersion);
        }
        await route.fulfill({ response, json: visibleVersions });
    });
    await page.route(new RegExp(`/api/modeler/versions/${version.id}/draft\\?clientId=client-local$`), async (route) => {
        draftCreated = true;
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(draftVersion) });
    });
    await page.goto(`${baseUrl}/?clientId=client-local&projectId=${project.id}&versionId=${version.id}`);
    await page.waitForFunction(() => document.querySelector('#source-xml').readOnly);
    assert.equal(await page.locator('#save-draft').isDisabled(), true);
    assert.equal(await page.locator('#create-draft').isVisible(), true);

    await page.locator('#create-draft').click();
    await page.waitForFunction(() => !document.querySelector('#source-xml').readOnly);
    assert.equal(await page.locator('#save-draft').isDisabled(), false);
    assert.equal(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth), true);
});