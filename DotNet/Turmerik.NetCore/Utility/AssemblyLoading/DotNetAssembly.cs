using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Turmerik.Core.Helpers;

namespace Turmerik.NetCore.Utility.AssemblyLoading
{
    public interface IIDotNetItem<TData>
    {
        TData Data { get; set; }
    }

    public interface IDotNetItem<TBCLItem, TData> : IIDotNetItem<TData>
    {
        TBCLItem? BclItem { get; }
    }

    public interface IDotNetItem<TDotNetItem, TBCLItem, TData> : IDotNetItem<TBCLItem, TData>
        where TDotNetItem : IDotNetItem<TDotNetItem, TBCLItem, TData>
    {
        TDotNetItem Clone();
    }

    public abstract class DotNetItemBase<TDotNetItem, TBCLItem, TData> : IDotNetItem<TDotNetItem, TBCLItem, TData>
        where TDotNetItem : IDotNetItem<TDotNetItem, TBCLItem, TData>
    {
        protected DotNetItemBase(
            TBCLItem? bclItem,
            TData data)
        {
            BclItem = bclItem;
            Data = data;
        }

        public TBCLItem? BclItem { get; }
        public TData Data { get; set; }

        public abstract TDotNetItem Clone();
    }

    public class DotNetAssemblyName<TData> : DotNetItemBase<DotNetAssemblyName<TData>, AssemblyName, TData>
    {
        public DotNetAssemblyName(
            AssemblyName? bclitem,
            TData data = default) : base(
                bclitem,
                data)
        {
        }

        public string Name { get; set; }
        public DotNetAssemblyVersion<TData>? BclVersion { get; set; }
        public CultureInfo CultureInfo { get; set; }
        public string CultureName { get; set; }
        public AssemblyContentType ContentType { get; set; }

        public override DotNetAssemblyName<TData> Clone() => new DotNetAssemblyName<TData>(
                BclItem, Data)
            {
                Name = Name,
                BclVersion = BclVersion,
                CultureInfo = CultureInfo,
                CultureName = CultureName,
                ContentType = ContentType,
            };
    }

    public class DotNetAssemblyVersion<TData> : DotNetItemBase<DotNetAssemblyVersion<TData>, Version, TData>
    {
        public DotNetAssemblyVersion(
            Version? bclItem,
            TData data = default) : base(
                bclItem,
                data)
        {
        }

        public override DotNetAssemblyVersion<TData> Clone() => new DotNetAssemblyVersion<TData>(
                BclItem, Data)
            {
                Major = Major,
                Minor = Minor,
                Build = Build,
                Revision = Revision,
                MajorRevision = MajorRevision,
                MinorRevision = MinorRevision,
            };

        public int Major { get; set; }
        public int Minor { get; set; }
        public int Build { get; set; }
        public int Revision { get; set; }
        public short MajorRevision { get; set; }
        public short MinorRevision { get; set; }
    }

    public class DotNetAssembly<TData> : DotNetItemBase<DotNetAssembly<TData>, Assembly, TData>
    {
        public DotNetAssembly(
            Assembly? bclItem,
            TData data = default) : base(
                bclItem,
                data)
        {
        }

        public DotNetAssemblyName<TData>? BclAsmbName { get; set; }
        public List<DotNetAssemblyName<TData>>? ReferencedBclAsmbNames { get; set; }
        public string? Name { get; set; }
        public string TypeNamesPfx { get; set; }
        public string AssemblyFilePath { get; set; }
        public bool? IsExecutable { get; set; }
        public bool? IsCoreLib { get; set; }
        public bool? IsNetStandardLib { get; set; }
        public bool? IsSysLib { get; set; }

        public List<DotNetType<TData>>? TypesList { get; set; }

        public override DotNetAssembly<TData> Clone() => new DotNetAssembly<TData>(
                BclItem, Data)
            {
                BclAsmbName = BclAsmbName,
                Name = Name,
                TypeNamesPfx = TypeNamesPfx,
                AssemblyFilePath = AssemblyFilePath,
                IsExecutable = IsExecutable,
                TypesList = TypesList,
            };
    }

    public class DotNetType<TData> : DotNetItemBase<DotNetType<TData>, Type, TData>
    {
        public DotNetType(
            Type? bclItem,
            TData data = default) : base(
                bclItem,
                data)
        {
        }

        public int? MetadataToken { get; set; }
        public string Name { get; set; }
        public string? Namespace { get; set; }
        public string FullName { get; set; }
        public string[]? RelNsPartsArr { get; set; }
        public bool? NsStartsWithAsmbPfx { get; set; }
        public bool? IsValueType { get; set; }
        public bool? IsNullableType { get; set; }
        public bool? IsArrayType { get; set; }
        public bool? IsNested { get; set; }
        public bool? IsGenericParam { get; set; }
        public bool? IsGenericTypeParam { get; set; }
        public bool? IsGenericMethodParam { get; set; }
        public bool? IsConstructedGenericType { get; set; }
        public bool? IsGenericType { get; set; }
        public bool? IsGenericTypeDef { get; set; }
        public bool? ContainsGenericParameters { get; set; }

        public DotNetAssembly<TData>? Assembly { get; set; }

        public DotNetType<TData>? ArrayElementType { get; set; }

        public DotNetType<TData>? BaseType { get; set; }
        public List<DotNetType<TData>>? Interfaces { get; set; }
        public DotNetType<TData>? DeclaringType { get; set; }
        public DotNetType<TData>? GenericTypeDef { get; set; }
        public List<GenericTypeArg<TData>>? GenericTypeArgs { get; set; }

