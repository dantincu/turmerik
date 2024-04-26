using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

namespace Turmerik.UnitTests
{
    public partial class FilteredDriveEntriesSynchronizerUnitTest
    {
        [Fact]
        public async Task Test1() => await PerformTestAsync(
            FileSyncType.Pull,
            false,
            new Dictionary<string, List<string>>
            {
                { "lib1", "lib2".Lst() }
            },
            new Dictionary<string, List<string>>
            {
                { "lib1", [] },
                { "lib2", "lib1".Lst() }
            },
            "test1");
    }
}
