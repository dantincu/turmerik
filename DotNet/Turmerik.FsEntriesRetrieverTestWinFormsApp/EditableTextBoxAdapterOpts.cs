using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.FsEntriesRetrieverTestWinFormsApp
{
    public class EditableTextBoxAdapterOpts<TTextBox>
        where TTextBox : TextBoxBase
    {
        public TTextBox TextBox { get; set; }
        public string InitialText { get; set; }
        public Font DefaultFont { get; set; }
        public Color? DefaultForeColor { get; set; }
        public Func<Font, Font> EditModeFontFactory { get; set; }
        public Func<Color, Color> EditModeForeColorFactory { get; set; }
    }

    public class EditableTextBoxAdapterOpts : EditableTextBoxAdapterOpts<TextBox>
    {
    }

    public class EditableRichTextBoxAdapterOpts : EditableTextBoxAdapterOpts<RichTextBox>
    {
    }
}
