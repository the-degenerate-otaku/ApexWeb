(function boot() {
    const bootScreen = document.getElementById('boot-screen');
    const bootFill = document.getElementById('boot-fill');
    const desktop = document.getElementById('desktop');

    requestAnimationFrame(() => {
        bootFill.style.width = '100%';
    });

    setTimeout(() => {
        bootScreen.style.opacity = '0'
        setTimeout(() => {
            bootScreen.classList.add('hidden');
            desktop.classList.remove('hidden');
            updateClock();
            setInterval(updateClock, 1000 * 30);

            // Test block for testing obv
            VFS.init();
            WindowManager.init();
            DragResize.init();
            ContextMenu.init();
            Desktop.init();
            Taskbar.init();
            StartMenu.init();
            WindowManager.openWindow({ title: 'Test Window', content: 'Hello ApexWeb', x: 200, y: 150 });




        }, 600);
    }, 1800);

    function updateClock() {
        const el = document.getElementById('clock-widget');
        if (!el) return;
        const now = new Date();
        el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
})();