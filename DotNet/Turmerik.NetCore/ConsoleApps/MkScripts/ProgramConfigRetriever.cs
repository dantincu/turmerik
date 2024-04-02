using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;

namespace Turmerik.NetCore.ConsoleApps.MkScripts
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
            destnProfile.Sections ??= new List<ProgramConfig.ProfileSection>();

            if (srcProfile.Sections != null)
            {
                destnProfile.Sections.AddRange(
                    srcProfile.Sections);
            }

            destnProfile.RelDirPaths ??= srcProfile.RelDirPaths;
            destnProfile.DefaultContentSpecs ??= srcProfile.DefaultContentSpecs;

            return destnProfile;
        }
    }
}
