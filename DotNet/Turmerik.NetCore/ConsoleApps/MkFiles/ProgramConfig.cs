using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Jint.ConsoleApps;

namespace Turmerik.NetCore.ConsoleApps.MkFiles
{
    public class ProgramConfig : ProgramBehaviorCoreBase<ProgramConfig.Profile>
    {
        public class Profile : ProgramBehaviorProfileCoreBase
        {
            public string JsFilePath { get; set; }
            public string NextDotNetMethodCallArgsExprRetrieverJsCode { get; set; }
        }
    }
}
