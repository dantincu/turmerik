using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp.Data
{
    public interface IAppInstanceStateData
    {
    }

    public static class AppInstanceStateData
    {
        public static AppInstanceStateDataImmtbl ToImmtbl(
            this IAppInstanceStateData src) => new AppInstanceStateDataImmtbl(src);

        public static AppInstanceStateDataMtbl ToMtbl(
            this IAppInstanceStateData src) => new AppInstanceStateDataMtbl(src);
    }
}
