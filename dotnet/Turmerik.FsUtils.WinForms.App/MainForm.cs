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
            initialDirPath = args.FirstOrDefault();

            viewModel = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<MainFormViewModel>();

            viewModel.OnFsExplorerTabAdded += ViewModel_OnFsExplorerTabAdded;
            viewModel.OnFsExplorerTabRemoved += ViewModel_OnFsExplorerTabRemoved;

            eventsViewModel = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<MainFormEventsViewModel>();
            eventsViewModel.UILogMessageAdded += ViewModel_UILogMessageAdded;

            eventsViewModel.StatusStripTextChanged += ViewModel_StatusStripTextChanged;
            eventsViewModel.UpdateStatusStripText(string.Empty);
        }

        private void ViewModel_OnFsExplorerTabRemoved(KeyValuePair<int, FsExplorerViewModel> kvp)
        {
            this.tabControlFsExplorer.TabPages.RemoveAt(kvp.Key);
        }

        private void ViewModel_OnFsExplorerTabAdded(KeyValuePair<int, FsExplorerViewModel> kvp)
        {
            var control = new FsExplorerPageUserControl();
            control.Dock = DockStyle.Fill;

            control.SetViewModel(kvp.Value);
            var tabPage = new TabPage(kvp.Value.CurrentDirName);

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

        private void ViewModel_UILogMessageAdded(IUILogMessage uILogMessage)
        {
            uiMessagesUserControl.AddUILogMessage(uILogMessage);
        }
    }
}
