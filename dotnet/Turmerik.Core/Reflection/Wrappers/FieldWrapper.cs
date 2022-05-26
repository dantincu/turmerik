using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Turmerik.Core.Reflection.Wrappers
{
    public class FieldWrapper : WrapperBase<FieldInfo>
    {
        public FieldWrapper(FieldInfo data) : base(data)
        {
        }
    }
}
