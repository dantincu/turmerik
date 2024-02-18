using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.Utility
{
    public class PowerShellCommandOpts
    {
        public string CommandName { get; set; }
        public IEnumerable<string> CommandArguments { get; set; }
        public Dictionary<string, object?> CommandParameters { get; set; }
    }
}
