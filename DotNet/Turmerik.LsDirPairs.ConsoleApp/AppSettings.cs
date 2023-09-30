using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LsDirPairs.ConsoleApp
{
    public class AppSettings
    {
        public TrmrkT Trmrk { get; set; }

        public class TrmrkT
        {
            public string SortIgnorableStartChars { get; set; }
        }
    }
}
