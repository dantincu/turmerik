using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.NetCore.Reflection.AssemblyLoading;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public class ProgramConfig : ProgramConfigCoreBase<ProgramConfig.Profile>
    {
        public AssemblyLoaderConfig AssemblyLoaderConfig { get; set; }
        public string TsTabStr { get; set; }

        public class Profile : ProgramConfigProfileCoreBase
        {
            public Func<Assembly, bool> IsTurmerikAssemblyPredicate { get; set; }
            public string DestnCsProjectAssembliesDirName { get; set; }
            public string DestnExternalAssemblliesDirName { get; set; }
            public string AssemblyDfNsTypesDirName { get; set; }
            public string AssemblyNonDfNsTypesDirName { get; set; }
            public string TypesDirName { get; set; }
            public string TypesNodeDirName { get; set; }
            public string TypesHcyNodeDirName { get; set; }
            public string TypesInfoDirName { get; set; }
            public string TypesInfoFileName { get; set; }
            public SrcDestnPaths DirPaths { get; set; }
            public string DfSrcBinsRelDirPath { get; set; }

            public string TsTabStr { get; set; }

            public List<ProfileSection> Sections { get; set; }
        }

        public class ProfileSection
        {
            public string SectionName { get; set; }

            public SrcDestnPaths DirPaths { get; set; }
            public string DfSrcBinsRelDirPath { get; set; }

            public DotNetCsProject[] CsProjectsArr { get; set; }
        }

        public class DotNetCsProject
        {
            public string Name { get; set; }

            public SrcDestnPaths DirPaths { get; set; }
            public string SrcBinsRelDirPath { get; set; }
            public string SrcBuildRelDirPath { get; set; }
            public string SrcBuildDirPath { get; set; }
            public bool? IsDotNetStandard { get; set; }
            public decimal? DotNetVersionNumber { get; set; }
            public string DotNetVersionSffx { get; set; }

            public DotNetCsProjectAssembly CsProjectAssembly { get; set; }
        }

        public class DotNetAssembly
        {
            public string Name { get; set; }
            public string TypeNamesPfx { get; set; }

            public SrcDestnPaths Paths { get; set; }
            public DotNetType[] TypesArr { get; set; }
        }

        public class DotNetExternalAssembly : DotNetAssembly
        {
        }

        public class DotNetCsProjectAssembly : DotNetAssembly
        {
            public bool? IsExecutable { get; set; }
            public bool? IncludeAllTypes { get; set; }
        }

        public class DotNetType
        {
            public string FullName { get; set; }
            public int? GenericTypeParamsCount { get; set; }
            public string Namespace { get; set; }
            public string Name { get; set; }
            public string[] RelNsPartsArr { get; set; }
            public string[] NestedTypesHcyArr { get; set; }
            public DotNetType DeclaringType { get; set; }
        }

        public class SrcDestnPaths
        {
            public string SrcPath { get; set; }
            public string DestnPath { get; set; }
        }
    }
}
