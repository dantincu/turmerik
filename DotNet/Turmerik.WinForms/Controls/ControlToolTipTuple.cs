using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public class ControlToolTipTuple
    {
        public ControlToolTipTuple(
            Control control,
            string toolTip)
        {
            Control = control ?? throw new ArgumentNullException(nameof(control));
            ToolTip = toolTip ?? throw new ArgumentNullException(nameof(toolTip));
        }

        public Control Control { get; }
        public string ToolTip { get; }
    }
}
