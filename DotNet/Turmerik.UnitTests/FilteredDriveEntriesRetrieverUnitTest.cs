using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Utility;

namespace Turmerik.UnitTests
{
    public class FilteredDriveEntriesRetrieverUnitTest : FilteredDriveEntriesRetrieverUnitTestBase
    {
        [Fact]
        public async Task MainTest()
        {

        }

        private Task PerformTestAsync(
            DriveItem inputRootFolder,
            DriveEntriesSerializableFilter driveEntriesFilter,
            DriveItem expectedRootFolder) => PerformTestAsyncCore(
                inputRootFolder, driveEntriesFilter, expectedRootFolder,
                (tempDir, filteredResult) => expectedRootFolder);
    }
}
