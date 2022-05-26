using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Infrastucture;

namespace Turmerik.Testing.Core.Tests
{
    public class ServiceProviderContainer : SimpleServiceProviderContainer
    {
        public static readonly Lazy<ServiceProviderContainer> Instance = new Lazy<ServiceProviderContainer>(
            () => new ServiceProviderContainer(), LazyThreadSafetyMode.ExecutionAndPublication);

        protected ServiceProviderContainer()
        {
        }
    }
}
