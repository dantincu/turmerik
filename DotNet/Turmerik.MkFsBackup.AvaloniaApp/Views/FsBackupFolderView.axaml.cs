using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Avalonia.ReactiveUI;
using ReactiveUI;
using Turmerik.MkFsBackup.AvaloniaApp.ViewModels;

namespace Turmerik.MkFsBackup.AvaloniaApp.Views
{
    public partial class FsBackupFolderView : ReactiveUserControl<FsBackupFolderViewModel>
    {
        public FsBackupFolderView()
        {
            this.WhenActivated(disposables => { });
            AvaloniaXamlLoader.Load(this);
        }
    }
}
