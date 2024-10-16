using System;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;

namespace Turmerik.Core.Helpers
{
    public static class LocalDeviceH
    {
        public static Lazy<bool> IsWindows { get; } = new(
            () => Environment.OSVersion.Platform <= PlatformID.WinCE);

        public static Lazy<bool> IsWinOS { get; } = new(
            () => RuntimeInformation.IsOSPlatform(OSPlatform.Windows));

        public static Lazy<bool> IsMacOS { get; } = new(
            () => RuntimeInformation.IsOSPlatform(OSPlatform.OSX));

        public static Lazy<bool> IsLinux { get; } = new(
            () => RuntimeInformation.IsOSPlatform(OSPlatform.Linux));
    }
}
