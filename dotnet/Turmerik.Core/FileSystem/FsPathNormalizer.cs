using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Infrastucture;

namespace Turmerik.Core.FileSystem
{
    public interface IFsPathNormalizer
    {
        IFsPathNormalizerResult TryNormalizePath(string path,
            bool? isUnixStyle = null,
            bool allowStartWithLinkToParent = false);
    }

    public class FsPathNormalizer : IFsPathNormalizer
    {
        public IFsPathNormalizerResult TryNormalizePath(
            string path,
            bool? isUnixStyle = null,
            bool allowStartWithLinkToParent = false)
        {
            var mtbl = new FsPathNormalizerResultMtbl
            {
                IsUnixStyle = isUnixStyle,
                IsValid = true
            };

            var rootParts = new List<SplitStrTuple>();
            var partsList = GetPathPartsList(path, mtbl, rootParts);

            TryNormalizePathPartsList(mtbl, rootParts, partsList, allowStartWithLinkToParent);
            TryNormalizePathCore(mtbl, rootParts, partsList);

            var immtbl = new FsPathNormalizerResultImmtbl(mtbl);
            return immtbl;
        }

        private List<SplitStrTuple> GetPathPartsList(
            string path,
            FsPathNormalizerResultMtbl mtbl,
            List<SplitStrTuple> rootParts)
        {
            path = path?.Trim() ?? string.Empty;
            var partsList = path.SplitStr(new char[] { '/', '\\' }, true);

            int partsListCount = partsList.Count;
            mtbl.IsAbsUri = null;

            (var first, var second, var third) = GetFirstThreeParts(
                partsList, partsListCount);

            if (first != null)
            {
                if (string.IsNullOrEmpty(first.Str)) // Starts with / or \
                {
                    if (IsNotNullEmptyEqWith(second, first)) // Starts with // or \\
                    {
                        mtbl.IsRooted = true;
                        ExtractItems(rootParts, partsList, 2);

                        if (first.Chr == '/' && mtbl.IsUnixStyle != false) // Starts with //
                        {
                            mtbl.IsUnixStyle = true;
                        }
                        else if (first.Chr == '\\' && mtbl.IsUnixStyle != true) // Starts with \\
                        {
                            mtbl.IsUnixStyle = false;
                        }

                        if (IsNotNullEmptyEqWith(third, second)) // Starts with /// or \\\
                        {
                            ExtractItems(rootParts, partsList, 1);
                        }
                    }
                    else if (first.Chr == '/' && mtbl.IsUnixStyle != false) // Starts with /
                    {
                        if (second.Str.Any(c => c != '.')) // Starts with smth like /asdf
                        {
                            mtbl.IsRooted = true;
                            mtbl.IsUnixStyle = true;

                            ExtractItems(rootParts, partsList, 2);
                        }
                        else if (second.Str != ".")
                        {
                            mtbl.IsValid = false;
                        }
                    }
                }
                else if (IsUriSchemeLike(first.Str)) // Starts with smth like asdf: or C: or c:
                {
                    if (mtbl.IsUnixStyle != true && IsWinDriveLetter(first.Str)) // Starts with smth like C: or c:
                    {
                        mtbl.IsUnixStyle = false;
                        mtbl.IsRooted = true;

                        ExtractItems(rootParts, partsList, 1);
                    }
                    else if (first.Chr == '/') // Starts with smth like asdf:/
                    {
                        ExtractItems(rootParts, partsList, 1);

                        if (IsNotNullEmptyEqWith(second, first)) // Starts with smth like asdf://
                        {
                            mtbl.IsAbsUri = true;
                            ExtractItems(rootParts, partsList, 1);

                            if (IsNotNullEmptyEqWith(third, second)) // Starts with smth like asdf:///
                            {
                                ExtractItems(rootParts, partsList, 1);
                            }
                        }
                    }
                }
            }

            return partsList;
        }

