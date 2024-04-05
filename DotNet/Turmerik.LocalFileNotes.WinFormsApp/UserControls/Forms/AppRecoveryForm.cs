using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Logging;
using Turmerik.Ux;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.LocalFileNotes.WinFormsApp.UserControls.Forms
{
    public partial class AppRecoveryForm : Form
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IAppEnv appEnv;
        private readonly IAppLogger logger;
        private readonly IWinFormsMsgBoxActionComponent actionComponent;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private Action appRestartRequested;

        public AppRecoveryForm()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                appEnv = svcProv.GetRequiredService<IAppEnv>();
                logger = svcProv.GetRequiredService<IAppLoggerCreator>().GetSharedAppLogger(GetType());
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>().MsgBox(GetType());
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
                iconLabelOpenAppDataFolder.Text = MatUIIconUnicodesH.TextFormatting.FOLDER_OPEN;
                iconLabelOpenAppConfigFolder.Text = MatUIIconUnicodesH.TextFormatting.FOLDER_OPEN;
                iconLabelOpenAppLogsFolder.Text = MatUIIconUnicodesH.TextFormatting.FOLDER_OPEN;
            }
        }

        public event Action AppRestartRequested
        {
            add => appRestartRequested += value;
            remove => appRestartRequested -= value;
        }

        #region UI Event Handlers

        private void AppRecoveryForm_Load(
            object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
            {
                ActionName = nameof(AppRecoveryForm_Load),
                Action = () =>
                {
                    return ActionResultH.Create(0);
                }
            });

        private void ButtonRestartApp_Click(
            object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
            {
                ActionName = nameof(AppRecoveryForm_Load),
                Action = () =>
                {
                    appRestartRequested?.Invoke();
                    Close();
                    return ActionResultH.Create(0);
                }
            });

        private void ButtonExit_Click(
            object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
            {
                ActionName = nameof(AppRecoveryForm_Load),
                Action = () =>
                {
                    Close();
                    return ActionResultH.Create(0);
                },
            });

        private void IconLabelOpenAppDataFolder_Click(
            object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
            {
                ActionName = nameof(IconLabelOpenAppDataFolder_Click),
                Action = () =>
                {
                    ProcessH.OpenWithDefaultProgramIfNotNull(
                        appEnv.GetPath(AppEnvDir.Data));

                    return ActionResultH.Create(0);
                }
            });

        private void IconLabelOpenAppConfigFolder_Click(
            object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
            {
                ActionName = nameof(IconLabelOpenAppConfigFolder_Click),
                Action = () =>
                {
                    ProcessH.OpenWithDefaultProgramIfNotNull(
                        appEnv.GetPath(AppEnvDir.Config));

                    return ActionResultH.Create(0);
                }
            });

        private void IconLabelOpenAppLogsFolder_Click(
            object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
            {
                ActionName = nameof(IconLabelOpenAppLogsFolder_Click),
                Action = () =>
                {
                    ProcessH.OpenWithDefaultProgramIfNotNull(
                        appEnv.GetPath(AppEnvDir.Logs));

                    return ActionResultH.Create(0);
                }
            });

        #endregion UI Event Handlers
    }
}
