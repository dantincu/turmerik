using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.UIActions
{
    public interface IUIMessageTuple
    {
        string LogMessage { get; }
    }

    public class UIMessageTuple : IUIMessageTuple
    {
        public UIMessageTuple(
            string logMessage = null)
        {
            LogMessage = logMessage;
        }

        public string LogMessage { get; set; }

        public static UIMessageTuple Empty(
            ) => new UIMessageTuple(
                string.Empty);
    }
}
