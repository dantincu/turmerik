﻿using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Dependencies;
using Turmerik.Jint.Behavior;
using Turmerik.Jint.Dependencies;
using Turmerik.NetCore.Dependencies;

namespace Turmerik.UnitTests
{
    public class ServiceProviderContainer : ServiceProviderContainerBase
    {
        private ServiceProviderContainer()
        {
        }

        public static Lazy<ServiceProviderContainer> Instance { get; } = new Lazy<ServiceProviderContainer>(
            () => new ServiceProviderContainer(), LazyThreadSafetyMode.ExecutionAndPublication);

        protected override void RegisterServices(
            IServiceCollection services)
        {
            TrmrkCoreServices.RegisterAll(services);
            TrmrkNetCoreServices.RegisterAll(services);
            TrmrkServices.RegisterAll(services);

            services.AddSingleton<IAppEnv, AppEnv>();
            TrmrkNetCoreServices.AddFilesClonerServices(services);
            TrmrkNetCoreServices.AddSyncLocalFilesServices(services);

            DriveExplorerH.AddFsRetrieverAndExplorer(
                services, null, true);

            TrmrkJintServices.RegisterAll(services);

            services.AddSingleton(svcProv => svcProv.GetRequiredService<IAppBehaviorFactory>(
                ).DynamicBehavior<JintDynamicTestBehavior, JintDynamicTestBehaviorMembersImmtbl, JintDynamicTestBehaviorMembersMtbl>());
        }
    }
}
