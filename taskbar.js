
const Taskbar = (function () {
    function init() {
        Kernel.on('window:opened', renderTray);
        Kernel.on('window:closed', renderTray);
        Kernel.on('window:focused', renderTray);
        Kernel.on('window:minimized', renderTray);
        Kernel.on('window:restored', renderTray);

        document.getElementById('start-button').addEventListener('click', () => {
            Kernel.emit('startmenu:toggle');
        });
    }

    function renderTray() {
        const tray = document.getElementById('open-windows-tray');
        tray.innerHTML = '';

        WindowManager.getOpenWindows().forEach(win => {
            const chip = document.createElement('div');
            chip.className = 'taskbar-chip' + (win.minimized ? ' minimized' : '');
            chip.textContent = win.title;
            chip.addEventListener('click', () => {
                if (win.minimized) {
                    WindowManager.restoreWindow(win.id);
                } else {
                    WindowManager.focusWindow(win.id);
                }
            });
            tray.appendChild(chip);
        });
    }

    return { init };
})();