using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public interface IRichTextBoxPseudoMarkupAdapter
    {
        void InsertPseudoMarkup(
            IRichTextBoxPseudoMarkupAdapterOpts opts);

        Font CreateFont(
            IFontInfo fontInfo);
    }

    public class RichTextBoxPseudoMarkupAdapter : IRichTextBoxPseudoMarkupAdapter
    {
        public void InsertPseudoMarkup(
            IRichTextBoxPseudoMarkupAdapterOpts opts)
        {
            var richTextBox = opts.RichTextBox;
            int idx = opts.InsertIdx;
            bool append = idx >= richTextBox.TextLength;

            if (append)
            {
                idx = richTextBox.TextLength;
            }

            foreach (var line in opts.GetPseudoMarkup().GetLines())
            {
                foreach (var segment in line.GetSegments() ?? [])
                {
                    richTextBox.Select(idx, 0);
                    richTextBox.SelectedText = segment.Text;
                    richTextBox.Select(idx, segment.Text.Length);

                    if (segment.BackgroundColor.HasValue)
                    {
                        richTextBox.SelectionBackColor = segment.BackgroundColor.Value;
                    }

                    if (segment.ForegroundColor.HasValue)
                    {
                        richTextBox.SelectionColor = segment.ForegroundColor.Value;
                    }

                    var font = segment.GetFont();

                    if (font != null)
                    {
                        richTextBox.SelectionFont = CreateFont(font);
                    }

                    idx += segment.Text.Length;
                }

                richTextBox.Select(idx, 0);
                richTextBox.SelectedText = "\n";
                idx++;
            }
        }

        public Font CreateFont(
            IFontInfo fontInfo) => new Font(
                new FontFamily(
                    fontInfo.FontFamilyName),
                fontInfo.FontSize,
                fontInfo.FontStyle);
    }
}
