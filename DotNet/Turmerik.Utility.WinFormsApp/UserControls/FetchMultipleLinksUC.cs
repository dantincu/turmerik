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
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Threading;
using Turmerik.Utility.WinFormsApp.Services.FetchMultipleLinks;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Ux;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class FetchMultipleLinksUC : UserControl, IMainFormTabPageContentControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IJsonConversion jsonConversion;

        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ISynchronizedValueAdapter<bool> controlsSynchronizer;
        private readonly IPropChangedEventAdapterFactory propChangedEventAdapterFactory;

        private readonly IUISettingsRetriever uISettingsRetriever;
        private readonly IUIThemeRetriever uIThemeRetriever;
        private readonly IAppSettings appSettings;
        private readonly IFetchMultipleLinksDataContainer fetchMultipleLinksDataContainer;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;
        private readonly IAppUserControl[] appUserControls;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        public FetchMultipleLinksUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                jsonConversion = svcProv.GetRequiredService<IJsonConversion>();

                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();

                controlsSynchronizer = svcProv.GetRequiredService<ISynchronizedValueAdapterFactory>().Create(
                    initialValue: true);

                propChangedEventAdapterFactory = svcProv.GetRequiredService<IPropChangedEventAdapterFactory>();

                uISettingsRetriever = svcProv.GetRequiredService<IUISettingsRetriever>();
                uIThemeRetriever = svcProv.GetRequiredService<IUIThemeRetriever>();
                appSettings = svcProv.GetRequiredService<IAppSettings>();
                fetchMultipleLinksDataContainer = svcProv.GetRequiredService<IFetchMultipleLinksDataContainer>();
            }

            InitializeComponent();

            appUserControls = [
                fetchMultipleLinksSetupuc1,
                fetchMultipleLinksMainuc1];

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                uISettingsData = uISettingsRetriever.Data;
            }
        }

        public void HandleKeyDown(KeyEventArgs e)
        {
            GetCurrentControl().HandleKeyDown(e);
        }

        private ToolTipHintsGroupOpts GetToolTipHintsGroupOpts()
        {
            var optsList = new List<ToolTipHintOpts>();

            return new ToolTipHintsGroupOpts
            {
                HintOpts = optsList,
            };
        }

        private void CheckIfIsSetUp()
        {
            bool isSetUp = fetchMultipleLinksDataContainer.LoadData().IsSetUp;
            fetchMultipleLinksMainuc1.Visible = isSetUp;
            fetchMultipleLinksSetupuc1.Visible = !isSetUp;

            if (isSetUp)
            {
                fetchMultipleLinksSetupuc1.Clear();
                fetchMultipleLinksMainuc1.LoadItemsList();
            }
        }

        private IAppUserControl GetCurrentControl() => appUserControls.Single(
            control => (control as UserControl)!.Visible);

        #region UI Event Handlers

        private void FetchMultipleLinksUC_Load(object sender, EventArgs e) => actionComponent?.Execute(
            new WinFormsActionOpts<int>
            {
                ActionName = nameof(FetchMultipleLinksUC_Load),
                Action = () =>
                {
                    controlBlinkTimersManagerAdapter = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().Data;

                    uIThemeData = uIThemeRetriever.Data.ActWith(uiTheme =>
                    {
                        uiTheme.ApplyBgColor([
                        ], uiTheme.InputBackColor);
                    });

                    appSettings.Data.ActWith(appSettingsData =>
                    {
                        controlsSynchronizer.Execute(false,
                            (wasEnabled) =>
                            {
                            });
                    });

                    toolTipHintsOrchestrator = svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().Data;

                    toolTipHintsOrchestrator.HintGroups.Add(
                        toolTipHintsGroup = GetToolTipHintsGroupOpts().HintsGroup());

                    CheckIfIsSetUp();
                    return ActionResultH.Create(0);
                },
            });

        private void FetchMultipleLinksMainuc1_ResetFinished() => actionComponent.Execute(
            new WinFormsActionOpts<int>
            {
                ActionName = nameof(FetchMultipleLinksMainuc1_ResetFinished),
                Action = () =>
                {
                    CheckIfIsSetUp();
                    return ActionResultH.Create(0);
                }
            });

        private void FetchMultipleLinksSetupuc1_SetupFinished() => actionComponent.Execute(
            new WinFormsActionOpts<int>
            {
                ActionName = nameof(FetchMultipleLinksSetupuc1_SetupFinished),
                Action = () =>
                {
                    CheckIfIsSetUp();
                    return ActionResultH.Create(0);
                }
            });

        #endregion UI Event Handlers
    }
}
