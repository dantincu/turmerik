using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;
using Turmerik.WpfLibrary.Controls;

namespace Turmerik.LocalFileNotes.WpfApp.Settings.UI
{
    public interface IUISettingsRetriever : IAppDataCore<UISettingsDataImmtbl, UISettingsDataMtbl>
    {
    }

    public class UISettingsRetriever : AppDataCoreBase<UISettingsDataImmtbl, UISettingsDataMtbl>, IUISettingsRetriever
    {
        public UISettingsRetriever(
            IJsonConversion jsonConversion,
            IAppEnv appEnv) : base(
                jsonConversion,
                appEnv)
        {
        }

        protected override UISettingsDataMtbl GetDefaultConfigCore(
            ) => UISettingsDataCore.GetDefaultData().With(
                coreMtbl => new UISettingsDataMtbl(coreMtbl));

        protected override UISettingsDataImmtbl NormalizeConfig(
            UISettingsDataMtbl config) => config.ToImmtbl();

        protected override UISettingsDataMtbl SerializeConfig(
            UISettingsDataImmtbl config) => config.ToMtbl();
    }
}
