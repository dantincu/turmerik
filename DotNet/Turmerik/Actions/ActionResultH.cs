using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Actions
{
    public static class ActionResultH
    {
        public static IActionResult ToActionResult(
            this Exception exc,
            bool? isFail = null) => new ActionResult(
                exc, isFail);

        public static IActionResult ToActionResult<T>(
            this Exception exc,
            T value,
            bool? isFail = null) => new ActionResult<T>(
                value, exc, isFail);

        public static IActionResult<T> Create<T>(
            T value,
            Exception exc,
            bool? isFail = null) => new ActionResult<T>(
                value, exc, isFail);
    }
}
