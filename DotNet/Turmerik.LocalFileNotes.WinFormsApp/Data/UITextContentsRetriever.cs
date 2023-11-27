using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Helpers;

namespace Turmerik.LocalFileNotes.WinFormsApp.Data
{
    public class UITextContentsRetriever
    {
        private const string UI_TEXT_CONTENTS_JSON_FILE_NAME = "ui-text-contents.json";

        private readonly IJsonConversion jsonConversion;

        public UITextContentsRetriever(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
            Data = LazyH.Lazy(() => GetDataMtbl().ToImmtbl());
        }

        public Lazy<UITextContentsImmtbl> Data { get; }

        private UITextContentsMtbl GetDataMtbl()
        {
            string json = File.ReadAllText(UI_TEXT_CONTENTS_JSON_FILE_NAME);
            var data = jsonConversion.Adapter.Deserialize<UITextContentsMtbl>(json);

            NormalizeData(data);
            return data;
        }

        private void NormalizeData(
            UITextContentsMtbl data)
        {
            NormalizeData(data.Settings);
        }

        private void NormalizeData(
            UITextContents.SettingsMtbl data)
        {
            NormalizeData(data.ResetAppData);
        }

        private void NormalizeData(
            UITextContents.ResetAppDataMtbl data)
        {
            data.ExplanationText ??= JoinTextParts(
                data.Explanation);
        }

        private string JoinTextParts(
            string[] textParts,
            string? joinStr = null) => string.Join(
                joinStr ?? string.Empty,
                textParts);
    }
}
