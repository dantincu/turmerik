using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.FileSystem
{
    public static class PathFilterH
    {
        public const char WILDCARD_CHAR = '*';

        public static readonly ReadOnlyCollection<char> PathSeparators = '\\'.Arr('/').RdnlC();

        public static PathSegmentFilter PathSegment(
            IEnumerable<string> strNmrbl) => new PathSegmentFilter(
                strNmrbl.RdnlC());

        public static PathSegmentFilter PathSegment(
            string str,
            char wildcardChar = WILDCARD_CHAR)
        {
            var strParts = str.Split(wildcardChar);
            var segment = PathSegment(strParts);

            return segment;
        }

        public static PathFilter PathFilter(
            IEnumerable<PathSegmentFilter> segmentsNmrbl,
            bool isPathRooted = false) => new PathFilter(
                segmentsNmrbl.RdnlC(),
                isPathRooted);

        public static PathFilter PathFilter(
            IEnumerable<IEnumerable<string>> strMx,
            bool isPathRooted = false) => PathFilter(
                strMx.Select(PathSegment),
                isPathRooted);

        public static PathFilter PathFilter(
            IEnumerable<string> strMx,
            bool isPathRooted = false,
            char wildcardChar = WILDCARD_CHAR) => PathFilter(
                strMx.Select(str => PathSegment(str, wildcardChar)),
                isPathRooted);

        public static PathFilter PathFilter(
            string path,
            char wildcardChar = WILDCARD_CHAR,
            IEnumerable<char>? dirSepArr = null)
        {
            bool isPathRooted = Path.IsPathRooted(path);
            dirSepArr ??= PathSeparators;

            var pathSegments = path.Split(dirSepArr.ToArray(),
                StringSplitOptions.RemoveEmptyEntries);

            var pathFilter = PathFilter(
                pathSegments,
                isPathRooted,
                wildcardChar);

            return pathFilter;
        }
    }
}
