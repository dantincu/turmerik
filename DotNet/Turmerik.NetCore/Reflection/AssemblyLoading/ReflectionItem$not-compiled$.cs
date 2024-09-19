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
    public interface IReflectionItem<TBclItem>
    {
        TBclItem BclItem { get; }
        string IdnfName { get; }
    }

    public interface ITypeItemCore : IEquatable<ITypeItemCore>
    {
        TypeItemKind Kind { get; }
        PrimitiveType PrimitiveType { get; }
    }

    public interface IGenericTypeItemCore : ITypeItemCore
    {
        ReadOnlyCollection<Lazy<ITypeItemCore>>? GenericTypeArguments { get; }
    }

    public interface IGenericTypeItem : IGenericTypeItemCore
    {
        TypeIdnf? Idnf { get; }
        TypeData? Data { get; }

        ITypeItemCore? DeclaringType { get; }

        Lazy<ReadOnlyCollection<Lazy<IGenericTypeItemCore>>>? AllGenericTypeArguments { get; }

        ReadOnlyCollection<Lazy<IGenericTypeItemCore>>? GenericTypeParameters { get; }
        Lazy<ReadOnlyCollection<Lazy<IGenericTypeItemCore>>>? AllGenericTypeParameters { get; }
    }

    public interface IEnumTypeItem : ITypeItemCore
    {
        ReadOnlyDictionary<int, string>? EnumTypeMembers { get; init; }
    }

    public interface ITypeItem : ITypeItemCore
    {
        TypeData? Data { get; }
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

    public class ReflectionItemBase<TBclItem> : IReflectionItem<TBclItem>
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

        public Dictionary<string, EnumTypeItem> TypesMap { get; init; }

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

        public Lazy<EnumTypeItem>? BaseType { get; init; }
        public ReadOnlyCollection<Lazy<EnumTypeItem>> InterfaceTypes { get; init; }
        public EnumTypeItem? GenericTypeDefinition { get; init; }

        public ReadOnlyCollection<PropertyItem> PubInstnProps { get; init; }
        public ReadOnlyCollection<MethodItem> PubInstnMethods { get; init; }

        public Lazy<ReadOnlyCollection<Lazy<EnumTypeItem>>> AllTypeDependencies { get; init; }
    }

    public abstract class TypeItemCoreBase : ITypeItemCore
    {
        public TypeItemKind Kind { get; init; }
        public PrimitiveType PrimitiveType { get; init; }

        public bool Equals(ITypeItemCore? other) => other?.With(otherItem =>
        {
            bool retVal;

            if (otherItem is IGenericTypeItemCore otherGenericTypeItemCore)
            {
                retVal = (this as IGenericTypeItemCore)?.Equals(
                    otherGenericTypeItemCore) ?? false;
            }
            else if (otherItem is IGenericTypeItem otherGenericTypeItem)
            {
                retVal = (this as IGenericTypeItem)?.Equals(
                    otherGenericTypeItem) ?? false;
            }
            else if (otherItem is IEnumTypeItem otherEnumTypeItem)
            {
                retVal = (this as IEnumTypeItem)?.Equals(
                    otherEnumTypeItem) ?? false;
            }
            else if (otherItem is ITypeItem otherTpeItem)
            {
                retVal = (this as ITypeItem)?.Equals(
                    otherTpeItem) ?? false;
            }
            else
            {
                throw new NotSupportedException(
                    otherItem.GetType().FullName);
            }

            return retVal;
        }) ?? false;
    }

    public abstract class TypeItemCoreBase<TTypeItem> : TypeItemCoreBase, IEquatable<TTypeItem>
        where TTypeItem : TypeItemCoreBase<TTypeItem>
    {
        public bool Equals(TTypeItem? other) => other?.With(otherItem =>
        {
            bool retVal = Kind == otherItem.Kind;
            retVal = retVal && PrimitiveType == otherItem.PrimitiveType;

            retVal = retVal && EqualsCore(otherItem);
            return retVal;
        }) ?? false;

        protected abstract bool EqualsCore(
            TTypeItem otherItem);
    }

    public abstract class GenericTypeItemCore<TTypeItem> : TypeItemCoreBase<TTypeItem>
        where TTypeItem : GenericTypeItemCore<TTypeItem>
    {
        public ReadOnlyCollection<Lazy<ITypeItemCore>>? GenericTypeArguments { get; init; }

        protected override bool EqualsCore(
            TTypeItem otherItem)
        {
            bool retVal = GenericTypeArguments?.Count == otherItem.GenericTypeArguments?.Count;
            return retVal;
        }
    }

    public class GenericTypeItemCore : GenericTypeItemCore<GenericTypeItemCore>, IGenericTypeItemCore
    {
    }

    public abstract class GenericTypeItem<TTypeItem> : GenericTypeItemCore<TTypeItem>
        where TTypeItem : GenericTypeItem<TTypeItem>
    {
        public TypeIdnf? Idnf { get; init; }
        public TypeData? Data { get; init; }

        public ITypeItemCore? DeclaringType { get; init; }

        public Lazy<ReadOnlyCollection<Lazy<IGenericTypeItemCore>>>? AllGenericTypeArguments { get; init; }

        public ReadOnlyCollection<Lazy<IGenericTypeItemCore>>? GenericTypeParameters { get; init; }
        public Lazy<ReadOnlyCollection<Lazy<IGenericTypeItemCore>>>? AllGenericTypeParameters { get; init; }

        protected override bool EqualsCore(
            TTypeItem otherItem)
        {
            bool retVal = (Idnf != null) == (otherItem.Idnf != null);
            retVal = retVal && AllGenericTypeArguments?.Value.Count == otherItem.AllGenericTypeArguments?.Value.Count;
            retVal = retVal && AllGenericTypeParameters?.Value.Count == otherItem.AllGenericTypeParameters?.Value.Count;

            if (retVal)
            {
                if (Idnf != null)
                {
                    retVal = Idnf.Equals(otherItem.Idnf);
                }

                if (AllGenericTypeArguments != null)
                {
                    retVal = retVal && AllGenericTypeArguments.Value.All(
                        (enclosedType, idx) => otherItem.AllGenericTypeArguments!.Value![idx].Value.Equals(
                            enclosedType.Value));
                }

                if (AllGenericTypeParameters != null)
                {
                    retVal = retVal && AllGenericTypeParameters.Value.All(
                        (enclosedType, idx) => otherItem.AllGenericTypeParameters!.Value![idx].Value.Equals(
                            enclosedType.Value));
                }
            }

            return retVal;
        }
    }

    public abstract class GenericTypeItem : GenericTypeItem<GenericTypeItem>, IGenericTypeItem
    {
    }

    public abstract class TypeItemCore<TTypeItem> : TypeItemCoreBase<TTypeItem>
        where TTypeItem : TypeItemCore<TTypeItem>
    {
        public TypeIdnf? Idnf { get; init; }
        public ITypeItemCore? DeclaringType { get; init; }

        protected override bool EqualsCore(
            TTypeItem otherItem)
        {
            bool retVal = (Idnf != null) == (otherItem.Idnf != null);
            retVal = retVal && (DeclaringType != null) == (otherItem.DeclaringType != null);

            if (retVal)
            {
                if (Idnf != null)
                {
                    retVal = Idnf.Equals(otherItem.Idnf);
                }

                if (DeclaringType != null)
                {
                    retVal = retVal && Equals(DeclaringType);
                }
            }

            return retVal;
        }
    }

    public class EnumTypeItem : TypeItemCore<EnumTypeItem>, IEnumTypeItem
    {
        public ReadOnlyDictionary<int, string>? EnumTypeMembers { get; init; }
    }

    public class TypeItem : TypeItemCore<TypeItem>, ITypeItem
    {
        public TypeData? Data { get; init; }
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

        public Lazy<EnumTypeItem> PropertyType { get; init; }
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

        public ReadOnlyDictionary<string, Lazy<EnumTypeItem>> Parameters { get; init; }

        public ReadOnlyCollection<Lazy<EnumTypeItem>> GenericTypeArguments { get; init; }
        public ReadOnlyCollection<Lazy<EnumTypeItem>> GenericParameterConstraints { get; init; }
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

        public Lazy<EnumTypeItem> ReturnType { get; init; }
    }
}
