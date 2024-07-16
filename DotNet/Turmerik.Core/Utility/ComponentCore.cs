using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public interface IComponentCore
    {
        IObjectMapperFactory ObjMapperFactory { get; }
    }

    public abstract class ComponentCoreBase : IComponentCore
    {
        protected ComponentCoreBase(
            IObjectMapperFactory objMapperFactory)
        {
            ObjMapperFactory = objMapperFactory ?? throw new ArgumentNullException(
                nameof(objMapperFactory));
        }

        public IObjectMapperFactory ObjMapperFactory { get; }
    }
}
