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
using Turmerik.Core.Helpers;
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

        private WebView2 webView;
        private bool splitContainerMainSplitterMoving;

        private FetchLinkDataUrlItemMtbl item;
        private string? urlTitle;
        private List<UrlScript> urlScripts;
        private List<UrlScriptUC> urlScriptControls;
        private UrlScriptUC focusedUrlScriptControl;

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
            tableLayoutPanelScripts.RowCount = 0;

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
            ClearTitle();
            webView ??= GetWebView2();

            if (this.item.Url.StartsWith("https://") || DialogResult.Yes == MessageBox.Show(
                "The url you chose to open doesn't start with https://\nAre you sure you want to open it?",
                "Warning", MessageBoxButtons.YesNo, MessageBoxIcon.Warning))
            {
                var url = new Uri(this.item.Url);

                if (webView.Source != null && webView.Source.Equals(url))
                {
                    webView.Reload();
                }
                else
                {
                    webView.Source = url;
                }
            }
            else
            {
                SetUrlTitle(null);
            }
        }

        public void UnsetItem()
        {
            this.item = null;
            ClearTitle();

            if (webView != null)
            {
                panelWebView.Controls.Remove(webView);
                webView.Dispose();
                webView = null!;
            }
        }

        public void HandleKeyDown(KeyEventArgs e)
        {
            if (e.Control && !e.Alt && e.KeyCode >= Keys.D0 && e.KeyCode <= Keys.D9)
            {
                int index = (e.KeyCode - Keys.D0);

                var matchingControls = urlScriptControls.Where(
                    control => control.UrlScript.Index % 10 == index).ToList();

                UrlScriptUC? matchingUC = matchingControls.FirstOrDefault();
                int matchingControlsCount = matchingControls.Count;

                if (matchingControlsCount > 2)
                {
                    if (focusedUrlScriptControl?.UrlScript.Index % 10 == index)
                    {
                        int idx = matchingControls.IndexOf(focusedUrlScriptControl!);

                        if (idx < matchingControlsCount - 2)
                        {
                            matchingUC = matchingControls[idx + 1];
                        }
                        else
                        {
                            matchingUC = matchingControls[0];
                        }
                    }
                }

                if (matchingUC != null)
                {
                    focusedUrlScriptControl = matchingUC;
                    matchingUC.FocusTextBox();
                }
            }
        }

        private void ClearTitle()
        {
            urlTitle = null!;
            tableLayoutPanelScripts.Controls.Clear();

            if (urlScriptControls != null)
            {
                foreach (var control in urlScriptControls)
                {
                    control.ReleaseResources();
                }
            }

            urlScripts = new();
            urlScriptControls = new();
        }

        private WebView2 GetWebView2()
        {
            var control = new WebView2()
            {
                Dock = DockStyle.Fill,
            };

            control.SourceChanged += WebView_SourceChanged;
            control.CoreWebView2InitializationCompleted += WebView_CoreWebView2InitializationCompleted;
            control.NavigationCompleted += WebView_NavigationCompleted;

            panelWebView.Controls.Add(control);
            return control;
        }

        private void SetUrl(string url)
        {
            SetItem(new FetchLinkDataUrlItemMtbl(item)
            {
                Text = url,
                Url = url,
            });
        }

        private void SetUrlTitle(string? title)
        {
            ClearTitle();
            urlTitle = title;

            var urlScripts = fetchMultipleLinksService.UrlScripts;

            if (urlTitle == null)
            {
                urlTitle = item.Url;
                urlScripts = urlScripts.First().Arr().RdnlC();
            }

            this.urlScripts = urlScripts.ToList();

            urlScriptControls = this.urlScripts.Select(urlScript =>
            {
                var control = new UrlScriptUC();
                control.Dock = DockStyle.Top;

                control.UpdateScript(
                    urlScript, new (
                        item.Url, urlTitle,
                        textBoxWebViewAddress.Text));

                control.TextBoxScriptKeyDown += UrlScriptControl_TextBoxScriptKeyDown;
                tableLayoutPanelScripts.Controls.Add(control);
                return control;
            }).ToList();

            for (int i = 0; i < urlScriptControls.Count; i++)
            {
                var control = urlScriptControls[i];
                tableLayoutPanelScripts.Controls.SetChildIndex(control, i);
            }
        }

        private void UrlScriptControl_TextBoxScriptKeyDown(
            UrlScriptUC sender, KeyEventArgs evt, string text) => actionComponent.Execute(
                new WinFormsActionOpts<int>
        {
            ActionName = nameof(UrlScriptControl_TextBoxScriptKeyDown),
            Action = () =>
            {
                if (evt.Control && evt.KeyCode == Keys.Enter && !evt.Alt && !evt.Shift)
                {
                    if (sender.UrlScript.IsUrl)
                    {
                        SetUrl(text);
                    }
                    else if (sender.UrlScript.IsTitle)
                    {
                        SetUrlTitle(text);
                    }
                }

                return ActionResultH.Create(0);
            }
        });

        private async Task<string> GetWebViewTitleAsync()
        {
            string title = await webView.ExecuteScriptAsync(
                "document.getElementsByTagName('title')[0]?.innerText ?? document.title ?? \"\"");

            title = jsonConversion.Adapter.Deserialize<string>(title);
            return title;
        }

        #region UI Event Handlers

        private void FetchLinkUrlItemUC_Load(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(FetchLinkUrlItemUC_Load),
            Action = () =>
            {
                splitContainerMain.ApplySplitContainerWidthRatioIfFound(
                    uISettingsData, splitContainerMainWidthRatiosMapKey);

                return ActionResultH.Create(0);
            }
        });

        private void WebView_SourceChanged(object? sender, Microsoft.Web.WebView2.Core.CoreWebView2SourceChangedEventArgs e)
        {
            textBoxWebViewAddress.Text = webView.Source.ToString();
        }

        private void WebView_NavigationCompleted(object? sender,
            Microsoft.Web.WebView2.Core.CoreWebView2NavigationCompletedEventArgs e) => actionComponent.ExecuteAsync(
                new WinFormsAsyncActionOpts<int>
                {
                    ActionName = nameof(WebView_NavigationCompleted),
                    Action = async () =>
                    {
                        string title = await GetWebViewTitleAsync();
                        SetUrlTitle(title);
                        return ActionResultH.Create(0);
                    }
                });

        private void WebView_CoreWebView2InitializationCompleted(
            object? sender,
            Microsoft.Web.WebView2.Core.CoreWebView2InitializationCompletedEventArgs e)
        {
            if (e.IsSuccess)
            {
                webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(@"
                    document.addEventListener('keydown', function(e) {
                        const obj = [
                            'keydown',
                            {
                                Key: e.key,
                                CtrlKey: e.ctrlKey,
                                AltKey: e.altKey,
                                ShiftKey: e.shiftKey
                            }
                        ];

                        window.chrome.webview.postMessage(obj);
                    });
                ");

                webView.CoreWebView2.WebMessageReceived += WebView_WebMessageReceived;
            }
        }

        private void WebView_WebMessageReceived(
            object? sender, Microsoft.Web.WebView2.Core.CoreWebView2WebMessageReceivedEventArgs e)
        {
            try
            {
                string message = e.WebMessageAsJson;
                int idx = message.IndexOf(",");
                string msgTypeStr = message.Substring(1, idx - 1);
                string msgJsonStr = message.Substring(idx + 1, message.Length - idx - 2);

                string msgType = jsonConversion.Adapter.Deserialize<string>(msgTypeStr);
                string msgJson = msgJsonStr;

                switch (msgType)
                {
                    case "keydown":
                        var keyDownMsg = jsonConversion.Adapter.Deserialize<WebViewKeyDownMessage>(msgJson);

                        if (keyDownMsg.CtrlKey && !keyDownMsg.AltKey && !keyDownMsg.MetaKey && keyDownMsg.Key == "Q")
                        {
                            textBoxWebViewAddress.Focus();
                            textBoxWebViewAddress.SelectAll();
                        }

                        break;
                }
            }
            catch
            {
            }
        }

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

        public class WebViewKeyDownMessage
        {
            public string Key { get; set; }
            public bool CtrlKey { get; set; }
            public bool AltKey { get; set; }
            public bool ShiftKey { get; set; }
            public bool MetaKey { get; set; }
        }
    }
}
