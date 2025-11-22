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
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;
using Turmerik.WinForms.Helpers;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class GenerateClnblTypesUC : UserControl, IMainFormTabPageContentControl
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

        private readonly IWinFormsStatusLabelActionComponent actionComponent;
        private readonly IAppUserControl[] appUserControls;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        private bool splitContainerMainSplitterMoving;

        public GenerateClnblTypesUC()
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
            }

            InitializeComponent();

            appUserControls = [];

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                uISettingsData = uISettingsRetriever.Data;
            }
        }

        public void HandleKeyDown(KeyEventArgs e)
        {
        }

        private ToolTipHintsGroupOpts GetToolTipHintsGroupOpts()
        {
            var optsList = new List<ToolTipHintOpts>();

            return new ToolTipHintsGroupOpts
            {
                HintOpts = optsList,
            };
        }

        #region UI Event Handlers

        private void GenerateClnblTypesUC_Load(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(GenerateClnblTypesUC_Load),
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

                splitContainerMain.ApplySplitContainerWidthRatioIfFound(
                    uISettingsData, UserControlsH.SplitContainerWidthRatiosMapDefaultKey);

                return ActionResultH.Create(0);
            }
        });

        private void SplitContainerMain_SplitterMoved(object sender, SplitterEventArgs e)
        {
            splitContainerMainSplitterMoving = true;
        }

        private void SplitContainerMain_SplitterMoving(object sender, SplitterCancelEventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(SplitContainerMain_SplitterMoved),
            Action = () =>
            {
                if (splitContainerMainSplitterMoving)
                {
                    splitContainerMainSplitterMoving = false;

                    uISettingsRetriever.Update(mtbl =>
                        mtbl.UpdateSplitContainerWidthRatio(
                            splitContainerMain,
                            UserControlsH.SplitContainerWidthRatiosMapDefaultKey));
                }

                return ActionResultH.Create(0);
            }
        });

        #endregion UI Event Handlers
    }
}
