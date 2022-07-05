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

        Task<TrmrkActionResult<DriveItemOp[]>> CreateMultipleAsync(
            string parentFolderId, DriveItemOp[] driveItemOpsArr);
    }

    public class DriveExplorerService : IDriveExplorerService
    {
        private readonly IDriveExplorerServiceEngine driveExplorerServiceEngine;
        private readonly IDriveItemMacrosService driveItemMacrosService;

        public DriveExplorerService(
            IDriveExplorerServiceEngine driveExplorerServiceEngine,
            IDriveItemMacrosService driveItemMacrosService)
        {
            this.driveExplorerServiceEngine = driveExplorerServiceEngine ?? throw new ArgumentNullException(nameof(driveExplorerServiceEngine));
            this.driveItemMacrosService = driveItemMacrosService ?? throw new ArgumentNullException(nameof(driveItemMacrosService));

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

        public async Task<TrmrkActionResult<DriveItemOp[]>> CreateMultipleAsync(string parentFolderId, DriveItemOp[] driveItemOpsArr)
        {
            var driveItemOpTuplesArr = driveItemOpsArr.Select(
                item => new Tuple<DriveItemOp>(item)).ToArray();

            throw new NotImplementedException();
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

        protected virtual Func<Exception, TrmrkActionResult<TData>> GetDefaultExceptionHandler<TData>()
        {
            Func<Exception, TrmrkActionResult<TData>> handler = exc => HandleException<TData>(exc);
            return handler;
        }

        protected virtual HttpStatusCode? GetHttpStatusCode(Exception exc)
        {
            HttpStatusCode? httpStatusCode = null;

            if (exc is InternalAppError err)
            {
                httpStatusCode = err.HttpStatusCode;
            }

            return httpStatusCode;
        }

        protected virtual TrmrkActionResult<TData> HandleException<TData>(Exception exc)
        {
            var httpStatusCode = GetHttpStatusCode(exc);
            var errViewModel = new ErrorViewModel(null, exc);

            var result = new TrmrkActionResult<TData>(
                false, default, errViewModel, httpStatusCode);

            return result;
        }

        protected TResult ExecuteCore<TResult>(
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

        protected async Task<TResult> ExecuteCoreAsync<TResult>(
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

        protected TrmrkActionResult<DriveItem> ExecuteDriveItemCore(
            Func<DriveItem> action,
            Func<Exception, TrmrkActionResult<DriveItem>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemDefaultExceptionHandler);

            var actionResult = ExecuteCore(
                () => new TrmrkActionResult<DriveItem>(
                    true, action()), excHandler);

            return actionResult;
        }

        protected async Task<TrmrkActionResult<DriveItem>> ExecuteDriveItemCoreAsync(
            Func<Task<DriveItem>> action,
            Func<Exception, TrmrkActionResult<DriveItem>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemDefaultExceptionHandler);

            var actionResult = await ExecuteCoreAsync(
                async () => new TrmrkActionResult<DriveItem>(
                    true, await action()), excHandler);

            return actionResult;
        }

        protected TrmrkActionResult<DriveItem[]> ExecuteDriveItemsCore(
            Func<DriveItem[]> action,
            Func<Exception, TrmrkActionResult<DriveItem[]>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemsDefaultExceptionHandler);

            var actionResult = ExecuteCore(
                () => new TrmrkActionResult<DriveItem[]>(
                    true, action()), excHandler);

            return actionResult;
        }

        protected async Task<TrmrkActionResult<DriveItem[]>> ExecuteDriveItemsCoreAsync(
            Func<Task<DriveItem[]>> action,
            Func<Exception, TrmrkActionResult<DriveItem[]>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemsDefaultExceptionHandler);

            var actionResult = await ExecuteCoreAsync(
                async () => new TrmrkActionResult<DriveItem[]>(
                    true, await action()), excHandler);

            return actionResult;
        }
    }
}
