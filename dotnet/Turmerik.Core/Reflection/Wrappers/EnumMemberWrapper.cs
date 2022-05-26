using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Turmerik.Core.Reflection.Wrappers
{
    public class EnumMemberWrapper : FieldWrapper
    {
        public EnumMemberWrapper(FieldInfo data, object value) : base(data)
        {
            Value = value;
        }

        public readonly object Value;
    }
}
