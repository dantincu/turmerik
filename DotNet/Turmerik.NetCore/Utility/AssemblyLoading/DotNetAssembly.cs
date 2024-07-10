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
    public interface IIDotNetItem
    {
    }

    public interface IDotNetItem<TBCLItem> : IIDotNetItem
    {
        TBCLItem? BclItem { get; }
    }

    public interface IDotNetItem<TDotNetItem, TBCLItem> : IDotNetItem<TBCLItem>
        where TDotNetItem : IDotNetItem<TDotNetItem, TBCLItem>
    {
        TDotNetItem Clone(
            bool keepBclObjects = true);
    }

    public abstract class DotNetItemBase<TDotNetItem, TBCLItem> : IDotNetItem<TDotNetItem, TBCLItem>
        where TDotNetItem : IDotNetItem<TDotNetItem, TBCLItem>
    {
        protected DotNetItemBase(
            TBCLItem? bclItem)
        {
            BclItem = bclItem;
        }

        public TBCLItem? BclItem { get; }

        public abstract TDotNetItem Clone(bool keepBclObjects = true);
    }

    public class DotNetAssemblyName : DotNetItemBase<DotNetAssemblyName, AssemblyName>
    {
        public DotNetAssemblyName(AssemblyName? bclitem) : base(bclitem)
        {
        }

        public string Name { get; set; }
        public DotNetAssemblyVersion? BclVersion { get; set; }
        public CultureInfo CultureInfo { get; set; }
        public string CultureName { get; set; }
        public AssemblyContentType ContentType { get; set; }

        public override DotNetAssemblyName Clone(
            bool keepBclObjects = true) => new DotNetAssemblyName(
                keepBclObjects ? BclItem : null)
            {
                Name = Name,
                BclVersion = BclVersion?.Clone(keepBclObjects),
                CultureInfo = CultureInfo,
                CultureName = CultureName,
                ContentType = ContentType,
            };
    }

    public class DotNetAssemblyVersion : DotNetItemBase<DotNetAssemblyVersion, Version>
    {
        public DotNetAssemblyVersion(Version? bclItem) : base(bclItem)
        {
        }

        public override DotNetAssemblyVersion Clone(
            bool keepBclObjects = true) => new DotNetAssemblyVersion(
                keepBclObjects ? BclItem : null)
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

    public class DotNetAssembly : DotNetItemBase<DotNetAssembly, Assembly>
    {
        public DotNetAssembly(Assembly? bclItem) : base(bclItem)
        {
        }

        public DotNetAssemblyName? BclAsmbName { get; set; }
        public List<DotNetAssemblyName>? ReferencedBclAsmbNames { get; set; }
        public string? FullName { get; set; }
        public string TypeNamesPfx { get; set; }
        public string AssemblyFilePath { get; set; }
        public bool? IsExecutable { get; set; }

        public List<DotNetType>? TypesList { get; set; }

        public override DotNetAssembly Clone(
            bool keepBclObjects = true) => new DotNetAssembly(
                keepBclObjects ? BclItem : null)
            {
                BclAsmbName = BclAsmbName?.Clone(keepBclObjects),
                FullName = FullName,
                TypeNamesPfx = TypeNamesPfx,
                AssemblyFilePath = AssemblyFilePath,
                IsExecutable = IsExecutable,
                TypesList = TypesList?.With(typesList => typesList.Select(
                    type => type.Clone(keepBclObjects)).ToList()),
            };
    }

    public class DotNetType : DotNetItemBase<DotNetType, Type>
    {
        public DotNetType(Type? bclItem) : base(bclItem)
        {
        }

        public string Name { get; set; }
        public string? Namespace { get; set; }
        public string FullName { get; set; }
        public string[]? RelNsPartsArr { get; set; }
        public bool? IsNested { get; set; }
        public bool? IsGenericParam { get; set; }
        public bool? IsGenericTypeParam { get; set; }
        public bool? IsGenericMethodParam { get; set; }
        public bool? IsConstructedGenericType { get; set; }
        public bool? IsGenericType { get; set; }
        public bool? IsGenericTypeDef { get; set; }

        public DotNetAssembly? Assembly { get; set; }

        public DotNetType? BaseType { get; set; }
        public List<DotNetType>? Interfaces { get; set; }
        public DotNetType? DeclaringType { get; set; }
        public DotNetType? GenericTypeDef { get; set; }
        public List<GenericTypeArg>? GenericTypeArgs { get; set; }

        public List<DotNetProperty>? Properties { get; set; }
        public List<DotNetMethod>? Methods { get; set; }
        public List<DotNetConstructor>? Constructors { get; set; }

        public override DotNetType Clone(
            bool keepBclObjects = true) => new DotNetType(
                keepBclObjects ? BclItem : null)
            {
                Name = Name,
                Namespace = Namespace,
                FullName = FullName,
                RelNsPartsArr = RelNsPartsArr,
                IsNested = IsNested,
                IsGenericParam = IsGenericParam,
                IsGenericTypeParam = IsGenericTypeParam,
                IsGenericMethodParam = IsGenericMethodParam,
                IsConstructedGenericType = IsConstructedGenericType,
                IsGenericType = IsGenericType,
                IsGenericTypeDef = IsGenericTypeDef,
                Assembly = Assembly?.Clone(keepBclObjects),
                BaseType = BaseType?.Clone(keepBclObjects),
                Interfaces = Interfaces?.Select(@interface => @interface.Clone(
                    keepBclObjects)).ToList(),
                DeclaringType = DeclaringType?.Clone(keepBclObjects),
                GenericTypeDef = GenericTypeDef?.Clone(keepBclObjects),
                GenericTypeArgs = GenericTypeArgs?.Select(
                    arg => arg.Clone(keepBclObjects)).ToList(),
                Properties = Properties?.Select(
                    prop => prop.Clone(keepBclObjects)).ToList(),
                Methods = Methods?.Select(
                    prop => prop.Clone(keepBclObjects)).ToList(),
                Constructors = Constructors?.Select(
                    prop => prop.Clone(keepBclObjects)).ToList()
            };
    }

    public class DotNetProperty : DotNetItemBase<DotNetProperty, PropertyInfo>
    {
        public DotNetProperty(PropertyInfo? bclItem) : base(bclItem)
        {
        }

        public string Name { get; set; }
        public bool? CanRead { get; set; }
        public bool? CanWrite { get; set; }
        public bool? IsStatic { get; set; }

        public DotNetType? PropType { get; set; }

        public override DotNetProperty Clone(
            bool keepBclObjects = true) => new DotNetProperty(
                keepBclObjects ? BclItem : null)
            {
                Name = Name,
                CanRead = CanRead,
                CanWrite = CanWrite,
                IsStatic = IsStatic,
                PropType = PropType?.Clone(keepBclObjects),
            };
    }

    public abstract class DotNetMethodBase<TDotNetMethod, TMethodInfo> : DotNetItemBase<TDotNetMethod, TMethodInfo>
        where TDotNetMethod : DotNetMethodBase<TDotNetMethod, TMethodInfo>
        where TMethodInfo : MethodBase
    {
        public DotNetMethodBase(TMethodInfo? bclItem) : base(bclItem)
        {
        }

        public abstract bool IsConstructor { get; }

        public string Name { get; set; }
        public bool? IsStatic { get; set; }

        public List<DotNetMethodParameter>? Parameters { get; set; }
    }

    public class DotNetMethod : DotNetMethodBase<DotNetMethod, MethodInfo>
    {
        public DotNetMethod(MethodInfo? bclItem) : base(bclItem)
        {
        }

        public override bool IsConstructor => false;

        public bool? IsVoidMethod { get; set; }

        public DotNetType? ReturnType { get; set; }

        public override DotNetMethod Clone(
            bool keepBclObjects = true) => new DotNetMethod(
                keepBclObjects ? BclItem : null)
            {
                Name = Name,
                IsStatic = IsStatic,
                IsVoidMethod = IsVoidMethod,
                ReturnType = ReturnType?.Clone(keepBclObjects),
                Parameters = Parameters?.Select(
                    @param => param.Clone(keepBclObjects)).ToList(),
            };
    }

    public class DotNetConstructor : DotNetMethodBase<DotNetConstructor, ConstructorInfo>
    {
        public DotNetConstructor(ConstructorInfo? bclItem) : base(bclItem)
        {
        }

        public override bool IsConstructor => true;

        public override DotNetConstructor Clone(
            bool keepBclObjects = true) => new DotNetConstructor(
                keepBclObjects ? BclItem : null)
            {
                Name = Name,
                IsStatic = IsStatic,
                Parameters = Parameters?.Select(
                    @param => param.Clone(keepBclObjects)).ToList(),
            };
    }

    public class DotNetMethodParameter : DotNetItemBase<DotNetMethodParameter, ParameterInfo>
    {
        public DotNetMethodParameter(ParameterInfo? bclItem) : base(bclItem)
        {
        }

        public string Name { get; set; }
        public int? Position { get; set; }

        public DotNetType? ParamType { get; set; }

        public override DotNetMethodParameter Clone(
            bool keepBclObjects = true) => new DotNetMethodParameter(
                keepBclObjects ? BclItem : null)
            {
                Name = Name,
                Position = Position,
                ParamType = ParamType?.Clone(keepBclObjects)
            };
    }

    public class GenericTypeArg
    {
        public DotNetType? TypeArg { get; set; }

        public List<DotNetType>? TypeParamConstraints { get; set; }

        public GenericTypeArg Clone(
            bool keepBclObjects = true) => new GenericTypeArg
            {
                TypeArg = TypeArg?.Clone(
                    keepBclObjects),
                TypeParamConstraints = TypeParamConstraints?.Select(
                    constraint => constraint.Clone()).ToList()
            };
    }
}
