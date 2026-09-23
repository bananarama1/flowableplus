import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../../src/main/resources/static/', import.meta.url);

async function asset(name) {
    return readFile(new URL(name, root), 'utf8');
}

test('work shell exposes the browser and accessibility baseline', async () => {
    const html = await asset('index.html');
    const css = await asset('work.css');
    assert.match(html, /<html lang="en">/);
    assert.match(html, /name="viewport" content="width=device-width, initial-scale=1"/);
    assert.match(html, /aria-label="Work navigation"/);
    assert.match(html, /role="status" aria-live="polite"/);
    assert.match(html, /id="start-variables"/);
    assert.match(css, /@media \(max-width: 640px\)/);
    assert.doesNotMatch(css, /min-width:\s*820px/);
});

test('work shell wires generic runtime interactions', async () => {
    const html = await asset('index.html');
    const script = await asset('work.js');
    assert.match(html, /id="task-items"/);
    assert.match(html, /id="monitor-content"/);
    assert.match(script, /\/api\/runtime\/tasks/);
    assert.match(script, /\/api\/runtime\/processes\//);
    assert.match(script, /\/api\/runtime\/cases\//);
    assert.match(script, /\/api\/runtime\/process-instances\//);
    assert.match(script, /\/api\/runtime\/case-instances\//);
    assert.match(script, /Initial variables must be valid JSON/);
    assert.match(script, /Task completed\. Refreshing next state/);
});
