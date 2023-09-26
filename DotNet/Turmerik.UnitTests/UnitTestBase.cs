using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Testing;

namespace Turmerik.LocalDevice.UnitTests
{
    public class UnitTestBase : UnitTestCoreBase
    {
        static UnitTestBase()
        {
            ServiceProviderContainer.Instance.Value.RegisterData(
                new ServiceCollection());
        }

        protected IServiceProvider SvcProv { get; } = ServiceProviderContainer.Instance.Value.Data;
    }
}
