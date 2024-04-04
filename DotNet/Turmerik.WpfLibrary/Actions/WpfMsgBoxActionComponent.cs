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
    public interface IWpfMsgBoxActionComponent : IUIActionComponent<IWpfMessageTuple>
    {
    }

    public class WpfMsgBoxActionComponent : UIActionComponent<IWpfMessageTuple>, IWpfMsgBoxActionComponent
    {
        public WpfMsgBoxActionComponent(IAppLogger logger) : base(logger)
        {
        }

        protected virtual string OnUnhandledErrorUIMsgTpl => "An unhandled error has ocurred: {0}";

        protected override void OnUnhandledErrorLogMsg<T>(
            IUIActionOptsCore<T, IWpfMessageTuple> opts,
            Exception ex, IWpfMessageTuple msgTuple)
        {
            base.OnUnhandledErrorLogMsg(opts, ex, msgTuple);

            string message = msgTuple?.StatusMessage ?? string.Format(
                OnUnhandledErrorUIMsgTpl,
                ex.Message);

            if (!string.IsNullOrEmpty(message))
            {
                /* MessageBox.Show(
                    message,
                    msgTuple?.Caption ?? "Error",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error); */
            }
        }
    }
}
