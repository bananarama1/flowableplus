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

test('authenticated publication flows into generic work execution', async (t) => {
    const browser = await chromium.launch({ headless: true });
    t.after(() => browser.close());

    const modelerUrl = process.env.MODELER_APP_URL || 'http://127.0.0.1:8080';
    const workContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const modelerTokenResponse = await workContext.request.post(`${modelerUrl}/api/auth/token`, {
        data: { username: 'modeler', password: 'local-password' }
    });
    assert.equal(modelerTokenResponse.status(), 200);
    const modelerToken = await modelerTokenResponse.json();
    const workerTokenResponse = await workContext.request.post(`${baseUrl}/api/auth/token`, {
        data: { username: 'alice', password: 'local-password' }
    });
    assert.equal(workerTokenResponse.status(), 200);
    const workerToken = await workerTokenResponse.json();
    const headers = { Authorization: `Bearer ${modelerToken.accessToken}` };
    const key = `browser-vertical-${Date.now()}`;
    const xml = `<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:flowable="http://flowable.org/bpmn" targetNamespace="http://flowableplus.example/bpmn"><process id="${key}" name="Browser vertical process" isExecutable="true"><startEvent id="start"/><sequenceFlow id="toReview" sourceRef="start" targetRef="review"/><userTask id="review" name="Review request" flowable:assignee="alice"/><sequenceFlow id="toEnd" sourceRef="review" targetRef="end"/><endEvent id="end"/></process></definitions>`;
    const formSchema = {
        schemaVersion: '1',
        fields: [{ id: 'requestType', label: 'Request type', type: 'TEXT', required: true, variableName: 'requestType', options: [] }]
    };

    const projectResponse = await workContext.request.post(`${modelerUrl}/api/modeler/projects?clientId=client-local`, {
        headers,
        data: { modelKey: key, modelType: 'BPMN', displayName: 'Browser vertical process', ownerId: 'modeler' }
    });
    assert.equal(projectResponse.status(), 200);
    const project = await projectResponse.json();
    const draftResponse = await workContext.request.post(`${modelerUrl}/api/modeler/projects/${project.id}/versions?clientId=client-local`, {
        headers,
        data: { xml }
    });
    assert.equal(draftResponse.status(), 200);
    const draft = await draftResponse.json();
    const correlationId = `browser-correlation-${Date.now()}`;
    const validationResponse = await workContext.request.post(`${modelerUrl}/api/modeler/versions/${draft.id}/validate?clientId=client-local`, {
        headers,
        data: { modelType: 'BPMN', formSchema, correlationId }
    });
    const validationBody = await validationResponse.json();
    assert.equal(validationResponse.status(), 200, JSON.stringify(validationBody));
    assert.equal(validationBody.valid, true);
    const publicationResponse = await workContext.request.post(`${modelerUrl}/api/modeler/versions/${draft.id}/publish?clientId=client-local`, {
        headers,
        data: { modelType: 'BPMN', formSchema, correlationId, actorId: 'modeler' }
    });
    const publicationBody = await publicationResponse.json();
    assert.equal(publicationResponse.status(), 200, JSON.stringify(publicationBody));
    assert.equal(publicationBody.publication.status, 'ACTIVE');

    const page = await workContext.newPage();
    await workContext.addInitScript((accessToken) => {
        window.localStorage.setItem('flowableplus.accessToken', accessToken);
    }, workerToken.accessToken);
    await page.goto(`${baseUrl}/?clientId=client-local`);
    await page.getByRole('button', { name: 'Start work' }).click();
    await page.waitForFunction((modelKey) => Array.from(document.querySelectorAll('#definition-select option')).some((option) => option.value === modelKey), key);
    await page.locator('#definition-select').selectOption(key);
    await page.locator('#start-variables').fill('{"requestType":"travel"}');
    const startResponse = page.waitForResponse((response) => response.request().method() === 'POST' && response.url().includes(`/api/runtime/processes/${key}/instances`));
    await page.getByRole('button', { name: 'Start selected' }).click();
    assert.equal((await startResponse).status(), 200);
    const tasksResponse = await workContext.request.get(`${baseUrl}/api/runtime/tasks?clientId=client-local`, {
        headers: { Authorization: `Bearer ${workerToken.accessToken}` }
    });
    const tasks = await tasksResponse.json();
    const task = tasks.find((candidate) => candidate.name === 'Review request');
    assert.ok(task);
    await page.goto(`${baseUrl}/?clientId=client-local&taskId=${task.taskId}`);
    await page.getByRole('heading', { name: 'Review request' }).waitFor();
    await page.locator('textarea[name="requestType"]').fill('travel');
    await page.getByRole('button', { name: 'Complete task' }).click();
    await page.waitForFunction(() => document.querySelector('#task-items .empty-state') !== null || document.querySelector('.form-message').textContent.includes('Task completed'));
    assert.equal(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth), true);

    const crossClientResponse = await workContext.request.get(`${baseUrl}/api/definitions?clientId=other-client`, {
        headers: { Authorization: `Bearer ${workerToken.accessToken}` }
    });
    assert.equal(crossClientResponse.status(), 403);
});