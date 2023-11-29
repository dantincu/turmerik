using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.UIActions;

namespace Turmerik.WinForms.Actions
{
    public interface IWinFormsMessageTuple : IUIMessageTuple
    {
        public string StatusMessage { get; }
        public string Message { get; }
        public string Caption { get; }
    }

    public class WinFormsMessageTuple : UIMessageTuple, IWinFormsMessageTuple
    {
        public WinFormsMessageTuple(
            string logMessage = null,
            string statusMessage = null,
            string message = null,
            string caption = null) : base(logMessage)
        {
            StatusMessage = statusMessage;
            Message = message;
            Caption = caption;
        }

        public string StatusMessage { get; set; }
        public string Message { get; set; }
        public string Caption { get; set; }

        public static WinFormsMessageTuple WithOnly(
            string statusMessage = null,
            string message = null,
            string caption = null,
            string logMessage = null) => new WinFormsMessageTuple(
                logMessage ?? string.Empty,
                statusMessage ?? string.Empty,
                message ?? string.Empty,
                caption ?? string.Empty);
    }
}
