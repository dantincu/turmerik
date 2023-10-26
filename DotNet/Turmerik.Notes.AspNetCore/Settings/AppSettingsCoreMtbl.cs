using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;

namespace Turmerik.Notes.AspNetCore.Settings
{
    public class AppSettingsCoreMtbl
    {
        public string ClientRedirectUrl { get; set; }
        public NoteDirsPairSettingsMtbl NoteDirPairs { get; set; }
    }
}
