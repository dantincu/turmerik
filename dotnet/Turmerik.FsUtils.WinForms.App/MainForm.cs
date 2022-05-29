using Microsoft.Extensions.DependencyInjection;
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
        private readonly MainFormEventsViewModel eventsViewModel;

        private readonly string initialDirPath;

        public MainForm() : this(new string[0])
        {
        }

        public MainForm(string[] args)
        {
            InitializeComponent();
            initialDirPath = args.FirstOrDefault() ?? string.Empty;

            viewModel = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<MainFormViewModel>();

            viewModel.OnFsExplorerTabAdded += ViewModel_OnFsExplorerTabAdded;
            viewModel.OnFsExplorerTabRemoved += ViewModel_OnFsExplorerTabRemoved;
            viewModel.OnFsExplorerTabPageChanged += ViewModel_OnFsExplorerTabPageChanged;

            eventsViewModel = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<MainFormEventsViewModel>();
            eventsViewModel.UILogMessageAdded += ViewModel_UILogMessageAdded;

            eventsViewModel.StatusStripTextChanged += ViewModel_StatusStripTextChanged;
            eventsViewModel.UpdateStatusStripText(string.Empty);
        }

        private KeyValuePair<int, FsExplorerViewModel> SelectedTabPage { get; set; }

        private void ViewModel_OnFsExplorerTabPageChanged(KeyValuePair<int, FsExplorerViewModel> kvp)
        {
            SelectedTabPage = kvp;
        }

        private void ViewModel_OnFsExplorerTabRemoved(KeyValuePair<int, FsExplorerViewModel> kvp)
        {
            this.tabControlFsExplorer.TabPages.RemoveAt(kvp.Key);
        }

        private void ViewModel_OnFsExplorerTabAdded(KeyValuePair<int, FsExplorerViewModel> kvp)
        {
            var control = new FsExplorerPageUserControl();
            control.Dock = DockStyle.Top;

            control.AutoScroll = true;
            control.SetViewModel(kvp.Value);

            control.Height = 2000;

            var tabPage = new TabPage(kvp.Value.CurrentDirName);
            tabPage.AutoScroll = true;

            kvp.Value.CurrentFsDirNameChanged += () =>
            {
                tabPage.Text = kvp.Value.CurrentDirName;
            };

            tabPage.Controls.Add(control);
            this.tabControlFsExplorer.TabPages.Insert(kvp.Key, tabPage);
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            viewModel.AddFsExplorerTabPage(initialDirPath);
        }

        private void ViewModel_StatusStripTextChanged(string statusTripText)
        {
            this.toolStripStatusLabel.Text = statusTripText;
        }

        private void ViewModel_UILogMessageAdded(IUILogMessage uILogMessage, bool showMessageBox)
        {
            uiMessagesUserControl.AddUILogMessage(uILogMessage);

            if (showMessageBox)
            {
                switch (uILogMessage.Level)
                {
                    case UILogMessageLevel.Information:
                        ShowMessageBox(uILogMessage, MessageBoxIcon.Information);
                        break;
                    case UILogMessageLevel.Warning:
                        ShowMessageBox(uILogMessage, MessageBoxIcon.Warning);
                        break;
                    case UILogMessageLevel.Error:
                        ShowMessageBox(uILogMessage, MessageBoxIcon.Error);
                        break;
                    default:
                        throw new NotSupportedException();
                }
            }
        }

        private void ToolStripMenuItemAddNewTab_Click(object sender, EventArgs e)
        {
            var kvp = viewModel.AddFsExplorerTabPage(string.Empty);
            tabControlFsExplorer.SelectedIndex = kvp.Key;
        }

        private void ToolStripMenuItemCloseCurrentTab_Click(object sender, EventArgs e)
        {
            if (SelectedTabPage.Value != null)
            {
                viewModel.RemoveFsExplorerTabPage(SelectedTabPage.Value.Uuid);
            }
        }

        private void TabControlFsExplorer_SelectedIndexChanged(object sender, EventArgs e)
        {
            viewModel.UpdateFsExplorerTabPageIndex(tabControlFsExplorer.SelectedIndex);
        }

        private void toolStripMenuItemGoToRoot_Click(object sender, EventArgs e)
        {
            viewModel.NavigateCurrentToRoot();
        }

        private void ShowMessageBox(
            IUILogMessage uILogMessage,
            MessageBoxIcon messageBoxIcon)
        {
            MessageBox.Show(
                uILogMessage.Message,
                uILogMessage.Level.ToString(),
                MessageBoxButtons.OK,
                messageBoxIcon);
        }
    }
}
