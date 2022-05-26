using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using Turmerik.Core.Collections.Cache;

namespace Turmerik.Core.Reflection.Wrappers
{
    public class InterfaceMappingsCache : StaticDataCache<Type, InterfaceMapping>
    {
        public InterfaceMappingsCache(Type implementingType) : base(
            interfaceType => implementingType.GetInterfaceMap(interfaceType))
        {
        }

        public Type ImplementingType { get; }
    }
}
