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

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class TextToMdUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ISynchronizedValueAdapter<bool> controlsSynchronizer;
        private readonly IPropChangedEventAdapterFactory propChangedEventAdapterFactory;

        private readonly UISettingsRetriever uISettingsRetriever;
        private readonly IUIThemeRetriever uIThemeRetriever;
        private readonly IAppSettings appSettings;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxResultsToCB_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxMdTblSrcTxtIsTabSep_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxRmMdQtLvlAndHtmlDecode_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxAddMdQtLvlAndHtmlEncode_EvtAdapter;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;

        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;

        public TextToMdUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();

                controlsSynchronizer = svcProv.GetRequiredService<ISynchronizedValueAdapterFactory>().Create(
                    initialValue: true);

                propChangedEventAdapterFactory = svcProv.GetRequiredService<IPropChangedEventAdapterFactory>();

                uISettingsRetriever = svcProv.GetRequiredService<UISettingsRetriever>();
                uIThemeRetriever = svcProv.GetRequiredService<IUIThemeRetriever>();
                appSettings = svcProv.GetRequiredService<IAppSettings>();
            }

            InitializeComponent();
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

                this.checkBoxResultsToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxResultToCB,
                    (source, e, isChecked) => SetResultToCB(isChecked));

                this.checkBoxMdTblSrcTxtIsTabSep_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxMdTableSrcTextIsTabSeparated,
                    (source, e, isChecked) =>
                    {
                        textBoxMdTableSrcTextSep.ReadOnly = checkBoxMdTableSrcTextIsTabSeparated.Checked;
                        SetMdTblSrcTxtSep(isChecked);
                    });

                this.checkBoxRmMdQtLvlAndHtmlDecode_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxRmMdQtLvlAndHtmlDecode,
                    (source, e, isChecked) => SetHtmlDecodeOnRmMdQtLvl(isChecked));

                this.checkBoxAddMdQtLvlAndHtmlEncode_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxAddMdQtLvlAndHtmlEncode,
                    (source, e, isChecked) => SetHtmlEncodeOnAddMdQtLvl(isChecked));

                uISettingsRetriever.SubscribeToData(OnUISettingsData);
            }
        }

        private void OnUISettingsData(
            UISettingsDataImmtbl uISettingsData) => actionComponent.Execute(
                new WinFormsActionOpts<int>
                {
                    Action = () =>
                    {
                        this.uISettingsData = uISettingsData;
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
                                    checkBoxResultToCB.Checked = textToMdSettings.SetResultTextToCB ?? false;
                                    checkBoxAddMdQtLvlAndHtmlEncode.Checked = textToMdSettings.HtmlEncodeOnAddMdQtLvl ?? true;
                                    checkBoxRmMdQtLvlAndHtmlDecode.Checked = textToMdSettings.HtmlDecodeOnRmMdQtLvl ?? true;
                                    checkBoxMdTableSrcTextIsTabSeparated.Checked = mdTableSrcTextIsTabSeparated;
                                });
                        });

                        return ActionResultH.Create(0);
                    }
                });

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

        private void CopyResultToCB() => actionComponent.CopyTextToClipboard(
            controlBlinkTimersManagerAdapter,
            iconLabelCopyResultToCB,
            richTextBoxConvertedText.Text);

        private void SrcTextToMdTable() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                throw new NotImplementedException();
            }
        }).ActWith(result => result.IsSuccess.ActIf(() => CopyResultToCB()));

        private void ResultTextRmMdQtLvl() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                throw new NotImplementedException();
            }
        }).ActWith(result => result.IsSuccess.ActIf(() => CopyResultToCB()));

        private void ResultTextDecodeHtml() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                throw new NotImplementedException();
            }
        }).ActWith(result => result.IsSuccess.ActIf(() => CopyResultToCB()));

        private void SrcTextAddMdQtLvl() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                throw new NotImplementedException();
            }
        }).ActWith(result => result.IsSuccess.ActIf(() => CopyResultToCB()));

        private void SrcTextEncodeHtml() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                throw new NotImplementedException();
            }
        }).ActWith(result => result.IsSuccess.ActIf(() => CopyResultToCB()));

        #region UI Event Handlers

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

        #endregion UI Event Handlers
    }
}
