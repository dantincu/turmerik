using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Core.Text;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class OpenMultipleLinksUC : UserControl
    {
        private const string EDGE_BROWSER_PATH = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";

        public OpenMultipleLinksUC()
        {
            InitializeComponent();
        }

        private void BtnOpenLinks_Click(object sender, EventArgs e)
        {
            var linksArr = textBoxLinks.Text.Split('\n').Select(
                s => s.Trim()).Where(s => !string.IsNullOrEmpty(s)).ToArray();

            foreach (var link in linksArr)
            {
                if (UriH.UriSchemeStartRegex.Match(link)?.Success == true)
                {
                    Process.Start(EDGE_BROWSER_PATH, link);
                }
            }
        }

        private void btnFixNewLines_Click(object sender, EventArgs e)
        {
            var lines = textBoxLinks.Text.Split(
                new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);

            string newText = string.Join(Environment.NewLine, lines);
            textBoxLinks.Text = newText;
        }
    }
}
