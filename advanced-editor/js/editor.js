// Editor functionality
let currentContentId = null;
let isEditMode = false;

// Initialize editor
document.addEventListener('DOMContentLoaded', () => {
    const params = getUrlParams();
    currentContentId = params.id;
    isEditMode = params.mode === 'edit' || params.mode === 'view';

    if (isEditMode && currentContentId) {
        loadContentForEdit(currentContentId);
        if (params.mode === 'view') {
            setViewMode();
        }
    } else {
        setupNewContent();
    }

    // Update word/character count
    const editor = document.getElementById('richTextEditor');
    editor.addEventListener('input', updateWordCount);
    updateWordCount();

    // Hide other fields when title is focused
    const titleInput = document.getElementById('contentTitle');
    const otherFormGroups = document.querySelectorAll('.editor-form-panel .form-group:not(:first-child)');
    
    titleInput.addEventListener('focus', () => {
        otherFormGroups.forEach(group => {
            group.style.display = 'none';
        });
    });

    titleInput.addEventListener('blur', () => {
        otherFormGroups.forEach(group => {
            group.style.display = 'block';
        });
    });
});

function setupNewContent() {
    document.getElementById('editorTitle').textContent = 'Create New Content';
    document.getElementById('contentCreatedDate').value = new Date().toISOString().slice(0, 16);
}

function loadContentForEdit(id) {
    const content = contentManager.getById(id);
    if (!content) {
        alert('Content not found!');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('editorTitle').textContent = 'Edit Content';
    document.getElementById('contentTitle').value = content.title || '';
    document.getElementById('contentCategory').value = content.category || 'document';
    document.getElementById('contentTags').value = content.tags || '';
    document.getElementById('contentStatus').value = content.status || 'draft';
    document.getElementById('contentPriority').value = content.priority || 'low';
    document.getElementById('contentImageUrl').value = content.imageUrl || '';
    document.getElementById('contentExternalLink').value = content.externalLink || '';
    
    if (content.createdAt) {
        const date = new Date(content.createdAt);
        document.getElementById('contentCreatedDate').value = date.toISOString().slice(0, 16);
    }

    const editor = document.getElementById('richTextEditor');
    editor.innerHTML = content.content || '';
    updateWordCount();
}

function setViewMode() {
    document.getElementById('editorTitle').textContent = 'View Content';
    document.getElementById('contentTitle').disabled = true;
    document.getElementById('contentCategory').disabled = true;
    document.getElementById('contentTags').disabled = true;
    document.getElementById('contentStatus').disabled = true;
    document.getElementById('contentPriority').disabled = true;
    document.getElementById('contentCreatedDate').disabled = true;
    document.getElementById('contentImageUrl').disabled = true;
    document.getElementById('contentExternalLink').disabled = true;
    
    const editor = document.getElementById('richTextEditor');
    editor.contentEditable = 'false';
    
    // Hide toolbar
    document.querySelector('.editor-toolbar').style.display = 'none';
    
    // Hide save button, show edit button
    const saveBtn = document.querySelector('.btn-success');
    saveBtn.style.display = 'none';
    
    const previewBtn = document.querySelector('.btn-secondary');
    previewBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    previewBtn.onclick = () => {
        window.location.href = `edit.html?id=${currentContentId}&mode=edit`;
    };
}

function saveContent() {
    const title = document.getElementById('contentTitle').value.trim();
    if (!title) {
        alert('Please enter a title!');
        document.getElementById('contentTitle').focus();
        return;
    }

    const editor = document.getElementById('richTextEditor');
    const content = editor.innerHTML.trim();
    
    if (!content) {
        if (!confirm('Content is empty. Do you want to save anyway?')) {
            return;
        }
    }

    const contentData = {
        title: title,
        category: document.getElementById('contentCategory').value,
        tags: document.getElementById('contentTags').value,
        status: document.getElementById('contentStatus').value,
        priority: document.getElementById('contentPriority').value,
        imageUrl: document.getElementById('contentImageUrl').value,
        externalLink: document.getElementById('contentExternalLink').value,
        createdAt: document.getElementById('contentCreatedDate').value 
            ? new Date(document.getElementById('contentCreatedDate').value).toISOString()
            : new Date().toISOString(),
        content: content
    };

    if (isEditMode && currentContentId) {
        contentManager.update(currentContentId, contentData);
        alert('Content updated successfully!');
    } else {
        contentManager.create(contentData);
        alert('Content created successfully!');
    }

    window.location.href = 'index.html';
}

function previewContent() {
    const title = document.getElementById('contentTitle').value || 'Untitled';
    const category = document.getElementById('contentCategory').value;
    const editor = document.getElementById('richTextEditor');
    const content = editor.innerHTML || '<p>No content</p>';

    const previewHtml = `
        <div style="max-width: 800px; margin: 0 auto;">
            <h1 style="color: var(--primary-color); margin-bottom: 0.5rem;">${escapeHtml(title)}</h1>
            <div style="display: flex; gap: 1rem; margin-bottom: 2rem; color: var(--text-secondary); font-size: 0.9rem;">
                <span><i class="fas fa-tag"></i> ${category}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(new Date().toISOString())}</span>
            </div>
            <div style="border-top: 2px solid var(--border-color); padding-top: 2rem;">
                ${content}
            </div>
        </div>
    `;

    document.getElementById('previewContent').innerHTML = previewHtml;
    document.getElementById('previewModal').style.display = 'block';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

function updateWordCount() {
    const editor = document.getElementById('richTextEditor');
    const text = stripHtml(editor.innerHTML);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    document.getElementById('wordCount').textContent = `${words} words`;
    document.getElementById('charCount').textContent = `${chars} characters`;
}

// Rich text formatting functions
function formatText(command) {
    const editor = document.getElementById('richTextEditor');
    editor.focus();
    
    document.execCommand('styleWithCSS', false, true);

    switch(command) {
        case 'bold':
            document.execCommand('bold', false, null);
            break;
        case 'italic':
            document.execCommand('italic', false, null);
            break;
        case 'underline':
            document.execCommand('underline', false, null);
            break;
        case 'heading1':
            document.execCommand('formatBlock', false, '<h1>');
            break;
        case 'heading2':
            document.execCommand('formatBlock', false, '<h2>');
            break;
        case 'unorderedList':
            document.execCommand('insertUnorderedList', false, null);
            break;
        case 'orderedList':
            document.execCommand('insertOrderedList', false, null);
            break;
        case 'link':
            const url = prompt('Enter URL:');
            if (url) {
                document.execCommand('createLink', false, url);
            }
            break;
        case 'image':
            const imageUrl = prompt('Enter image URL:');
            if (imageUrl) {
                document.execCommand('insertImage', false, imageUrl);
            }
            break;
        case 'code':
            document.execCommand('formatBlock', false, '<pre>');
            break;
        case 'quote':
            document.execCommand('formatBlock', false, '<blockquote>');
            break;
        case 'undo':
            document.execCommand('undo', false, null);
            break;
        case 'redo':
            document.execCommand('redo', false, null);
            break;
        case 'clear':
            if (confirm('Clear all formatting?')) {
                const text = stripHtml(editor.innerHTML);
                editor.innerHTML = text;
            }
            break;
    }
    
    updateWordCount();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target === modal) {
        closePreview();
    }
}

