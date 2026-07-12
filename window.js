const WindowFactory = (function () { 

    function create(config) {
        const id = config.id || Kernel.generateWindowId();

        const el = document.createElement('div');
        el.className = 'app-window';
        el.id = id;
        el.style.left = (config.x || 100) + 'px';
        el.style.top = (config.y || 100) + 'px';
        el.style.width = (config.width || 480) + 'px';
        el.style.height = (config.height || 320) + 'px';

        el.innerHTML = `
            <div class="window-titlebar">
                 <div class="window-controls">
                    <div class="window-dot close"></div>
                    <div class="window-dot minimize"></div> <div class="window-dot maximize"></div>
                </div>
                <div class="window-title">${escapeHtml(config.title || 'Untitled')}</div>
            </div>
            <div class="window-body"></div> <div class="resize-handle"></div>
        `;

        const body = el.querySelector('.window-body');
        if (config.content instanceof Node) {
            body.appendChild(config.content);
        } else if (typeof config.content === 'string') {
            body.textContent = config.content;
        }

        wireControls(el, id);
        wireFocus(el, id); 

        return el;
    }

    function wireControls(el, id) {
        const closeBtn = el.querySelector('.window-dot.close');
        const minBtn = el.querySelector('.window-dot.minimize');

        closeBtn.addEventListener('click', () => { 
            Kernel.emit('window:closeRequest', { id });
        });

        minBtn.addEventListener('click', () => { 
            Kernel.emit('window:minimizeRequest', { id });
        });
    }

    function wireFocus(el, id) {
        el.addEventListener('mousedown', () => {
            Kernel.emit('window:focusRequest', { id });
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    return { create };

}());