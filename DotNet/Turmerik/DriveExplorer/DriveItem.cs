using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public enum OfficeLikeFileType
    {
        Docs = 1,
        Sheets,
        Slides
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

    public class DriveItem
    {
        private string path;

        private DateTime? creationTime;
        private DateTime? lastAccessTime;
        private DateTime? lastWriteTime;

        private DriveItem? parentFolder;

        public string Id { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public bool? IsFolder { get; set; }
        public string FileNameExtension { get; set; }
        public bool? IsRootFolder { get; set; }

        public string CreationTimeStr { get; set; }
        public string LastAccessTimeStr { get; set; }
        public string LastWriteTimeStr { get; set; }
        public FileType? FileType { get; set; }
        public OfficeLikeFileType? OfficeLikeFileType { get; set; }
        public bool? IsTextFile { get; set; }
        public bool? IsImageFile { get; set; }
        public bool? IsVideoFile { get; set; }
        public bool? IsAudioFile { get; set; }
        public string TextFileContent { get; set; }
        public byte[] RawFileContent { get; set; }
        public long? SizeBytesCount { get; set; }
        public string WebUrl { get; set; }

        public List<DriveItem>? SubFolders { get; set; }
        public List<DriveItem>? FolderFiles { get; set; }

        public string GetPath() => path;

        public void SetPath(
            string path) => this.path = path;

        public DriveItem? GetParentFolder() => parentFolder;

        public DriveItem? SetParentFolder(
            DriveItem? parentFolder) => parentFolder;

        public DateTime? GetCreationTime() => creationTime;

        public void SetCreationTime(
            DateTime? creationTime) => this.creationTime = creationTime;

        public DateTime? GetLastAccessTime() => lastAccessTime;

        public void SetLastAccessTime(
            DateTime? lastAccessTime) => this.creationTime = lastAccessTime;

        public DateTime? GetLastWriteTime() => lastWriteTime;

        public void SetLastWriteTime(
            DateTime? lastWriteTime) => this.lastWriteTime = lastWriteTime;
    }
}