        private void TryNormalizePathPartsList(
            FsPathNormalizerResultMtbl mtbl,
            List<SplitStrTuple> rootParts,
            List<SplitStrTuple> partsList,
            bool allowStartWithLinkToParent)
        {
            bool pathIsValid = mtbl.IsValid;
            int idx = 0;

            bool startsWithDirSep = false;

            while (pathIsValid && idx < partsList.Count)
            {
                var part = partsList[idx];

                if (string.IsNullOrEmpty(part.Str))
                {
                    if (idx > 0 || rootParts.Any())
                    {
                        partsList.RemoveAt(idx);
                    }
                    else
                    {
                        idx++;
                        startsWithDirSep = true;
                    }
                }
                else if (part.Str == ".")
                {
                    partsList.RemoveAt(idx);
                }
                else if (part.Str == "..")
                {
                    pathIsValid = allowStartWithLinkToParent || (idx > 1) || (idx == 1 && !startsWithDirSep);

                    if (pathIsValid)
                    {
                        if (idx > 0)
                        {
                            partsList.RemoveRange(idx - 1, 2);
                        }
                        else
                        {
                            idx++;
                        }
                    }
                }
                else if (!string.IsNullOrEmpty(part.Str) && part.Str.All(
                    c => char.IsWhiteSpace(c) || c == '.'))
                {
                    pathIsValid = false;
                }
                else
                {
                    idx++;
                }
            }

            mtbl.IsValid = pathIsValid;
        }

        private void TryNormalizePathCore(
            FsPathNormalizerResultMtbl mtbl,
            List<SplitStrTuple> rootParts,
            List<SplitStrTuple> partsList)
        {
            if (mtbl.IsValid)
            {
                var allParts = rootParts.Concat(partsList).ToList();

                if (allParts.Any())
                {
                    int idx = 0;
                    bool rm = false;

                    while (idx < allParts.Count)
                    {
                        if (allParts[idx].Str == "..")
                        {
                            if (idx > 0)
                            {
                                allParts.RemoveRange(idx - 1, 2);
                                rm = true;
                            }
                        }

                        if (!rm)
                        {
                            idx++;
                            rm = false;
                        }
                    }

                    char dirSep = Path.DirectorySeparatorChar;

                    if (mtbl.IsUnixStyle == true)
                    {
                        dirSep = '/';
                    }

                    string dirSepStr = dirSep.ToString();

                    string[] partsArr = allParts.Select(
                        p => p.Str).ToArray();

                    mtbl.NormalizedPath = string.Join(dirSepStr, partsArr);
                }
                else
                {
                    mtbl.NormalizedPath = string.Empty;
                }
            }
            else
            {
                mtbl.NormalizedPath = null;
            }
        }

        private bool IsWinDriveLetter(string part)
        {
            bool isWinDvLt = part.Length == 2;
            isWinDvLt = isWinDvLt && part[1] == ':';

            isWinDvLt = isWinDvLt && part[0].IsLatinLetter();
            return isWinDvLt;
        }

        private bool IsUriSchemeLike(string part)
        {
            bool isUriScheme = UriH.UriSchemeRegex.IsMatch(part);
            return isUriScheme;
        }

        private Tuple<SplitStrTuple, SplitStrTuple, SplitStrTuple> GetFirstThreeParts(
            List<SplitStrTuple> partsList,
            int partsListCount)
        {
            SplitStrTuple first = null, second = null, third = null;

            if (partsListCount > 0)
            {
                first = partsList[0];
            }

            if (partsListCount > 1)
            {
                second = partsList[1];
            }

            if (partsListCount > 2)
            {
                third = partsList[2];
            }

            return new Tuple<SplitStrTuple, SplitStrTuple, SplitStrTuple>(
                first, second, third);
        }

        private bool IsNotNullEmptyEqWith(SplitStrTuple trg, SplitStrTuple refn = null)
        {
            bool retVal = trg != null;
            retVal = retVal && string.IsNullOrEmpty(trg.Str);

            if (refn != null)
            {
                retVal = retVal && trg.Chr == refn.Chr;
            }
            
            return retVal;
        }

        private void ExtractItems(
            List<SplitStrTuple> rootParts,
            List<SplitStrTuple> partsList,
            int count)
        {
            for (int i = 0; i < count; i++)
            {
                var extracted = partsList[0];
                partsList.RemoveAt(0);

                rootParts.Add(extracted);
            }
        }
    }
}
