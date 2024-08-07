using System;
using System.Collections.Generic;
using System.Text;

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
    public bool? IsSpecialFolder { get; set; }

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
