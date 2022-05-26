using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Turmerik.Core.Reflection.Wrappers
{
    public class MethodBaseWrapper<TMethod> : WrapperBase<TMethod>
        where TMethod : MethodBase
    {
        public MethodBaseWrapper(TMethod data) : base(data)
        {
        }
    }

    public class MethodBaseWrapper : MethodBaseWrapper<MethodBase>
    {
        public MethodBaseWrapper(MethodBase data) : base(data)
        {
        }
    }
}
