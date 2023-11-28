using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Turmerik.Core.Threading
{
    public interface IIntermitentBackgroundWorker
    {
        bool IsActive { get; }

        bool Start();
        bool Stop();
    }

    public class IntermitentBackgroundWorker : IIntermitentBackgroundWorker
    {
        private readonly SemaphoreSlim semaphore;

        private volatile int isActive;
        private volatile Thread thread;

        public IntermitentBackgroundWorker(
            IntermitentBackgroundWorkerOpts opts)
        {
            this.semaphore = opts.Semaphore ?? throw new ArgumentNullException(
                nameof(semaphore));

            LoopCallback = opts.LoopCallback ?? throw new ArgumentNullException(
                nameof(LoopCallback));
        }

        public bool IsActive
        {
            get
            {
                semaphore.Wait();
                bool isActive = this.isActive != 0;
                semaphore.Release();
                return isActive;
            }
        }

        protected Action LoopCallback { get; }

        public bool Start()
        {
            semaphore.Wait();

            bool wasNotActive = Interlocked.CompareExchange(
                ref isActive, 1, 0) == 0;

            thread = new Thread(() =>
            {
                while (IsActive)
                {
                    LoopCallback();
                }
            });

            try
            {
                thread.Start();
            }
            finally
            {
                semaphore.Release();
            }

            return wasNotActive;
        }

        public bool Stop()
        {
            semaphore.Wait();

            bool wasActive = Interlocked.CompareExchange(
                ref isActive, 0, 1) == 1;

            semaphore.Release();
            return wasActive;
        }
    }
}
