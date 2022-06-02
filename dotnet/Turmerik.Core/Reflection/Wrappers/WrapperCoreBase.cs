using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Reflection.Wrappers
{
    public abstract class WrapperCoreBase<TData>
        where TData : class
    {
        public readonly TData Data;

        protected WrapperCoreBase(TData data)
        {
            Data = data ?? throw new ArgumentNullException(nameof(data));
        }
    }
}
