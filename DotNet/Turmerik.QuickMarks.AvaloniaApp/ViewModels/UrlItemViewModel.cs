using Avalonia.Controls;
using Avalonia.Media;
using HtmlAgilityPack;
using Microsoft.Extensions.DependencyInjection;
using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Async;
using Turmerik.Text;
using Turmerik.Helpers;
using System.Collections.Concurrent;
using System.Collections;
using Turmerik.Actions;

namespace Turmerik.QuickMarks.AvaloniaApp.ViewModels
{
    public class UrlItemViewModel : ViewModelBase, IRoutableViewModel
    {
        private readonly IAsyncMessageQueuer<UserMsgTuple> asyncMessageQueuer;

        private string rawUrl;
        private string resourceTitle;
        private string titleAndUrl;
        private string outputText;
        private string description;
        private IBrush outputTextForeground;

        public UrlItemViewModel(IScreen hostScreen)
        {
            HostScreen = hostScreen;
            this.asyncMessageQueuer = SvcProv.GetRequiredService<IAsyncMessageQueuerFactory>(
                ).Queuer<UserMsgTuple>(
                userMsgTuple => ShowUserMessage(
                    userMsgTuple));

            TitleAndUrlTemplate = "[{0}]({1})";

            Fetch = CreateFetchCommand();
            RawUrlToClipboard = CreateRawUrlToClipboardCommand();
            ResourceTitleToClipboard = CreateResourceTitleToClipboardCommand();
            TitleAndUrlToClipboard = CreateTitleAndUrlToClipboardCommand();
            RawUrlFromClipboard = CreateRawUrlFromClipboardCommand();

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

        private IBrush DefaultOutputTextForeground { get; set; }
        private IBrush SuccessOutputTextForeground { get; set; }
        private IBrush ErrorOutputTextForeground { get; set; }
        private IBrush DefaultMaterialIconsForeground { get; set; }

        private ReactiveCommand<Unit, Unit> CreateFetchCommand() => ReactiveCommand.Create(
            () =>
            {
                asyncMessageQueuer.ExecuteAsync(
                    queue => FetchResourceAsync(
                        queue,
                        async () => RawUrl,
                        "Fetching the resource from the provided url...",
                        exc => $"Could not retrieve the resource from the provided url: {exc.Message}",
                        false));
            });

        private ReactiveCommand<Unit, Unit> CreateRawUrlToClipboardCommand() => ReactiveCommand.Create(
            () =>
            {
                asyncMessageQueuer.ExecuteAsync(
                    queue => RawUrlToClipboardAsync(queue));
            });

        private ReactiveCommand<Unit, Unit> CreateResourceTitleToClipboardCommand() => ReactiveCommand.Create(
            () =>
            {
                asyncMessageQueuer.ExecuteAsync(
                    queue => ResourceTitleToClipboardAsync(queue));
            });

        private ReactiveCommand<Unit, Unit> CreateTitleAndUrlToClipboardCommand() => ReactiveCommand.Create(
            () =>
            {
                asyncMessageQueuer.ExecuteAsync(
                    queue => TitleAndUrlToClipboardAsync(queue));
            });

        private ReactiveCommand<Unit, Unit> CreateRawUrlFromClipboardCommand() => ReactiveCommand.Create(
            () =>
            {
                asyncMessageQueuer.ExecuteAsync(
                    queue => FetchResourceAsync(
                        queue,
                        TopLevel.Clipboard.GetTextAsync,
                        "Fetching the resource using the url from clipboard...",
                        exc => $"Could not retrieve the resource using the url from clipboard: {exc.Message}",
                        true));
            });

        private void ShowUserMessage(
            UserMsgTuple msgTuple)
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
            ConcurrentQueue<UserMsgTuple> queue,
            string text,
            bool? isSuccess)
        {
            var tuple = new UserMsgTuple(
                text,
                isSuccess);

            queue.Enqueue(tuple);
            ShowUserMessage(tuple);
        }

        private Task RawUrlToClipboardAsync(
            ConcurrentQueue<UserMsgTuple> queue) => CopyToClipboardAsync(
            queue, "provided url", RawUrl);

