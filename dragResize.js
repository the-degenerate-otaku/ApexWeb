
const DragResize = (function () {
    let dragState = null;
    let resizeState = null;

    const MIN_WIDTH = 320;
    const MIN_HEIGHT = 200;

    function init() {
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseDown(e) {
        const titlebar = e.target.closest('.window-titlebar');
        if (titlebar && !e.target.closest('.window-controls')) {
            startDrag(titlebar.closest('.app-window'), e);
            return;
        }

        const handle = e.target.closest('.resize-handle');
        if (handle) {
            startResize(handle.closest('.app-window'), e);
        }
    }

    function startDrag(winEl, e) {
        const rect = winEl.getBoundingClientRect();
        dragState = {
            el: winEl,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        };
    }

    function startResize(winEl, e) {
        const rect = winEl.getBoundingClientRect();
        resizeState = {
            el: winEl,
            startX: e.clientX,
            startY: e.clientY,
            startWidth: rect.width,
            startHeight: rect.height
        };
    }

    function onMouseMove(e) {
        if (dragState) {
            const layer = document.getElementById('window-layer');
            const layerRect = layer.getBoundingClientRect();

            let newX = e.clientX - dragState.offsetX - layerRect.left;
            let newY = e.clientY - dragState.offsetY - layerRect.top;

            newX = Math.max(0, Math.min(newX, layerRect.width - 100));
            newY = Math.max(0, Math.min(newY, layerRect.height - 36));

            dragState.el.style.left = newX + 'px';
            dragState.el.style.top = newY + 'px';
        }

        if (resizeState) {
            const dx = e.clientX - resizeState.startX;
            const dy = e.clientY - resizeState.startY;

            const newWidth = Math.max(MIN_WIDTH, resizeState.startWidth + dx);
            const newHeight = Math.max(MIN_HEIGHT, resizeState.startHeight + dy);

            resizeState.el.style.width = newWidth + 'px';
            resizeState.el.style.height = newHeight + 'px';
        }
    }

    function onMouseUp() {
        dragState = null;
        resizeState = null;
    }

    return { init };
})();