﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Drawing.Imaging;
using System.Linq;
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
        Regular,
        GenericRegular,
        String,
        Boolean,
        Number,
        Date,
        OtherPrimitive,
        Enum,
        Nullable,
        Array,
        Enumerable,
        Dictionary,
        Delegate,
        GenericDelegate,
        GenericParam,
        ByRefValue,
        PointerValue
    }

    public static class ReflectionItem
    {
        public static string GetGenericTypeArgsStr(
            this ReadOnlyCollection<Lazy<GenericTypeArg>> genericTypeArgs) => string.Concat(
                "<", string.Join(", ", genericTypeArgs.Select(
                arg => arg.Value.TypeArg.IfNotNull(
                    type => type.FullIdnfName,
                    () => arg.Value.Param.Name))), ">");

        public static void AddDependencies(
            this List<Lazy<TypeItemCoreBase?>> list,
            IEnumerable<Lazy<TypeItemCoreBase>?>? itemsToAdd)
        {
            if (itemsToAdd != null)
            {
                foreach (var lazy in itemsToAdd)
                {
                    if (lazy?.Value.IsDependency() ?? false)
                    {
                        list.Add(lazy);
                    }
                }
            }
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

    public class TypeIdnf : ReflectionItemBase<Type>, IEquatable<TypeIdnf>
    {
        public TypeIdnf(
            Type bclItem,
            AssemblyItem assemblyItem,
            string name,
            string shortName,
            string idnfName,
            string fullIdnfName) : base(
                bclItem,
                name)
        {
            AssemblyItem = assemblyItem ?? throw new ArgumentNullException(
                nameof(assemblyItem));

            ShortName = shortName ?? throw new ArgumentNullException(
                nameof(shortName));

            IdnfName = idnfName ?? throw new ArgumentNullException(
                nameof(idnfName));

            FullIdnfName = fullIdnfName ?? throw new ArgumentNullException(
                nameof(fullIdnfName));

            TypeInfo = new Lazy<TypeInfo>(
                BclItem.GetTypeInfo);
        }

        public AssemblyItem AssemblyItem { get; }
        public string ShortName { get; }
        public string IdnfName { get; }
        public string FullIdnfName { get; }
        public Lazy<TypeInfo> TypeInfo { get; }
        public string? Namespace { get; init; }
        public bool NsStartsWithAsmbPfx { get; init; }
        public ReadOnlyCollection<string> RelNsParts { get; init; }

        public bool Equals(TypeIdnf? other) => other?.With(
            otherItem => Name == otherItem.Name && Namespace == otherItem.Namespace && AssemblyItem.Equals(
                otherItem.AssemblyItem) && NsStartsWithAsmbPfx == otherItem.NsStartsWithAsmbPfx && RelNsParts.NmrblsAreEqual(
                    otherItem.RelNsParts)) ?? false;
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
        public Lazy<TypeItemCoreBase>? GenericTypeDefinition { get; init; }

        public ReadOnlyCollection<PropertyItem>? PubInstnProps { get; init; }
        public ReadOnlyCollection<MethodItem>? PubInstnMethods { get; init; }

        public Lazy<ReadOnlyCollection<Lazy<TypeItemCoreBase>>> AllTypeDependencies { get; init; }
    }

    public abstract class TypeItemCoreBase : IEquatable<TypeItemCoreBase>
    {
        public abstract TypeItemKind Kind { get; }
        public abstract string ShortName { get; }
        public abstract string IdnfName { get; }
        public abstract string FullIdnfName { get; }

        public bool Equals(TypeItemCoreBase? other) => other?.FullIdnfName == FullIdnfName;

        public virtual Lazy<TypeItemCoreBase>? GetDeclaringType() => null;
        public virtual Lazy<TypeIdnf>? GetIdnf() => null;
        public virtual Lazy<TypeData>? GetData() => null;
        public virtual Lazy<ReadOnlyCollection<Lazy<TypeItemCoreBase>>> GetAllTypeDependencies(
            ) => new(() => new Lazy<TypeItemCoreBase>[0].RdnlC());

        public bool IsDependency() => Kind == TypeItemKind.Regular;

        public bool IsDelegateType(
            Type type) => type.BaseType?.FullName == NetCoreReflH.MulticastDelegateType.FullName;
    }

    public abstract class TypeItemCore : TypeItemCoreBase
    {
        private readonly Lazy<string> shortName;
        private readonly Lazy<string> idnfName;
        private readonly Lazy<string> fullIdnfName;

        protected TypeItemCore()
        {
            shortName = new Lazy<string>(
                () => GetShortName());

            idnfName = new Lazy<string>(
                () => GetIdnfName());

            fullIdnfName = new Lazy<string>(
                () => GetFullIdnfName());

            AllTypeDependencies = new(
                () => new List<Lazy<TypeItemCoreBase>>().ActWith(
                    AddAllTypeDependencies).RdnlC());
        }

        public override string ShortName => shortName.Value;
        public override string IdnfName => idnfName.Value;
        public override string FullIdnfName => fullIdnfName.Value;

        public Lazy<TypeItemCoreBase>? DeclaringType { get; init; }
        public Lazy<ReadOnlyCollection<Lazy<TypeItemCoreBase>>> AllTypeDependencies { get; init; }

        public override Lazy<TypeItemCoreBase>? GetDeclaringType() => DeclaringType;
        public override Lazy<ReadOnlyCollection<Lazy<TypeItemCoreBase>>> GetAllTypeDependencies(
            ) => AllTypeDependencies;

        protected abstract string GetShortName();
        protected abstract string GetIdnfName();
        protected abstract string GetFullIdnfName();

        protected abstract void AddAllTypeDependencies(
            List<Lazy<TypeItemCoreBase>> depsList);
    }

    public class CommonTypeItem : TypeItemCoreBase
    {
        public CommonTypeItem(
            TypeItemKind kind,
            string shortName,
            string idnfName)
        {
            this.Kind = kind;

            ShortName = shortName ?? throw new ArgumentNullException(
                nameof(shortName));

            IdnfName = idnfName ?? throw new ArgumentNullException(
                nameof(idnfName));
        }

        public override TypeItemKind Kind { get; }
        public override string ShortName { get; }
        public override string IdnfName { get; }
        public override string FullIdnfName => IdnfName;
    }

    public class ElementTypeItem : CommonTypeItem
    {
        public ElementTypeItem(
            TypeItemKind kind,
            string shortName,
            string idnfName) : base(
                kind,
                shortName,
                idnfName)
        {
        }

        public TypeItemCoreBase ElementType { get; init; }

        public override Lazy<ReadOnlyCollection<Lazy<TypeItemCoreBase>>> GetAllTypeDependencies(
            ) => ElementType.GetAllTypeDependencies();
    }

    public class GenericInteropTypeItem : TypeItemCore
    {
        public GenericInteropTypeItem(
            TypeItemKind kind,
            string shortNameCore,
            string idnfNameCore)
        {
            this.Kind = kind;

            ShortNameCore = shortNameCore ?? throw new ArgumentNullException(
                nameof(shortNameCore));

            IdnfNameCore = idnfNameCore ?? throw new ArgumentNullException(
                nameof(idnfNameCore));
        }

        public override TypeItemKind Kind { get; }
        protected string ShortNameCore { get; }
        protected string IdnfNameCore { get; }

        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericTypeArgs { get; init; }

        protected override void AddAllTypeDependencies(
            List<Lazy<TypeItemCoreBase>> depsList)
        {
            depsList.AddDependencies([DeclaringType]);

            depsList.AddRange(
                GenericTypeArgs.Select(
                    arg => arg.Value.TypeArg.IfNotNull(
                        typeArg => typeArg,
                        () => arg.Value.Param)).Select(
                    type => new Lazy<TypeItemCoreBase>(type)));
        }

        protected override string GetFullIdnfName(
            ) => string.Concat(IdnfNameCore,
            GenericTypeArgs.GetGenericTypeArgsStr());

        protected override string GetIdnfName(
            ) => string.Concat(
                IdnfNameCore, "`",
                GenericTypeArgs.Count);

        protected override string GetShortName(
            ) => ShortNameCore;
    }

    public class EnumTypeItem : TypeItemCore
    {
        public EnumTypeItem(
            string shortNameCore,
            string idnfNameCore)
        {
            ShortNameCore = shortNameCore ?? throw new ArgumentNullException(
                nameof(shortNameCore));

            IdnfNameCore = idnfNameCore ?? throw new ArgumentNullException(
                nameof(idnfNameCore));
        }

        protected string ShortNameCore { get; }
        protected string IdnfNameCore { get; }

        public ReadOnlyDictionary<string, object> DefinedValuesMap { get; init; }

        public override TypeItemKind Kind => TypeItemKind.Enum;

        protected override string GetFullIdnfName(
            ) => string.Concat(
                DeclaringType?.Value.FullIdnfName,
                IdnfNameCore);

        protected override string GetIdnfName(
            ) => string.Concat(
                DeclaringType?.Value.IdnfName,
                IdnfNameCore);

        protected override string GetShortName() => ShortName;

        protected override void AddAllTypeDependencies(
            List<Lazy<TypeItemCoreBase>> depsList)
        {
        }
    }

    public abstract class RegularTypeItemBase : TypeItemCore
    {
        public RegularTypeItemBase(
            string shortNameCore,
            string idnfNameCore)
        {
            ShortNameCore = shortNameCore ?? throw new ArgumentNullException(
                nameof(shortNameCore));

            IdnfNameCore = idnfNameCore ?? throw new ArgumentNullException(
                nameof(idnfNameCore));
        }

        protected string ShortNameCore { get; }
        protected string IdnfNameCore { get; }

        public Lazy<TypeIdnf> Idnf { get; init; }
        public Lazy<TypeData> Data { get; init; }

        public override Lazy<TypeIdnf>? GetIdnf() => Idnf;
        public override Lazy<TypeData>? GetData() => Data;

        protected override void AddAllTypeDependencies(
            List<Lazy<TypeItemCoreBase>> depsList)
        {
            depsList.AddDependencies([DeclaringType]);
            var typeData = Data.Value;

            depsList.AddDependencies(
                [typeData.BaseType]);

            depsList.AddDependencies(
                typeData.PubInstnProps?.Select(
                    prop => prop.PropertyType) ?? []);

            depsList.AddDependencies(
                typeData.PubInstnMethods?.SelectMany(
                    method => method.ReturnType.Arr(
                        method.Params.Select(
                            param => param.Value).ToArray())) ?? []);
        }
    }

    public class RegularTypeItem : RegularTypeItemBase
    {
        public RegularTypeItem(
            string shortNameCore,
            string idnfNameCore) : base(
                shortNameCore,
                idnfNameCore)
        {
        }

        public override TypeItemKind Kind => TypeItemKind.Regular;

        protected override string GetFullIdnfName(
            ) => IdnfNameCore;

        protected override string GetIdnfName(
            ) => IdnfNameCore;

        protected override string GetShortName(
            ) => ShortNameCore;
    }

    public class GenericTypeItem : RegularTypeItemBase
    {
        public GenericTypeItem(
            string shortNameCore,
            string idnfNameCore) : base(
                shortNameCore,
                idnfNameCore)
        {
        }

        public override TypeItemKind Kind => TypeItemKind.GenericRegular;
        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericTypeArgs { get; init; }

        protected override void AddAllTypeDependencies(
            List<Lazy<TypeItemCoreBase>> depsList)
        {
            base.AddAllTypeDependencies(depsList);
            var typeData = Data.Value;

            depsList.AddDependencies(
                [typeData.GenericTypeDefinition]);

            depsList.AddRange(
                GenericTypeArgs.Select(
                    arg => arg.Value.TypeArg.IfNotNull(
                        typeArg => typeArg,
                        () => arg.Value.Param)).Select(
                    type => new Lazy<TypeItemCoreBase>(type)));
        }

        protected override string GetFullIdnfName(
            ) => string.Concat(IdnfNameCore,
            GenericTypeArgs.GetGenericTypeArgsStr());

        protected override string GetIdnfName(
            ) => string.Concat(
                IdnfNameCore, "`",
                GenericTypeArgs.Count);

        protected override string GetShortName(
            ) => ShortNameCore;
    }

    public class GenericTypeArg
    {
        public GenericTypeParameter? Param { get; init; }
        public TypeItemCoreBase? TypeArg { get; init; }
        public TypeItemCoreBase DeclaringType { get; init; }
        public bool BelongsToDeclaringType { get; init; }

        public string ShortName => TypeArg?.ShortName ?? Param!.Name;
        public string IdnfName => TypeArg?.IdnfName ?? Param!.Name;

        public string FullIdnfName => TypeArg.IfNotNull(
            typeArg => typeArg?.FullIdnfName, () => Param!.Name);
    }

    public class GenericTypeParameter : TypeItemCoreBase
    {
        public string Name { get; init; }
        public int? GenericParamPosition { get; init; }
        public GenericTypeParamConstraints ParamConstraints { get; init; }

        public override string ShortName => Name;
        public override string IdnfName => Name;
        public override string FullIdnfName => Name;

        public override TypeItemKind Kind => TypeItemKind.GenericParam;
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
    }

    public abstract class MethodItemBase<TMethod> : ReflectionItemBase<TMethod>
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
    }

    public class MethodItem : MethodItemBase<MethodInfo>
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
    }

    public class GenericMethodItem : MethodItem
    {
        public GenericMethodItem(
            MethodInfo bclItem,
            string idnfName) : base(
                bclItem,
                idnfName)
        {
        }

        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericMethodArgs { get; init; }
    }
}
