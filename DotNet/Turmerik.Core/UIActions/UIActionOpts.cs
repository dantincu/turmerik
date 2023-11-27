using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Actions;

namespace Turmerik.Core.UIActions
{
    public interface IUIActionOptsCore<T, TUIMessageTuple>
        where TUIMessageTuple : IUIMessageTuple
    {
        string ActionName { get; }
        Func<TUIMessageTuple> OnBeforeExecution { get; }
        Func<Exception, TUIMessageTuple> OnUnhandledError { get; }
        Func<IActionResult<T>, TUIMessageTuple> OnAfterExecution { get; }
    }

    public interface IUIActionOpts<T, TUIMessageTuple> : IUIActionOptsCore<T, TUIMessageTuple>
        where TUIMessageTuple : IUIMessageTuple
    {
        Func<IActionResult<T>> Action { get; }
    }

    public interface IUIAsyncActionOpts<T, TUIMessageTuple> : IUIActionOptsCore<T, TUIMessageTuple>
        where TUIMessageTuple : IUIMessageTuple
    {
        Func<Task<IActionResult<T>>> Action { get; }
    }

    public class UIActionOptsCore<T, TUIMessageTuple> : IUIActionOptsCore<T, TUIMessageTuple>
        where TUIMessageTuple : IUIMessageTuple
    {
        public string ActionName { get; set; }
        public Func<TUIMessageTuple> OnBeforeExecution { get; set; }
        public Func<Exception, TUIMessageTuple> OnUnhandledError { get; set; }
        public Func<IActionResult<T>, TUIMessageTuple> OnAfterExecution { get; set; }
    }

    public class UIActionOpts<T, TUIMessageTuple> : UIActionOptsCore<T, TUIMessageTuple>
        where TUIMessageTuple : IUIMessageTuple
    {
        public Func<IActionResult<T>> Action { get; set; }
    }

    public class UIAsyncActionOpts<T, TUIMessageTuple> : UIActionOptsCore<T, TUIMessageTuple>
        where TUIMessageTuple : IUIMessageTuple
    {
        public Func<Task<IActionResult<T>>> Action { get; set; }
    }
}
