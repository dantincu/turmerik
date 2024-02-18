using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;
using Turmerik.Jint.Behavior;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public class TextTransformBehavior : AppDynamicBehaviorCoreBase<TextTransformBehaviorDataImmtbl, TextTransformBehaviorDataMtbl>
    {
        public TextTransformBehavior(
            IJsonConversion jsonConversion,
            IAppEnv appEnv,
            AppBehaviorSetupAdapterFactory appBehaviorSetupAdapterFactory) : base(
                jsonConversion,
                appEnv,
                appBehaviorSetupAdapterFactory)
        {
        }

        protected override TextTransformBehaviorDataImmtbl NormalizeExportedMembers(
            TextTransformBehaviorDataMtbl members) => new TextTransformBehaviorDataImmtbl(members);
    }
}
