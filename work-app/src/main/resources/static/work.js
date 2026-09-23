var fallbackFormSchema = {
    schemaVersion: '1',
    fields: [
        { id: 'decision', label: 'Decision', type: 'SELECT', required: true, variableName: 'approvalDecision', options: ['Approve', 'Request changes'] },
        { id: 'reviewNote', label: 'Review note', type: 'TEXT', required: false, variableName: 'approvalNote', initialValue: '' , placeholder: 'Add a note for the next person...' },
        { id: 'reviewed', label: 'I have reviewed the order details', type: 'BOOLEAN', required: true, variableName: 'reviewed' }
    ]
};

function request(path, options) {
    var headers = Object.assign({}, options && options.headers);
    var accessToken = window.localStorage.getItem('flowableplus.accessToken');
    if (accessToken) { headers.Authorization = 'Bearer ' + accessToken; }
    return fetch(path, Object.assign({}, options, { headers: headers })).then(function (response) {
        return response.text().then(function (body) {
            var payload = body ? JSON.parse(body) : null;
            if (!response.ok) { var error = new Error(payload && payload.message || 'Request failed'); error.payload = payload; error.status = response.status; throw error; }
            return payload;
        });
    });
}

function renderForm(schema, values) {
    var root = document.querySelector('#form-fields');
    root.replaceChildren();
    (schema && schema.fields || []).forEach(function (field) {
        var label = document.createElement('label');
        label.dataset.fieldId = field.id;
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
        if (values && values[field.variableName] !== undefined && field.type !== 'BOOLEAN') { input.value = values[field.variableName]; }
        if (field.type === 'BOOLEAN') { input.checked = values ? Boolean(values[field.variableName]) : Boolean(field.initialValue); label.className = 'checkbox'; label.prepend(input); }
        else { label.appendChild(input); }
        root.appendChild(label);
    });
}

var query = new URLSearchParams(window.location.search);
var runtimeClientId = query.get('clientId') || 'client-local';
var selectedTaskId = query.get('taskId');
var currentInstance = null;

function errorMessage(error, fallback) { return error.status === 401 ? 'Sign in is required to view this client.' : (error.message || fallback); }
function setMessage(id, text, isError) { var element = document.querySelector(id); element.textContent = text || ''; element.classList.toggle('error-message', Boolean(isError)); }

function loadTasks() {
    return request('/api/runtime/tasks?clientId=' + encodeURIComponent(runtimeClientId)).then(function (tasks) {
        var root = document.querySelector('#task-items'); root.replaceChildren();
        document.querySelector('#open-count').textContent = tasks.length;
        document.querySelector('#due-count').textContent = tasks.filter(function (task) { return task.dueAt && new Date(task.dueAt).toDateString() === new Date().toDateString(); }).length;
        tasks.forEach(function (task, index) {
            var button = document.createElement('button'); button.type = 'button'; button.className = 'task' + ((selectedTaskId || (index === 0 && !selectedTaskId)) === task.taskId ? ' selected' : ''); button.dataset.taskId = task.taskId;
            button.innerHTML = '<span class="task-type blue-fill">T</span><span class="task-copy"><strong></strong><small></small></span><span class="due"></span>';
            button.querySelector('strong').textContent = task.name || task.taskDefinitionKey || 'User task';
            button.querySelector('small').textContent = 'Instance ' + (task.processInstanceId || task.caseInstanceId || 'unknown');
            button.querySelector('.due').textContent = task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'No due date';
            button.addEventListener('click', function () { selectedTaskId = task.taskId; loadTask(task.taskId); }); root.appendChild(button);
        });
        if (!tasks.length) { root.innerHTML = '<div class="empty-state">No active tasks in this client.</div>'; document.querySelector('#task-detail').innerHTML = '<div class="empty-state">Your inbox is clear.</div>'; return; }
        loadTask(selectedTaskId || tasks[0].taskId);
    }).catch(function (error) { setMessage('#global-message', errorMessage(error, 'The task inbox is unavailable.'), true); });
}

function loadTask(taskId) {
    selectedTaskId = taskId;
    document.querySelectorAll('.task').forEach(function (item) { item.classList.toggle('selected', item.dataset.taskId === taskId); });
    Promise.all([request('/api/runtime/tasks/' + encodeURIComponent(taskId) + '?clientId=' + encodeURIComponent(runtimeClientId)), request('/api/runtime/tasks/' + encodeURIComponent(taskId) + '/form?clientId=' + encodeURIComponent(runtimeClientId))])
        .then(function (responses) { var detail = responses[0]; var schema = responses[1] || fallbackFormSchema; renderTaskDetail(detail); renderForm(schema, detail.variables || {}); })
        .catch(function (error) { setMessage('#global-message', errorMessage(error, 'The task is no longer available.'), true); });
}

