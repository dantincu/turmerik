﻿using Microsoft.Extensions.DependencyInjection;
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

        private readonly UISettingsRetriever uISettingsRetriever;
        private readonly IAppSettings appSettings;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxResxTitleFetchToCB_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxResxMdLinkFetchToCB_EvtAdapter;

        private UISettingsDataImmtbl uISettingsData;
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

                uISettingsRetriever = svcProv.GetRequiredService<UISettingsRetriever>();
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
                    (source, e, isChecked) => SetResxTitleFetchToCB(isChecked),
                    beforeHandler: (source, e, isChecked, evtWasEnabled) => isChecked.If(
                        () => checkBoxResxMdLinkFetchToCB.Checked = false));

                this.checkBoxResxMdLinkFetchToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxResxMdLinkFetchToCB,
                    (source, e, isChecked) => SetResxMdLinkFetchToCB(isChecked),
                    beforeHandler: (source, e, isChecked, evtWasEnabled) => isChecked.If(
                        () => checkBoxResxTitleFetchToCB.Checked = false));

                uISettingsRetriever.SubscribeToData(OnUISettingsData);
            }
        }

        public IconLabel RefUxControl => iconLabelResourceUrl;

        private void OnUISettingsData(UISettingsDataImmtbl uISettingsData)
        {
            this.uISettingsData = uISettingsData;
            controlBlinkTimersManagerAdapter = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().Data;
            iconLabelResxTitleFetchToCB.ForeColor = uISettingsData.InfoIconColor;
            iconLabelResxMdLinkFetchToCB.ForeColor = uISettingsData.InfoIconColor;

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

        private void CopyResourceTitleToClipboard() => actionComponent.Execute(new WinFormsActionOpts<string?>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                string? title = textBoxResourceTitle.Text.Nullify(true)?.ActWith(title =>
                {
                    Clipboard.SetText(title);
                });

                return ActionResultH.Create(title);
            }
        }).ActWith(result => controlBlinkTimersManagerAdapter.BlinkIconLabel(
            iconLabelResxTitleToCB,
            result,
            result.Value != null));

        private void CopyResourceMdLinkToClipboard() => actionComponent.Execute(new WinFormsActionOpts<string?>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                string? title = textBoxResourceMdLink.Text.Nullify(true)?.ActWith(title =>
                {
                    Clipboard.SetText(title);
                });

                return ActionResultH.Create(title);
            }
        }).ActWith(result => controlBlinkTimersManagerAdapter.BlinkIconLabel(
            iconLabelResxMdLinkToCB,
            result,
            result.Value != null));

        private void SetResxTitleFetchToCB(
            bool enabled)
        {
            appSettings.Update((ref AppSettingsDataMtbl mtbl) =>
            {
                var webResSettingsData = mtbl.FetchWebResource;
                webResSettingsData.ResxMdLinkFetchToCB = null;

                webResSettingsData.ResxTitleFetchToCB = enabled.If(
                    () => (bool?)true, () => null);
            });
        }

        private void SetResxMdLinkFetchToCB(
            bool enabled)
        {
            appSettings.Update((ref AppSettingsDataMtbl mtbl) =>
            {
                var webResSettingsData = mtbl.FetchWebResource;
                webResSettingsData.ResxTitleFetchToCB = null;

                webResSettingsData.ResxMdLinkFetchToCB = enabled.If(
                    () => (bool?)true, () => null);
            });
        }

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