using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Turmerik.Core.Dependencies
{
    public abstract class SingletonRegistrarBase<TData, TInputData> : IDisposable
    {
        private readonly object syncLock = new object();

        private TData data;
        private Action<TData> registered;
        private volatile int isRegistered;

        public bool IsRegistered => isRegistered == 1;

        public TData Data
        {
            get
            {
                if (isRegistered == 0)
                {
                    lock (syncLock)
                    {
                        if (isRegistered == 0)
                        {
                            throw new InvalidOperationException(
                                "The singleton has not yet been registered");
                        }
                        else
                        {
                            return data;
                        }
                    }
                }
                else
                {
                    return data;
                }
            }
        }

        public event Action<TData> Registered
        {
            add => registered += value;
            remove => registered -= value;
        }

        public bool SubscribeToData(Action<TData> callback)
        {
            TData data = default;
            bool hasData = false;

            if (isRegistered == 0)
            {
                lock (syncLock)
                {
                    if (isRegistered == 0)
                    {
                        registered += callback;
                    }
                    else
                    {
                        hasData = true;
                        data = this.data;
                    }
                }
            }
            else
            {
                hasData = true;
                data = this.data;
            }

            if (hasData)
            {
                callback(data);
            }

            return hasData;
        }

        public TData RegisterData(
            TInputData inputData,
            Action<TData> callback = null)
        {
            bool registeredNow = false;

            if (isRegistered != 0)
            {
                OnAlreadyRegistered();
            }
            else
            {
                lock (syncLock)
                {
                    if (isRegistered != 0)
                    {
                        OnAlreadyRegistered();
                    }
                    else
                    {
                        registeredNow = true;
                        data = Convert(inputData);
                        isRegistered = 1;
                    }
                }
            }

            callback?.Invoke(data);

            if (registeredNow)
            {
                registered?.Invoke(data);
            }

            return data;
        }

        public virtual void Dispose()
        {
            registered = null;
        }

        protected abstract TData Convert(TInputData inputData);

        private void OnAlreadyRegistered()
        {
            throw new InvalidOperationException(
                "The singleton has already been registered and cannot be registered twice");
        }
    }
}