        public List<DotNetProperty<TData>>? Properties { get; set; }
        public List<DotNetMethod<TData>>? Methods { get; set; }
        public List<DotNetConstructor<TData>>? Constructors { get; set; }

        public override DotNetType<TData> Clone() => new DotNetType<TData>(
                BclItem, Data)
            {
                MetadataToken = MetadataToken,
                Name = Name,
                Namespace = Namespace,
                FullName = FullName,
                RelNsPartsArr = RelNsPartsArr,
                NsStartsWithAsmbPfx = NsStartsWithAsmbPfx,
                IsValueType = IsValueType,
                IsNullableType = IsNullableType,
                IsArrayType = IsArrayType,
                IsNested = IsNested,
                IsGenericParam = IsGenericParam,
                IsGenericTypeParam = IsGenericTypeParam,
                IsGenericMethodParam = IsGenericMethodParam,
                IsConstructedGenericType = IsConstructedGenericType,
                IsGenericType = IsGenericType,
                IsGenericTypeDef = IsGenericTypeDef,
                ContainsGenericParameters = ContainsGenericParameters,
                Assembly = Assembly,
                BaseType = BaseType,
                Interfaces = Interfaces,
                DeclaringType = DeclaringType,
                GenericTypeDef = GenericTypeDef,
                GenericTypeArgs = GenericTypeArgs?.Select(
                    arg => arg).ToList(),
                Properties = Properties?.Select(
                    prop => prop).ToList(),
                Methods = Methods?.Select(
                    prop => prop).ToList(),
                Constructors = Constructors?.Select(
                    prop => prop).ToList()
            };
    }

    public class DotNetProperty<TData> : DotNetItemBase<DotNetProperty<TData>, PropertyInfo, TData>
    {
        public DotNetProperty(
            PropertyInfo? bclItem,
            TData data = default) : base(
                bclItem,
                data)
        {
        }

        public string Name { get; set; }
        public bool? CanRead { get; set; }
        public bool? CanWrite { get; set; }
        public bool? IsStatic { get; set; }

        public DotNetType<TData>? PropType { get; set; }

        public override DotNetProperty<TData> Clone() => new DotNetProperty<TData>(
                BclItem, Data)
            {
                Name = Name,
                CanRead = CanRead,
                CanWrite = CanWrite,
                IsStatic = IsStatic,
                PropType = PropType,
            };
    }

    public abstract class DotNetMethodBase<TDotNetMethod, TMethodInfo, TData> : DotNetItemBase<TDotNetMethod, TMethodInfo, TData>
        where TDotNetMethod : DotNetMethodBase<TDotNetMethod, TMethodInfo, TData>
        where TMethodInfo : MethodBase
    {
        public DotNetMethodBase(
            TMethodInfo? bclItem,
            TData data = default) : base(
                bclItem,
                data)
        {
        }

        public abstract bool IsConstructor { get; }

        public string Name { get; set; }
        public bool? IsStatic { get; set; }

        public List<DotNetMethodParameter<TData>>? Parameters { get; set; }
    }

    public class DotNetMethod<TData> : DotNetMethodBase<DotNetMethod<TData>, MethodInfo, TData>
    {
        public DotNetMethod(
            MethodInfo? bclItem,
            TData data = default) : base(
                bclItem,
                data)
        {
        }

        public override bool IsConstructor => false;

        public bool? IsVoidMethod { get; set; }

        public DotNetType<TData>? ReturnType { get; set; }

        public override DotNetMethod<TData> Clone() => new DotNetMethod<TData>(
                BclItem, Data)
            {
                Name = Name,
                IsStatic = IsStatic,
                IsVoidMethod = IsVoidMethod,
                ReturnType = ReturnType,
                Parameters = Parameters,
            };
    }

    public class DotNetConstructor<TData> : DotNetMethodBase<DotNetConstructor<TData>, ConstructorInfo, TData>
    {
        public DotNetConstructor(
            ConstructorInfo? bclItem,
            TData data = default) : base(
                bclItem,
                data)
        {
        }

        public override bool IsConstructor => true;

        public override DotNetConstructor<TData> Clone() => new DotNetConstructor<TData>(
                BclItem, Data)
            {
                Name = Name,
                IsStatic = IsStatic,
                Parameters = Parameters,
            };
    }

    public class DotNetMethodParameter<TData> : DotNetItemBase<DotNetMethodParameter<TData>, ParameterInfo, TData>
    {
        public DotNetMethodParameter(
            ParameterInfo? bclItem,
            TData data = default) : base(
                bclItem,
                data)
        {
        }

        public string Name { get; set; }
        public int? Position { get; set; }

        public DotNetType<TData>? ParamType { get; set; }

        public override DotNetMethodParameter<TData> Clone() => new DotNetMethodParameter<TData>(
                BclItem, Data)
            {
                Name = Name,
                Position = Position,
                ParamType = ParamType
            };
    }

    public class GenericTypeArg<TData>
    {
        public DotNetType<TData>? TypeArg { get; set; }

        public List<DotNetType<TData>>? TypeParamConstraints { get; set; }

        public GenericTypeArg<TData> Clone(
            bool keepBclObjects = true) => new GenericTypeArg<TData>
            {
                TypeArg = TypeArg,
                TypeParamConstraints = TypeParamConstraints
            };
    }
}
