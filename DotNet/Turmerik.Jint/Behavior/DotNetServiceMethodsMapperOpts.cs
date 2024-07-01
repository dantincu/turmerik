using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Jint.Behavior
{
    public class DotNetServiceMethodsMapperOpts
    {
        public DotNetServiceMethodsMapperOpts()
        {
        }

        public DotNetServiceMethodsMapperOpts(
            DotNetServiceMethodsMapperOpts src)
        {
            Service = src.Service;
            ServiceType = src.ServiceType;
            ServicePrefix = src.ServicePrefix;
        }

        public object Service { get; set; }
        public Type ServiceType { get; set; }
        public string ServicePrefix { get; set; }
    }
}
