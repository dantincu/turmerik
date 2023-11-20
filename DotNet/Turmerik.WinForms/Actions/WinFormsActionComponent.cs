using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Actions;
using Turmerik.Logging;
using Turmerik.UIActions;

namespace Turmerik.WinForms.Actions
{
    public interface IWinFormsActionComponent : IUIActionComponent<IWinFormsMessageTuple>
    {
    }

    public class WinFormsActionComponent : UIActionComponent<IWinFormsMessageTuple>, IWinFormsActionComponent
    {
        public WinFormsActionComponent(IAppLogger logger) : base(logger)
        {
        }

        protected virtual string OnUnhandledErrorUIMsgTpl => "An unhandled error has ocurred: [{0}]";

        protected override void OnBeforeExecutionLogMsg<T>(
            IUIActionOptsCore<T, IWinFormsMessageTuple> opts,
            IWinFormsMessageTuple msgTuple)
        {
            base.OnBeforeExecutionLogMsg(opts, msgTuple);
            string message = msgTuple?.Message;

            if (!string.IsNullOrEmpty(message))
            {
                MessageBox.Show(message, msgTuple.Caption);
            }
        }

        protected override void OnUnhandledErrorLogMsg<T>(
            IUIActionOptsCore<T, IWinFormsMessageTuple> opts,
            Exception ex, IWinFormsMessageTuple msgTuple)
        {
            base.OnUnhandledErrorLogMsg(opts, ex, msgTuple);

            string message = msgTuple?.Message ?? string.Format(
                OnUnhandledErrorUIMsgTpl,
                ex.Message);

            if (!string.IsNullOrEmpty(message))
            {
                MessageBox.Show(
                    message,
                    msgTuple?.Caption ?? "Error",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);
            }
        }

        protected override void OnAfterExecutionLogMsg<T>(
            IUIActionOptsCore<T, IWinFormsMessageTuple> opts,
            IActionResult<T> actionResult,
            IWinFormsMessageTuple msgTuple)
        {
            base.OnAfterExecutionLogMsg(
                opts, actionResult, msgTuple);

            string message = msgTuple?.Message;

            if (!string.IsNullOrEmpty(message))
            {
                MessageBox.Show(message, msgTuple.Caption);
            }
        }
    }
}
