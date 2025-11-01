using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Utility.WinFormsApp.Services.FetchMultipleLinks
{
    public class UrlScript
    {
        public UrlScript()
        {
        }

        public UrlScript(UrlScript src)
        {
            IsTitle = src.IsTitle;
            IsUrl = src.IsUrl;
            Index = src.Index;
            Factory = src.Factory;
            Text = src.Text;
        }

        public bool IsTitle { get; init; }
        public bool IsUrl { get; init; }
        public int Index { get; init; }
        public Func<string, string, string> Factory { get; init; }
        public string? Text { get; init; }
    }
}
