using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.Reflection.AssemblyLoading
{
    public class TypeItemsTuple
    {
        public TypeItemsTuple(
            TypeItemCore type,
            TypeItemCore? genericTypeDef)
        {
            Type = type ?? throw new ArgumentNullException(nameof(type));
            GenericTypeDef = genericTypeDef;
        }

        public TypeItemCore Type { get; init; }
        public TypeItemCore? GenericTypeDef { get; init; }
    }
}
