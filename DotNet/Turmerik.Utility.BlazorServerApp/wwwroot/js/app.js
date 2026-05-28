window.AppInterop = {
    registerGlobalShortcuts: function (dotnetRef) {
        if (window._trmrkKbHandler) {
            document.removeEventListener('keydown', window._trmrkKbHandler);
        }
        window._trmrkKbDotnet = dotnetRef;
        window._trmrkKbHandler = function (e) {
            if (e.ctrlKey && e.shiftKey && e.altKey && !e.metaKey) {
                const num = parseInt(e.key);
                if (!isNaN(num) && num >= 1 && num <= 5) {
                    e.preventDefault();
                    dotnetRef.invokeMethodAsync('SwitchTab', num - 1);
                }
            }
        };
        document.addEventListener('keydown', window._trmrkKbHandler);
    },

    unregisterGlobalShortcuts: function () {
        if (window._trmrkKbHandler) {
            document.removeEventListener('keydown', window._trmrkKbHandler);
            window._trmrkKbHandler = null;
            window._trmrkKbDotnet = null;
        }
    },

    focusAndSelect: function (element) {
        if (!element?.focus) return;
        element.focus();
        if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
            element.select();
        } else {
            try {
                const range = document.createRange();
                range.selectNodeContents(element);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } catch (ex) { /* non-critical */ }
        }
    },

    // Focuses the next script-output block with the given data-script-mod value.
    // Pressing the same digit repeatedly cycles through all matching blocks
    // (e.g. digit 0 → index 0, then index 10, then back to 0, …).
    focusScriptByMod: function (mod) {
        const els = Array.from(document.querySelectorAll('[data-script-mod="' + mod + '"]'));
        if (els.length === 0) return;

        // Find which one (if any) currently holds focus
        const currentIdx = els.indexOf(document.activeElement);

        // Advance by one, wrapping around — if none focused, currentIdx is -1 so we start at 0
        const nextIdx = (currentIdx + 1) % els.length;
        const el = els[nextIdx];

        el.focus();
        try {
            const range = document.createRange();
            range.selectNodeContents(el);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } catch (e) { /* non-critical */ }
    },

    copyToClipboard: async function (text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            // fallback for older browsers
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                return true;
            } catch (e2) {
                return false;
            }
        }
    },

    readFromClipboard: async function () {
        try {
            return await navigator.clipboard.readText();
        } catch {
            return null;
        }
    },

    openUrl: function (url) {
        window.open(url, '_blank');
    },

    setTheme: function (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('trmrk-theme', theme);
    },

    getTheme: function () {
        return localStorage.getItem('trmrk-theme') || 'auto';
    },

    applyStoredTheme: function () {
        const theme = localStorage.getItem('trmrk-theme');
        if (theme && theme !== 'auto') {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }
};

// Apply stored theme on load
document.addEventListener('DOMContentLoaded', function () {
    window.AppInterop.applyStoredTheme();
});
