document.querySelectorAll('.project, .tab, .tool').forEach(function (element) {
    element.addEventListener('click', function () {
        if (element.classList.contains('project')) {
            document.querySelectorAll('.project').forEach(function (item) { item.classList.remove('active'); });
            element.classList.add('active');
        }
        if (element.classList.contains('tab')) {
            document.querySelectorAll('.tab').forEach(function (item) { item.classList.remove('active'); });
            element.classList.add('active');
        }
        if (element.classList.contains('tool')) {
            document.querySelectorAll('.tool').forEach(function (item) { item.classList.remove('active'); });
            element.classList.add('active');
        }
    });
});

var params = new URLSearchParams(window.location.search);
var clientId = params.get('clientId');
var versionId = params.get('versionId');
var projectId = params.get('projectId');
var validationPassed = false;
var requestHeaders = { 'Content-Type': 'application/json' };

function api(path, options) {
    return fetch(path, Object.assign({ headers: requestHeaders }, options || {})).then(function (response) {
        return response.json().then(function (body) { if (!response.ok) { throw body; } return body; });
    });
}

function showValidation(valid, message) {
    validationPassed = valid;
    document.querySelector('#validation-icon').textContent = valid ? '✓' : '!';
    document.querySelector('#validation-icon').style.color = valid ? '#2b8d5a' : '#b97b13';
    document.querySelector('#validation-message').textContent = message;
    document.querySelector('#publish-model').disabled = !valid;
}

function selectedModelType() {
    var selector = document.querySelector('#editor-type');
    return selector ? selector.value : 'BPMN';
}

document.querySelector('#save-draft').addEventListener('click', function () {
    if (!clientId || !projectId) { document.querySelector('#publication-status').textContent = 'Add clientId and projectId to save this draft.'; return; }
    var xmlPromise = window.FlowablePlusEditor ? window.FlowablePlusEditor.exportCurrent() : Promise.resolve(document.querySelector('#source-xml').value);
    xmlPromise.then(function (xml) { return api('/api/modeler/projects/' + encodeURIComponent(projectId) + '/versions?clientId=' + encodeURIComponent(clientId), {
        method: 'POST', body: JSON.stringify({ xml: xml })
    }); }).then(function () { document.querySelector('#publication-status').textContent = 'Draft saved'; })
        .catch(function () { document.querySelector('#publication-status').textContent = 'Draft could not be saved'; });
});

document.querySelector('#validate-model').addEventListener('click', function () {
    if (!clientId || !versionId) { showValidation(true, 'Local source is ready to validate'); return; }
    api('/api/modeler/versions/' + encodeURIComponent(versionId) + '/validate?clientId=' + encodeURIComponent(clientId), {
        method: 'POST', body: JSON.stringify({ modelType: selectedModelType(), formSchema: null, correlationId: crypto.randomUUID() })
    }).then(function (result) { showValidation(result.valid, result.valid ? 'All checks passed' : 'Validation failed: ' + result.errors.length + ' issue(s)'); })
        .catch(function () { showValidation(false, 'Validation request failed'); });
});

document.querySelector('#publish-model').addEventListener('click', function () {
    if (!validationPassed) { showValidation(false, 'Validate the model before publishing'); return; }
    if (!clientId || !versionId) { document.querySelector('#publication-status').textContent = 'Validated locally; connect a version to publish'; return; }
    var requestCorrelationId = crypto.randomUUID();
    api('/api/modeler/versions/' + encodeURIComponent(versionId) + '/publish?clientId=' + encodeURIComponent(clientId), {
        method: 'POST', body: JSON.stringify({ modelType: selectedModelType(), formSchema: null, correlationId: requestCorrelationId })
    }).then(function (result) { document.querySelector('#publication-status').textContent = 'Published · ' + result.correlationId; })
        .catch(function () { document.querySelector('#publication-status').textContent = 'Publication failed; active version unchanged'; });
});