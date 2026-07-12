
const StartMenu = (function () {
    let menuEl = null;
    let isOpen = false;

    const APPS = [
        { id: 'fileExplorer', label: 'File Explorer', launch: () => FileExplorer.launch() },
        { id: 'terminal', label: 'Terminal', launch: () => WindowManager.openWindow({ title: 'Terminal', content: 'Terminal coming in CP7' }) }
    ];

    function init() {
        Kernel.on('startmenu:toggle', toggle);
        document.addEventListener('click', (e) => {
            if (!isOpen) return;
            if (e.target.closest('#start-menu') || e.target.closest('#start-button')) return;
            close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }

    function toggle() {
        if (isOpen) {
            close();
        } else {
            open();
        }
    }

    function open() {
        close();

        menuEl = document.createElement('div');
        menuEl.id = 'start-menu';

        APPS.forEach(app => {
            const row = document.createElement('div');
            row.className = 'start-menu-item';
            row.textContent = app.label;
            row.addEventListener('click', () => {
                app.launch();
                close();
            });
            menuEl.appendChild(row);
        });

        document.getElementById('desktop').appendChild(menuEl);
        requestAnimationFrame(() => menuEl.classList.add('open'));
        isOpen = true;
    }

    function close() {
        if (menuEl) {
            menuEl.remove();
            menuEl = null;
        }
        isOpen = false;
    }

    return { init };
})();