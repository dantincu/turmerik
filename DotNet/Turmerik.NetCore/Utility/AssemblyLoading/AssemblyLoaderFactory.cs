using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Utility;

namespace Turmerik.NetCore.Utility.AssemblyLoading
{
    public interface IAssemblyLoaderFactory
    {
        IAssemblyLoader<TData> Loader<TData>(
            AssemblyLoaderInstnOpts<TData> opts);
    }

    public class AssemblyLoaderFactory : ComponentCoreBase, IAssemblyLoaderFactory
    {
        private readonly IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever;

        public AssemblyLoaderFactory(
            IObjectMapperFactory objMapperFactory,
            IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever) : base(objMapperFactory)
        {
            this.filteredDriveEntriesRetriever = filteredDriveEntriesRetriever ?? throw new ArgumentNullException(
                nameof(filteredDriveEntriesRetriever));
        }

        public IAssemblyLoader<TData> Loader<TData>(
            AssemblyLoaderInstnOpts<TData> opts) => new AssemblyLoader<TData>(
                MapprFactry,
                filteredDriveEntriesRetriever,
                opts);
    }
}
