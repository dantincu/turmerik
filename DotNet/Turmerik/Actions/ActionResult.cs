using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Actions
{
    public class ActionResult : IActionResult
    {
        public ActionResult(
            Exception exception)
        {
            Exception = exception;
        }

        public Exception Exception { get; }

        public virtual bool IsFail => Exception != null;
        public virtual bool IsSuccess => !IsFail;
    }

    public class ActionResult<T> : ActionResult, IActionResult<T>
    {
        public ActionResult(
            T value,
            Exception exception) : base(
                exception)
        {
            Value = value;
        }

        public T Value { get; }
    }
}
