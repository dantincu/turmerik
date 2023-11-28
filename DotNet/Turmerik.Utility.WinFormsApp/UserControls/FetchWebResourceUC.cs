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
using Turmerik.Utility.WinFormsApp.ViewModels;
using Turmerik.Ux;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class FetchWebResourceUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IControlBlinkTimersManager controlBlinkTimersManager;
        private readonly IFetchWebResourceWM viewModel;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ISynchronizedValueAdapter<bool> controlsSynchronizer;
        private readonly IPropChangedEventAdapterFactory propChangedEventAdapterFactory;

        private readonly UISettingsRetriever uISettingsRetriever;
        private readonly IAppSettings appSettings;

        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxResxTitleFetchToCB_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxResxMdLinkFetchToCB_EvtAdapter;

        private readonly Color defaultBackColor;
        private readonly Color defaultForeColor;

        private UISettingsDataImmtbl uISettingsData;

        private ControlBlinkTimerOptsImmtbl inconsClickSuccessBlinkTimerOpts;
        private ControlBlinkTimerOptsImmtbl inconsClickErrorBlinkTimerOpts;

        public FetchWebResourceUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                controlBlinkTimersManager = svcProv.GetRequiredService<IControlBlinkTimersManager>();
                viewModel = svcProv.GetRequiredService<IFetchWebResourceWM>();
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();

                controlsSynchronizer = svcProv.GetRequiredService<ISynchronizedValueAdapterFactory>().Create(
                    initialValue: true);

                propChangedEventAdapterFactory = svcProv.GetRequiredService<IPropChangedEventAdapterFactory>();

                uISettingsRetriever = svcProv.GetRequiredService<UISettingsRetriever>();
                appSettings = svcProv.GetRequiredService<IAppSettings>();
            }

            InitializeComponent();

            defaultBackColor = iconLabelResourceUrl.BackColor;
            defaultForeColor = iconLabelResourceUrl.ForeColor;

            if (svcProvContnr.IsRegistered)
            {
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
            }

            uISettingsRetriever.SubscribeToData(OnUISettingsData);
        }

        private void OnUISettingsData(UISettingsDataImmtbl uISettingsData)
        {
            this.uISettingsData = uISettingsData;

            inconsClickSuccessBlinkTimerOpts = GetControlBlinkTimerOpts(
                opts =>
                {
                    opts.ForeColor = uISettingsData.SuccessColor;
                }).ToImmtbl();

            inconsClickErrorBlinkTimerOpts = GetControlBlinkTimerOpts(
                opts =>
                {
                    opts.ForeColor = uISettingsData.ErrorColor;
                }).ToImmtbl();

            uISettingsData.ApplyBgColor([this,
                textBoxResourceMdLink,
                textBoxResourceTitle,
                textBoxResourceUrl]);

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
            iconLabelResourceUrl.ForeColor = Color.FromArgb(0, 0, 255);

            (await viewModel.FetchResourceAsync(
                textBoxResourceUrl.Text)).ActWith(result =>
                {
                    ToggleEnableControls(true);
                    iconLabelResourceUrl.ForeColor = defaultForeColor;
                });
        }

        private void CopyResourceTitleToClipboard()
        {

        }

        private void CopyResourceMdLinkToClipboard()
        {

        }

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

        private ControlBlinkTimerOptsMtbl GetControlBlinkTimerOpts(
            Action<ControlBlinkTimerOptsMtbl> callback = null) => ControlBlinkTimerOptsMtbl.WithControlInitialColors(
                iconLabelResourceUrl, opts =>
                {
                    opts.IntervalLength = uISettingsData.SlowBlinkIntervalMillis;
                    opts.IntervalsCount = 2;

                    callback?.Invoke(opts);
                });

        private void BlinkIconLabel(
            IconLabel iconLabel,
            IActionResult result)
        {
            var optsMtbl = GetControlBlinkTimerOptsMtbl(
                iconLabel, result.IsSuccess);

            controlBlinkTimersManager.Blink(optsMtbl);
        }

        private void BlinkIconLabel(
            IconLabel iconLabel,
            bool isSuccess)
        {
            var optsMtbl = GetControlBlinkTimerOptsMtbl(
                iconLabel, isSuccess);

            controlBlinkTimersManager.Blink(optsMtbl);
        }

        private ControlBlinkTimerOptsMtbl GetControlBlinkTimerOptsMtbl(
            IconLabel iconLabel,
            bool isSuccess) => GetControlBlinkTimerOptsImmtbl(
                isSuccess).With(immtbl => new ControlBlinkTimerOptsMtbl(immtbl)
                {
                    Control = iconLabel
                });

        private ControlBlinkTimerOptsImmtbl GetControlBlinkTimerOptsImmtbl(
            bool isSuccess) => isSuccess switch
            {
                true => inconsClickSuccessBlinkTimerOpts,
                false => inconsClickErrorBlinkTimerOpts
            };

        #region UI Event Handlers

        private void IconLabelResourceUrl_Click(object sender, EventArgs e)
        {
            FetchResourceAsync();
        }

        private void IconLabelResourceTitle_Click(object sender, EventArgs e)
        {

        }

        private void IconLabelTitleResourceMdLink_Click(object sender, EventArgs e)
        {

        }

        private void TextBoxResourceUrl_KeyUp(object sender, KeyEventArgs e)
        {

        }

        private void TextBoxResourceTitle_KeyUp(object sender, KeyEventArgs e)
        {

        }

        private void TextBoxResourceMdLink_KeyUp(object sender, KeyEventArgs e)
        {

        }

        private void IconLabelResxTitleFetchToCB_Click(object sender, EventArgs e)
        {
            checkBoxResxTitleFetchToCB.Checked = true;
        }

        private void IconLabelResxMdLinkFetchToCB_Click(object sender, EventArgs e)
        {
            checkBoxResxMdLinkFetchToCB.Checked = true;
        }

        #endregion UI Event Handlers
    }
}
