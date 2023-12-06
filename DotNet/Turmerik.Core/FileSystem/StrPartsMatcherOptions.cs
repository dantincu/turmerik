﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FileSystem
{
    public class StrPartsMatcherOptions
    {
        public StrPartsMatcherOptions()
        {
        }

        public StrPartsMatcherOptions(
            StrPartsMatcherOptions src)
        {
            InputStr = src.InputStr;
            StrParts = src.StrParts;
            StringComparison = src.StringComparison;
        }

        public string InputStr { get; set; }
        public string[] StrParts { get; set; }
        public StringComparison? StringComparison { get; set; }
    }
}