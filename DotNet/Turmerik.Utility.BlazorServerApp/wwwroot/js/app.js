window.AppInterop = {
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
