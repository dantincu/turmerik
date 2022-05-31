using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Environment;

namespace Turmerik.FileExplorer.WinFormsCore.App
{
    public interface IFsItem
    {
        Guid Uuid { get; }
        string Path { get; }
        string Name { get; }
        string Label { get; }
        bool IsDirectory { get; }
        string FileNameWithoutExtension { get; }
        string FileNameExtension { get; }
        DateTime? CreationTime { get; }
        DateTime? LastAccessTime { get; }
        DateTime? LastWriteTime { get; }
        string CreationTimeStr { get; }
        string LastAccessTimeStr { get; }
        string LastWriteTimeStr { get; }
        bool IsDriveRoot { get; }
        SpecialFolder? SpecialFolder { get; }
    }

    public class FsItemImmtbl : IFsItem
    {
        public FsItemImmtbl(IFsItem src)
        {
            Uuid = src.Uuid;
            Path = src.Path;
            Name = src.Name;
            Label = src.Label;
            IsDirectory = src.IsDirectory;
            FileNameWithoutExtension = src.FileNameWithoutExtension;
            FileNameExtension = src.FileNameExtension;
            CreationTime = src.CreationTime;
            LastAccessTime = src.LastAccessTime;
            LastWriteTime = src.LastWriteTime;
            CreationTimeStr = src.CreationTimeStr;
            LastAccessTimeStr = src.LastAccessTimeStr;
            LastWriteTimeStr = src.LastWriteTimeStr;
            IsDriveRoot = src.IsDriveRoot;
            SpecialFolder = src.SpecialFolder;
        }

        public Guid Uuid { get; }
        public string Path { get; }
        public string Name { get; }
        public string Label { get; }
        public bool IsDirectory { get; }
        public string FileNameWithoutExtension { get; }
        public string FileNameExtension { get; }
        public DateTime? CreationTime { get; }
        public DateTime? LastAccessTime { get; }
        public DateTime? LastWriteTime { get; }
        public string CreationTimeStr { get; }
        public string LastAccessTimeStr { get; }
        public string LastWriteTimeStr { get; }
        public bool IsDriveRoot { get; }
        public SpecialFolder? SpecialFolder { get; }
    }

    public class FsItemMtbl : IFsItem
    {
        public FsItemMtbl()
        {
        }

        public FsItemMtbl(IFsItem src)
        {
            Uuid = src.Uuid;
            Path = src.Path;
            Name = src.Name;
            Label = src.Label;
            IsDirectory = src.IsDirectory;
            FileNameWithoutExtension = src.FileNameWithoutExtension;
            FileNameExtension = src.FileNameExtension;
            CreationTime = src.CreationTime;
            LastAccessTime = src.LastAccessTime;
            LastWriteTime = src.LastWriteTime;
            CreationTimeStr = src.CreationTimeStr;
            LastAccessTimeStr = src.LastAccessTimeStr;
            LastWriteTimeStr = src.LastWriteTimeStr;
            IsDriveRoot = src.IsDriveRoot;
            SpecialFolder = src.SpecialFolder;
        }

        public Guid Uuid { get; set; }
        public string Path { get; set; }
        public string Name { get; set; }
        public string Label { get; set; }
        public bool IsDirectory { get; set; }
        public string FileNameWithoutExtension { get; set; }
        public string FileNameExtension { get; set; }
        public DateTime? CreationTime { get; set; }
        public DateTime? LastAccessTime { get; set; }
        public DateTime? LastWriteTime { get; set; }
        public string CreationTimeStr { get; set; }
        public string LastAccessTimeStr { get; set; }
        public string LastWriteTimeStr { get; set; }
        public bool IsDriveRoot { get; set; }
        public SpecialFolder? SpecialFolder { get; set; }
    }
}
