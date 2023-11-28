using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Utility.WinFormsApp.Settings
{
    public class AppSettingsDataImmtbl : IAppSettingsData
    {
        public AppSettingsDataImmtbl(
            IAppSettingsData src)
        {
            FetchWebResource = src.GetFetchWebResource()?.ToImmtbl();
        }

        public AppSettingsData.FetchWebResourceImmtbl FetchWebResource { get; }

        public AppSettingsData.IFetchWebResource GetFetchWebResource() => FetchWebResource;
    }
}
