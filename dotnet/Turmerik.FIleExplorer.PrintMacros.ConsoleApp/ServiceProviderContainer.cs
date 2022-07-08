using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Infrastucture;

namespace Turmerik.FIleExplorer.PrintMacros.ConsoleApp
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
