using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public interface IProgramConfigRetriever : IProgramConfigRetrieverCore<ProgramConfig, ProgramConfig.Profile>
    {
    }

    public class ProgramConfigRetriever : ProgramConfigRetrieverCoreBase<ProgramConfig, ProgramConfig.Profile>, IProgramConfigRetriever
    {
        public ProgramConfigRetriever(
            IAppEnv appEnv,
            IJsonConversion jsonConversion) : base(
                appEnv,
                jsonConversion)
        {
        }

        protected override ProgramConfig.Profile MergeProfilesCore(
            ProgramConfig.Profile destnProfile,
            ProgramConfig.Profile srcProfile,
            string configFilePath = null)
        {
            destnProfile.IsTurmerikAssemblyPredicate = srcProfile.IsTurmerikAssemblyPredicate ?? destnProfile.IsTurmerikAssemblyPredicate;
            destnProfile.DestnCsProjectAssembliesDirName = srcProfile.DestnCsProjectAssembliesDirName ?? destnProfile.DestnCsProjectAssembliesDirName;
            destnProfile.DestnExternalAssemblliesDirName = srcProfile.DestnExternalAssemblliesDirName ?? destnProfile.DestnExternalAssemblliesDirName;
            destnProfile.TypesHcyNodeDirName = srcProfile.TypesHcyNodeDirName ?? destnProfile.TypesHcyNodeDirName;
            destnProfile.TypeDefFileName = srcProfile.TypeDefFileName ?? destnProfile.TypeDefFileName;
            destnProfile.TypeInfoFileName = srcProfile.TypeInfoFileName ?? destnProfile.TypeInfoFileName;
            destnProfile.DirPaths = srcProfile.DirPaths ?? destnProfile.DirPaths;
            destnProfile.DfSrcBinsRelDirPath = srcProfile.DfSrcBinsRelDirPath ?? destnProfile.DfSrcBinsRelDirPath;

            destnProfile.Sections ??= new List<ProgramConfig.ProfileSection>();

            if (srcProfile.Sections != null)
            {
                destnProfile.Sections.AddRange(
                    srcProfile.Sections);
            }

            return destnProfile;
        }
    }
}
