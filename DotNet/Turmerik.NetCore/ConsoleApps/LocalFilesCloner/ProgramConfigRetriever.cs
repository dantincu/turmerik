using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.NetCore.ConsoleApps.LocalFilesCloner
{
    public interface IProgramConfigRetriever : IProgramConfigRetrieverCore<ProgramConfig, ProgramConfig.Profile>
    {
    }

    public class ProgramConfigRetriever : ProgramConfigRetrieverCoreBase<ProgramConfig, ProgramConfig.Profile>, IProgramConfigRetriever
    {
        public const string CONFIG_FILE_NAME = "config.json";
        public const string PROGRAM_CONFIG_DIR_NAME = "program-config";
        public const string PROFILES_DIR_NAME = "profiles";

        private readonly IAppEnv appEnv;
        private readonly IJsonConversion jsonConversion;

        public ProgramConfigRetriever(
            IAppEnv appEnv,
            IJsonConversion jsonConversion) : base(appEnv, jsonConversion)
        {
        }

        protected override ProgramConfig.Profile MergeProfilesCore(
            ProgramConfig.Profile destnProfile,
            ProgramConfig.Profile srcProfile,
            string configFilePath = null)
        {
            destnProfile.ScriptGroups ??= new List<ProgramConfig.ScriptsGroup>();
            destnProfile.FileGroups ??= new List<ProgramConfig.FilesGroup>();

            if (srcProfile.ScriptGroups != null)
            {
                destnProfile.ScriptGroups.AddRange(srcProfile.ScriptGroups);
            }

            if (srcProfile.FileGroups != null)
            {
                destnProfile.FileGroups.AddRange(srcProfile.FileGroups);
            }

            return destnProfile;
        }
    }
}
