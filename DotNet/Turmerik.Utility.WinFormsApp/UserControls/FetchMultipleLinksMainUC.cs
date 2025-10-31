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
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;
using Turmerik.Core.Utility;
using Turmerik.WinForms.Helpers;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class FetchMultipleLinksMainUC : UserControl, IAppUserControl
    {
        private static readonly string splitContainerMainWidthRatiosMapKey = string.Format(
            "[{0}][{0}]",
            typeof(FetchMultipleLinksMainUC).FullName,
            nameof(splitContainerMain));

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
        private readonly IFetchMultipleLinksDataContainer fetchMultipleLinksDataContainer;
        private readonly FetchMultipleLinksService fetchMultipleLinksService;

        private Action resetFinished;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        private List<FetchLinkDataItemCoreMtbl> itemsList;
        private List<IFetchLinkItemUC?> itemControlsList;

        private DataGridViewRow currentItemRow;

        private bool splitContainerMainSplitterMoving;

        public FetchMultipleLinksMainUC()
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
                fetchMultipleLinksService = svcProv.GetRequiredService<FetchMultipleLinksService>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                uISettingsData = uISettingsRetriever.Data;
            }
        }

        public event Action ResetFinished
        {
            add => resetFinished += value;
            remove => resetFinished -= value;
        }

        public void LoadItemsList()
        {
            dataGridViewItemsList.Rows.Clear();
            itemsList = new();
            splitContainerMain.Panel2.Controls.Clear();

            itemControlsList ??= new();

            foreach (var control in itemControlsList)
            {
                control?.ReleaseResources();
            }

            itemControlsList.Clear();

            itemsList = fetchMultipleLinksService.LoadSerializedLinks();
            itemsList.Sort((a, b) => -1 * (a.ItemIdx - b.ItemIdx));
            itemControlsList = itemsList.Select((v) => null as IFetchLinkItemUC).ToList();

            foreach (var item in itemsList)
            {
                var cell = new DataGridViewTextBoxCell();
                cell.Value = item.Text;

                if (item.IsUrl == false)
                {
                    cell.Style.Font = new Font(
                        dataGridViewItemsList.DefaultCellStyle.Font,
                        FontStyle.Bold);
                }

                var row = new DataGridViewRow();
                row.Cells.Add(cell);
                dataGridViewItemsList.Rows.Add(row);
            }

            var currentItemIdx = fetchMultipleLinksDataContainer.Data.CurrentItemIdx;

            ShowItem(itemsList.FirstKvp(
                item => item.ItemIdx == currentItemIdx));
        }

        public void HandleKeyDown(KeyEventArgs e)
        {
            if (e.Control && !e.Shift && !e.Alt)
            {
                if (e.KeyCode >= Keys.D0 && e.KeyCode <= (Keys)Math.Min(
                    (int)Keys.D9,
                    (int)Keys.D0 + fetchMultipleLinksService.UrlScripts.Count - 1))
                {
                    actionComponent.Execute(
                        new WinFormsActionOpts<int>
                        {
                            ActionName = string.Join(".",
                                nameof(IFetchLinkItemUC),
                                nameof(IFetchLinkItemUC.FocusControl)),
                            Action = () =>
                            {
                                var currentControl = itemControlsList[GetCurrentItemKvp().Key];
                                currentControl!.FocusControl(e.KeyCode);

                                return ActionResultH.Create(0);
                            }
                        });
                }
            }
        }

        private ToolTipHintsGroupOpts GetToolTipHintsGroupOpts()
        {
            var optsList = new List<ToolTipHintOpts>();

            return new ToolTipHintsGroupOpts
            {
                HintOpts = optsList,
            };
        }

        private KeyValuePair<int, FetchLinkDataItemCoreMtbl> GetCurrentItemKvp()
        {
            var currentItemIdx = fetchMultipleLinksDataContainer.Data.CurrentItemIdx;

            var currentItemKvp = itemsList.FirstKvp(
                item => item.ItemIdx == currentItemIdx);

            return currentItemKvp;
        }

        private void Reset()
        {
            dataGridViewItemsList.Rows.Clear();
            itemsList = new();

            fetchMultipleLinksService.DeleteSerializedLinks();
        }

        private void ShowItem(KeyValuePair<int, FetchLinkDataItemCoreMtbl> mtblKvp)
        {
            if (currentItemRow != null)
            {
                currentItemRow.DefaultCellStyle.BackColor = Color.White;
                currentItemRow.DefaultCellStyle.SelectionBackColor = Color.White;
            }

            currentItemRow = dataGridViewItemsList.Rows[mtblKvp.Key];
            currentItemRow.DefaultCellStyle.BackColor = Color.BurlyWood;
            currentItemRow.DefaultCellStyle.SelectionBackColor = Color.BurlyWood;
            currentItemRow.Cells[0].Value = mtblKvp.Value.Text;

            splitContainerMain.Panel2.Controls.Clear();
            var control = itemControlsList[mtblKvp.Key];

            if (control == null)
            {
                if (mtblKvp.Value is FetchLinkDataTextItemMtbl textItem)
                {
                    control = new FetchLinkTextItemUC();
                }
                else if (mtblKvp.Value is FetchLinkDataUrlItemMtbl urlItem)
                {
                    control = new FetchLinkUrlItemUC();
                }
                else
                {
                    throw new TrmrkException($"Unsupported item type: {mtblKvp.Value.GetType().FullName}");
                }

                itemControlsList[mtblKvp.Key] = control;
            }

            control.SetItem(mtblKvp.Value);
            var ctrl = (Control)control;
            ctrl.Dock = DockStyle.Fill;
            splitContainerMain.Panel2.Controls.Add(ctrl);

            fetchMultipleLinksDataContainer.Update(mtbl =>
            {
                mtbl.CurrentItemIdx = mtblKvp.Value.ItemIdx;
            });
        }

        private void ReloadCurrentItem()
        {
            var currentItemKvp = GetCurrentItemKvp();

            currentItemKvp = new(
                currentItemKvp.Key,
                fetchMultipleLinksService.LoadSerializedLink(currentItemKvp.Value));

            itemsList[currentItemKvp.Key] = currentItemKvp.Value;
            ShowItem(currentItemKvp);
        }

        #region UI Event Handlers

        private void FetchMultipleLinksMainUC_Load(object sender, EventArgs e) => actionComponent?.Execute(
            new WinFormsActionOpts<int>
            {
                ActionName = nameof(FetchMultipleLinksMainUC_Load),
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
                        uISettingsData, splitContainerMainWidthRatiosMapKey);

                    return ActionResultH.Create(0);
                }
            });

        private void ButtonReloadItemsList_Click(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(ButtonReloadItemsList_Click),
            Action = () =>
            {
                LoadItemsList();
                return ActionResultH.Create(0);
            }
        });

        private void ButtonResetItemsList_Click(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(ButtonResetItemsList_Click),
            Action = () =>
            {
                Reset();
                return ActionResultH.Create(0);
            },
            OnAfterExecution = (result) =>
            {
                if (result.IsSuccess)
                {
                    this.resetFinished();
                }

                return null;
            }
        });

        private void ButtonNextItem_Click(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(ButtonNextItem_Click),
            Action = () =>
            {
                var currentItemKvp = GetCurrentItemKvp();

                if (currentItemKvp.Key < itemsList.Count - 1)
                {
                    var newIdx = currentItemKvp.Key + 1;
                    var item = itemsList[newIdx];

                    ShowItem(new(newIdx, item));
                }

                return ActionResultH.Create(0);
            }
        });

        private void ButtonPrevItem_Click(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(ButtonPrevItem_Click),
            Action = () =>
            {
                var currentItemKvp = GetCurrentItemKvp();

                if (currentItemKvp.Key > 0)
                {
                    var newIdx = currentItemKvp.Key - 1;
                    var item = itemsList[newIdx];

                    ShowItem(new(newIdx, item));
                }

                return ActionResultH.Create(0);
            }
        });

        private void DataGridViewItemsList_CellMouseClick(object sender, DataGridViewCellMouseEventArgs e) => actionComponent.Execute(
            new WinFormsActionOpts<int>
            {
                ActionName = nameof(DataGridViewItemsList_CellMouseClick),
                Action = () =>
                {
                    var newIdx = e.RowIndex;
                    var item = itemsList[newIdx];

                    ShowItem(new(newIdx, item));
                    return ActionResultH.Create(0);
                }
            });

        private void ButtonReloadCurrentItem_Click(object sender, EventArgs e) => actionComponent.Execute(
            new WinFormsActionOpts<int>
            {
                ActionName = nameof(ButtonReloadCurrentItem_Click),
                Action = () =>
                {
                    ReloadCurrentItem();
                    return ActionResultH.Create(0);
                }
            });

        private void SplitContainerMain_SplitterMoving(object sender, SplitterCancelEventArgs e)
        {
            splitContainerMainSplitterMoving = true;
        }

        private void SplitContainerMain_SplitterMoved(object sender, SplitterEventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
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
                            splitContainerMainWidthRatiosMapKey));
                }

                return ActionResultH.Create(0);
            }
        });

        #endregion UI Event Handlers
    }
}
