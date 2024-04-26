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

        [Fact]
        public async Task Test2() => await PerformTestAsync(
            FileSyncType.Push,
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
            "test2");

        [Fact]
        public async Task Test3() => await PerformTestAsync(
            FileSyncType.Push,
            true,
            new Dictionary<string, List<string>>
            {
                { "lib1", "lib2".Lst() }
            },
            new Dictionary<string, List<string>>
            {
                { "lib1", [] },
                { "lib2", "lib1".Lst() },
                { "lib3", "lib1".Lst("lib2") },
                { "app1", "lib1".Lst() },
                { "app2", "lib1".Lst("lib2") },
                { "app3", "lib1".Lst("lib2", "lib3") }
            },
            "test3");

        [Fact]
        public async Task Test4() => await PerformTestAsync(
            FileSyncType.Push,
            false,
            new Dictionary<string, List<string>>
            {
                { "lib1", "app1".Lst() }
            },
            new Dictionary<string, List<string>>
            {
                { "lib1", [] },
                { "lib2", "lib1".Lst() },
                { "lib3", "lib1".Lst("lib2") },
                { "app1", "lib1".Lst() },
                { "app2", "lib1".Lst("lib2") },
                { "app3", "lib1".Lst("lib2", "lib3") }
            },
            "test4");
    }
}
