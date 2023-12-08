using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.FileSystem
{
    public class PathFilter
    {
        public PathFilter(
            ReadOnlyCollection<PathSegmentFilter> pathSegments,
            bool isPathRooted)
        {
            PathSegments = pathSegments ?? throw new ArgumentNullException(
                nameof(pathSegments));

            IsPathRooted = isPathRooted;
        }

        public ReadOnlyCollection<PathSegmentFilter> PathSegments { get; }
        public bool IsPathRooted { get; }
    }

    public class PathSegmentFilter
    {
        public PathSegmentFilter(
            ReadOnlyCollection<string> segmentParts)
        {
            SegmentParts = segmentParts ?? throw new ArgumentNullException(nameof(segmentParts));
        }

        public ReadOnlyCollection<string> SegmentParts { get; }
    }
}
