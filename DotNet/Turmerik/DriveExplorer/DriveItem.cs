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

        public string Id { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public bool? IsFolder { get; set; }
        public string FileNameExtension { get; set; }
        public bool? IsRootFolder { get; set; }
        public DateTime? CreationTime { get; set; }
        public DateTime? LastAccessTime { get; set; }
        public DateTime? LastWriteTime { get; set; }
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

        public DriveItem? ParentFolder { get; set; }

        public List<DriveItem>? SubFolders { get; set; }
        public List<DriveItem>? FolderFiles { get; set; }

        public string GetPath() => path;

        public void SetPath(
            string path) => this.path = path;

        public DriveItem CloneDeepAsIdnf(
            int upwardDepth = 1,
            int downwardDepth = 1,
            bool assignParentToChildNodes = false)
        {
            var clone = CloneAsIdnf();

            if (upwardDepth > 0)
            {
                clone.ParentFolder = this.ParentFolder?.CloneDeepAsIdnf(
                    upwardDepth - 1, 0);
            }

            if (downwardDepth > 0)
            {
                Func<DriveItem, DriveItem> factory = item =>
                {
                    var retItem = item.CloneDeepAsIdnf(
                        0, downwardDepth);

                    if (assignParentToChildNodes)
                    {
                        retItem.ParentFolder = clone;
                    }

                    return retItem;
                };

                clone.SubFolders = this.SubFolders?.Select(factory).ToList();
                clone.FolderFiles = this.FolderFiles?.Select(factory).ToList();
            }

            return clone;
        }

        public DriveItem CloneDeep(
            int upwardDepth = 1,
            int downwardDepth = 1,
            bool assignParentToChildNodes = false)
        {
            var clone = CloneDeepAsIdnf(
                upwardDepth,
                downwardDepth,
                assignParentToChildNodes);

            MapProps(clone, this, idAndNameOnly: null);

            return clone;
        }

        public DriveItem CloneAsIdnf(
            bool copyChildNodes = false,
            bool copyParent = false) => MapProps(
                new DriveItem(),
                this,
                copyChildNodes,
                copyParent,
                true);

        public DriveItem Clone(
            bool copyChildNodes = false,
            bool copyParent = false) => MapProps(
                new DriveItem(),
                this,
                copyChildNodes,
                copyParent);

        public static DriveItem MapProps(
            DriveItem destnItem,
            DriveItem srcItem,
            bool copyChildNodes = false,
            bool copyParent = false,
            bool? idAndNameOnly = false)
        {
            if (idAndNameOnly.HasValue)
            {
                destnItem.Id = destnItem.Id;
                destnItem.Name = destnItem.Name;
            }

            if (idAndNameOnly != true)
            {
                destnItem.DisplayName = srcItem.DisplayName;
                destnItem.IsFolder = srcItem.IsFolder;
                destnItem.FileNameExtension = srcItem.FileNameExtension;
                destnItem.IsRootFolder = srcItem.IsRootFolder;
                destnItem.CreationTime = srcItem.CreationTime;
                destnItem.LastAccessTime = srcItem.LastAccessTime;
                destnItem.LastWriteTime = srcItem.LastWriteTime;
                destnItem.CreationTimeStr = srcItem.CreationTimeStr;
                destnItem.LastAccessTimeStr = srcItem.LastAccessTimeStr;
                destnItem.LastWriteTimeStr = srcItem.LastWriteTimeStr;
                destnItem.FileType = srcItem.FileType;
                destnItem.OfficeLikeFileType = srcItem.OfficeLikeFileType;
                destnItem.IsTextFile = srcItem.IsTextFile;
                destnItem.IsImageFile = srcItem.IsImageFile;
                destnItem.IsVideoFile = srcItem.IsVideoFile;
                destnItem.IsAudioFile = srcItem.IsAudioFile;
                destnItem.TextFileContent = srcItem.TextFileContent;
                destnItem.RawFileContent = srcItem.RawFileContent;
                destnItem.SizeBytesCount = srcItem.SizeBytesCount;
                destnItem.WebUrl = srcItem.WebUrl;
            }

            if (copyChildNodes)
            {
                destnItem.SubFolders = srcItem.SubFolders;
                destnItem.FolderFiles = srcItem.FolderFiles;
            }

            if (copyParent)
            {
                destnItem.ParentFolder = srcItem.ParentFolder;
            }

            return destnItem;
        }
    }
}
