using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Turmerik.FsUtils.WinForms.App
{
    public partial class MainForm : Form
    {
        private readonly MainFormViewModel viewModel;

        public MainForm() : this(new string[0])
        {
        }

        public MainForm(string[] args)
        {
            this.viewModel = new MainFormViewModel(args);
            InitializeComponent();

            viewModel.UILogMessageAdded += ViewModel_UILogMessageAdded;
            viewModel.StatusStripTextChanged += ViewModel_StatusStripTextChanged;

            textBoxPath.Text = viewModel.CurrentDirPath;
            textBoxVPath.Text = viewModel.CurrentDirVPath;
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            TestUIMessages();
        }

        private void ViewModel_StatusStripTextChanged(string statusTripText)
        {
            this.statusStrip.Text = statusTripText;
        }

        private void ViewModel_UILogMessageAdded(IUILogMessage uILogMessage)
        {
            var userControl = new UILogMessageUserControl(uILogMessage);
            var size = uiMessagesFlowLayoutPanel.ClientSize;

            size = new Size(size.Width - 20, userControl.Height);
            userControl.Size = size;

            uiMessagesFlowLayoutPanel.Controls.Add(userControl);
        }

        private void TestUIMessages()
        {
            string testLongMsg = string.Join(" ", Enumerable.Range(1, 5).Select(
                i => "Action 1 success WAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAWA"));

            viewModel.TryExecute("Action 1", () => new Tuple<bool, string>(true, testLongMsg));
            viewModel.TryExecute("Action 1", () => new Tuple<bool, string>(true, null));
            viewModel.TryExecute("Action 1", () => null);
            viewModel.TryExecute("Action 1", () => new Tuple<bool, string>(false, "Action 1 error"));
            viewModel.TryExecute("Action 1", () => new Tuple<bool, string>(false, null));
            viewModel.TryExecute("Action 1", () => throw new InvalidOperationException("Invalid operation exception"));
        }
    }
}
