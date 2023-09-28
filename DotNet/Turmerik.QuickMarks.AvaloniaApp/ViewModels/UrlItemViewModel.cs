using Avalonia.Controls;
using Avalonia.Media;
using HtmlAgilityPack;
using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.QuickMarks.AvaloniaApp.ViewModels
{
    public class UrlItemViewModel : ViewModelBase, IRoutableViewModel
    {
        // private UserMsgObservable userMsgObservable;

        private string rawUrl;
        private string resourceTitle;
        private string titleAndUrl;
        private string outputText;
        private string description;
        private IBrush outputTextForeground;

        public UrlItemViewModel(IScreen hostScreen)
        {
            HostScreen = hostScreen;
            TitleAndUrlTemplate = "[{0}]({1})";
            // userMsgObservable = new UserMsgObservable();

            Fetch = CreateFetchCommand();
            RawUrlToClipboard = CreateRawUrlToClipboardCommand();
            ResourceTitleToClipboard = CreateResourceTitleToClipboardCommand();
            TitleAndUrlToClipboard = CreateTitleAndUrlToClipboardCommand();
            RawUrlFromClipboard = CreateRawUrlFromClipboardCommand();
            ShowUserMsg = CreateShowUserMsgCommand();

            DefaultOutputTextForeground = AppGlobals.DefaultOutputTextForeground;
            SuccessOutputTextForeground = AppGlobals.SuccessOutputTextForeground;
            ErrorOutputTextForeground = AppGlobals.ErrorOutputTextForeground;
            DefaultMaterialIconsForeground = AppGlobals.DefaultMaterialIconsForeground;
        }

        public string? UrlPathSegment { get; } = Guid.NewGuid().ToString().Substring(0, 5);

        public IScreen HostScreen { get; }

        public string RawUrl
        {
            get => rawUrl;

            set => this.RaiseAndSetIfChanged(
                ref rawUrl,
                value);
        }

        public string ResourceTitle
        {
            get => resourceTitle;

            set => this.RaiseAndSetIfChanged(
                ref resourceTitle,
                value);
        }

        public string TitleAndUrl
        {
            get => titleAndUrl;

            set => this.RaiseAndSetIfChanged(
                ref titleAndUrl,
                value);
        }

        public string TitleAndUrlTemplate { get; set; }

        public string OutputText
        {
            get => outputText;

            set => this.RaiseAndSetIfChanged(
                ref outputText,
                value);
        }

        public string Description
        {
            get => description;

            set => this.RaiseAndSetIfChanged(
                ref description,
                value);
        }

        public IBrush OutputTextForeground
        {
            get => outputTextForeground;

            set
            {
                this.RaiseAndSetIfChanged(
                    ref outputTextForeground,
                    value);
            }
        }

        public ReactiveCommand<Unit, Unit> Fetch { get; }
        public ReactiveCommand<Unit, Unit> RawUrlToClipboard { get; }
        public ReactiveCommand<Unit, Unit> ResourceTitleToClipboard { get; }
        public ReactiveCommand<Unit, Unit> TitleAndUrlToClipboard { get; }
        public ReactiveCommand<Unit, Unit> RawUrlFromClipboard { get; }

        public ReactiveCommand<UserMsgTuple, Unit> ShowUserMsg { get; }

        private IBrush DefaultOutputTextForeground { get; set; }
        private IBrush SuccessOutputTextForeground { get; set; }
        private IBrush ErrorOutputTextForeground { get; set; }
        private IBrush DefaultMaterialIconsForeground { get; set; }

        private ReactiveCommand<Unit, Unit> CreateFetchCommand() => ReactiveCommand.Create(
            () =>
            {
                FetchResourceAsync(
                    async () => RawUrl,
                    string.Empty,
                    exc => $"Something went wrong: {exc.Message}",
                    false);
            });

        private ReactiveCommand<Unit, Unit> CreateRawUrlToClipboardCommand() => ReactiveCommand.Create(
            () => { RawUrlToClipboardAsync(); });

        private ReactiveCommand<Unit, Unit> CreateResourceTitleToClipboardCommand() => ReactiveCommand.Create(
            () => { ResourceTitleToClipboardAsync(); });

        private ReactiveCommand<Unit, Unit> CreateTitleAndUrlToClipboardCommand() => ReactiveCommand.Create(
            () => { TitleAndUrlToClipboardAsync(); });

        private ReactiveCommand<Unit, Unit> CreateRawUrlFromClipboardCommand() => ReactiveCommand.Create(
            () =>
            {
                FetchResourceAsync(
                    TopLevel.Clipboard.GetTextAsync,
                    "Retrieving the url from clipboard...",
                    exc => $"Could not the url from clipboard: {exc.Message}",
                    true);
            });

        private ReactiveCommand<UserMsgTuple, Unit> CreateShowUserMsgCommand(
            ) => ReactiveCommand.Create<UserMsgTuple>(
                msgTuple =>
                {
                    ShowUserMessage(msgTuple);
                }/* ,
                userMsgObservable*/);

        private void ShowUserMessage(UserMsgTuple msgTuple)
        {
            OutputText = msgTuple.Message;

            if (msgTuple.IsSuccess.HasValue)
            {
                if (msgTuple.IsSuccess.Value)
                {
                    OutputTextForeground = SuccessOutputTextForeground;
                }
                else
                {
                    OutputTextForeground = ErrorOutputTextForeground;
                }
            }
            else
            {
                OutputTextForeground = DefaultOutputTextForeground;
            }
        }

        private void ShowUserMessage(
            string text,
            bool? isSuccess)
        {
            using (_ = ShowUserMsg.Execute(
                new UserMsgTuple(
                    text,
                    isSuccess)).Subscribe()) ;
        }

        private Task RawUrlToClipboardAsync() => CopyToClipboardAsync("provided url", RawUrl);
        private Task ResourceTitleToClipboardAsync() => CopyToClipboardAsync("title", ResourceTitle);
        private Task TitleAndUrlToClipboardAsync() => CopyToClipboardAsync("title and url", TitleAndUrl);

        private async Task CopyToClipboardAsync(
            string objectName,
            string objectText)
        {
            try
            {
                ShowUserMessage($"Copying the {objectName} to clipboard...", null);
                await TopLevel.Clipboard.SetTextAsync(objectText);
                ShowUserMessage($"Copied the {objectName} to clipboard", true);
            }
            catch (Exception exc)
            {
                ShowUserMessage($"Could not copy the {objectName} to clipboard: {exc.Message}", false);
            }
        }

        private async Task<string> TryGetRawUrl(
            Func<Task<string>> rawUrlRetriever,
            string initMsg,
            Func<Exception, string> retrieveUrlErrMsgFactory)
        {
            string rawUrl = null;

            try
            {
                ShowUserMessage(initMsg, null);
                rawUrl = await rawUrlRetriever();

                if (string.IsNullOrWhiteSpace(rawUrl))
                {
                    ShowUserMessage("The provided url is empty", false);
                }
            }
            catch (Exception exc)
            {
                ShowUserMessage(retrieveUrlErrMsgFactory(exc), false);
            }

            await Task.Delay(1000);
            return rawUrl;
        }

        private Uri TryGetUriIfReq(string rawUrl)
        {
            Uri uri = null;

            if (rawUrl != null)
            {
                try
                {
                    ShowUserMessage("Validating the provided url...", null);
                    uri = new Uri(rawUrl);
                }
                catch (Exception exc)
                {
                    ShowUserMessage($"The provided url is invalid: {exc.Message}", false);
                }
            }

            return uri;
        }

        private async Task<string> FetchResourceIfReqCoreAsync(Uri uri)
        {
            string title = null;

            if (uri != null)
            {
                try
                {
                    ShowUserMessage("Retrieving the resource from url...", null);

                    var web = new HtmlWeb();
                    var doc = web.Load(uri);

                    title = GetResourceTitle(doc);
                }
                catch (Exception exc)
                {
                    ShowUserMessage($"Could not retrieve the resource from url: {exc.Message}", false);
                }
            }

            return title;
        }

        private string GetResourceTitle(HtmlDocument doc)
        {
            var titleNode = GetChildNode(
                doc.DocumentNode.ChildNodes,
                new HtmlNodeOpts[]
                {
                new HtmlNodeOpts("html"),
                new HtmlNodeOpts("head"),
                new HtmlNodeOpts("title")
                });

            string title = titleNode?.InnerText;
            return title;
        }

        private HtmlNode GetChildNode(
            HtmlNodeCollection nodes,
            HtmlNodeOpts[] optsArr)
        {
            HtmlNode retNode = GetChildNode(nodes, optsArr[0]);

            if (retNode != null)
            {
                foreach (var opts in optsArr.Skip(1))
                {
                    retNode = GetChildNode(retNode.ChildNodes, opts);

                    if (retNode == null)
                    {
                        break;
                    }
                }
            }

            return retNode;
        }

        private HtmlNode GetChildNode(
            HtmlNodeCollection nodes,
            HtmlNodeOpts opts)
        {
            HtmlNode retNode = null;

            foreach (var node in nodes)
            {
                bool matches = node.GetType() == typeof(HtmlNode);
                matches = matches && node.Name == opts.NodeName;

                matches = matches && (opts.Predicate?.Invoke(node) ?? true);

                if (matches)
                {
                    retNode = node;
                    break;
                }
            }

            return retNode;
        }

        private async Task FetchResourceAsync(
            Func<Task<string>> rawUrlRetriever,
            string initMsg,
            Func<Exception, string> retrieveUrlErrMsgFactory,
            bool copyResultToClipboard)
        {
            string rawUrl = await TryGetRawUrl(
                rawUrlRetriever,
                initMsg,
                retrieveUrlErrMsgFactory);

            if (copyResultToClipboard)
            {
                RawUrl = rawUrl;
            }

            Uri uri = TryGetUriIfReq(rawUrl);
            string title = await FetchResourceIfReqCoreAsync(uri);

            await SetResourceTitleIfReqAsync(
                title,
                copyResultToClipboard);
        }

        private async Task SetResourceTitleIfReqAsync(
            string title,
            bool copyResultToClipboard)
        {
            if (title != null)
            {
                SetResourceTitleCore(title);

                if (copyResultToClipboard)
                {
                    await TitleAndUrlToClipboardAsync();
                }
                else
                {
                    ShowUserMessage("Retrieved the resource from url", true);
                }
            }
        }

        private void SetResourceTitleCore(string title)
        {
            ResourceTitle = title;

            TitleAndUrl = string.Format(
                TitleAndUrlTemplate,
                ResourceTitle,
                RawUrl);
        }
    }
}
