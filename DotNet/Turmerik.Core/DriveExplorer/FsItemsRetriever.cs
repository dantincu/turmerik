using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.FileManager;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public interface IFsItemsRetriever : IDriveItemsRetriever
    {
    }

    public class FsItemsRetriever : DriveItemsRetrieverBase, IFsItemsRetriever
    {
        protected readonly IFsManagerGuard FsManagerGuard;

        private readonly IPascalOrCamelCaseToWordsConverter pascalOrCamelCaseToWordsConverter;

        public FsItemsRetriever(
            IFsManagerGuard fsManagerGuard,
            ITimeStampHelper timeStampHelper,
            IPascalOrCamelCaseToWordsConverter pascalOrCamelCaseToWordsConverter) : base(
                timeStampHelper)
        {
            this.FsManagerGuard = fsManagerGuard ?? throw new ArgumentNullException(
                nameof(fsManagerGuard));

            this.pascalOrCamelCaseToWordsConverter = pascalOrCamelCaseToWordsConverter ?? throw new ArgumentNullException(
                nameof(pascalOrCamelCaseToWordsConverter));
        }

        public override async Task<DriveItem> GetItemAsync(
            string idnf, bool? retMinimalInfo)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, true, out var filePath);
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

            if (!FsManagerGuard.AllowSysFolders)
            {
                if (FsManagerGuard.AllowNonSysDrives)
                {
                    drivesList.RemoveWhere(
                        drive => drive.DriveType == DriveType.Fixed && drive.Name == FileManager.FsManagerGuard.UserProfilePathRoot);
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

            if (!FsManagerGuard.AllowSysFolders)
            {
                DriveItem rootDir;

                if (FsManagerGuard.HasRootDirPath)
                {
                    rootDir = GetDriveItem(
                        new DirectoryInfo(FsManagerGuard.RootDirPath));
                }
                else
                {
                    rootDir = GetDriveItem(
                        new DirectoryInfo(FileManager.FsManagerGuard.UserProfilePath));

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

            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, true, out var folderPath);

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
            string idnf) => FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(
                idnf, true, out var folderPath) && Directory.Exists(folderPath);

        public override async Task<bool> FileExistsAsync(
            string idnf) => FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(
                idnf, false, out var filePath) && File.Exists(filePath);

        public override string GetItemIdnf<TDriveItem>(
            TDriveItem item,
            string prIdnf)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(prIdnf, true, out _);

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
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var filePath);

            using var reader = new StreamReader(filePath);
            var text = await reader.ReadToEndAsync();

            return text;
        }

        public override Task<byte[]> GetFileBytesAsync(
            string idnf)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var filePath);

            var bytesArr = FsH.ReadAllBytesAsync(filePath);
            return bytesArr;
        }

        protected async Task<DriveItem> GetFileAsync(
            string idnf)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var filePath);

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
    }
}
