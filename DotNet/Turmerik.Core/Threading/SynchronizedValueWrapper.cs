using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using Turmerik.Core.Utility;

namespace Turmerik.Core.Threading
{
    public interface ISynchronizedValueWrapper<TValue>
    {
        TValue Value { get; }

        TValue ExecuteConcurrent(
            RefAction<TValue> action);

        TValue Execute(
            RefAction<TValue> beforeAction,
            Action<TValue> action,
            RefAction<TValue, Exception> afterAction);

        TValue Execute(
            TValue tempVal,
            Action<TValue, TValue> action,
            Action<Exception> exceptionHandler = null);
    }

    public class SynchronizedValueWrapper<TValue> : ISynchronizedValueWrapper<TValue>
    {
        private readonly SemaphoreSlim semaphore;
        private readonly IEqualityComparer<TValue> eqCompr;
        private TValue value;

        public SynchronizedValueWrapper(
            SemaphoreSlim semaphore,
            IEqualityComparer<TValue> eqCompr,
            TValue value = default)
        {
            this.semaphore = semaphore ?? throw new ArgumentNullException(
                nameof(semaphore));

            this.eqCompr = eqCompr ?? throw new ArgumentNullException(
                nameof(eqCompr));

            this.value = value;
        }

        public TValue Value
        {
            get => GetValue();
            set => SetValue(value);
        }

        public TValue ExecuteConcurrent(
            RefAction<TValue> action)
        {
            semaphore.Wait();
            TValue retVal;

            try
            {
                action(ref this.value);
                retVal = this.value;
            }
            finally
            {
                semaphore.Release();
            }

            return retVal;
        }

        public TValue Execute(
            RefAction<TValue> beforeAction,
            Action<TValue> action,
            RefAction<TValue, Exception> afterAction)
        {
            Exception excp = null;
            TValue retVal;

            try
            {
                var val = ExecuteConcurrent(beforeAction);
                action(val);
            }
            catch(Exception exc)
            {
                excp = exc;
            }
            finally
            {
                retVal = ExecuteConcurrent(
                    (ref TValue value) => afterAction(
                        ref value, excp));
            }

            return retVal;
        }

        public TValue Execute(
            TValue tempVal,
            Action<TValue, TValue> action,
            Action<Exception> exceptionHandler = null)
        {
            TValue initialValue = this.value;

            var retVal = Execute(
                (ref TValue val) =>
                {
                    initialValue = val;
                    val = tempVal;
                },
                tmpVal => action(initialValue, tmpVal),
                (ref TValue val, Exception exc) =>
                {
                    val = initialValue;

                    if (exc != null)
                    {
                        exceptionHandler?.Invoke(exc);
                    }
                });

            return retVal;
        }

        protected TValue GetValue()
        {
            semaphore.Wait();
            var value = this.value;

            semaphore.Release();
            return value;
        }

        protected void SetValue(TValue value)
        {
            semaphore.Wait();
            this.value = value;
            semaphore.Release();
        }
    }
}
