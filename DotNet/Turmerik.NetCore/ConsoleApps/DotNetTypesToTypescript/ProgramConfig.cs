using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public class ProgramConfig : ProgramConfigCoreBase<ProgramConfig.Profile>
    {
        public class Profile : ProgramConfigProfileCoreBase
        {
            public Func<Assembly, bool> IsTurmerikAssemblyPredicate { get; set; }
            public string DestnCsProjectAssembliesDirName { get; set; }
            public string DestnExternalAssemblliesDirName { get; set; }
            public string TypesDirName { get; set; }
            public string TypesHcyDirName { get; set; }
            public string TypesInfoDirName { get; set; }
            public string TypesInfoFileName { get; set; }
            public SrcDestnPaths DirPaths { get; set; }
            public string DfSrcBinsRelDirPath { get; set; }
            public string[] DirPathsToRemoveBefore { get; set; }

            public List<ProfileSection> Sections { get; set; }
        }

        public class ProfileSection
        {
            public string SectionName { get; set; }

            public SrcDestnPaths DirPaths { get; set; }
            public string DfSrcBinsRelDirPath { get; set; }
            public string[] DirPathsToRemoveBefore { get; set; }

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
            public string Namespace { get; set; }
            public string Name { get; set; }
            public string[] RelNsPartsArr { get; set; }
            public string[] NestedTypesHcyArr { get; set; }
            public SrcDestnPaths FilePaths { get; set; }
            public DotNetType DeclaringType { get; set; }
            public DotNetType GenericTypeDef { get; set; }
            public List<GenericTypeParam> GenericTypeParams { get; set; }
            public List<GenericTypeArg> GenericTypeArgs { get; set; }
        }

        public class GenericTypeParam
        {
            public string Name { get; set; }
            public DotNetType BaseType { get; set; }
            public List<DotNetType> Interfaces { get; set; }
            public bool? HasStructConstraint { get; set; }
            public bool? HasClassConstraint { get; set; }
            public bool? HasZeroArgsConstrCallConstraint { get; set; }
        }

        public class GenericTypeArg
        {
            public GenericTypeParam Param { get; set; }
            public DotNetType TypeArg { get; set; }
            public GenericTypeParam ParamArg { get; set; }
        }

        public class SrcDestnPaths
        {
            public string SrcPath { get; set; }
            public string DestnPath { get; set; }
        }
    }
}
