const Kernel = (function () {
    const listeners = {};
    const registeredApps = {};
    let nextWindowId = 1;

    function on(eventName, callback) {
        if (!listeners[eventName]) listeners[eventName] = [];
        listeners[eventName].push(callback);
    }

    function off(eventName, callback) {
        if (!listeners[eventName]) return;
        listeners[eventName] = listeners[eventName].filter(fn => fn !== callback);
    }

    function emit(eventName, payload) {
        if (!listeners[eventName]) return;
        listeners[eventName].forEach(fn => fn(payload));

    }


    function registerApp(appId, config) {
        registeredApps[appId] = config;
    }

    function getApp(appId) {
        return registeredApps[appId] || null;

    }
    function generateWindowId() {
        return `win-${nextWindowId++}`;
    }

    return { on, off, emit, registerApp, getApp, generateWindowId }

})();