using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public static class NoteDirsPairSettingsH
    {
        public static NoteDirsPairSettingsImmtbl ToImmtbl(
            this NoteDirsPairSettingsMtbl src) => new NoteDirsPairSettingsImmtbl(src);

        public static NoteDirsPairSettingsImmtbl.PrefixesT ToImmtbl(
            this NoteDirsPairSettingsMtbl.PrefixesT src) => new NoteDirsPairSettingsImmtbl.PrefixesT(src);

        public static NoteDirsPairSettingsImmtbl.ArgOptionsT ToImmtbl(
            this NoteDirsPairSettingsMtbl.ArgOptionsT src) => new NoteDirsPairSettingsImmtbl.ArgOptionsT(src);

        public static NoteDirsPairSettingsImmtbl.DirNamesT ToImmtbl(
            this NoteDirsPairSettingsMtbl.DirNamesT src) => new NoteDirsPairSettingsImmtbl.DirNamesT(src);

        public static NoteDirsPairSettingsImmtbl.FileNamesT ToImmtbl(
            this NoteDirsPairSettingsMtbl.FileNamesT src) => new NoteDirsPairSettingsImmtbl.FileNamesT(src);

        public static NoteDirsPairSettingsImmtbl.FileContentsT ToImmtbl(
            this NoteDirsPairSettingsMtbl.FileContentsT src) => new NoteDirsPairSettingsImmtbl.FileContentsT(src);
    }
}
