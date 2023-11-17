using Turmerik.Dependencies;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Notes.Dependencies;
using Turmerik.DriveExplorer;

namespace Turmerik.Notes.UnitTests
{
    public class ServiceProviderContainer : ServiceProviderContainerBase
    {
        private ServiceProviderContainer()
        {
        }

        public static Lazy<ServiceProviderContainer> Instance { get; } = new Lazy<ServiceProviderContainer>(
            () => new ServiceProviderContainer(), LazyThreadSafetyMode.ExecutionAndPublication);

        public DriveItem RootDriveItem { get; } = new DriveItem
        {
            SubFolders = new List<DriveItem>(),
            FolderFiles = new List<DriveItem>(),
        };

        protected override void RegisterServices(
            IServiceCollection services)
        {
            TrmrkServices.RegisterAll(services);
            TrmrkNoteServices.RegisterAll(services);

            services.AddSingleton<IDriveItemsRetriever>(
                svcProv => svcProv.GetRequiredService<ICachedEntriesRetrieverFactory>(
                    ).FsEntriesRetriever(RootDriveItem, Path.DirectorySeparatorChar));

            services.AddSingleton<IDriveItemsCreator, DriveItemsCreator>();
        }
    }
}
