using PuppeteerSharp;

namespace Turmerik.Utility.BlazorServerApp.Services
{
    public class PuppeteerTitleFetcherService : IAsyncDisposable
    {
        private static readonly string UserDataDir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "TurmerikUtility", "browser-profile");

        private static readonly string[] BrowserCandidates =
        [
            @"C:\Program Files\Google\Chrome\Application\chrome.exe",
            @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                @"Google\Chrome\Application\chrome.exe"),
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
                        "--disable-blink-features=AutomationControlled",
                        "--disable-infobars",
                        "--exclude-switches=enable-automation"
                    ]
                };

                Directory.CreateDirectory(UserDataDir);

                if (executablePath != null)
                {
                    launchOptions.ExecutablePath = executablePath;
                    progress?.Report($"Launching {Path.GetFileNameWithoutExtension(executablePath)}…");
                }
                else
                {
                    progress?.Report("No Chrome/Edge found — downloading Chromium (one-time, ~400 MB)…");
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
            Action<string, string> onUpdate,   // (title, currentAddressBarUrl)
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
        // Runs before any page script on every navigation in this tab.
        // Passes BOTH title AND location.href to .NET so the address-bar URL
        // is always correct regardless of when _page.Url updates on the C# side.
        private const string SetupScript = """
            (() => {
                // ── Anti-detection ──────────────────────────────────────────
                try {
                    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                    delete navigator.__proto__.webdriver;
                } catch(e) {}

                // ── Title watcher ────────────────────────────────────────────
                let _last = '';
                const notify = () => {
                    const t = document.title || '';
                    if (t && t !== _last) {
                        _last = t;
                        // location.href is read here in JS, so it always reflects
                        // the current address bar — no race with _page.Url in C#.
                        try { window.__trmrkTitleChanged(t, location.href); } catch(e) {}
                    }
                };

                const watchEl = () => {
                    const el = document.querySelector('title');
                    if (el) new MutationObserver(notify)
                        .observe(el, { childList: true, subtree: true, characterData: true });
                };

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
            })();
            """;

        private readonly IPage _page;
        private readonly Action<string, string> _onUpdate;

        internal PageSession(IPage page, Action<string, string> onUpdate)
        {
            _page = page;
            _onUpdate = onUpdate;
        }

        internal async Task InitAsync(string url)
        {
            // Receive both title and address-bar URL from the JS side
            await _page.ExposeFunctionAsync<string, string, bool>(
                "__trmrkTitleChanged",
                (title, addressBarUrl) =>
                {
                    _onUpdate(title, addressBarUrl);
                    return true;
                });

            await _page.EvaluateExpressionOnNewDocumentAsync(SetupScript);

            _page.FrameNavigated += OnFrameNavigated;

            try
            {
                await _page.GoToAsync(url, new NavigationOptions
                {
                    WaitUntil = [WaitUntilNavigation.DOMContentLoaded],
                    Timeout = 30_000
                });
            }
            catch (TimeoutException) { }

            await RefreshTitleAsync();
        }

        private async void OnFrameNavigated(object? sender, FrameNavigatedEventArgs e)
        {
            if (e.Frame.ParentFrame != null) return;
            // Use e.Frame.Url — already the post-navigation URL, no race condition
            var frameUrl = e.Frame.Url;
            await Task.Delay(400);
            try
            {
                var title = await _page.GetTitleAsync();
                if (!string.IsNullOrEmpty(title))
                    _onUpdate(title, frameUrl);
            }
            catch { }
        }

        /// <summary>
        /// Reads document.title and the current address-bar URL from the open tab.
        /// Call this after logging in or accepting a consent dialog.
        /// </summary>
        public async Task RefreshTitleAsync()
        {
            try
            {
                var title = await _page.GetTitleAsync();
                var currentUrl = _page.Url;
                if (!string.IsNullOrEmpty(title))
                    _onUpdate(title, currentUrl);
            }
            catch { }
        }

        public async ValueTask DisposeAsync()
        {
            _page.FrameNavigated -= OnFrameNavigated;
            try { await _page.CloseAsync(); } catch { }
            await _page.DisposeAsync();
        }
    }
}
