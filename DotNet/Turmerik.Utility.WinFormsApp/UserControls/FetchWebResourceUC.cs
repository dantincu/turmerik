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
using Turmerik.Core.Threading;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Ux;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;
using Turmerik.Core.Utility;
using Turmerik.Core.Text;
using Turmerik.Html;
using static Turmerik.WinForms.Controls.UISettingsDataCore;
using System.Collections.ObjectModel;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class FetchWebResourceUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IHtmlDocTitleRetriever htmlDocTitleRetriever;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ISynchronizedValueAdapter<bool> controlsSynchronizer;
        private readonly IPropChangedEventAdapterFactory propChangedEventAdapterFactory;

        private readonly IUISettingsRetriever uISettingsRetriever;
        private readonly IUIThemeRetriever uIThemeRetriever;
        private readonly IAppSettings appSettings;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxResxTitleFetchToCB_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxResxMdLinkFetchToCB_EvtAdapter;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        public FetchWebResourceUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                htmlDocTitleRetriever = svcProv.GetRequiredService<IHtmlDocTitleRetriever>();
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();

                controlsSynchronizer = svcProv.GetRequiredService<ISynchronizedValueAdapterFactory>().Create(
                    initialValue: true);

                propChangedEventAdapterFactory = svcProv.GetRequiredService<IPropChangedEventAdapterFactory>();

                uISettingsRetriever = svcProv.GetRequiredService<IUISettingsRetriever>();
                uIThemeRetriever = svcProv.GetRequiredService<IUIThemeRetriever>();
                appSettings = svcProv.GetRequiredService<IAppSettings>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                iconLabelResourceUrl.Text = MatUIIconUnicodesH.UIActions.DOWNLOAD;

                iconLabelResxTitleToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;
                iconLabelResxTitleFetchToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;

                iconLabelResxMdLinkToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;
                iconLabelResxMdLinkFetchToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;

                this.checkBoxResxTitleFetchToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxResxTitleFetchToCB,
                    (source, e, isChecked) =>
                    {
                        toolTipHintsGroup?.UpdateToolTipsText(new ());
                        SetResxTitleFetchToCB(isChecked);
                    },
                    beforeHandler: (source, e, isChecked, evtWasEnabled) => isChecked.If(
                        () => checkBoxResxMdLinkFetchToCB.Checked = false));

                this.checkBoxResxMdLinkFetchToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxResxMdLinkFetchToCB,
                    (source, e, isChecked) =>
                    {
                        toolTipHintsGroup?.UpdateToolTipsText(new());
                        SetResxMdLinkFetchToCB(isChecked);
                    },
                    beforeHandler: (source, e, isChecked, evtWasEnabled) => isChecked.If(
                        () => checkBoxResxTitleFetchToCB.Checked = false));

                uISettingsData = uISettingsRetriever.Data;
            }
        }

        public IconLabel RefUxControl => iconLabelResourceUrl;

        public void GoToWebResourceUrlTool() => textBoxResourceUrl.Focus();

        private async Task FetchResourceAsync()
        {
            ToggleEnableControls(false);

            await actionComponent.ExecuteAsync(new WinFormsAsyncActionOpts<string?>
            {
                OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
                Action = async () =>
                {
                    string url = textBoxResourceUrl.Text.Nullify(true);
                    string? title = null;

                    if (url != null)
                    {
                        title = await htmlDocTitleRetriever.GetResouceTitleAsync(url);

                        textBoxResourceTitle.Text = title;

                        textBoxResourceMdLink.Text = string.Format(
                            appSettings.Data.FetchWebResource.MdLinkTemplate,
                            title, url);
                    }
                    else
                    {
                        throw new TrmrkException(
                            "Please type or paste the resource's url address");
                    }

                    return ActionResultH.Create(title);
                },
                OnUnhandledError = exc => WinFormsMessageTuple.WithOnly(
                    exc.Message, exc.Message),
                OnAfterExecution = result =>
                {
                    ToggleEnableControls(true);

                    if (result.IsSuccess)
                    {
                        if (checkBoxResxTitleFetchToCB.Checked)
                        {
                            CopyResourceTitleToClipboard();
                        }
                        else if (checkBoxResxMdLinkFetchToCB.Checked)
                        {
                            CopyResourceMdLinkToClipboard();
                        }
                    }

                    return null;
                }
            });
        }

        private void CopyResourceTitleToClipboard(
            ) => actionComponent.CopyTextToClipboard(
                controlBlinkTimersManagerAdapter,
                iconLabelResxTitleToCB,
                textBoxResourceTitle.Text);

        private void CopyResourceMdLinkToClipboard(
            ) => actionComponent.CopyTextToClipboard(
                controlBlinkTimersManagerAdapter,
                iconLabelResxMdLinkToCB,
                textBoxResourceMdLink.Text);

        private void SetResxTitleFetchToCB(
            bool enabled) => actionComponent.UpdateAppSettings(
                appSettings, settings => settings.FetchWebResource.ActWith(mtbl =>
                {
                    mtbl.ResxMdLinkFetchToCB = null;

                    mtbl.ResxTitleFetchToCB = enabled.If(
                        () => (bool?)true, () => null);
                }));

        private void SetResxMdLinkFetchToCB(
            bool enabled) => actionComponent.UpdateAppSettings(
                appSettings, settings => settings.FetchWebResource.ActWith(mtbl =>
                {
                    mtbl.ResxTitleFetchToCB = null;

                    mtbl.ResxMdLinkFetchToCB = enabled.If(
                        () => (bool?)true, () => null);
                }));

        private void ToggleEnableControls(bool enable)
        {
            iconLabelResourceUrl.Enabled = enable;
            iconLabelResxTitleToCB.Enabled = enable;
            iconLabelResxMdLinkToCB.Enabled = enable;
            checkBoxResxMdLinkFetchToCB.Enabled = enable;
            checkBoxResxTitleFetchToCB.Enabled = enable;
            textBoxResourceTitle.Enabled = enable;
            textBoxResourceMdLink.Enabled = enable;
            textBoxResourceUrl.Enabled = enable;
        }

        private ToolTipHintsGroupOpts GetToolTipHintsGroupOpts()
        {
            var optsList = new List<ToolTipHintOpts>();

            Func<string> resxTitleFetchToCBHintFactory = () => string.Concat(
                "Click here to ",
                checkBoxResxTitleFetchToCB.Checked ? "dis" : "",
                $"activate the automatic copying of the ",
                "resource's title to clipboard after it has been fetched");

            Func<string> resxMdLinkFetchToCBHintFactory = () => string.Concat(
                "Click here to ",
                checkBoxResxMdLinkFetchToCB.Checked ? "dis" : "",
                $"activate the automatic copying of the ",
                "resource's markdown link to clipboard after it has been fetched");

            optsList.AddRange(iconLabelResourceUrl.HintOpts(
                    () => "Click here to fetch the resource title from this url").Arr(
                iconLabelResxTitleToCB.HintOpts(
                    () => "Click here to copy the resource's title to clipboard"),
                iconLabelResxMdLinkToCB.HintOpts(
                    () => "Click here to copy the resource's markdown link to clipboard"),
                checkBoxResxTitleFetchToCB.HintOpts(
                    resxTitleFetchToCBHintFactory),
                iconLabelResxTitleFetchToCB.HintOpts(
                    resxTitleFetchToCBHintFactory),
                checkBoxResxMdLinkFetchToCB.HintOpts(
                    resxMdLinkFetchToCBHintFactory),
                iconLabelResxMdLinkFetchToCB.HintOpts(
                    resxMdLinkFetchToCBHintFactory),
                textBoxResourceUrl.HintOpts(() => string.Join("\n",
                    "Type or paste here the url of the resource which title you want to get.",
                    "Then press the ENTER key to fetch the url title.",
                    this.checkBoxResxMdLinkFetchToCB.Checked switch
                    {
                        true => "Press the CTRL + SHIFT + ENTER keys to disactivate the automatic copying",
                        false => "Press the CTRL + ENTER keys to activate the automatic copying",
                    },
                    "of the resource markdown link to clipboard and then fetch the resource title")),
                textBoxResourceTitle.HintOpts(() => string.Join("\n",
                    "The resource's title will show up here after it has been fetched.",
                    this.checkBoxResxTitleFetchToCB.Checked switch
                    {
                        true => "Press the CTRL + ENTER keys to disactivate the automatic copying",
                        false => "Press the ENTER key to activate the automatic copying"
                    },
                    "of the resource's title after it has been fetched"
                    )),
                textBoxResourceMdLink.HintOpts(() => string.Join("\n",
                    "The resource's markdown link will show up here after it has been fetched.",
                    this.checkBoxResxMdLinkFetchToCB.Checked switch
                    {
                        true => "Press the CTRL + ENTER keys to disactivate the automatic copying",
                        false => "Press the ENTER key to activate the automatic copying"
                    },
                    "of the resource's markdown link after it has been fetched"
                    ))));

            return new ToolTipHintsGroupOpts
            {
                HintOpts = optsList,
            };
        }

        #region UI Event Handlers

        private void FetchWebResourceUC_Load(object sender, EventArgs e) => actionComponent?.Execute(
            new WinFormsActionOpts<int>
            {
                Action = () =>
                {
                    controlBlinkTimersManagerAdapter = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().Data;

                    uIThemeData = uIThemeRetriever.Data.ActWith(uiTheme =>
                    {
                        uiTheme.ApplyBgColor([
                            this.textBoxResourceUrl,
                            this.textBoxResourceTitle,
                            this.textBoxResourceMdLink,
                            this.checkBoxResxMdLinkFetchToCB,
                            this.checkBoxResxTitleFetchToCB
                        ], uiTheme.InputBackColor);

                        iconLabelResxTitleFetchToCB.ForeColor = uiTheme.InfoIconColor;
                        iconLabelResxMdLinkFetchToCB.ForeColor = uiTheme.InfoIconColor;
                    });

                    appSettings.Data.ActWith(appSettingsData =>
                    {
                        var webResSettingsData = appSettingsData.FetchWebResource;

                        controlsSynchronizer.Execute(false,
                            (wasEnabled) =>
                            {
                                checkBoxResxTitleFetchToCB.Checked = webResSettingsData.ResxTitleFetchToCB ?? false;
                                checkBoxResxMdLinkFetchToCB.Checked = webResSettingsData.ResxMdLinkFetchToCB ?? false;
                            });
                    });

                    toolTipHintsOrchestrator = svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().Data;

                    toolTipHintsOrchestrator.HintGroups.Add(
                        toolTipHintsGroup = GetToolTipHintsGroupOpts().HintsGroup());

                    return ActionResultH.Create(0);
                }
            });

        private void IconLabelResourceUrl_Click(object sender, EventArgs e)
        {
            FetchResourceAsync();
        }

        private void IconLabelResourceTitle_Click(
            object sender, EventArgs e) => CopyResourceTitleToClipboard();

        private void IconLabelTitleResourceMdLink_Click(
            object sender, EventArgs e) => CopyResourceMdLinkToClipboard();

        private void TextBoxResourceUrl_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (e.Control)
                {
                    checkBoxResxMdLinkFetchToCB.Checked = !e.Shift;
                }

                FetchResourceAsync();
            }
        }

        private void TextBoxResourceTitle_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                checkBoxResxTitleFetchToCB.Checked = !e.Control;
            }
        }

        private void TextBoxResourceMdLink_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                checkBoxResxMdLinkFetchToCB.Checked = !e.Control;
            }
        }

        private void IconLabelResxTitleFetchToCB_Click(
            object sender, EventArgs e) => checkBoxResxTitleFetchToCB.ToggleChecked();

        private void IconLabelResxMdLinkFetchToCB_Click(
            object sender, EventArgs e) => checkBoxResxMdLinkFetchToCB.ToggleChecked();

        #endregion UI Event Handlers
    }
}
