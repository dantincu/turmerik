using Microsoft.Extensions.DependencyInjection;
using Microsoft.Web.WebView2.WinForms;
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
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Threading;
using Turmerik.Core.Utility;
using Turmerik.Utility.WinFormsApp.Services.FetchMultipleLinks;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.Helpers;
using Turmerik.WinForms.MatUIIcons;
using Turmerik.Core.Helpers;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class FetchLinkUrlItemUC : UserControl, IFetchLinkItemUC
    {
        private static readonly string splitContainerMainWidthRatiosMapKey = string.Format(
            "[{0}][{0}]",
            typeof(FetchLinkUrlItemUC).FullName,
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

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        private FetchLinkDataUrlItemMtbl item;

        private WebView2 webView;

        private bool splitContainerWidthsInitialized;

        public FetchLinkUrlItemUC()
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

        public void SetItem(FetchLinkDataItemCoreMtbl item)
        {
            this.item = (FetchLinkDataUrlItemMtbl)item;
            webView ??= GetWebView2();

            if (this.item.Url.StartsWith("https://") || DialogResult.Yes == MessageBox.Show(
                "The url you chose to open doesn't start with https://\nAre you sure you want to open it?",
                "Warning", MessageBoxButtons.YesNo, MessageBoxIcon.Warning))
            {
                webView.Source = new Uri(this.item.Url);
            }
        }

        public void FocusControl(Keys key)
        {

        }

        public void ReleaseResources()
        {
            if (webView != null)
            {
                panelWebView.Controls.Remove(webView);
                webView.Dispose();
                webView = null!;
            }
        }

        private WebView2 GetWebView2()
        {
            var control = new WebView2()
            {
                Dock = DockStyle.Fill,
            };

            control.SourceChanged += WebView_SourceChanged;
            panelWebView.Controls.Add(control);
            return control;
        }

        #region UI Event Handlers

        private void FetchLinkUrlItemUC_Load(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(FetchLinkUrlItemUC_Load),
            Action = () =>
            {
                splitContainerMain.ApplySplitContainerWidthRatioIfFound(
                    uISettingsData, splitContainerMainWidthRatiosMapKey);

                splitContainerWidthsInitialized = true;
                return ActionResultH.Create(0);
            }
        });

        private void WebView_SourceChanged(object? sender, Microsoft.Web.WebView2.Core.CoreWebView2SourceChangedEventArgs e)
        {
            textBoxWebViewAddress.Text = webView.Source.ToString();
        }

        private void SplitContainerMain_SplitterMoved(object sender, SplitterEventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(SplitContainerMain_SplitterMoved),
            Action = () =>
            {
                if (splitContainerWidthsInitialized)
                {
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
