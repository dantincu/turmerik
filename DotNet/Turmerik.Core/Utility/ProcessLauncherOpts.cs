using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Utility
{
    public class ProcessLauncherOpts
    {
        public string WorkingDirectory { get; set; }
        public string FileName { get; set; }
        public IEnumerable<string> ArgumentsNmrbl { get; set; }

        public bool? RedirectStandardError { get; set; }
        public bool? RedirectStandardOutput { get; set; }
        public bool? RedirectStandardInput { get; set; }

        public bool? UseShellExecute { get; set; }

        public Action<ProcessLauncherOpts> OptsBuilder { get; set; }
        public Action<ProcessStartInfo> StartInfoBuilder { get; set; }
    }
}
