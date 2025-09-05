using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Html
{
    public interface IHtmlToPdfConverter : IDisposable
    {
        Task ConvertHtmlFileAsync(
            string htmlFilePath,
            string pdfFilePath);

        Task<Stream> ConvertHtmlAsync(string html);
    }

    public class HtmlToPdfConverter : IHtmlToPdfConverter
    {
        private readonly IDirsPairConfigLoader dirsPairConfigLoader;

        private readonly HttpClient httpClient;
        private readonly DirsPairConfig dirsPairConfig;
        private readonly string htmlToPdfApiUri;

        public HtmlToPdfConverter(
            IDirsPairConfigLoader dirsPairConfigLoader)
        {
            this.dirsPairConfigLoader = dirsPairConfigLoader ?? throw new ArgumentNullException(
                nameof(dirsPairConfigLoader));

            httpClient = new HttpClient(new HttpClientHandler
            {
                UseDefaultCredentials = true // send current Windows identity
            });

            dirsPairConfig = dirsPairConfigLoader.LoadConfig();
            htmlToPdfApiUri = dirsPairConfig.HtmlToPdfApiUri;
        }

        public async Task ConvertHtmlFileAsync(
            string htmlFilePath,
            string pdfFilePath)
        {
            string html = File.ReadAllText(htmlFilePath);
            using Stream pdfStream = await ConvertHtmlAsync(html);

            using FileStream fileStream = new FileStream(
                pdfFilePath,
                FileMode.Create,
                FileAccess.Write);

            await pdfStream.CopyToAsync(fileStream);
            await fileStream.FlushAsync();
            fileStream.Close();
            pdfStream.Close();
        }

        public async Task<Stream> ConvertHtmlAsync(string html)
        {
            // Wrap it in StringContent with the correct media type
            var content = new StringContent(html, Encoding.UTF8, "text/plain");

            // Send POST request
            HttpResponseMessage response = await httpClient.PostAsync(
                htmlToPdfApiUri, content);

            // Read the response
            response.EnsureSuccessStatusCode();

            // Read the response as a Stream
            Stream responseStream = await response.Content.ReadAsStreamAsync();
            return responseStream;
        }

        public void Dispose()
        {
            httpClient.Dispose();
        }
    }
}
