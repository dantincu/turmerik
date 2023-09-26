using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.QuickMarks.AvaloniaApp.ViewModels
{
    public class HtmlNodeOpts
    {
        public HtmlNodeOpts(
            string nodeName,
            Func<HtmlNode, bool> predicate = null)
        {
            NodeName = nodeName;
            Predicate = predicate;
        }

        public string NodeName { get; set; }
        public Func<HtmlNode, bool> Predicate { get; set; }
    }
}
