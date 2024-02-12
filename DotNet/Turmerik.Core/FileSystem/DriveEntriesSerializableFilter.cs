﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FileSystem
{
    public class DriveEntriesSerializableFilter
    {
        public List<string> IncludedRelPathRegexes { get; set; }
        public List<string> ExcludedRelPathRegexes { get; set; }

        public static DriveEntriesSerializableFilter IncludeAll() => new DriveEntriesSerializableFilter
        {
            IncludedRelPathRegexes = new List<string> { ".*" }
        };

        public static DriveEntriesSerializableFilter IncludeNone() => new DriveEntriesSerializableFilter
        {
            IncludedRelPathRegexes = new List<string>()
        };
    }
}