using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Utility.WinFormsApp.Services.FetchMultipleLinks;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class UrlScriptUC : UserControl
    {
        private UrlScript urlScript;
        private Action<UrlScriptUC, KeyEventArgs, string> textBoxScriptKeyDown;

        public UrlScriptUC()
        {
            InitializeComponent();
        }

        public UrlScript UrlScript => urlScript;

        public event Action<UrlScriptUC, KeyEventArgs, string> TextBoxScriptKeyDown
        {
            add => textBoxScriptKeyDown += value;
            remove => textBoxScriptKeyDown -= value;
        }

        public void UpdateScript(
            UrlScript urlScript,
            UrlScriptArgs args)
        {
            this.urlScript = urlScript;
            this.labelIndex.Text = urlScript.Index.ToString();
            UpdateTextBoxScriptText(args);
        }

        public void FocusTextBox()
        {
            this.richTextBoxScript.Focus();
            this.richTextBoxScript.SelectAll();
        }

        public void ReleaseResources()
        {
            textBoxScriptKeyDown = null;
        }

        public void UpdateTextBoxScriptText(
            UrlScriptArgs args)
        {
            this.richTextBoxScript.Clear();
            var output = urlScript.Factory(args);

            foreach (var textPart in output.TextParts)
            {
                WriteTextPart(textPart);
            }
        }

        private void WriteTextPart(
            UrlScriptTextPart textPart)
        {
            richTextBoxScript.SelectionFont = new(
                richTextBoxScript.Font,
                textPart.FontStyle);

            richTextBoxScript.SelectionColor = textPart.ForeColor ?? richTextBoxScript.ForeColor;
            richTextBoxScript.SelectionBackColor = textPart.BackColor ?? richTextBoxScript.BackColor;

            richTextBoxScript.AppendText(textPart.Text);
        }

        #region UI Event Handlers

        private void RichTextBoxScript_KeyDown(object sender, KeyEventArgs e)
        {
            textBoxScriptKeyDown?.Invoke(this, e, richTextBoxScript.Text);
        }

        #endregion UI Event Handlers
    }
}
