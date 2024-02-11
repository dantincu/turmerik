using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public readonly struct OptionalValue<T>
    {
        public OptionalValue(
            bool hasValue,
            T value)
        {
            HasValue = hasValue;
            Value = value;
        }

        public bool HasValue { get; }
        public T Value { get; }
    }
}
