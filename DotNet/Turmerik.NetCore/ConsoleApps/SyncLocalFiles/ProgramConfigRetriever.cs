using Turmerik.Core.ConsoleApps;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.NetCore.ConsoleApps.SyncLocalFiles
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
            destnProfile.DirPath = srcProfile.DirPath ?? destnProfile.DirPath;

            destnProfile.DfSrcFilesFilter = srcProfile.DfSrcFilesFilter;
            destnProfile.DfDestnFilesFilter = srcProfile.DfDestnFilesFilter;
            destnProfile.SrcFolders = srcProfile.SrcFolders;
            destnProfile.DestnLocations = srcProfile.DestnLocations;

            return destnProfile;
        }
    }
}
