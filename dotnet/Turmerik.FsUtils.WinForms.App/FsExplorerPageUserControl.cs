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
                viewModel.NavigateToFolder(kvp.Value.Data.Path);
            }
            else
            {
                viewModel.NavigateToSubFolder(kvp.Value.Data.Name);
            }
        }

        private void FsFileEntriesGridUserControl_OnFsEntryNameDblClick(KeyValuePair<int, IFsEntriesDataGridRow> kvp)
        {
            viewModel.OpenFileInOSDefaultApp(kvp.Value.Data.Name);
        }

        public void SetViewModel(FsExplorerViewModel viewModel)
        {
            this.viewModel = viewModel;

            fsDirectoryEntriesGridUserControl.SetIsFoldersGrid(true);
            fsFileEntriesGridUserControl.SetIsFoldersGrid(false);

            textBoxCurrentDirPath.Text = viewModel.CurrentDirPath;
            textBoxVPath.Text = viewModel.CurrentDirVPath;

            if (!viewModel.IsRootFolder)
            {
                textBoxCurrentFolderName.Text = viewModel.CurrentDirName;
            }
            
            viewModel.FsEntriesRefreshed += ViewModel_FsEntriesRefreshed;
            UpdateFsEntryGrids();
        }

        private void UpdateFsEntryGrids()
        {
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
    }
}
