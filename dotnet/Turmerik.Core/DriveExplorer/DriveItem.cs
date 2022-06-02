using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.DriveExplorer
{
    public class DriveItem
    {
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
        public List<DriveItem> SubFolders { get; set; }
        public List<DriveItem> FolderFiles { get; set; }
    }
}
