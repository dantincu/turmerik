using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.RegularExpressions;

namespace Turmerik.DriveExplorer.Notes
{
    public static class NoteDirTypeH
    {
        public static NoteDirRegexTuple NoteDirTuple(
            this Regex regex,
            string prefix) => new NoteDirRegexTuple(
                regex, prefix);
    }
}
