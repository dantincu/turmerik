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
        ReadOnlyCollection<Lazy<TypeItemCore>>? GenericTypeArgs { get; }
        Lazy<ReadOnlyCollection<Lazy<TypeItemCore>>>? AllGenericTypeArgs { get; }

        ReadOnlyCollection<Lazy<GenericTypeParam>>? GenericTypeParams { get; }
        Lazy<ReadOnlyCollection<Lazy<GenericTypeParam>>>? AllGenericTypeParams { get; }
    }

    public enum TypeItemKind
    {
        RootObject = 0,
        RootValueType,
        Regular,
        Primitive,
        Enum,
        Nullable,
        Array
    }

    public enum PrimitiveType
    {
        None = 0,
        Boolean,
        Byte,
        SByte,
        Short,
        UShort,
        Int,
        UInt,
        Long,
        ULong,
        Decimal,
        Float,
        Double,
        DateTime,
        DateTimeOffset,
        TimeSpan,
        BigInteger,
        String
    }

    public static class ReflectionItem
    {
        public static IEnumerable<Lazy<TypeItemCore>>? GetAllGenericTypeArgs(
            this IGenericReflectionItem genericReflectionItem) => genericReflectionItem.AllGenericTypeArgs?.Value ?? genericReflectionItem.GenericTypeArgs;

        public static IEnumerable<Lazy<GenericTypeParam>>? GetAllGenericTypeParams(
            this IGenericReflectionItem genericReflectionItem) => genericReflectionItem.AllGenericTypeParams?.Value ?? genericReflectionItem.GenericTypeParams;
    }

    public class ReflectionItemBase<TBclItem>
    {
        public ReflectionItemBase(
            TBclItem bclItem,
            string idnfName)
        {
            BclItem = bclItem;

            IdnfName = idnfName ?? throw new ArgumentNullException(
                nameof(idnfName));
        }

        public TBclItem BclItem { get; init; }
        public string IdnfName { get; init; }
    }

    public class AssemblyItem : ReflectionItemBase<Assembly>, IEquatable<AssemblyItem>
    {
        public AssemblyItem(
            Assembly bclItem,
            string idnfName) : base(
                bclItem,
                idnfName)
        {
        }

        public string DefaultNamespace { get; init; }
        public string TypeNamesPfx { get; init; }
        public string AssemblyFilePath { get; init; }
        public bool IsExecutable { get; set; }
        public bool IsCoreLib { get; set; }
        public bool IsNetStandardLib { get; set; }
        public bool IsSysLib { get; set; }

        public Dictionary<string, TypeItemCore> TypesMap { get; init; }

        public bool Equals(AssemblyItem? other) => other?.IdnfName == IdnfName;
    }

    public class TypeIdnf : ReflectionItemBase<Type>, IEquatable<TypeIdnf>
    {
        public TypeIdnf(
            Type bclItem,
            string idnfName,
            AssemblyItem assemblyItem,
            string shortName) : base(
                bclItem,
                idnfName)
        {
            AssemblyItem = assemblyItem ?? throw new ArgumentNullException(
                nameof(assemblyItem));

            ShortName = shortName ?? throw new ArgumentNullException(
                nameof(shortName));

            TypeInfo = new Lazy<TypeInfo>(
                BclItem.GetTypeInfo);
        }

        public AssemblyItem AssemblyItem { get; init; }
        public string ShortName { get; init; }
        public Lazy<TypeInfo> TypeInfo { get; init; }
        public string? Namespace { get; init; }
        public bool NsStartsWithAsmbPfx { get; init; }
        public ReadOnlyCollection<string> RelNsParts { get; init; }

        public bool Equals(TypeIdnf? other) => other?.With(
            otherItem => otherItem.IdnfName == IdnfName) ?? false;
    }

    public class TypeData
    {
        public bool IsValueType { get; set; }
        public bool IsGenericParameter { get; set; }
        public bool IsGenericTypeParameter { get; set; }
        public bool IsGenericMethodParameter { get; set; }
        public bool IsConstructedGenericType { get; set; }
        public bool IsGenericTypeDefinition { get; set; }

        public Lazy<TypeItemCore>? BaseType { get; init; }
        public ReadOnlyCollection<Lazy<TypeItemCore>> InterfaceTypes { get; init; }
        public TypeItemCore? GenericTypeDefinition { get; init; }

        public ReadOnlyCollection<PropertyItem> PubInstnProps { get; init; }
        public ReadOnlyCollection<MethodItem> PubInstnMethods { get; init; }

        public Lazy<ReadOnlyCollection<Lazy<TypeItemCore>>> AllTypeDependencies { get; init; }
    }

    public class TypeItemCore
    {
        public TypeItemKind Kind { get; init; }
        public PrimitiveType PrimitiveType { get; init; }
    }

    public class TypeItem : TypeItemCore
    {
        public bool IsValueType { get; init; }

        public TypeIdnf Idnf { get; init; }
        public TypeData Data { get; init; }

        public TypeItem? DeclaringType { get; init; }
    }

    public class GenericTypeItem : TypeItem, IGenericReflectionItem
    {
        public ReadOnlyCollection<Lazy<TypeItemCore>>? GenericTypeArgs { get; init; }
        public Lazy<ReadOnlyCollection<Lazy<TypeItemCore>>>? AllGenericTypeArgs { get; init; }

        public ReadOnlyCollection<Lazy<GenericTypeParam>>? GenericTypeParams { get; init; }
        public Lazy<ReadOnlyCollection<Lazy<GenericTypeParam>>>? AllGenericTypeParams { get; init; }
    }

    public class GenericTypeParamConstraint : TypeItemCore
    {
        public bool HasZeroArgsConstructor { get; init; }
    }

    public class GenericTypeParam : ReflectionItemBase<Type>
    {
        public GenericTypeParam(
            Type bclItem,
            string idnfName) : base(
                bclItem,
                idnfName)
        {
        }

        public Lazy<ReadOnlyCollection<Lazy<GenericTypeParamConstraint>>> Constraints { get; init; }
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

        public ReadOnlyDictionary<string, Lazy<TypeItemCore>> Parameters { get; init; }
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

        public ReadOnlyCollection<Lazy<TypeItemCore>>? GenericTypeArgs { get; init; }
        public ReadOnlyCollection<Lazy<GenericTypeParam>>? GenericTypeParams { get; init; }
    }
}
