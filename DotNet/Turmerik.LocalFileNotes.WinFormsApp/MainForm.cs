using Microsoft.Extensions.DependencyInjection;
using Turmerik.Actions;
using Turmerik.LocalFileNotes.WinFormsApp.Dependencies;
using Turmerik.UIActions;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Helpers;

namespace Turmerik.LocalFilesNotes.WinFormsApp
{
    public partial class MainForm : Form
    {
        private readonly IServiceProvider svcProv;
        private readonly IWinFormsActionComponent actionComponent;

        public MainForm()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>().Create(GetType());

            InitializeComponent();
        }

        #region UI Event Handlers

        private void MainForm_Load(object sender, EventArgs e) => actionComponent.Execute(
            WinFormsH.ActionOpts(nameof(MainForm_Load),
                // () => throw new Exception(""),
                () => new ActionResult(),
                () => WinFormsMessageTuple.WithOnly()
                // ex => new WinFormsMessageTuple()));
                ));

        #endregion UI Event Handlers
    }
}
