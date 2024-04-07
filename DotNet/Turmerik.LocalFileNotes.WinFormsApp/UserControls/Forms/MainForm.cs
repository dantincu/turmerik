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
using Turmerik.WinForms.Helpers;
using System.Windows.Forms;

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

        private readonly Font tabPageHeadsCloseIconFont;

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

            tabPageHeadsCloseIconFont = new Font(
                tabControlMain.Font.FontFamily,
                16, FontStyle.Bold);

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

        private KeyValuePair<int, AppPageTupleBase?> GetAppPageTuple(
            int idx, bool isOpenInAltTabControl)
        {
            int retIdx = -1;
            AppPageTupleBase retAppPage = null;
            int tabIdx = -1;

            for (int i = 0; i < appPageTuplesList.Count; i++)
            {
                var appPageTuple = appPageTuplesList[i];
                var appPageData = appPageTuple.GetAppPageData();

                if (appPageData.IsOpenInAltTabControl == isOpenInAltTabControl)
                {
                    if (idx == ++tabIdx)
                    {
                        retIdx = i;
                        retAppPage = appPageTuple;
                        break;
                    }
                }
            }

            return new KeyValuePair<int, AppPageTupleBase?>(
                retIdx, retAppPage);
        }

        private void OpenHomePage() => OpenInNewTab(new AppPageOpts
        {
            ResourceType = AppPageResourceType.Home,
            Title = "Home"
        });

        private void OpenInNewTab(
            AppPageOpts opts,
            bool openInAltTabControl = false) => actionComponent.Execute(
            new WinFormsActionOpts<AppPageTupleBase>
            {
                ActionName = nameof(OpenInNewTab),
                Action = () =>
                {
                    var appPageTuple = CreateAppPageTuple(
                        opts, null, openInAltTabControl);

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
                ActionName = nameof(OpenInCurrentTab),
                Action = () =>
                {
                    var currentTabPageIdx = appPageTuplesList.IndexOf(
                        currentAppPageTuple);

                    var appPageTuple = CreateAppPageTuple(
                        opts, currentAppPageTuple.TabPageControl,
                        currentAppPageTuple.GetAppPageData().IsOpenInAltTabControl);

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

        private void CloseCurrentTab() => CloseTab(
            currentAppPageTuple);

        private void CloseTab(
            AppPageTupleBase appPageTuple,
            int tabPageIdx = -1) => actionComponent.Execute(
            new WinFormsActionOpts<int>
            {
                ActionName = nameof(CloseTab),
                Action = () =>
                {
                    appPageTuple.TabPageControl.Controls.Clear();
                    var appPageData = appPageTuple.GetAppPageData();

                    if (appPageData.IsOpenInAltTabControl)
                    {
                        tabControlAlt.TabPages.Remove(
                            appPageTuple.TabPageControl);
                    }
                    else
                    {
                        tabControlMain.TabPages.Remove(
                            appPageTuple.TabPageControl);
                    }

                    appPageTuplesList.Remove(appPageTuple);
                    appPageTuple.Dispose();

                    return ActionResultH.Create(0);
                }
            }).ActWith(actionResult => (actionResult.IsSuccess && appPageTuplesList.Count == 0).ActIf(
                () => OpenHomePage()));

        private AppPageTupleBase CreateAppPageTuple(
            AppPageOpts opts,
            TabPage? tabPage = null,
            bool openInAltTabControl = false)
        {
            AppPageTupleBase appPageTuple = opts.ResourceType switch
            {
                AppPageResourceType.Home => new AppHomePage(
                    openInAltTabControl).CreateTuple(
                    new AppHomePageUC(),
                    opts.Title,
                    tabPage),
                AppPageResourceType.FileExplorer => new AppFileExplorerPage(
                    opts.Idnf, openInAltTabControl).CreateTuple(
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
            AppPageSidePanel? appPageSidePanel) => appPageSidePanel switch
            {
                AppPageSidePanel.FileExplorer => fileExplorerHcyUC,
                AppPageSidePanel.NoteExplorer => noteExplorerHcyUC,
                AppPageSidePanel.NoteFileExplorer => noteFileExplorerHcyUC,
                _ => null
            };

        private ISidePanelUC? UpdateSidePanelUC(
            AppPageSidePanel? appPageSidePanel,
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

        private IActionResult<int> TabPageHeadClicked(
            MouseEventArgs e,
            bool isOpenInAltTabControl) => actionComponent.Execute(new WinFormsActionOpts<int>
            {
                ActionName = nameof(TabPageHeadClicked),
                Action = () =>
                {
                    var tabControlKvp = GetTabControl(
                        isOpenInAltTabControl);

                    var tabControl = tabControlKvp.Value;
                    var kvp = tabControl.GetTabPageHead(e);

                    if (kvp.Key >= 0)
                    {
                        var tupleKvp = GetAppPageTuple(
                            kvp.Key, isOpenInAltTabControl);

                        if (tupleKvp.Value != null)
                        {
                            Rectangle r = tabControl.GetTabRect(kvp.Key);

                            //Getting the position of the "x" mark.
                            Rectangle closeButton = new Rectangle(
                                r.Right - 30,
                                r.Top + 4, 30, 15);

                            switch (e.Button)
                            {
                                case MouseButtons.Left:
                                    if (closeButton.Contains(e.Location))
                                    {
                                        CloseTab(tupleKvp.Value, kvp.Key);
                                    }
                                    else
                                    {
                                        TabPageHeadClicked(
                                            tabControlKvp,
                                            tupleKvp,
                                            isOpenInAltTabControl);
                                    }
                                    break;
                                case MouseButtons.Right:
                                    TabPageHeadRightClicked(
                                        tabControlKvp,
                                        tupleKvp,
                                        isOpenInAltTabControl);
                                    break;
                                case MouseButtons.Middle:
                                    CloseTab(tupleKvp.Value, kvp.Key);
                                    break;
                                default:
                                    break;
                            }
                        }
                        else
                        {
                            ThrowTabControlMouseClickNoTabHead();
                        }
                    }
                    else
                    {
                        ThrowTabControlMouseClickNoTabHead();
                    }

                    return ActionResultH.Create(0);
                }
            });

        private void TabPageHeadClicked(
            KeyValuePair<int, TabControl> tabControlKvp,
            KeyValuePair<int, AppPageTupleBase> tupleKvp,
            bool isOpenInAltTabControl)
        {

        }

        private void TabPageHeadRightClicked(
            KeyValuePair<int, TabControl> tabControlKvp,
            KeyValuePair<int, AppPageTupleBase> tupleKvp,
            bool isOpenInAltTabControl)
        {

        }

        private void ThrowTabControlMouseClickNoTabHead()
        {
            throw new InvalidOperationException(
                "Tab control mouse click handler could not detect the clicked tab head");
        }

        private void DrawTabPageHead(
            DrawItemEventArgs e)
        {
            var tabPage = tabControlMain.TabPages[e.Index];

            e.Graphics.DrawImage(
                tabControlMain.ImageList.Images[tabPage.ImageIndex],
                new PointF(
                    e.Bounds.Left + 4,
                    e.Bounds.Top + 4));

            e.Graphics.DrawString(
                "×",
                tabPageHeadsCloseIconFont,
                Brushes.Black,
                e.Bounds.Right - 23,
                e.Bounds.Top - 3);

            e.Graphics.DrawString(
                tabPage.Text,
                e.Font,
                Brushes.Black,
                e.Bounds.Left + 28,
                e.Bounds.Top + 6);

            e.DrawFocusRectangle();
        }

        private void SelectedTabPageChanged(
            bool isAltTabControl) => actionComponent.Execute(
                new WinFormsActionOpts<int>
                {
                    ActionName = nameof(SelectedTabPageChanged),
                    Action = () =>
                    {
                        var kvp = GetTabControl(
                            isAltTabControl);

                        if (kvp.Value != null)
                        {
                            var appPageKvp = GetAppPageTuple(
                                kvp.Value.SelectedIndex,
                                isAltTabControl);

                            currentAppPageTuple = appPageKvp.Value!;

                            UpdateSidePanelUC(
                                currentAppPageTuple?.GetAppPageData().SidePanel,
                                true);
                        }
                        else
                        {
                            currentAppPageTuple = null;
                        }

                        return ActionResultH.Create(0);
                    }
                });

        private KeyValuePair<int, TabControl> GetTabControl(
            bool isAltTabControl)
        {
            var tabControl = isAltTabControl switch
            {
                true => tabControlAlt,
                false => tabControlMain,
            };

            int selectedIndex = tabControl.SelectedIndex;

            return new KeyValuePair<int, TabControl>(
                selectedIndex, tabControl);
        }

        #region UI Event Handlers

        private void ToolStripComboBoxShowHints_SelectedIndexChanged(
            object sender, EventArgs e)
        {
            var delaysCollctn = uISettingsRetriever.Data.ToolTipDelays;

            toolStripComboBoxShowHints.ComboBox.SelectedIndex.ActWith(
                selIdx =>
                {
                    if (selIdx >= 0 && selIdx < delaysCollctn.Count)
                    {
                        uISettingsRetriever.Update(
                            mtbl => mtbl.ToolTipDelays.ActWith(collctn =>
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

        private void MainForm_Load(
            object sender, EventArgs e)
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
                            OpenHomePage();
                            OpenHomePage();
                            OpenHomePage();
                            OpenHomePage();
                            OpenHomePage();
                        }

                        return ActionResultH.Create(delayIdx);
                    }
                });
            }
        }

        private void StartAppRecoveryToolToolStripMenuItem_Click(
            object sender, EventArgs e)
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
            SelectedTabPageChanged(false);
        }

        private void TabControlAlt_SelectedIndexChanged(
            object sender, EventArgs e)
        {
            SelectedTabPageChanged(true);
        }

        private void TabControlMain_MouseClick(
            object sender, MouseEventArgs e)
        {
        }

        private void TabControlAlt_MouseClick(
            object sender, MouseEventArgs e)
        {
        }

        private void TabControlMain_MouseDown(object sender, MouseEventArgs e)
        {
            TabPageHeadClicked(e, false);
        }

        private void TabControlAlt_MouseDown(object sender, MouseEventArgs e)
        {
            TabPageHeadClicked(e, true);
        }

        private void TabControlMain_DrawItem(
            object sender, DrawItemEventArgs e)
        {
            DrawTabPageHead(e);
        }

        private void TabControlAlt_DrawItem(
            object sender, DrawItemEventArgs e)
        {
            DrawTabPageHead(e);
        }

        #endregion UI Event Handlers
    }
}
