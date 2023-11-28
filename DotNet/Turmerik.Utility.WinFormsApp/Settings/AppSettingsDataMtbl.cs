using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Utility.WinFormsApp.Settings
{
    public class AppSettingsDataMtbl : IAppSettingsData
    {
        public AppSettingsDataMtbl()
        {
        }

        public AppSettingsDataMtbl(
            IAppSettingsData src)
        {
            FetchWebResource = src.GetFetchWebResource()?.ToMtbl();
        }

        public AppSettingsData.FetchWebResourceMtbl FetchWebResource { get; set; }

        public AppSettingsData.IFetchWebResource GetFetchWebResource() => FetchWebResource;
    }
}
