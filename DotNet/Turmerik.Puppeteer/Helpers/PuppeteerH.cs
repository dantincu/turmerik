using PuppeteerSharp;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Puppeteer.Helpers
{
    public static class PuppeteerH
    {
        public static async Task WithBrowserFetcherAsync(
            Func<BrowserFetcher, Task> callback)
        {
            var browserFetcher = new BrowserFetcher();
            await browserFetcher.DownloadAsync();

            await callback(browserFetcher);
        }

        public static Task WithBrowserAsync(
            Func<IBrowser, Task> callback,
            LaunchOptions? launchOptions = null) => WithBrowserFetcherAsync(
                async browserFetcher =>
                {
                    await using var browser = await PuppeteerSharp.Puppeteer.LaunchAsync(
                        launchOptions ?? new LaunchOptions { Headless = true });

                    await callback(browser);
                });

        public static Task WithNewPageAsync(
            Func<IPage, IBrowser, Task> callback,
            LaunchOptions? launchOptions = null,
            Func<IBrowser, Task> browserCallback = null) => WithBrowserAsync(async browser =>
            {
                if (browserCallback != null)
                {
                    await browserCallback(browser);
                }

                await using var page = await browser.NewPageAsync();
                await callback(page, browser);
            });

        public static Task HtmlToPdfFile(
            string htmlFilePath,
            string pdfFilePath,
            LaunchOptions? launchOptions = null,
            Func<IBrowser, Task> browserCallback = null) => WithNewPageAsync(
                (page, browser) => HtmlToPdfFile(
                    htmlFilePath,
                    pdfFilePath,
                    browser,
                    page),
                launchOptions,
                browserCallback);

        public static async Task HtmlToPdfFile(
            string htmlFilePath,
            string pdfFilePath,
            IBrowser browser,
            IPage page)
        {
            var htmlUri = new Uri(htmlFilePath).AbsoluteUri;
            await page.GoToAsync(htmlUri);
            await page.EvaluateExpressionHandleAsync("document.fonts.ready"); // Wait for fonts to be loaded. Omitting this might result in no text rendered in pdf.
            await page.PdfAsync(pdfFilePath);
        }
    }
}
