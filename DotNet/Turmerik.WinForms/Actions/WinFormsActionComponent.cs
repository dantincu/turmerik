using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Actions;
using Turmerik.Logging;

namespace Turmerik.WinForms.Actions
{
    public interface IWinFormsActionComponent
    {
        IAppLogger Logger { get; }

        IActionResult<T> Execute<T>(
            WinFormsActionOpts<T> opts);
    }

    public class WinFormsActionComponent : IWinFormsActionComponent
    {
        public WinFormsActionComponent(IAppLogger logger)
        {
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public IAppLogger Logger { get; }

        public IActionResult<T> Execute<T>(
            WinFormsActionOpts<T> opts)
        {
            (var dfMsgTuple, var actionResult) = OnBeforeAction(opts);

            try
            {
                actionResult = opts.Action() ?? new ActionResult<T>();
                OnAction(opts, dfMsgTuple, actionResult);
            }
            catch (Exception ex)
            {
                actionResult = OnUnhandledError(opts, dfMsgTuple, ex);
            }
            finally
            {
                OnAfterExecution(opts, dfMsgTuple, actionResult);
            }

            return actionResult;
        }

        public async Task<IActionResult<T>> ExecuteAsync<T>(
            WinFormsAsyncActionOpts<T> opts)
        {
            (var dfMsgTuple, var actionResult) = OnBeforeAction(opts);

            try
            {
                actionResult = (await opts.Action()) ?? new ActionResult<T>();
                OnAction(opts, dfMsgTuple, actionResult);
            }
            catch (Exception ex)
            {
                actionResult = OnUnhandledError(opts, dfMsgTuple, ex);
            }
            finally
            {
                OnAfterExecution(opts, dfMsgTuple, actionResult);
            }

            return actionResult;
        }

        private Tuple<UIMessageTuple, IActionResult<T>> OnBeforeAction<T>(
            WinFormsActionOptsCore<T> opts)
        {
            var dfMsgTuple = opts.ActionName?.With<string, UIMessageTuple>(
                actionName => null) ?? new UIMessageTuple();

            var uiMsgTuple = opts.OnBeforeAction?.Invoke();
            IActionResult<T> actionResult = null;

            LogMsgIfReq(
                opts.OnBeforeAction != null,
                uiMsgTuple,
                () => dfMsgTuple ?? new UIMessageTuple(
                    $"Executing action [{opts.ActionName}]"));

            return Tuple.Create(
                dfMsgTuple, actionResult);
        }

        private void OnAction<T>(
            WinFormsActionOptsCore<T> opts,
            UIMessageTuple dfMsgTuple,
            IActionResult<T> actionResult)
        {
            var uiMsgTuple = opts.OnAfterAction?.Invoke(actionResult);
            string resultName = actionResult.IsSuccess ? "a success" : "an error";

            LogMsgIfReq(
                actionResult, true,
                uiMsgTuple,
                result => dfMsgTuple ?? new UIMessageTuple(
                    $"Action [{opts.ActionName}] returned {resultName} result"));
        }

        private IActionResult<T> OnUnhandledError<T>(
            WinFormsActionOptsCore<T> opts,
            UIMessageTuple dfMsgTuple,
            Exception ex)
        {
            (var actionResult, var uiMsgTuple) = (opts.OnUnhandledError?.Invoke(
                ex) ?? new Tuple<IActionResult<T>, UIMessageTuple>(
                    null, null));

            actionResult ??= new ActionResult<T>(default, ex);

            LogMsgIfReq(
                actionResult, true,
                uiMsgTuple,
                result => dfMsgTuple ?? new UIMessageTuple(
                    $"Executing action [{opts.ActionName}] resulted in an unhandled error"));

            return actionResult;
        }

        private void OnAfterExecution<T>(
            WinFormsActionOptsCore<T> opts,
            UIMessageTuple dfMsgTuple,
            IActionResult<T> actionResult)
        {
            var uiMsgTuple = opts.OnAfterExecution?.Invoke(actionResult);

            LogMsgIfReq(
                actionResult,
                opts.OnAfterExecution != null,
                uiMsgTuple,
                result => dfMsgTuple ?? new UIMessageTuple());
        }

        private void LogMsgIfReq(
            bool condition,
            UIMessageTuple msgTuple,
            Func<UIMessageTuple> dfMsgTupleFactory)
        {
            if (condition)
            {
                var dfMsgTuple = dfMsgTupleFactory();

                var logMessage = msgTuple.LogMessage ?? dfMsgTuple.LogMessage;

                if (!string.IsNullOrEmpty(logMessage))
                {
                    Logger.Verbose(logMessage);
                }

                var message = msgTuple.Message ?? dfMsgTuple.Message;
                
                if (!string.IsNullOrEmpty(message))
                {
                    var caption = msgTuple.Caption ?? dfMsgTuple.Caption;

                    if (!string.IsNullOrEmpty(caption))
                    {
                        MessageBox.Show(
                            caption, message);
                    }
                    else
                    {
                        MessageBox.Show(message);
                    }
                }
            }
        }

        private void LogMsgIfReq<T>(
            IActionResult<T> actionResult,
            bool condition,
            UIMessageTuple msgTuple,
            Func<IActionResult<T>, UIMessageTuple> dfMsgTupleFactory)
        {
            if (condition)
            {
                if (actionResult.IsSuccess)
                {
                    LogMsgIfReq(
                        condition,
                        msgTuple,
                        () => dfMsgTupleFactory(actionResult));
                }
                else
                {
                    var dfMsgTuple = dfMsgTupleFactory(actionResult);
                    var logMessage = msgTuple.LogMessage ?? dfMsgTuple.LogMessage;

                    if (!string.IsNullOrEmpty(logMessage))
                    {
                        Logger.Write(
                            LogLevel.Error,
                            actionResult.Exception,
                            logMessage);
                    }

                    var message = msgTuple.Message ?? dfMsgTuple.Message;

                    if (!string.IsNullOrEmpty(message))
                    {
                        var caption = msgTuple.Caption ?? dfMsgTuple.Caption;

                        if (!string.IsNullOrEmpty(caption))
                        {
                            MessageBox.Show(
                                caption ?? "Error",
                                message,
                                MessageBoxButtons.OK,
                                MessageBoxIcon.Error);
                        }
                        else
                        {
                            MessageBox.Show(
                                "Error",
                                message,
                                MessageBoxButtons.OK,
                                MessageBoxIcon.Error);
                        }
                    }
                }
            }
        }
    }
}
