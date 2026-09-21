document.querySelectorAll('.task').forEach(function (task) {
    task.addEventListener('click', function () {
        document.querySelectorAll('.task').forEach(function (item) { item.classList.remove('selected'); });
        task.classList.add('selected');
    });
});

var fallbackFormSchema = {
    schemaVersion: '1',
    fields: [
        { id: 'decision', label: 'Decision', type: 'SELECT', required: true, variableName: 'approvalDecision', options: ['Approve', 'Request changes'] },
        { id: 'reviewNote', label: 'Review note', type: 'TEXT', required: false, variableName: 'approvalNote', initialValue: '' , placeholder: 'Add a note for the next person...' },
        { id: 'reviewed', label: 'I have reviewed the order details', type: 'BOOLEAN', required: true, variableName: 'reviewed' }
    ]
};

function renderForm(schema) {
    var root = document.querySelector('#form-fields');
    root.replaceChildren();
    schema.fields.forEach(function (field) {
        var label = document.createElement('label');
        label.textContent = field.label + (field.required ? ' *' : '');
        var input;
        if (field.type === 'SELECT') {
            input = document.createElement('select');
            input.appendChild(new Option('Choose a decision', ''));
            field.options.forEach(function (option) { input.appendChild(new Option(option, option)); });
        } else if (field.type === 'TEXT') {
            input = document.createElement('textarea');
            input.rows = 4;
            input.placeholder = field.placeholder || '';
        } else {
            input = document.createElement('input');
            input.type = field.type === 'BOOLEAN' ? 'checkbox' : 'text';
        }
        input.name = field.id;
        input.dataset.required = field.required;
        input.dataset.variableName = field.variableName || field.id;
        if (field.initialValue !== undefined && field.type !== 'BOOLEAN') { input.value = field.initialValue; }
        if (field.type === 'BOOLEAN') { label.className = 'checkbox'; label.prepend(input); }
        else { label.appendChild(input); }
        root.appendChild(label);
    });
}

var query = new URLSearchParams(window.location.search);
var taskId = query.get('taskId');
var clientId = query.get('clientId');
var accessToken = window.localStorage.getItem('flowableplus.accessToken');
var runtimeClientId = clientId || 'client-local';
var formSchemaPromise = taskId && clientId
    ? fetch('/api/runtime/tasks/' + encodeURIComponent(taskId) + '/form?clientId=' + encodeURIComponent(clientId), {
        headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : {}
    }).then(function (response) { if (!response.ok) { throw new Error('Form metadata unavailable'); } return response.json(); })
    : Promise.resolve(fallbackFormSchema);

formSchemaPromise.then(renderForm).catch(function () { renderForm(fallbackFormSchema); });

document.querySelector('#start-work').addEventListener('click', function () {
    var panel = document.querySelector('#start-panel');
    panel.hidden = false;
    fetch('/api/definitions?clientId=' + encodeURIComponent(runtimeClientId), {
        headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : {}
    }).then(function (response) { if (!response.ok) { throw new Error('Catalog unavailable'); } return response.json(); })
        .then(function (definitions) {
            var select = document.querySelector('#definition-select');
            select.replaceChildren();
            definitions.forEach(function (definition) {
                var option = new Option(definition.displayName || definition.modelKey, definition.modelKey);
                option.dataset.type = definition.modelType;
                select.appendChild(option);
            });
            if (!definitions.length) { document.querySelector('#start-message').textContent = 'No active definitions are available.'; }
        }).catch(function () { document.querySelector('#start-message').textContent = 'The process catalog is unavailable.'; });
});

document.querySelector('#confirm-start').addEventListener('click', function () {
    var select = document.querySelector('#definition-select');
    var selected = select.options[select.selectedIndex];
    if (!selected) { return; }
    var endpoint = selected.dataset.type === 'CMMN' ? '/api/runtime/cases/' : '/api/runtime/processes/';
    fetch(endpoint + encodeURIComponent(selected.value) + '/instances?clientId=' + encodeURIComponent(runtimeClientId), {
        method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, accessToken ? { Authorization: 'Bearer ' + accessToken } : {}), body: '{}'
    }).then(function (response) { if (!response.ok) { throw new Error('Start failed'); } return response.json(); })
        .then(function (instance) { document.querySelector('#start-message').textContent = 'Started instance ' + (instance.id || instance.instanceId); })
        .catch(function () { document.querySelector('#start-message').textContent = 'The instance could not be started.'; });
});
document.querySelector('#task-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var message = document.querySelector('.form-message');
    var invalid = Array.from(document.querySelectorAll('#form-fields [data-required="true"]')).some(function (field) {
        return field.type === 'checkbox' ? !field.checked : !field.value.trim();
    });
    if (invalid) { message.textContent = 'Complete all required fields before completing the task.'; message.style.color = '#b97b13'; return; }
    var values = {};
    document.querySelectorAll('#form-fields [name]').forEach(function (field) {
        values[field.dataset.variableName] = field.type === 'checkbox' ? field.checked : field.value;
    });
    if (taskId && clientId) {
        fetch('/api/runtime/tasks/' + encodeURIComponent(taskId) + '/complete?clientId=' + encodeURIComponent(clientId), {
            method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, accessToken ? { Authorization: 'Bearer ' + accessToken } : {}), body: JSON.stringify(values)
        }).then(function (response) { if (!response.ok) { throw new Error('Task completion failed'); } message.textContent = 'Task completed. Refreshing next state...'; })
            .catch(function () { message.textContent = 'The task could not be completed. Try again.'; message.style.color = '#b97b13'; });
        return;
    }
    message.textContent = 'Task completed. Refreshing next state...';
});