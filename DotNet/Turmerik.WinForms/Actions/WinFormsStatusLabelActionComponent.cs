using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Logging;
using Turmerik.Core.UIActions;

namespace Turmerik.WinForms.Actions
{
    public interface IWinFormsStatusLabelActionComponent : IUIActionComponent<IWinFormsMessageTuple>
    {
        Func<WinFormsStatusLabelActionComponentOpts> OptsRetriever { get; }
    }

    public class WinFormsStatusLabelActionComponent : UIActionComponent<IWinFormsMessageTuple>, IWinFormsStatusLabelActionComponent
    {
        public WinFormsStatusLabelActionComponent(
            IAppLogger logger,
            Func<WinFormsStatusLabelActionComponentOpts> optsRetriever) : base(logger)
        {
            OptsRetriever = optsRetriever ?? throw new ArgumentNullException(nameof(optsRetriever));
        }

        public Func<WinFormsStatusLabelActionComponentOpts> OptsRetriever { get; }

        protected virtual string OnUnhandledErrorUIMsgTpl => "An unhandled error has ocurred: {0}";

        protected override void OnBeforeExecutionLogMsg<T>(
            IUIActionOptsCore<T, IWinFormsMessageTuple> opts,
            IWinFormsMessageTuple msgTuple)
        {
            base.OnBeforeExecutionLogMsg(opts, msgTuple);
            string message = msgTuple?.StatusMessage;

            OptsRetriever()?.ActWith(opts =>
                SetStatusLabelMessage(message,
                    opts.DefaultForeColor));
        }

        protected override void OnUnhandledErrorLogMsg<T>(
            IUIActionOptsCore<T, IWinFormsMessageTuple> opts,
            Exception ex, IWinFormsMessageTuple msgTuple)
        {
            base.OnUnhandledErrorLogMsg(opts, ex, msgTuple);

            string statusMessage = msgTuple?.StatusMessage ?? string.Format(
                OnUnhandledErrorUIMsgTpl,
                ex.Message);

            OptsRetriever()?.ActWith(opts =>
                SetStatusLabelMessage(statusMessage,
                opts.ErrorForeColor));

            if (msgTuple != null)
            {
                string message = msgTuple.Message;
                string caption = msgTuple.Caption ?? "Error";

                if (!string.IsNullOrEmpty(message))
                {
                    MessageBox.Show(
                        message, caption,
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Error);
                }
            }
        }

        protected override void OnAfterExecutionLogMsg<T>(
            IUIActionOptsCore<T, IWinFormsMessageTuple> opts,
            IActionResult<T> actionResult,
            IWinFormsMessageTuple msgTuple)
        {
            base.OnAfterExecutionLogMsg(
                opts, actionResult, msgTuple);

            string message = msgTuple?.StatusMessage;

            OptsRetriever()?.ActWith(opts =>
                SetStatusLabelMessage(message,
                opts.DefaultForeColor));
        }

        private void SetStatusLabelMessage(
            string statusMessage,
            Color foreColor)
        {
            if (!string.IsNullOrEmpty(statusMessage))
            {
                OptsRetriever()?.StatusLabel.ActWith(statusLabel =>
                {
                    statusLabel.Text = statusMessage;
                    statusLabel.ForeColor = foreColor;
                });
            }
        }
    }
}
