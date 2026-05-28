using PuppeteerSharp;

namespace Turmerik.Utility.BlazorServerApp.Services
{
    public class PuppeteerTitleFetcherService : IAsyncDisposable
    {
        // Separate from the user's normal browser profile to avoid conflicts,
        // but cookies/logins are preserved across app restarts.
        private static readonly string UserDataDir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "TurmerikUtility", "browser-profile");

        // Candidate paths for installed Chrome and Edge, in preference order.
        private static readonly string[] BrowserCandidates =
        [
            // Chrome – per-machine
            @"C:\Program Files\Google\Chrome\Application\chrome.exe",
            @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            // Chrome – per-user
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                @"Google\Chrome\Application\chrome.exe"),
            // Edge
            @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            @"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        ];

        private IBrowser? _browser;
        private readonly SemaphoreSlim _initLock = new(1, 1);
        private bool _initialized;
        private string? _initError;

        public string? InitError => _initError;

        public async Task<string?> EnsureReadyAsync(IProgress<string>? progress = null)
        {
            // Re-initialise if the user manually closed the browser window
            if (_initialized && _initError == null && _browser?.IsConnected == false)
            {
                _initialized = false;
                _initError = null;
            }

            if (_initialized) return _initError;

            await _initLock.WaitAsync();
            try
            {
                if (_initialized) return _initError;

                var executablePath = BrowserCandidates.FirstOrDefault(File.Exists);

                var launchOptions = new LaunchOptions
                {
                    Headless = false,
                    UserDataDir = UserDataDir,
                    Args =
                    [
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        // Hide the "Chrome is being controlled by automated software" banner
                        // and suppress navigator.webdriver so sites like Google don't block login
                        "--disable-blink-features=AutomationControlled",
                        "--disable-infobars",
                        "--exclude-switches=enable-automation"
                    ]
                };

                Directory.CreateDirectory(UserDataDir);

                if (executablePath != null)
                {
                    launchOptions.ExecutablePath = executablePath;
                    var browserName = Path.GetFileNameWithoutExtension(executablePath);
                    progress?.Report($"Launching {browserName}…");
                }
                else
                {
                    progress?.Report("No Chrome/Edge installation found — downloading Chromium (one-time, ~400 MB)…");
                    var fetcher = new BrowserFetcher();
                    await fetcher.DownloadAsync();
                    progress?.Report("Launching Chromium…");
                }

                _browser = await Puppeteer.LaunchAsync(launchOptions);
                _initialized = true;
            }
            catch (Exception ex)
            {
                _initError = ex.Message;
                _initialized = true;
            }
            finally
            {
                _initLock.Release();
            }

            return _initError;
        }

        public async Task<PageSession> OpenPageAsync(
            string url,
            Action<string, string> onUpdate,   // (title, currentUrl)
            IProgress<string>? progress = null)
        {
            var error = await EnsureReadyAsync(progress);
            if (error != null)
                throw new InvalidOperationException($"Browser unavailable: {error}");

            var page = await _browser!.NewPageAsync();
            var session = new PageSession(page, onUpdate);
            await session.InitAsync(url);
            return session;
        }

        public async ValueTask DisposeAsync()
        {
            if (_browser != null)
                await _browser.DisposeAsync();
        }
    }

    public sealed class PageSession : IAsyncDisposable
    {
        // Injected before every page script in this tab:
        //  1. Removes navigator.webdriver so Google/social-media login works.
        //  2. Watches <title> mutations and document.title assignments,
        //     calling the exposed .NET callback whenever the title changes.
        private const string SetupScript = @"
(() => {
    // ── Anti-detection ───────────────────────────────────────────────────────
    try {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        delete navigator.__proto__.webdriver;
    } catch(e) {}

    // ── Title watcher ────────────────────────────────────────────────────────
    let _last = '';
    const notify = () => {
        const t = document.title || '';
        if (t && t !== _last) {
            _last = t;
            try { window.__trmrkTitleChanged(t); } catch(e) {}
        }
    };

    const watchEl = () => {
        const el = document.querySelector('title');
        if (el) new MutationObserver(notify)
            .observe(el, { childList: true, subtree: true, characterData: true });
    };

    // Intercept programmatic document.title = '...' assignments
    try {
        const desc = Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'title')
                  || Object.getOwnPropertyDescriptor(Document.prototype, 'title');
        if (desc) Object.defineProperty(document, 'title', {
            get: () => desc.get ? desc.get.call(document) : _last,
            set: v  => { if (desc.set) desc.set.call(document, v); notify(); },
            configurable: true
        });
    } catch(e) {}

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { watchEl(); notify(); });
    } else { watchEl(); notify(); }
})();";

        private readonly IPage _page;
        private readonly Action<string, string> _onUpdate;

        internal PageSession(IPage page, Action<string, string> onUpdate)
        {
            _page = page;
            _onUpdate = onUpdate;
        }

        internal async Task InitAsync(string url)
        {
            // Expose the .NET callback as a global JS function available on every page
            await _page.ExposeFunctionAsync<string, bool>("__trmrkTitleChanged", title =>
            {
                _onUpdate(title, _page.Url);
                return true;
            });

            // Run setup script before any page scripts on every navigation in this tab
            await _page.EvaluateExpressionOnNewDocumentAsync(SetupScript);

            // Catch SPA-style navigations (history.pushState / hash changes)
            _page.FrameNavigated += OnFrameNavigated;

            try
            {
                await _page.GoToAsync(url, new NavigationOptions
                {
                    WaitUntil = [WaitUntilNavigation.DOMContentLoaded],
                    Timeout = 30_000
                });
            }
            catch (TimeoutException) { /* page may still have a usable title */ }

            await RefreshTitleAsync();
        }

        private async void OnFrameNavigated(object? sender, FrameNavigatedEventArgs e)
        {
            if (e.Frame.ParentFrame != null) return; // main frame only
            await Task.Delay(400);
            await RefreshTitleAsync();
        }

        /// <summary>
        /// Reads document.title from the open tab without reloading the page.
        /// Call this after logging in or accepting a consent dialog.
        /// </summary>
        public async Task RefreshTitleAsync()
        {
            try
            {
                var title = await _page.GetTitleAsync();
                if (!string.IsNullOrEmpty(title))
                    _onUpdate(title, _page.Url);
            }
            catch { /* tab may have been closed by the user */ }
        }

        public async ValueTask DisposeAsync()
        {
            _page.FrameNavigated -= OnFrameNavigated;
            try { await _page.CloseAsync(); } catch { }
            await _page.DisposeAsync();
        }
    }
}
