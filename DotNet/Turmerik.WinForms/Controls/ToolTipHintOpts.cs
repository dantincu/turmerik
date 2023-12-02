using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public class ToolTipHintOpts
    {
        public Control Control { get; set; }
        public Func<string> ToolTipTextFactory { get; set; }
    }
}
