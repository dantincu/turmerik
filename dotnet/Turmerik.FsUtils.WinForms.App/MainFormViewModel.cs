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
        private Action<KeyValuePair<int, FsExplorerViewModel>> onFsExplorerTabPageChanged;

        public MainFormViewModel(MainFormEventsViewModel eventsViewModel)
        {
            this.eventsViewModel = eventsViewModel ?? throw new ArgumentNullException(nameof(eventsViewModel));

            FsExplorerViewModelsList = new List<FsExplorerViewModel>();
            FsExplorerViewModelsRdnlColcnt = FsExplorerViewModelsList.RdnlC();
        }

        public ReadOnlyCollection<FsExplorerViewModel> FsExplorerViewModelsRdnlColcnt { get; }
        public KeyValuePair<int, FsExplorerViewModel> SelectedTabPage { get; private set; }

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

        public event Action<KeyValuePair<int, FsExplorerViewModel>> OnFsExplorerTabPageChanged
        {
            add
            {
                onFsExplorerTabPageChanged += value;
            }

            remove
            {
                onFsExplorerTabPageChanged -= value;
            }
        }

        public KeyValuePair<int, FsExplorerViewModel> AddFsExplorerTabPage(string dirPath)
        {
            var viewModel = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<FsExplorerViewModel>();

            int idx = FsExplorerViewModelsList.Count;
            FsExplorerViewModelsList.Add(viewModel);

            var kvp = new KeyValuePair<int, FsExplorerViewModel>(idx, viewModel);
            viewModel.TryExecute("[FS Explorer -> add new tab page]", () => viewModel.Init(dirPath));

            onFsExplorerTabAdded?.Invoke(kvp);

            if (idx == 0)
            {
                onFsExplorerTabPageChanged?.Invoke(kvp);
            }

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

        public KeyValuePair<int, FsExplorerViewModel> UpdateFsExplorerTabPageIndex(int selectedIndex)
        {
            FsExplorerViewModel viewModel;

            if (selectedIndex == -1)
            {
                viewModel = null;
            }
            else
            {
                viewModel = FsExplorerViewModelsList[selectedIndex];
            }

            SelectedTabPage = new KeyValuePair<int, FsExplorerViewModel>(
                selectedIndex, viewModel);

            onFsExplorerTabPageChanged?.Invoke(SelectedTabPage);
            return SelectedTabPage;
        }
    }
}
