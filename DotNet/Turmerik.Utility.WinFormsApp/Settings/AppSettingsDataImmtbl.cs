using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Utility.WinFormsApp.Settings.UI;

namespace Turmerik.Utility.WinFormsApp.Settings
{
    public class AppSettingsDataImmtbl : IAppSettingsData
    {
        public AppSettingsDataImmtbl(
            IAppSettingsData src)
        {
            UISettings = src.GetUISettings()?.ToImmtbl();
            FetchWebResource = src.GetFetchWebResource()?.ToImmtbl();
            NameToIdnfConverter = src.GetNameToIdnfConverter()?.ToImmtbl();
            TextToMd = src.GetTextToMd()?.ToImmtbl();
        }

        public UISettingsDataImmtbl UISettings { get; }

        public AppSettingsData.FetchWebResourceImmtbl FetchWebResource { get; }
        public AppSettingsData.NameToIdnfConverterImmtbl NameToIdnfConverter { get; }
        public AppSettingsData.TextToMdImmtbl TextToMd { get; }

        public IUISettingsData GetUISettings() => UISettings;

        public AppSettingsData.IFetchWebResource GetFetchWebResource() => FetchWebResource;
        public AppSettingsData.INameToIdnfConverter GetNameToIdnfConverter() => NameToIdnfConverter;
        public AppSettingsData.ITextToMd GetTextToMd() => TextToMd;
    }
}
