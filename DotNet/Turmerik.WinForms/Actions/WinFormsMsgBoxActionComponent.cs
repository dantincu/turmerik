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
    public interface IWinFormsMsgBoxActionComponent : IUIActionComponent<IWinFormsMessageTuple>
    {
    }

    public class WinFormsMsgBoxActionComponent : UIActionComponent<IWinFormsMessageTuple>, IWinFormsMsgBoxActionComponent
    {
        public WinFormsMsgBoxActionComponent(IAppLogger logger) : base(logger)
        {
        }

        protected virtual string OnUnhandledErrorUIMsgTpl => "An unhandled error has ocurred: {0}";

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
    }
}
