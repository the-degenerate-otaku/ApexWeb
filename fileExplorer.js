const FileExplorer = (function () {

    function launch(startFolderId) {
        const container = document.createElement('div');
        container.className = 'file-explorer';
        let currentFolderId = startFolderId || 'root';

        const toolbar = document.createElement('div');
        toolbar.className = 'fe-toolbar';

        const backBtn = document.createElement('div');
        backBtn.className = 'fe-btn';
        backBtn.textContent = 'Back';
        backBtn.addEventListener('click', () => {
            const node = VFS.findNode(currentFolderId);
            if (node && node.parentId) {
                currentFolderId = node.parentId;
                render();
            }
        });

        const pathLabel = document.createElement('div');
        pathLabel.className = 'fe-path';

        const newFolderBtn = document.createElement('div');
        newFolderBtn.className = 'fe-btn';
        newFolderBtn.textContent = 'New Folder';
        newFolderBtn.addEventListener('click', () => {
            const name = prompt('Folder name:');
            if (name) VFS.createFolder(currentFolderId, name);
        });

        const newFileBtn = document.createElement('div');
        newFileBtn.className = 'fe-btn';
        newFileBtn.textContent = 'New File';
        newFileBtn.addEventListener('click', () => {
            const name = prompt('File name:');
            if (name) VFS.createFile(currentFolderId, name, '');
        });

        toolbar.appendChild(backBtn);
        toolbar.appendChild(pathLabel);
        toolbar.appendChild(newFolderBtn);
        toolbar.appendChild(newFileBtn);

        const grid = document.createElement('div');
        grid.className = 'fe-grid';

        container.appendChild(toolbar);
        container.appendChild(grid);

        function render() {
            pathLabel.textContent = VFS.getPath(currentFolderId) || '/';
            grid.innerHTML = '';
            const children = VFS.getChildren(currentFolderId);

            children.forEach(node => {
                const item = document.createElement('div');
                item.className = 'fe-item';

                const icon = document.createElement('div');
                icon.className = 'fe-icon';
                icon.textContent = node.type === 'folder' ? 'FOLDER' : 'FILE';

                const label = document.createElement('div');
                label.className = 'fe-label';
                label.textContent = node.name;

                item.appendChild(icon);
                item.appendChild(label);

                item.addEventListener('dblclick', () => {
                    if (node.type === 'folder') {
                        currentFolderId = node.id;
                        render();
                    } else {
                        openTextEditor(node);
                    }
                });

                item.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    Kernel.emit('contextmenu:show', {
                        x: e.clientX,
                        y: e.clientY,
                        items: [
                            {
                                label: 'Rename', action: () => {
                                    const newName = prompt('New name:', node.name);
                                    if (newName) VFS.renameNode(node.id, newName);
                                }
                            },
                            { label: 'Delete', action: () => VFS.deleteNode(node.id) }
                        ]
                    });
                });

                grid.appendChild(item);
            });
        }

        Kernel.on('vfs:changed', ({ parentId }) => {
            if (parentId === currentFolderId) render();
        });

        render();

        WindowManager.openWindow({
            title: 'File Explorer',
            content: container,
            width: 520,
            height: 380
        });
    }

    function openTextEditor(node) {
        const wrapper = document.createElement('div');
        wrapper.className = 'fe-editor';

        const textarea = document.createElement('textarea');
        textarea.value = node.content;
        textarea.className = 'fe-textarea';

        const saveBtn = document.createElement('div');
        saveBtn.className = 'fe-btn';
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', () => {
            node.content = textarea.value;
        });

        wrapper.appendChild(saveBtn);
        wrapper.appendChild(textarea);

        WindowManager.openWindow({
            title: node.name,
            content: wrapper,
            width: 420,
            height: 320
        });
    }

    return { launch };
})();