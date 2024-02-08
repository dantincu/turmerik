using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDriveEntriesCloner
    {
        Task<DriveItem> CopyItemsAsync(
            DriveItem srcFolder,
            DriveItem destnFolder);
    }

    public class DriveEntriesCloner : IDriveEntriesCloner
    {
        private readonly IDriveExplorerService driveExplorerService;

        public DriveEntriesCloner(IDriveExplorerService driveExplorerService)
        {
            this.driveExplorerService = driveExplorerService ?? throw new ArgumentNullException(nameof(driveExplorerService));
        }

        public async Task<DriveItem> CopyItemsAsync(
            DriveItem srcFolder,
            DriveItem destnFolder)
        {
            destnFolder.FolderFiles ??= new List<DriveItem>();
            destnFolder.SubFolders ??= new List<DriveItem>();

            foreach (var file in srcFolder.FolderFiles)
            {
                destnFolder.FolderFiles.Add(
                    await driveExplorerService.CopyFileAsync(
                        file.Idnf, destnFolder.Idnf, file.Name));
            }

            foreach (var folder in srcFolder.SubFolders)
            {
                destnFolder.SubFolders.Add(
                    await driveExplorerService.CreateFolderAsync(
                    destnFolder.Idnf, folder.Name, false));
            }

            return destnFolder;
        }
    }
}
