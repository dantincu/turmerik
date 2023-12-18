using System.Collections.ObjectModel;
using Turmerik.Notes.Core;

namespace Turmerik.LocalFilesExplorer.AspNetCoreApp.Settings
{
    public class ClientAppConfig
    {
        public string TrmrkPfx { get; init; }
        public bool IsDevEnv { get; init; }
        public int RequiredClientVersion { get; init; }
        public NoteDirsPairConfigImmtbl NoteDirPairs { get; init; }
        public ReadOnlyCollection<char> InvalidFileNameChars { get; init; }
        public string PathSep { get; init; }
        public string AltPathSep { get; init; }
        public bool IsWinOS { get; init; }
    }
}
