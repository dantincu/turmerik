using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public interface IFontInfo
    {
        string FontFamilyName { get; }
        float FontSize { get; }
        FontStyle FontStyle { get; }
    }

    public static class FontInfo
    {
        public static FontInfoImmtbl ToImmtbl(
            this IFontInfo src) => new FontInfoImmtbl(src);

        public static FontInfoMtbl ToMtbl(
            this IFontInfo src) => new FontInfoMtbl(src);
    }

    public class FontInfoImmtbl : IFontInfo
    {
        public FontInfoImmtbl(
            IFontInfo src)
        {
            FontFamilyName = src.FontFamilyName;
            FontSize = src.FontSize;
            FontStyle = src.FontStyle;
        }

        public string FontFamilyName { get; }
        public float FontSize { get; }
        public FontStyle FontStyle { get; }
    }

    public class FontInfoMtbl : IFontInfo
    {
        public FontInfoMtbl()
        {
        }

        public FontInfoMtbl(
            IFontInfo src)
        {
            FontFamilyName = src.FontFamilyName;
            FontSize = src.FontSize;
            FontStyle = src.FontStyle;
        }

        public string FontFamilyName { get; set; }
        public float FontSize { get; set; }
        public FontStyle FontStyle { get; set; }
    }
}
