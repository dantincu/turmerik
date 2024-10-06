using Json.Pointer;
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
        ReadOnlyCollection<Lazy<GenericTypeArg>> GenericTypeArgs { get; init; }
        bool IsGenericDefinition { get; }

        ReflectionItemBase? GetGenericDefinition();
    }

    public interface IGenericType<TGenericType> : IGenericTypeCore
        where TGenericType : ReflectionItemBase, IGenericType<TGenericType>
    {
        Lazy<TGenericType>? GenericDefinition { get; init; }
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
        public bool IsValueType { get; init; }
        public bool IsGenericParameter { get; init; }
        public bool IsGenericTypeParameter { get; init; }
        public bool IsGenericMethodParameter { get; init; }
        public bool IsConstructedGenericType { get; init; }
        public bool IsGenericTypeDefinition { get; init; }
        public bool IsInterface { get; init; }

        public Lazy<TypeItemCoreBase>? BaseType { get; init; }
        public ReadOnlyCollection<Lazy<TypeItemCoreBase>> InterfaceTypes { get; init; }

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

        public static TypeItemCoreBase[] GetDependenciesArr(
            GenericTypeArg arg) => arg.TypeArg.IfNotNull(
                typeArg => [typeArg!],
                () => arg.Param!.ParamConstraints.With(
                    constraints => constraints.BaseClass?.Value.Arr(
                        constraints.RestOfTypes.SelectEager().ToArray())))!;

        public static IEnumerable<TypeItemCoreBase> SelectDependencies(
            this IEnumerable<Lazy<GenericTypeArg>?> genericTypeArgs) => genericTypeArgs.Where(
                item => item?.Value.BelongsToDeclaringType ?? false).SelectMany(
                    item => GetDependenciesArr(item!.Value));

        public static void AddDependencies(
            List<TypeItemCoreBase> list,
            IEnumerable<Lazy<GenericTypeArg>?>? itemsToAdd) => AddDependencies(
                list, itemsToAdd?.SelectDependencies());

        public static void AddDependencies(
            List<TypeItemCoreBase> list,
            IEnumerable<Lazy<TypeItemCoreBase>?>? itemsToAdd) => AddDependencies(
                list, itemsToAdd?.SelectEager());

        public static void AddDependencies(
            List<TypeItemCoreBase> list,
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
            List<TypeItemCoreBase> list,
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
            List<TypeItemCoreBase> list,
            TGenericType genericTypeItem)
            where TGenericType : TypeItemBase, IGenericType<TGenericType>
        {
            if (!genericTypeItem.IsGenericDefinition)
            {
                genericTypeItem = genericTypeItem.GenericDefinition!.Value;
            }

            AddDependencyIfReqCore(
                genericTypeItem, list);

            AddDependencies(list,
                genericTypeItem.GenericTypeArgs);
        }

        public static void AddGenericDeps(
            List<TypeItemCoreBase> list,
            GenericMethodItem genericMethod)
        {
            if (!genericMethod.IsGenericDefinition)
            {
                genericMethod = genericMethod.GenericDefinition!.Value;
            }

            AddMethodDeps(list, genericMethod);

            AddDependencies(
                list,
                genericMethod.GenericTypeArgs);
        }

        public static void AddPropDeps(
            List<TypeItemCoreBase> list,
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
            List<TypeItemCoreBase> list,
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
            List<TypeItemCoreBase> list,
            IMethodItem method)
        {
            AddMethodDepsCore(list, method);
            method.ReturnType.Value.AddDependencies(list);
        }

        public static void AddMethodDepsCore(
            List<TypeItemCoreBase> list,
            IMethodItemCore method)
        {
            foreach (var kvp in method.Params)
            {
                kvp.Value.Value.AddDependencies(list);
            }
        }

        public static bool HasAlreadyBeenAdded(
            List<TypeItemCoreBase> list,
            TypeItemCoreBase item) => list.Any(
                refItem => refItem.AreEqual(item));

        public static bool AddDependencyIfReqCore(
            this TypeItemCoreBase item,
            List<TypeItemCoreBase> list)
        {
            bool added = item.IsDependency(
                ) && !HasAlreadyBeenAdded(list, item);

            if (added)
            {
                list.Add(item!);
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
            List<TypeItemCoreBase> depsList)
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

        public Dictionary<string, TypeItemCoreBase> TypesMap { get; init; }

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

        public virtual ReadOnlyCollection<TypeItemCoreBase> GetAllTypeDependencies(
            ) => new TypeItemCoreBase[0].RdnlC();

        public virtual ReadOnlyCollection<Lazy<GenericTypeArg>>? GetGenericTypeArgs() => null;

        public bool IsDependency() => Kind >= TypeItemKind.Regular;

        public bool IsDelegateType(
            Type type) => type.BaseType?.FullName == NetCoreReflH.MulticastDelegateType.FullName;
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
                () => new List<TypeItemCoreBase>().ActWith(
                    depsList => AddDependencies(
                        depsList)).RdnlC());

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
        public Lazy<ReadOnlyCollection<TypeItemCoreBase>> AllTypeDependencies { get; init; }

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
        public override ReadOnlyCollection<TypeItemCoreBase> GetAllTypeDependencies(
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

        public override ReadOnlyCollection<TypeItemCoreBase> GetAllTypeDependencies(
            ) => ElementType.GetAllTypeDependencies();

        public override void AddDependencies(
            List<TypeItemCoreBase> list) => ElementType.AddDependencies(list);

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

        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericTypeArgs { get; init; }

        public bool IsGenericDefinition => false;

        public ReflectionItemBase? GetGenericDefinition() => null;
        public override ReadOnlyCollection<Lazy<GenericTypeArg>>? GetGenericTypeArgs() => GenericTypeArgs;

        public override void AddDependencies(
            List<TypeItemCoreBase> list) => ReflectionItem.AddDependencies(
                list, GenericTypeArgs);
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
            List<TypeItemCoreBase> list) => this.AddDependencyIfReqCore(list);
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
            List<TypeItemCoreBase> list)
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
        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericTypeArgs { get; init; }
        public Lazy<GenericTypeItem>? GenericDefinition { get; init; }

        public ReflectionItemBase? GetGenericDefinition() => GenericDefinition?.Value;

        public override ReadOnlyCollection<Lazy<GenericTypeArg>>? GetGenericTypeArgs() => GenericTypeArgs;

        public override void AddDependencies(
            List<TypeItemCoreBase> list)
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
            List<TypeItemCoreBase> list)
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

        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericTypeArgs { get; init; }
        public Lazy<GenericDelegateTypeItem>? GenericDefinition { get; init; }

        public bool IsGenericDefinition { get; }

        public ReflectionItemBase? GetGenericDefinition() => GenericDefinition?.Value;

        public override void AddDependencies(
            List<TypeItemCoreBase> list)
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

        public override void AddDependencies(List<TypeItemCoreBase> depsList)
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
            List<TypeItemCoreBase> depsList)
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

        public override void AddDependencies(List<TypeItemCoreBase> depsList)
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

        public override void AddDependencies(List<TypeItemCoreBase> depsList)
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
        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericTypeArgs { get; init; }
        public Lazy<GenericMethodItem>? GenericDefinition { get; init; }

        public ReflectionItemBase? GetGenericDefinition() => GenericDefinition?.Value;

        public override void AddDependencies(List<TypeItemCoreBase> depsList)
        {
            ReflectionItem.AddGenericDeps(depsList, this);
        }
    }
}
