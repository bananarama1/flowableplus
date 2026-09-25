var params = new URLSearchParams(window.location.search);
var workspace = { clientId: params.get('clientId') || 'client-local', projectId: params.get('projectId'), versionId: params.get('versionId'), projects: [], versions: [], project: null, version: null, validationPassed: false, editorReady: Boolean(window.FlowablePlusEditor) };

function correlationId() { return window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()); }

function request(path, options) {
    var requestOptions = options || {};
    var headers = Object.assign({ Accept: 'application/json' }, requestOptions.headers || {});
    if (requestOptions.body !== undefined) { headers['Content-Type'] = 'application/json'; }
    var accessToken = window.sessionStorage.getItem('flowableplus.accessToken');
    if (accessToken) { headers.Authorization = 'Bearer ' + accessToken; }
    headers['X-Correlation-Id'] = headers['X-Correlation-Id'] || correlationId();
    return fetch(path, Object.assign({}, requestOptions, { headers: headers })).then(function (response) {
        return response.text().then(function (text) {
            var body = text ? JSON.parse(text) : null;
            if (!response.ok) { var error = new Error(body && body.message || 'Request failed'); error.status = response.status; error.payload = body; throw error; }
            return body;
        });
    });
}

function updateUrl() {
    var next = new URL(window.location.href);
    next.searchParams.set('clientId', workspace.clientId);
    if (workspace.projectId) { next.searchParams.set('projectId', workspace.projectId); } else { next.searchParams.delete('projectId'); }
    if (workspace.versionId) { next.searchParams.set('versionId', workspace.versionId); } else { next.searchParams.delete('versionId'); }
    window.history.replaceState({}, '', next);
}

function selectedModelType() { return workspace.project ? workspace.project.modelType : document.querySelector('#editor-type').value; }
function setMessage(message, error) { var target = document.querySelector('#publication-status'); target.textContent = message || ''; target.classList.toggle('error-message', Boolean(error)); }

function showValidation(valid, message) {
    workspace.validationPassed = valid;
    document.querySelector('#validation-icon').textContent = valid ? '✓' : '!';
    document.querySelector('#validation-icon').style.color = valid ? '#2b8d5a' : '#b97b13';
    document.querySelector('#validation-message').textContent = message;
    document.querySelector('#publish-model').disabled = !valid || !workspace.version;
}

function renderProjects() {
    var root = document.querySelector('#project-list'); root.replaceChildren();
    if (!workspace.projects.length) { root.innerHTML = '<div class="empty-state">No projects in this client.</div>'; return; }
    workspace.projects.forEach(function (project) {
        var link = document.createElement('a'); link.className = 'project' + (project.id === workspace.projectId ? ' active' : ''); link.href = '?clientId=' + encodeURIComponent(workspace.clientId) + '&projectId=' + encodeURIComponent(project.id); link.dataset.projectId = project.id;
        link.innerHTML = '<span class="project-dot"></span><span><strong></strong><small></small></span>'; link.querySelector('strong').textContent = project.displayName; link.querySelector('small').textContent = project.modelType + ' · ' + project.modelKey + ' · ' + project.lifecycleState;
        link.addEventListener('click', function (event) { event.preventDefault(); selectProject(project.id); }); root.appendChild(link);
    });
}

function renderTabs() {
    var root = document.querySelector('#model-tabs'); root.querySelectorAll('.tab, .empty-tab').forEach(function (element) { element.remove(); });
    var tab = document.createElement('button'); tab.className = 'tab active'; tab.type = 'button'; tab.setAttribute('role', 'tab'); tab.setAttribute('aria-selected', 'true'); tab.textContent = workspace.project ? workspace.project.displayName : 'No project selected'; root.prepend(tab);
}

function renderProperties() {
    var root = document.querySelector('#model-properties'); root.replaceChildren();
    if (!workspace.project) { root.innerHTML = '<div class="empty-state">Select a project to inspect its properties.</div>'; return; }
    root.innerHTML = '<div class="element-badge"><span class="task-icon">□</span><span><strong></strong><small></small></span></div><div class="model-meta"></div><div class="section-label">Version history</div><div id="version-history"></div>';
    root.querySelector('.element-badge strong').textContent = workspace.project.displayName; root.querySelector('.element-badge small').textContent = workspace.project.modelType + ' · ' + workspace.project.modelKey; root.querySelector('.model-meta').textContent = 'Owner: ' + workspace.project.ownerId + ' · ' + workspace.project.lifecycleState;
    var history = root.querySelector('#version-history');
    workspace.versions.forEach(function (version) {
        var button = document.createElement('button'); button.className = 'version' + (version.id === workspace.versionId ? ' selected' : ''); button.type = 'button'; button.innerHTML = '<span><strong></strong> </span><small></small>'; button.querySelector('strong').textContent = 'v' + version.versionNumber; button.querySelector('span').appendChild(document.createTextNode(version.state)); button.querySelector('small').textContent = new Date(version.createdAt).toLocaleString(); button.addEventListener('click', function () { selectVersion(version.id); }); history.appendChild(button);
    });
    if (!workspace.versions.length) { history.innerHTML = '<div class="empty-state">No versions yet.</div>'; }
}

