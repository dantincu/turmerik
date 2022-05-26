using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Collections.TypeMapped
{
    public class TypeMappedTuple<TData>
    {
        public TypeMappedTuple(Type type, TData data)
        {
            Type = type ?? throw new ArgumentNullException(nameof(type));
            Data = data;
        }

        public Type Type { get; }
        public TData Data { get; }
    }
}
