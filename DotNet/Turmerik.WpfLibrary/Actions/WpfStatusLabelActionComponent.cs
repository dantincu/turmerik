using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Actions;
using Turmerik.Core.Logging;
using Turmerik.Core.UIActions;

namespace Turmerik.WpfLibrary.Actions
{
    public interface IWpfStatusLabelActionComponent : IUIActionComponent<IWpfMessageTuple>
    {
        Func<WpfStatusLabelActionComponentOpts> OptsRetriever { get; }
    }

    public class WpfStatusLabelActionComponent : UIActionComponent<IWpfMessageTuple>, IWpfStatusLabelActionComponent
    {
        public WpfStatusLabelActionComponent(
            IAppLogger logger,
            Func<WpfStatusLabelActionComponentOpts> optsRetriever) : base(logger)
        {
            OptsRetriever = optsRetriever ?? throw new ArgumentNullException(nameof(optsRetriever));
        }

        public Func<WpfStatusLabelActionComponentOpts> OptsRetriever { get; }

        protected virtual string OnUnhandledErrorUIMsgTpl => "An unhandled error has ocurred: {0}";

        protected override void OnBeforeExecutionLogMsg<T>(
            IUIActionOptsCore<T, IWpfMessageTuple> opts,
            IWpfMessageTuple msgTuple)
        {
            base.OnBeforeExecutionLogMsg(opts, msgTuple);
            string message = msgTuple?.StatusMessage;

            /* SetStatusLabelMessage(message,
                OptsRetriever().DefaultForeColor); */
        }

        protected override void OnUnhandledErrorLogMsg<T>(
            IUIActionOptsCore<T, IWpfMessageTuple> opts,
            Exception ex, IWpfMessageTuple msgTuple)
        {
            base.OnUnhandledErrorLogMsg(opts, ex, msgTuple);

            string statusMessage = msgTuple?.StatusMessage ?? string.Format(
                OnUnhandledErrorUIMsgTpl,
                ex.Message);

            /* SetStatusLabelMessage(statusMessage,
                OptsRetriever().ErrorForeColor); */

            if (msgTuple != null)
            {
                string message = msgTuple.Message;
                string caption = msgTuple.Caption ?? "Error";

                if (!string.IsNullOrEmpty(message))
                {
                    /* MessageBox.Show(
                        message, caption,
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Error); */
                }
            }
        }

        protected override void OnAfterExecutionLogMsg<T>(
            IUIActionOptsCore<T, IWpfMessageTuple> opts,
            IActionResult<T> actionResult,
            IWpfMessageTuple msgTuple)
        {
            base.OnAfterExecutionLogMsg(
                opts, actionResult, msgTuple);

            string message = msgTuple?.StatusMessage;

            /* SetStatusLabelMessage(message,
                OptsRetriever().DefaultForeColor); */
        }

        /* private void SetStatusLabelMessage(
            string statusMessage,
            Color foreColor)
        {
            if (!string.IsNullOrEmpty(statusMessage))
            {
                var statusLabel = OptsRetriever().StatusLabel;
                statusLabel.Text = statusMessage;
                statusLabel.ForeColor = foreColor;
            }
        } */
    }
}
