using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Helpers
{
    public static class AsyncH
    {
        public const int DEFAULT_SPIN_WAIT_COUNT = 5;
        public const int DEFAULT_WAIT_MILLIS = 100;

        public static async Task ActUsingAsync<TDisposable>(
            this TDisposable disposable,
            Func<TDisposable, Task> action) where TDisposable : IDisposable
        {
            try
            {
                await action(disposable);
            }
            finally
            {
                disposable.Dispose();
            }
        }

        public static async Task<TResult> UsingAsync<TDisposable, TResult>(
            this TDisposable disposable,
            Func<TDisposable, Task<TResult>> action) where TDisposable : IDisposable
        {
            TResult result;

            try
            {
                result = await action(disposable);
            }
            finally
            {
                disposable.Dispose();
            }

            return result;
        }
    }
}
