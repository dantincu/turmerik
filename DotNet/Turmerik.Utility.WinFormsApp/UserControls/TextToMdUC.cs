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
using Turmerik.Code.Core;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Threading;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Ux;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;
using Turmerik.Core.Text;
using static Turmerik.WinForms.Controls.UISettingsDataCore;
using Turmerik.Md;
using Turmerik.NetCore.Md;
using System.Web;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class TextToMdUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly TextToMdService service;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ISynchronizedValueAdapter<bool> controlsSynchronizer;
        private readonly IPropChangedEventAdapterFactory propChangedEventAdapterFactory;

        private readonly IUISettingsRetriever uISettingsRetriever;
        private readonly IUIThemeRetriever uIThemeRetriever;
        private readonly IAppSettings appSettings;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxMdTblFirstLineIsHeader_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxResultsToCB_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxMdTblSrcTxtIsTabSep_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxMdTableSurroundRowWithCellSep_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxRmMdQtLvlAndHtmlDecode_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxAddMdQtLvlAndHtmlEncode_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxInsertSpacesBetweenTokens_EvtAdapter;

        private readonly ToolTip toolTip;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        public TextToMdUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                service = svcProv.GetRequiredService<TextToMdService>();
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

            splitContainerMain.SplitterDistance = panelOptionControls.Height;
            panelOptionControls.SizeChanged += PanelOptionControls_SizeChanged;

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                iconLabelResultToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;
                iconLabelCopyResultToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;

                iconLabelRmMdQtLvl.Text = MatUIIconUnicodesH.AudioAndVideo.FAST_REWIND;
                iconLabelHtmlDecode.Text = MatUIIconUnicodesH.CommonActions.CODE_OFF;

                iconLabelAddMdQtLvl.Text = MatUIIconUnicodesH.AudioAndVideo.FAST_FORWARD;
                iconLabelHtmlEncode.Text = MatUIIconUnicodesH.CommonActions.CODE;
                iconLabelEncodeAllHtml.Text = MatUIIconUnicodesH.CommonActions.CODE;

                checkBoxMdTblFirstLineIsHeader_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxMdTableFirstLineIsHeader,
                    (source, e, isChecked) => SetMdTblFirstLineIsHeader(isChecked));

                checkBoxResultsToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxResultToCB,
                    (source, e, isChecked) => SetResultToCB(isChecked));

                checkBoxMdTblSrcTxtIsTabSep_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxMdTableSrcTextIsTabSeparated,
                    (source, e, isChecked) =>
                    {
                        textBoxMdTableSrcTextSep.ReadOnly = checkBoxMdTableSrcTextIsTabSeparated.Checked;
                        SetMdTblSrcTxtSep(isChecked);
                    });

                checkBoxMdTableSurroundRowWithCellSep_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxMdTableSurroundRowWithCellSep,
                    (source, e, isChecked) => SetMdTableSurroundRowWithCellSep(isChecked));

                checkBoxRmMdQtLvlAndHtmlDecode_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxRmMdQtLvlAndHtmlDecode,
                    (source, e, isChecked) => SetHtmlDecodeOnRmMdQtLvl(isChecked));

                checkBoxAddMdQtLvlAndHtmlEncode_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxAddMdQtLvlAndHtmlEncode,
                    (source, e, isChecked) => SetHtmlEncodeOnAddMdQtLvl(isChecked));

                checkBoxInsertSpacesBetweenTokens_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxInsertSpacesBetweenTokens,
                    (source, e, isChecked) => SetInsertSpacesBetweenTokens(isChecked));

                uISettingsData = uISettingsRetriever.Data;
            }
        }

        private void ApplyHorizontalSplitPanelsSettings(
            HorizontalSplitPanel[] panelsArr)
        {
            foreach (var panel in panelsArr)
            {
                panel.SetBorderWidth(1);
                panel.SetBorderRadius(3);

                panel.SetBorderColor(
                    uIThemeData.LightBorderColor);
            }
        }

        private void SetMdTblFirstLineIsHeader(
            bool enabled) => actionComponent.UpdateAppSettings(
                appSettings, settings => settings.TextToMd.ActWith(mtbl =>
                {
                    mtbl.MdTblFirstLineIsHeader = enabled.If(
                        () => null, () => (bool?)false);
                }));

        private void SetResultToCB(
            bool enabled) => actionComponent.UpdateAppSettings(
                appSettings, settings => settings.TextToMd.ActWith(mtbl =>
                {
                    mtbl.SetResultTextToCB = enabled.If(
                        () => (bool?)true, () => null);
                }));

        private void SetMdTblSrcTxtSep(
            bool isTabSeparated) => actionComponent.UpdateAppSettings(
                appSettings, settings => settings.TextToMd.ActWith(mtbl =>
                {
                    mtbl.MdTableSrcTextTabSeparator = textBoxMdTableSrcTextSep.Text;

                    mtbl.MdTableSrcTextIsTabSeparated = isTabSeparated.If(
                        () => null, () => (bool?)false);
                }));

        private void SetMdTableSurroundRowWithCellSep(
            bool enabled) => actionComponent.UpdateAppSettings(
                appSettings, settings => settings.TextToMd.ActWith(mtbl =>
                {
                    mtbl.MdTableSurroundRowWithCellSep = enabled.If(
                        () => null, () => (bool?)false);
                }));

        private void SetHtmlDecodeOnRmMdQtLvl(
            bool enabled) => actionComponent.UpdateAppSettings(
                appSettings, settings => settings.TextToMd.ActWith(mtbl =>
                {
                    mtbl.HtmlDecodeOnRmMdQtLvl = enabled.If(
                        () => null, () => (bool?)false);
                }));

        private void SetHtmlEncodeOnAddMdQtLvl(
            bool enabled) => actionComponent.UpdateAppSettings(
                appSettings, settings => settings.TextToMd.ActWith(mtbl =>
                {
                    mtbl.HtmlEncodeOnAddMdQtLvl = enabled.If(
                        () => null, () => (bool?)false);
                }));

        private void SetInsertSpacesBetweenTokens(
            bool enabled) => actionComponent.UpdateAppSettings(
                appSettings, settings => settings.TextToMd.ActWith(mtbl =>
                {
                    mtbl.InsertSpacesBetweenTokens = enabled.If(
                        () => null, () => (bool?)false);
                }));

        private void CopyResultToCB() => actionComponent.CopyTextToClipboard(
            controlBlinkTimersManagerAdapter,
            iconLabelCopyResultToCB,
            richTextBoxConvertedText.Text);

        private ToolTipHintsGroupOpts GetToolTipHintsGroupOpts()
        {
            var optsList = new List<ToolTipHintOpts>();

            return new ToolTipHintsGroupOpts
            {
                HintOpts = optsList,
            };
        }

        private void SrcTextToMdTable() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                string separator = checkBoxMdTableSrcTextIsTabSeparated.Checked ? "\t" : textBoxMdTableSrcTextSep.Text;

                if (string.IsNullOrEmpty(
                    separator))
                {
                    throw new InvalidOperationException(
                        "Cannot convert text to markdown table with the empty string as separator for table cells");
                }

                string outputText = service.SrcTextToMdTable(
                    new TextToMdTableOpts
                    {
                        InputText = richTextBoxSrcText.Text,
                        Separator = separator,
                        FirstLineIsHeader = checkBoxMdTableFirstLineIsHeader.Checked,
                        SurroundLineWithCellSep = checkBoxMdTableSurroundRowWithCellSep.Checked,
                        InsertSpacesBetweenTokens = checkBoxInsertSpacesBetweenTokens.Checked,
                    });

                richTextBoxConvertedText.Text = outputText;
                return ActionResultH.Create(outputText);
            },
            OnUnhandledError = exc => WinFormsMessageTuple.WithOnly(
                exc.Message, exc.Message),
        }).ActWith(result => (result.IsSuccess && checkBoxResultToCB.Checked).ActIf(() => CopyResultToCB()));

        private void ResultTextRmMdQtLvl() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                string outputText = service.ResultTextRmMdQtLvl(
                    richTextBoxConvertedText.Text,
                    checkBoxInsertSpacesBetweenTokens.Checked);

                if (checkBoxRmMdQtLvlAndHtmlDecode.Checked)
                {
                    outputText = service.ResultTextDecodeHtml(outputText);
                }

                richTextBoxSrcText.Text = outputText;
                return ActionResultH.Create(outputText);
            }
        }).ActWith(result => (result.IsSuccess && checkBoxResultToCB.Checked).ActIf(() => CopyResultToCB()));

        private void ResultTextDecodeHtml() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                string outputText = HttpUtility.HtmlDecode(
                    richTextBoxConvertedText.Text);

                richTextBoxSrcText.Text = outputText;
                return ActionResultH.Create(outputText);
            }
        }).ActWith(result => (result.IsSuccess && checkBoxResultToCB.Checked).ActIf(() => CopyResultToCB()));

        private void SrcTextAddMdQtLvl() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                string outputText = richTextBoxSrcText.Text;

                if (checkBoxAddMdQtLvlAndHtmlEncode.Checked)
                {
                    outputText = service.SrcTextEncodeHtml(outputText);
                }

                outputText = service.SrcTextAddMdQtLvl(
                    outputText,
                    checkBoxInsertSpacesBetweenTokens.Checked);

                richTextBoxConvertedText.Text = outputText;
                return ActionResultH.Create(outputText);
            }
        }).ActWith(result => (result.IsSuccess && checkBoxResultToCB.Checked).ActIf(() => CopyResultToCB()));

        private void SrcTextEncodeHtml(bool encodeFull = false) => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                string outputText;

                if (encodeFull)
                {
                    outputText = HttpUtility.HtmlEncode(
                        richTextBoxSrcText.Text);
                }
                else
                {
                    outputText = service.SrcTextEncodeHtml(
                        richTextBoxSrcText.Text);
                }

                richTextBoxConvertedText.Text = outputText;
                return ActionResultH.Create(outputText);
            }
        }).ActWith(result => (result.IsSuccess && checkBoxResultToCB.Checked).ActIf(() => CopyResultToCB()));

        #region UI Event Handlers

        private void TextToMdUC_Load(object sender, EventArgs e) => actionComponent?.Execute(
            new WinFormsActionOpts<int>
            {
                Action = () =>
                {
                    controlBlinkTimersManagerAdapter = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().Data;

                    uIThemeData = uIThemeRetriever.Data.ActWith(uiTheme =>
                    {
                        uiTheme.ApplyBgColor([
                            this.buttonMdTable,
                            this.textBoxMdTableSrcTextSep,
                            this.checkBoxMdTableSrcTextIsTabSeparated,
                            this.checkBoxRmMdQtLvlAndHtmlDecode,
                            this.checkBoxAddMdQtLvlAndHtmlEncode,
                            this.richTextBoxSrcText,
                            this.richTextBoxConvertedText,
                        ], uiTheme.InputBackColor);

                        iconLabelResultToCB.ForeColor = uiTheme.InfoIconColor;
                    });

                    ApplyHorizontalSplitPanelsSettings([
                        horizontalSplitPanelResultToCB
                    ]);

                    appSettings.Data.ActWith(appSettingsData =>
                    {
                        var textToMdSettings = appSettingsData.TextToMd;
                        bool mdTableSrcTextIsTabSeparated = textToMdSettings.MdTableSrcTextIsTabSeparated ?? true;

                        textBoxMdTableSrcTextSep.Text = textToMdSettings.MdTableSrcTextTabSeparator;
                        textBoxMdTableSrcTextSep.ReadOnly = mdTableSrcTextIsTabSeparated;

                        controlsSynchronizer.Execute(false,
                            (wasEnabled) =>
                            {
                                checkBoxMdTableFirstLineIsHeader.Checked = textToMdSettings.MdTblFirstLineIsHeader ?? true;
                                checkBoxResultToCB.Checked = textToMdSettings.SetResultTextToCB ?? false;
                                checkBoxMdTableSrcTextIsTabSeparated.Checked = mdTableSrcTextIsTabSeparated;
                                checkBoxMdTableSurroundRowWithCellSep.Checked = textToMdSettings.MdTableSurroundRowWithCellSep ?? true;
                                checkBoxAddMdQtLvlAndHtmlEncode.Checked = textToMdSettings.HtmlEncodeOnAddMdQtLvl ?? true;
                                checkBoxRmMdQtLvlAndHtmlDecode.Checked = textToMdSettings.HtmlDecodeOnRmMdQtLvl ?? true;
                                checkBoxInsertSpacesBetweenTokens.Checked = textToMdSettings.InsertSpacesBetweenTokens ?? true;
                            });
                    });

                    toolTipHintsOrchestrator = svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().Data;

                    toolTipHintsOrchestrator.HintGroups.Add(
                        toolTipHintsGroup = GetToolTipHintsGroupOpts().HintsGroup());

                    return ActionResultH.Create(0);
                }
            });

        private void PanelOptionControls_SizeChanged(object? sender, EventArgs e)
        {
            splitContainerMain.SplitterDistance = panelOptionControls.Height;
        }

        private void ButtonMdTable_Click(object sender, EventArgs e)
        {
            SrcTextToMdTable();
        }

        private void TextBoxMdTableSrcTextSep_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                SetMdTblSrcTxtSep(false);
            }
        }

        private void IconLabelResultsToCB_Click(object sender, EventArgs e)
        {
            checkBoxResultToCB.ToggleChecked();
        }

        private void IconLabelCopyResultToCB_Click(object sender, EventArgs e)
        {
            CopyResultToCB();
        }

        private void IconLabelRmMdQtLvl_Click(object sender, EventArgs e)
        {
            ResultTextRmMdQtLvl();
        }

        private void IconLabelHtmlDecode_Click(object sender, EventArgs e)
        {
            ResultTextDecodeHtml();
        }

        private void IconLabelAddMdQtLvl_Click(object sender, EventArgs e)
        {
            SrcTextAddMdQtLvl();
        }

        private void IconLabelHtmlEncode_Click(object sender, EventArgs e)
        {
            SrcTextEncodeHtml();
        }

        private void IconLabelEncodeAllHtml_Click(object sender, EventArgs e)
        {
            SrcTextEncodeHtml(true);
        }

        private void RichTextBoxSrcText_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {

            }
        }

        private void RichTextBoxConvertedText_KeyUp(object sender, KeyEventArgs e)
        {

        }

        #endregion UI Event Handlers
    }
}
