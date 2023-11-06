using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Helpers;
using Turmerik.Text;

namespace Turmerik.DriveExplorer
{
    public interface IFsEntryNameNormalizer
    {
        string NormalizeFsEntryName(
            string title, int maxLength);
    }

    public class FsEntryNameNormalizer : IFsEntryNameNormalizer
    {
        public string NormalizeFsEntryName(
            string title, int maxLength)
        {
            List<char> charsList = new();
            int strLen = title.Length;

            for (int i = 0; i < strLen; i++)
            {
                char chr = title[i];
                char chrToAdd = chr;

                if (PathH.InvalidFileNameChars.Contains(chr))
                {
                    switch (chr)
                    {
                        case '/':
                            chrToAdd = '%';
                            break;
                        default:
                            chrToAdd = default;
                            break;
                    }
                }
                else if (chr != ' ' && char.IsWhiteSpace(chr))
                {
                    chrToAdd = ' ';
                }

                if (chrToAdd != default)
                {
                    charsList.Add(chrToAdd);
                }
            }

            int charsCount = charsList.Count;

            if (charsCount > maxLength)
            {
                charsList.RemoveRange(
                    maxLength,
                    charsCount - maxLength);
            }

            return new string(charsList.ToArray());
        }
    }
}
