using System.Collections.ObjectModel;

namespace Turmerik.Utility.BlazorServerApp.Services.FetchMultipleLinks
{
    public enum TextFontStyle { Regular, Bold, Italic, Underline }

    public class UrlScript
    {
        public UrlScript() { }

        public UrlScript(UrlScript src)
        {
            Index = src.Index;
            Title = src.Title;
            Text = src.Text;
            TimeStampStr = src.TimeStampStr;
            IsTitle = src.IsTitle;
            IsUrl = src.IsUrl;
            IsText = src.IsText;
            IsTimeStampStr = src.IsTimeStampStr;
            Factory = src.Factory;
        }

        public int Index { get; init; }
        public string? Title { get; set; }
        public string? Text { get; init; }
        public string? TimeStampStr { get; init; }
        public bool IsTitle { get; init; }
        public bool IsUrl { get; init; }
        public bool IsText { get; init; }
        public bool IsTimeStampStr { get; init; }
        public Func<UrlScriptArgs, UrlScriptOutput>? Factory { get; init; }
    }

    public class UrlScriptArgs
    {
        public UrlScriptArgs(string url, string title, string? redirectedUrl, string? text, string? timeStampStr)
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
        public UrlScriptOutput(UrlScriptTextPart[] textParts)
        {
            TextParts = new(textParts);
        }

        public ReadOnlyCollection<UrlScriptTextPart> TextParts { get; init; }
    }

    public class UrlScriptTextPart
    {
        public UrlScriptTextPart(string text, TextFontStyle fontStyle = TextFontStyle.Regular, string? foreColor = null, string? backColor = null)
        {
            Text = text;
            FontStyle = fontStyle;
            ForeColor = foreColor;
            BackColor = backColor;
        }

        public string Text { get; init; }
        public TextFontStyle FontStyle { get; init; }
        public string? ForeColor { get; init; }
        public string? BackColor { get; init; }
    }
}
