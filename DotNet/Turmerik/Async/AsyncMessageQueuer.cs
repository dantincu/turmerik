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
        void Enqueue(T item);

        Task ExecuteAsync(
            Func<Task> action,
            int? waitMillis = null);
    }

    public class AsyncMessageQueuer<T> : IAsyncMessageQueuer<T>
    {
        private readonly ConcurrentQueue<T> queue;
        private readonly Action<T> valueCallback;
        private readonly int defaultWaitMillis;

        public AsyncMessageQueuer(
            ConcurrentQueue<T> queue,
            Action<T> valueCallback,
            int defaultWaitMillis)
        {
            this.queue = queue ?? throw new ArgumentNullException(
                nameof(queue));

            this.valueCallback = valueCallback ?? throw new ArgumentNullException(
                nameof(valueCallback));

            this.defaultWaitMillis = defaultWaitMillis;
        }

        public void Enqueue(T item)
        {
            queue.Enqueue(item);
        }

        public Task ExecuteAsync(
            Func<Task> action,
            int? waitMillis = null)
        {
            while (queue.TryDequeue(out var _))
            {
            }

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

            var retTask = action().ContinueWith(
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
