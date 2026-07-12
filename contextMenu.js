
const ContextMenu = (function () {
    let menuEl = null;

    function init() {
        Kernel.on('contextmenu:show', ({ x, y, items }) => show(x, y, items));
        document.addEventListener('click', close);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }

    function show(x, y, items) {
        close();

        menuEl = document.createElement('div');
        menuEl.className = 'context-menu';
        menuEl.style.left = x + 'px';
        menuEl.style.top = y + 'px';

        items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'context-menu-item';
            row.textContent = item.label;
            row.addEventListener('click', (e) => {
                e.stopPropagation();
                item.action();
                close();
            });
            menuEl.appendChild(row);
        });

        document.body.appendChild(menuEl);
    }

    function close() {
        if (menuEl) {
            menuEl.remove();
            menuEl = null;
        }
    }

    return { init };
})();