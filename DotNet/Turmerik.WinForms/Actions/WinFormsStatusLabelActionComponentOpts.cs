using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Actions
{
    public class WinFormsStatusLabelActionComponentOpts
    {
        public ToolStripStatusLabel StatusLabel { get; init; }
        public Color DefaultForeColor { get; init; }
        public Color WarningForeColor { get; init; }
        public Color ErrorForeColor { get; init; }
    }
}
