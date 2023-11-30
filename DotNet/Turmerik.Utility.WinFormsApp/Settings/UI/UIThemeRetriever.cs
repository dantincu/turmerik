using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;
using Turmerik.WinForms.Controls;

namespace Turmerik.Utility.WinFormsApp.Settings.UI
{
    public interface IUIThemeRetriever : IAppDataCore<UIThemeDataImmtbl, UIThemeDataSrlzbl>
    {
    }

    public class UIThemeRetriever : AppDataCoreBase<UIThemeDataImmtbl, UIThemeDataSrlzbl>, IUIThemeRetriever
    {
        public UIThemeRetriever(
            IJsonConversion jsonConversion,
            IAppEnv appEnv) : base(
                jsonConversion,
                appEnv)
        {
        }

        protected override UIThemeDataSrlzbl GetDefaultConfigCore(
            ) => UIThemeData.GetDefaultData();

        protected override UIThemeDataImmtbl NormalizeConfig(
            UIThemeDataSrlzbl config)
        {
            UIThemeDataImmtbl retData;

            try
            {
                retData = config.ToMtbl().ToImmtbl();
            }
            catch
            {
                retData = GetDefaultConfig().ToMtbl().ToImmtbl();
            }

            return retData;
        }

        protected override UIThemeDataSrlzbl SerializeConfig(
            UIThemeDataImmtbl config) => new UIThemeDataSrlzbl(config);
    }
}
