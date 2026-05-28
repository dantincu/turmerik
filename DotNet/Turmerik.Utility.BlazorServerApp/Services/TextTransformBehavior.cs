using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;
using Turmerik.Jint.Behavior;
using Turmerik.Utility.BlazorServerApp.Models;

namespace Turmerik.Utility.BlazorServerApp.Services
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
            TextTransformBehaviorDataMtbl members)
        {
            NormalizeData(members);
            return new TextTransformBehaviorDataImmtbl(members);
        }

        private void NormalizeData(TextTransformBehaviorDataMtbl data)
        {
            if (data.TextTransformers == null) return;
            foreach (var node in data.TextTransformers)
            {
                NormalizeNode(node);
            }
        }

        private void NormalizeNode(TextTransformNodeMtbl node)
        {
            NormalizeItemsList(node.TextTransformItems, false);
            NormalizeItemsList(node.RichTextTransformItems, true);
        }

        private void NormalizeItemsList(List<TextTransformItemMtbl>? itemsList, bool transformsRichText)
        {
            if (itemsList == null) return;
            foreach (var item in itemsList)
            {
                item.TransformsRichText = transformsRichText;
            }
        }
    }
}
