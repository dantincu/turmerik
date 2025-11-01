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

        public void FocusControl(Keys key)
        {
            int index = (key - Keys.D0);

            var kvp = urlScripts.FirstKvp(
                (script, _) => script.Index == index);

            if (kvp.Key >= 0)
            {
                urlScriptControls[kvp.Key].FocusTextBox();
            }
        }

        private void ClearTitle()
        {
            urlTitle = null!;
            panelScripts.Controls.Clear();

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
            control.ContentLoading += WebView_ContentLoading;
            control.CoreWebView2InitializationCompleted += WebView_CoreWebView2InitializationCompleted;

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

            this.urlScripts = urlScripts.Select(urlScript => new UrlScript(urlScript)
            {
                Text = urlScript.Factory(item.Url, urlTitle)
            }).ToList();

            urlScriptControls = this.urlScripts.Select(urlScript =>
            {
                var control = new UrlScriptUC();
                control.Dock = DockStyle.Top;
                control.UpdateScript(urlScript);
                control.TextBoxScriptKeyDown += UrlScriptControl_TextBoxScriptKeyDown;
                return control;
            }).ToList();

            panelScripts.Controls.AddRange(
                urlScriptControls.ToArray().Reverse().ToArray());
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

        private void WebView_ContentLoading(object? sender,
            Microsoft.Web.WebView2.Core.CoreWebView2ContentLoadingEventArgs e) => actionComponent.ExecuteAsync(
                new WinFormsAsyncActionOpts<int>
                {
                    ActionName = nameof(WebView_ContentLoading),
                    Action = async () =>
                    {
                        string title = await webView.ExecuteScriptAsync("document.title");
                        title = jsonConversion.Adapter.Deserialize<string>(title);

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
