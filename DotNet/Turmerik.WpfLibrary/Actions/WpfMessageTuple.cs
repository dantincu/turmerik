using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.UIActions;

namespace Turmerik.WpfLibrary.Actions
{
    public interface IWpfMessageTuple : IUIMessageTuple
    {
        public string StatusMessage { get; }
        public string Message { get; }
        public string Caption { get; }
    }

    public class WpfMessageTuple : UIMessageTuple, IWpfMessageTuple
    {
        public WpfMessageTuple(
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

        public static WpfMessageTuple WithOnly(
            string statusMessage = null,
            string message = null,
            string caption = null,
            string logMessage = null) => new WpfMessageTuple(
                logMessage ?? string.Empty,
                statusMessage ?? string.Empty,
                message ?? string.Empty,
                caption ?? string.Empty);
    }
}
