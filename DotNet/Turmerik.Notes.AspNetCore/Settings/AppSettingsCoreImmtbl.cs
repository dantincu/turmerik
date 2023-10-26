using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;

namespace Turmerik.Notes.AspNetCore.Settings
{
    public class AppSettingsCoreImmtbl
    {
        public AppSettingsCoreImmtbl(
            AppSettingsCoreMtbl src)
        {
            ClientRedirectUrl = src.ClientRedirectUrl;
            NoteDirPairs = src.NoteDirPairs?.ToImmtbl();
        }

        public string ClientRedirectUrl { get; }
        public NoteDirsPairSettingsImmtbl NoteDirPairs { get; }
    }
}
