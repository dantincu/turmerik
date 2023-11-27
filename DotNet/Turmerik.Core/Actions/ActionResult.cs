using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Actions
{
    public class ActionResult : IActionResult
    {
        public ActionResult(
            Exception exception = null,
            bool? isFail = null)
        {
            Exception = exception;
            IsFail = isFail ?? exception != null;
        }

        public Exception Exception { get; }

        public virtual bool IsFail { get; }
        public virtual bool IsSuccess => !IsFail;
    }

    public class ActionResult<T> : ActionResult, IActionResult<T>
    {
        public ActionResult(
            T value = default,
            Exception exception = null,
            bool? isFail = null) : base(
                exception,
                isFail)
        {
            Value = value;
        }

        public T Value { get; }
    }
}
