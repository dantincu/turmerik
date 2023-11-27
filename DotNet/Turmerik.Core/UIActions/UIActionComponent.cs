using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Actions;
using Turmerik.Core.Logging;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.Core.UIActions
{
    public interface IUIActionComponent<TUIMessageTuple>
        where TUIMessageTuple : IUIMessageTuple
    {
        IAppLogger Logger { get; }

        IActionResult<T> Execute<T>(
            IUIActionOpts<T, TUIMessageTuple> opts);

        Task<IActionResult<T>> ExecuteAsync<T>(
            IUIAsyncActionOpts<T, TUIMessageTuple> opts);
    }

    public class UIActionComponent<TUIMessageTuple> : IUIActionComponent<TUIMessageTuple>
        where TUIMessageTuple : IUIMessageTuple
    {
        public UIActionComponent(IAppLogger logger)
        {
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public IAppLogger Logger { get; }

        public IActionResult<T> Execute<T>(
            IUIActionOpts<T, TUIMessageTuple> opts)
        {
            OnBeforeExecution(opts);
            IActionResult<T> actionResult = null;

            try
            {
                actionResult = opts.Action() ?? new ActionResult<T>();
            }
            catch (Exception ex)
            {
                actionResult = OnUnhandledError(opts, ex);
            }
            finally
            {
                OnAfterExecution(opts, actionResult);
            }

            return actionResult;
        }

        public async Task<IActionResult<T>> ExecuteAsync<T>(
            IUIAsyncActionOpts<T, TUIMessageTuple> opts)
        {
            OnBeforeExecution(opts);
            IActionResult<T> actionResult = null;

            try
            {
                actionResult = await opts.Action() ?? new ActionResult<T>();
            }
            catch (Exception ex)
            {
                actionResult = OnUnhandledError(opts, ex);
            }
            finally
            {
                OnAfterExecution(opts, actionResult);
            }

            return actionResult;
        }

        protected virtual string OnBeforeExecutionLogMsgTpl => "Executing action [{0}]";
        protected virtual string OnUnhandledErrorLogMsgTpl => "Executing action [{0}] has stopped due to an unhandled error";
        protected virtual string OnAfterExecutionLogMsgTpl => "Execution of action [{0}] finished {1}";

        protected virtual void OnBeforeExecution<T>(
            IUIActionOptsCore<T, TUIMessageTuple> opts)
        {
            var uiMsgTuple = opts.OnBeforeExecution.IfNotNull(
                onBeforeAction => onBeforeAction(),
                () => default);

            OnBeforeExecutionLogMsg(opts, uiMsgTuple);
        }

        protected virtual IActionResult<T> OnUnhandledError<T>(
            IUIActionOptsCore<T, TUIMessageTuple> opts,
            Exception ex)
        {
            var uiMsgTuple = opts.OnUnhandledError.IfNotNull(
                onUnhandledError => onUnhandledError(ex),
                () => default);

            var actionResult = new ActionResult<T>(
                default, ex);

            OnUnhandledErrorLogMsg(opts, ex, uiMsgTuple);
            return actionResult;
        }

        protected virtual void OnAfterExecution<T>(
            IUIActionOptsCore<T, TUIMessageTuple> opts,
            IActionResult<T> actionResult)
        {
            var uiMsgTuple = opts.OnAfterExecution.IfNotNull(
                onAfterExecution => onAfterExecution(actionResult),
                () => default);

            OnAfterExecutionLogMsg(opts, actionResult, uiMsgTuple);
        }

        protected virtual void OnBeforeExecutionLogMsg<T>(
            IUIActionOptsCore<T, TUIMessageTuple> opts,
            TUIMessageTuple msgTuple)
        {
            _ = (msgTuple?.LogMessage ?? opts.ActionName?.With(
                actionName => string.Format(
                    OnBeforeExecutionLogMsgTpl,
                    actionName))).Nullify(true)?.ActWith(
                logMsg => Logger.Verbose(logMsg));
        }

        protected virtual void OnUnhandledErrorLogMsg<T>(
            IUIActionOptsCore<T, TUIMessageTuple> opts,
            Exception ex,
            TUIMessageTuple msgTuple)
        {
            _ = (msgTuple?.LogMessage ?? opts.ActionName?.With(
                actionName => string.Format(
                    OnUnhandledErrorLogMsgTpl,
                    actionName))).Nullify(true)?.ActWith(
                logMsg => Logger.Error(ex, logMsg));
        }

        protected virtual void OnAfterExecutionLogMsg<T>(
            IUIActionOptsCore<T, TUIMessageTuple> opts,
            IActionResult<T> actionResult,
            TUIMessageTuple msgTuple)
        {
            string resultStr = actionResult.IsSuccess ? "successfully" : "with errors";

            _ = (msgTuple?.LogMessage ?? opts.ActionName?.With(
                actionName => string.Format(
                    OnAfterExecutionLogMsgTpl,
                    actionName,
                    resultStr))).Nullify(true)?.ActWith(
                        logMsg => Logger.Verbose(logMsg));
        }
    }
}
