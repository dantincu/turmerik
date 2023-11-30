using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Dependencies
{
    public abstract class SingleInstanceRetrieverBase<TData, TInputData> : IDisposable
    {
        private readonly object syncLock = new object();

        private TData data;

        private Action<TData> assigned;
        private Action removed;

        private volatile int hasData;

        public bool HasData => hasData == 1;

        public TData Data
        {
            get
            {
                TData retData;

                if (hasData == 0)
                {
                    lock (syncLock)
                    {
                        if (hasData == 0)
                        {
                            OnNotYetAssigned();
                            retData = data;
                        }
                        else
                        {
                            retData = data;
                        }
                    }
                }
                else
                {
                    retData = data;
                }

                return retData;
            }
        }

        public event Action<TData> Assigned
        {
            add => assigned += value;
            remove => assigned -= value;
        }


        public event Action DataRemoved
        {
            add => removed += value;
            remove => removed -= value;
        }

        public bool SubscribeToData(Action<TData> callback)
        {
            TData data = default;
            bool hasData = false;

            if (this.hasData == 0)
            {
                lock (syncLock)
                {
                    if (this.hasData == 0)
                    {
                        assigned += callback;
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

        public bool TryAssignData(
            TInputData inputData,
            out TData retData,
            Action<bool, TData> callback = null)
        {
            bool assignNow = false;

            if (hasData == 0)
            {
                lock (syncLock)
                {
                    if (hasData == 0)
                    {
                        assignNow = true;
                        retData = Convert(inputData);

                        data = retData;
                        hasData = 1;
                    }
                    else
                    {
                        retData = default;
                    }
                }
            }
            else
            {
                retData = default;
            }

            callback?.Invoke(
                assignNow, data);

            if (assignNow)
            {
                assigned?.Invoke(data);
            }

            return assignNow;
        }

        public bool TryRemoveData(
            out TData retData,
            Action<bool, TData> callback = null)
        {
            bool removeNow = false;

            if (hasData != 0)
            {
                lock (syncLock)
                {
                    if (hasData != 0)
                    {
                        removeNow = true;
                        retData = data;

                        data = default;
                        hasData = 0;
                    }
                    else
                    {
                        retData = default;
                    }
                }
            }
            else
            {
                retData = default;
            }

            callback?.Invoke(
                removeNow, data);

            if (removeNow)
            {
                removed?.Invoke();
            }

            return removeNow;
        }

        public TData AssignData(
            TInputData inputData,
            Action<bool, TData> callback = null)
        {
            if (!TryAssignData(
                inputData,
                out var retData,
                callback))
            {
                OnAlreadyAssigned();
            }

            return retData;
        }

        public TData RemoveData(
            Action<bool, TData> callback = null)
        {
            if (!TryRemoveData(
                out var retData,
                callback))
            {
                OnNotYetAssigned();
            }

            return retData;
        }

        public virtual void Dispose()
        {
            assigned = null;
            removed = null;
        }

        protected abstract TData Convert(TInputData inputData);

        private void OnNotYetAssigned()
        {
            throw new InvalidOperationException(
                "Either no data has been assigned or it has been removed");
        }

        private void OnAlreadyAssigned()
        {
            throw new InvalidOperationException(
                "Data has already been assigned and cannot be reassigned without removing the existing data first");
        }
    }
}
