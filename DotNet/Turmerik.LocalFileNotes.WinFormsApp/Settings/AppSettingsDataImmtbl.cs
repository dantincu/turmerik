using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp.Settings
{
    public class AppSettingsDataImmtbl : IAppSettingsData
    {
        public AppSettingsDataImmtbl(
            IAppSettingsData src)
        {
            ReopenNoteBookBehaviorType = src.ReopenNoteBookBehaviorType;
        }

        public ReopenNoteBookBehaviorType? ReopenNoteBookBehaviorType { get; }
    }
}
