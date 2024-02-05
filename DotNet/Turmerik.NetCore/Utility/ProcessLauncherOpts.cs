using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.Utility
{
    public class ProcessLauncherOpts
    {
        public string WorkingDirectory { get; set; }
        public string FileName { get; set; }
        public IEnumerable<string> ArgumentsNmrbl { get; set; }
    }
}
