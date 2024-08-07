﻿using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Testing;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.UnitTests
{
    public class UnitTestBase : UnitTestCoreBase
    {
        static UnitTestBase()
        {
            ServiceProviderContainer.Instance.Value.RegisterData(
                new ServiceCollection().AsOpts(services =>
                {
                    services.AddScoped<PropertyInjectorUnitTest.IService1, PropertyInjectorUnitTest.Service1>();
                    services.AddScoped<PropertyInjectorUnitTest.IService2, PropertyInjectorUnitTest.Service2>();
                    services.AddScoped<PropertyInjectorUnitTest.IService3, PropertyInjectorUnitTest.Service3>();
                    services.AddScoped<PropertyInjectorUnitTest.IService4, PropertyInjectorUnitTest.Service4>();
                }));
        }

        public UnitTestBase()
        {
            SvcProv = ServiceProviderContainer.Instance.Value.Data;
        }

        protected IServiceProvider SvcProv { get; }
    }
}
