using PuppeteerSharp;
using System.Net;
using Turmerik.Core.Utility;

namespace Turmerik.HtmlToPdf.WebApi.Services
{
    public class HtmlToPdfService : IDisposable
    {
        private readonly ILogger<HtmlToPdfService> logger;

        private readonly Semaphore browserInitSem = new(1, 1);
        private readonly Semaphore pageInitSem = new(1, 1);

        private IBrowser browser;
        private IPage page;

        private int isGenerating;

        public HtmlToPdfService(
            ILogger<HtmlToPdfService> logger)
        {
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public void Dispose()
        {
            this.page?.Dispose();
            this.browser?.Dispose();
        }

        public Task<Stream> GenerateAsync(
            string html) => GenerateCoreAsync(async () =>
            {
                this.logger.LogTrace("Setting html content");
                await page.SetContentAsync(html);

                this.logger.LogTrace("Evaluating document fonts");
                await page.EvaluateExpressionHandleAsync("document.fonts.ready"); // Wait for fonts to be loaded. Omitting this might result in no text rendered in pdf.

                this.logger.LogTrace("Generating the document bytes");
                var stream = await page.PdfStreamAsync();

                this.logger.LogTrace("The document bytes generated successfully");
                return stream;
            });

        public Task GenerateFileAsync(
            string htmlFilePath,
            string pdfFilePath) => GenerateCoreAsync<object?>(async () =>
            {
                this.logger.LogTrace("Setting html file path");
                await page.GoToAsync($"file:///{htmlFilePath}");

                this.logger.LogTrace("Evaluating document fonts");
                await page.EvaluateExpressionHandleAsync("document.fonts.ready"); // Wait for fonts to be loaded. Omitting this might result in no text rendered in pdf.

                this.logger.LogTrace("Generating the document file");
                await page.PdfAsync(pdfFilePath);

                this.logger.LogTrace("The document file generated successfully");
                return null;
            });

        private async Task<T> GenerateCoreAsync<T>(
            Func<Task<T>> generateFunc)
        {
            await AssureIsInitialized();

            if (Interlocked.CompareExchange(
                ref isGenerating, 1, 0) == 0)
            {
                Exception? exc = null;
                bool refreshPage = false;

                try
                {
                    var result = await generateFunc();
                    return result;
                }
                catch (Exception ex)
                {
                    exc = ex;
                    refreshPage = true;
                }
                finally
                {
                    Interlocked.Exchange(ref isGenerating, 0);
                }

                if (refreshPage)
                {
                    page = null;
                    await AssureIsInitialized();
                }

                throw new TrmrkException<HttpStatusCode>(
                    "An error occurred while generating the document", exc, HttpStatusCode.InternalServerError);
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

            if (page == null || page.IsClosed)
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
