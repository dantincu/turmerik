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
            ConcurrentQueue<T> queue = null);
    }

    public class AsyncMessageQueuer<T> : IAsyncMessageQueuer<T>
    {
        private readonly Action<T> valueCallback;
        private readonly Func<Exception, bool> unhandledErrorCallback;
        private readonly Action<ConcurrentQueue<T>> alwaysCallback;
        private readonly int spinWaitCount;
        private readonly int waitMillis;

        public AsyncMessageQueuer(
            AsyncMessageQueuerOpts<T> opts)
        {
            this.valueCallback = opts.ValueCallback ?? throw new ArgumentNullException(
                nameof(valueCallback));

            this.unhandledErrorCallback = opts.UnhandledErrorCallback ?? throw new ArgumentNullException(
                nameof(unhandledErrorCallback));

            this.alwaysCallback = opts.AlwaysCallback ?? throw new ArgumentNullException(
                nameof(alwaysCallback));

            this.spinWaitCount = opts.SpinWaitCount;
            this.waitMillis = opts.WaitMillis;
        }

        public Task ExecuteAsync(
            Func<ConcurrentQueue<T>, Task> action,
            ConcurrentQueue<T> queue = null)
        {
            queue ??= new ConcurrentQueue<T>();

            bool taskFinished = false;
            bool threadCrashed = false;
            bool sleep = false;

            var thread = new Thread(() =>
            {
                while (!taskFinished)
                {
                    if (queue.TryDequeue(out var value))
                    {
                        sleep = false;

                        try
                        {
                            valueCallback(value);
                        }
                        catch (Exception exc)
                        {
                            threadCrashed = true;

                            if (unhandledErrorCallback(exc))
                            {
                                throw;
                            }
                        }
                        finally
                        {
                            alwaysCallback(queue);
                        }
                    }
                    else
                    {
                        if (sleep)
                        {
                            if (waitMillis > 0)
                            {
                                Thread.Sleep(waitMillis);
                            }
                        }
                        else
                        {
                            if (spinWaitCount > 0)
                            {
                                Thread.SpinWait(spinWaitCount);
                            }
                        }

                        sleep = !sleep;
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
