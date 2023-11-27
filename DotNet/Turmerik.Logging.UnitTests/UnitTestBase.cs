using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Testing;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Logging;

namespace Turmerik.Logging.UnitTests
{
    public class UnitTestBase : UnitTestCoreBase
    {
        static UnitTestBase()
        {
            ServiceProviderContainer.Instance.Value.RegisterData(
                new ServiceCollection().AsOpts());
        }

        public UnitTestBase()
        {
            AppLoggerCreatorFactory = SvcProv.GetRequiredService<IAppLoggerCreatorFactory>();
            AppLoggerCreator = AppLoggerCreatorFactory.Create();
        }

        protected IServiceProvider SvcProv { get; } = ServiceProviderContainer.Instance.Value.Data;

        protected IAppLoggerCreatorFactory AppLoggerCreatorFactory { get; }
        protected IAppLoggerCreator AppLoggerCreator { get; }
    }
}
