using Turmerik.Core.ConsoleApps;
using Turmerik.Core.FileSystem;

namespace Turmerik.NetCore.ConsoleApps.SyncLocalFiles
{
    public class ProgramConfig : ProgramConfigCoreBase<ProgramConfig.Profile>
    {
        public class DestnFolder
        {
            public DestnFolder()
            {
            }

            public DestnFolder(DestnFolder src)
            {
                DirPath = src.DirPath;
                SrcFilesFilter = src.SrcFilesFilter;
                DestnFilesFilter = src.DestnFilesFilter;
            }

            public string DirPath { get; set; }
            public DriveEntriesSerializableFilter SrcFilesFilter { get; set; }
            public DriveEntriesSerializableFilter DestnFilesFilter { get; set; }
        }

        public class DestnLocation
        {
            public DestnLocation()
            {
            }

            public DestnLocation(DestnLocation src)
            {
                Name = src.Name;
                DirPath = src.DirPath;
                DfSrcFilesFilter = src.DfSrcFilesFilter;
                DfDestnFilesFilter = src.DfDestnFilesFilter;
            }

            public string Name { get; set; }
            public string DirPath { get; set; }
            public DriveEntriesSerializableFilter DfSrcFilesFilter { get; set; }
            public DriveEntriesSerializableFilter DfDestnFilesFilter { get; set; }

            public Dictionary<string, DestnFolder> FoldersMap { get; set; }
        }

        public class SrcFolder
        {
            public SrcFolder()
            {
            }

            public SrcFolder(SrcFolder src)
            {
                Name = src.Name;
                DirPath = src.DirPath;
                DfSrcFilesFilter = src.DfSrcFilesFilter;
                DfDestnFilesFilter = src.DfDestnFilesFilter;

                DestnLocations = src.DestnLocations.Select(
                    location => new DestnLocation(location)).ToList();
            }

            public string Name { get; set; }
            public string DirPath { get; set; }
            public DriveEntriesSerializableFilter DfSrcFilesFilter { get; set; }
            public DriveEntriesSerializableFilter DfDestnFilesFilter { get; set; }

            public List<DestnLocation> DestnLocations { get; set; }
        }

        public class Profile : ProgramConfigProfileCoreBase
        {
            public Profile()
            {
            }

            public Profile(Profile src)
            {
                DirPath = src.DirPath;
                DfSrcFilesFilter = src.DfSrcFilesFilter;
                DfDestnFilesFilter = src.DfDestnFilesFilter;

                SrcFolders = src.SrcFolders.Select(
                    folder => new SrcFolder(folder)).ToList();
            }

            public string DirPath { get; set; }
            public DriveEntriesSerializableFilter DfSrcFilesFilter { get; set; }
            public DriveEntriesSerializableFilter DfDestnFilesFilter { get; set; }
            public List<SrcFolder> SrcFolders { get; set; }
        }
    }
}
