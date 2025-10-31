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

        public UrlScriptUC()
        {
            InitializeComponent();
        }

        public void SetScript(
            UrlScript urlScript)
        {
            this.urlScript = urlScript;
            this.textBoxScript.Text = urlScript.Text;
            this.labelIndex.Text = urlScript.Index.ToString();
        }

        public void FocusTextBox()
        {
            this.textBoxScript.Focus();
            this.textBoxScript.SelectAll();
        }
    }
}
