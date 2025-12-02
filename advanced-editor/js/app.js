// Core Application Utilities
class ContentManager {
    constructor() {
        this.storageKey = 'advancedEditorContent';
        this.content = this.loadContent();
    }

    // Load content from localStorage
    loadContent() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Save content to localStorage
    saveContent() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.content));
    }

    // Get all content
    getAll() {
        return this.content;
    }

    // Get content by ID
    getById(id) {
        return this.content.find(item => item.id === id);
    }

    // Create new content
    create(contentData) {
        const newContent = {
            id: this.generateId(),
            ...contentData,
            createdAt: contentData.createdAt || new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        };
        this.content.unshift(newContent);
        this.saveContent();
        return newContent;
    }

    // Update existing content
    update(id, contentData) {
        const index = this.content.findIndex(item => item.id === id);
        if (index !== -1) {
            this.content[index] = {
                ...this.content[index],
                ...contentData,
                modifiedAt: new Date().toISOString()
            };
            this.saveContent();
            return this.content[index];
        }
        return null;
    }

    // Delete content
    delete(id) {
        const index = this.content.findIndex(item => item.id === id);
        if (index !== -1) {
            this.content.splice(index, 1);
            this.saveContent();
            return true;
        }
        return false;
    }

    // Search content
    search(query) {
        if (!query) return this.content;
        const lowerQuery = query.toLowerCase();
        return this.content.filter(item => 
            item.title.toLowerCase().includes(lowerQuery) ||
            item.content.toLowerCase().includes(lowerQuery) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
    }

    // Filter by category
    filterByCategory(category) {
        if (!category) return this.content;
        return this.content.filter(item => item.category === category);
    }

    // Sort content
    sort(sortBy) {
        const sorted = [...this.content];
        switch(sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'title':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'modified':
                return sorted.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
            default:
                return sorted;
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize global content manager
const contentManager = new ContentManager();

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function truncateText(text, maxLength = 150) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// Get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        mode: params.get('mode') || 'create'
    };
}



