// Dashboard functionality
let allContent = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

function loadDashboard() {
    allContent = contentManager.getAll();
    renderContent(allContent);
}

function renderContent(content) {
    const grid = document.getElementById('contentGrid');
    const emptyState = document.getElementById('emptyState');

    if (content.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    grid.innerHTML = content.map(item => createContentCard(item)).join('');
}

function createContentCard(item) {
    const preview = truncateText(stripHtml(item.content));
    const tags = item.tags ? item.tags.split(',').map(t => t.trim()).filter(t => t) : [];
    const priorityClass = `priority-${item.priority || 'low'}`;

    return `
        <div class="content-card" onclick="viewContent('${item.id}')">
            <div class="card-priority ${priorityClass}"></div>
            <div class="card-header">
                <div>
                    <h3 class="card-title">${escapeHtml(item.title)}</h3>
                    <span class="card-category">${item.category || 'document'}</span>
                </div>
            </div>
            <p class="card-preview">${preview || 'No content preview available.'}</p>
            ${tags.length > 0 ? `
                <div class="card-tags">
                    ${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
            <div class="card-footer">
                <span class="card-date">
                    <i class="fas fa-clock"></i> ${formatDate(item.modifiedAt || item.createdAt)}
                </span>
                <div class="card-actions" onclick="event.stopPropagation()">
                    <button onclick="editContent('${item.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteContent('${item.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function viewContent(id) {
    window.location.href = `edit.html?id=${id}&mode=view`;
}

function editContent(id) {
    window.location.href = `edit.html?id=${id}&mode=edit`;
}

function deleteContent(id) {
    if (confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
        contentManager.delete(id);
        loadDashboard();
    }
}

function filterContent() {
    const searchQuery = document.getElementById('searchInput').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filtered = contentManager.getAll();
    
    // Apply category filter
    if (categoryFilter) {
        filtered = contentManager.filterByCategory(categoryFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
        filtered = contentManager.search(searchQuery).filter(item => 
            !categoryFilter || item.category === categoryFilter
        );
    }
    
    // Apply sorting
    const sortBy = document.getElementById('sortFilter').value;
    filtered = contentManager.sort(sortBy).filter(item => 
        filtered.some(f => f.id === item.id)
    );
    
    renderContent(filtered);
}

function sortContent() {
    filterContent();
}



