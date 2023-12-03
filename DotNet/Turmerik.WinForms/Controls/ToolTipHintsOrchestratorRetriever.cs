using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Dependencies;

namespace Turmerik.WinForms.Controls
{
    public class ToolTipHintsOrchestratorRetriever : SingleInstanceRetrieverBase<ToolTipHintsOrchestrator, ToolTipHintsOrchestrator>
    {
        protected override ToolTipHintsOrchestrator Convert(
            ToolTipHintsOrchestrator inputData) => inputData;
    }
}
