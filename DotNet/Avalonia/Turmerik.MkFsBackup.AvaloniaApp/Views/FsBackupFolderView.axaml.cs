using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Avalonia.ReactiveUI;
using DynamicData.Binding;
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

            this.Loaded += FsBackupFolderView_Loaded;
        }

        private void FsBackupFolderView_Loaded(object? sender, Avalonia.Interactivity.RoutedEventArgs e)
        {
            // this.treeView
        }

        public void TreeViewExpanderExpanding(object? sender, Avalonia.Interactivity.CancelRoutedEventArgs e)
        {
            // this.treeView
        }
    }
}
