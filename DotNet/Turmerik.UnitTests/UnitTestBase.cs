using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Testing;
using Turmerik.Core.Dependencies;

namespace Turmerik.UnitTests
{
    public class UnitTestBase : UnitTestCoreBase
    {
        static UnitTestBase()
        {
            ServiceProviderContainer.Instance.Value.RegisterData(
                new ServiceCollection().AsOpts());
        }

        protected IServiceProvider SvcProv { get; } = ServiceProviderContainer.Instance.Value.Data;
    }
}
