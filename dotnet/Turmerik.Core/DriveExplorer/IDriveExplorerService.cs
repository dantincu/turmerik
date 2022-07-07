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
        Task<TrmrkActionResult<DriveItem>> GetRootFolderAsync();
        Task<TrmrkActionResult<DriveItem>> GetFolderAsync(string folderId);
        Task<TrmrkActionResult<DriveItem>> GetTextFileAsync(string fileId);
        Task<TrmrkActionResult<DriveItem>> CreateFolderAsync(string parentFolderId, string newFolderName);
        Task<TrmrkActionResult<DriveItem>> RenameFolderAsync(string folderId, string newFolderName);
        Task<TrmrkActionResult<DriveItem>> CopyFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<TrmrkActionResult<DriveItem>> MoveFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<TrmrkActionResult<DriveItem>> DeleteFolderAsync(string folderId);
        Task<TrmrkActionResult<DriveItem>> CreateTextFileAsync(string parentFolderId, string newFileName, string text);

        Task<TrmrkActionResult<DriveItem>> CreateOfficeLikeFileAsync(
            string parentFolderId,
            string newFileName,
            OfficeLikeFileType officeLikeFileType);

        Task<TrmrkActionResult<DriveItem>> RenameFileAsync(string fileId, string newFileName);
        Task<TrmrkActionResult<DriveItem>> CopyFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<TrmrkActionResult<DriveItem>> MoveFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<TrmrkActionResult<DriveItem>> DeleteFileAsync(string fileId);

        Task<TrmrkActionResult<DriveItem[]>> CreateMultipleAsync(
            string parentFolderId, DriveItemOp[] driveItemOpsArr);
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

            this.DriveItemDefaultExceptionHandler = this.GetDefaultExceptionHandler<DriveItem>();
            this.DriveItemsDefaultExceptionHandler = this.GetDefaultExceptionHandler<DriveItem[]>();
        }

        protected Func<Exception, TrmrkActionResult<DriveItem>> DriveItemDefaultExceptionHandler { get; }
        protected Func<Exception, TrmrkActionResult<DriveItem[]>> DriveItemsDefaultExceptionHandler { get; }

        public async Task<TrmrkActionResult<DriveItem>> CopyFileAsync(string fileId, string newParentFolderId, string newFileName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.CopyFileAsync(
                    fileId, newParentFolderId, newFileName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> CopyFolderAsync(string folderId, string newParentFolderId, string newFolderName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.CopyFolderAsync(
                    folderId, newParentFolderId, newFolderName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> CreateFolderAsync(string parentFolderId, string newFolderName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.CreateFolderAsync(
                    parentFolderId, newFolderName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem[]>> CreateMultipleAsync(string parentFolderId, DriveItemOp[] driveItemOpsArr)
        {
            var result = await ExecuteDriveItemsCoreAsync(
                async () => await this.CreateMultipleCoreAsync(
                    parentFolderId, driveItemOpsArr));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> CreateOfficeLikeFileAsync(
            string parentFolderId,
            string newFileName,
            OfficeLikeFileType officeLikeFileType)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.CreateOfficeLikeFileAsync(
                    parentFolderId, newFileName, officeLikeFileType));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> CreateTextFileAsync(string parentFolderId, string newFileName, string text)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.CreateTextFileAsync(
                    parentFolderId, newFileName, text));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> DeleteFileAsync(string fileId)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.DeleteFileAsync(fileId));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> DeleteFolderAsync(string folderId)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.DeleteFolderAsync(folderId));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> GetFolderAsync(string folderId)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.GetFolderAsync(folderId));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> GetRootFolderAsync()
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.GetRootFolderAsync());

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> GetTextFileAsync(string fileId)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.GetTextFileAsync(fileId));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> MoveFileAsync(string fileId, string newParentFolderId, string newFileName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.MoveFileAsync(
                    fileId, newParentFolderId, newFileName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> MoveFolderAsync(string folderId, string newParentFolderId, string newFolderName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.MoveFolderAsync(
                    folderId, newParentFolderId, newFolderName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> RenameFileAsync(string fileId, string newFileName)
        {
            var result = await this.ExecuteDriveItemCoreAsync(
                async () => await this.driveExplorerServiceEngine.RenameFileAsync(
                    fileId, newFileName));

            return result;
        }

        public async Task<TrmrkActionResult<DriveItem>> RenameFolderAsync(string folderId, string newFolderName)
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

        private TrmrkActionResult<DriveItem> ExecuteDriveItemCore(
            Func<DriveItem> action,
            Func<Exception, TrmrkActionResult<DriveItem>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemDefaultExceptionHandler);

            var actionResult = ExecuteCore(
                () => new TrmrkActionResult<DriveItem>(
                    true, action()), excHandler);

            return actionResult;
        }

        private async Task<TrmrkActionResult<DriveItem>> ExecuteDriveItemCoreAsync(
            Func<Task<DriveItem>> action,
            Func<Exception, TrmrkActionResult<DriveItem>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemDefaultExceptionHandler);

            var actionResult = await ExecuteCoreAsync(
                async () => new TrmrkActionResult<DriveItem>(
                    true, await action()), excHandler);

            return actionResult;
        }

        private TrmrkActionResult<DriveItem[]> ExecuteDriveItemsCore(
            Func<DriveItem[]> action,
            Func<Exception, TrmrkActionResult<DriveItem[]>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemsDefaultExceptionHandler);

            var actionResult = ExecuteCore(
                () => new TrmrkActionResult<DriveItem[]>(
                    true, action()), excHandler);

            return actionResult;
        }

        private async Task<TrmrkActionResult<DriveItem[]>> ExecuteDriveItemsCoreAsync(
            Func<Task<DriveItem[]>> action,
            Func<Exception, TrmrkActionResult<DriveItem[]>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemsDefaultExceptionHandler);

            var actionResult = await ExecuteCoreAsync(
                async () => new TrmrkActionResult<DriveItem[]>(
                    true, await action()), excHandler);

            return actionResult;
        }

        private Tuple<DriveItemOp, Func<string[], int, string>> GetDriveItemOpFactoryTuple(
            DriveItemOp driveItemOp)
        {
            var nameFactory = this.driveItemNameMacroFactoryResolver.Resolve(
                driveItemOp.NameMacro);

            var retTuple = new Tuple<DriveItemOp, Func<string[], int, string>>(
                    driveItemOp, nameFactory);

            return retTuple;
        }

        private async Task<DriveItem[]> CreateMultipleCoreAsync(
            string parentFolderId,
            DriveItemOp[] driveItemOpsArr,
            bool isSurelyEmpty = false)
        {
            var driveItemOpTuplesArr = driveItemOpsArr.Select(
                this.GetDriveItemOpFactoryTuple).ToArray();

            var driveItemsArr = new DriveItem[driveItemOpTuplesArr.Length];

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

        private async Task<DriveItem> CreateEntryAsync(
            string parentFolderId,
            Tuple<DriveItemOp, Func<string[], int, string>> tuple,
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

        private async Task<DriveItem> CreateEntryAsync(
            string parentFolderId,
            string newEntryName,
            DriveItemOp driveItemOp)
        {
            DriveItem driveItem;

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
