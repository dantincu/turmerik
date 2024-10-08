﻿using Json.Pointer;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Drawing.Imaging;
using System.Linq;
using System.Management.Automation.Language;
using System.Management.Automation.Runspaces;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.NetCore.Reflection.AssemblyLoading
{
    public enum TypeItemKind
    {
        RootObject = 0,
        RootValueType,
        VoidType,
        DelegateRoot,
        EnumRoot,
        String,
        Boolean,
        Number,
        Date,
        OtherPrimitive,
        Regular,
        GenericRegular,
        Enum,
        Nullable,
        Array,
        Enumerable,
        Dictionary,
        Delegate,
        GenericDelegate,
        ByRefValue,
        PointerValue,
        GenericParam,
    }

    public interface IGenericTypeCore
    {
        ReadOnlyCollection<Lazy<GenericTypeArg>> GenericArgs { get; init; }
        bool IsGenericDefinition { get; }

        ReflectionItemBase? GetGenericDef();
    }

    public interface IGenericType<TGenericType> : IGenericTypeCore
        where TGenericType : ReflectionItemBase, IGenericType<TGenericType>
    {
        TGenericType? GenericDef { get; init; }
    }

    public interface IMethodItemCore
    {
        ReadOnlyDictionary<string, Lazy<TypeItemCoreBase>> Params { get; init; }
    }

    public interface IMethodItem : IMethodItemCore
    {
        public Lazy<TypeItemCoreBase> ReturnType { get; init; }
    }

    public class TypeData
    {
        public TypeData(
            List<PropertyItem>? pubInstnProps,
            List<MethodItem>? pubInstnMethods)
        {
            pubInstnProps.Sort(ReflectionItem.CompareProps);
            pubInstnMethods.Sort(ReflectionItem.CompareMethods);

            PubInstnProps = pubInstnProps.RdnlC();
            PubInstnMethods = pubInstnMethods.RdnlC();
        }

        public bool IsValueType { get; init; }
        public bool IsGenericParameter { get; init; }
        public bool IsGenericTypeParameter { get; init; }
        public bool IsGenericMethodParameter { get; init; }
        public bool IsConstructedGenericType { get; init; }
        public bool IsGenericTypeDefinition { get; init; }
        public bool IsInterface { get; init; }

        public Lazy<TypeItemCoreBase>? BaseType { get; init; }
        public List<Lazy<TypeItemCoreBase>> InterfaceTypes { get; init; }

        public ReadOnlyCollection<PropertyItem>? PubInstnProps { get; init; }
        public ReadOnlyCollection<MethodItem>? PubInstnMethods { get; init; }
    }

    public static class ReflectionItem
    {
        public static string? GetGenericTypeArgsStr(
            this TypeItemCoreBase typeItem) => typeItem.GetGenericTypeArgs(
                )?.Where(arg => arg.Value.BelongsToDeclaringType).GetGenericTypeArgsStr();

        public static string GetGenericTypeArgsStr(
            this IEnumerable<Lazy<GenericTypeArg>> genericTypeArgs) => string.Concat(
                "<", string.Join(", ", genericTypeArgs.Select(
                arg => arg.Value.TypeArg.IfNotNull(
                    type => type!.FullIdnfName,
                    () => arg.Value.Param!.Name))), ">");

        public static IEnumerable<string> SelectGenericTypeArgs(
            this TypeItemCoreBase typeItem) => typeItem.GetGenericTypeArgs(
                )?.Where(arg => arg.Value.BelongsToDeclaringType).SelectGenericTypeArgs();

        public static IEnumerable<string> SelectGenericTypeArgs(
            this IEnumerable<Lazy<GenericTypeArg>> genericTypeArgs) => genericTypeArgs.Select(
                arg => arg.Value.TypeArg.IfNotNull(
                    type => type!.FullIdnfName,
                    () => arg.Value.Param!.Name));

        public static TypeItemBase[] GetDependenciesArr(
            GenericTypeArg arg) => arg.TypeArg.IfNotNull(
                typeArg => (typeArg as TypeItemBase).Arr().NotNull().ToArray(),
                () => arg.Param!.ParamConstraints.With(
                    constraints => (constraints.BaseClass?.Value as TypeItemBase).Arr(
                        constraints.RestOfTypes.SelectEager().OfType<TypeItemBase>().ToArray()).NotNull().ToArray()))!;

        public static IEnumerable<TypeItemBase> SelectDependencies(
            this IEnumerable<Lazy<GenericTypeArg>?> genericTypeArgs) => genericTypeArgs.Where(
                item => item?.Value.BelongsToDeclaringType ?? false).SelectMany(
                    item => GetDependenciesArr(item!.Value));

        public static void AddDependencies(
            List<TypeItemBase> list,
            IEnumerable<Lazy<GenericTypeArg>?>? itemsToAdd) => AddDependencies(
                list, itemsToAdd?.SelectDependencies());

        public static void AddDependencies(
            List<TypeItemBase> list,
            IEnumerable<Lazy<TypeItemCoreBase>?>? itemsToAdd) => AddDependencies(
                list, itemsToAdd?.SelectEager().OfType<TypeItemBase>());

        public static void AddDependencies(
            List<TypeItemBase> list,
            IEnumerable<TypeItemCoreBase?>? itemsToAdd)
        {
            if (itemsToAdd != null)
            {
                foreach (var item in itemsToAdd)
                {
                    item?.AddDependencies(list);
                }
            }
        }

        public static void AddDependenciesIfReq(
            List<TypeItemBase> list,
            TypeData typeData)
        {
            typeData.BaseType?.Value.AddDependencies(list);

            AddDependencies(
                list,
                typeData.InterfaceTypes);

            AddPropDeps(
                list,
                typeData.PubInstnProps);

            AddMethodDeps(
                list,
                typeData.PubInstnMethods);
        }

        public static void AddGenericDeps<TGenericType>(
            List<TypeItemBase> list,
            TGenericType genericTypeItem)
            where TGenericType : TypeItemBase, IGenericType<TGenericType>
        {
            if (!genericTypeItem.IsGenericDefinition)
            {
                genericTypeItem = genericTypeItem.GenericDef!;
            }

            AddDependencyIfReqCore(
                genericTypeItem, list);

            AddDependencies(list,
                genericTypeItem.GenericArgs);
        }

        public static void AddGenericDeps(
            List<TypeItemBase> list,
            GenericMethodItem genericMethod)
        {
            if (!genericMethod.IsGenericDefinition)
            {
                genericMethod = genericMethod.GenericDef!;
            }

            AddMethodDeps(list, genericMethod);

            AddDependencies(
                list,
                genericMethod.GenericArgs);
        }

        public static void AddPropDeps(
            List<TypeItemBase> list,
            IEnumerable<PropertyItem>? propsNmrbl)
        {
            if (propsNmrbl != null)
            {
                foreach (var prop in propsNmrbl)
                {
                    prop.AddDependencies(list);
                }
            }
        }

        public static void AddMethodDeps(
            List<TypeItemBase> list,
            IEnumerable<IMethodItem>? methodsNmrbl)
        {
            if (methodsNmrbl != null)
            {
                foreach (var method in methodsNmrbl)
                {
                    AddMethodDeps(list, method);
                }
            }
        }

        public static void AddMethodDeps(
            List<TypeItemBase> list,
            IMethodItem method)
        {
            AddMethodDepsCore(list, method);
            method.ReturnType.Value.AddDependencies(list);
        }

        public static void AddMethodDepsCore(
            List<TypeItemBase> list,
            IMethodItemCore method)
        {
            foreach (var kvp in method.Params)
            {
                kvp.Value.Value.AddDependencies(list);
            }
        }

        public static bool HasAlreadyBeenAdded(
            List<TypeItemBase> list,
            TypeItemCoreBase item) => list.Any(
                refItem => refItem.AreEqual(item));

        public static bool AddDependencyIfReqCore(
            this TypeItemCoreBase item,
            List<TypeItemBase> list)
        {
            var typeItem = item as TypeItemBase;

            bool added = typeItem != null && item.IsDependency(
                ) && !HasAlreadyBeenAdded(list, item);

            if (added)
            {
                list.Add(typeItem!);
            }

            return added;
        }

        public static bool AreEqual(
            this TypeItemCoreBase trgItem,
            TypeItemCoreBase refItem)
        {
            bool areEqual = trgItem.Kind == refItem.Kind;
            areEqual = areEqual && trgItem.IdnfName == refItem.IdnfName;

            if (areEqual)
            {
                var trgAsmb = trgItem.GetAssemblyItem();
                var refAsmb = refItem.GetAssemblyItem();

                areEqual = (trgAsmb == null) == (refAsmb == null);

                if (areEqual && trgAsmb != null && refAsmb != null)
                {
                    areEqual = trgAsmb.Equals(refAsmb);
                }
            }

            return areEqual;
        }

        public static bool TrySetCustomData(
            this TypeItemCoreBase type,
            AssemblyLoaderOpts opts)
        {
            bool customDataHasBeenSet = false;

            if (opts.TypeCustomDataFactory != null && type is TypeItemBase typeItem)
            {
                typeItem.CustomData ??= opts.TypeCustomDataFactory(new()
                {
                    TypeItem = typeItem,
                    TypeName = typeItem.Name,
                    TypeIdnfName = typeItem.IdnfName,
                    TypeFullIdnfName = typeItem.FullIdnfName
                });

                customDataHasBeenSet = true;
            }

            return customDataHasBeenSet;
        }

        public static int CompareMethods(
            MethodItem m1,
            MethodItem m2)
        {
            int result = m1.Name.CompareTo(m2.Name);

            if (result == 0)
            {
                result = CompareTypes(
                    m1.ReturnType.Value,
                    m2.ReturnType.Value);
            }

            if (result == 0)
            {
                result = CompareMethodParams(
                    m1.Params, m2.Params);
            }

            return result;
        }

        public static int CompareProps(
            PropertyItem p1,
            PropertyItem p2)
        {
            int result = p1.Name.CompareTo(p2.Name);

            if (result == 0)
            {
                result = CompareTypes(
                    p1.PropertyType.Value,
                    p2.PropertyType.Value);
            }

            return result;
        }

        public static int CompareMethodParams(
            IEnumerable<KeyValuePair<string, TypeItemCoreBase>> nmrbl1,
            IEnumerable<KeyValuePair<string, TypeItemCoreBase>> nmrbl2) => CompareMethodParamsCollctn(
                nmrbl1, nmrbl2, value => value);

        public static int CompareMethodParams(
            IEnumerable<KeyValuePair<string, Lazy<TypeItemCoreBase>>> nmrbl1,
            IEnumerable<KeyValuePair<string, Lazy<TypeItemCoreBase>>> nmrbl2) => CompareMethodParamsCollctn(
                nmrbl1, nmrbl2, lazy => lazy.Value);

        public static int CompareMethodParamsCollctn<TParam>(
            IEnumerable<KeyValuePair<string, TParam>> nmrbl1,
            IEnumerable<KeyValuePair<string, TParam>> nmrbl2,
            Func<TParam, TypeItemCoreBase> paramFactory) => nmrbl1.CompareNmrbls(
                nmrbl2, (kvp1, kvp2) => CompareMethodParams(
                    kvp1, kvp2,
                    paramFactory), out _);

        public static int CompareMethodParams(
            KeyValuePair<string, TypeItemCoreBase> kvp1,
            KeyValuePair<string, TypeItemCoreBase> kvp2) => CompareMethodParams(
                kvp1, kvp2, value => value);

        public static int CompareMethodParams(
            KeyValuePair<string, Lazy<TypeItemCoreBase>> kvp1,
            KeyValuePair<string, Lazy<TypeItemCoreBase>> kvp2) => CompareMethodParams(
                kvp1, kvp2, lazy => lazy.Value);

        public static int CompareMethodParams<TParam>(
            KeyValuePair<string, TParam> kvp1,
            KeyValuePair<string, TParam> kvp2,
            Func<TParam, TypeItemCoreBase> paramFactory)
        {
            int result = kvp1.Key.CompareTo(kvp2.Key);

            if (result == 0)
            {
                result = CompareTypes(
                    paramFactory(kvp1.Value),
                    paramFactory(kvp2.Value));
            }

            return result;
        }

        public static int CompareTypes(
            TypeItemCoreBase t1,
            TypeItemCoreBase t2) => t1.FullIdnfName?.CompareTo(
                t2.FullIdnfName) ?? (t2.FullIdnfName is null) switch
                {
                    true => 0,
                    false => -1
                };
    }

    public abstract class ReflectionItemBase
    {
        protected ReflectionItemBase(
            string name)
        {
            Name = name;
        }

        public string Name { get; }

        public virtual void AddDependencies(
            List<TypeItemBase> depsList)
        {
        }
    }

    public abstract class ReflectionItemBase<TBclItem> : ReflectionItemBase
    {
        public ReflectionItemBase(
            TBclItem bclItem,
            string name) : base(
                name)
        {
            BclItem = bclItem;
        }

        public TBclItem BclItem { get; }
    }

    public class AssemblyItem : ReflectionItemBase<Assembly>, IEquatable<AssemblyItem>
    {
        public AssemblyItem(
            Assembly bclItem,
            string name) : base(
                bclItem,
                name)
        {
        }

        public string DefaultNamespace { get; init; }
        public string TypeNamesPfx { get; init; }
        public string AssemblyFilePath { get; init; }
        public bool IsExecutable { get; init; }
        public bool IsCoreLib { get; init; }
        public bool IsNetStandardLib { get; init; }
        public bool IsSysLib { get; init; }

        public Dictionary<string, TypeItemBase> TypesMap { get; init; }

        public bool Equals(AssemblyItem? other) => other?.Name == Name;
    }

    public abstract class TypeItemCoreBase : ReflectionItemBase<Type>, IEquatable<TypeItemCoreBase>
    {
        protected TypeItemCoreBase(
            Type bclItem) : base(
                bclItem,
                ReflH.GetTypeDisplayName(
                    bclItem.Name))
        {
        }

        public abstract TypeItemKind Kind { get; }
        public abstract string IdnfName { get; }
        public abstract string FullIdnfName { get; }

        public virtual bool Equals(
            TypeItemCoreBase? other) => other?.With(
                otherType => otherType.Kind == Kind && otherType.FullIdnfName == FullIdnfName) ?? false;

        public virtual TypeItemCoreBase? GetDeclaringType() => null;

        public virtual AssemblyItem? GetAssemblyItem() => null;

        public virtual ReadOnlyCollection<TypeItemBase> GetAllTypeDependencies(
            ) => new TypeItemBase[0].RdnlC();

        public virtual ReadOnlyCollection<Lazy<GenericTypeArg>>? GetGenericTypeArgs() => null;

        public bool IsDependency() => Kind >= TypeItemKind.Regular;
    }

    public abstract class TypeItemBase : TypeItemCoreBase
    {
        private readonly Lazy<string> idnfName;
        private readonly Lazy<string> fullIdnfName;

        protected TypeItemBase(
            Type bclItem,
            AssemblyItem assemblyItem) : base(bclItem)
        {
            idnfName = GetIdnfNameLazy(
                () => GetGenericTypeArgs()?.Count,
                declaringType => declaringType.IdnfName,
                ".");

            fullIdnfName = GetIdnfNameLazy(
                () => GetGenericTypeArgs()?.GetGenericTypeArgsStr(),
                declaringType => declaringType.FullIdnfName,
                "+");

            AllTypeDependencies = new(
                () => new List<TypeItemBase>().ActWith(
                    depsList =>
                    {
                        AddDependencies(
                            depsList);

                        depsList.Sort((dep1, dep2) => ReflectionItem.CompareTypes(
                            dep1, dep2));
                    }).RdnlC());

            this.AssemblyItem = assemblyItem ?? throw new ArgumentNullException(
                nameof(assemblyItem));

            TypeInfo = new(BclItem.GetTypeInfo);

            NsStartsWithAsmbPfx = new(() => IdnfName.StartsWith(
                AssemblyItem.TypeNamesPfx));
        }

        public override string IdnfName => idnfName.Value;
        public override string FullIdnfName => fullIdnfName.Value;

        public AssemblyItem AssemblyItem { get; }
        public Lazy<TypeInfo> TypeInfo { get; }
        public Lazy<bool> NsStartsWithAsmbPfx { get; }

        public Lazy<TypeItemCoreBase>? DeclaringType { get; init; }
        public Lazy<ReadOnlyCollection<TypeItemBase>> AllTypeDependencies { get; }

        public object? CustomData { get; set; }

        public override bool Equals(
            TypeItemCoreBase? other)
        {
            bool retVal = base.Equals(other);

            if (retVal && other is TypeItemBase otherType)
            {
                retVal = otherType.AssemblyItem.Equals(
                    AssemblyItem);
            }

            return retVal;
        }

        public override TypeItemCoreBase? GetDeclaringType() => DeclaringType?.Value;
        public override AssemblyItem? GetAssemblyItem() => AssemblyItem;
        public override ReadOnlyCollection<TypeItemBase> GetAllTypeDependencies(
            ) => AllTypeDependencies.Value;

        private Lazy<string> GetIdnfNameLazy(
            Func<object?> shortNameSffxFactory,
            Func<TypeItemCoreBase, string> declaringTypeIdnfFactory,
            string joinStr) => new Lazy<string>(
            () =>
            {
                string retStr;
                var shortName = Name + shortNameSffxFactory();

                var declaringTypeStr = DeclaringType?.Value?.With(
                    declaringTypeIdnfFactory);

                if (declaringTypeStr != null)
                {
                    retStr = string.Join(joinStr, declaringTypeStr, shortName);
                }
                else
                {
                    var @namespace = BclItem.Namespace ?? throw new InvalidOperationException(
                        $"Type {BclItem} should have a namespace");

                    retStr = string.Join(".", @namespace, shortName);
                }

                return retStr;
            });
    }

    public class CommonTypeItem : TypeItemCoreBase
    {
        public CommonTypeItem(
            Type bclItem,
            TypeItemKind kind) : base(
                bclItem)
        {
            this.Kind = kind;

            IdnfName = bclItem.FullName ?? throw new ArgumentException(
                nameof(bclItem));
        }

        public override TypeItemKind Kind { get; }
        public override string IdnfName { get; }
        public override string FullIdnfName => IdnfName;
    }

    public class ElementTypeItem : TypeItemCoreBase
    {
        public ElementTypeItem(
            Type bclItem,
            TypeItemKind kind,
            TypeItemCoreBase elementType) : base(
                bclItem)
        {
            this.Kind = kind;

            this.ElementType = elementType;

            IdnfName = GetIdnfName(
                elementType);
        }

        public TypeItemCoreBase ElementType { get; }
        public override TypeItemKind Kind { get; }
        public override string IdnfName { get; }
        public override string FullIdnfName => IdnfName;

        public override ReadOnlyCollection<TypeItemBase> GetAllTypeDependencies(
            ) => ElementType.GetAllTypeDependencies();

        public override void AddDependencies(
            List<TypeItemBase> list) => ElementType.AddDependencies(list);

        protected virtual string GetIdnfName(
            TypeItemCoreBase elementType) => elementType.IdnfName;
    }

    public class ArrayTypeItem : ElementTypeItem
    {
        public ArrayTypeItem(
            Type bclItem,
            TypeItemCoreBase elementType) : base(
                bclItem,
                TypeItemKind.Array,
                elementType)
        {
        }

        protected override string GetIdnfName(
            TypeItemCoreBase elementType) => elementType.IdnfName + "[]";
    }

    public class GenericInteropTypeItem : TypeItemBase, IGenericTypeCore
    {
        public GenericInteropTypeItem(
            Type bclItem,
            AssemblyItem assemblyItem,
            TypeItemKind kind) : base(
                bclItem,
                assemblyItem)
        {
            this.Kind = kind;
        }

        public override TypeItemKind Kind { get; }

        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericArgs { get; init; }

        public bool IsGenericDefinition => false;

        public ReflectionItemBase? GetGenericDef() => null;
        public override ReadOnlyCollection<Lazy<GenericTypeArg>>? GetGenericTypeArgs() => GenericArgs;

        public override void AddDependencies(
            List<TypeItemBase> list) => ReflectionItem.AddDependencies(
                list, GenericArgs);
    }

    public class EnumTypeItem : TypeItemBase
    {
        public EnumTypeItem(
            Type bclItem,
            AssemblyItem assemblyItem) : base(
                bclItem,
                assemblyItem)
        {
        }

        public ReadOnlyDictionary<string, object> DefinedValuesMap { get; init; }

        public override TypeItemKind Kind => TypeItemKind.Enum;

        public override void AddDependencies(
            List<TypeItemBase> list) => this.AddDependencyIfReqCore(list);
    }

    public abstract class RegularTypeItemBase : TypeItemBase
    {
        public RegularTypeItemBase(
            Type bclItem,
            AssemblyItem assemblyItem) : base(
                bclItem,
                assemblyItem)
        {
        }

        public Lazy<TypeData> TypeData { get; init; }

        public override void AddDependencies(
            List<TypeItemBase> list)
        {
            this.AddDependencyIfReqCore(list);

            ReflectionItem.AddDependenciesIfReq(
                list, TypeData.Value);
        }
    }

    public class RegularTypeItem : RegularTypeItemBase
    {
        public RegularTypeItem(
            Type bclItem,
            AssemblyItem assemblyItem) : base(
                bclItem,
                assemblyItem)
        {
        }

        public override TypeItemKind Kind => TypeItemKind.Regular;
    }

    public class GenericTypeItem : RegularTypeItemBase, IGenericType<GenericTypeItem>
    {
        public GenericTypeItem(
            Type bclItem,
            AssemblyItem assemblyItem) : base(
                bclItem,
                assemblyItem)
        {
            IsGenericDefinition = bclItem.IsGenericTypeDefinition;
        }

        public override TypeItemKind Kind => TypeItemKind.GenericRegular;
        public bool IsGenericDefinition { get; }
        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericArgs { get; init; }
        public GenericTypeItem? GenericDef { get; init; }

        public ReflectionItemBase? GetGenericDef() => GenericDef;

        public override ReadOnlyCollection<Lazy<GenericTypeArg>>? GetGenericTypeArgs() => GenericArgs;

        public override void AddDependencies(
            List<TypeItemBase> list)
        {
            base.AddDependencies(list);
            ReflectionItem.AddGenericDeps(list, this);
        }
    }

    public class DelegateTypeItem : TypeItemBase, IMethodItem
    {
        public DelegateTypeItem(
            Type bclItem,
            AssemblyItem assemblyItem) : base(
                bclItem,
                assemblyItem)
        {
        }

        public ReadOnlyDictionary<string, Lazy<TypeItemCoreBase>> Params { get; init; }
        public Lazy<TypeItemCoreBase> ReturnType { get; init; }
        public bool IsVoidDelegate { get; init; }

        public override TypeItemKind Kind => TypeItemKind.Delegate;

        public override void AddDependencies(
            List<TypeItemBase> list)
        {
            this.AddDependencyIfReqCore(list);
            ReflectionItem.AddMethodDeps(list, [this]);
        }
    }

    public class GenericDelegateTypeItem : DelegateTypeItem, IGenericType<GenericDelegateTypeItem>
    {
        public GenericDelegateTypeItem(
            Type bclItem,
            AssemblyItem assemblyItem) : base(
                bclItem,
                assemblyItem)
        {
            IsGenericDefinition = bclItem.IsGenericTypeDefinition;
        }

        public override TypeItemKind Kind => TypeItemKind.GenericDelegate;

        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericArgs { get; init; }
        public GenericDelegateTypeItem? GenericDef { get; init; }

        public bool IsGenericDefinition { get; }

        public ReflectionItemBase? GetGenericDef() => GenericDef;

        public override void AddDependencies(
            List<TypeItemBase> list)
        {
            ReflectionItem.AddGenericDeps(list, this);
            ReflectionItem.AddMethodDeps(list, [this]);
        }
    }

    public class GenericTypeArg
    {
        public GenericTypeParameter? Param { get; init; }
        public TypeItemCoreBase? TypeArg { get; init; }
        public TypeItemCoreBase DeclaringType { get; init; }
        public bool BelongsToDeclaringType { get; init; }

        public string ShortName => TypeArg?.Name ?? Param!.Name;
        public string IdnfName => TypeArg?.IdnfName ?? Param!.Name;

        public string FullIdnfName => TypeArg.IfNotNull(
            typeArg => typeArg!.FullIdnfName,
            () => Param!.Name);
    }

    public class GenericTypeParameter : TypeItemCoreBase
    {
        public GenericTypeParameter(Type bclItem) : base(bclItem)
        {
        }

        public int? GenericParamPosition { get; init; }
        public GenericTypeParamConstraints ParamConstraints { get; init; }

        public override string IdnfName => Name;
        public override string FullIdnfName => Name;

        public override TypeItemKind Kind => TypeItemKind.GenericParam;

        public override void AddDependencies(List<TypeItemBase> depsList)
        {
            ReflectionItem.AddDependencies(
                depsList,
                [ParamConstraints.BaseClass]);

            ReflectionItem.AddDependencies(
                depsList,
                ParamConstraints.RestOfTypes);
        }
    }

    public class GenericTypeParamConstraints
    {
        public GenericParameterAttributes GenericParameterAttributes { get; init; }
        public bool IsStruct { get; init; }
        public bool IsClass { get; init; }
        public bool HasDefaultConstructor { get; init; }
        public bool IsNotNullableValueType { get; init; }
        public Lazy<TypeItemCoreBase>? BaseClass { get; init; }
        public ReadOnlyCollection<Lazy<TypeItemCoreBase>> RestOfTypes { get; init; }
    }

    public class PropertyItem : ReflectionItemBase<PropertyInfo>
    {
        public PropertyItem(
            PropertyInfo bclItem,
            string idnfName) : base(
                bclItem,
                idnfName)
        {
        }

        public bool CanRead { get; init; }
        public bool CanWrite { get; init; }
        public bool IsStatic { get; init; }

        public Lazy<TypeItemCoreBase> PropertyType { get; init; }

        public override void AddDependencies(
            List<TypeItemBase> depsList)
        {
            PropertyType.Value.AddDependencies(depsList);
        }
    }

    public abstract class MethodItemBase<TMethod> : ReflectionItemBase<TMethod>, IMethodItemCore
        where TMethod : MethodBase
    {
        public MethodItemBase(
            TMethod bclItem,
            string idnfName) : base(
                bclItem,
                idnfName)
        {
        }

        public bool IsStatic { get; init; }
        public abstract bool IsConstructor { get; }

        public ReadOnlyDictionary<string, Lazy<TypeItemCoreBase>> Params { get; init; }
    }

    public class ConstructorItem : MethodItemBase<ConstructorInfo>
    {
        public ConstructorItem(
            ConstructorInfo bclItem,
            string idnfName) : base(
                bclItem,
                idnfName)
        {
        }

        public override bool IsConstructor => true;

        public override void AddDependencies(List<TypeItemBase> depsList)
        {
            ReflectionItem.AddMethodDepsCore(depsList, this);
        }
    }

    public class MethodItem : MethodItemBase<MethodInfo>, IMethodItem
    {
        public MethodItem(
            MethodInfo bclItem,
            string idnfName) : base(
                bclItem,
                idnfName)
        {
        }

        public override bool IsConstructor => false;

        public bool IsVoidMethod { get; init; }
        public Lazy<TypeItemCoreBase> ReturnType { get; init; }

        public override void AddDependencies(List<TypeItemBase> depsList)
        {
            ReflectionItem.AddMethodDeps(depsList, this);
        }
    }

    public class GenericMethodItem : MethodItem, IGenericType<GenericMethodItem>
    {
        public GenericMethodItem(
            MethodInfo bclItem,
            string idnfName) : base(
                bclItem,
                idnfName)
        {
            IsGenericDefinition = bclItem.IsGenericMethodDefinition;
        }

        public bool IsGenericDefinition { get; }
        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericArgs { get; init; }
        public GenericMethodItem? GenericDef { get; init; }

        public ReflectionItemBase? GetGenericDef() => GenericDef;

        public override void AddDependencies(List<TypeItemBase> depsList)
        {
            ReflectionItem.AddGenericDeps(depsList, this);
        }
    }
}
