using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;
using Turmerik.Helpers;

namespace Turmerik.MkFsBackup.ConsoleApp
{
    public class AppSettings
    {
        public AppSettings(AppSettingsMtbl src)
        {
            BackupSections = src.BackupSections?.Select(
                item => new BackupSection(item)).RdnlC();
        }

        public ReadOnlyCollection<BackupSection> BackupSections { get; }
    }

    public class AppSettingsNodeCore
    {
        public AppSettingsNodeCore(AppSettingsNodeCoreMtbl src)
        {
            Title = src.Title;
            Idnf = src.Idnf;
            SrcPath = src.SrcPath;
            DestnPath = src.DestnPath;
            DestnNewPath = src.DestnNewPath;
            JsonFilePath = src.JsonFilePath;
        }

        public string Title { get; }
        public string Idnf { get; }
        public string SrcPath { get; }
        public string DestnPath { get; }
        public string DestnNewPath { get; }
        public string JsonFilePath { get; }
    }

    public class BackupSection : AppSettingsNodeCore
    {
        public BackupSection(BackupSectionMtbl src) : base(src)
        {
            JsBehaviorFilePath = src.JsBehaviorFilePath;

            Groups = src.Groups?.Select(
                item => new BackedUpFoldersGroup(item)).RdnlC();
        }

        public string JsBehaviorFilePath { get; }

        public ReadOnlyCollection<BackedUpFoldersGroup> Groups { get; }
    }

    public class BackedUpFoldersGroup : AppSettingsNodeCore
    {
        public BackedUpFoldersGroup(BackedUpFoldersGroupMtbl src) : base(src)
        {
            ZipArchivePath = src.ZipArchivePath;
            ZipArchiveNewPath = src.ZipArchiveNewPath;

            Folders = src.Folders?.Select(
                item => new BackedUpFolder(item)).RdnlC();
        }

        public string ZipArchivePath { get; }
        public string ZipArchiveNewPath { get; }

        public ReadOnlyCollection<BackedUpFolder> Folders { get; }
    }

    public class BackedUpFolder : AppSettingsNodeCore
    {
        public BackedUpFolder(BackedUpFolderMtbl src) : base(src)
        {
            RootItems = src.RootItems?.Select(
                item => new BackedUpFsItem(item)).RdnlC();
        }

        public ReadOnlyCollection<BackedUpFsItem> RootItems { get; }
    }

    public class BackedUpFsItem
    {
        public BackedUpFsItem(BackedUpFsItemMtbl src)
        {
            Name = src.Name;
            IsFolder = src.IsFolder;

            ChildItems = src.ChildItems?.Select(
                item => new BackedUpFsItem(item)).RdnlC();
        }

        public string Name { get; }
        public bool? IsFolder { get; }

        public ReadOnlyCollection<BackedUpFsItem> ChildItems { get; }
    }
}
