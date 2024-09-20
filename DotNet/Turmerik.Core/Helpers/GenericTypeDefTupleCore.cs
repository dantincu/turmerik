using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public class GenericTypeDefTupleCore
    {
        public GenericTypeDefTupleCore(
            Type type)
        {
            Type = type;
            Name = type.GetTypeFullName();
        }

        public Type Type { get; }
        public string Name { get; }

    }

    public class GenericTypeDefTuple : GenericTypeDefTupleCore
    {
        public GenericTypeDefTuple(
            Type type,
            Type? baseType) : base(type)
        {
            BaseType = baseType;
        }

        public Type? BaseType { get; }
    }
}
