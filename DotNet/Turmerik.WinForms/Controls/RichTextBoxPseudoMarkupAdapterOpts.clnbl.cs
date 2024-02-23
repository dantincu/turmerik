using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public interface IRichTextBoxPseudoMarkupAdapterOpts
    {
        RichTextBox RichTextBox { get; }
        int InsertIdx { get; }

        IRichTextBoxPseudoMarkup GetPseudoMarkup();
    }

    public static class RichTextBoxPseudoMarkupAdapterOpts
    {
        public static RichTextBoxPseudoMarkupAdapterOptsImmtbl ToImmtbl(
            this IRichTextBoxPseudoMarkupAdapterOpts src) => new RichTextBoxPseudoMarkupAdapterOptsImmtbl(src);

        public static RichTextBoxPseudoMarkupAdapterOptsMtbl ToMtbl(
            this IRichTextBoxPseudoMarkupAdapterOpts src) => new RichTextBoxPseudoMarkupAdapterOptsMtbl(src);
    }

    public class RichTextBoxPseudoMarkupAdapterOptsImmtbl : IRichTextBoxPseudoMarkupAdapterOpts
    {
        public RichTextBoxPseudoMarkupAdapterOptsImmtbl(
            IRichTextBoxPseudoMarkupAdapterOpts src)
        {
            RichTextBox = src.RichTextBox;
            InsertIdx = src.InsertIdx;
            PseudoMarkup = src.GetPseudoMarkup()?.ToImmtbl();
        }

        public RichTextBox RichTextBox { get; }
        public int InsertIdx { get; }

        public RichTextBoxPseudoMarkupImmtbl PseudoMarkup { get; }

        public IRichTextBoxPseudoMarkup GetPseudoMarkup() => PseudoMarkup;
    }

    public class RichTextBoxPseudoMarkupAdapterOptsMtbl : IRichTextBoxPseudoMarkupAdapterOpts
    {
        public RichTextBoxPseudoMarkupAdapterOptsMtbl()
        {
        }

        public RichTextBoxPseudoMarkupAdapterOptsMtbl(
            IRichTextBoxPseudoMarkupAdapterOpts src)
        {
            RichTextBox = src.RichTextBox;
            InsertIdx = src.InsertIdx;
            PseudoMarkup = src.GetPseudoMarkup()?.ToMtbl();
        }

        public RichTextBox RichTextBox { get; set; }
        public int InsertIdx { get; set; }

        public RichTextBoxPseudoMarkupMtbl PseudoMarkup { get; set; }

        public IRichTextBoxPseudoMarkup GetPseudoMarkup() => PseudoMarkup;
    }
}
