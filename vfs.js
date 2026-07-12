
const VFS = (function () {
    let nextId = 1;
    let tree = null;

    function init() {
        tree = makeFolder('root', 'Root', null);
        seedDefaults();
    }

    function makeId() {
        return `node-${nextId++}`;
    }

    function makeFolder(id, name, parentId) {
        return { id, name, type: 'folder', parentId, children: [] };
    }

    function makeFile(id, name, parentId, content) {
        return { id, name, type: 'file', parentId, content: content || '' };
    }

    function seedDefaults() {
        const docs = makeFolder(makeId(), 'Documents', 'root');
        tree.children.push(docs);

        const readme = makeFile(makeId(), 'readme.txt', docs.id, 'Welcome to ApexWeb.');
        docs.children.push(readme);
    }

    function findNode(id, node = tree) {
        if (node.id === id) return node;
        if (node.type !== 'folder') return null;
        for (const child of node.children) {
            const found = findNode(id, child);
            if (found) return found;
        }
        return null;
    }

    function getChildren(folderId) {
        const folder = findNode(folderId);
        if (!folder || folder.type !== 'folder') return [];
        return folder.children;
    }

    function createFolder(parentId, name) {
        const parent = findNode(parentId);
        if (!parent || parent.type !== 'folder') return null;
        if (parent.children.some(c => c.name === name)) return null;

        const folder = makeFolder(makeId(), name, parentId);
        parent.children.push(folder);
        Kernel.emit('vfs:changed', { parentId });
        return folder;
    }

    function createFile(parentId, name, content) {
        const parent = findNode(parentId);
        if (!parent || parent.type !== 'folder') return null;
        if (parent.children.some(c => c.name === name)) return null;

        const file = makeFile(makeId(), name, parentId, content);
        parent.children.push(file);
        Kernel.emit('vfs:changed', { parentId });
        return file;
    }

    function deleteNode(id) {
        if (id === 'root') return false;
        const node = findNode(id);
        if (!node) return false;

        const parent = findNode(node.parentId);
        parent.children = parent.children.filter(c => c.id !== id);
        Kernel.emit('vfs:changed', { parentId: node.parentId });
        return true;
    }

    function renameNode(id, newName) {
        const node = findNode(id);
        if (!node) return false;

        const parent = findNode(node.parentId);
        if (parent.children.some(c => c.name === newName && c.id !== id)) return false;

        node.name = newName;
        Kernel.emit('vfs:changed', { parentId: node.parentId });
        return true;
    }

    function resolvePath(path) {
        const parts = path.split('/').filter(Boolean);
        let current = tree;
        for (const part of parts) {
            if (current.type !== 'folder') return null;
            const next = current.children.find(c => c.name === part);
            if (!next) return null;
            current = next;
        }
        return current;
    }

    function getPath(id) {
        const node = findNode(id);
        if (!node) return null;
        const parts = [];
        let current = node;
        while (current && current.id !== 'root') {
            parts.unshift(current.name);
            current = findNode(current.parentId);
        }
        return '/' + parts.join('/');
    }

    return {
        init, findNode, getChildren, createFolder, createFile,
        deleteNode, renameNode, resolvePath, getPath
    };
})();