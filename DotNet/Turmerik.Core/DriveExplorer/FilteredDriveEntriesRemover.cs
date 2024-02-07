using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public interface IFilteredDriveEntriesRemover
    {
        Task RemoveEntriesAsync(
            DataTreeNodeMtbl<FilteredDriveEntries> filterNode,
            bool? removeIfEmpty = null);

        bool WillFolderBeEmpty(
            FilteredDriveEntries filterData);
    }

    public class FilteredDriveEntriesRemover : IFilteredDriveEntriesRemover
    {
        private readonly IDriveExplorerService driveExplorerService;

        public FilteredDriveEntriesRemover(
            IDriveExplorerService driveExplorerService)
        {
            this.driveExplorerService = driveExplorerService ?? throw new ArgumentNullException(
                nameof(driveExplorerService));
        }

        public async Task RemoveEntriesAsync(
            DataTreeNodeMtbl<FilteredDriveEntries> filterNode,
            bool? removeIfEmpty = null)
        {
            var filterData = filterNode.Data;
            bool willBeEmpty = WillFolderBeEmpty(filterData);

            foreach (var file in filterData.FilteredFolderFiles)
            {
                await driveExplorerService.DeleteFileAsync(file.Idnf);
            }

            foreach (var folder in filterNode.ChildNodes)
            {
                await RemoveEntriesAsync(folder, removeIfEmpty ?? true);
            }

            if (willBeEmpty && removeIfEmpty == true)
            {
                await driveExplorerService.DeleteFolderAsync(
                    filterData.PrFolderIdnf, false);
            }
        }

        public bool WillFolderBeEmpty(
            FilteredDriveEntries filterData)
        {
            bool willBeEmpty = filterData.AllFolderFiles.Count == filterData.FilteredFolderFiles.Count;
            willBeEmpty = willBeEmpty && filterData.AllSubFolders.Count == filterData.FilteredSubFolders.Count;

            return willBeEmpty;
        }
    }
}
