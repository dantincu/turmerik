using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.NetCore.ConsoleApps.LocalFilesCloner
{
    public interface IProgramConfigRetriever
    {
        ProgramConfig LoadProgramConfig(
            string configFilePath = null);

        ProgramConfig.Profile MergeProfiles(
            ProgramConfig.Profile destnProfile,
            ProgramConfig.Profile srcProfile);
    }

    public class ProgramConfigRetriever : IProgramConfigRetriever
    {
        public const string CONFIG_FILE_NAME = "config.json";
        public const string PROGRAM_CONFIG_DIR_NAME = "program-config";
        public const string PROFILES_DIR_NAME = "profiles";

        private readonly IAppEnv appEnv;
        private readonly IJsonConversion jsonConversion;

        public ProgramConfigRetriever(
            IAppEnv appEnv,
            IJsonConversion jsonConversion)
        {
            this.appEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));
        }

        public ProgramConfig LoadProgramConfig(
            string configFilePath = null)
        {
            configFilePath ??= appEnv.GetTypePath(
                AppEnvDir.Config,
                GetType(),
                PROGRAM_CONFIG_DIR_NAME,
                CONFIG_FILE_NAME);

            string configDirPath = Path.GetDirectoryName(
                configFilePath)!;

            ProgramConfig programConfig = jsonConversion.Adapter.Deserialize<ProgramConfig>(
                File.ReadAllText(configFilePath));

            for (int i = 0; i < programConfig.Profiles.Count; i++)
            {
                var destnProfile = programConfig.Profiles[i];

                if (destnProfile.ProfileRelFilePath != null)
                {
                    string externalProfileFilePath = Path.Combine(
                        configDirPath, destnProfile.ProfileRelFilePath);

                    string json = File.ReadAllText(externalProfileFilePath);
                    var srcProfile = jsonConversion.Adapter.Deserialize<ProgramConfig.Profile>(json);

                    MergeProfiles(destnProfile, srcProfile);
                }
            }

            return programConfig;
        }

        public ProgramConfig.Profile MergeProfiles(
            ProgramConfig.Profile destnProfile,
            ProgramConfig.Profile srcProfile)
        {
            destnProfile.ProfileName = srcProfile.ProfileName ?? destnProfile.ProfileName;
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
