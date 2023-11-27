using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static partial class LocalDeviceH
    {
        public static readonly bool IsWinOS = Environment.OSVersion.Platform <= PlatformID.WinCE;
    }
}
