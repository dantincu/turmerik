using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.Utility.Assemblies
{
    public class DotNetTypeIdnf : IEquatable<DotNetTypeIdnf>
    {
        public Type BclItem { get; init; }
        public string Name { get; init; }
        public string CoreName { get; init; }
        public string? FullName { get; init; }
        public string FullIdnfName { get; init; }
        public string? Namespace { get; init; }

        public DotNetTypeIdnf? DeclaringTypeIdnf { get; init; }

        public DotNetAssembly DotNetAssembly { get; init; }

        public bool Equals(DotNetTypeIdnf? other) => other?.FullIdnfName == FullIdnfName;
    }

    public class DotNetType : IEquatable<DotNetType>
    {
        public DotNetType(
            DotNetTypeIdnf idnf)
        {
            Idnf = idnf ?? throw new ArgumentNullException(nameof(idnf));
        }

        public DotNetTypeIdnf Idnf { get; init; }
        public bool NsStartsWithAsmbPfx { get; init; }
        public ReadOnlyCollection<string> RelNsParts { get; init; }
        public DotNetAssembly Assembly { get; init; }

        public bool Equals(DotNetType? other) => other?.Idnf.Equals(Idnf) ?? false;
    }

    public class DotNetAssemblyCore<TType> : IEquatable<DotNetAssemblyCore<TType>>
    {
        public DotNetAssemblyCore()
        {
            TypesList = [];
        }

        public Assembly BclItem { get; init; }
        public string Name { get; init; }
        public string DefaultNamespace { get; init; }
        public string TypeNamesPfx { get; init; }
        public string AssemblyFilePath { get; init; }
        public bool IsExecutable { get; set; }
        public bool IsCoreLib { get; set; }
        public bool IsNetStandardLib { get; set; }
        public bool IsSysLib { get; set; }

        public List<TType> TypesList { get; init; }

        public bool Equals(DotNetAssemblyCore<TType>? other) => other?.Name == Name;

        public static string? GetName(
            Assembly asmb) => asmb.GetName().Name;
    }

    public class DotNetAssemblyCore : DotNetAssemblyCore<DotNetTypeIdnf>
    {
    }

    public class DotNetAssembly : DotNetAssemblyCore<DotNetType>
    {
    }
}
