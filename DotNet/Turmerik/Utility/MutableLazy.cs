using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Turmerik.Utility
{
    public class MutableLazy<T>
    {
        private readonly object syncLock;
        private readonly Func<T> factory;
        private readonly LazyThreadSafetyMode lazyThreadSafetyMode;

        private T value;
        private bool hasValue;

        public MutableLazy(
            Func<T> factory,
            LazyThreadSafetyMode lazyThreadSafetyMode = LazyThreadSafetyMode.None)
        {
            this.syncLock = new object();
            this.factory = factory ?? throw new ArgumentNullException(nameof(factory));
            this.lazyThreadSafetyMode = lazyThreadSafetyMode;
        }

        public T Value => lazyThreadSafetyMode switch
        {
            LazyThreadSafetyMode.ExecutionAndPublication => GetValueThreadSafe(),
            LazyThreadSafetyMode.PublicationOnly => GetValueThreadSafePublication(),
            _ => GetValue()
        };

        public bool HasValue => lazyThreadSafetyMode switch
        {
            LazyThreadSafetyMode.None => this.hasValue,
            _ => HasValueSync()
        };

        public T Remove() => lazyThreadSafetyMode switch
        {
            LazyThreadSafetyMode.None => RemoveCore(),
            _ => RemoveThreadSafe()
        };

        private T GetValue()
        {
            T retVal;

            if (!this.hasValue)
            {
                retVal = factory();
                this.value = retVal;
            }
            else
            {
                retVal = this.value;
            }

            return retVal;
        }

        private T GetValueThreadSafe()
        {
            T retVal;

            lock (syncLock)
            {
                retVal = GetValue();
            }

            return retVal;
        }

        private T GetValueThreadSafePublication()
        {
            T retVal;
            bool hasValue;

            lock (syncLock)
            {
                hasValue = this.hasValue;
                retVal = this.value;
            }

            if (!hasValue)
            {
                retVal = this.factory();

                lock (syncLock)
                {
                    this.value = retVal;
                    this.hasValue = true;
                }
            }

            return retVal;
        }

        private bool HasValueSync()
        {
            bool hasValue;

            lock (syncLock)
            {
                hasValue = this.hasValue;
            }

            return hasValue;
        }

        private T RemoveThreadSafe()
        {
            T retVal;

            lock (syncLock)
            {
                retVal = RemoveCore();
            }

            return retVal;
        }

        private T RemoveCore()
        {
            T retVal = this.value;
            this.value = default;

            this.hasValue = false;
            return retVal;
        }
    }
}
