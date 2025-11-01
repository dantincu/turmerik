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

        public void SetScript(
            UrlScript urlScript)
        {
            this.urlScript = urlScript;
        }

        public void UpdateScript(
            UrlScript urlScript)
        {
            SetScript(urlScript);
            UpdateTextBoxScript(urlScript.Text!);
            this.labelIndex.Text = urlScript.Index.ToString();
        }

        public void Update(
            string url,
            string title)
        {
            UpdateScript(new UrlScript(urlScript)
            {
                Text = urlScript.Factory(
                    url, title)
            });
        }

        public void UpdateTextBoxScript(string text)
        {
            this.textBoxScript.Text = text;
        }

        public void FocusTextBox()
        {
            this.textBoxScript.Focus();
            this.textBoxScript.SelectAll();
        }

        public void ReleaseResources()
        {
            textBoxScriptKeyDown = null;
        }

        #region UI Event Handlers

        private void TextBoxScript_KeyDown(object sender, KeyEventArgs e)
        {
            textBoxScriptKeyDown?.Invoke(this, e, textBoxScript.Text);
        }

        #endregion UI Event Handlers
    }
}
