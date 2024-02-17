using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using static Turmerik.Core.LocalDeviceEnv.LocalDevicePathsMap;

namespace Turmerik.Core.LocalDeviceEnv
{
    public interface ILocalDevicePathMacrosMap
    {
        IFolder GetTurmerikTempDir();
        IFolder GetUserProfileDir();
        IFolder GetTurmerikRepoDir();
        IFolder GetTurmerikDotnetUtilityAppsEnvDir();
        IFolder GetTurmerikDotnetUtilityAppsEnvDirTypeName();
        IFolder GetOnedriveDir();
        IFolder GetOnedriveTurmerikDotNetUtilityAppsArchiveReldir();

        IEnumerable<KeyValuePair<string, string>> GetPathsMap();
    }

    public static class LocalDevicePathsMap
    {
        public interface IFolder
        {
            string VarName { get; }
            string DirPath { get; }
        }

        public class FolderImmtbl : IFolder
        {
            public FolderImmtbl(IFolder src)
            {
                VarName = src.VarName;
                DirPath = src.DirPath;
            }

            public string VarName { get; }
            public string DirPath { get; }
        }

        public class FolderMtbl : IFolder
        {
            public FolderMtbl()
            {
            }

            public FolderMtbl(IFolder src)
            {
                VarName = src.VarName;
                DirPath = src.DirPath;
            }

            public string VarName { get; set; }
            public string DirPath { get; set; }
        }

        public static LocalDevicePathMacrosMapImmtbl ToImmtbl(
            this ILocalDevicePathMacrosMap src) => new LocalDevicePathMacrosMapImmtbl(src);

        public static LocalDevicePathMacrosMapMtbl ToMtbl(
            this ILocalDevicePathMacrosMap src) => new LocalDevicePathMacrosMapMtbl(src);

        public static FolderImmtbl ToImmtbl(
            this IFolder src) => new FolderImmtbl(src);

        public static FolderMtbl ToMtbl(
            this IFolder src) => new FolderMtbl(src);
    }

    public class LocalDevicePathMacrosMapImmtbl : ILocalDevicePathMacrosMap
    {
        public LocalDevicePathMacrosMapImmtbl(ILocalDevicePathMacrosMap src)
        {
            TurmerikTempDir = src.GetTurmerikTempDir()?.ToImmtbl()!;
            UserProfileDir = src.GetUserProfileDir()?.ToImmtbl()!;
            TurmerikRepoDir = src.GetTurmerikRepoDir()?.ToImmtbl()!;
            TurmerikDotnetUtilityAppsEnvDir = src.GetTurmerikDotnetUtilityAppsEnvDir()?.ToImmtbl()!;
            TurmerikDotnetUtilityAppsEnvDirTypeName = src.GetTurmerikDotnetUtilityAppsEnvDirTypeName()?.ToImmtbl()!;
            OnedriveDir = src.GetOnedriveDir()?.ToImmtbl()!;
            OnedriveTurmerikDotNetUtilityAppsArchiveReldir = src.GetOnedriveTurmerikDotNetUtilityAppsArchiveReldir()?.ToImmtbl()!;
            PathsMap = src.GetPathsMap()?.Dictnr().RdnlD()!;
        }

        public FolderImmtbl TurmerikTempDir { get; }
        public FolderImmtbl UserProfileDir { get; }
        public FolderImmtbl TurmerikRepoDir { get; }
        public FolderImmtbl TurmerikDotnetUtilityAppsEnvDir { get; }
        public FolderImmtbl TurmerikDotnetUtilityAppsEnvDirTypeName { get; }
        public FolderImmtbl OnedriveDir { get; }
        public FolderImmtbl OnedriveTurmerikDotNetUtilityAppsArchiveReldir { get; }

        public ReadOnlyDictionary<string, string> PathsMap { get; }

        public IFolder GetTurmerikTempDir() => TurmerikTempDir;
        public IFolder GetUserProfileDir() => UserProfileDir;
        public IFolder GetTurmerikRepoDir() => TurmerikRepoDir;
        public IFolder GetTurmerikDotnetUtilityAppsEnvDir() => TurmerikDotnetUtilityAppsEnvDir;
        public IFolder GetTurmerikDotnetUtilityAppsEnvDirTypeName() => TurmerikDotnetUtilityAppsEnvDirTypeName;
        public IFolder GetOnedriveDir() => OnedriveDir;
        public IFolder GetOnedriveTurmerikDotNetUtilityAppsArchiveReldir() => OnedriveTurmerikDotNetUtilityAppsArchiveReldir;

        public IEnumerable<KeyValuePair<string, string>> GetPathsMap() => PathsMap;
    }

    public class LocalDevicePathMacrosMapMtbl : ILocalDevicePathMacrosMap
    {
        public LocalDevicePathMacrosMapMtbl()
        {
        }

        public LocalDevicePathMacrosMapMtbl(ILocalDevicePathMacrosMap src)
        {
            TurmerikTempDir = src.GetTurmerikTempDir()?.ToMtbl()!;
            UserProfileDir = src.GetUserProfileDir()?.ToMtbl()!;
            TurmerikRepoDir = src.GetTurmerikRepoDir()?.ToMtbl()!;
            TurmerikDotnetUtilityAppsEnvDir = src.GetTurmerikDotnetUtilityAppsEnvDir()?.ToMtbl()!;
            TurmerikDotnetUtilityAppsEnvDirTypeName = src.GetTurmerikDotnetUtilityAppsEnvDirTypeName()?.ToMtbl()!;
            OnedriveDir = src.GetOnedriveDir()?.ToMtbl()!;
            OnedriveTurmerikDotNetUtilityAppsArchiveReldir = src.GetOnedriveTurmerikDotNetUtilityAppsArchiveReldir()?.ToMtbl()!;
            PathsMap = src.GetPathsMap()?.Dictnr()!;
        }

        public FolderMtbl TurmerikTempDir { get; set; }
        public FolderMtbl UserProfileDir { get; set; }
        public FolderMtbl TurmerikRepoDir { get; set; }
        public FolderMtbl TurmerikDotnetUtilityAppsEnvDir { get; set; }
        public FolderMtbl TurmerikDotnetUtilityAppsEnvDirTypeName { get; set; }
        public FolderMtbl OnedriveDir { get; set; }
        public FolderMtbl OnedriveTurmerikDotNetUtilityAppsArchiveReldir { get; set; }

        public Dictionary<string, string> PathsMap { get; set; }

        public IFolder GetTurmerikTempDir() => TurmerikTempDir;
        public IFolder GetUserProfileDir() => UserProfileDir;
        public IFolder GetTurmerikRepoDir() => TurmerikRepoDir;
        public IFolder GetTurmerikDotnetUtilityAppsEnvDir() => TurmerikDotnetUtilityAppsEnvDir;
        public IFolder GetTurmerikDotnetUtilityAppsEnvDirTypeName() => TurmerikDotnetUtilityAppsEnvDirTypeName;
        public IFolder GetOnedriveDir() => OnedriveDir;
        public IFolder GetOnedriveTurmerikDotNetUtilityAppsArchiveReldir() => OnedriveTurmerikDotNetUtilityAppsArchiveReldir;

        public IEnumerable<KeyValuePair<string, string>> GetPathsMap() => PathsMap;
    }
}
