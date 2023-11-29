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
            NameToIdnfConverter = src.GetNameToIdnfConverter()?.ToMtbl();
        }

        public AppSettingsData.FetchWebResourceMtbl FetchWebResource { get; set; }
        public AppSettingsData.NameToIdnfConverterMtbl NameToIdnfConverter { get; set; }

        public AppSettingsData.IFetchWebResource GetFetchWebResource() => FetchWebResource;
        public AppSettingsData.INameToIdnfConverter GetNameToIdnfConverter() => NameToIdnfConverter;
    }
}
