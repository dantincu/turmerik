using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;
using Turmerik.Core.Helpers;
using Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDriveExplorerService
    {
        Task<TrmrkActionResult<DriveItemMtbl>> GetRootFolderAsync();
        Task<TrmrkActionResult<DriveItemMtbl>> GetFolderAsync(string folderId);
        Task<TrmrkActionResult<DriveItemMtbl>> GetTextFileAsync(string fileId);
        Task<TrmrkActionResult<DriveItemMtbl>> CreateFolderAsync(string parentFolderId, string newFolderName);
        Task<TrmrkActionResult<DriveItemMtbl>> RenameFolderAsync(string folderId, string newFolderName);
        Task<TrmrkActionResult<DriveItemMtbl>> CopyFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<TrmrkActionResult<DriveItemMtbl>> MoveFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<TrmrkActionResult<DriveItemMtbl>> DeleteFolderAsync(string folderId);
        Task<TrmrkActionResult<DriveItemMtbl>> CreateTextFileAsync(string parentFolderId, string newFileName, string text);

        Task<TrmrkActionResult<DriveItemMtbl>> CreateOfficeLikeFileAsync(
            string parentFolderId,
            string newFileName,
            OfficeLikeFileType officeLikeFileType);

        Task<TrmrkActionResult<DriveItemMtbl>> RenameFileAsync(string fileId, string newFileName);
        Task<TrmrkActionResult<DriveItemMtbl>> CopyFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<TrmrkActionResult<DriveItemMtbl>> MoveFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<TrmrkActionResult<DriveItemMtbl>> DeleteFileAsync(string fileId);

        Task<TrmrkActionResult<DriveItemMtbl[]>> CreateMultipleAsync(
            string parentFolderId, DriveItemOpMtbl[] driveItemOpsArr);
    }

    public class DriveExplorerService : IDriveExplorerService
    {
        private readonly IDriveExplorerServiceEngine driveExplorerServiceEngine;
        private readonly IDriveItemNameMacroFactoryResolver driveItemNameMacroFactoryResolver;

        public DriveExplorerService(
            IDriveExplorerServiceEngine driveExplorerServiceEngine,
            IDriveItemNameMacroFactoryResolver driveItemNameMacroFactoryResolver)
        {
            this.driveExplorerServiceEngine = driveExplorerServiceEngine ?? throw new ArgumentNullException(
                nameof(driveExplorerServiceEngine));

            this.driveItemNameMacroFactoryResolver = driveItemNameMacroFactoryResolver ?? throw new ArgumentNullException(
                nameof(driveItemNameMacroFactoryResolver));

            this.DriveItemDefaultExceptionHandler = this.GetDefaultExceptionHandler<DriveItemMtbl>();
            this.DriveItemsDefaultExceptionHandler = this.GetDefaultExceptionHandler<DriveItemMtbl[]>();
        }

        protected Func<Exception, TrmrkActionResult<DriveItemMtbl>> DriveItemDefaultExceptionHandler { get; }
        protected Func<Exception, TrmrkActionResult<DriveItemMtbl[]>> DriveItemsDefaultExceptionHandler { get; }

        public async Task<TrmrkActionResult<DriveItemMtbl>> CopyFileAsync(string fileId, string newParentFolderId, string newFileName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.CopyFileAsync(
                    fileId, newParentFolderId, newFileName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> CopyFolderAsync(string folderId, string newParentFolderId, string newFolderName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.CopyFolderAsync(
                    folderId, newParentFolderId, newFolderName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> CreateFolderAsync(string parentFolderId, string newFolderName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.CreateFolderAsync(
                    parentFolderId, newFolderName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl[]>> CreateMultipleAsync(string parentFolderId, DriveItemOpMtbl[] driveItemOpsArr)
        {
            var result = await ExecuteDriveItemsCoreAsync(
                async () => await this.CreateMultipleCoreAsync(
                    parentFolderId, driveItemOpsArr));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> CreateOfficeLikeFileAsync(
            string parentFolderId,
            string newFileName,
            OfficeLikeFileType officeLikeFileType)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.CreateOfficeLikeFileAsync(
                    parentFolderId, newFileName, officeLikeFileType));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> CreateTextFileAsync(string parentFolderId, string newFileName, string text)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.CreateTextFileAsync(
                    parentFolderId, newFileName, text));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> DeleteFileAsync(string fileId)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.DeleteFileAsync(fileId));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> DeleteFolderAsync(string folderId)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.DeleteFolderAsync(folderId));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> GetFolderAsync(string folderId)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.GetFolderAsync(folderId));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> GetRootFolderAsync()
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.GetRootFolderAsync());

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> GetTextFileAsync(string fileId)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.GetTextFileAsync(fileId));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> MoveFileAsync(string fileId, string newParentFolderId, string newFileName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.MoveFileAsync(
                    fileId, newParentFolderId, newFileName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> MoveFolderAsync(string folderId, string newParentFolderId, string newFolderName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.MoveFolderAsync(
                    folderId, newParentFolderId, newFolderName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> RenameFileAsync(string fileId, string newFileName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.RenameFileAsync(
                    fileId, newFileName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItemMtbl>> RenameFolderAsync(string folderId, string newFolderName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.RenameFolderAsync(
                    folderId, newFolderName));

            return result;
        }

        private Func<Exception, TrmrkActionResult<TData>> GetDefaultExceptionHandler<TData>()
        {
            Func<Exception, TrmrkActionResult<TData>> handler = exc => HandleException<TData>(exc);
            return handler;
        }

        private HttpStatusCode? GetHttpStatusCode(Exception exc)
        {
            HttpStatusCode? httpStatusCode = null;

            if (exc is InternalAppError err)
            {
                httpStatusCode = err.HttpStatusCode;
            }

            return httpStatusCode;
        }

        private TrmrkActionResult<TData> HandleException<TData>(Exception exc)
        {
            var httpStatusCode = GetHttpStatusCode(exc);
            var errViewModel = new ErrorViewModel(null, exc);

            var result = new TrmrkActionResult<TData>(
                false, default, errViewModel, httpStatusCode);

            return result;
        }

        private TResult ExecuteCore<TResult>(
            Func<TResult> action,
            Func<Exception, TResult> excHandler)
        {
            TResult actionResult;

            try
            {
                actionResult = action();
            }
            catch (Exception exc)
            {
                actionResult = excHandler(exc);
            }

            return actionResult;
        }

        private async Task<TResult> ExecuteCoreAsync<TResult>(
            Func<Task<TResult>> action,
            Func<Exception, TResult> excHandler)
        {
            TResult actionResult;

            try
            {
                actionResult = await action();
            }
            catch (Exception exc)
            {
                actionResult = excHandler(exc);
            }

            return actionResult;
        }

        private TrmrkActionResult<DriveItemMtbl> ExecuteDriveItemCore(
            Func<DriveItemMtbl> action,
            Func<Exception, TrmrkActionResult<DriveItemMtbl>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemDefaultExceptionHandler);

            var actionResult = ExecuteCore(
                () => new TrmrkActionResult<DriveItemMtbl>(
                    true, action()), excHandler);

            return actionResult;
        }

        private async Task<TrmrkActionResult<DriveItemMtbl>> ExecuteDriveItemCoreAsync(
            Func<Task<DriveItemMtbl>> action,
            Func<Exception, TrmrkActionResult<DriveItemMtbl>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemDefaultExceptionHandler);

            var actionResult = await ExecuteCoreAsync(
                async () => new TrmrkActionResult<DriveItemMtbl>(
                    true, await action()), excHandler);

            return actionResult;
        }

        private TrmrkActionResult<DriveItemMtbl[]> ExecuteDriveItemsCore(
            Func<DriveItemMtbl[]> action,
            Func<Exception, TrmrkActionResult<DriveItemMtbl[]>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemsDefaultExceptionHandler);

            var actionResult = ExecuteCore(
                () => new TrmrkActionResult<DriveItemMtbl[]>(
                    true, action()), excHandler);

            return actionResult;
        }

        private async Task<TrmrkActionResult<DriveItemMtbl[]>> ExecuteDriveItemsCoreAsync(
            Func<Task<DriveItemMtbl[]>> action,
            Func<Exception, TrmrkActionResult<DriveItemMtbl[]>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemsDefaultExceptionHandler);

            var actionResult = await ExecuteCoreAsync(
                async () => new TrmrkActionResult<DriveItemMtbl[]>(
                    true, await action()), excHandler);

            return actionResult;
        }

        private Tuple<DriveItemOpMtbl, Func<string[], int, string>> GetDriveItemOpFactoryTuple(
            DriveItemOpMtbl driveItemOp)
        {
            var nameFactory = this.driveItemNameMacroFactoryResolver.Resolve(
                driveItemOp.NameMacro);

            var retTuple = new Tuple<DriveItemOpMtbl, Func<string[], int, string>>(
                    driveItemOp, nameFactory);

            return retTuple;
        }

        private async Task<DriveItemMtbl[]> CreateMultipleCoreAsync(
            string parentFolderId,
            DriveItemOpMtbl[] driveItemOpsArr,
            bool isSurelyEmpty = false)
        {
            var driveItemOpTuplesArr = driveItemOpsArr.Select(
                this.GetDriveItemOpFactoryTuple).ToArray();

            var driveItemsArr = new DriveItemMtbl[driveItemOpTuplesArr.Length];

            for (int i = 0; i < driveItemOpTuplesArr.Length; i++)
            {
                var tuple = driveItemOpTuplesArr[i];

                var childDriveItem = await this.CreateEntryAsync(
                    parentFolderId, tuple, isSurelyEmpty);

                driveItemsArr[i] = childDriveItem;
            }

            for (int i = 0; i < driveItemsArr.Length; i++)
            {
                var driveItem = driveItemsArr[i];
                var driveItemOp = driveItemOpsArr[i];

                if (driveItemOp.MultipleItems != null)
                {
                    var childItems = await this.CreateMultipleCoreAsync(
                        driveItem.Id, driveItemOp.MultipleItems.ToArray(), true);

                    driveItem.SubFolders = childItems.Where(
                        item => item.IsFolder == true).ToList();

                    driveItem.FolderFiles = childItems.Where(
                        item => item.IsFolder != true).ToList();
                }
            }

            return driveItemsArr;
        }

        private async Task<DriveItemMtbl> CreateEntryAsync(
            string parentFolderId,
            Tuple<DriveItemOpMtbl, Func<string[], int, string>> tuple,
            bool isSurelyEmpty)
        {
            var existingEntriesArr = await this.GetExistingEntriesAsync(
                parentFolderId, isSurelyEmpty);

            string newEntryName = this.GetNewEntryName(
                existingEntriesArr, tuple.Item2);

            var driveItem = await CreateEntryAsync(
                parentFolderId,
                newEntryName,
                tuple.Item1);

            return driveItem;
        }

        private async Task<DriveItemMtbl> CreateEntryAsync(
            string parentFolderId,
            string newEntryName,
            DriveItemOpMtbl driveItemOp)
        {
            DriveItemMtbl driveItem;

            if (driveItemOp.IsFolder == true)
            {
                driveItem = await this.driveExplorerServiceEngine.CreateFolderAsync(
                    parentFolderId, newEntryName);
            }
            else
            {
                if (driveItemOp.OfficeLikeFileType.HasValue)
                {
                    driveItem = await this.driveExplorerServiceEngine.CreateOfficeLikeFileAsync(
                        parentFolderId, newEntryName, driveItemOp.OfficeLikeFileType.Value);
                }
                else
                {
                    driveItem = await this.driveExplorerServiceEngine.CreateTextFileAsync(
                        parentFolderId, newEntryName, driveItemOp.TextFileContent ?? string.Empty);
                }
            }

            return driveItem;
        }

        private string GetNewEntryName(
            string[] existingEntriesArr,
            Func<string[], int, string> nameFactory)
        {
            int idx = 0;

            string entryName = nameFactory(existingEntriesArr, idx);
            string entryNameToLower = entryName.ToLower();

            if (existingEntriesArr.Any())
            {
                existingEntriesArr = existingEntriesArr.Select(
                    str => str.ToLower()).ToArray();
            }

            while (existingEntriesArr.Contains(entryNameToLower))
            {
                idx++;
                entryName = nameFactory(existingEntriesArr, idx);

                string newEntryNameToLower = entryName.ToLower();

                if (newEntryNameToLower == entryNameToLower)
                {
                    throw new InternalAppError(
                        $"Same entry name returned for 2 different uniquifier indexes: {entryName}",
                        HttpStatusCode.BadRequest);
                }
                else
                {
                    entryNameToLower = newEntryNameToLower;
                }
            }

            return entryName;
        }

        private async Task<string[]> GetExistingEntriesAsync(
            string folderId,
            bool isSurelyEmpty)
        {
            string[] existingEntries;

            if (isSurelyEmpty)
            {
                existingEntries = new string[0];
            }
            else
            {
                var folder = await this.driveExplorerServiceEngine.GetFolderAsync(folderId);

                var existingFolderNames = folder.SubFolders.Select(
                    item => item.Name);

                var existingFileNames = folder.FolderFiles.Select(
                    item => item.Name);

                existingEntries = existingFolderNames.Concat(existingFileNames).ToArray();
            }

            return existingEntries;
        }
    }
}
