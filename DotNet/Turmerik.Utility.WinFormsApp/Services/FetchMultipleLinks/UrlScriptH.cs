using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Utility.WinFormsApp.Services.FetchMultipleLinks
{
    public static class UrlScriptH
    {
        public static UrlScriptTextPart ToTextPart(
            this string text,
            FontStyle fontStyle = FontStyle.Regular,
            Color? foreColor = null,
            Color? backColor = null) => new(
                text, fontStyle, foreColor, backColor);
    }
}
