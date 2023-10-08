using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Reactive.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Reactive;

namespace Turmerik.MkFsBackup.AvaloniaApp.ViewModels
{
    public class Node : ReactiveObject
    {
        private IObservable<bool> isExpanded;

        public Node()
        {
        }

        public Node(string strFullPath)
        {
            StrFullPath = strFullPath;
            StrNodeText = Path.GetFileName(strFullPath);

            // IsExpanded = new TrmrkAvlnObservable<bool>(false, true);
        }

        public string StrNodeText { get; init; }
        public string StrFullPath { get; init; }

        /* public IObservable<bool> IsExpanded
        {
            get => isExpanded;

            set => this.RaiseAndSetIfChanged(
                ref isExpanded,
                value,
                nameof(IsExpanded));
        }*/

        public ObservableCollection<Node> Subfolders { get; set; }
    }
}
