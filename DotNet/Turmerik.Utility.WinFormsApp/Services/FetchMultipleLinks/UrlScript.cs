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
            Index = src.Index;
            Title = src.Title;
            Text = src.Text;
            TimeStampStr = src.TimeStampStr;
            IsTitle = src.IsTitle;
            IsUrl = src.IsUrl;
            Factory = src.Factory;
        }

        public int Index { get; init; }
        public string Title { get; set; }
        public string? Text { get; init; }
        public string? TimeStampStr { get; init; }
        public bool IsTitle { get; init; }
        public bool IsUrl { get; init; }
        public bool IsText { get; init; }
        public bool IsTimeStampStr { get; init; }
        public Func<UrlScriptArgs, UrlScriptOutput> Factory { get; init; }
    }

    public class UrlScriptArgs
    {
        public UrlScriptArgs(
            string url,
            string title,
            string? redirectedUrl,
            string? text,
            string? timeStampStr)
        {
            Url = url;
            Title = title;
            RedirectedUrl = redirectedUrl;
            Text = text;
            TimeStampStr = timeStampStr;
        }

        public string Url { get; init; }
        public string Title { get; init; }
        public string? RedirectedUrl { get; init; }
        public string? Text { get; init; }
        public string? TimeStampStr { get; init; }
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
