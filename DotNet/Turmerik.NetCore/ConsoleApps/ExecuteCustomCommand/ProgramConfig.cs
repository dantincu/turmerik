using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Turmerik.NetCore.ConsoleApps.ExecuteCustomCommand
{
    public class ProgramConfig
    {
        public Executor[] Commands { get; set; }

        public class Executor
        {
            public Regex RegexObj { get; set; }
            public string Regex { get; set; }
            public string ExecutorName { get; set; }
        }
    }
}
