using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Turmerik.Async
{
    public interface IAsyncMessageQueuer<T>
    {
        Task ExecuteAsync(
            Func<ConcurrentQueue<T>, Task> action,
            ConcurrentQueue<T> queue = null,
            int? waitMillis = null);
    }

    public class AsyncMessageQueuer<T> : IAsyncMessageQueuer<T>
    {
        private readonly Action<T> valueCallback;
        private readonly int defaultWaitMillis;

        public AsyncMessageQueuer(
            Action<T> valueCallback,
            int defaultWaitMillis)
        {
            this.valueCallback = valueCallback ?? throw new ArgumentNullException(
                nameof(valueCallback));

            this.defaultWaitMillis = defaultWaitMillis;
        }

        public Task ExecuteAsync(
            Func<ConcurrentQueue<T>, Task> action,
            ConcurrentQueue<T> queue = null,
            int? waitMillis = null)
        {
            queue ??= new ConcurrentQueue<T>();

            int waitMillisVal = waitMillis ?? defaultWaitMillis;
            bool taskFinished = false;
            bool threadCrashed = false;

            var thread = new Thread(() =>
            {
                while (!taskFinished)
                {
                    if (queue.TryDequeue(out var value))
                    {
                        try
                        {
                            valueCallback(value);
                        }
                        catch
                        {
                            threadCrashed = true;
                            throw;
                        }
                        finally
                        {
                            while (queue.TryDequeue(out var _))
                            {
                            }
                        }
                    }
                    else
                    {
                        Thread.Sleep(waitMillisVal);
                    }
                }
            });

            thread.Start();

            var retTask = action(queue).ContinueWith(
                task =>
                {
                    taskFinished = true;

                    if (!threadCrashed)
                    {
                        thread.Join();
                    }
                });

            return retTask;
        }
    }
}
