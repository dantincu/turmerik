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
    public interface IWinFormsStatusLabelActionComponent : IUIActionComponent<IWinFormsMessageTuple>
    {
        Lazy<WinFormsStatusLabelActionComponentOpts> Opts { get; }
    }

    public class WinFormsStatusLabelActionComponent : UIActionComponent<IWinFormsMessageTuple>, IWinFormsStatusLabelActionComponent
    {
        public WinFormsStatusLabelActionComponent(
            IAppLogger logger,
            Lazy<WinFormsStatusLabelActionComponentOpts> opts) : base(logger)
        {
            Opts = opts ?? throw new ArgumentNullException(nameof(opts));
        }

        public Lazy<WinFormsStatusLabelActionComponentOpts> Opts { get; }

        protected virtual string OnUnhandledErrorUIMsgTpl => "An unhandled error has ocurred: {0}";

        protected override void OnBeforeExecutionLogMsg<T>(
            IUIActionOptsCore<T, IWinFormsMessageTuple> opts,
            IWinFormsMessageTuple msgTuple)
        {
            base.OnBeforeExecutionLogMsg(opts, msgTuple);
            string message = msgTuple?.Message;

            SetStatusLabelMessage(message,
                Opts.Value.DefaultForeColor);
        }

        protected override void OnUnhandledErrorLogMsg<T>(
            IUIActionOptsCore<T, IWinFormsMessageTuple> opts,
            Exception ex, IWinFormsMessageTuple msgTuple)
        {
            base.OnUnhandledErrorLogMsg(opts, ex, msgTuple);

            string message = msgTuple?.Message ?? string.Format(
                OnUnhandledErrorUIMsgTpl,
                ex.Message);

            SetStatusLabelMessage(message,
                Opts.Value.ErrorForeColor);

            string caption = msgTuple?.Caption;

            if (caption != null)
            {
                MessageBox.Show(
                    message, caption,
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

            SetStatusLabelMessage(message,
                Opts.Value.DefaultForeColor);
        }

        private void SetStatusLabelMessage(
            string message,
            Color foreColor)
        {
            if (!string.IsNullOrEmpty(message))
            {
                var statusLabel = Opts.Value.StatusLabel;
                statusLabel.Text = message;
                statusLabel.ForeColor = foreColor;
            }
        }
    }
}
