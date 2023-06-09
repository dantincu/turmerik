﻿using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using Turmerik.Core.Collections.TypeMapped;

namespace Turmerik.Core.Reflection.Wrappers
{
    public abstract class WrapperBase<TData> : WrapperCoreBase<TData>
        where TData : MemberInfo
    {
        protected WrapperBase(TData data) : base(data)
        {
            Name = data.Name;
            DeclaringType = new Lazy<TypeWrapper>(() => new TypeWrapper(data.DeclaringType));

            AllAttrs = new Lazy<HcyTypeMappedCollection<object>>(
                () => new HcyTypeMappedCollection<object>(
                    data.GetCustomAttributes(true)));

            Attrs = new Lazy<HcyTypeMappedCollection<object>>(
                () => new HcyTypeMappedCollection<object>(
                    data.GetCustomAttributes(false)));
        }

        public readonly string Name;
        public readonly Lazy<TypeWrapper> DeclaringType;

        public readonly Lazy<HcyTypeMappedCollection<object>> AllAttrs;
        public readonly Lazy<HcyTypeMappedCollection<object>> Attrs;
    }
}
