using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public interface IComponentCore
    {
        IObjectMapperFactory MapprFactry { get; }
    }

    public abstract class ComponentCoreBase : IComponentCore
    {
        protected ComponentCoreBase(
            IObjectMapperFactory objMapperFactory)
        {
            MapprFactry = objMapperFactory ?? throw new ArgumentNullException(
                nameof(objMapperFactory));
        }

        public IObjectMapperFactory MapprFactry { get; }
    }
}
