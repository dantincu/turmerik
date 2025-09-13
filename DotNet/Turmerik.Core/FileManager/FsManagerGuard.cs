using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.Core.FileManager
{
    public interface IFsManagerGuard
    {
        bool AllowSysFolders { get; init; }
        bool AllowNonSysDrives { get; init; }
        string RootDirPath { get; init; }
        bool HasRootDirPath { get; }

        bool ThrowIfPathIsNotValidAgainstRootPath(
            string path, bool allowsRootPath,
            out string rootedPath);

        bool PathIsValidAgainstRootPath(
            string path, bool allowsRootPath,
            out string rootedPath);
    }

    public class FsManagerGuard : IFsManagerGuard
    {
        public static readonly Regex ParentDirRegex = new(@"[\\\/]\s*\.\s*\.[\\\/]");
        public readonly static string SystemDrivePathRoot;
        public readonly static string UserProfilePath;
        public readonly static string UserProfilePathRoot;
        public readonly static string AppDataDirName;
        public readonly static string AppDataPath;
        public readonly static string AppDataChildRelPathStartStr;

        private readonly bool allowSysFolders;
        private readonly bool allowNonSysDrives;
        private readonly string? rootDirPath;
        private readonly bool hasRootDirPath;

        static FsManagerGuard()
        {
            SystemDrivePathRoot = Path.GetPathRoot(
                Environment.GetFolderPath(
                    Environment.SpecialFolder.System));

            UserProfilePath = Environment.GetFolderPath(
                Environment.SpecialFolder.UserProfile);

            UserProfilePathRoot = Path.GetPathRoot(
                UserProfilePath);

            AppDataDirName = Environment.GetFolderPath(
                Environment.SpecialFolder.ApplicationData).Substring(
                    UserProfilePath.Length).Split(
                        Path.DirectorySeparatorChar.Arr(),
                        StringSplitOptions.RemoveEmptyEntries)[0];

            AppDataPath = Path.Combine(
                UserProfilePath,
                AppDataDirName);

            AppDataChildRelPathStartStr = AppDataDirName + Path.DirectorySeparatorChar;
        }

        public bool AllowSysFolders
        {
            get => allowSysFolders;

            init
            {
                allowSysFolders = value;
            }
        }

        public bool AllowNonSysDrives
        {
            get => allowNonSysDrives;

            init
            {
                allowNonSysDrives = value;
            }
        }

        public string RootDirPath
        {
            get => rootDirPath;

            init
            {
                if (!string.IsNullOrEmpty(value))
                {
                    hasRootDirPath = true;
                    rootDirPath = value;
                }
            }
        }

        public bool HasRootDirPath => hasRootDirPath;

        public bool ThrowIfPathIsNotValidAgainstRootPath(
            string path, bool allowsRootPath,
            out string rootedPath)
        {
            bool isValid = PathIsValidAgainstRootPath(
                path, allowsRootPath, out rootedPath);

            if (!isValid)
            {
                if (hasRootDirPath)
                {
                    throw new DriveExplorerException(
                        $"All paths are required to fall under root path `{rootDirPath}`; path received: {path}",
                        System.Net.HttpStatusCode.BadRequest);
                }
                else
                {
                    throw new DriveExplorerException(
                        string.Join(" ", $"All paths are required to either have a different root than the system root or fall under user profile path `{UserProfilePath}`",
                            $"as a nested folder that does not start with the dot char '.' and is not equal to the app data dir name `{AppDataDirName}`; path received: {path}"),
                        System.Net.HttpStatusCode.BadRequest);
                }
            }

            return isValid;
        }

        public bool PathIsValidAgainstRootPath(
            string path, bool allowsRootPath,
            out string rootedPath)
        {
            rootedPath = path;

            bool isValid = path != null && path == path.Trim(
                ) && !ParentDirRegex.IsMatch(path) && !path.ContainsAny(
                    PathH.InvalidPathCharsStr);

            if (isValid)
            {
                string? pathRoot = Path.IsPathRooted(path) ? Path.GetPathRoot(path) : null;

                if (pathRoot != null)
                {
                    if (hasRootDirPath)
                    {
                        isValid = rootDirPath.IsChildPathOf(
                            path, allowsRootPath);
                    }
                    else if (!AllowSysFolders && pathRoot == SystemDrivePathRoot)
                    {
                        isValid = UserProfilePath.IsChildPathOf(
                            path, false);
                    }
                }
                else
                {
                    isValid = !path.IsPathEmpty();

                    if (isValid)
                    {
                        rootedPath = Path.Combine(
                            hasRootDirPath ? rootDirPath : UserProfilePath,
                            path);
                    }
                }
            }

            return isValid;
        }
    }
}
