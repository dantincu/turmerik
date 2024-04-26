using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Utility;

namespace Turmerik.NetCore.ConsoleApps.SyncLocalFiles
{
    public class ProgramArgs
    {
        public delegate Task BeforeSyncEventHandler(
            ProgramArgs args,
            ProgramConfig.SrcFolder src,
            ProgramConfig.DestnLocation destnLocation,
            ProgramConfig.DestnFolder destnFolder,
            string destnDirPath);

        public delegate DataTreeNodeMtbl<RefTrgDriveFolderTuple> SyncDiffResultFactory(
            ProgramArgs args,
            ProgramConfig.SrcFolder src,
            ProgramConfig.DestnLocation destnLocation,
            ProgramConfig.DestnFolder destnFolder,
            string destnDirPath,
            DataTreeNodeMtbl<FilteredDriveEntries> srcEntriesObj,
            DataTreeNodeMtbl<FilteredDriveEntries> destnEntriesObj);

        public delegate Task AfterSyncEventHandler(
            ProgramArgs args,
            ProgramConfig.SrcFolder src,
            ProgramConfig.DestnLocation destnLocation,
            ProgramConfig.DestnFolder destnFolder,
            string destnDirPath,
            DataTreeNodeMtbl<FilteredDriveEntries> srcEntriesObj,
            DataTreeNodeMtbl<FilteredDriveEntries> destnEntriesObj,
            DataTreeNodeMtbl<RefTrgDriveFolderTuple> diffResult);

        public string WorkDir { get; set; }
        public string ConfigFilePath { get; set; }
        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public ProgramConfig Config { get; set; }
        public string ProfileName { get; set; }
        
        public Dictionary<string, List<string>> LocationNamesMap { get; set; }

        public ProgramConfig.Profile Profile { get; set; }

        public FileSyncType FileSyncType { get; set; }
        public bool? PropagatePush { get; set; }
        public bool? Interactive { get; set; }
        public bool? SkipDiffPrinting { get; set; }
        public bool? TreatAllAsDiff { get; set; }
        public int? RowsToPrint { get; set; }

        public BeforeSyncEventHandler OnBeforeSync { get; set; }
        public SyncDiffResultFactory DiffResultFactory { get; set; }
        public AfterSyncEventHandler OnAfterSync { get; set; }
    }
}
