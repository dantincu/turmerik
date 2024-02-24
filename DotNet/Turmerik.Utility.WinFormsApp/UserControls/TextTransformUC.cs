using Microsoft.Extensions.DependencyInjection;
using System.ServiceModel;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Threading;
using Turmerik.Utility.WinFormsApp.Properties;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Ux;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.Helpers;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class TextTransformUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IJsonConversion jsonConversion;
        private readonly TextTransformBehavior textTransformBehavior;
        private readonly IRichTextBoxPseudoMarkupRetriever richTextBoxPseudoMarkupRetriever;
        private readonly IRichTextBoxPseudoMarkupAdapter richTextBoxPseudoMarkupAdapter;

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
        private ITextTransformItem? currentTextTransformItem;
        private ITextTransformItem? currentRichTextTransformItem;

        public TextTransformUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                jsonConversion = svcProv.GetRequiredService<IJsonConversion>();
                textTransformBehavior = svcProv.GetRequiredService<TextTransformBehavior>();
                richTextBoxPseudoMarkupRetriever = svcProv.GetRequiredService<IRichTextBoxPseudoMarkupRetriever>();
                richTextBoxPseudoMarkupAdapter = svcProv.GetRequiredService<IRichTextBoxPseudoMarkupAdapter>();

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

            this.richTextBoxUCSrc.RichTextBox.KeyDown += RichTextBoxUCSrc_KeyDown;

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
            var rootNodesArr = textTransformers.GetTextTransformers(
                ).Select(TransformerNodeToTreeNode).ToArray();

            treeViewTransformers.Nodes.AddRange(
                rootNodesArr);
        }

        private TreeNode TransformerNodeToTreeNode(
            ITextTransformNode transformNode) => new TreeNode(
                transformNode.Name, 0, 0,
                transformNode.GetChildNodes().Select(
                    TransformerNodeToTreeNode).Concat(
                        transformNode.GetTextTransformItems().Select(
                            TextTransformerItemToTreeNode)).Concat(
                        transformNode.GetRichTextTransformItems().Select(
                            RichTextTransformerItemToTreeNode)).ToArray())
            {
                Tag = transformNode,
                ToolTipText = transformNode.Description
            };

        private TreeNode TextTransformerItemToTreeNode(
            ITextTransformItem transformItem) => TransformerItemToTreeNode(
                transformItem, 1);

        private TreeNode RichTextTransformerItemToTreeNode(
            ITextTransformItem transformItem) => TransformerItemToTreeNode(
                transformItem, 2);

        private TreeNode TransformerItemToTreeNode(
            ITextTransformItem transformItem,
            int imageIndex) => new TreeNode(
                transformItem.Name, imageIndex, imageIndex)
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
                SetCurrentTextTransformerNode(
                    transformNode);
            }
            else if (tag is ITextTransformItem transformItem)
            {
                if (transformItem.TransformsRichText.Value)
                {
                    SetCurrentRichTextTransformerItem(
                        transformItem);
                }
                else
                {
                    SetCurrentTextTransformerItem(
                        transformItem);
                }
            }
        }

        private void ClearCurrentTransformer()
        {
            iconLabelRunCurrentTransformer.Enabled = false;
            currentTransformNode = null;
            currentTextTransformItem = null;
            currentRichTextTransformItem = null;
            textBoxCurrentTransformerName.Text = string.Empty;
            richTextBoxCurrentTransformerDescription.Text = string.Empty;
            iconLabelRunCurrentTransformer.ForeColor = Color.Black;
        }

        private void SetCurrentTextTransformerNode(
            ITextTransformNode transformNode)
        {
            currentTransformNode = transformNode;
            textBoxCurrentTransformerName.Text = transformNode.Name;
            richTextBoxCurrentTransformerDescription.Text = transformNode.Description;
        }

        private void SetCurrentTextTransformerItem(
            ITextTransformItem transformItem)
        {
            currentTextTransformItem = transformItem;
            textBoxCurrentTransformerName.Text = transformItem.Name;
            richTextBoxCurrentTransformerDescription.Text = transformItem.Description;
            iconLabelRunCurrentTransformer.Enabled = true;
            iconLabelRunCurrentTransformer.ForeColor = Color.Blue;
        }

        private void SetCurrentRichTextTransformerItem(
            ITextTransformItem transformItem)
        {
            currentRichTextTransformItem = transformItem;
            textBoxCurrentTransformerName.Text = transformItem.Name;
            richTextBoxCurrentTransformerDescription.Text = transformItem.Description;
            iconLabelRunCurrentTransformer.Enabled = true;
            iconLabelRunCurrentTransformer.ForeColor = Color.OrangeRed;
        }

        private void ToggleControlsEnabled(bool enabled)
        {
            treeViewTransformers.Enabled = enabled;
            richTextBoxUCSrc.Enabled = enabled;
            richTextBoxUCResult.Enabled = enabled;

            if (enabled)
            {
                iconLabelRunCurrentTransformer.Enabled = (currentTextTransformItem != null || currentRichTextTransformItem != null);
            }
            else
            {
                iconLabelRunCurrentTransformer.Enabled = false;
            }
        }

        private async Task<IActionResult<string?>> RunCurrentTransform() => await actionComponent.ExecuteAsync(
            new WinFormsAsyncActionOpts<string?>
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

                    if (currentTextTransformItem != null)
                    {
                        string inputText = richTextBoxUCSrc.RichTextBox.Text;

                        outputText = textTransformBehavior.Behavior.Invoke<string>(
                            currentTextTransformItem.JsMethod, [inputText]);

                        richTextBoxUCResult.RichTextBox.Text = outputText;
                    }
                    else if (currentRichTextTransformItem != null)
                    {
                        string inputText = richTextBoxUCSrc.RichTextBox.Text;

                        var pseudoMarkup = richTextBoxPseudoMarkupRetriever.GetPseudoMarkup(
                            new RichTextBoxPseudoMarkupRetrieverOptsMtbl
                            {
                                RichTextBox = richTextBoxUCSrc.RichTextBox
                            });

                        pseudoMarkup = textTransformBehavior.Behavior.Invoke<RichTextBoxPseudoMarkupMtbl>(
                            currentRichTextTransformItem.JsMethod, [inputText, pseudoMarkup]);

                        richTextBoxPseudoMarkupAdapter.InsertPseudoMarkup(
                            new RichTextBoxPseudoMarkupAdapterOptsMtbl
                            {
                                InsertIdx = int.MaxValue,
                                PseudoMarkup = pseudoMarkup,
                                RichTextBox = richTextBoxUCResult.RichTextBox
                            });

                        outputText = richTextBoxUCResult.RichTextBox.Text;
                    }
                    else
                    {
                        MessageBox.Show("There is no transformer currently selected");
                    }

                    return ActionResultH.Create(outputText);
                },
                OnAfterExecution = result =>
                {
                    iconLabelRunCurrentTransformer.InvokeIfReq(() =>
                    {
                        ToggleControlsEnabled(true);
                    });

                    return null;
                }
            });

        private IActionResult<float> TrySetZoomFactor(
            RichTextBox richTextBox,
            TextBox textBoxZoomFactor,
            Label labelZoomFactory,
            Func<float, float> newValueFactory = null) => actionComponent.Execute(
                new WinFormsActionOpts<float>
                {
                    ActionName = nameof(TrySetZoomFactor),
                    OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
                    Action = () =>
                    {
                        float newValue;

                        if (newValueFactory == null)
                        {
                            newValue = float.Parse(
                                textBoxZoomFactor.Text);

                            newValue = newValue / 100;
                        }
                        else
                        {
                            newValue = newValueFactory(
                                richTextBox.ZoomFactor);
                        }

                        richTextBox.ZoomFactor = newValue;

                        string newValueStr = Convert.ToInt32(
                            Math.Round(newValue * 100)).ToString();

                        textBoxZoomFactor.Text = newValueStr;
                        labelZoomFactory.Text = $"{newValueStr}%";

                        return ActionResultH.Create(newValue);
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
                            Resources.blue_rounded_rectangle_32x32,
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

        private void IconLabelRunCurrentTransformer_Click(
            object sender, EventArgs e)
        {
            RunCurrentTransform().ContinueWith(task =>
            {
                iconLabelRunCurrentTransformer.Invoke(() =>
                {
                    ToggleControlsEnabled(true);
                });
            });
        }

        private void RichTextBoxUCSrc_KeyDown(object? sender, KeyEventArgs e)
        {
            if (e.Control && e.Alt)
            {
                switch (e.KeyCode)
                {
                    case Keys.Enter:
                        RunCurrentTransform().ContinueWith(task =>
                        {
                            iconLabelRunCurrentTransformer.Invoke(() =>
                            {
                                ToggleControlsEnabled(true);
                                Clipboard.SetText(task.Result.Value);
                            });
                        });
                        break;
                }
            }
        }

        #endregion UI Event Handlers
    }
}
