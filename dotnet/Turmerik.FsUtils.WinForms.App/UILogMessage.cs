using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.FsUtils.WinForms.App
{
    public interface IUILogMessage
    {
        UILogMessageLevel Level { get; }
        string Message { get; }
        DateTime DateTime { get; }
        Exception Exception { get; }
    }

    public class UILogMessageImmtbl : IUILogMessage
    {
        public UILogMessageImmtbl(IUILogMessage src)
        {
            Level = src.Level;
            Message = src.Message;
            DateTime = src.DateTime;
            Exception = src.Exception;
        }

        public UILogMessageLevel Level { get; }
        public string Message { get; }
        public DateTime DateTime { get; }
        public Exception Exception { get; }
    }

    public class UILogMessageMtbl : IUILogMessage
    {
        public UILogMessageMtbl()
        {
        }

        public UILogMessageMtbl(IUILogMessage src)
        {
            Level = src.Level;
            Message = src.Message;
            DateTime = src.DateTime;
            Exception = src.Exception;
        }

        public UILogMessageLevel Level { get; set; }
        public string Message { get; set; }
        public DateTime DateTime { get; set; }
        public Exception Exception { get; set; }
    }

    public enum UILogMessageLevel
    {
        Information = 1,
        Warning = 2,
        Error = 3
    }
}
