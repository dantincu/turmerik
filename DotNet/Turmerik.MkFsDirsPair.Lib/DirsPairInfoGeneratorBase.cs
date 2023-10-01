using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.DriveExplorer;

namespace Turmerik.MkFsDirsPair.Lib
{
    public abstract class DirsPairInfoGeneratorBase
    {
        public const char ENTRY_NAME_SPECIAL_CHAR = '?';
        public const int FILE_NAME_MAX_LENGTH = 100;

        protected static readonly char[] InvalidFileNameChars = Path.GetInvalidFileNameChars();
        protected static readonly char[] MiscWsChars = new char[] { '\n', '\r', '\t' };
        protected readonly string[] TextFileExtensions = new string[] { ".md", ".keep", ".json", ".txt" };

        protected readonly INoteDirsPairFullNamePartRetriever NoteDirsPairFullNamePartRetriever;

        protected DirsPairInfoGeneratorBase(
            INoteDirsPairFullNamePartRetriever noteDirsPairFullNamePartRetriever)
        {
            NoteDirsPairFullNamePartRetriever = noteDirsPairFullNamePartRetriever ?? throw new ArgumentNullException(nameof(noteDirsPairFullNamePartRetriever));
        }

        protected string NormalizeFileName(
            string fileName,
            out string docTitle,
            char altSpaceChar = ':',
            int? fileNameMaxLength = null) => NoteDirsPairFullNamePartRetriever.GetNoteDirFullNamePart(
                fileName, out docTitle, altSpaceChar, fileNameMaxLength ?? FILE_NAME_MAX_LENGTH);

        protected string GetFileContents(
            string docFileName,
            string docTitle)
        {
            string docFileContents = null;

            if (docFileName != null)
            {
                string docFileNameExtn = Path.GetExtension(docFileName);

                if (TextFileExtensions.Contains(docFileNameExtn))
                {
                    docFileContents = $"# {docTitle}  \n\n";
                }
            }
            
            return docFileContents;
        }
    }
}
