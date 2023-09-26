using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.Text
{
    public static class NormPathH
    {
        public static string LocalDeviceRootedPathUnixToWinStyle(
            string path) => string.Concat(path[1], ':', path.Substring(2));

        public static string RootedPathUnixToWinStyle(
            string path) => path.StartsWith(PathH.NetworkPathRootPfx) switch
            {
                false => LocalDeviceRootedPathUnixToWinStyle(path),
                true => path
            };

        public static string NormRootedPathWinStyle(
            string path) => PathH.WinDriveRegex.IsMatch(path) switch
            {
                false => NormPathCore(path).With(RootedPathUnixToWinStyle),
                true => Path.GetFullPath(path)
            };

        public static string NormPathUnixStyle(
            string path)
        {
            path = NormPath(path);
            path = path.Replace("\\", "/");

            if (PathH.WinDriveRegex.IsMatch(path))
            {
                (var drive,
                    var restOfPath) = path.SplitStr(
                        (str, len) => 2);

                path = string.Concat(
                    '/', drive[0], restOfPath);
            }

            return path;
        }

        public static string NormRootedPath(
            string path) => LocalDeviceH.IsWinOS switch
            {
                false => Path.GetFullPath(path),
                true => NormRootedPathWinStyle(path)
            };

        public static string NormPath(
            string path,
            bool forceUnixStyle) => forceUnixStyle switch
            {
                false => NormPath(path),
                true => NormPathUnixStyle(path),
            };

        public static string NormPath(
            string path) => Path.IsPathRooted(path) switch
            {
                false => NormPathCore(path),
                true => NormRootedPath(path)
            };

        /// <summary>
        /// StrPrnPnt stands for "starting parent pointers"
        /// </summary>
        /// <param name="path"></param>
        /// <param name="strPrnPntCount"></param>
        /// <returns></returns>
        public static string NormPathCore(string path)
        {
            var partsArr = TrimAndSplitByDirSepChars(path);

            var partsList = partsArr.Where(
                part => part != ".").ToList();

            int strPrnPntCount = RemPrnPnt(partsList);

            if (strPrnPntCount > 0)
            {
                var stPrPnArr = Enumerable.Range(
                    0, strPrnPntCount).Select(
                        idx => "..").ToArray();

                partsList.InsertRange(0, stPrPnArr);
            }

            string retPath = StringH.JoinNotNullStr(
                PathH.DirSepChar,
                partsList.ToArray(),
                false);

            retPath = retPath.TrimEnd('/', '\\');
            return retPath;
        }

        public static int RemPrnPnt(
            List<string> partsList)
        {
            int i = 0;
            int startingPointersToParent = 0;
            int count = partsList.Count;

            while (i < count)
            {
                var part = partsList[i];

                if (part == "..")
                {
                    if (i > startingPointersToParent)
                    {
                        partsList.RemoveRange(i - 1, 2);
                        count -= 2;
                    }
                    else
                    {
                        i++;
                        startingPointersToParent++;
                    }
                }
                else if (part.LastOrDefault() == '.')
                {
                    ThrowInvalidPathEntryName(part);
                }
                else
                {
                    i++;
                }
            }

            partsList.RemoveRange(0, startingPointersToParent);
            return startingPointersToParent;
        }

        public static string[] TrimAndSplitByDirSepChars(
            string path) => path.Split(
                Path.DirectorySeparatorChar,
                Path.AltDirectorySeparatorChar).Select(
                part => part.Trim()).ToArray();

        public static void ThrowInvalidPathEntryName(
            string pathPart) => throw new FormatException(
                $"Invalid path entry name: {pathPart}");
    }
}
