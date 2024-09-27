using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Drawing.Imaging;
using System.Linq;
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
        Regular,
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
        GenericParam
    }

    public static class ReflectionItem
    {
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

        public ReadOnlyCollection<PropertyItem> PubInstnProps { get; init; }
        public ReadOnlyCollection<MethodItem> PubInstnMethods { get; init; }

        public Lazy<ReadOnlyCollection<Lazy<TypeItemCoreBase>>> AllTypeDependencies { get; init; }
    }

    public abstract class TypeItemCoreBase : IEquatable<TypeItemCoreBase>
    {
        protected TypeItemCoreBase(
            TypeItemKind kind)
        {
            Kind = kind;
        }

        public TypeItemKind Kind { get; }
        public abstract string IdnfName { get; }
        public abstract string FullIdnfName { get; }

        public bool Equals(TypeItemCoreBase? other) => other?.FullIdnfName == FullIdnfName;
    }

    public abstract class TypeItemCore<TTypeItem> : TypeItemCoreBase
        where TTypeItem : TypeItemCore<TTypeItem>
    {
        private readonly Func<TTypeItem, string> nameFactory;
        private readonly Func<TTypeItem, string> fullNameFactory;
        private readonly Lazy<string> idnfName;
        private readonly Lazy<string> fullIdnfName;

        protected TypeItemCore(
            TypeItemKind kind,
            Func<TTypeItem, string> nameFactory,
            Func<TTypeItem, string> fullNameFactory) : base(kind)
        {
            this.nameFactory = nameFactory ?? throw new ArgumentNullException(
                nameof(nameFactory));

            this.fullNameFactory = fullNameFactory ?? throw new ArgumentNullException(
                nameof(fullNameFactory));

            idnfName = new Lazy<string>(
                () => this.nameFactory((TTypeItem)this));

            fullIdnfName = new Lazy<string>(
                () => this.fullNameFactory((TTypeItem)this));
        }

        public override string IdnfName => idnfName.Value;
        public override string FullIdnfName => idnfName.Value;

        public Lazy<TypeItemCoreBase>? DeclaringType { get; init; }
    }

    public class TypeItemCore : TypeItemCoreBase
    {
        public TypeItemCore(
            TypeItemKind kind,
            string idnfName) : base(kind)
        {
            IdnfName = idnfName ?? throw new ArgumentNullException(
                nameof(idnfName));
        }

        public override string IdnfName { get; }
        public override string FullIdnfName => IdnfName;
    }

    public class GenericInteropTypeItem : TypeItemCore<GenericInteropTypeItem>
    {
        public GenericInteropTypeItem(
            TypeItemKind kind,
            Func<GenericInteropTypeItem, string> nameFactory,
            Func<GenericInteropTypeItem, string> fullNameFactory) : base(
                kind,
                nameFactory,
                fullNameFactory)
        {
        }

        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericTypeArgs { get; init; }
    }

    public class EnumTypeItem : TypeItemCore<EnumTypeItem>
    {
        public EnumTypeItem(
            TypeItemKind kind,
            Func<EnumTypeItem, string> nameFactory,
            Func<EnumTypeItem, string> fullNameFactory) : base(
                kind,
                nameFactory,
                fullNameFactory)
        {
        }

        public ReadOnlyDictionary<string, object> DefinedValuesMap { get; init; }
    }

    public class TypeItem<TTypeItem> : TypeItemCore<TTypeItem>
        where TTypeItem : TypeItem<TTypeItem>
    {
        public TypeItem(
            TypeItemKind kind,
            Func<TTypeItem, string> nameFactory,
            Func<TTypeItem, string> fullNameFactory) : base(
                kind,
                fullNameFactory,
                nameFactory)
        {
        }

        public Lazy<TypeIdnf> Idnf { get; init; }
        public Lazy<TypeData> Data { get; init; }
    }

    public class TypeItem : TypeItem<TypeItem>
    {
        public TypeItem(
            TypeItemKind kind,
            Func<TypeItem, string> nameFactory,
            Func<TypeItem, string> fullNameFactory) : base(
                kind,
                nameFactory,
                fullNameFactory)
        {
        }
    }

    public class GenericTypeItem : TypeItem<GenericTypeItem>
    {
        public GenericTypeItem(
            TypeItemKind kind,
            Func<GenericTypeItem, string> nameFactory,
            Func<GenericTypeItem, string> fullNameFactory) : base(
                kind,
                nameFactory,
                fullNameFactory)
        {
        }

        public ReadOnlyCollection<Lazy<GenericTypeArg>>? GenericTypeArgs { get; init; }
    }

    public class GenericTypeArg
    {
        public GenericTypeParameter? Param { get; init; }
        public TypeItemCoreBase? TypeArg { get; init; }
        public TypeItemCoreBase DeclaringType { get; init; }
        public bool BelongsToDeclaringType { get; init; }

        public string IdnfName => TypeArg?.IdnfName ?? Param!.Name;
        public string FullIdnfName => TypeArg?.FullIdnfName ?? Param!.Name;
    }

    public class GenericTypeParameter : TypeItemCoreBase
    {
        public GenericTypeParameter(
            TypeItemKind kind) : base(kind)
        {
        }

        public string Name { get; init; }
        public int? GenericParamPosition { get; init; }
        public GenericTypeParamConstraints ParamConstraints { get; init; }

        public override string IdnfName => Name;
        public override string FullIdnfName => Name;
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

        public ReadOnlyCollection<Lazy<GenericTypeArg>>? GenericTypeArgs { get; init; }
    }
}
