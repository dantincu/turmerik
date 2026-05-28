namespace Turmerik.Utility.BlazorServerApp.Services.FetchMultipleLinks
{
    public static class UrlScriptH
    {
        public static UrlScriptTextPart ToTextPart(
            this string text,
            TextFontStyle fontStyle = TextFontStyle.Regular,
            string? foreColor = null,
            string? backColor = null) => new(text, fontStyle, foreColor, backColor);
    }
}
