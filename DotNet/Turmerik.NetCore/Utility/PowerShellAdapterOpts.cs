using Microsoft.PowerShell;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.Utility
{
    public class PowerShellAdapterOpts
    {
        public string WorkDir { get; set; }
        public bool? CreateRunSpace { get; set; }
        public ExecutionPolicy? ExecutionPolicy { get; set; }
        public List<PowerShellCommandOpts> Commands { get; set; }
    }
}
