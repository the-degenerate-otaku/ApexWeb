const ShellCommands = (function () {

    function run(raw, currentFolderId) {
        const parts = raw.split(' ').filter(Boolean);
        const cmd = parts[0];
        const args = parts.slice(1);

        switch (cmd) {
            case 'help':
                return { output: 'Commands: help, ls, cd, mkdir, touch, rm, cat, pwd, clear' };

            case 'pwd':
                return { output: VFS.getPath(currentFolderId) || '/' };

            case 'ls':
                return { output: listFolder(currentFolderId) };

            case 'cd':
                return changeDir(currentFolderId, args[0]);

            case 'mkdir':
                if (!args[0]) return { output: 'mkdir: missing folder name' };
                if (!VFS.createFolder(currentFolderId, args[0])) return { output: 'mkdir: could not create' };
                return { output: '' };

            case 'touch':
                if (!args[0]) return { output: 'touch: missing file name' };
                if (!VFS.createFile(currentFolderId, args[0], '')) return { output: 'touch: could not create' };
                return { output: '' };

            case 'rm':
                if (!args[0]) return { output: 'rm: missing name' };
                return removeByName(currentFolderId, args[0]);

            case 'cat':
                if (!args[0]) return { output: 'cat: missing file name' };
                return catFile(currentFolderId, args[0]);

            case 'clear':
                return { output: '', clear: true };

            default:
                return { output: `command not found: ${cmd}` };
        }
    }

    function listFolder(folderId) {
        const children = VFS.getChildren(folderId);
        if (children.length === 0) return '(empty)';
        return children.map(c => c.type === 'folder' ? c.name + '/' : c.name).join('  ');
    }

    function changeDir(currentFolderId, target) {
        if (!target || target === '.') return { output: '' };

        if (target === '..') {
            const node = VFS.findNode(currentFolderId);
            if (node && node.parentId) return { newFolderId: node.parentId, output: '' };
            return { output: '' };
        }

        const children = VFS.getChildren(currentFolderId);
        const match = children.find(c => c.name === target && c.type === 'folder');
        if (!match) return { output: `cd: no such folder: ${target}` };
        return { newFolderId: match.id, output: '' };
    }

    function removeByName(currentFolderId, name) {
        const children = VFS.getChildren(currentFolderId);
        const match = children.find(c => c.name === name);
        if (!match) return { output: `rm: no such file or folder: ${name}` };
        VFS.deleteNode(match.id);
        return { output: '' };
    }

    function catFile(currentFolderId, name) {
        const children = VFS.getChildren(currentFolderId);
        const match = children.find(c => c.name === name && c.type === 'file');
        if (!match) return { output: `cat: no such file: ${name}` };
        return { output: match.content || '(empty file)' };
    }

    return { run };
})();