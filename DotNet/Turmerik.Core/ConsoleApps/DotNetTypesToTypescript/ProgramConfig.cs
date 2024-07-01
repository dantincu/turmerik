using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;

namespace Turmerik.Core.ConsoleApps.DotNetTypesToTypescript
{
    public class ProgramConfig : ProgramConfigCoreBase<ProgramConfig.Profile>
    {
        public class Profile : ProgramConfigProfileCoreBase
        {
            public Func<Assembly, bool> IsTurmerikAssemblyPredicate { get; set; }
            public string TsMetadataNsName { get; set; }
            public string DestnExtraDirName { get; set; }
            public string DestnCsProjectsDirName { get; set; }
            public string DestnExternalAssemblliesDirName { get; set; }
            public string TypesDirName { get; set; }
            public SrcDestnPaths DirPaths { get; set; }
            public string DfSrcBinsRelDirPath { get; set; }
            public string DfSrcBuildRelDirPath { get; set; }

            public List<ProfileSection> Sections { get; set; }
        }

        public class ProfileSection
        {
            public string SectionName { get; set; }

            public SrcDestnPaths DirPaths { get; set; }
            public string DfSrcBinsRelDirPath { get; set; }
            public string DfSrcBuildRelDirPath { get; set; }
            public string[] DirPathsToRemoveBefore { get; set; }

            public DotNetCsProject[] CsProjectsArr { get; set; }
        }

        public class DotNetCsProject
        {
            public string Name { get; set; }

            public SrcDestnPaths DirPaths { get; set; }
            public string SrcBinsRelDirPath { get; set; }
            public string SrcBuildRelDirPath { get; set; }
            public string ScrBuildDirPath { get; set; }

            public DotNetCsProjectAssembly CsProjectAssembly { get; set; }
        }

        public class DotNetAssembly
        {
            public string Name { get; set; }

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
            public string Name { get; set; }
            public string RelNs { get; set; }
            public string FullNs { get; set; }
            public string TsMetadataNsName { get; set; }
            public SrcDestnPaths FilePaths { get; set; }
        }

        public class SrcDestnPaths
        {
            public string SrcPath { get; set; }
            public string DestnPath { get; set; }
        }
    }
}
