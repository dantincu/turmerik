using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.FsUtils.WinForms.App
{
    public interface IUILogMessage
    {
        Guid Uuid { get; }
        UILogMessageLevel Level { get; }
        string Message { get; }
        DateTime TimeStamp { get; }
        string TimeStampStr { get; }
        Exception Exception { get; }
    }

    public class UILogMessageImmtbl : IUILogMessage
    {
        public UILogMessageImmtbl(IUILogMessage src)
        {
            Uuid = src.Uuid;
            Level = src.Level;
            Message = src.Message;
            TimeStamp = src.TimeStamp;
            TimeStampStr = src.TimeStampStr;
            Exception = src.Exception;
        }

        public Guid Uuid { get; }
        public UILogMessageLevel Level { get; }
        public string Message { get; }
        public DateTime TimeStamp { get; }
        public string TimeStampStr { get; }
        public Exception Exception { get; }
    }

    public class UILogMessageMtbl : IUILogMessage
    {
        public UILogMessageMtbl()
        {
        }

        public UILogMessageMtbl(IUILogMessage src)
        {
            Uuid = src.Uuid;
            Level = src.Level;
            Message = src.Message;
            TimeStamp = src.TimeStamp;
            TimeStampStr = src.TimeStampStr;
            Exception = src.Exception;
        }

        public Guid Uuid { get; set; }
        public UILogMessageLevel Level { get; set; }
        public string Message { get; set; }
        public DateTime TimeStamp { get; set; }
        public string TimeStampStr { get; set; }
        public Exception Exception { get; set; }
    }

    public enum UILogMessageLevel
    {
        Information = 1,
        Warning = 2,
        Error = 3
    }
}
