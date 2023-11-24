using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Turmerik.ConsoleApps;
using Turmerik.DriveExplorer;
using Turmerik.DriveExplorer.DirsPair;
using Turmerik.DriveExplorer.DirsPair.ConsoleApps.MkFsDirPairs;
using Turmerik.Text;
using Turmerik.TextParsing;
using Turmerik.TextSerialization;

namespace Turmerik.HtmlAgility.DirsPair.ConsoleApps.MkFsDirPairs
{
    public class ProgramComponent : ProgramComponentBase
    {
        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IDirsPairCreator dirsPairCreator) : base(
                jsonConversion,
                consoleArgsParser,
                fsEntryNameNormalizer,
                dirsPairCreator)
        {
        }

        protected override async Task<string> GetResouceTitleAsync(string resUrl)
        {
            resUrl = UriH.AssureUriHasScheme(resUrl,
                (scheme, restOfUri, uri) => uri);

            var web = new HtmlWeb();
            var htmlDoc = await web.LoadFromWebAsync(resUrl);

            var htmlNode = htmlDoc.DocumentNode.ChildNodes.SingleOrDefault(
                node => node.Name == "html");

            var headNode = htmlNode?.ChildNodes.SingleOrDefault(
                node => node.Name == "head");

            var titleNode = headNode?.ChildNodes.SingleOrDefault(
                node => node.Name == "title");

            string title = titleNode?.InnerText;
            return title;
        }
    }
}
