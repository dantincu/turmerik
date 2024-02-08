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
        IFolder GetUserProfileDir();
        IFolder GetTurmerikRepoDir();
        IFolder GetTurmerikDotnetUtilityAppsEnvDir();
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
            UserProfileDir = src.GetUserProfileDir()?.ToImmtbl()!;
            TurmerikRepoDir = src.GetTurmerikRepoDir()?.ToImmtbl()!;
            TurmerikDotnetUtilityAppsEnvDir = src.GetTurmerikDotnetUtilityAppsEnvDir()?.ToImmtbl()!;
            OnedriveDir = src.GetOnedriveDir()?.ToImmtbl()!;
            OnedriveTurmerikDotNetUtilityAppsArchiveReldir = src.GetOnedriveTurmerikDotNetUtilityAppsArchiveReldir()?.ToImmtbl()!;
            PathsMap = src.GetPathsMap()?.Dictnr().RdnlD()!;
        }

        public FolderImmtbl UserProfileDir { get; }
        public FolderImmtbl TurmerikRepoDir { get; }
        public FolderImmtbl TurmerikDotnetUtilityAppsEnvDir { get; }
        public FolderImmtbl OnedriveDir { get; }
        public FolderImmtbl OnedriveTurmerikDotNetUtilityAppsArchiveReldir { get; }

        public ReadOnlyDictionary<string, string> PathsMap { get; }

        public IFolder GetUserProfileDir() => UserProfileDir;
        public IFolder GetTurmerikRepoDir() => TurmerikRepoDir;
        public IFolder GetTurmerikDotnetUtilityAppsEnvDir() => TurmerikDotnetUtilityAppsEnvDir;
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
            UserProfileDir = src.GetUserProfileDir()?.ToMtbl()!;
            TurmerikRepoDir = src.GetTurmerikRepoDir()?.ToMtbl()!;
            TurmerikDotnetUtilityAppsEnvDir = src.GetTurmerikDotnetUtilityAppsEnvDir()?.ToMtbl()!;
            OnedriveDir = src.GetOnedriveDir()?.ToMtbl()!;
            OnedriveTurmerikDotNetUtilityAppsArchiveReldir = src.GetOnedriveTurmerikDotNetUtilityAppsArchiveReldir()?.ToMtbl()!;
            PathsMap = src.GetPathsMap()?.Dictnr()!;
        }

        public FolderMtbl UserProfileDir { get; set; }
        public FolderMtbl TurmerikRepoDir { get; set; }
        public FolderMtbl TurmerikDotnetUtilityAppsEnvDir { get; set; }
        public FolderMtbl OnedriveDir { get; set; }
        public FolderMtbl OnedriveTurmerikDotNetUtilityAppsArchiveReldir { get; set; }

        public Dictionary<string, string> PathsMap { get; set; }

        public IFolder GetUserProfileDir() => UserProfileDir;
        public IFolder GetTurmerikRepoDir() => TurmerikRepoDir;
        public IFolder GetTurmerikDotnetUtilityAppsEnvDir() => TurmerikDotnetUtilityAppsEnvDir;
        public IFolder GetOnedriveDir() => OnedriveDir;
        public IFolder GetOnedriveTurmerikDotNetUtilityAppsArchiveReldir() => OnedriveTurmerikDotNetUtilityAppsArchiveReldir;

        public IEnumerable<KeyValuePair<string, string>> GetPathsMap() => PathsMap;
    }
}
