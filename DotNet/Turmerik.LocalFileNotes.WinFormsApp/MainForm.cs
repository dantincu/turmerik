using Microsoft.Extensions.DependencyInjection;
using Turmerik.Actions;
using Turmerik.LocalFileNotes.WinFormsApp.Dependencies;
using Turmerik.LocalFileNotes.WinFormsApp.ViewModels;
using Turmerik.UIActions;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Helpers;

namespace Turmerik.LocalFilesNotes.WinFormsApp
{
    public partial class MainForm : Form
    {
        private readonly IServiceProvider svcProv;

        private IMainFormVM mainFormVM;

        public MainForm()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            mainFormVM = svcProv.GetRequiredService<IMainFormVM>();

            InitializeComponent();
        }

        #region UI Event Handlers

        private void MainForm_Load(object sender, EventArgs e)
        {
            svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                ).DefaultStatusLabelOpts = new WinFormsStatusLabelActionComponentOpts
                {
                    StatusLabel = toolStripStatusLabelMain,
                    // DefaultForeColor = toolStripStatusLabelMain.ForeColor,
                    DefaultForeColor = Color.DarkSlateBlue,
                    WarningForeColor = Color.FromArgb(160, 96, 0),
                    ErrorForeColor = Color.DarkRed,
                };

            mainFormVM.OnMainFormLoaded();
        }

        #endregion UI Event Handlers
    }
}
