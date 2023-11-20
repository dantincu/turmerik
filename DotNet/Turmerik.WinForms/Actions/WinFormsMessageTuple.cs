using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.UIActions;

namespace Turmerik.WinForms.Actions
{
    public interface IWinFormsMessageTuple : IUIMessageTuple
    {
        public string Message { get; }
        public string Caption { get; }
    }

    public class WinFormsMessageTuple : UIMessageTuple, IWinFormsMessageTuple
    {
        public WinFormsMessageTuple(
            string logMessage = null,
            string message = null,
            string caption = null) : base(logMessage)
        {
            Message = message;
            Caption = caption;
        }

        public string Message { get; set; }
        public string Caption { get; set; }

        public static WinFormsMessageTuple WithOnly(
            string logMessage = null,
            string message = null,
            string caption = null) => new WinFormsMessageTuple(
                logMessage ?? string.Empty,
                message ?? string.Empty,
                caption ?? string.Empty);
    }
}
