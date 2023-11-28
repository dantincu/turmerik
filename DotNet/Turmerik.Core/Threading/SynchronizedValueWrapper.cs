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
            Action<AccessorsTuple<TValue>> action);

        TValue Execute(
            Action<AccessorsTuple<TValue>> beforeAction,
            Action<TValue, TValue> action,
            Action<AccessorsTuple<TValue>, Exception> afterAction);

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

            Accessors = new AccessorsTuple<TValue>(
                () => this.value, value => this.value = value);
        }

        public TValue Value
        {
            get => GetValue();
            set => SetValue(value);
        }

        protected AccessorsTuple<TValue> Accessors { get; }

        public TValue ExecuteConcurrent(
            Action<AccessorsTuple<TValue>> action)
        {
            semaphore.Wait();
            TValue retVal;

            try
            {
                action(Accessors);
                retVal = this.value;
            }
            finally
            {
                semaphore.Release();
            }

            return retVal;
        }

        public TValue Execute(
            Action<AccessorsTuple<TValue>> beforeAction,
            Action<TValue, TValue> action,
            Action<AccessorsTuple<TValue>, Exception> afterAction)
        {
            Exception excp = null;
            TValue retVal;

            try
            {
                var initialValue = this.value;
                var currentVal = ExecuteConcurrent(beforeAction);

                action(initialValue, currentVal);
            }
            catch(Exception exc)
            {
                excp = exc;
            }
            finally
            {
                retVal = ExecuteConcurrent(
                    accessors => afterAction(
                        accessors, excp));
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
                accessors =>
                {
                    initialValue = accessors.Getter();
                    accessors.Setter(tempVal);
                },
                action,
                (accessors, exc) =>
                {
                    accessors.Setter(initialValue);

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
