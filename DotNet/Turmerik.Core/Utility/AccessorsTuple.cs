using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public readonly struct AccessorsTuple<T>
    {
        public AccessorsTuple(
            Func<T> getter,
            Action<T> setter)
        {
            Getter = getter;
            Setter = setter;
        }

        public Func<T> Getter { get; }
        public Action<T> Setter { get; }
    }
}
