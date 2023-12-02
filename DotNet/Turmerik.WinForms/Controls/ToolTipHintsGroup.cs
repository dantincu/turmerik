using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.Reactive;

namespace Turmerik.WinForms.Controls
{
    public class ToolTipHintsGroup : ReactiveObject<Tuple<ToolTipHint, ToolTipHintAction>>
    {
        public ToolTipHintsGroup(
            ToolTipHintsGroupOpts opts)
        {
            Hints = (opts.Hints ?? GetHints(
                opts.HintOpts)).RxC<ToolTipHint, Tuple<ToolTipHint, ToolTipHintAction>>();
        }

        public ReactiveList<ToolTipHint, Tuple<ToolTipHint, ToolTipHintAction>> Hints { get; }

        public override event Action<Tuple<ToolTipHint, ToolTipHintAction>> Action
        {
            add
            {
                base.Action += value;
                Hints.Action += value;
            }

            remove
            {
                base.Action -= value;
                Hints.Action -= value;
            }
        }

        public void UpdateToolTipsText(
            ToolTipHintAction actionData)
        {
            Hints.ForEach(hint =>
            {
                hint.UpdateToolTipText(actionData);
            });
        }

        private List<ToolTipHint> GetHints(
            List<ToolTipHintOpts> hintsNmrbl) => hintsNmrbl.Select(
                hint => new ToolTipHint(hint)).ToList();
    }
}
