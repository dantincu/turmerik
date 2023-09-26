using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Actions
{
    public interface IActionErrorCatcher
    {
        IActionResult<T> Try<T>(
            Func<T> action,
            Func<Exception, T> onError = null,
            Action<T> onSuccess = null,
            Action<IActionResult<T>> onAfter = null,
            Action onBefore = null);

        IActionResult Try(
            Action action,
            Action<Exception> onError = null,
            Action onSuccess = null,
            Action<IActionResult> onAfter = null,
            Action onBefore = null);

        Task<IActionResult<T>> TryAsync<T>(
            Func<Task<T>> action,
            Func<Exception, T> onError = null,
            Action<T> onSuccess = null,
            Action<IActionResult<T>> onAfter = null,
            Action onBefore = null);

        Task<IActionResult> TryAsync(
            Func<Task> action,
            Action<Exception> onError = null,
            Action onSuccess = null,
            Action<IActionResult> onAfter = null,
            Action onBefore = null);
    }
}
