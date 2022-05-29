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

            fsDirectoryEntriesGridUserControl.OnFsEntryNameDblClick += FsDirectoryEntriesGridUserControl_OnFsEntryNameDblClick;
            fsFileEntriesGridUserControl.OnFsEntryNameDblClick += FsFileEntriesGridUserControl_OnFsEntryNameDblClick;
        }

        private void FsDirectoryEntriesGridUserControl_OnFsEntryNameDblClick(KeyValuePair<int, IFsEntriesDataGridRow> kvp)
        {
            if (viewModel.IsRootFolder)
            {
                viewModel.TryExecute("[FS Explorer] -> navigate to folder",
                    () => viewModel.NavigateToFolder(kvp.Value.Data.Path), true);
            }
            else
            {
                viewModel.TryExecute("[FS Explorer] -> navigate to sub folder",
                    () => viewModel.NavigateToSubFolder(kvp.Value.Data.Name), true);
            }
        }

        private void FsFileEntriesGridUserControl_OnFsEntryNameDblClick(KeyValuePair<int, IFsEntriesDataGridRow> kvp)
        {
            viewModel.TryExecute("[FS Explorer] -> open file in OS default app",
                () => viewModel.OpenFileInOSDefaultApp(kvp.Value.Data.Name), false);
        }

        public void SetViewModel(FsExplorerViewModel viewModel)
        {
            this.viewModel = viewModel;

            fsDirectoryEntriesGridUserControl.SetIsFoldersGrid(true);
            fsFileEntriesGridUserControl.SetIsFoldersGrid(false);
            
            viewModel.FsEntriesRefreshed += ViewModel_FsEntriesRefreshed;
            UpdateFsEntryGrids();
        }

        private void UpdateFsEntryGrids()
        {
            textBoxCurrentDirPath.Text = viewModel.CurrentDirPath;
            textBoxVPath.Text = viewModel.CurrentDirVPath;
            textBoxEditableDirPath.Text = viewModel.CurrentDirPath;

            if (!viewModel.IsRootFolder)
            {
                textBoxCurrentFolderName.Text = viewModel.CurrentDirName;
            }
            else
            {
                textBoxCurrentFolderName.Text = string.Empty;
            }

            fsDirectoryEntriesGridUserControl.ClearFsEntries();
            fsFileEntriesGridUserControl.ClearFsEntries();

            fsDirectoryEntriesGridUserControl.SetFsEntries(viewModel.FsDirectoryEntries);
            fsFileEntriesGridUserControl.SetFsEntries(viewModel.FsFileEntries);
        }

        private void ViewModel_FsEntriesRefreshed()
        {
            UpdateFsEntryGrids();
        }

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

        private void buttonCurrentDirGoBack_Click(object sender, EventArgs e)
        {

        }

        private void buttonCurrentDirGoUp_Click(object sender, EventArgs e)
        {

        }

        private void buttonCurrentDirGoForward_Click(object sender, EventArgs e)
        {

        }

        private void buttonCopyCurrentDirPathToClipboard_Click(object sender, EventArgs e)
        {
            viewModel.TryExecute("[FS Explorer] -> copy current dir path to clipboard",
                () =>
                {
                    Clipboard.SetText(textBoxCurrentDirPath.Text);
                    return new Tuple<bool, string>(true, null);
                },
                false);
        }

        private void buttonClearEditableDirPath_Click(object sender, EventArgs e)
        {
            textBoxEditableDirPath.Text = string.Empty;
        }

        private void buttonEditableDirPathGo_Click(object sender, EventArgs e)
        {
            viewModel.TryExecute("[FS Explorer] -> navigate to folder",
                () => viewModel.NavigateToFolder(textBoxEditableDirPath.Text, true), true);
        }
    }
}
