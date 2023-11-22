using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Helpers;

namespace Turmerik.LocalFileNotes.WinFormsApp.Data
{
    public partial class UITextContents
    {
        public interface IResetAppData
        {
            string ExplanationText { get; }
            IEnumerable<string> GetExplanation();
        }

        public class ResetAppDataImmtbl : IResetAppData
        {
            public ResetAppDataImmtbl(
                IResetAppData src)
            {
                ExplanationText = src.ExplanationText;
                Explanation = src.GetExplanation()?.RdnlC();
            }

            public string ExplanationText { get; }
            public ReadOnlyCollection<string> Explanation { get; }

            public IEnumerable<string> GetExplanation() => Explanation;
        }

        public class ResetAppDataMtbl : IResetAppData
        {
            public ResetAppDataMtbl()
            {
            }

            public ResetAppDataMtbl(
                IResetAppData src)
            {
                ExplanationText = src.ExplanationText;
                Explanation = src.GetExplanation()?.ToArray();
            }

            public string ExplanationText { get; set; }
            public string[] Explanation { get; set; }

            public IEnumerable<string> GetExplanation() => Explanation;
        }

        public static ResetAppDataImmtbl ToImmtbl(
            this IResetAppData content) => new ResetAppDataImmtbl(content);

        public static ResetAppDataMtbl ToMtbl(
            this IResetAppData content) => new ResetAppDataMtbl(content);
    }
}
