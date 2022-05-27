using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.FsUtils.WinForms.App
{
    public class ControlColorsTuple
    {
        public ControlColorsTuple(
            Color foreColor,
            Color backgroundColor)
        {
            ForeColor = foreColor;
            BackgroundColor = backgroundColor;
        }

        public Color ForeColor { get; set; }
        public Color BackgroundColor { get; set; }
    }
}
