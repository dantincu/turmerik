using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Turmerik.Core.DriveExplorer
{
    public enum OfficeFileType
    {
        Word = 1,
        Excel,
        PowerPoint
    }

    public enum FileType
    {
        PlainText = 1,
        Document,
        Image,
        Audio,
        Video,
        Code,
        Binary,
        ZippedFolder
    }

    public interface IDriveItemsRetriever
    {
        Task<DriveItem> GetItemAsync(
            string idnf, bool? retMinimalInfo);

        Task<DriveItem> GetRootFolderAsync(
            bool? retMinimalInfo);

        Task<DriveItem> GetRootFolderAsync(
            int depth, bool? retMinimalInfo);

        Task<DriveItem> GetFolderAsync(
            string idnf, bool? retMinimalInfo);

        Task<DriveItem> GetFolderAsync(
            string idnf, int depth, bool? retMinimalInfo);

        Task<bool> ItemExistsAsync(string idnf);

        Task<bool> FolderExistsAsync(string idnf);

        Task<bool> FileExistsAsync(string idnf);

        Task<string> GetFileTextAsync(string idnf);

        Task<byte[]> GetFileBytesAsync(string idnf);

        string GetItemIdnf<TDriveItem>(
            TDriveItem item,
            string prIdnf)
            where TDriveItem : DriveItem<TDriveItem>;

        char GetDirSeparator();

        char DirSeparator { get; }
    }

    public interface IDriveExplorerService : IDriveItemsRetriever
    {
        Task<string> GetDriveFolderWebUrlAsync(string idnf);
        Task<string> GetDriveFileWebUrlAsync(string idnf);

        Task<DriveItem> CreateFolderAsync(
            string prIdnf,
            string newFolderName,
            bool? retMinimalInfo);

        Task<DriveItem> RenameFolderAsync(
            string idnf,
            string newFolderName,
            bool? retMinimalInfo);

        Task<DriveItem> CopyFolderAsync(
            string idnf,
            string newPrIdnf,
            string newFolderName,
            bool? retMinimalInfo);

        Task<DriveItem> MoveFolderAsync(
            string idnf,
            string newPrIdnf,
            string newFolderName,
            bool? retMinimalInfo);

        Task<DriveItem> DeleteFolderAsync(
            string idnf, bool? retMinimalInfo);

        Task<DriveItem> CreateTextFileAsync(
            string prIdnf, string newFileName, string text);

        Task<DriveItem> CreateOfficeLikeFileAsync(
            string prIdnf,
            string newFileName,
            OfficeFileType officeLikeFileType);

        Task<DriveItem> RenameFileAsync(
            string idnf, string newFileName);

        Task<DriveItem> CopyFileAsync(
            string idnf, string newPrIdnf, string newFileName);

        Task<DriveItem> MoveFileAsync(
            string idnf, string newPrIdnf, string newFileName);

        Task<DriveItem> DeleteFileAsync(
            string idnf);
    }

    public class DriveItemCore
    {
        public DriveItemCore()
        {
        }

        public DriveItemCore(DriveItemCore src)
        {
            Idnf = src.Idnf;
            PrIdnf = src.PrIdnf;
            CsId = src.CsId;
            PrCsId = src.PrCsId;
            PrPath = src.PrPath;
            Name = src.Name;
            DisplayName = src.DisplayName;
            IsFolder = src.IsFolder;
            IsRootFolder = src.IsRootFolder;
            FileType = src.FileType;
            OfficeFileType = src.OfficeFileType;
            IsTextFile = src.IsTextFile;
            IsImageFile = src.IsImageFile;
            IsVideoFile = src.IsVideoFile;
            IsAudioFile = src.IsAudioFile;
            FileSizeBytes = src.FileSizeBytes;
            TextFileContents = src.TextFileContents;
            CreationTime = src.CreationTime;
            LastWriteTime = src.LastWriteTime;
            LastAccessTime = src.LastAccessTime;
            CreationTimeUtcTicks = src.CreationTimeUtcTicks;
            LastWriteTimeUtcTicks = src.LastWriteTimeUtcTicks;
            LastAccessTimeUtcTicks = src.LastAccessTimeUtcTicks;
        }

        public string Idnf { get; set; }
        public string PrIdnf { get; set; }
        public string CsId { get; set; }
        public string PrCsId { get; set; }
        public string PrPath { get; set; }

        public string Name { get; set; }
        public string DisplayName { get; set; }

        public bool? IsFolder { get; set; }
        public bool? IsRootFolder { get; set; }
        public Environment.SpecialFolder? SpecialFolderType { get; set; }

        public FileType? FileType { get; set; }
        public OfficeFileType? OfficeFileType { get; set; }
        public bool? IsTextFile { get; set; }
        public bool? IsImageFile { get; set; }
        public bool? IsVideoFile { get; set; }
        public bool? IsAudioFile { get; set; }
        public long? FileSizeBytes { get; set; }
        public string? TextFileContents { get; set; }

        public DateTime? CreationTime { get; set; }
        public DateTime? LastWriteTime { get; set; }
        public DateTime? LastAccessTime { get; set; }

        public long? CreationTimeUtcTicks { get; set; }
        public long? LastWriteTimeUtcTicks { get; set; }
        public long? LastAccessTimeUtcTicks { get; set; }
    }

    public class DriveItem<TDriveItem> : DriveItemCore
        where TDriveItem : DriveItem<TDriveItem>
    {
        public DriveItem()
        {
        }

        public DriveItem(DriveItemCore src) : base(src)
        {
        }

        public DriveItem(
            DriveItem<TDriveItem> src,
            int depth = 0) : base(src)
        {
            DriveExplorerH.CopyChildren(
                this,
                src.SubFolders,
                src.FolderFiles,
                depth);
        }

        public List<TDriveItem>? SubFolders { get; set; }
        public List<TDriveItem>? FolderFiles { get; set; }
    }
}
