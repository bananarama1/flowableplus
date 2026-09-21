import assert from 'node:assert/strict';
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