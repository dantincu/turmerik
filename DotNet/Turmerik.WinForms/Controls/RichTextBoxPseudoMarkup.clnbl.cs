using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.WinForms.Controls
{
    public interface IRichTextBoxPseudoMarkup
    {
        IEnumerable<IRichTextBoxPseudoMarkupLine> GetLines();
    }

    public interface IRichTextBoxPseudoMarkupLine
    {
        IEnumerable<IRichTextBoxPseudoMarkupSegment> GetSegments();
    }

    public interface IRichTextBoxPseudoMarkupSegment
    {
        int StartIdx { get; }
        int Length { get; }
        string Text { get; }

        Color? ForegroundColor { get; }
        Color? BackgroundColor { get; }
        IFontInfo GetFont();
    }

    public static class RichTextBoxPseudoMarkup
    {
        public static RichTextBoxPseudoMarkupImmtbl ToImmtbl(
            this IRichTextBoxPseudoMarkup src) => new RichTextBoxPseudoMarkupImmtbl(src);

        public static RichTextBoxPseudoMarkupMtbl ToMtbl(
            this IRichTextBoxPseudoMarkup src) => new RichTextBoxPseudoMarkupMtbl(src);

        public static RichTextBoxPseudoMarkupLineImmtbl ToImmtbl(
            this IRichTextBoxPseudoMarkupLine src) => new RichTextBoxPseudoMarkupLineImmtbl(src);

        public static RichTextBoxPseudoMarkupLineMtbl ToMtbl(
            this IRichTextBoxPseudoMarkupLine src) => new RichTextBoxPseudoMarkupLineMtbl(src);

        public static ReadOnlyCollection<RichTextBoxPseudoMarkupLineImmtbl> ToImmtblRdnlC(
            this IEnumerable<IRichTextBoxPseudoMarkupLine> nmrbl) => nmrbl.Select(ToImmtbl).RdnlC();

        public static List<RichTextBoxPseudoMarkupLineMtbl> ToMtblList(
            this IEnumerable<IRichTextBoxPseudoMarkupLine> nmrbl) => nmrbl.Select(ToMtbl).ToList();

        public static RichTextBoxPseudoMarkupSegmentImmtbl ToImmtbl(
            this IRichTextBoxPseudoMarkupSegment src) => new RichTextBoxPseudoMarkupSegmentImmtbl(src);

        public static RichTextBoxPseudoMarkupSegmentMtbl ToMtbl(
            this IRichTextBoxPseudoMarkupSegment src) => new RichTextBoxPseudoMarkupSegmentMtbl(src);

        public static ReadOnlyCollection<RichTextBoxPseudoMarkupSegmentImmtbl> ToImmtblRdnlC(
            this IEnumerable<IRichTextBoxPseudoMarkupSegment> nmrbl) => nmrbl.Select(ToImmtbl).RdnlC();

        public static List<RichTextBoxPseudoMarkupSegmentMtbl> ToMtblList(
            this IEnumerable<IRichTextBoxPseudoMarkupSegment> nmrbl) => nmrbl.Select(ToMtbl).ToList();
    }

    public class RichTextBoxPseudoMarkupImmtbl : IRichTextBoxPseudoMarkup
    {
        public RichTextBoxPseudoMarkupImmtbl(
            IRichTextBoxPseudoMarkup src)
        {
            Lines = src.GetLines()?.ToImmtblRdnlC();
        }

        public ReadOnlyCollection<RichTextBoxPseudoMarkupLineImmtbl> Lines { get; }

        public IEnumerable<IRichTextBoxPseudoMarkupLine> GetLines() => Lines;
    }

    public class RichTextBoxPseudoMarkupMtbl : IRichTextBoxPseudoMarkup
    {
        public RichTextBoxPseudoMarkupMtbl()
        {
        }

        public RichTextBoxPseudoMarkupMtbl(
            IRichTextBoxPseudoMarkup src)
        {
            Lines = src.GetLines()?.ToMtblList();
        }

        public List<RichTextBoxPseudoMarkupLineMtbl> Lines { get; set; }

        public IEnumerable<IRichTextBoxPseudoMarkupLine> GetLines() => Lines;
    }

    public class RichTextBoxPseudoMarkupLineImmtbl : IRichTextBoxPseudoMarkupLine
    {
        public RichTextBoxPseudoMarkupLineImmtbl(
            IRichTextBoxPseudoMarkupLine src)
        {
            Segments = src.GetSegments()?.ToImmtblRdnlC();
        }

        public ReadOnlyCollection<RichTextBoxPseudoMarkupSegmentImmtbl> Segments { get; }

        public IEnumerable<IRichTextBoxPseudoMarkupSegment> GetSegments() => Segments;
    }

    public class RichTextBoxPseudoMarkupLineMtbl : IRichTextBoxPseudoMarkupLine
    {
        public RichTextBoxPseudoMarkupLineMtbl()
        {
        }

        public RichTextBoxPseudoMarkupLineMtbl(
            IRichTextBoxPseudoMarkupLine src)
        {
            Segments = src.GetSegments()?.ToMtblList();
        }

        public List<RichTextBoxPseudoMarkupSegmentMtbl> Segments { get; set; }

        public IEnumerable<IRichTextBoxPseudoMarkupSegment> GetSegments() => Segments;
    }

    public class RichTextBoxPseudoMarkupSegmentImmtbl : IRichTextBoxPseudoMarkupSegment
    {
        public RichTextBoxPseudoMarkupSegmentImmtbl(
            IRichTextBoxPseudoMarkupSegment src)
        {
            StartIdx = src.StartIdx;
            Length = src.Length;
            Text = src.Text;
            ForegroundColor = src.ForegroundColor;
            BackgroundColor = src.BackgroundColor;
            Font = src.GetFont()?.ToImmtbl();
        }

        public int StartIdx { get; }
        public int Length { get; }
        public string Text { get; }

        public Color? ForegroundColor { get; }
        public Color? BackgroundColor { get; }
        public FontInfoImmtbl Font { get; }

        public IFontInfo GetFont() => Font;
    }

    public class RichTextBoxPseudoMarkupSegmentMtbl : IRichTextBoxPseudoMarkupSegment
    {
        public RichTextBoxPseudoMarkupSegmentMtbl()
        {
        }

        public RichTextBoxPseudoMarkupSegmentMtbl(
            IRichTextBoxPseudoMarkupSegment src)
        {
            StartIdx = src.StartIdx;
            Length = src.Length;
            Text = src.Text;
            ForegroundColor = src.ForegroundColor;
            BackgroundColor = src.BackgroundColor;
            Font = src.GetFont()?.ToMtbl();
        }

        public int StartIdx { get; set; }
        public int Length { get; set; }
        public string Text { get; set; }
        public Color? ForegroundColor { get; set; }
        public Color? BackgroundColor { get; set; }
        public FontInfoMtbl Font { get; set; }

        public IFontInfo GetFont() => Font;
    }
}
