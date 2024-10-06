using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.NetCore.Reflection.AssemblyLoading;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public class DotNetTypeData
    {
        public TypeItemBase TypeItem { get; init; }
        public string TsFilePath { get; init; }
        public Dictionary<string, DotNetTypeDepData> DepTypesMap { get; init; }
    }

    public class DotNetTypeDepData
    {
        public TypeItemBase TypeItem { get; init; }
        public string TsFileRelPath { get; init; }
    }
}
