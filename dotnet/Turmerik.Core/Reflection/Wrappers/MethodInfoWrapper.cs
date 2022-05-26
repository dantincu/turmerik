using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Turmerik.Core.Reflection.Wrappers
{
    public class MethodInfoWrapper : MethodBaseWrapper<MethodInfo>
    {
        public MethodInfoWrapper(MethodInfo data) : base(data)
        {
        }
    }
}
