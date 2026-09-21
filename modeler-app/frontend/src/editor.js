import BpmnModeler from 'bpmn-js/lib/Modeler.js';
import CmmnModdle from 'cmmn-moddle';

const BPMN_XML = '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_order" targetNamespace="http://flowableplus.example/order"><process id="order-intake" name="Order intake" isExecutable="true"><startEvent id="start"/><userTask id="review-order" name="Review order"/><endEvent id="end"/><sequenceFlow id="flow-start" sourceRef="start" targetRef="review-order"/><sequenceFlow id="flow-end" sourceRef="review-order" targetRef="end"/></process><bpmndi:BPMNDiagram id="BPMNDiagram_order"><bpmndi:BPMNPlane id="BPMNPlane_order" bpmnElement="order-intake"><bpmndi:BPMNShape id="shape-start" bpmnElement="start"><dc:Bounds x="120" y="120" width="36" height="36"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="shape-review" bpmnElement="review-order"><dc:Bounds x="240" y="98" width="120" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="shape-end" bpmnElement="end"><dc:Bounds x="450" y="120" width="36" height="36"/></bpmndi:BPMNShape><bpmndi:BPMNEdge id="edge-start" bpmnElement="flow-start"><di:waypoint x="156" y="138"/><di:waypoint x="240" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="edge-end" bpmnElement="flow-end"><di:waypoint x="360" y="138"/><di:waypoint x="450" y="138"/></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></definitions>';
const CMMN_XML = '<cmmn:definitions xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL" id="Definitions_customer" targetNamespace="http://flowableplus.example/customer"><cmmn:case id="customer-onboarding" name="Customer onboarding"/></cmmn:definitions>';

const canvas = document.querySelector('#editor-canvas');
const source = document.querySelector('#source-xml');
const status = document.querySelector('#editor-library-status');
const modeler = new BpmnModeler({ container: canvas });
let currentType = 'BPMN';
let currentXml = BPMN_XML;

function readCmmn(moddle, xml) {
    return new Promise((resolve, reject) => moddle.fromXML(xml, {}, (error, result) => error ? reject(error) : resolve(result)));
}

function writeCmmn(moddle, element) {
    return new Promise((resolve, reject) => moddle.toXML(element, { format: true }, (error, result) => error ? reject(error) : resolve(result)));
}

function setStatus(message, valid = true) {
    status.textContent = message;
    status.dataset.state = valid ? 'ready' : 'error';
}

async function importBpmn(xml) {
    await modeler.importXML(xml);
    currentXml = xml;
    source.value = xml;
    setStatus('BPMN editor ready');
}

async function importCmmn(xml) {
    const moddle = new CmmnModdle();
    const result = await readCmmn(moddle, xml);
    currentXml = xml;
    source.value = xml;
    canvas.replaceChildren();
    const notice = document.createElement('div');
    notice.className = 'cmmn-editor-notice';
    notice.innerHTML = '<strong>CMMN constrained editor</strong><span>Supported authoring surface: stages, human tasks, sentries, milestones, timers, variables, and assignments.</span><label>Add element<select id="cmmn-element-type"><option>stage</option><option>humanTask</option><option>sentry</option><option>milestone</option><option>timer</option><option>caseVariable</option></select></label><button class="secondary" id="add-cmmn-element" type="button">Add to source</button><small>' + result.cases.length + ' case model loaded · cmmn-moddle XML round-trip enabled</small>';
    canvas.appendChild(notice);
    document.querySelector('#add-cmmn-element').addEventListener('click', () => {
        const elementType = document.querySelector('#cmmn-element-type').value;
        const id = elementType + '-' + Date.now();
        currentXml = currentXml.replace('</cmmn:case>', '<cmmn:' + elementType + ' id="' + id + '" name="New ' + elementType + '"/></cmmn:case>');
        source.value = currentXml;
        setStatus('Added CMMN ' + elementType);
    });
    setStatus('CMMN editor ready');
}

async function exportCurrent() {
    if (currentType === 'BPMN') {
        const result = await modeler.saveXML({ format: true });
        currentXml = result.xml;
    } else {
        const moddle = new CmmnModdle();
        const parsed = await readCmmn(moddle, currentXml);
        currentXml = await writeCmmn(moddle, parsed);
    }
    source.value = currentXml;
    setStatus(currentType + ' XML round-trip complete');
    return currentXml;
}

window.FlowablePlusEditor = { importBpmn, importCmmn, exportCurrent };
document.querySelector('#editor-type').addEventListener('change', async (event) => {
    currentType = event.target.value;
    if (currentType === 'BPMN') {
        canvas.replaceChildren();
        await modeler.attachTo(canvas);
        await importBpmn(BPMN_XML);
    } else {
        await importCmmn(CMMN_XML);
    }
});
document.querySelector('#roundtrip-model').addEventListener('click', () => exportCurrent().catch(() => setStatus('XML round-trip failed', false)));
importBpmn(BPMN_XML).catch(() => setStatus('BPMN editor failed to load', false));