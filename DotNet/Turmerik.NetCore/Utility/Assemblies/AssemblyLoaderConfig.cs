using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.Utility.Assemblies
{
    public class AssemblyLoaderConfig
    {
        public string NetStandard2p1LibDirLocation { get; set; }
        public string NetStandard2p1LibFileLocation { get; set; }
        public bool? UseNetStandard2p1 { get; set; }

    }
}
