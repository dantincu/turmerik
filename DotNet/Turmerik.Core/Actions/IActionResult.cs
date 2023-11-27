using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Actions
{
    public interface IActionResult
    {
        Exception Exception { get; }

        bool IsFail { get; }
        bool IsSuccess { get; }
    }

    public interface IActionResult<T> : IActionResult
    {
        T Value { get; }
    }
}
