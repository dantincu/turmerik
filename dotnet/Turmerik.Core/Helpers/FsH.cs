using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class FsH
    {
        public const string FILE_URI_SCHEME = "file://";

        public static bool IsWinDrive(this string path)
        {
            bool isWinDrive = path.LastOrDefault() == ':';
            return isWinDrive;
        }
    }
}
