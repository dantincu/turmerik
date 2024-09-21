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
    }
}
