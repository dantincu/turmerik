using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Logging;
using Turmerik.Core.UIActions;
using Turmerik.Logging;
using Turmerik.Utility.WinFormsApp.Services;
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
        private readonly IContinuousEventHandlerFactory continuousEventHandlerFactory;

        private readonly IMainFormTabPageContentControl[] tabPageContentControlsArr;
        private readonly IContinuousEventHandler<EventArgs> formMoveEventHandler;

        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private CustomCommandService customCommandService;

        private Action appRecoveryToolRequested;
        private bool formShown;

        public MainForm()
        {
            this.KeyPreview = true; // Form will get key events before controls
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
                customCommandService = svcProv.GetRequiredService<CustomCommandService>();
                continuousEventHandlerFactory = svcProv.GetRequiredService<IContinuousEventHandlerFactory>();

                formMoveEventHandler = continuousEventHandlerFactory.Create<EventArgs>(new()
                {
                    TargetControl = this,
                    Handler = args => actionComponent.Execute(new WinFormsActionOpts<int>
                    {
                        ActionName = string.Join(".",
                            nameof(formMoveEventHandler),
                            nameof(formMoveEventHandler.EventFired)),
                        Action = () =>
                        {
                            uISettingsRetriever.Update(mtbl =>
                            {
                                mtbl.MainFormLocation = this.Location;
                            });

                            return ActionResultH.Create(0);
                        }
                    })
                });
            }

            InitializeComponent();

            tabPageContentControlsArr = [
                textUtilsUC,
                textTransformUC,
                openMultipleLinksuc1,
                fetchMultipleLinksuc1];

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
                            this.textUtilsUC,
                            this.tabPageTextTransform,
                            this.textTransformUC,
                            this.tabPageOpenMultipleLinks,
                            this.openMultipleLinksuc1,
                            this.tabPageFetchMultipleLinks,
                            this.fetchMultipleLinksuc1
                        ]);

                        uiTheme.ApplyBgColor([
                            this.textBoxCustomCommand,
                        ], uiTheme.InputBackColor);

                        textUtilsUC.AltRefUxControl.ForeColor = uiTheme.InfoIconColor;

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

                svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().AssignData(
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
                        }));

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

                var comboBox = toolStripComboBoxShowHints.ComboBox;

                foreach (var delay in uISettings.ToolTipDelays)
                {
                    comboBox.Items.Add(
                        delay.Name);
                }

                if (uISettings.MainFormSize.HasValue)
                {
                    this.Size = uISettings.MainFormSize.Value;
                }
            }
        }

        public event Action AppRecoveryToolRequested
        {
            add => appRecoveryToolRequested += value;
            remove => appRecoveryToolRequested -= value;
        }

        public void UnregisterContainers()
        {
            svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().RemoveData();
            svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().RemoveData();
        }

        private void HideAllActionMenuStripItems()
        {
            menuStripMain.Items.Remove(
                textUtilsActionsToolStripMenuItem);

            menuStripMain.Items.Remove(
                textTransformActionsToolStripMenuItem);
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

                        toolTipHintsOrchestrator.UpdateToolTipsText(new());

                        HideAllActionMenuStripItems();
                        menuStripMain.Items.Insert(0, textUtilsActionsToolStripMenuItem);

                        return ActionResultH.Create(delayIdx);
                    }
                });
            }
        }

        private void StartAppRecoveryToolToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (svcProvContnr.IsRegistered)
            {
                actionComponent.Execute(new WinFormsActionOpts<int>
                {
                    Action = () =>
                    {
                        appRecoveryToolRequested?.Invoke();
                        Close();
                        return ActionResultH.Create(0);
                    }
                });
            }
        }

        private void GoToWebResourceUrlToolStripMenuItem_Click(object sender, EventArgs e)
        {
            textUtilsUC.GoToWebResourceUrlTool();
        }

        private void GoToMarkdownSourceTextToolStripMenuItem_Click(object sender, EventArgs e)
        {
            textUtilsUC.GoToMarkdownSourceText();
        }

        private void GoToMarkdownResultTextToolStripMenuItem_Click(object sender, EventArgs e)
        {
            textUtilsUC.GoToMarkdownResultText();
        }

        private void GoToTextTransformSrcTextBoxToolStripMenuItem_Click(object sender, EventArgs e)
        {
            textTransformUC.GoToSrcTextBox();
        }

        private void TabControlMain_SelectedIndexChanged(object sender, EventArgs e)
        {
            switch (tabControlMain.SelectedIndex)
            {
                case 0:
                    HideAllActionMenuStripItems();
                    menuStripMain.Items.Insert(0, textUtilsActionsToolStripMenuItem);
                    break;
                case 1:
                    HideAllActionMenuStripItems();
                    menuStripMain.Items.Insert(0, textTransformActionsToolStripMenuItem);
                    break;
                default:
                    menuStripMain.Items.Remove(textUtilsActionsToolStripMenuItem);
                    menuStripMain.Items.Remove(textTransformActionsToolStripMenuItem);
                    break;
            }


        }

        private void TextBoxCustomCommand_KeyPress(object sender, KeyPressEventArgs e)
        {
        }

        private void TextBoxCustomCommand_KeyDown(object sender, KeyEventArgs e)
        {
            if (!e.Control && !e.Shift && !e.Alt && e.KeyCode == Keys.Enter)
            {
                actionComponent.Execute(new WinFormsActionOpts<int>
                {
                    ActionName = string.Join(".",
                        nameof(customCommandService),
                        nameof(customCommandService.Execute)),
                    OnBeforeExecution = () => WinFormsMessageTuple.WithOnly("Executing custom command"),
                    OnAfterExecution = (result) => result.IsSuccess switch
                    {
                        false => null!,
                        true => WinFormsMessageTuple.WithOnly("Executed custom command")
                    },
                    Action = () =>
                    {
                        customCommandService.Execute(
                            textBoxCustomCommand.Text);

                        return ActionResultH.Create(0);
                    }
                });
            }
        }

        private void MainForm_KeyUp(object sender, KeyEventArgs e)
        {
        }

        private void MainForm_KeyDown(object sender, KeyEventArgs e)
        {
            bool handled = false;

            if (e.Control && e.Shift && !e.Alt)
            {
                switch (e.KeyCode)
                {
                    case Keys.D1:
                        this.tabControlMain.SelectedIndex = 0;
                        handled = true;
                        break;
                    case Keys.D2:
                        this.tabControlMain.SelectedIndex = 1;
                        handled = true;
                        break;
                    case Keys.D3:
                        this.tabControlMain.SelectedIndex = 2;
                        handled = true;
                        break;
                    case Keys.D4:
                        this.tabControlMain.SelectedIndex = 3;
                        handled = true;
                        break;
                    case Keys.F12:
                        textBoxCustomCommand.Focus();
                        handled = true;
                        break;
                }
            }

            if (!handled)
            {
                tabPageContentControlsArr[tabControlMain.SelectedIndex].HandleKeyDown(e);
            }
        }

        private void MainForm_ResizeEnd(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(MainForm_ResizeEnd),
            Action = () =>
            {
                if (formShown)
                {
                    uISettingsRetriever.Update(mtbl =>
                    {
                        mtbl.MainFormSize = this.Size;
                    });
                }

                return ActionResultH.Create(0);
            }
        });

        private void MainForm_Move(object sender, EventArgs e)
        {
            formMoveEventHandler.EventFired(e);
        }

        private void MainForm_Shown(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(MainForm_Shown),
            Action = () =>
            {
                var uISettings = uISettingsRetriever.Data;

                if (uISettings.MainFormLocation.HasValue)
                {
                    this.Location = uISettings.MainFormLocation.Value;
                }

                formShown = true;
                return ActionResultH.Create(0);
            }
        });

        #endregion UI Event Handlers
    }
}
