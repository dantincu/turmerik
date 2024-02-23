using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public interface IRichTextBoxPseudoMarkupRetriever
    {
        RichTextBoxPseudoMarkupMtbl GetPseudoMarkup(
            IRichTextBoxPseudoMarkupRetrieverOpts opts);

        bool IsSameStyle(
            RichTextBoxPseudoMarkupSegmentMtbl segment,
            IFontInfo font,
            Color backgroundColor,
            Color foregroundColor);

        bool IsSameStyle(
            IFontInfo currentFont,
            IFontInfo nextCharFont);

        FontInfoMtbl GetNextCharStyle(
            RichTextBox richTextBox,
            int newIdx,
            out Color backgroundColor,
            out Color foregroundColor);
    }

    public class RichTextBoxPseudoMarkupRetriever : IRichTextBoxPseudoMarkupRetriever
    {
        public RichTextBoxPseudoMarkupMtbl GetPseudoMarkup(
            IRichTextBoxPseudoMarkupRetrieverOpts opts)
        {
            var currentLine = CreateLine(
                0, out var currentSegment);

            var retMtbl = new RichTextBoxPseudoMarkupMtbl
            {
                Lines = new List<RichTextBoxPseudoMarkupLineMtbl>
                {
                    currentLine
                }
            };

            var currentChars = new List<char>();
            var richTextBox = opts.RichTextBox;
            string text = richTextBox.Text;
            int textLen = text.Length;

            for (int i = 0; i < textLen; i++)
            {
                var chr = text[i];

                if (chr == '\n')
                {
                    currentSegment.Text = new string(
                        currentChars.ToArray());

                    currentSegment.Length = currentChars.Count;

                    currentLine = CreateLine(
                        i, out currentSegment);

                    retMtbl.Lines.Add(
                        currentLine);

                    currentChars.Clear();
                }
                else
                {
                    var nextCharFont = GetNextCharStyle(
                        richTextBox, i,
                        out var backgroundColor,
                        out var foregroundColor);

                    if (currentChars.Any())
                    {
                        if (IsSameStyle(
                            currentSegment,
                            nextCharFont,
                            backgroundColor,
                            foregroundColor))
                        {
                            currentChars.Add(chr);
                        }
                        else
                        {
                            currentSegment.Text = new string(
                                currentChars.ToArray());

                            currentSegment.Length = currentChars.Count;

                            currentChars.Clear();
                            currentChars.Add(chr);
                            currentSegment = CreateSegment(i);

                            currentSegment.Font = nextCharFont;
                            currentSegment.BackgroundColor = backgroundColor;
                            currentSegment.ForegroundColor = foregroundColor;

                            currentLine.Segments.Add(
                                currentSegment);
                        }
                    }
                    else
                    {
                        currentSegment.Font = nextCharFont;
                        currentSegment.BackgroundColor = backgroundColor;
                        currentSegment.ForegroundColor = foregroundColor;

                        currentChars.Add(chr);
                    }
                }
            }

            currentSegment.Text = new string(currentChars.ToArray());
            currentSegment.Length = currentChars.Count;

            return retMtbl;
        }

        public bool IsSameStyle(
            RichTextBoxPseudoMarkupSegmentMtbl segment,
            IFontInfo font,
            Color backgroundColor,
            Color foregroundColor)
        {
            bool isSameStyle = IsSameStyle(segment.Font, font);

            isSameStyle = isSameStyle && segment.BackgroundColor == backgroundColor;
            isSameStyle = isSameStyle && segment.ForegroundColor == foregroundColor;

            return isSameStyle;
        }

        public bool IsSameStyle(
            IFontInfo currentFont,
            IFontInfo nextCharFont)
        {
            bool isSameStyle = currentFont.FontSize == nextCharFont.FontSize;
            isSameStyle = isSameStyle && currentFont.FontStyle == nextCharFont.FontStyle;
            isSameStyle = isSameStyle && currentFont.FontFamilyName == nextCharFont.FontFamilyName;

            return isSameStyle;
        }

        public FontInfoMtbl GetNextCharStyle(
            RichTextBox richTextBox,
            int newIdx,
            out Color backgroundColor,
            out Color foregroundColor)
        {
            richTextBox.Select(newIdx, 1);
            // string selectedText = richTextBox.SelectedText;
            var font = richTextBox.SelectionFont;
            backgroundColor = richTextBox.SelectionBackColor;
            foregroundColor = richTextBox.SelectionColor;

            var retFont = new FontInfoMtbl
            {
                FontSize = font.Size,
                FontStyle = font.Style,
                FontFamilyName = font.FontFamily.Name
            };

            return retFont;
        }

        private RichTextBoxPseudoMarkupSegmentMtbl CreateSegment(
            int startIdx) => new RichTextBoxPseudoMarkupSegmentMtbl
            {
                StartIdx = startIdx,
            };

        private RichTextBoxPseudoMarkupLineMtbl CreateLine(
            int startIdx,
            out RichTextBoxPseudoMarkupSegmentMtbl currentSegment)
        {
            currentSegment = CreateSegment(startIdx);

            var retLine = new RichTextBoxPseudoMarkupLineMtbl
            {
                Segments = new List<RichTextBoxPseudoMarkupSegmentMtbl>
                {
                    currentSegment
                }
            };

            return retLine;
        }
    }
}
