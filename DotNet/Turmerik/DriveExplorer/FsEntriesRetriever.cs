using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.FileSystem;
using Turmerik.Text;
using Turmerik.Utility;

namespace Turmerik.DriveExplorer
{
    public interface IFsEntriesRetriever : IDriveItemsRetriever
    {
    }

    public class FsEntriesRetriever : DriveItemsRetrieverBase, IFsEntriesRetriever
    {
        public FsEntriesRetriever(ITimeStampHelper timeStampHelper) : base(timeStampHelper)
        {
        }

        public override async Task<DriveItem> GetItemAsync(string idnf)
        {
            DriveItem item;

            if (Directory.Exists(idnf))
            {
                item = await GetFolderAsync(idnf);
            }
            else if (File.Exists(idnf))
            {
                item = await GetFileAsync(idnf);
            }
            else
            {
                item = null;
            }

            return item;
        }

        public override async Task<DriveItem> GetFolderAsync(
            string idnf)
        {
            var folderPath = idnf;
            var entry = new DirectoryInfo(folderPath);
            var folder = GetDriveItem(entry, false);

            var driveItemsArr = entry.EnumerateFileSystemInfos(
                ).Select(fi => GetDriveItem(fi, true)).ToArray();

            folder.SubFolders = new List<DriveItem>(
                driveItemsArr.Where(
                    item => item.IsFolder == true));

            folder.FolderFiles = new List<DriveItem>(
                driveItemsArr.Where(
                    item => item.IsFolder != true).ToList());

            return folder;
        }

        public override async Task<bool> ItemExistsAsync(
            string idnf) => await FileExistsAsync(
                idnf) || await FolderExistsAsync(idnf);

        public override async Task<bool> FolderExistsAsync(
            string idnf) => Directory.Exists(idnf);

        public override async Task<bool> FileExistsAsync(
            string idnf) => File.Exists(idnf);

        public override string GetItemIdnf<TDriveItem>(
            TDriveItem item,
            string prIdnf)
        {
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
            using var reader = new StreamReader(idnf);
            var text = await reader.ReadToEndAsync();

            return text;
        }

        public override Task<byte[]> GetFileBytesAsync(
            string idnf) => FsH.ReadAllBytesAsync(idnf);

        protected async Task<DriveItem> GetFileAsync(
            string idnf)
        {
            var fSysInfo = new FileInfo(idnf);
            var item = GetDriveItem(fSysInfo, false);

            return item;
        }

        protected DriveItem GetDriveItem(
            FileSystemInfo fSysInfo,
            bool isChildItem)
        {
            var fsItem = new DriveItem
            {
                Name = fSysInfo.Name,
            };

            if (fSysInfo is DirectoryInfo dirInfo)
            {
                if (!isChildItem)
                {
                    fsItem.IsFolder = true;
                }
            }
            else if (fSysInfo is FileInfo fInfo)
            {
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

        protected override char GetDirSeparator() => Path.DirectorySeparatorChar;
    }
}
