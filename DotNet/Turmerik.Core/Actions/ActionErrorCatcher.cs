using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Actions
{
    public class ActionErrorCatcher : IActionErrorCatcher
    {
        public IActionResult<T> Try<T>(
            Func<T> action,
            Func<Exception, T> onError = null,
            Action<T> onSuccess = null,
            Action<IActionResult<T>> onAfter = null,
            Action onBefore = null)
        {
            T value;
            Exception exception = null;
            onBefore?.Invoke();

            try
            {
                value = action();
            }
            catch (Exception exc)
            {
                (value, exception) = OnUnhandledError(
                    onError, exc);
            }

            var result = CreateResult(
                value,
                exception,
                onSuccess,
                onAfter);

            return result;
        }

        public IActionResult Try(
            Action action,
            Action<Exception> onError = null,
            Action onSuccess = null,
            Action<IActionResult> onAfter = null,
            Action onBefore = null)
        {
            Exception exception = null;
            onBefore?.Invoke();

            try
            {
                action();
            }
            catch (Exception exc)
            {
                exception = exc;
                onError?.Invoke(exc);
            }

            var result = CreateResult(
                exception,
                onSuccess,
                onAfter);

            return result;
        }

        public async Task<IActionResult<T>> TryAsync<T>(
            Func<Task<T>> action,
            Func<Exception, T> onError = null,
            Action<T> onSuccess = null,
            Action<IActionResult<T>> onAfter = null,
            Action onBefore = null)
        {
            T value;
            Exception exception = null;
            onBefore?.Invoke();

            try
            {
                value = await action();
            }
            catch (Exception exc)
            {
                (value, exception) = OnUnhandledError(
                    onError, exc);
            }

            var result = CreateResult(
                value,
                exception,
                onSuccess,
                onAfter);

            return result;
        }

        public async Task<IActionResult> TryAsync(
            Func<Task> action,
            Action<Exception> onError = null,
            Action onSuccess = null,
            Action<IActionResult> onAfter = null,
            Action onBefore = null)
        {
            Exception exception = null;
            onBefore?.Invoke();

            try
            {
                await action();
            }
            catch (Exception exc)
            {
                exception = exc;
                onError?.Invoke(exc);
            }

            var result = CreateResult(
                exception,
                onSuccess,
                onAfter);

            return result;
        }

        private Tuple<T, Exception> OnUnhandledError<T>(
            Func<Exception, T> onError,
            Exception exc)
        {
            T value;

            if (onError != null)
            {
                value = onError(exc);
            }
            else
            {
                value = default;
            }

            return Tuple.Create(value, exc);
        }

        private IActionResult CreateResult(
            Exception exc,
            Action onSuccess = null,
            Action<IActionResult> onAfter = null)
        {
            var result = new ActionResult(exc);

            if (result.IsSuccess)
            {
                onSuccess?.Invoke();
            }

            onAfter?.Invoke(result);
            return result;
        }

        private IActionResult<T> CreateResult<T>(
            T value,
            Exception exc,
            Action<T> onSuccess = null,
            Action<IActionResult<T>> onAfter = null)
        {
            var result = new ActionResult<T>(value, exc);

            if (result.IsSuccess)
            {
                onSuccess?.Invoke(value);
            }

            onAfter?.Invoke(result);
            return result;
        }
    }
}
