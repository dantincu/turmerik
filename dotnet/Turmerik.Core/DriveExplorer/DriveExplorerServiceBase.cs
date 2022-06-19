using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.DriveExplorer
{
    public abstract class DriveExplorerServiceBase
    {
        protected DriveExplorerServiceBase(ITimeStampHelper timeStampHelper)
        {
            this.TimeStampHelper = timeStampHelper ?? throw new ArgumentNullException(nameof(timeStampHelper));
            DriveItemDefaultExceptionHandler = GetDefaultExceptionHandler<DriveItem>();
            StringDefaultExceptionHandler = GetDefaultExceptionHandler<string>();
        }

        protected ITimeStampHelper TimeStampHelper { get; }

        protected Func<Exception, TrmrkActionResult<DriveItem>> DriveItemDefaultExceptionHandler { get; }
        protected Func<Exception, TrmrkActionResult<string>> StringDefaultExceptionHandler { get; }

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
            Func<TrmrkActionResult<DriveItem>> action,
            Func<Exception, TrmrkActionResult<DriveItem>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemDefaultExceptionHandler);

            var actionResult = ExecuteCore(
                action, excHandler);

            return actionResult;
        }

        protected async Task<TrmrkActionResult<DriveItem>> ExecuteDriveItemCoreAsync(
            Func<Task<TrmrkActionResult<DriveItem>>> action,
            Func<Exception, TrmrkActionResult<DriveItem>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(DriveItemDefaultExceptionHandler);

            var actionResult = await ExecuteCoreAsync(
                action, excHandler);

            return actionResult;
        }

        protected TrmrkActionResult<string> ExecuteStringCore(
            Func<TrmrkActionResult<string>> action,
            Func<Exception, TrmrkActionResult<string>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(StringDefaultExceptionHandler);

            var actionResult = ExecuteCore(
                action, excHandler);

            return actionResult;
        }

        protected async Task<TrmrkActionResult<string>> ExecuteStringCoreAsync(
            Func<Task<TrmrkActionResult<string>>> action,
            Func<Exception, TrmrkActionResult<string>> excHandler = null)
        {
            excHandler = excHandler.FirstNotNull(StringDefaultExceptionHandler);

            var actionResult = await ExecuteCoreAsync(
                action, excHandler);

            return actionResult;
        }

        protected async Task<DriveItemPutOp> CreateMultipleEntriesAsync(
            string[] existingEntriesArr,
            List<Tuple<Func<string[], int, string, string>, string, Func<string, int, Task<DriveItemPutOp>>>> fileNameFactoriesList)
        {
            int idx = -1;
            bool conflict = true;

            string[] candidateEntriesArr = null;
            List<DriveItemPutOp> newDriveItemsList = new List<DriveItemPutOp>();

            while (conflict)
            {
                idx++;

                candidateEntriesArr = fileNameFactoriesList.Select(
                    tuple => tuple.Item1(existingEntriesArr, idx, tuple.Item2)).ToArray();

                conflict = candidateEntriesArr.Any(
                    ent => existingEntriesArr.Any(
                        e => e.StrEquals(ent, true)));
            }

            for (int i = 0; i < candidateEntriesArr.Length; i++)
            {
                var newEntry = candidateEntriesArr[i];
                var newDriveItem = await fileNameFactoriesList[i].Item3(newEntry, i);

                newDriveItemsList.Add(newDriveItem);
            }

            return new DriveItemPutOp
            {
                MultipleItems = newDriveItemsList
            };
        }
    }
}