function renderVersion() {
    var version = workspace.version, source = document.querySelector('#source-xml'); source.value = version ? version.xml : ''; source.readOnly = Boolean(version && version.state === 'PUBLISHED'); document.querySelector('#save-draft').disabled = !workspace.project || Boolean(version && version.state === 'PUBLISHED'); document.querySelector('#create-draft').hidden = !(version && version.state === 'PUBLISHED'); document.querySelector('#canvas-label').innerHTML = '<span class="status-dot"></span> ' + (workspace.project ? workspace.project.modelType + ' · ' + (version ? version.state + ' v' + version.versionNumber : 'No version') : 'No version selected'); document.querySelector('#canvas-hint').textContent = version ? 'Select an element to inspect its properties' : 'Create or select a version to open a model'; document.querySelector('#editor-type').value = workspace.project ? workspace.project.modelType : 'BPMN'; document.querySelector('#editor-type').disabled = Boolean(workspace.project); showValidation(false, version ? (version.state === 'PUBLISHED' ? 'Published version is read-only' : 'Validate this version before publishing') : 'Select a version to validate');
    if (!version || !workspace.editorReady) { return Promise.resolve(); }
    var load = window.FlowablePlusEditor.setModel ? window.FlowablePlusEditor.setModel(workspace.project.modelType, version.xml) : (workspace.project.modelType === 'CMMN' ? window.FlowablePlusEditor.importCmmn(version.xml) : window.FlowablePlusEditor.importBpmn(version.xml)); return Promise.resolve(load).catch(function () { setMessage('The selected model could not be opened.', true); });
}

function selectVersion(versionId) { workspace.versionId = versionId; workspace.version = workspace.versions.find(function (version) { return version.id === versionId; }) || null; updateUrl(); renderProperties(); return renderVersion(); }

function loadVersions() {
    if (!workspace.projectId) { workspace.versions = []; workspace.version = null; renderProperties(); return renderVersion(); }
    return request('/api/modeler/projects/' + encodeURIComponent(workspace.projectId) + '/versions?clientId=' + encodeURIComponent(workspace.clientId)).then(function (versions) { workspace.versions = versions; var requested = workspace.versions.some(function (version) { return version.id === workspace.versionId; }) ? workspace.versionId : (workspace.versions[0] && workspace.versions[0].id); return selectVersion(requested || null); });
}

function selectProject(projectId) { workspace.projectId = projectId; workspace.versionId = null; workspace.project = workspace.projects.find(function (project) { return project.id === projectId; }) || null; updateUrl(); renderProjects(); renderTabs(); renderProperties(); return loadVersions().catch(handleRequestError); }

function handleRequestError(error) {
    var message = error.status === 401 ? 'Sign in is required to view this client.' : error.status === 403 ? 'You are not authorized for this client.' : error.status === 404 ? 'The requested model is no longer available.' : 'The modeler service is unavailable.'; setMessage(message, true); document.querySelector('#save-state').textContent = message; if (!workspace.project) { document.querySelector('#project-list').innerHTML = '<div class="empty-state">' + message + '</div>'; }
}

function loadProjects() {
    document.querySelector('#client-context').textContent = workspace.clientId;
    return request('/api/modeler/projects?clientId=' + encodeURIComponent(workspace.clientId)).then(function (projects) { workspace.projects = projects; workspace.project = workspace.projects.find(function (project) { return project.id === workspace.projectId; }) || null; if (!workspace.project && workspace.projects.length) { workspace.projectId = workspace.projects[0].id; workspace.project = workspace.projects[0]; } updateUrl(); renderProjects(); renderTabs(); renderProperties(); return loadVersions(); }).catch(handleRequestError);
}

