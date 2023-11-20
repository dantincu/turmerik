using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Actions;

namespace Turmerik.WinForms.Actions
{
    public class WinFormsActionOptsCore<T>
    {
        public string ActionName { get; set; }
        public Func<UIMessageTuple> OnBeforeAction { get; set; }
        public Func<IActionResult<T>, UIMessageTuple> OnAfterAction { get; set; }
        public Func<Exception, Tuple<IActionResult<T>, UIMessageTuple>> OnUnhandledError { get; set; }
        public Func<IActionResult<T>, UIMessageTuple> OnAfterExecution { get; set; }
    }

    public class WinFormsActionOpts<T> : WinFormsActionOptsCore<T>
    {
        public Func<IActionResult<T>> Action { get; set; }
    }

    public class WinFormsAsyncActionOpts<T> : WinFormsActionOptsCore<T>
    {
        public Func<Task<IActionResult<T>>> Action { get; set; }
    }
}
