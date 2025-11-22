using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Testing;
using Turmerik.Core.Dependencies;

namespace Turmerik.Code.CSharp.UnitTests
{
    public class UnitTestBase : UnitTestCoreBase
    {
        static UnitTestBase()
        {
            ServiceProviderContainer.Instance.Value.RegisterData(
                new ServiceCollection().AsOpts(services =>
                {
                }));
        }

        public UnitTestBase()
        {
            SvcProv = ServiceProviderContainer.Instance.Value.Data;
        }

        protected IServiceProvider SvcProv { get; }
    }
}
