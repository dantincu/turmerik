using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;

namespace Turmerik.Core.ConsoleApps.TempDir
{
    public class TempDirConsoleAppOptsCore
    {
        public TrmrkUniqueDirOpts TempDirOpts { get; set; }

        public bool? RemoveExistingTempDirsBeforeAction { get; set; }
        public bool? RemoveTempDirAfterAction { get; set; }
        public Action<TrmrkUniqueDir, Exception> OnBeforeActionCrash { get; set; }
        public Action<TrmrkUniqueDir, Exception> OnActionCrash { get; set; }
        public bool? RethrowBeforeActionExc { get; set; }
        public bool? RethrowActionExc { get; set; }
    }

    public class TempDirConsoleAppOpts : TempDirConsoleAppOptsCore
    {
        public Action<TrmrkUniqueDir> Action { get; set; }
    }

    public class TempDirAsyncConsoleAppOpts : TempDirConsoleAppOptsCore
    {
        public Func<TrmrkUniqueDir, Task> Action { get; set; }
    }
}
