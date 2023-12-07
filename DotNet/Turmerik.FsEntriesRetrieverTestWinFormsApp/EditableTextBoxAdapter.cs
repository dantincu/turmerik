using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.FsEntriesRetrieverTestWinFormsApp
{
    public class EditableTextBoxAdapter<TTextBox>
        where TTextBox : TextBoxBase
    {
        private readonly Font defaultFont;
        private readonly Color defaultForeColor;

        private readonly Font editModeFont;
        private readonly Color editModeForeColor;

        private string text;
        private bool editMode;

        private Action<string> textUpdated;

        public EditableTextBoxAdapter(
            EditableTextBoxAdapterOpts<TTextBox> opts)
        {
            TextBox = opts.TextBox ?? throw new ArgumentNullException(
                nameof(opts.TextBox));

            this.text = opts.InitialText ?? TextBox.Text;
            this.defaultFont = opts.DefaultFont ?? TextBox.Font;

            this.editModeFont = opts.EditModeFontFactory.FirstNotNull(
                font => new Font(font, font.Style | FontStyle.Italic)).Invoke(
                    this.defaultFont);

            this.defaultForeColor = opts.DefaultForeColor ?? TextBox.ForeColor;
            this.editModeForeColor = opts.EditModeForeColorFactory(defaultForeColor);

            TextBox.KeyUp += TextBox_KeyUp;
            TextBox.TextChanged += TextBox_TextChanged;

            if (opts.InitialText != null )
            {
                SetText(opts.InitialText);
            }
            else
            {
                this.text = TextBox.Text;
            }
        }

        public TTextBox TextBox { get; }
        public string Text => text;

        public event Action<string> TextUpdated
        {
            add => textUpdated += value;
            remove => textUpdated -= value;
        }

        public void SetText(string text)
        {
            this.text = text;
            this.TextBox.Text = text;
            ToggleEditMode(false);
            this.textUpdated?.Invoke(this.text);
        }

        private void ToggleEditMode(
            bool activateEditMode)
        {
            this.editMode = activateEditMode;

            TextBox.Font = activateEditMode switch
            {
                true => this.editModeFont,
                false => this.defaultFont
            };

            TextBox.ForeColor = activateEditMode switch
            {
                true => this.editModeForeColor,
                false => this.defaultForeColor
            };
        }

        #region UI Event Handlers

        private void TextBox_TextChanged(object? sender, EventArgs e)
        {
            bool wasEdited = this.editMode;
            var isEdited = this.editMode = this.text != this.TextBox.Text;

            if (wasEdited != isEdited)
            {
                ToggleEditMode(isEdited);
            }
        }

        private void TextBox_KeyUp(object? sender, KeyEventArgs e)
        {
            switch (e.KeyCode)
            {
                case Keys.Enter:
                    this.text = this.TextBox.Text;
                    ToggleEditMode(false);

                    this.textUpdated?.Invoke(this.text);
                    break;
                case Keys.Escape:
                    this.TextBox.Text = this.text;
                    ToggleEditMode(false);
                    break;
            }
        }

        #endregion UI Event Handlers
    }

    public class EditableTextBoxAdapter : EditableTextBoxAdapter<TextBox>
    {
        public EditableTextBoxAdapter(
            EditableTextBoxAdapterOpts opts) : base(opts)
        {
        }
    }

    public class EditableRichTextBoxAdapter : EditableTextBoxAdapter<RichTextBox>
    {
        public EditableRichTextBoxAdapter(
            EditableRichTextBoxAdapterOpts opts) : base(opts)
        {
        }
    }
}