function saveDraft() {
    if (!workspace.project) { setMessage('Select a project before saving.', true); return; }
    if (workspace.version && workspace.version.state === 'PUBLISHED') { setMessage('Published versions are read-only. Create a draft first.', true); return; }
    var editorSource = window.FlowablePlusEditor ? window.FlowablePlusEditor.exportCurrent() : Promise.resolve(document.querySelector('#source-xml').value);
    editorSource.then(function (xml) { var path = workspace.version && workspace.version.state === 'DRAFT' ? '/api/modeler/versions/' + encodeURIComponent(workspace.version.id) : '/api/modeler/projects/' + encodeURIComponent(workspace.project.id) + '/versions?clientId='; var method = workspace.version && workspace.version.state === 'DRAFT' ? 'PUT' : 'POST'; return request(path + (path.indexOf('/versions?clientId=') >= 0 ? encodeURIComponent(workspace.clientId) : '?clientId=' + encodeURIComponent(workspace.clientId)), { method: method, body: JSON.stringify({ xml: xml }) }); }).then(function (version) { workspace.version = version; workspace.versionId = version.id; updateUrl(); document.querySelector('#save-state').textContent = 'Saved just now'; setMessage('Draft saved · v' + version.versionNumber); return loadVersions(); }).catch(function (error) { handleRequestError(error); setMessage('Draft could not be saved; your source is still in the editor.', true); });
}

function createProject(event) {
    event.preventDefault(); var form = event.target, data = new FormData(form);
    request('/api/modeler/projects?clientId=' + encodeURIComponent(workspace.clientId), { method: 'POST', body: JSON.stringify({ modelKey: data.get('modelKey'), modelType: data.get('modelType'), displayName: data.get('displayName'), ownerId: 'modeler' }) }).then(function (project) { document.querySelector('#project-dialog').close(); workspace.projects.push(project); return selectProject(project.id); }).catch(function (error) { document.querySelector('#project-message').textContent = error.status === 403 ? 'You are not authorized to create projects.' : 'Project could not be created.'; });
}

document.querySelectorAll('.tool').forEach(function (element) { element.addEventListener('click', function () { document.querySelectorAll('.tool').forEach(function (item) { item.classList.remove('active'); }); element.classList.add('active'); }); });
document.querySelector('#save-draft').addEventListener('click', saveDraft);
document.querySelector('#create-draft').addEventListener('click', function () {
    if (!workspace.version || workspace.version.state !== 'PUBLISHED') { return; }
    request('/api/modeler/versions/' + encodeURIComponent(workspace.version.id) + '/draft?clientId=' + encodeURIComponent(workspace.clientId), { method: 'POST' })
        .then(function (version) { workspace.versionId = version.id; workspace.version = version; setMessage('Draft v' + version.versionNumber + ' created.'); return loadVersions(); })
        .catch(function (error) { handleRequestError(error); setMessage('Draft could not be created; published XML is unchanged.', true); });
});
document.querySelector('#validate-model').addEventListener('click', function () { if (!workspace.version || !workspace.project) { showValidation(false, 'Select a version before validating'); return; } request('/api/modeler/versions/' + encodeURIComponent(workspace.version.id) + '/validate?clientId=' + encodeURIComponent(workspace.clientId), { method: 'POST', body: JSON.stringify({ modelType: selectedModelType(), formSchema: null, correlationId: correlationId() }) }).then(function (result) { showValidation(result.valid, result.valid ? 'All checks passed' : 'Validation failed: ' + result.errors.length + ' issue(s)'); }).catch(function (error) { handleRequestError(error); showValidation(false, error.status === 422 ? 'Validation failed' : 'Validation request failed'); }); });
document.querySelector('#publish-model').addEventListener('click', function () { if (!workspace.validationPassed) { showValidation(false, 'Validate the model before publishing'); return; } if (!workspace.version) { showValidation(false, 'Select a version before publishing'); return; } request('/api/modeler/versions/' + encodeURIComponent(workspace.version.id) + '/publish?clientId=' + encodeURIComponent(workspace.clientId), { method: 'POST', body: JSON.stringify({ modelType: selectedModelType(), formSchema: null, correlationId: correlationId(), actorId: 'modeler' }) }).then(function (result) { workspace.version = result.version; setMessage('Published · ' + result.correlationId); return loadVersions(); }).catch(function (error) { handleRequestError(error); setMessage('Publication failed; active version unchanged.', true); }); });
document.querySelector('#editor-type').addEventListener('change', function (event) { if (workspace.project) { workspace.project.modelType = event.target.value; renderVersion(); } });
document.querySelector('#create-project').addEventListener('click', function () { document.querySelector('#project-message').textContent = ''; document.querySelector('#project-dialog').showModal(); });
document.querySelector('#project-form').addEventListener('submit', createProject);
window.addEventListener('flowableplus-editor-ready', function () { workspace.editorReady = true; renderVersion(); });
renderProjects(); renderTabs(); renderProperties(); loadProjects();