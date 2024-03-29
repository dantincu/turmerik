﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public interface IFilteredDriveEntriesCloner
    {
        Task<DriveItem> CopyFilteredItemsAsync(
            DataTreeNodeMtbl<FilteredDriveEntries> filteredEntries,
            DriveItem destnFolder);
    }

    public class FilteredDriveEntriesCloner : IFilteredDriveEntriesCloner
    {
        private readonly IDriveExplorerService driveExplorerService;

        public FilteredDriveEntriesCloner(
            IDriveExplorerService driveExplorerService)
        {
            this.driveExplorerService = driveExplorerService ?? throw new ArgumentNullException(nameof(driveExplorerService));
        }

        public async Task<DriveItem> CopyFilteredItemsAsync(
            DataTreeNodeMtbl<FilteredDriveEntries> filteredEntries,
            DriveItem destnFolder)
        {
            var filtered = filteredEntries.Data;

            destnFolder.FolderFiles ??= new List<DriveItem>();
            destnFolder.SubFolders ??= new List<DriveItem>();

            foreach (var file in filtered.FilteredFolderFiles)
            {
                destnFolder.FolderFiles.Add(
                    await driveExplorerService.CopyFileAsync(
                        file.Idnf, destnFolder.Idnf, file.Name));
            }

            foreach (var folder in filtered.FilteredSubFolders)
            {
                var destnSubFolder = await driveExplorerService.CreateFolderAsync(
                    destnFolder.Idnf, folder.Name, false);

                destnFolder.SubFolders.Add(destnSubFolder);

                await CopyFilteredItemsAsync(
                    filteredEntries.ChildNodes.Single(
                        node => node.Data.PrFolderName == folder.Name),
                    destnSubFolder);
            }

            return destnFolder;
        }
    }
}
