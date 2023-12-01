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

        private readonly ToolTip toolTip;
        private readonly ReadOnlyCollection<ControlToolTipTuple> toolTipTuples;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;

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
            toolTip = new ToolTip();

            toolTipTuples = iconLabelResourceUrl.ToolTipTuple(
                    "Click here to fetch the resource from this url").Arr(
                iconLabelResxTitleToCB.ToolTipTuple(
                    "Click here to copy this title to clipboard"),
                iconLabelResxMdLinkToCB.ToolTipTuple(
                    "Click here to copy this markdown link to clipboard"),
                iconLabelResxTitleFetchToCB.ToolTipTuple(string.Concat(
                    "Click here to enable or disable automatic copying of the resource title",
                    "to clipboard after the resource has been fetched")),
                iconLabelResxTitleFetchToCB.ToolTipTuple(string.Concat(
                    "Click here to enable or disable automatic copying of the resource markdown link",
                    "to clipboard after the resource has been fetched"))).RdnlC();

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
                    (source, e, isChecked) => SetResxTitleFetchToCB(isChecked),
                    beforeHandler: (source, e, isChecked, evtWasEnabled) => isChecked.If(
                        () => checkBoxResxMdLinkFetchToCB.Checked = false));

                this.checkBoxResxMdLinkFetchToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxResxMdLinkFetchToCB,
                    (source, e, isChecked) => SetResxMdLinkFetchToCB(isChecked),
                    beforeHandler: (source, e, isChecked, evtWasEnabled) => isChecked.If(
                        () => checkBoxResxTitleFetchToCB.Checked = false));

                uISettingsData = uISettingsRetriever.Data;
            }
        }

        public IconLabel RefUxControl => iconLabelResourceUrl;

        public void ShowHints(
            ToolTipDelayImmtbl toolTipDelay)
        {
            bool isEnabled = toolTip.UpdateToolTip(
                toolTipDelay,
                toolTipTuples);
        }

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

        #region UI Event Handlers

        private void FetchWebResourceUC_Load(object sender, EventArgs e) => actionComponent.Execute(
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
