using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.LocalFileNotes.WinFormsApp.Settings;

namespace Turmerik.LocalFileNotes.WinFormsApp.Data
{
    public interface IAppStateData
    {
    }

    public static class AppStateData
    {
        public static AppStateDataImmtbl ToImmtbl(
            this IAppStateData src) => new AppStateDataImmtbl(src);

        public static AppStateDataMtbl ToMtbl(
            this IAppStateData src) => new AppStateDataMtbl(src);
    }
}
