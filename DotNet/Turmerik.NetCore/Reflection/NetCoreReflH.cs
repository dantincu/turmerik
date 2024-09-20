using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.NetCore.Reflection
{
    public static class NetCoreReflH
    {
        public static readonly Type DateOnlyType = typeof(DateOnly);
        public static readonly string DateOnlyTypeName = DateOnlyType.GetTypeFullName();
    }
}
