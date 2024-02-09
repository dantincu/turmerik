using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Text;

namespace Turmerik.Html
{
    public interface IHtmlDocTitleRetriever
    {
        Task<string> GetResouceTitleAsync(
            string resUrl,
            bool normalizeTitle = true);

        string GetHtmlDocTitle(
            HtmlDocument htmlDoc);

        string NormalizeTitle(
            string title);
    }

    public class HtmlDocTitleRetriever : IHtmlDocTitleRetriever
    {
        public async Task<string> GetResouceTitleAsync(
            string resUrl,
            bool normalizeTitle = true)
        {
            resUrl = UriH.AssureUriHasScheme(resUrl,
                (scheme, restOfUri, uri) => uri);

            var web = new HtmlWeb();
            var htmlDoc = await web.LoadFromWebAsync(resUrl);

            string title = GetHtmlDocTitle(htmlDoc);

            if (title != null && normalizeTitle)
            {
                title = NormalizeTitle(title);
            }

            return title;
        }

        public string GetHtmlDocTitle(
            HtmlDocument htmlDoc)
        {
            var htmlNode = htmlDoc.DocumentNode.ChildNodes.SingleOrDefault(
                node => node.Name == "html");

            var headNode = htmlNode?.ChildNodes.SingleOrDefault(
                node => node.Name == "head");

            var titleNode = headNode?.ChildNodes.FirstOrDefault(
                node => node.Name == "title");

            string title = titleNode?.InnerText;
            return title;
        }

        public string NormalizeTitle(
            string title) => title.NormalizeWhitespaces();
    }
}
