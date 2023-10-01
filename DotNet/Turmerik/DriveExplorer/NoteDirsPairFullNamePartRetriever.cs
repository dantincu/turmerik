using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirsPairFullNamePartRetriever
    {
        string GetNoteDirFullNamePart(
            string title,
            out string normalizedTitle,
            char altSpaceChar = default,
            int? fileNameMaxLength = null);
    }

    public class NoteDirsPairFullNamePartRetriever : INoteDirsPairFullNamePartRetriever
    {
        private static readonly char[] invalidFileNameChars = Path.GetInvalidFileNameChars();
        private static readonly char[] miscWsChars = new char[] { '\n', '\r', '\t' };

        public string GetNoteDirFullNamePart(
            string title,
            out string normalizedTitle,
            char altSpaceChar = default,
            int? fileNameMaxLength = null)
        {
            normalizedTitle = NormalizeDocTitleIfReq(
                title, altSpaceChar);

            string fullNamePart = GetFullNamePartCore(
                normalizedTitle,
                altSpaceChar);

            fullNamePart = string.Join("",
                fullNamePart.Split(invalidFileNameChars));

            fullNamePart = string.Join(" ",
                fullNamePart.Split(miscWsChars,
                    StringSplitOptions.RemoveEmptyEntries));

            if (fileNameMaxLength.HasValue && fullNamePart.Length > (fileNameMaxLength.Value))
            {
                fullNamePart = fullNamePart.Substring(
                    0, fileNameMaxLength.Value);
            }

            return fullNamePart;
        }

        private string GetFullNamePartCore(
            string normalizedTitle,
            char altSpaceChar)
        {
            string fullNamePart = normalizedTitle;

            if (altSpaceChar != default)
            {
                fullNamePart = fullNamePart.Replace(altSpaceChar, ' ');

                fullNamePart = fullNamePart.Replace
                    ("/", "%").Replace("\\", "%");
            }

            return fullNamePart;
        }

        private string NormalizeDocTitleIfReq(
            string title,
            char altSpaceChar)
        {
            if (altSpaceChar != default)
            {
                title = NormalizeTitle(
                    title, altSpaceChar);
            }

            return title;
        }

        private string NormalizeTitle(
            string title,
            char altSpaceChar)
        {
            if (title.Length > 1)
            {
                List<char> charsList = new();
                char prevC = default;

                foreach (char chr in title)
                {
                    char newPrevChar = chr;

                    if (chr == altSpaceChar)
                    {
                        if (prevC == altSpaceChar)
                        {
                            charsList.Add(chr);
                            newPrevChar = default;
                        }
                    }
                    else
                    {
                        if (prevC == altSpaceChar)
                        {
                            charsList.Add(' ');
                        }

                        charsList.Add(chr);
                    }

                    prevC = newPrevChar;
                }

                title = new string(
                    charsList.ToArray());
            }
            else if (title.Length == 1 && title.Single() == altSpaceChar)
            {
                title = " ";
            }

            return title;
        }
    }
}
