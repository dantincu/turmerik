using Microsoft.Extensions.DependencyInjection;
using System.ServiceModel;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Threading;
using Turmerik.Utility.WinFormsApp.Properties;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Ux;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class TextTransformUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly TextTransformBehavior textTransformBehavior;

        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ISynchronizedValueAdapter<bool> controlsSynchronizer;
        private readonly IPropChangedEventAdapterFactory propChangedEventAdapterFactory;

        private readonly IUISettingsRetriever uISettingsRetriever;
        private readonly IUIThemeRetriever uIThemeRetriever;
        private readonly IAppSettings appSettings;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        private readonly ToolTip toolTip;

        private TextTransformBehaviorDataImmtbl textTransformers;
        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        private ITextTransformNode? currentTransformNode;
        private ITextTransformItem? currentTransformItem;

        public TextTransformUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                textTransformBehavior = svcProv.GetRequiredService<TextTransformBehavior>();

                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();

                controlsSynchronizer = svcProv.GetRequiredService<ISynchronizedValueAdapterFactory>().Create(
                    initialValue: true);

                propChangedEventAdapterFactory = svcProv.GetRequiredService<IPropChangedEventAdapterFactory>();

                uISettingsRetriever = svcProv.GetRequiredService<IUISettingsRetriever>();
                uIThemeRetriever = svcProv.GetRequiredService<IUIThemeRetriever>();
                appSettings = svcProv.GetRequiredService<IAppSettings>();
            }

            InitializeComponent();
            toolTip = new ToolTip();

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                iconLabelRunCurrentTransformer.Text = MatUIIconUnicodesH.AudioAndVideo.PLAY_ARROW;

                uISettingsData = uISettingsRetriever.Data;
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

        private void FillTransformersTreeViewNodes()
        {
            var rootNodesArr = textTransformers.GetTransformers(
                ).Select(TransformerNodeToTreeNode).ToArray();

            treeViewTransformers.Nodes.AddRange(
                rootNodesArr);
        }

        private TreeNode TransformerNodeToTreeNode(
            ITextTransformNode transformNode) => new TreeNode(
                transformNode.Name, 0, 0,
                transformNode.GetChildNodes().Select(
                    TransformerNodeToTreeNode).Concat(
                    transformNode.GetItems().Select(
                        TransformerItemToTreeNode)).ToArray())
            {
                Tag = transformNode,
                ToolTipText = transformNode.Description
            };

        private TreeNode TransformerItemToTreeNode(
            ITextTransformItem transformItem) => new TreeNode(
                transformItem.Name, 1, 1)
            {
                Tag = transformItem,
                ToolTipText = transformItem.Description
            };

        private void SetCurrentTransformer(
            object tag)
        {
            ClearCurrentTransformer();

            if (tag is ITextTransformNode transformNode)
            {
                SetCurrentTransformerNode(
                    transformNode);
            }
            else if (tag is ITextTransformItem transformItem)
            {
                SetCurrentTransformerItem(
                    transformItem);
            }
        }

        private void ClearCurrentTransformer()
        {
            iconLabelRunCurrentTransformer.Enabled = false;
            currentTransformNode = null;
            currentTransformItem = null;
            textBoxCurrentTransformerName.Text = string.Empty;
            richTextBoxCurrentTransformerDescription.Text = string.Empty;
            textBoxCurrentTransformerName.BackColor = Color.FromArgb(255, 255, 255);
        }

        private void SetCurrentTransformerNode(
            ITextTransformNode transformNode)
        {
            currentTransformNode = transformNode;
            textBoxCurrentTransformerName.Text = transformNode.Name;
            richTextBoxCurrentTransformerDescription.Text = transformNode.Description;
            textBoxCurrentTransformerName.BackColor = Color.FromArgb(255, 232, 208);
        }

        private void SetCurrentTransformerItem(
            ITextTransformItem transformItem)
        {
            currentTransformItem = transformItem;
            textBoxCurrentTransformerName.Text = currentTransformItem.Name;
            richTextBoxCurrentTransformerDescription.Text = currentTransformItem.Description;
            textBoxCurrentTransformerName.BackColor = Color.FromArgb(208, 255, 208);
            iconLabelRunCurrentTransformer.Enabled = true;
        }

        private void ToggleControlsEnabled(bool enabled)
        {
            treeViewTransformers.Enabled = enabled;
            richTextBoxSrcText.Enabled = enabled;
            richTextBoxResultText.Enabled = enabled;

            if (enabled)
            {
                iconLabelRunCurrentTransformer.Enabled = currentTransformItem != null;
            }
            else
            {
                iconLabelRunCurrentTransformer.Enabled = false;
            }
        }

        private async Task<IActionResult<string?>> RunCurrentTransform() => await actionComponent.ExecuteAsync(new WinFormsAsyncActionOpts<string?>
        {
            ActionName = nameof(RunCurrentTransform),
            OnBeforeExecution = () =>
            {
                ToggleControlsEnabled(false);
                return WinFormsMessageTuple.WithOnly(" ");
            },
            Action = async () =>
            {
                string? outputText = null;

                if (currentTransformItem != null)
                {
                    string inputText = richTextBoxSrcText.Text;

                    outputText = textTransformBehavior.Behavior.Invoke<string>(
                        currentTransformItem.JsMethod, [inputText]);

                    richTextBoxResultText.Text = outputText;
                }
                else
                {
                    MessageBox.Show("There is no transformer currently selected");
                }

                return ActionResultH.Create(outputText);
            },
            OnAfterExecution = result =>
            {
                ToggleControlsEnabled(true);
                return null;
            }
        });

        #region UI Event Handlers

        private void TextTransformUC_Load(object sender, EventArgs e) => actionComponent?.Execute(
            new WinFormsActionOpts<int>
            {
                ActionName = nameof(TextTransformUC_Load),
                Action = () =>
                {
                    controlBlinkTimersManagerAdapter = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().Data;

                    uIThemeData = uIThemeRetriever.Data.ActWith(uiTheme =>
                    {
                        uiTheme.ApplyBgColor([
                            this.richTextBoxSrcText,
                            this.richTextBoxResultText,
                        ], uiTheme.InputBackColor);
                    });

                    appSettings.Data.ActWith(appSettingsData =>
                    {
                        controlsSynchronizer.Execute(false,
                            (wasEnabled) =>
                            {
                            });
                    });

                    treeViewTransformers.ImageList = new ImageList();

                    treeViewTransformers.ImageList.Images.AddRange(
                        [Resources.orange_rounded_rectangle_fill_32x32,
                            Resources.orange_rounded_rectangle_32x32]);

                    textTransformBehavior.ExportedMembers.ActWith(behavior =>
                    {
                        textTransformers = behavior;
                        FillTransformersTreeViewNodes();
                    });

                    toolTipHintsOrchestrator = svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().Data;

                    toolTipHintsOrchestrator.HintGroups.Add(
                        toolTipHintsGroup = GetToolTipHintsGroupOpts().HintsGroup());

                    return ActionResultH.Create(0);
                }
            });

        private void TreeViewTransformers_NodeMouseClick(
            object sender, TreeNodeMouseClickEventArgs e) => actionComponent.Execute(
            new WinFormsActionOpts<int>
            {
                ActionName = nameof(TreeViewTransformers_NodeMouseClick),
                OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
                Action = () =>
                {
                    SetCurrentTransformer(e.Node.Tag);
                    return ActionResultH.Create(0);
                }
            });

        private async void IconLabelRunCurrentTransformer_Click(
            object sender, EventArgs e) => await RunCurrentTransform();

        private async void RichTextBoxSrcText_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Control && e.Shift && e.KeyCode == Keys.Enter)
            {
                var result = await RunCurrentTransform();

                if (result.IsSuccess && result.Value != null)
                {
                    Clipboard.SetText(result.Value);
                }
            }
        }

        #endregion UI Event Handlers
    }
}
