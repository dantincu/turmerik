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

    public class AppSettingsNodeCore
    {
        public string Title { get; set; }
        public string Idnf { get; set; }
        public string SrcBaseDirPath { get; set; }
        public string DestnBaseDirPath { get; set; }
        public string JsonFilePath { get; set; }
    }

    public class BackupSectionMtbl : AppSettingsNodeCore
    {
        public string JsBehaviorFilePath { get; set; }

        public List<BackedUpFoldersGroupMtbl> Groups { get; set; }
    }

    public class BackedUpFoldersGroupMtbl : AppSettingsNodeCore
    {
        public string ZipArchiveDirPath { get; set; }
        public string ZipArchiveFileNameTpl { get; set; }
        public string ZipArchiveFileNameTmStmpFmt { get; set; }

        public List<BackedUpFolderMtbl> Folders { get; set; }
    }

    public class BackedUpFolderMtbl : AppSettingsNodeCore
    {
        public List<BackedUpFsItem> RootItems { get; set; }
    }

    public class BackedUpFsItem
    {
        public string Name { get; set; }
        public bool? IsFolder { get; set; }

        public List<BackedUpFsItem> ChildItems { get; set; }
    }
}
