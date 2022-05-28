using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.FsUtils.WinForms.App
{
    public class MainFormViewModel
    {
        private readonly MainFormEventsViewModel eventsViewModel;

        private Action<KeyValuePair<int, FsExplorerViewModel>> onFsExplorerTabAdded;
        private Action<KeyValuePair<int, FsExplorerViewModel>> onFsExplorerTabRemoved;

        public MainFormViewModel(MainFormEventsViewModel eventsViewModel)
        {
            this.eventsViewModel = eventsViewModel ?? throw new ArgumentNullException(nameof(eventsViewModel));

            FsExplorerViewModelsList = new List<FsExplorerViewModel>();
            FsExplorerViewModelsRdnlColcnt = FsExplorerViewModelsList.RdnlC();
        }

        public ReadOnlyCollection<FsExplorerViewModel> FsExplorerViewModelsRdnlColcnt { get; }

        private List<FsExplorerViewModel> FsExplorerViewModelsList { get; }

        public event Action<KeyValuePair<int, FsExplorerViewModel>> OnFsExplorerTabAdded
        {
            add
            {
                onFsExplorerTabAdded += value;
            }

            remove
            {
                onFsExplorerTabAdded -= value;
            }
        }

        public event Action<KeyValuePair<int, FsExplorerViewModel>> OnFsExplorerTabRemoved
        {
            add
            {
                onFsExplorerTabRemoved += value;
            }

            remove
            {
                onFsExplorerTabRemoved -= value;
            }
        }

        public KeyValuePair<int, FsExplorerViewModel> AddFsExplorerTabPage(string dirPath)
        {
            var viewModel = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<FsExplorerViewModel>();
            viewModel.TryExecute("Init", () => viewModel.Init(dirPath));

            int idx = FsExplorerViewModelsList.Count;
            FsExplorerViewModelsList.Add(viewModel);

            var kvp = new KeyValuePair<int, FsExplorerViewModel>(idx, viewModel);
            onFsExplorerTabAdded?.Invoke(kvp);

            return kvp;
        }

        public KeyValuePair<int, FsExplorerViewModel> RemoveFsExplorerTabPage(Guid uuid)
        {
            var kvp = FsExplorerViewModelsList.FindVal(x => x.Uuid == uuid);

            if (kvp.Key < 0)
            {
                throw new InvalidOperationException($"Could not find a tab page with id {uuid}");
            }

            FsExplorerViewModelsList.RemoveAt(kvp.Key);
            onFsExplorerTabRemoved?.Invoke(kvp);

            return kvp;
        }
    }
}
