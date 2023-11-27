using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Dependencies
{
    public class ServiceProviderOpts
    {
        public IServiceCollection Services { get; set; }
        public Action<IServiceCollection> ServicesCallback { get; set; }
    }
}
