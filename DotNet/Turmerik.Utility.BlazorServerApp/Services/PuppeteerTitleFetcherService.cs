using PuppeteerSharp;

namespace Turmerik.Utility.BlazorServerApp.Services
{
    public record TitleFetchResult(string Title, string FinalUrl);

    public class PuppeteerTitleFetcherService : IAsyncDisposable
    {
        private IBrowser? _browser;
        private readonly SemaphoreSlim _initLock = new(1, 1);
        private bool _initialized;
        private string? _initError;

        public bool IsReady => _initialized && _initError == null;
        public string? InitError => _initError;

        public async Task<string?> EnsureReadyAsync(IProgress<string>? progress = null)
        {
            if (_initialized) return _initError;

            await _initLock.WaitAsync();
            try
            {
                if (_initialized) return _initError;

                progress?.Report("Downloading Chromium (this is a one-time ~400 MB download)...");
                var browserFetcher = new BrowserFetcher();
                await browserFetcher.DownloadAsync();

                progress?.Report("Launching headless browser...");
                _browser = await Puppeteer.LaunchAsync(new LaunchOptions
                {
                    Headless = true,
                    Args = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
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

        public async Task<TitleFetchResult> FetchTitleAsync(string url, CancellationToken ct = default)
        {
            var error = await EnsureReadyAsync();
            if (error != null)
                throw new InvalidOperationException($"Browser not available: {error}");

            await using var page = await _browser!.NewPageAsync();

            await page.SetUserAgentAsync(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

            IResponse? response = null;
            try
            {
                response = await page.GoToAsync(url, new NavigationOptions
                {
                    WaitUntil = [WaitUntilNavigation.DOMContentLoaded],
                    Timeout = 30_000
                });
            }
            catch (TimeoutException)
            {
                // page might still have loaded enough for a title
            }

            var title = await page.GetTitleAsync();
            var finalUrl = page.Url;

            return new TitleFetchResult(title ?? "", finalUrl);
        }

        public async ValueTask DisposeAsync()
        {
            if (_browser != null)
                await _browser.DisposeAsync();
        }
    }
}
