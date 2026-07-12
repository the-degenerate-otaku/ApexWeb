const WindowManager = (function () {
    const windows = {};
    let zCounter = 100;
    let focusedId = null;

    function init() {
        Kernel.on('window:closeRequest', ({ id }) => closeWindow(id));
        Kernel.on('window:focusRequest', ({ id }) => focusWindow(id));
        Kernel.on('window:minimizeRequest', ({ id }) => minimizeWindow(id));
    }


    function openWindow(config) {
        const el = WindowFactory.create(config);
        const layer = document.getElementById('window-layer');
        layer.appendChild(el);

        windows[el.id] = { el, minimized: false, title: config.title || 'Untitled' };

        requestAnimationFrame(() => {
            el.classList.add('opening');
        });

        focusWindow(el.id);
        Kernel.emit('window:opened', { id: el.id });
        return el.id;
    }

    function closeWindow(id) {
        const win = windows[id];
        if (!win) return;

        win.el.classList.add('closing');
        win.el.classList.remove('opening');

        setTimeout(() => {
            win.el.remove();
            delete windows[id];
            if (focusedId === id) focusedId = null;
            Kernel.emit('window:closed', { id });
        }, 160);
    }

    function focusWindow(id) {
        const win = windows[id];
        if (!win || win.minimized) return;

        Object.keys(windows).forEach(wid => {
            windows[wid].el.classList.remove('focused');
        });

        win.el.classList.add('focused');
        zCounter += 1;
        win.el.style.zIndex = zCounter;
        focusedId = id;

        Kernel.emit('window:focused', { id });
    }

    function minimizeWindow(id) {
        const win = windows[id];
        if (!win) return;
        win.minimized = true;
        win.el.classList.add('hidden');
        Kernel.emit('window:minimized', { id });
    }

    function restoreWindow(id) {
        const win = windows[id];
        if (!win) return;
        win.minimized = false;
        win.el.classList.remove('hidden');
        focusWindow(id);
        Kernel.emit('window:restored', { id });
    }

    function getOpenWindows() {
        return Object.keys(windows).map(id => ({
            id,
            title: windows[id].title,
            minimized: windows[id].minimized
        }));
    }

    return { init, openWindow, closeWindow, focusWindow, minimizeWindow, restoreWindow, getOpenWindows };
})();