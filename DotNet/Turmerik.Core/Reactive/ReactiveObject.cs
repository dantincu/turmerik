using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Reactive
{
    public class ReactiveObject<TData> : IDisposable
    {
        private Action<TData> action;

        public virtual event Action<TData> Action
        {
            add => action += value;
            remove => action -= value;
        }

        public void Fire(TData data) => action?.Invoke(data);

        public virtual void Dispose()
        {
            action = null;
        }
    }
}
