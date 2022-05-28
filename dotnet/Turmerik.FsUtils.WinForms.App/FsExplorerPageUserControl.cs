using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Turmerik.FsUtils.WinForms.App
{
    public partial class FsExplorerPageUserControl : UserControl
    {
        private FsExplorerViewModel viewModel;

        public FsExplorerPageUserControl()
        {
            InitializeComponent();
        }

        public void SetViewModel(FsExplorerViewModel viewModel)
        {
            this.viewModel = viewModel;
            fsDirectoryEntriesGridUserControl.SetIsFoldersGrid(true);

            textBoxCurrentDirPath.Text = viewModel.CurrentDirPath;
            textBoxVPath.Text = viewModel.CurrentDirVPath;
        }

        #region ONLY_FOR_TEST

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

        #endregion ONLY_FOR_TEST

        private void textBoxEditableDirPath_TextChanged(object sender, EventArgs e)
        {
            if (textBoxEditableDirPath.Text == textBoxCurrentDirPath.Text)
            {
                textBoxEditableDirPath.Font = new Font(
                    textBoxEditableDirPath.Font,
                    FontStyle.Italic);
            }
            else
            {
                textBoxEditableDirPath.Font = new Font(
                    textBoxEditableDirPath.Font,
                    FontStyle.Regular);
            }
        }
    }
}
