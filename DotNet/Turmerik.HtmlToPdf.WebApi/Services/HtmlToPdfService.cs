using PuppeteerSharp;
using System.Net;
using Turmerik.Core.Utility;

namespace Turmerik.HtmlToPdf.WebApi.Services
{
    public class HtmlToPdfService : IDisposable
    {
        private readonly Semaphore browserInitSem = new(1, 1);
        private readonly Semaphore pageInitSem = new(1, 1);

        private IBrowser browser;
        private IPage page;

        private int isGenerating;

        public void Dispose()
        {
            this.page?.Dispose();
            this.browser?.Dispose();
        }

        public Task<Stream> GenerateAsync(
            string html) => GenerateCoreAsync(async () =>
            {
                await page.SetContentAsync(html);
                await page.EvaluateExpressionHandleAsync("document.fonts.ready"); // Wait for fonts to be loaded. Omitting this might result in no text rendered in pdf.
                var stream = await page.PdfStreamAsync();
                return stream;
            });

        public Task GenerateFileAsync(
            string htmlFilePath,
            string pdfFilePath) => GenerateCoreAsync<object?>(async () =>
            {
                await page.GoToAsync($"file:///{htmlFilePath}");
                await page.EvaluateExpressionHandleAsync("document.fonts.ready"); // Wait for fonts to be loaded. Omitting this might result in no text rendered in pdf.
                await page.PdfAsync(pdfFilePath);
                return null;
            });

        private async Task<T> GenerateCoreAsync<T>(
            Func<Task<T>> generateFunc)
        {
            await AssureIsInitialized();

            if (Interlocked.CompareExchange(
                ref isGenerating, 1, 0) == 0)
            {
                try
                {
                    var result = await generateFunc();
                    return result;
                }
                catch (Exception ex)
                {
                    throw new TrmrkException<HttpStatusCode>(
                        HttpStatusCode.InternalServerError);
                }
                finally
                {
                    Interlocked.Exchange(ref isGenerating, 0);
                }
            }
            else
            {
                throw new TrmrkException<HttpStatusCode>(
                    HttpStatusCode.TooManyRequests);
            }
        }

        private async Task AssureIsInitialized()
        {
            if (browser == null)
            {
                browserInitSem.WaitOne();

                try
                {
                    if (browser == null)
                    {
                        var browserFetcher = new BrowserFetcher();
                        await browserFetcher.DownloadAsync();

                        browser = await Puppeteer.LaunchAsync(
                                new LaunchOptions { Headless = true });
                    }
                }
                finally
                {
                    browserInitSem.Release();
                }
            }

            if (page == null)
            {
                pageInitSem.WaitOne();
                try
                {
                    if (page == null)
                    {
                        page = await browser.NewPageAsync();
                    }
                }
                finally
                {
                    pageInitSem.Release();
                }
            }
        }
    }
}
