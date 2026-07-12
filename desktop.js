
const Desktop = (function () {
    function init() {
        const desktopEl = document.getElementById('desktop');

        desktopEl.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.app-window')) return;
            e.preventDefault();

            Kernel.emit('contextmenu:show', {
                x: e.clientX,
                y: e.clientY,
                items: [
                    { label: 'New Window', action: () => WindowManager.openWindow({ title: 'New Window', content: 'Empty window' }) },
                    { label: 'Refresh', action: () => location.reload() }
                ]
            });
        });
    }

    return { init };
})();