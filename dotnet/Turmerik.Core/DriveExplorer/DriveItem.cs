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
        public string TextFileContent { get; set; }
        public byte[] RawFileContent { get; set; }
        public List<DriveItem> SubFolders { get; set; }
        public List<DriveItem> FolderFiles { get; set; }
    }

    public class DriveItemPutOp : DriveItem
    {
        public DriveItemOp? DriveItemOp { get; set; }
        public List<DriveItemPutOp> MultipleItems { get; set; }
        public DriveItemNameMacro NameMacro { get; set; }
    }

    public class DriveItemNameMacro
    {
        public Guid? MacroUuid { get; set; }
        public string MacroName { get; set; }
        public string MacroDescription { get; set; }
        public string EntryName { get; set; }
        public string SrcName { get; set; }
        public string ConstName { get; set; }
        public char? SrcNameFirstLetterWrappingChar { get; set; }
        public int? NumberSeed { get; set; }
        public int? MinNumber { get; set; }
        public int? MaxNumber { get; set; }
        public bool? IncrementNumber { get; set; }
        public int? DigitsCount { get; set; }
        public string PreceedingDelimiter { get; set; }
        public Guid? PreceedingMacroUuid { get; set; }
        public string SucceedingDelimiter { get; set; }
        public Guid? SucceedingMacroUuid { get; set; }
    }
}
