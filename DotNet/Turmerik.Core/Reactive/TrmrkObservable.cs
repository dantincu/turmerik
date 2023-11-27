using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Reactive
{
    public class TrmrkObservable<T> : IObservable<T>, IDisposable
    {
        private readonly bool fireOnSubscribe;

        private T value;

        private Action<T> valueChanged;

        public TrmrkObservable(
            T initialValue,
            bool fireOnSubscribe)
        {
            value = initialValue;
            this.fireOnSubscribe = fireOnSubscribe;
        }

        public T Value
        {
            get => value;

            set
            {
                bool changed = true;
                this.value = value;

                if (changed)
                {
                    valueChanged?.Invoke(value);
                }
            }
        }

        public void Dispose()
        {
            valueChanged = null;
        }

        public IDisposable Subscribe(IObserver<T> observer)
        {
            valueChanged += value => observer.OnNext(value);

            if (fireOnSubscribe)
            {
                observer.OnNext(value);
            }

            return this;
        }
    }
}
