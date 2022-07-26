using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDriveItem
    {
        string Id { get; }
        string Name { get; }
        string ParentFolderId { get; }
        bool? IsFolder { get; }
        string FileNameExtension { get; }
        bool? IsRootFolder { get; }
        DateTime? CreationTime { get; }
        DateTime? LastAccessTime { get; }
        DateTime? LastWriteTime { get; }
        string CreationTimeStr { get; }
        string LastAccessTimeStr { get; }
        string LastWriteTimeStr { get; }
        OfficeLikeFileType? OfficeLikeFileType { get; }
        bool? IsTextFile { get; }
        bool? IsImageFile { get; }
        bool? IsVideoFile { get; }
        bool? IsAudioFile { get; }
        string TextFileContent { get; }
        byte[] RawFileContent { get; }
        long? SizeBytesCount { get; }

        IDriveItem[] GetSubFolders();
        IDriveItem[] GetFolderFiles();
    }

    public class DriveItemImmtbl : IDriveItem
    {
        public DriveItemImmtbl(IDriveItem src)
        {
            this.Id = src.Id;
            this.Name = src.Name;
            this.ParentFolderId = src.ParentFolderId;
            this.IsFolder = src.IsFolder;
            this.FileNameExtension = src.FileNameExtension;
            this.IsRootFolder = src.IsRootFolder;
            this.CreationTime = src.CreationTime;
            this.LastAccessTime = src.LastAccessTime;
            this.LastWriteTime = src.LastWriteTime;
            this.CreationTimeStr = src.CreationTimeStr;
            this.LastAccessTimeStr = src.LastAccessTimeStr;
            this.LastWriteTimeStr = src.LastWriteTimeStr;
            this.OfficeLikeFileType = src.OfficeLikeFileType;
            this.IsTextFile = src.IsTextFile;
            this.IsImageFile = src.IsImageFile;
            this.IsVideoFile = src.IsVideoFile;
            this.IsAudioFile = src.IsAudioFile;
            this.TextFileContent = src.TextFileContent;
            this.RawFileContent = src.RawFileContent;
            this.SizeBytesCount = src.SizeBytesCount;

            this.SubFolders = src.GetSubFolders()?.Select(
                item => new DriveItemImmtbl(item)).RdnlC();

            this.FolderFiles = src.GetFolderFiles()?.Select(
                item => new DriveItemImmtbl(item)).RdnlC();
        }

        public string Id { get; }
        public string Name { get; }
        public string ParentFolderId { get; }
        public bool? IsFolder { get; }
        public string FileNameExtension { get; }
        public bool? IsRootFolder { get; }
        public DateTime? CreationTime { get; }
        public DateTime? LastAccessTime { get; }
        public DateTime? LastWriteTime { get; }
        public string CreationTimeStr { get; }
        public string LastAccessTimeStr { get; }
        public string LastWriteTimeStr { get; }
        public OfficeLikeFileType? OfficeLikeFileType { get; }
        public bool? IsTextFile { get; }
        public bool? IsImageFile { get; }
        public bool? IsVideoFile { get; }
        public bool? IsAudioFile { get; }
        public string TextFileContent { get; }
        public byte[] RawFileContent { get; }
        public long? SizeBytesCount { get; }

        public ReadOnlyCollection<DriveItemImmtbl> SubFolders { get; }
        public ReadOnlyCollection<DriveItemImmtbl> FolderFiles { get; }

        public IDriveItem[] GetFolderFiles() => this.FolderFiles?.Cast<IDriveItem>().ToArray();
        public IDriveItem[] GetSubFolders() => this.SubFolders?.Cast<IDriveItem>().ToArray();
    }

    public class DriveItemMtbl : IDriveItem
    {
        public DriveItemMtbl()
        {
        }

        public DriveItemMtbl(IDriveItem src)
        {
            this.Id = src.Id;
            this.Name = src.Name;
            this.ParentFolderId = src.ParentFolderId;
            this.IsFolder = src.IsFolder;
            this.FileNameExtension = src.FileNameExtension;
            this.IsRootFolder = src.IsRootFolder;
            this.CreationTime = src.CreationTime;
            this.LastAccessTime = src.LastAccessTime;
            this.LastWriteTime = src.LastWriteTime;
            this.CreationTimeStr = src.CreationTimeStr;
            this.LastAccessTimeStr = src.LastAccessTimeStr;
            this.LastWriteTimeStr = src.LastWriteTimeStr;
            this.OfficeLikeFileType = src.OfficeLikeFileType;
            this.IsTextFile = src.IsTextFile;
            this.IsImageFile = src.IsImageFile;
            this.IsVideoFile = src.IsVideoFile;
            this.IsAudioFile = src.IsAudioFile;
            this.TextFileContent = src.TextFileContent;
            this.RawFileContent = src.RawFileContent;
            this.SizeBytesCount = src.SizeBytesCount;

            this.SubFolders = src.GetSubFolders()?.Select(
                item => new DriveItemMtbl(item)).ToList();

            this.FolderFiles = src.GetFolderFiles()?.Select(
                item => new DriveItemMtbl(item)).ToList();
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public string ParentFolderId { get; set; }
        public bool? IsFolder { get; set; }
        public string FileNameExtension { get; set; }
        public bool? IsRootFolder { get; set; }
        public DateTime? CreationTime { get; set; }
        public DateTime? LastAccessTime { get; set; }
        public DateTime? LastWriteTime { get; set; }
        public string CreationTimeStr { get; set; }
        public string LastAccessTimeStr { get; set; }
        public string LastWriteTimeStr { get; set; }
        public OfficeLikeFileType? OfficeLikeFileType { get; set; }
        public bool? IsTextFile { get; set; }
        public bool? IsImageFile { get; set; }
        public bool? IsVideoFile { get; set; }
        public bool? IsAudioFile { get; set; }
        public string TextFileContent { get; set; }
        public byte[] RawFileContent { get; set; }
        public long? SizeBytesCount { get; set; }

        public List<DriveItemMtbl> SubFolders { get; set; }
        public List<DriveItemMtbl> FolderFiles { get; set; }

        public IDriveItem[] GetFolderFiles() => this.FolderFiles?.Cast<IDriveItem>().ToArray();
        public IDriveItem[] GetSubFolders() => this.SubFolders?.Cast<IDriveItem>().ToArray();
    }
}
