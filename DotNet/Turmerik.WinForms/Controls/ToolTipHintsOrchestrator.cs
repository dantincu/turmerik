using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Turmerik.WinForms.Controls.UISettingsDataCore;
using Turmerik.Core.Helpers;
using Turmerik.Core.Reactive;

namespace Turmerik.WinForms.Controls
{
    public class ToolTipHintsOrchestrator
    {
        private ToolTipDelayImmtbl toolTipDelay;

        public ToolTipHintsOrchestrator(
            ToolTipHintsOrchestratorOpts opts)
        {
            HintGroups = new ReactiveList<ToolTipHintsGroup, Tuple<ToolTipHint, ToolTipHintAction>>();
            ToolTip = opts.ToolTip ?? throw new ArgumentNullException(nameof(ToolTip));

            HintGroups.Action += OnUpdateToolTipText;
        }

        public void UpdateToolTipsText(
            ToolTipHintAction actionData)
        {
            HintGroups.ForEach(hint =>
            {
                hint.UpdateToolTipsText(actionData);
            });
        }

        private void OnUpdateToolTipText(
            Tuple<ToolTipHint, ToolTipHintAction> tuple)
        {
            (var toolTipHint, var actionData) = tuple;

            ToolTip.SetToolTip(
                toolTipHint.Control,
                toolTipHint.ToolTipTextFactory());
        }

        public ReactiveList<ToolTipHintsGroup, Tuple<ToolTipHint, ToolTipHintAction>> HintGroups { get; }
        public ToolTip ToolTip { get; }

        public ToolTipDelayImmtbl ToolTipDelay
        {
            get => toolTipDelay;

            set
            {
                toolTipDelay = value;
                ToolTip.UpdateToolTip(value);
            }
        }
    }
}
