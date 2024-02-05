using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Turmerik.Core.DriveExplorer
{
    public class DriveEntriesFilter
    {
        public List<Regex> IncludedRelPathRegexes { get; set; }
        public List<Regex> ExcludedRelPathRegexes { get; set; }
    }
}
