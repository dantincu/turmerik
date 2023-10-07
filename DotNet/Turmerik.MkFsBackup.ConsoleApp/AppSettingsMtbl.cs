using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkFsBackup.ConsoleApp
{
    public class AppSettingsMtbl
    {
        public List<BackupSectionMtbl> BackupSections { get; set; }
    }

    public class BackupSectionMtbl
    {
        public string SectionTitle { get; set; }
        public string SectionIdnf { get; set; }
        public string SectionSrcBaseDirPath { get; set; }
        public string SectionDestnBaseDirPath { get; set; }
        public string JsonFilePath { get; set; }
        public string JsBehaviorFilePath { get; set; }

        public List<BackedUpFoldersGroupMtbl> Groups { get; set; }
    }

    public class BackedUpFoldersGroupMtbl
    {
        public string GroupTitle { get; set; }
        public string GroupIdnf { get; set; }
        public string GroupSrcBaseDirPath { get; set; }
        public string GroupDestnBaseDirPath { get; set; }
        public string JsonFilePath { get; set; }

        public string ZipArchiveDirPath { get; set; }
        public string ZipArchiveFileNameTpl { get; set; }
        public string ZipArchiveFileNameTmStmpFmt { get; set; }

        public List<BackedUpFolderMtbl> Folders { get; set; }
    }

    public class BackedUpFolderMtbl
    {
        public string FolderTitle { get; set; }
        public string FolderIdnf { get; set; }
        public string SrcRootFolderPath { get; set; }
        public string DestnRootFolderPath { get; set; }

        public List<BackedUpFsItem> RootItems { get; set; }
    }

    public class BackedUpFsItem
    {
        public string Name { get; set; }
        public bool? IsFolder { get; set; }

        public List<BackedUpFsItem> ChildItems { get; set; }
    }
}
