using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Logging;
using Turmerik.Core.UIActions;
using Turmerik.Logging;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Utility.WinFormsApp.UserControls;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp
{
    public partial class MainForm : Form
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
            var refUxControl = textUtilsUC.RefUxControl;

            if (svcProvContnr.IsRegistered)
            {
                try
                {
                    uIThemeRetriever.Data.ActWith(uiTheme =>
                    {
                        uiTheme.ApplyBgColor([
                            this,
                            this.tabControlMain,
                            this.tabPageTextUtils,
                            this.textUtilsUC
                        ]);

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

                var uISettings = uISettingsRetriever.Data;

                svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().RegisterData(
                    controlBlinkTimersManagerAdapterFactory.Create(
                        new ControlBlinkTimersManagerAdapterOpts
                        {
                            RefUxControl = refUxControl,
                        }));

                toolTipHintsOrchestrator = svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().RegisterData(
                    svcProv.GetRequiredService<IToolTipHintsOrchestratorFactory>().Create(
                        new ToolTipHintsOrchestratorOpts
                        {
                            ToolTip = new ToolTip()
                        }));

                var toolTipDelays = uISettings.ToolTipDelays;

                var selectedToolTipDelay = toolTipDelays.FirstOrDefault(
                    delay => delay.IsSelected == true) ?? toolTipDelays.First();

                toolTipHintsOrchestrator.ToolTipDelay = selectedToolTipDelay;

                var comboBox = toolStripComboBoxShowHints.ComboBox;

                foreach (var delay in uISettings.ToolTipDelays)
                {
                    comboBox.Items.Add(
                        delay.Name);
                }
            }
        }

        #region UI Event Handlers

        private void ToolStripComboBoxShowHints_SelectedIndexChanged(object sender, EventArgs e)
        {
            var delaysCollctn = uISettingsRetriever.Data.ToolTipDelays;

            toolStripComboBoxShowHints.ComboBox.SelectedIndex.ActWith(
                selIdx =>
                {
                    if (selIdx >= 0 && selIdx < delaysCollctn.Count)
                    {
                        uISettingsRetriever.Update(mtbl => mtbl.ToolTipDelays.ActWith(collctn =>
                        {
                            for (int i = 0; i < collctn.Count; i++)
                            {
                                var delay = collctn[i];

                                delay.IsSelected = (selIdx == i).If(
                                    () => (bool?)true, () => null);
                            }
                        }));

                        var delay = delaysCollctn[selIdx];
                        toolTipHintsOrchestrator.ToolTipDelay = delay;
                    }
                });
        }

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
                                    toolStripComboBoxShowHints.ComboBox.SelectedIndex = kvp.Key;
                                }
                            }).Key;

                        toolTipHintsOrchestrator.UpdateToolTipsText(new ());
                        return ActionResultH.Create(delayIdx);
                    }
                });
            }
        }

        #endregion UI Event Handlers
    }
}
