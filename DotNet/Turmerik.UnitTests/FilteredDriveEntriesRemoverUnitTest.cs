using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;

namespace Turmerik.UnitTests
{
    public class FilteredDriveEntriesRemoverUnitTest : UnitTestBase
    {
        private readonly IFilteredDriveEntriesRemover component;

        public FilteredDriveEntriesRemoverUnitTest()
        {
            component = SvcProv.GetRequiredService<IFilteredDriveEntriesRemover>();
        }
    }
}
