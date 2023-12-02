using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Reactive;

namespace Turmerik.WinForms.Controls
{
    public class ToolTipHint : ReactiveObject<Tuple<ToolTipHint, ToolTipHintAction>>
    {
        public ToolTipHint(
            ToolTipHintOpts opts)
        {
            Control = opts.Control ?? throw new ArgumentNullException(
                nameof(Control));

            ToolTipTextFactory = opts.ToolTipTextFactory ?? throw new ArgumentNullException(
                nameof(ToolTipTextFactory));
        }

        public Control Control { get; }
        public Func<string> ToolTipTextFactory { get; }

        public void UpdateToolTipText(
            ToolTipHintAction toolTipHintAction)
        {
            Fire(Tuple.Create(this, toolTipHintAction));
        }
    }
}
