using System;
using System.Collections.Concurrent;
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

            fsDirectoryEntriesGridUserControl.OnGoBack += FsDirectoryEntriesGridUserControl_OnGoBack;
            fsDirectoryEntriesGridUserControl.OnGoForward += FsDirectoryEntriesGridUserControl_OnGoForward;
            fsDirectoryEntriesGridUserControl.OnGoToRoot += FsDirectoryEntriesGridUserControl_OnGoToRoot;
            fsDirectoryEntriesGridUserControl.OnGoToParent += FsDirectoryEntriesGridUserControl_OnGoToParent;
            fsDirectoryEntriesGridUserControl.OnFsEntryOpen += FsDirectoryEntriesGridUserControl_OnFsEntryNameDblClick;
            fsDirectoryEntriesGridUserControl.OnFsEntryOptsOpen += FsDirectoryEntriesGridUserControl_OnFsEntryOptsOpen;

            fsFileEntriesGridUserControl.OnGoBack += FsFileEntriesGridUserControl_OnGoBack;
            fsFileEntriesGridUserControl.OnGoForward += FsFileEntriesGridUserControl_OnGoForward;
            fsFileEntriesGridUserControl.OnGoToRoot += FsFileEntriesGridUserControl_OnGoToRoot;
            fsFileEntriesGridUserControl.OnGoToParent += FsFileEntriesGridUserControl_OnGoToParent;
            fsFileEntriesGridUserControl.OnFsEntryOpen += FsFileEntriesGridUserControl_OnFsEntryNameDblClick;
            fsFileEntriesGridUserControl.OnFsEntryOptsOpen += FsFileEntriesGridUserControl_OnFsEntryOptsOpen;

            SetNavigationPanelsVisibility(false);
        }

        private void FsFileEntriesGridUserControl_OnFsEntryOptsOpen(KeyValuePair<int, IFsEntriesDataGridRow> obj)
        {
            throw new NotImplementedException();
        }

        private void FsDirectoryEntriesGridUserControl_OnFsEntryOptsOpen(KeyValuePair<int, IFsEntriesDataGridRow> obj)
        {
            throw new NotImplementedException();
        }

        private void FsFileEntriesGridUserControl_OnGoForward(KeyValuePair<int, IFsEntriesDataGridRow> obj)
        {
            viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToHistoryForward,
                () => viewModel.NavigateToHistoryForward(), true);
        }

        private void FsFileEntriesGridUserControl_OnGoBack(KeyValuePair<int, IFsEntriesDataGridRow> obj)
        {
            viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToHistoryBack,
                () => viewModel.NavigateToHistoryBack(), true);
        }

        private void FsDirectoryEntriesGridUserControl_OnGoForward(KeyValuePair<int, IFsEntriesDataGridRow> obj)
        {
            viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToHistoryForward,
                () => viewModel.NavigateToHistoryForward(), true);
        }

        private void FsDirectoryEntriesGridUserControl_OnGoBack(KeyValuePair<int, IFsEntriesDataGridRow> obj)
        {
            viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToHistoryBack,
                () => viewModel.NavigateToHistoryBack(), true);
        }

        private void FsFileEntriesGridUserControl_OnGoToRoot(KeyValuePair<int, IFsEntriesDataGridRow> obj)
        {
            if (!viewModel.IsRootFolder)
            {
                viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToParentFolder,
                    () => viewModel.NavigateToRoot(), true);
            }
        }

        private void FsDirectoryEntriesGridUserControl_OnGoToRoot(KeyValuePair<int, IFsEntriesDataGridRow> obj)
        {
            if (!viewModel.IsRootFolder)
            {
                viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToParentFolder,
                    () => viewModel.NavigateToRoot(), true);
            }
        }

        private void FsFileEntriesGridUserControl_OnGoToParent(KeyValuePair<int, IFsEntriesDataGridRow> obj)
        {
            if (!viewModel.IsRootFolder)
            {
                viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToParentFolder,
                    () => viewModel.NavigateToParentFolder(), true);
            }
        }

        private void FsDirectoryEntriesGridUserControl_OnGoToParent(KeyValuePair<int, IFsEntriesDataGridRow> obj)
        {
            if (!viewModel.IsRootFolder)
            {
                viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToParentFolder,
                    () => viewModel.NavigateToParentFolder(), true);
            }
        }

        private void FsDirectoryEntriesGridUserControl_OnFsEntryNameDblClick(KeyValuePair<int, IFsEntriesDataGridRow> kvp)
        {
            if (viewModel.IsRootFolder)
            {
                viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToFolder,
                    () => viewModel.NavigateToFolder(kvp.Value.Data.Path), true);
            }
            else
            {
                viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToSubFolder,
                    () => viewModel.NavigateToSubFolder(kvp.Value.Data.Name), true);
            }
        }

        private void FsFileEntriesGridUserControl_OnFsEntryNameDblClick(KeyValuePair<int, IFsEntriesDataGridRow> kvp)
        {
            viewModel.TryExecute(FsExplorerViewModel.ActionNames.OpenFileInOSDefaultApp,
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
                textBoxCurrentDirName.Text = viewModel.CurrentDirName;
            }
            else
            {
                textBoxCurrentDirName.Text = string.Empty;
            }

            fsDirectoryEntriesGridUserControl.ClearFsEntries();
            fsFileEntriesGridUserControl.ClearFsEntries();

            fsDirectoryEntriesGridUserControl.SetFsEntries(viewModel.FsDirectoryEntries);
            fsFileEntriesGridUserControl.SetFsEntries(viewModel.FsFileEntries);
        }

        private void NavigateToPath(string folderPath, bool normalizePath = true)
        {
            string errorMessage = null;

            if (normalizePath && string.IsNullOrEmpty(folderPath))
            {
                var result = viewModel.FsPathNormalizer.TryNormalizePath(folderPath);

                if (result.IsValid)
                {
                    if (result.IsAbsUri == true)
                    {
                        errorMessage = "Path must not be an URI";
                    }
                    else if (result.IsRooted)
                    {
                        folderPath = result.NormalizedPath;
                    }
                    else
                    {
                        errorMessage = "Path must be rooted";
                    }
                }
                else
                {
                    errorMessage = "Path is invalid";
                }
            }

            if (errorMessage == null)
            {
                viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToFolder,
                    () => viewModel.NavigateToFolder(folderPath), true);
            }
            else
            {
                viewModel.EventsViewModel.AddUIErrMsg(errorMessage, null, true);
            }
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

        private void ButtonCurrentDirGoBack_Click(object sender, EventArgs e)
        {
            viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToHistoryBack,
                () => viewModel.NavigateToHistoryBack(), true);
        }

        private void ButtonCurrentDirGoUp_Click(object sender, EventArgs e)
        {
            if (!viewModel.IsRootFolder)
            {
                viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToParentFolder,
                    () => viewModel.NavigateToParentFolder(), true);
            }
        }

        private void ButtonCurrentDirGoForward_Click(object sender, EventArgs e)
        {
            viewModel.TryExecute(FsExplorerViewModel.ActionNames.NavigateToHistoryForward,
                () => viewModel.NavigateToHistoryForward(), true);
        }

        private void ButtonCopyCurrentDirPathToClipboard_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(textBoxCurrentDirPath.Text))
            {
                viewModel.TryExecute(FsExplorerViewModel.ActionNames.CopyCurrentDirPathToClipboard,
                () =>
                {
                    Clipboard.SetText(textBoxCurrentDirPath.Text);
                    return new Tuple<bool, string>(true, null);
                },
                false);
            }
        }

        private void ButtonCopyEditableDirPathToClipboard_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(textBoxEditableDirPath.Text))
            {
                viewModel.TryExecute(FsExplorerViewModel.ActionNames.CopyEditableDirPathToClipboard,
                    () =>
                    {
                        Clipboard.SetText(textBoxEditableDirPath.Text);
                        return new Tuple<bool, string>(true, null);
                    },
                    false);
            }
        }

        private void buttonCopyCurrentFolderNameToClipboard_Click(object sender, EventArgs e)
        {
            if (!viewModel.IsRootFolder && !string.IsNullOrEmpty(textBoxCurrentDirName.Text))
            {
                viewModel.TryExecute(FsExplorerViewModel.ActionNames.CopyCurrentDirNameToClipboard,
                    () =>
                    {
                        Clipboard.SetText(textBoxCurrentDirName.Text);
                        return new Tuple<bool, string>(true, null);
                    },
                    false);
            }
        }

        private void ButtonClearEditableDirPath_Click(object sender, EventArgs e)
        {
            textBoxEditableDirPath.Text = string.Empty;
        }

        private void buttonEditableDirPathUndoChanges_Click(object sender, EventArgs e)
        {
            textBoxEditableDirPath.Text = textBoxCurrentDirPath.Text;
        }

        private void textBoxEditableDirPath_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Escape)
            {
                textBoxEditableDirPath.Text = textBoxCurrentDirPath.Text;
            }
        }

        private void ButtonEditableDirPathGo_Click(object sender, EventArgs e)
        {
            string folderPath = textBoxEditableDirPath.Text;
            NavigateToPath(folderPath);
        }

        private void TextBoxCurrentDirPath_MouseUp(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
            {
                groupBoxEditableDirPath.Visible = !groupBoxEditableDirPath.Visible;
            }
        }

        private void ButtonReloadCurrentDirPath_Click(object sender, EventArgs e)
        {
            viewModel.TryExecute(FsExplorerViewModel.ActionNames.ReloadToFolder,
                () => viewModel.ReloadCurrentFolder(), true);
        }

        private void textBoxCurrentDirName_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
            {
                bool show = !expandCollapseNavigationPanelsUserControl.IsExpanded;
                SetNavigationPanelsVisibility(show);
            }
        }

        private void ExpandCollapseNavigationPanelsUserControl_StateChanged(bool isExpanded)
        {
            SetNavigationPanelsVisibility(isExpanded);
        }

        private void SetNavigationPanelsVisibility(bool show)
        {
            groupBoxPath.Visible = show;

            groupBoxVPath.Visible = show;
            groupBoxEditableDirPath.Visible = show;
        }
    }
}
