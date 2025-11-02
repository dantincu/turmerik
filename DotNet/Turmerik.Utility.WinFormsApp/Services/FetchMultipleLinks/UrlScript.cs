using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
            Name = src.Name;
            IsTitle = src.IsTitle;
            IsUrl = src.IsUrl;
            Index = src.Index;
            Factory = src.Factory;
        }

        public string Name { get; set; }
        public bool IsTitle { get; init; }
        public bool IsUrl { get; init; }
        public int Index { get; init; }
        public Func<UrlScriptArgs, UrlScriptOutput> Factory { get; init; }
    }

    public class UrlScriptArgs
    {
        public UrlScriptArgs(
            string url,
            string title)
        {
            Url = url;
            Title = title;
        }

        public string Url { get; init; }
        public string Title { get; init; }
    }

    public class UrlScriptOutput
    {
        public UrlScriptOutput(
            UrlScriptTextPart[] textParts)
        {
            TextParts = new(textParts);
        }

        public ReadOnlyCollection<UrlScriptTextPart> TextParts { get; init; }
    }

    public class UrlScriptTextPart
    {
        public UrlScriptTextPart(
            string text,
            FontStyle fontStyle = FontStyle.Regular,
            Color? foreColor = null,
            Color? backColor = null)
        {
            Text = text;
            FontStyle = fontStyle;
            ForeColor = foreColor;
            BackColor = backColor;
        }

        public string Text { get; init; }
        public FontStyle FontStyle { get; init; }
        public Color? ForeColor { get; init; }
        public Color? BackColor { get; init; }
    }
}
