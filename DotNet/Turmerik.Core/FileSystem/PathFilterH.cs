using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.FileSystem
{
    public static class PathFilterH
    {
        public const char WILDCARD_CHAR = '*';

        public static PathSegmentFilter PathSegment(
            IEnumerable<string> strNmrbl) => new PathSegmentFilter(
                strNmrbl.RdnlC());

        public static PathSegmentFilter PathSegment(
            string str,
            char wildcardChar = WILDCARD_CHAR) => PathSegment(
                str.Split(wildcardChar));

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
            char? dirSep = null)
        {
            bool isPathRooted = Path.IsPathRooted(path);
            char dirSepChar = dirSep ?? Path.DirectorySeparatorChar;

            var pathSegments = path.Split(dirSepChar.Arr(),
                StringSplitOptions.RemoveEmptyEntries);

            var pathFilter = PathFilter(
                pathSegments,
                isPathRooted,
                wildcardChar);

            return pathFilter;
        }
    }
}
