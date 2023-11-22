using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp.Settings
{
    public enum ReopenNoteBookBehaviorType
    {
        Unspecified = 0,
        StartNewSession,
        OpenLastSession
    }

    public interface IAppSettingsData
    {
        ReopenNoteBookBehaviorType? ReopenNoteBookBehaviorType { get; }
    }

    public static class AppSettingsData
    {
        public static AppSettingsDataImmtbl ToImmtbl(
            this IAppSettingsData src) => new AppSettingsDataImmtbl(src);

        public static AppSettingsDataMtbl ToMtbl(
            this IAppSettingsData src) => new AppSettingsDataMtbl(src);
    }
}
