using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Turmerik.MkFsDirsPair.Lib
{
    public abstract class DirsPairInfoGeneratorBase
    {
        public const char ENTRY_NAME_SPECIAL_CHAR = '?';
        public const int FILE_NAME_MAX_LENGTH = 100;

        protected static readonly char[] InvalidFileNameChars = Path.GetInvalidFileNameChars();
        protected static readonly char[] MiscWsChars = new char[] { '\n', '\r', '\t' };
        protected readonly string[] TextFileExtensions = new string[] { ".md", ".keep", ".json", ".txt" };

        protected string NormalizeFileName(
            string fileName,
            out string docTitle,
            bool normalizeDocTitle = false,
            int? fileNameMaxLength = null)
        {
            docTitle = NormalizeDocTitleIfReq(
                fileName, normalizeDocTitle);

            fileName = docTitle.Replace(
                ':', ' ').Replace(
                "/", "%").Replace(
                "\\", "%");

            fileName = string.Join("",
                fileName.Split(InvalidFileNameChars));

            fileName = string.Join(" ",
                fileName.Split(MiscWsChars,
                    StringSplitOptions.RemoveEmptyEntries));

            if (fileName.Length > (fileNameMaxLength ?? FILE_NAME_MAX_LENGTH))
            {
                fileName = fileName.Substring(0,
                    fileNameMaxLength ?? FILE_NAME_MAX_LENGTH);
            }

            return fileName;
        }

        protected string NormalizeDocTitleIfReq(
            string docTitle,
            bool normalizeDocTitle)
        {
            if (normalizeDocTitle)
            {
                docTitle = NormalizeDocTitle(docTitle);
            }

            return docTitle;
        }

        protected string NormalizeDocTitle(
            string docTitle)
        {
            List<char> charsList = new();
            char prevC = default;

            foreach (char chr in docTitle)
            {
                char newPrevChar = chr;

                if (chr == ':')
                {
                    if (prevC == ':')
                    {
                        charsList.Add(chr);
                        newPrevChar = default;
                    }
                }
                else if (prevC == ':')
                {
                    charsList.Add(' ');
                }
                else
                {
                    charsList.Add(chr);
                }

                prevC = newPrevChar;
            }

            docTitle = new string(
                charsList.ToArray());

            return docTitle;
        }

        protected string GetFileContents(
            string docFileName,
            string docTitle)
        {
            string docFileContents = string.Empty;
            string docFileNameExtn = Path.GetExtension(docFileName);

            if (TextFileExtensions.Contains(docFileNameExtn))
            {
                docFileContents = $"# {docTitle}  \n\n";
            }

            return docFileContents;
        }
    }
}
