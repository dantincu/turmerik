using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;

namespace Turmerik.UnitTests
{
    public class FilteredDriveEntriesRetrieverUnitTest : UnitTestBase
    {
        private readonly IFilteredDriveEntriesRetriever component;

        public FilteredDriveEntriesRetrieverUnitTest()
        {
            component = SvcProv.GetRequiredService<IFilteredDriveEntriesRetriever>();
        }
    }
}
