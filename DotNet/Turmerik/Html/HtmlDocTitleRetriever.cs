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
        Task<string> GetResouceTitleAsync(string resUrl);
        string GetHtmlDocTitle(HtmlDocument htmlDoc);
    }

    public class HtmlDocTitleRetriever : IHtmlDocTitleRetriever
    {
        public async Task<string> GetResouceTitleAsync(string resUrl)
        {
            resUrl = UriH.AssureUriHasScheme(resUrl,
                (scheme, restOfUri, uri) => uri);

            var web = new HtmlWeb();
            var htmlDoc = await web.LoadFromWebAsync(resUrl);

            string title = GetHtmlDocTitle(htmlDoc);
            return title;
        }

        public string GetHtmlDocTitle(HtmlDocument htmlDoc)
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
    }
}
