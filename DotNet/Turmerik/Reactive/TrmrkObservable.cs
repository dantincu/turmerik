using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Reactive
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
            this.value = initialValue;
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
            this.valueChanged = null;
        }

        public IDisposable Subscribe(IObserver<T> observer)
        {
            this.valueChanged += value => observer.OnNext(value);

            if (this.fireOnSubscribe)
            {
                observer.OnNext(value);
            }

            return this;
        }
    }
}
