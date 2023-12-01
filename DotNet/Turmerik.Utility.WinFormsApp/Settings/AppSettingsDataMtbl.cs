using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Utility.WinFormsApp.Settings.UI;

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
            UISettings = src.GetUISettings()?.ToMtbl();
            FetchWebResource = src.GetFetchWebResource()?.ToMtbl();
            NameToIdnfConverter = src.GetNameToIdnfConverter()?.ToMtbl();
            TextToMd = src.GetTextToMd()?.ToMtbl();
        }

        public UISettingsDataMtbl UISettings { get; set; }

        public AppSettingsData.FetchWebResourceMtbl FetchWebResource { get; set; }
        public AppSettingsData.NameToIdnfConverterMtbl NameToIdnfConverter { get; set; }
        public AppSettingsData.TextToMdMtbl TextToMd { get; set; }

        public IUISettingsData GetUISettings() => UISettings;

        public AppSettingsData.IFetchWebResource GetFetchWebResource() => FetchWebResource;
        public AppSettingsData.INameToIdnfConverter GetNameToIdnfConverter() => NameToIdnfConverter;
        public AppSettingsData.ITextToMd GetTextToMd() => TextToMd;
    }
}
