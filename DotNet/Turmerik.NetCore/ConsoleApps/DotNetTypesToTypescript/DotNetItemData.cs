using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public class DotNetItemData
    {
    }

    public class DotNetTypeData : DotNetItemData
    {
        public bool? IsRootBaseType { get; set; }
        public bool? IsPrimitive { get; set; }
        public string TypeName { get; set; }
    }

    public class DotNetAssemblyData : DotNetItemData
    {
        public bool? IsTurmerikAssembly { get; set; }
    }
}
