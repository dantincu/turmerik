using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public interface IRichTextBoxPseudoMarkupRetrieverOpts
    {
        RichTextBox RichTextBox { get; }
    }

    public static class RichTextBoxPseudoMarkupRetrieverOpts
    {
        public static RichTextBoxPseudoMarkupRetrieverOptsImmtbl ToImmtbl(
            this IRichTextBoxPseudoMarkupRetrieverOpts src) => new RichTextBoxPseudoMarkupRetrieverOptsImmtbl(src);

        public static RichTextBoxPseudoMarkupRetrieverOptsMtbl ToMtbl(
            this IRichTextBoxPseudoMarkupRetrieverOpts src) => new RichTextBoxPseudoMarkupRetrieverOptsMtbl(src);
    }

    public class RichTextBoxPseudoMarkupRetrieverOptsImmtbl : IRichTextBoxPseudoMarkupRetrieverOpts
    {
        public RichTextBoxPseudoMarkupRetrieverOptsImmtbl(
            IRichTextBoxPseudoMarkupRetrieverOpts src)
        {
            RichTextBox = src.RichTextBox;
        }

        public RichTextBox RichTextBox { get; }
    }

    public class RichTextBoxPseudoMarkupRetrieverOptsMtbl : IRichTextBoxPseudoMarkupRetrieverOpts
    {
        public RichTextBoxPseudoMarkupRetrieverOptsMtbl()
        {
        }

        public RichTextBoxPseudoMarkupRetrieverOptsMtbl(
            IRichTextBoxPseudoMarkupRetrieverOpts src)
        {
            RichTextBox = src.RichTextBox;
        }

        public RichTextBox RichTextBox { get; set; }
    }
}
