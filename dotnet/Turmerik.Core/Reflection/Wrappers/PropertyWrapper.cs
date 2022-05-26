using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Turmerik.Core.Reflection.Wrappers
{
    public class PropertyWrapper : WrapperBase<PropertyInfo>
    {
        public PropertyWrapper(PropertyInfo data) : base(data)
        {
            PropType = new Lazy<TypeWrapper>(() => new TypeWrapper(data.PropertyType));
            Getter = new Lazy<MethodInfoWrapper>(
                () => data.CanRead ? new MethodInfoWrapper(data.GetMethod) : null);
            Setter = new Lazy<MethodInfoWrapper>(
                () => data.CanWrite ? new MethodInfoWrapper(data.SetMethod) : null);
        }

        public Lazy<TypeWrapper> PropType;
        public Lazy<MethodInfoWrapper> Getter;
        public Lazy<MethodInfoWrapper> Setter;
    }
}
