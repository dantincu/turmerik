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
using Turmerik.LocalFileNotes.WinFormsApp.Pages;
using Turmerik.LocalFileNotes.WinFormsApp.UserControls.Pages;
using Turmerik.LocalFileNotes.WinFormsApp.Pages.Impl;
using Turmerik.LocalFileNotes.WinFormsApp.UserControls.SidePanels;

namespace Turmerik.LocalFileNotes.WinFormsApp.UserControls.Forms
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
        private readonly Dictionary<AppPageIcon, Bitmap> tabPageIconsMap;

        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;

        private Action appRecoveryToolRequested;

        private List<AppPageTupleBase> appPageTuplesList;
        private AppPageTupleBase currentAppPageTuple;

        private FileExplorerHcyUC fileExplorerHcyUC;
        private NoteExplorerHcyUC noteExplorerHcyUC;
        private NoteFileExplorerHcyUC noteFileExplorerHcyUC;

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

            appPageTuplesList = new List<AppPageTupleBase>();
            tabPageIconsMap = AppPageH.GetMainFormTabPageIconsMap();

            var imageList = new ImageList();
            imageList.ImageSize = new Size(24, 24);

            foreach (var kvp in tabPageIconsMap)
            {
                imageList.Images.Add(
                    kvp.Value);
            }

            tabControlMain.ImageList = imageList;

            fileExplorerHcyUC = new FileExplorerHcyUC();
            noteExplorerHcyUC = new NoteExplorerHcyUC();
            noteFileExplorerHcyUC = new NoteFileExplorerHcyUC();

            fileExplorerHcyUC.Dock = DockStyle.Fill;
            noteExplorerHcyUC.Dock = DockStyle.Fill;
            noteFileExplorerHcyUC.Dock = DockStyle.Fill;

            if (svcProvContnr.IsRegistered)
            {
                try
                {
                    uIThemeRetriever.Data.ActWith(uiTheme =>
                    {
                        uiTheme.ApplyBgColor([
                            this,
                            this.tabControlMain,
                        ]);

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
                            // RefUxControl = textUtilsUC.RefUxControl,
                        }));

                svcProv.GetRequiredService<ControlBlinkTimersManagerAltAdapterContainer>().AssignData(
                    controlBlinkTimersManagerAdapterFactory.Create(
                        new ControlBlinkTimersManagerAdapterOpts
                        {
                            // RefUxControl = textUtilsUC.AltRefUxControl,
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

                var comboBox = toolStripComboBoxShowHints.ComboBox;

                foreach (var delay in uISettings.ToolTipDelays)
                {
                    comboBox.Items.Add(
                        delay.Name);
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
            /* svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().RemoveData(); */
            svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().RemoveData();
        }

        private void HideAllActionMenuStripItems()
        {
            /* menuStripMain.Items.Remove(
                textUtilsActionsToolStripMenuItem);

            menuStripMain.Items.Remove(
                textTransformActionsToolStripMenuItem); */
        }

        private void OpenHomePage() => OpenInNewTab(new AppPageOpts
        {
            ResourceType = AppPageResourceType.Home,
            Title = "Home"
        });

        private void OpenInNewTab(AppPageOpts opts) => actionComponent.Execute(
            new WinFormsActionOpts<AppPageTupleBase>
            {
                ActionName = nameof(OpenInNewTab),
                Action = () =>
                {
                    var appPageTuple = CreateAppPageTuple(opts);
                    appPageTuplesList.Add(appPageTuple);

                    tabControlMain.TabPages.Add(
                        appPageTuple.TabPageControl);

                    UpdateCurrentTab(opts, appPageTuple);
                    return ActionResultH.Create(appPageTuple);
                }
            });

        private void OpenInCurrentTab(AppPageOpts opts) => actionComponent.Execute(
            new WinFormsActionOpts<AppPageTupleBase>
            {
                ActionName = nameof(OpenInNewTab),
                Action = () =>
                {
                    var currentTabPageIdx = appPageTuplesList.IndexOf(
                        currentAppPageTuple);

                    var appPageTuple = CreateAppPageTuple(
                        opts, currentAppPageTuple.TabPageControl);

                    currentAppPageTuple.Dispose();
                    appPageTuplesList[currentTabPageIdx] = appPageTuple;

                    UpdateCurrentTab(opts, appPageTuple);
                    return ActionResultH.Create(appPageTuple);
                }
            });

        private void UpdateCurrentTab(
            AppPageOpts opts,
            AppPageTupleBase appPageTuple)
        {
            var sidePanelUC = UpdateSidePanelUC(
                appPageTuple.GetAppPageData().SidePanel);

            sidePanelUC?.SetIdnf(opts.Idnf);
            currentAppPageTuple = appPageTuple;
        }

        private void CloseCurrentTab() => actionComponent.Execute(
            new WinFormsActionOpts<int>
            {
                ActionName = nameof(CloseCurrentTab),
                Action = () =>
                {
                    currentAppPageTuple.TabPageControl.Controls.Clear();

                    tabControlMain.TabPages.Remove(
                        currentAppPageTuple.TabPageControl);

                    currentAppPageTuple.Dispose();
                    return ActionResultH.Create(0);
                }
            }).ActWith(actionResult => (actionResult.IsSuccess && appPageTuplesList.Count == 0).ActIf(
                () => OpenHomePage()));

        private AppPageTupleBase CreateAppPageTuple(
            AppPageOpts opts,
            TabPage tabPage = null)
        {
            AppPageTupleBase appPageTuple = opts.ResourceType switch
            {
                AppPageResourceType.Home => new AppHomePage().CreateTuple(
                    new AppHomePageUC(),
                    opts.Title,
                    tabPage),
                AppPageResourceType.FileExplorer => new AppFileExplorerPage(
                    opts.Idnf).CreateTuple(
                        new AppFileExplorerUC(),
                        opts.Title,
                        tabPage),
                _ => throw new ArgumentException(nameof(opts.ResourceType))
            };

            var appPageUC = appPageTuple.GetAppPageUC();
            appPageUC.OnCloseCurrentTab += CloseCurrentTab;
            appPageUC.OnOpenPageInNewTab += OpenInCurrentTab;
            appPageUC.OnOpenPageInCurrentTab += OpenInCurrentTab;

            return appPageTuple;
        }

        private void DetachSidePanelUC()
        {
            splitContainerMain.Panel1.Controls.Clear();
            splitContainerMain.Panel1Collapsed = true;
        }

        private UserControl? GetSidePanelUC(
            AppPageSidePanel appPageSidePanel) => appPageSidePanel switch
            {
                AppPageSidePanel.FileExplorer => fileExplorerHcyUC,
                AppPageSidePanel.NoteExplorer => noteExplorerHcyUC,
                AppPageSidePanel.NoteFileExplorer => noteFileExplorerHcyUC,
                _ => null
            };

        private ISidePanelUC? UpdateSidePanelUC(
            AppPageSidePanel appPageSidePanel,
            bool detachFirst = true)
        {
            if (detachFirst)
            {
                DetachSidePanelUC();
            }

            var sidePanelUC = GetSidePanelUC(appPageSidePanel);

            if (sidePanelUC != null)
            {
                splitContainerMain.Panel1.Controls.Add(sidePanelUC);
                splitContainerMain.Panel1Collapsed = false;
            }

            return sidePanelUC as ISidePanelUC;
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
                        // menuStripMain.Items.Insert(0, textUtilsActionsToolStripMenuItem);

                        if (tabControlMain.TabPages.Count == 0)
                        {
                            OpenHomePage();
                        }

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

        private void TabControlMain_SelectedIndexChanged(
            object sender, EventArgs e)
        {
        }

        #endregion UI Event Handlers
    }
}
