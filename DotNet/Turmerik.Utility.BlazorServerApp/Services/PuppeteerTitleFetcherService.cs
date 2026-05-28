using PuppeteerSharp;

namespace Turmerik.Utility.BlazorServerApp.Services
{
    public class PuppeteerTitleFetcherService : IAsyncDisposable
    {
        // Persistent profile keeps cookies/logins between sessions
        private static readonly string UserDataDir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "TurmerikUtility", "chrome-profile");

        private IBrowser? _browser;
        private readonly SemaphoreSlim _initLock = new(1, 1);
        private bool _initialized;
        private string? _initError;

        public string? InitError => _initError;

        public async Task<string?> EnsureReadyAsync(IProgress<string>? progress = null)
        {
            // Re-initialize if browser was closed externally
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

                progress?.Report("Downloading Chromium (one-time, ~400 MB)…");
                var fetcher = new BrowserFetcher();
                await fetcher.DownloadAsync();

                progress?.Report("Launching browser…");
                Directory.CreateDirectory(UserDataDir);

                _browser = await Puppeteer.LaunchAsync(new LaunchOptions
                {
                    Headless = false,
                    UserDataDir = UserDataDir,
                    Args = ["--no-sandbox", "--disable-setuid-sandbox"]
                });

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
        // Injected before every page script; notifies .NET whenever document.title changes
        private const string TitleWatcherScript = @"
(() => {
    let _last = '';
    const notify = () => {
        const t = document.title || '';
        if (t && t !== _last) { _last = t; try { window.__trmrkTitleChanged(t); } catch(e){} }
    };
    const watchEl = () => {
        const el = document.querySelector('title');
        if (el) new MutationObserver(notify).observe(el, { childList: true, subtree: true, characterData: true });
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
            // Expose .NET callback so the injected JS can call it
            await _page.ExposeFunctionAsync<string, bool>("__trmrkTitleChanged", title =>
            {
                _onUpdate(title, _page.Url);
                return true;
            });

            // Run watcher script on every navigation in this tab
            await _page.EvaluateExpressionOnNewDocumentAsync(TitleWatcherScript);

            // Also catch SPA-style navigations (history.pushState etc.)
            _page.FrameNavigated += OnFrameNavigated;

            try
            {
                await _page.GoToAsync(url, new NavigationOptions
                {
                    WaitUntil = [WaitUntilNavigation.DOMContentLoaded],
                    Timeout = 30_000
                });
            }
            catch (TimeoutException) { /* page may still have a title */ }

            // Seed the UI with whatever title is already there
            await RefreshTitleAsync();
        }

        private async void OnFrameNavigated(object? sender, FrameNavigatedEventArgs e)
        {
            if (e.Frame.ParentFrame != null) return; // main frame only
            await Task.Delay(400);                   // let the new page settle
            await RefreshTitleAsync();
        }

        /// <summary>
        /// Reads the current title from the open tab without reopening the page.
        /// Useful as a manual fallback after authentication or consent dialogs.
        /// </summary>
        public async Task RefreshTitleAsync()
        {
            try
            {
                var title = await _page.GetTitleAsync();
                if (!string.IsNullOrEmpty(title))
                    _onUpdate(title, _page.Url);
            }
            catch { /* page may have been closed by the user */ }
        }

        public async ValueTask DisposeAsync()
        {
            _page.FrameNavigated -= OnFrameNavigated;
            try { await _page.CloseAsync(); } catch { /* already closed */ }
            await _page.DisposeAsync();
        }
    }
}
