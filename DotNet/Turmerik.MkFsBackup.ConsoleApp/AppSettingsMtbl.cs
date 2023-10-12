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

    public class AppSettingsNodeCoreMtbl
    {
        public string Title { get; set; }
        public string Idnf { get; set; }
        public string SrcPath { get; set; }
        public string DestnPath { get; set; }
        public string DestnNewPath { get; set; }
        public string JsonFilePath { get; set; }
    }

    public class BackupSectionMtbl : AppSettingsNodeCoreMtbl
    {
        public string JsBehaviorFilePath { get; set; }

        public List<BackedUpFoldersGroupMtbl> Groups { get; set; }
    }

    public class BackedUpFoldersGroupMtbl : AppSettingsNodeCoreMtbl
    {
        public string ZipArchivePath { get; set; }
        public string ZipArchiveNewPath { get; set; }

        public List<BackedUpFolderMtbl> Folders { get; set; }
    }

    public class BackedUpFolderMtbl : AppSettingsNodeCoreMtbl
    {
        public List<BackedUpFsItemMtbl> RootItems { get; set; }
    }

    public class BackedUpFsItemMtbl
    {
        public string Name { get; set; }
        public bool? IsFolder { get; set; }

        public List<BackedUpFsItemMtbl> ChildItems { get; set; }
    }
}
