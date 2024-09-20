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
            TypeItemCoreBase type,
            TypeItemCoreBase? genericTypeDef)
        {
            Type = type ?? throw new ArgumentNullException(nameof(type));
            GenericTypeDef = genericTypeDef;
        }

        public TypeItemCoreBase Type { get; init; }
        public TypeItemCoreBase? GenericTypeDef { get; init; }
    }
}
