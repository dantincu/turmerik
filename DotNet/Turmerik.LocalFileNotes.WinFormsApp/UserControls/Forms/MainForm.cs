using MaterialSkin.Controls;
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Logging;
using Turmerik.Core.UIActions;
using Turmerik.Logging;
using Turmerik.LocalFileNotes.WinFormsApp.Settings.UI;
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
        private readonly IUISettingsRetriever uISettingsRetriever;
        private readonly IUIThemeRetriever uIThemeRetriever;
        private readonly IWinFormsActionComponentCreator actionComponentCreator;
        private readonly IWinFormsStatusLabelActionComponent actionComponent;
        private readonly ControlBlinkTimersManagerAdapterFactory controlBlinkTimersManagerAdapterFactory;

        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;

        private Action appRecoveryToolRequested;

        public MainForm()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                logger = svcProv.GetRequiredService<IAppLoggerCreator>().GetSharedAppLogger(GetType());
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
                uISettingsRetriever = svcProv.GetRequiredService<IUISettingsRetriever>();
                uIThemeRetriever = svcProv.GetRequiredService<IUIThemeRetriever>();
                actionComponentCreator = svcProv.GetRequiredService<IWinFormsActionComponentCreator>();
                actionComponent = actionComponentCreator.StatusLabel(GetType());
                controlBlinkTimersManagerAdapterFactory = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterFactory>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
                try
                {
                    uIThemeRetriever.Data.ActWith(uiTheme =>
                    {
                        /* uiTheme.ApplyBgColor([
                            this,
                            this.tabControlMain,
                            this.tabPageTextUtils,
                            this.textUtilsUC
                        ]); */

                        // textUtilsUC.AltRefUxControl.ForeColor = uiTheme.InfoIconColor;

                        actionComponentCreator.DefaultStatusLabelOpts = new WinFormsStatusLabelActionComponentOpts
                        {
                            StatusLabel = toolStripStatusLabelMain,
                            DefaultForeColor = uiTheme.DefaultForeColor,
                            WarningForeColor = uiTheme.WarningColor,
                            ErrorForeColor = uiTheme.ErrorColor,
                        };
                    });
                }
                catch (Exception ex)
                {
                    logger.Fatal(ex, "Could not retrieve the UI Theme");
                    MessageBox.Show($"An unhandled error has occurred: {ex}");

                    throw;
                }

                /* svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().AssignData(
                    controlBlinkTimersManagerAdapterFactory.Create(
                        new ControlBlinkTimersManagerAdapterOpts
                        {
                            RefUxControl = textUtilsUC.RefUxControl,
                        }));

                svcProv.GetRequiredService<ControlBlinkTimersManagerAltAdapterContainer>().AssignData(
                    controlBlinkTimersManagerAdapterFactory.Create(
                        new ControlBlinkTimersManagerAdapterOpts
                        {
                            RefUxControl = textUtilsUC.AltRefUxControl,
                        })); */

                var uISettings = uISettingsRetriever.Data;

                toolTipHintsOrchestrator = svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().AssignData(
                    svcProv.GetRequiredService<IToolTipHintsOrchestratorFactory>().Create(
                        new ToolTipHintsOrchestratorOpts
                        {
                            ToolTip = new ToolTip()
                        }));

                var toolTipDelays = uISettings.ToolTipDelays;

                var selectedToolTipDelay = toolTipDelays.FirstOrDefault(
                    delay => delay.IsSelected == true) ?? toolTipDelays.First();

                toolTipHintsOrchestrator.ToolTipDelay = selectedToolTipDelay;

                /* var comboBox = toolStripComboBoxShowHints.ComboBox;

                foreach (var delay in uISettings.ToolTipDelays)
                {
                    comboBox.Items.Add(
                        delay.Name);
                } */
            }
        }

        public event Action AppRecoveryToolRequested
        {
            add => appRecoveryToolRequested += value;
            remove => appRecoveryToolRequested -= value;
        }

        public void UnregisterContainers()
        {
            // svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().RemoveData();
            svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().RemoveData();
        }

        private void HideAllActionMenuStripItems()
        {
            /* menuStripMain.Items.Remove(
                textUtilsActionsToolStripMenuItem);

            menuStripMain.Items.Remove(
                textTransformActionsToolStripMenuItem); */
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
                        int delayIdx = uISettingsRetriever.Data.ToolTipDelays.FirstKvp(
                            (delay, idx) => delay.IsSelected == true).ActWith(kvp =>
                            {
                                if (kvp.Key >= 0)
                                {
                                    // toolStripComboBoxShowHints.ComboBox.SelectedIndex = kvp.Key;
                                }
                            }).Key;

                        toolTipHintsOrchestrator.UpdateToolTipsText(new());

                        HideAllActionMenuStripItems();
                        // menuStripMain.Items.Insert(0, textUtilsActionsToolStripMenuItem);

                        return ActionResultH.Create(delayIdx);
                    }
                });
            }
        }

        #endregion UI Event Handlers
    }
}