        private Task ResourceTitleToClipboardAsync(
            ConcurrentQueue<UserMsgTuple> queue) => CopyToClipboardAsync(
            queue, "title", ResourceTitle);

        private Task TitleAndUrlToClipboardAsync(
            ConcurrentQueue<UserMsgTuple> queue) => CopyToClipboardAsync(
            queue, "title and url", TitleAndUrl);

        private async Task CopyToClipboardAsync(
            ConcurrentQueue<UserMsgTuple> queue,
            string objectName,
            string objectText)
        {
            try
            {
                ShowUserMessage(queue, $"Copying the {objectName} to clipboard...", null);
                await TopLevel.Clipboard.SetTextAsync(objectText);
                ShowUserMessage(queue, $"Copied the {objectName} to clipboard", true);
            }
            catch (Exception exc)
            {
                ShowUserMessage(queue,
                    $"Could not copy the {objectName} to clipboard: {exc.Message}", false);
            }
        }

        private async Task<string> TryGetRawUrl(
            ConcurrentQueue<UserMsgTuple> queue,
            Func<Task<string>> rawUrlRetriever,
            string initMsg,
            Func<Exception, string> retrieveUrlErrMsgFactory)
        {
            string rawUrl = null;

            try
            {
                ShowUserMessage(queue, initMsg, null);

                rawUrl = await rawUrlRetriever();

                if (string.IsNullOrWhiteSpace(rawUrl))
                {
                    ShowUserMessage(queue, "The provided url is empty", false);
                }
            }
            catch (Exception exc)
            {
                ShowUserMessage(queue,
                    retrieveUrlErrMsgFactory(exc), false);
            }

            await Task.Delay(1000);
            return rawUrl;
        }

        private Uri TryGetUriIfReq(
            ConcurrentQueue<UserMsgTuple> queue,
            string rawUrl)
        {
            Uri uri = null;

            if (rawUrl != null)
            {
                try
                {
                    ShowUserMessage(queue, "Validating the provided url...", null);
                    uri = new Uri(rawUrl);
                }
                catch (Exception exc)
                {
                    ShowUserMessage(queue, $"The provided url is invalid: {exc.Message}", false);
                }
            }

            return uri;
        }

        private async Task<string> FetchResourceIfReqCoreAsync(
            ConcurrentQueue<UserMsgTuple> queue,
            Uri uri)
        {
            string title = null;

            if (uri != null)
            {
                try
                {
                    ShowUserMessage(queue, "Retrieving the resource from url...", null);

                    var web = new HtmlWeb();
                    var doc = web.Load(uri);

                    title = GetResourceTitle(doc);
                }
                catch (Exception exc)
                {
                    ShowUserMessage(queue, $"Could not retrieve the resource from url: {exc.Message}", false);
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

            string title = titleNode?.InnerText ?? string.Empty;
            title = title.Split('\n', '\r', '\t').JoinNotNullStr(" ");

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
            ConcurrentQueue<UserMsgTuple> queue,
            Func<Task<string>> rawUrlRetriever,
            string initMsg,
            Func<Exception, string> retrieveUrlErrMsgFactory,
            bool copyResultToClipboard)
        {
            string rawUrl = await TryGetRawUrl(
                queue,
                rawUrlRetriever,
                initMsg,
                retrieveUrlErrMsgFactory);

            if (copyResultToClipboard)
            {
                RawUrl = rawUrl;
            }

            Uri uri = TryGetUriIfReq(queue, rawUrl);
            string title = await FetchResourceIfReqCoreAsync(queue, uri);

            await SetResourceTitleIfReqAsync(
                queue, title, copyResultToClipboard);
        }

        private async Task SetResourceTitleIfReqAsync(
            ConcurrentQueue<UserMsgTuple> queue,
            string title,
            bool copyResultToClipboard)
        {
            if (title != null)
            {
                SetResourceTitleCore(title);

                if (copyResultToClipboard)
                {
                    await TitleAndUrlToClipboardAsync(queue);
                }
                else
                {
                    ShowUserMessage(queue,
                        "Retrieved the resource from url", true);
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
