using Avalonia.Interactivity;
using DynamicData;
using Microsoft.Extensions.DependencyInjection;
using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Reactive;
using System.Reactive.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Reactive;

namespace Turmerik.MkFsBackup.AvaloniaApp.ViewModels
{
    public class FsBackupFolderViewModel : ReactiveObject
    {
        private readonly IServiceProvider svcProv;
        private readonly AppGlobals appGlobalsWrapper;
        private IAppGlobalsData appGlobals;

        private ObservableCollection<Node> items;
        private ObservableCollection<Node> selectedItems;
        private string strFolder;

        private IObservable<bool> isExpanded;

        public FsBackupFolderViewModel()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            appGlobalsWrapper = svcProv.GetRequiredService<AppGlobals>();
            appGlobalsWrapper.Registered += AppGlobalsWrapper_Registered;

            StrFolder = @"F:\T\turmerik\DotNet";
            // strFolder = @"F:\";
            Items = new ObservableCollection<Node>();

            Node rootNode = new Node(StrFolder);
            rootNode.Subfolders = GetSubfolders(strFolder);

            Items.Add(rootNode);

            // IsExpanded = new TrmrkAvlnObservable<bool>(false, false);
        }

        public IObservable<bool> IsExpanded
        {
            get => isExpanded;

            set => this.RaiseAndSetIfChanged(
                ref isExpanded,
                value,
                nameof(IsExpanded));
        }

        public ObservableCollection<Node> Items
        {
            get => items;

            set => this.RaiseAndSetIfChanged(
                ref items,
                value,
                nameof(Items));
        }

        public ObservableCollection<Node> SelectedItems
        {
            get => selectedItems;

            set => this.RaiseAndSetIfChanged(
                ref selectedItems,
                value,
                nameof(SelectedItems));
        }

        public string StrFolder
        {
            get => strFolder;

            set => this.RaiseAndSetIfChanged(
                ref strFolder,
                value,
                nameof(StrFolder));
        }

        public void TreeViewExpanderExpanding(object? sender, Avalonia.Interactivity.CancelRoutedEventArgs e)
        {
            // this.treeView
        }

        private ObservableCollection<Node> GetSubfolders(string strPath)
        {
            ObservableCollection<Node> subfolders = new ObservableCollection<Node>();

            if (!strPath.Contains("$RECYCLE.BIN"))
            {
                string[] subdirs = Directory.GetDirectories(strPath);

                foreach (string dir in subdirs)
                {
                    Node thisNode = new Node(dir);
                    // thisNode.Subfolders = GetSubfolders(dir);

                    subfolders.Add(thisNode);
                }
            }

            return subfolders;
        }

        private void AppGlobalsWrapper_Registered(IAppGlobalsData data)
        {
            appGlobals = data;
            appGlobalsWrapper.Registered -= AppGlobalsWrapper_Registered;
        }
    }
}
