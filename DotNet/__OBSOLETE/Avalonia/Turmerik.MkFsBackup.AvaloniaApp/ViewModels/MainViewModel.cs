using Avalonia.Media;
using Microsoft.Extensions.DependencyInjection;
using ReactiveUI;
using System;
using System.Collections.Concurrent;
using System.Diagnostics.Metrics;
using Turmerik.Actions;
using Turmerik.Async;

namespace Turmerik.MkFsBackup.AvaloniaApp.ViewModels;

public class MainViewModel : ReactiveObject
{
    private readonly IServiceProvider svcProv;
    private readonly IAsyncMessageQueuer<UserMsgTuple> asyncMessageQueuer;

    private readonly AppGlobals appGlobalsWrapper;
    private IAppGlobalsData appGlobals;

    private string outputText;
    private IBrush outputTextForeground;

    public MainViewModel()
    {
        svcProv = ServiceProviderContainer.Instance.Value.Data;

        appGlobalsWrapper = svcProv.GetRequiredService<AppGlobals>();
        appGlobalsWrapper.Registered += AppGlobalsWrapper_Registered;

        asyncMessageQueuer = svcProv.GetRequiredService<IAsyncMessageQueuerFactory>(
            ).Queuer<UserMsgTuple>(
            userMsgTuple => ShowUserMessage(
                userMsgTuple));

        FsBackupFolderViewModel = new FsBackupFolderViewModel();
        SectionsBrowserViewModel = new SectionsBrowserViewModel();
    }

    public FsBackupFolderViewModel FsBackupFolderViewModel { get; }
    public SectionsBrowserViewModel SectionsBrowserViewModel { get; }

    public string OutputText
    {
        get => outputText;

        set => this.RaiseAndSetIfChanged(
            ref outputText,
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

    private IBrush DefaultOutputTextForeground { get; set; }
    private IBrush SuccessOutputTextForeground { get; set; }
    private IBrush ErrorOutputTextForeground { get; set; }
    private IBrush DefaultMaterialIconsForeground { get; set; }

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

    private void AppGlobalsWrapper_Registered(IAppGlobalsData data)
    {
        appGlobals = data;
        appGlobalsWrapper.Registered -= AppGlobalsWrapper_Registered;
    }
}
