using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public interface IToolTipHintsOrchestratorFactory
    {
        ToolTipHintsOrchestrator Create(
            ToolTipHintsOrchestratorOpts opts);
    }

    public class ToolTipHintsOrchestratorFactory : IToolTipHintsOrchestratorFactory
    {
        public ToolTipHintsOrchestrator Create(
            ToolTipHintsOrchestratorOpts opts) => new ToolTipHintsOrchestrator(opts);
    }
}
