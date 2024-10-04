using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

namespace Turmerik.NetCore.Reflection.AssemblyLoading
{
    public class AssemblyLoader : AssemblyLoaderBase
    {
        public AssemblyLoader(
            IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever) : base(
                filteredDriveEntriesRetriever)
        {
        }

        protected override TypeItemCoreBase LoadType(WorkArgs wka, Type type)
        {
            throw new NotImplementedException();
        }

        protected override TypeItemCoreBase LoadType(WorkArgs wka, AssemblyLoaderOpts.AssemblyOpts asmbOpts, AssemblyLoaderOpts.TypeOpts typeOpts)
        {
            throw new NotImplementedException();
        }
    }
}
