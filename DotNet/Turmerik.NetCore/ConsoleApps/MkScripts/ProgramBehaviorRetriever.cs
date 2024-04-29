using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.Jint.Behavior;
using Turmerik.Jint.ConsoleApps;

namespace Turmerik.NetCore.ConsoleApps.MkScripts
{
    public interface IProgramBehaviorRetriever : IProgramBehaviorRetrieverCore<ProgramConfig, ProgramConfig.Profile>
    {
    }

    public class ProgramBehaviorRetriever : ProgramBehaviorRetrieverCoreBase<ProgramConfig, ProgramConfig.Profile>, IProgramBehaviorRetriever
    {
        public ProgramBehaviorRetriever(
            IAppEnv appEnv,
            IJsonConversion jsonConversion,
            ITrmrkJintAdapterFactory trmrkJintAdapterFactory) : base(
                appEnv,
                jsonConversion,
                trmrkJintAdapterFactory)
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
