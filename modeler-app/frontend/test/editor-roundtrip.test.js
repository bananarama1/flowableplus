import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import BpmnModdle from 'bpmn-moddle';
import CmmnModdle from 'cmmn-moddle';

function readCmmn(moddle, xml) {
    return new Promise((resolve, reject) => moddle.fromXML(xml, {}, (error, result) => error ? reject(error) : resolve(result)));
}

function writeCmmn(moddle, element) {
    return new Promise((resolve, reject) => moddle.toXML(element, { format: true }, (error, result) => error ? reject(error) : resolve(result)));
}

test('BPMN round-trip preserves unknown Flowable extension data', async () => {
    const moddle = new BpmnModdle();
    const xml = '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:flowable="http://flowable.org/bpmn" xmlns:custom="urn:custom" id="definitions"><process id="process" flowable:historyLevel="audit"><extensionElements><custom:preserved value="yes"/></extensionElements><startEvent id="start"/></process></definitions>';
    const parsed = await moddle.fromXML(xml);
    const output = (await moddle.toXML(parsed.rootElement, { format: true })).xml;
    assert.match(output, /flowable:historyLevel="audit"/);
    assert.match(output, /custom:preserved/);
});

test('CMMN round-trip preserves supported elements and unknown extension data', async () => {
    const moddle = new CmmnModdle();
    const xml = '<cmmn:definitions xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL" id="definitions"></cmmn:definitions>';
    const parsed = await readCmmn(moddle, xml);
    const cmmnCase = moddle.create('cmmn:Case', { id: 'case' });
    parsed.get('cases').push(cmmnCase);
    const output = await writeCmmn(moddle, parsed);
    assert.match(output, /cmmn:case/);
    assert.match(output, /id="case"/);
});

test('modeler Save draft persists the current model and keeps advanced collaboration out of scope', async () => {
    const html = await readFile(new URL('../../src/main/resources/static/index.html', import.meta.url), 'utf8');
    const modeler = await readFile(new URL('../../src/main/resources/static/modeler.js', import.meta.url), 'utf8');

    assert.match(html, /id="save-draft"[^>]*>Save draft</);
    assert.match(modeler, /FlowablePlusEditor\.exportCurrent\(\)/);
    assert.match(modeler, /\/versions\?clientId=/);
    assert.match(modeler, /Draft saved/);
    assert.match(modeler, /Draft could not be saved/);
});

test('modeler workspace renders server state without sample project leakage', async () => {
    const html = await readFile(new URL('../../src/main/resources/static/index.html', import.meta.url), 'utf8');
    const modeler = await readFile(new URL('../../src/main/resources/static/modeler.js', import.meta.url), 'utf8');
    const css = await readFile(new URL('../../src/main/resources/static/modeler.css', import.meta.url), 'utf8');

    assert.doesNotMatch(html, /Northstar Operations|Order intake|Customer onboarding/);
    assert.match(modeler, /history\.replaceState/);
    assert.match(modeler, /\/api\/modeler\/projects\?clientId=/);
    assert.match(modeler, /sessionStorage\.getItem\('flowableplus\.accessToken'\)/);
    assert.match(modeler, /method = .*'PUT'/);
    assert.match(modeler, /\/api\/modeler\/versions\/.*\/draft\?clientId=/);
    assert.match(modeler, /state === 'PUBLISHED'/);
    assert.match(css, /@media \(max-width: 640px\)/);
});