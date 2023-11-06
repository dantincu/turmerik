using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Notes.AspNetCore.Settings
{
    public class AppConfigCoreMtbl
    {
        public bool IsDevEnv { get; set; }
        public int RequiredClientVersion { get; set; }
        public string ClientRedirectUrl { get; set; }
        public NoteDirsPairConfigMtbl NoteDirPairs { get; set; }
    }
}
