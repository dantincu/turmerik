using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Actions
{
    public class UIMessageTuple
    {
        public UIMessageTuple(
            string logMessage = null,
            string message = null,
            string caption = null)
        {
            LogMessage = logMessage;
            Message = message;
            Caption = caption;
        }

        public string LogMessage { get; set; }
        public string Message { get; set; }
        public string Caption { get; set; }

        public static UIMessageTuple WithOnly(
            string logMessage = null,
            string message = null,
            string caption = null) => new UIMessageTuple(
                logMessage ?? string.Empty,
                message ?? string.Empty,
                caption ?? string.Empty);
    }
}
