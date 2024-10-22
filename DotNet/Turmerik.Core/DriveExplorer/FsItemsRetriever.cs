using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public interface IFsItemsRetriever : IDriveItemsRetriever
    {
        string RootDirPath { get; init; }
    }

    public class FsItemsRetriever : DriveItemsRetrieverBase, IFsItemsRetriever
    {
        private readonly static string systemDrivePathRoot;
        private readonly static string userProfilePath;
        private readonly static string userProfilePathRoot;
        private readonly static string appDataDirName;
        private readonly static string appDataPath;
        private readonly static string appDataChildRelPathStartStr;

        private readonly bool allowSysFolders;
        private readonly bool allowNonSysDrives;
        private readonly string rootDirPath;
        private readonly bool hasRootDirPath;

        private readonly IPascalOrCamelCaseToWordsConverter pascalOrCamelCaseToWordsConverter;

        static FsItemsRetriever()
        {
            systemDrivePathRoot = Path.GetPathRoot(
                Environment.GetFolderPath(
                    Environment.SpecialFolder.System));

            userProfilePath = Environment.GetFolderPath(
                Environment.SpecialFolder.UserProfile);

            userProfilePathRoot = Path.GetPathRoot(
                userProfilePath);

            appDataDirName = Environment.GetFolderPath(
                Environment.SpecialFolder.ApplicationData).Substring(
                    userProfilePath.Length).Split(
                        Path.DirectorySeparatorChar.Arr(),
                        StringSplitOptions.RemoveEmptyEntries)[0];

            appDataPath = Path.Combine(
                userProfilePath,
                appDataDirName);

            appDataChildRelPathStartStr = appDataDirName + Path.DirectorySeparatorChar;
        }

        public FsItemsRetriever(
            ITimeStampHelper timeStampHelper,
            IPascalOrCamelCaseToWordsConverter pascalOrCamelCaseToWordsConverter) : base(
                timeStampHelper)
        {
            this.pascalOrCamelCaseToWordsConverter = pascalOrCamelCaseToWordsConverter ?? throw new ArgumentNullException(
                nameof(pascalOrCamelCaseToWordsConverter));

            rootDirPath = string.Empty;
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

        public override async Task<DriveItem> GetItemAsync(
            string idnf, bool? retMinimalInfo)
        {
            ThrowIfPathIsNotValidAgainstRootPath(idnf, true, out var filePath);
            DriveItem item;

            if (Directory.Exists(filePath))
            {
                item = await GetFolderAsync(
                    filePath, retMinimalInfo);
            }
            else if (File.Exists(filePath))
            {
                item = await GetFileAsync(filePath);
            }
            else
            {
                item = null;
            }

            return item;
        }

        public override async Task<DriveItem> GetRootFolderAsync(
            bool? retMinimalInfo)
        {
            DriveItem folder;

            var drivesList = DriveInfo.GetDrives().Where(
                drive => drive.IsReady).ToList();

            if (!AllowSysFolders)
            {
                if (AllowNonSysDrives)
                {
                    drivesList.RemoveWhere(
                        drive => drive.DriveType == DriveType.Fixed && drive.Name == userProfilePathRoot);
                }
                else
                {
                    drivesList.RemoveWhere(
                        drive => drive.DriveType == DriveType.Fixed);
                }
            }

            folder = new DriveItem
            {
                SubFolders = drivesList.Select(
                    drive => new DriveItem
                    {
                        Name = drive.Name,
                        Idnf = Path.GetFullPath(drive.Name),
                        FolderType = FolderType.DriveRoot
                    }).ToList()
            };

            if (!AllowSysFolders)
            {
                DriveItem rootDir;

                if (hasRootDirPath)
                {
                    rootDir = GetDriveItem(
                        new DirectoryInfo(rootDirPath));
                }
                else
                {
                    rootDir = GetDriveItem(
                        new DirectoryInfo(userProfilePath));

                    rootDir.SpecialFolderType = Environment.SpecialFolder.UserProfile;
                }

                folder.SubFolders.Add(rootDir);
            }
            else
            {
                var specialFolderTypesArr = Environment.SpecialFolder.Favorites.Arr(
                    Environment.SpecialFolder.Desktop,
                    Environment.SpecialFolder.UserProfile,
                    Environment.SpecialFolder.MyDocuments,
                    Environment.SpecialFolder.MyMusic,
                    Environment.SpecialFolder.MyPictures,
                    Environment.SpecialFolder.MyVideos);

                var specialFoldersArr = specialFolderTypesArr.Select(
                    specialFolder => Tuple.Create(specialFolder, Environment.GetFolderPath(
                        specialFolder))).Where(
                    tuple =>
                    {
                        bool retVal = !string.IsNullOrEmpty(
                            tuple.Item2);

                        return retVal;
                    }).Select(
                    tuple => Tuple.Create(tuple.Item1, GetDriveItem(
                        new DirectoryInfo(tuple.Item2)))).Select(
                        tuple =>
                        {
                            (var folderType, var folder) = tuple;
                            folder.SpecialFolderType = tuple.Item1;

                            folder.DisplayName = folderType switch
                            {
                                Environment.SpecialFolder.UserProfile => Environment.UserName,
                                _ => pascalOrCamelCaseToWordsConverter.SplitIntoWords(
                                    new PascalOrCamelCaseToWordsConverterOpts
                                    {
                                        InputStr = folderType.ToString(),
                                        CapitalizeFirst = true,
                                    }).With(wordsArr => string.Join(" ", wordsArr))
                            };
                            return folder;
                        }).ToArray();

                folder.SubFolders.AddRange(specialFoldersArr);
            }

            SortChildItems(folder);
            RemoveAdditionalInfoIfReq(folder, retMinimalInfo);

            return folder;
        }

        public override async Task<DriveItem> GetFolderAsync(
            string idnf, bool? retMinimalInfo)
        {
            DriveItem folder;

            ThrowIfPathIsNotValidAgainstRootPath(idnf, true, out var folderPath);

            var entry = new DirectoryInfo(folderPath);
            folder = GetDriveItem(entry);

            var driveItemsList = entry.EnumerateFileSystemInfos(
                ).Select(fi => GetDriveItem(fi)).ToList();

            folder.SubFolders = new List<DriveItem>(
                driveItemsList.Where(
                    item => item.IsFolder == true));

            folder.FolderFiles = new List<DriveItem>(
                driveItemsList.Where(
                    item => item.IsFolder != true).ToList());

            SortChildItems(folder);
            RemoveAdditionalInfoIfReq(folder, retMinimalInfo);

            return folder;
        }

        public override async Task<bool> ItemExistsAsync(
            string idnf) => await FileExistsAsync(
                idnf) || await FolderExistsAsync(idnf);

        public override async Task<bool> FolderExistsAsync(
            string idnf) => ThrowIfPathIsNotValidAgainstRootPath(
                idnf, true, out var folderPath) && Directory.Exists(folderPath);

        public override async Task<bool> FileExistsAsync(
            string idnf) => ThrowIfPathIsNotValidAgainstRootPath(
                idnf, false, out var filePath) && File.Exists(filePath);

        public override string GetItemIdnf<TDriveItem>(
            TDriveItem item,
            string prIdnf)
        {
            ThrowIfPathIsNotValidAgainstRootPath(prIdnf, true, out _);

            string idnf = item.Idnf;
            prIdnf ??= item.PrIdnf;

            if (idnf == null && prIdnf != null)
            {
                idnf = Path.Combine(
                    prIdnf,
                    item.Name);
            }

            return idnf;
        }

        public override async Task<string> GetFileTextAsync(string idnf)
        {
            ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var filePath);

            using var reader = new StreamReader(filePath);
            var text = await reader.ReadToEndAsync();

            return text;
        }

        public override Task<byte[]> GetFileBytesAsync(
            string idnf)
        {
            ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var filePath);

            var bytesArr = FsH.ReadAllBytesAsync(filePath);
            return bytesArr;
        }

        protected async Task<DriveItem> GetFileAsync(
            string idnf)
        {
            ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var filePath);

            var fSysInfo = new FileInfo(filePath);
            var item = GetDriveItem(fSysInfo);

            return item;
        }

        protected DriveItem GetDriveItem(
            FileSystemInfo fSysInfo)
        {
            var fsItem = new DriveItem
            {
                Name = fSysInfo.Name,
                Idnf = fSysInfo.FullName,
                CreationTimeUtcTicks = fSysInfo.CreationTime.ToUniversalTime().Ticks,
                LastWriteTimeUtcTicks = fSysInfo.LastWriteTime.ToUniversalTime().Ticks,
                LastAccessTimeUtcTicks = fSysInfo.LastAccessTime.ToUniversalTime().Ticks,
            };

            if (fSysInfo is DirectoryInfo dirInfo)
            {
                fsItem.IsFolder = true;
            }
            else if (fSysInfo is FileInfo fInfo)
            {
                fsItem.FileSizeBytes = fInfo.Length;
                string extn = fSysInfo.Extension.ToLower();

                if (!string.IsNullOrEmpty(extn))
                {
                    if ((fsItem.FileType = GetFileType(extn)) == FileType.Document)
                    {
                        fsItem.OfficeFileType = GetOfficeFileType(extn);
                    }

                    if (PathH.CommonTextFileExtensions.Contains(extn))
                    {
                        fsItem.IsTextFile = true;
                    }
                    else if (PathH.CommonImageFileExtensions.Contains(extn))
                    {
                        fsItem.IsImageFile = true;
                    }
                    else if (PathH.CommonVideoFileExtensions.Contains(extn))
                    {
                        fsItem.IsVideoFile = true;
                    }
                    else if (PathH.CommonAudioFileExtensions.Contains(extn))
                    {
                        fsItem.IsAudioFile = true;
                    }
                }
            }

            return fsItem;
        }

        public override char GetDirSeparator() => Path.DirectorySeparatorChar;

        protected override void RemoveAdditionalInfoIfReq(
            DriveItem item, bool? retMinimalInfo)
        {
            base.RemoveAdditionalInfoIfReq(item, retMinimalInfo);

            if (retMinimalInfo != false)
            {
                item.PrIdnf = null;

                if (!item.SpecialFolderType.HasValue)
                {
                    item.Idnf = null;
                }
            }
        }

        protected bool ThrowIfPathIsNotValidAgainstRootPath(
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
                        $"All paths are required to fall under root path `{rootDirPath}`; path received: {path}");
                }
                else
                {
                    throw new DriveExplorerException(
                        string.Join(" ", $"All paths are required to either have a different root than the system root or fall under user profile path `{userProfilePath}`",
                            $"as a nested folder that does not start with the dot char '.' and is not equal to the app data dir name `{appDataDirName}`; path received: {path}"));
                }
            }

            return isValid;
        }

        protected bool PathIsValidAgainstRootPath(
            string path, bool allowsRootPath,
            out string rootedPath)
        {
            bool canBeValid = path != null && path == path.Trim();

            if (AllowSysFolders)
            {
                canBeValid = canBeValid && Path.IsPathRooted(
                    path) && !path.All(
                        c => c == '.' || char.IsWhiteSpace(c)) && !path.ContainsAny(
                            PathH.InvalidPathCharsStr);
            }

            bool isValid = canBeValid;
            rootedPath = path;

            if (isValid)
            {
                if (Path.IsPathRooted(path))
                {
                    isValid = !hasRootDirPath;

                    if (canBeValid && !isValid)
                    {
                        isValid = IsChildPathOf(
                            rootDirPath, path,
                            allowsRootPath, out _);
                    }

                    if (isValid && !AllowSysFolders)
                    {
                        if (Path.GetPathRoot(path) == systemDrivePathRoot)
                        {
                            isValid = IsChildPathOf(
                                userProfilePath, path, false,
                                out string? restOfPath);

                            isValid = isValid && restOfPath.First() != '.' &&
                                restOfPath != appDataDirName && !restOfPath.StartsWith(
                                    appDataChildRelPathStartStr);
                        }
                    }
                }
                else
                {
                    rootedPath = Path.Combine(
                        hasRootDirPath ? rootDirPath : userProfilePath,
                        path);
                }
            }

            return isValid;
        }

        protected bool IsChildPathOf(
            string basePath,
            string trgPath,
            bool allowsEqualToBasePath,
            out string? restOfPath)
        {
            restOfPath = null;
            bool isChildOf = trgPath.StartsWith(basePath);

            if (isChildOf)
            {
                string restOfPathStr = trgPath.Substring(
                    basePath.Length);

                string trimmedRestOfPath = PathTrimStart(
                    restOfPathStr);

                bool restOfPathIsEmpty = string.IsNullOrWhiteSpace(
                    trimmedRestOfPath);

                if (restOfPathIsEmpty)
                {
                    isChildOf = allowsEqualToBasePath;
                }
                else
                {
                    isChildOf = restOfPathStr.First() == Path.DirectorySeparatorChar;
                }

                if (isChildOf)
                {
                    restOfPath = trimmedRestOfPath;
                }
            }

            return isChildOf;
        }

        private string PathTrimStart(
            string path) => path.TrimStart(
            Path.DirectorySeparatorChar,
            Path.AltDirectorySeparatorChar,
            '.', ' ');
    }
}
