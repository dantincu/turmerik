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
    public interface IGenericReflectionItem
    {
        ReadOnlyCollection<Lazy<GenericTypeArg>>? GenericTypeArgs { get; }
        Lazy<ReadOnlyCollection<Lazy<GenericTypeArg>>>? AllGenericTypeArgs { get; }
    }

    public enum TypeItemKind
    {
        RootObject = 0,
        RootValueType,
        Regular,
        Primitive,
        Enum,
        Nullable,
        Array,
        Enumerable,
        Dictionary
    }

    public enum GenericTypeParamConstraintKind
    {
        BaseType,
        Interface,
        Class,
        Struct,
        HasZeroArgsConstructor
    }

    public static class ReflectionItem
    {
        public static IEnumerable<Lazy<GenericTypeArg>>? GetAllGenericTypeArgs(
            this IGenericReflectionItem genericReflectionItem) => genericReflectionItem.AllGenericTypeArgs?.Value ?? genericReflectionItem.GenericTypeArgs;
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

        public Dictionary<string, TypeItemCore> TypesMap { get; init; }

        public bool Equals(AssemblyItem? other) => other?.Name == Name;
    }

    public class TypeIdnf : ReflectionItemBase<Type>, IEquatable<TypeIdnf>
    {
        public TypeIdnf(
            Type bclItem,
            AssemblyItem assemblyItem,
            string name,
            string shortName,
            string idnfName) : base(
                bclItem,
                name)
        {
            AssemblyItem = assemblyItem ?? throw new ArgumentNullException(
                nameof(assemblyItem));

            ShortName = shortName ?? throw new ArgumentNullException(
                nameof(shortName));

            IdnfName = idnfName ?? throw new ArgumentNullException(
                nameof(idnfName));

            TypeInfo = new Lazy<TypeInfo>(
                BclItem.GetTypeInfo);
        }

        public AssemblyItem AssemblyItem { get; }
        public string ShortName { get; }
        public string IdnfName { get; }
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
        public bool IsFullyConstructedGenericType { get; init; }
        public bool IsGenericTypeDefinition { get; init; }
        public bool IsInterface { get; init; }

        public Lazy<TypeItemCore>? BaseType { get; init; }
        public ReadOnlyCollection<Lazy<TypeItemCore>> InterfaceTypes { get; init; }
        public TypeItemCore? GenericTypeDefinition { get; init; }

        public ReadOnlyCollection<PropertyItem> PubInstnProps { get; init; }
        public ReadOnlyCollection<MethodItem> PubInstnMethods { get; init; }

        public Lazy<ReadOnlyCollection<Lazy<TypeItemCore>>> AllTypeDependencies { get; init; }
    }

    public class TypeItemCore : IEquatable<TypeItemCore>
    {
        private readonly Lazy<string> idnfName;

        public TypeItemCore(
            TypeItemKind kind,
            Func<string> idnfNameFactory)
        {
            Kind = kind;
            idnfName = new Lazy<string>(idnfNameFactory);
        }

        public TypeItemCore(
            TypeItemKind kind,
            string idnfName) : this(
                kind,
                () => idnfName)
        {
        }

        public TypeItemKind Kind { get; }
        public string IdnfName => idnfName.Value;

        public bool Equals(TypeItemCore? other) => other?.IdnfName == IdnfName;
    }

    public class GenericInteropTypeItem : TypeItemCore
    {
        public GenericInteropTypeItem(
            TypeItemKind kind,
            Func<string> idnfNameFactory) : base(
                kind,
                idnfNameFactory)
        {
        }

        public ReadOnlyCollection<Lazy<GenericTypeArg>> GenericTypeArgs { get; init; }
    }

    public class EnumTypeItem : TypeItemCore
    {
        public EnumTypeItem(
            TypeItemKind kind,
            Func<string> idnfNameFactory) : base(
                kind,
                idnfNameFactory)
        {
        }

        public ReadOnlyDictionary<string, int> DefinedValuesMap { get; init; }
    }

    public class TypeItem : TypeItemCore
    {
        public TypeItem(
            TypeItemKind kind,
            Func<string> idnfNameFactory) : base(
                kind,
                idnfNameFactory)
        {
        }

        public bool IsValueType { get; init; }

        public TypeIdnf Idnf { get; init; }
        public TypeData Data { get; init; }

        public TypeItemCore? DeclaringType { get; init; }
    }

    public class GenericTypeItem : TypeItem, IGenericReflectionItem
    {
        public GenericTypeItem(
            TypeItemKind kind,
            Func<string> idnfNameFactory) : base(
                kind,
                idnfNameFactory)
        {
        }

        public ReadOnlyCollection<Lazy<GenericTypeArg>>? GenericTypeArgs { get; init; }
        public Lazy<ReadOnlyCollection<Lazy<GenericTypeArg>>>? AllGenericTypeArgs { get; init; }
    }

    public class GenericTypeParamConstraint
    {
        public TypeItemCore? Type { get; init; }
        public GenericTypeParamConstraintKind Kind { get; init; }
    }

    public class GenericTypeArg : ReflectionItemBase
    {
        public GenericTypeArg(
            string name) : base(
                name)
        {
        }

        public TypeItemCore? TypeArg { get; init; }
        public int? GenericParamPosition { get; init; }
        public ReadOnlyCollection<Lazy<GenericTypeParamConstraint>>? ParamConstraints { get; init; }
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

        public Lazy<TypeItemCore> PropertyType { get; init; }
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

        public ReadOnlyDictionary<string, Lazy<TypeItemCore>> Params { get; init; }
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

        public Lazy<TypeItemCore> ReturnType { get; init; }
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
