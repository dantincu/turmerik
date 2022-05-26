using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using Turmerik.Core.Collections;
using Turmerik.Core.Collections.TypeMapped;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Reflection.Wrappers
{
    public class TypeWrapper : WrapperBase<Type>
    {
        public TypeWrapper(Type data) : base(data)
        {
            FullName = data.FullName;
            FullDisplayName = data.GetTypeFullDisplayName();

            IsGeneric = data.IsGenericType;
            GenericTypeDef = new Lazy<Type>(() => IsGeneric ? data.GetGenericTypeDefinition() : null);
            GenericTypeParams = new Lazy<IReadOnlyCollection<Type>>(() => IsGeneric ? data.GetGenericParameterConstraints().RdnlC() : null);
            GenericTypeArgs = new Lazy<IReadOnlyCollection<Type>>(() => IsGeneric ? data.GetGenericArguments().RdnlC() : null);

            Interfaces = new Lazy<IReadOnlyCollection<Type>>(() => data.GetInterfaces());
            InterfaceMappings = new Lazy<InterfaceMappingsCache>(
                () => new InterfaceMappingsCache(Data));

            AllProps = new Lazy<IReadOnlyCollection<PropertyWrapper>>(
                () => data.GetProperties(
                    BindingFlags.Instance |
                BindingFlags.Static |
                BindingFlags.Public |
                BindingFlags.NonPublic |
                BindingFlags.FlattenHierarchy).RdnlC(pi => new PropertyWrapper(pi)));

            InstGetProps = AllProps.LzRdnlC(pw => pw.Data.PropGetterIs(g => !g.IsStatic));
            InstPubGetProps = InstGetProps.LzRdnlC(pw => pw.Data.PropGetterIs(g => g.IsPublic));
            InstFamGetProps = InstGetProps.LzRdnlC(pw => pw.Data.PropGetterIs(g => g.IsFamily));

            InstPubOrFamGetProps = InstGetProps.LzRdnlC(
                pw => pw.Data.PropGetterIs(g => g.IsPublic || g.IsFamily));

            InstPubGetPubSetProps = InstPubGetProps.LzRdnlC(
                pw => pw.Data.PropSetterIs(s => s.IsPublic));

            InstPubGetFamSetProps = InstPubGetProps.LzRdnlC(
                pw => pw.Data.PropSetterIs(s => s.IsFamily));

            InstPubGetPubOrFamSetProps = InstPubGetProps.LzRdnlC(
                pw => pw.Data.PropSetterIs(s => s.IsPublic || s.IsFamily));

            AllMethods = new Lazy<IReadOnlyCollection<MethodInfoWrapper>>(
                () => data.GetMethods().RdnlC(
                    mi => new MethodInfoWrapper(mi)));

            InstMethods = AllMethods.LzRdnlC(miw => miw.Is(mi => !mi.Data.IsStatic));
            InstPubMethods = InstMethods.LzRdnlC(miw => miw.Is(mi => miw.Data.IsPublic));
            InstFamMethods = InstMethods.LzRdnlC(miw => miw.Is(mi => miw.Data.IsFamily));

            InstFamMethods = InstMethods.LzRdnlC(miw => miw.Is(mi => miw.Data.Is(
                d => d.IsPublic || d.IsFamily)));
        }

        public readonly string FullName;
        public readonly string FullDisplayName;

        public readonly bool IsGeneric;
        public readonly Lazy<Type> GenericTypeDef;
        public readonly Lazy<IReadOnlyCollection<Type>> GenericTypeParams;
        public readonly Lazy<IReadOnlyCollection<Type>> GenericTypeArgs;

        public readonly Lazy<IReadOnlyCollection<Type>> Interfaces;
        public readonly Lazy<InterfaceMappingsCache> InterfaceMappings;

        public readonly Lazy<IReadOnlyCollection<PropertyWrapper>> AllProps;
        public readonly Lazy<IReadOnlyCollection<PropertyWrapper>> InstGetProps;

        public readonly Lazy<IReadOnlyCollection<PropertyWrapper>> InstPubGetProps;
        public readonly Lazy<IReadOnlyCollection<PropertyWrapper>> InstFamGetProps;
        public readonly Lazy<IReadOnlyCollection<PropertyWrapper>> InstPubOrFamGetProps;

        public readonly Lazy<IReadOnlyCollection<PropertyWrapper>> InstPubGetPubSetProps;
        public readonly Lazy<IReadOnlyCollection<PropertyWrapper>> InstPubGetFamSetProps;
        public readonly Lazy<IReadOnlyCollection<PropertyWrapper>> InstPubGetPubOrFamSetProps;

        public readonly Lazy<IReadOnlyCollection<MethodInfoWrapper>> AllMethods;
        public readonly Lazy<IReadOnlyCollection<MethodInfoWrapper>> InstMethods;

        public readonly Lazy<IReadOnlyCollection<MethodInfoWrapper>> InstPubMethods;
        public readonly Lazy<IReadOnlyCollection<MethodInfoWrapper>> InstFamMethods;
        public readonly Lazy<IReadOnlyCollection<MethodInfoWrapper>> InstPubOrFamMethods;
    }
}
