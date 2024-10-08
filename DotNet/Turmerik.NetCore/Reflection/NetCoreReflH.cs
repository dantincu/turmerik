using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.NetCore.Reflection
{
    public static class NetCoreReflH
    {
        public static readonly TypeTupleCore DateOnlyType = new(typeof(DateOnly));

        public static readonly TypeTupleCore DelegateType = new(typeof(Delegate));

        public static readonly TypeTupleCore MulticastDelegateType = new(typeof(MulticastDelegate));

        public static readonly TypeTupleCore EnumType = new(typeof(Enum));

        public static bool IsDelegateType(
            this Type type) => type.BaseType?.FullName == MulticastDelegateType.FullName;
    }
}
