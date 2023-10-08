using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Turmerik.Dependencies
{
    public abstract class SingletonRegistrarBase<TData, TInputData>
    {
        private readonly object syncLock = new object();

        private TData data;
        private Action<TData> registered;
        private volatile int isRegistered;

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

        public TData RegisterData(TInputData inputData)
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

            if (registeredNow)
            {
                registered?.Invoke(data);
            }

            return data;
        }

        protected abstract TData Convert(TInputData inputData);

        private void OnAlreadyRegistered()
        {
            throw new InvalidOperationException(
                "The singleton has already been registered and cannot be registered twice");
        }
    }
}
