using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DirsPair
{
    public class DirsPairOpts
    {
        public DirsPairOpts()
        {
        }

        public DirsPairOpts(DirsPairOpts src)
        {
            PrIdnf = src.PrIdnf;
            Title = src.Title;
            SkipMdFileCreation = src.SkipMdFileCreation;
            OpenMdFile = src.OpenMdFile;
            MaxFsEntryNameLength = src.MaxFsEntryNameLength;
            ShortDirName = src.ShortDirName;
            FullDirNamePart = src.FullDirNamePart;
            JoinStr = src.JoinStr;
            MdFileName = src.MdFileName;
            JsonFileName = src.JsonFileName;
            MdFileContentsTemplate = src.MdFileContentsTemplate;
            MdFileFirstContent = src.MdFileFirstContent;
            KeepFileName = src.KeepFileName;
            KeepFileContents = src.KeepFileContents;
            TrmrkGuidInputName = src.TrmrkGuidInputName;
            ThrowIfAnyItemAlreadyExists = src.ThrowIfAnyItemAlreadyExists;
            CreateNote = src.CreateNote;
            CreateNoteSection = src.CreateNoteSection;
            NoteSectionRank = src.NoteSectionRank;
            CreateNoteBook = src.CreateNoteBook;
            CreateNoteInternalsDir = src.CreateNoteInternalsDir;
            CreateNoteFilesDir = src.CreateNoteFilesDir;
        }

        public string PrIdnf { get; set; }
        public string Title { get; set; }
        public bool SkipMdFileCreation { get; set; }
        public bool OpenMdFile { get; set; }
        public bool OpenMdFileAndWatch { get; set; }
        public bool OpenMdFileInteractively { get; set; }
        public int MaxFsEntryNameLength { get; set; }
        public string ShortDirName { get; set; }
        public string FullDirNamePart { get; set; }
        public string JoinStr { get; set; }
        public string MdFileName { get; set; }
        public string JsonFileName { get; set; }
        public string MdFileContentsTemplate { get; set; }
        public string MdFileFirstContent { get; set; }
        public MdLink[]? MdLinksToAddArr { get; set; }
        public string KeepFileName { get; set; }
        public string KeepFileContents { get; set; }
        public string TrmrkGuidInputName { get; set; }
        public bool ThrowIfAnyItemAlreadyExists { get; set; }
        public bool CreateNote { get; set; }
        public bool CreateNoteSection { get; set; }
        public string? NoteSectionRank { get; set; }
        public bool CreateNoteBook { get; set; }
        public bool CreateNoteInternalsDir { get; set; }
        public bool CreateNoteFilesDir { get; set; }
    }
}