function renderTaskDetail(detail) {
    var task = detail.task; document.querySelector('#task-detail').innerHTML = '<div class="detail-head"><div><span class="eyebrow">USER TASK</span><h2 id="detail-title"></h2><p>Runtime task <span class="separator">·</span> Active</p></div><button class="secondary" type="button" id="claim-task">Claim task</button></div><div class="detail-meta"><span><small>Assigned to</small><strong id="detail-assignee"></strong></span><span><small>Task state</small><strong>ACTIVE</strong></span><span><small>Instance</small><strong id="detail-instance"></strong></span></div><form class="task-form" id="task-form"><div class="form-title">Task details</div><div id="form-fields"></div><div class="form-actions"><span class="form-message" aria-live="polite"></span><button class="primary" type="submit">Complete task</button></div></form>';
    document.querySelector('#detail-title').textContent = task.name || task.taskDefinitionKey || 'User task'; document.querySelector('#detail-assignee').textContent = task.assignee || 'Available to claim'; document.querySelector('#detail-instance').textContent = task.processInstanceId || task.caseInstanceId || 'Unknown';
    document.querySelector('#claim-task').addEventListener('click', function () { request('/api/runtime/tasks/' + encodeURIComponent(task.taskId) + '/claim?clientId=' + encodeURIComponent(runtimeClientId), { method: 'POST' }).then(function () { setMessage('#global-message', 'Task claimed.'); loadTasks(); }).catch(function (error) { setMessage('#global-message', errorMessage(error, 'The task could not be claimed.'), true); }); });
    document.querySelector('#task-form').addEventListener('submit', submitTask);
}
function submitTask(event) {
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
    request('/api/runtime/tasks/' + encodeURIComponent(selectedTaskId) + '/complete?clientId=' + encodeURIComponent(runtimeClientId), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
        .then(function (nextTasks) { message.textContent = 'Task completed. Refreshing next state...'; loadTasks(); if (nextTasks && nextTasks[0]) { selectedTaskId = nextTasks[0].taskId; loadTask(selectedTaskId); } })
        .catch(function (error) { var details = error.payload && error.payload.errors; message.textContent = details && details.length ? details.map(function (item) { return item.message; }).join(' ') : errorMessage(error, 'The task could not be completed. Try again.'); message.style.color = '#b97b13'; });
    }

function openCatalog() { document.querySelector('#catalog-panel').hidden = false; setMessage('#start-message', 'Loading available definitions...'); request('/api/definitions?clientId=' + encodeURIComponent(runtimeClientId)).then(function (definitions) { var select = document.querySelector('#definition-select'); select.replaceChildren(); definitions.filter(function (definition) { return definition.startable; }).forEach(function (definition) { var option = new Option((definition.displayName || definition.modelKey) + ' · v' + definition.version, definition.modelKey); option.dataset.type = definition.modelType; select.appendChild(option); }); setMessage('#start-message', definitions.length ? '' : 'No active definitions are available.'); }).catch(function (error) { setMessage('#start-message', errorMessage(error, 'The process catalog is unavailable.'), true); }); }
function startSelected() { var select = document.querySelector('#definition-select'); var selected = select.options[select.selectedIndex]; if (!selected) { setMessage('#start-message', 'Choose an available definition first.', true); return; } var variables; try { variables = JSON.parse(document.querySelector('#start-variables').value || '{}'); } catch (error) { setMessage('#start-message', 'Initial variables must be valid JSON.', true); return; } var endpoint = selected.dataset.type === 'CMMN' ? '/api/runtime/cases/' : '/api/runtime/processes/'; request(endpoint + encodeURIComponent(selected.value) + '/instances?clientId=' + encodeURIComponent(runtimeClientId), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(variables) }).then(function (instance) { currentInstance = { id: instance.processInstanceId || instance.caseInstanceId, type: selected.dataset.type }; setMessage('#start-message', 'Started instance ' + currentInstance.id + '.'); document.querySelector('#catalog-panel').hidden = true; refreshMonitor(); loadTasks(); }).catch(function (error) { setMessage('#start-message', errorMessage(error, 'The instance could not be started.'), true); }); }
function refreshMonitor() { if (!currentInstance) return; var base = currentInstance.type === 'CMMN' ? '/api/runtime/case-instances/' : '/api/runtime/process-instances/'; request(base + encodeURIComponent(currentInstance.id) + '/history?clientId=' + encodeURIComponent(runtimeClientId)).then(function (history) { document.querySelector('#monitor-content').innerHTML = '<div class="monitor-summary"><strong></strong><span></span><span></span><span></span></div><ol class="timeline" aria-label="Instance timeline"><li>Instance created</li><li>Current state: ' + (history.state || 'UNKNOWN') + '</li>' + (history.endedAt ? '<li>Completed ' + new Date(history.endedAt).toLocaleString() + '</li>' : '<li>Waiting for next work</li>') + '</ol>'; var summary = document.querySelector('.monitor-summary'); summary.children[0].textContent = history.definitionKey || 'Instance'; summary.children[1].textContent = 'Version: ' + (history.definitionVersion || 'Unknown'); summary.children[2].textContent = 'State: ' + (history.state || 'UNKNOWN'); summary.children[3].textContent = 'Started: ' + (history.startedAt ? new Date(history.startedAt).toLocaleString() : 'Unknown'); }).catch(function (error) { setMessage('#global-message', errorMessage(error, 'Instance monitoring is unavailable.'), true); }); }

document.querySelector('#start-work').addEventListener('click', openCatalog); document.querySelector('#close-catalog').addEventListener('click', function () { document.querySelector('#catalog-panel').hidden = true; }); document.querySelector('#confirm-start').addEventListener('click', startSelected); document.querySelector('#refresh-monitor').addEventListener('click', refreshMonitor);
loadTasks();