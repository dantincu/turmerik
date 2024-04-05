using MaterialSkin.Controls;
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Logging;
using Turmerik.Core.UIActions;
using Turmerik.Logging;
using Turmerik.LocalFileNotes.WinFormsApp.UserControls;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public partial class MainForm : MaterialForm
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IAppLogger logger;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;
        private readonly IWinFormsActionComponentCreator actionComponentCreator;
        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        private Action appRecoveryToolRequested;

        public MainForm()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                logger = svcProv.GetRequiredService<IAppLoggerCreator>().GetSharedAppLogger(GetType());
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
                actionComponentCreator = svcProv.GetRequiredService<IWinFormsActionComponentCreator>();
                actionComponent = actionComponentCreator.StatusLabel(GetType());
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
                actionComponentCreator.DefaultStatusLabelOpts = new WinFormsStatusLabelActionComponentOpts
                {
                    StatusLabel = toolStripStatusLabelMain,
                    DefaultForeColor = Color.Blue,
                    WarningForeColor = Color.FromArgb(255, 196, 0),
                    ErrorForeColor = Color.Red,
                };
            }
        }

        public event Action AppRecoveryToolRequested
        {
            add => appRecoveryToolRequested += value;
            remove => appRecoveryToolRequested -= value;
        }

        #region UI Event Handlers

        private void MainForm_Load(object sender, EventArgs e)
        {
            if (svcProvContnr.IsRegistered)
            {
                actionComponent.Execute(new WinFormsActionOpts<int>
                {
                    Action = () =>
                    {
                        return ActionResultH.Create(0);
                    },
                    OnAfterExecution = actionResult => actionResult.IsSuccess ? WinFormsMessageTuple.WithOnly("Welcome") : null
                });
            }
        }

        #endregion UI Event Handlers
    }
}
