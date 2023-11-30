using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public readonly struct RectangleVertices
    {
        public RectangleVertices(
            Point topLeftVertix,
            Point topRightVertix,
            Point bottomRightVertix,
            Point bottomLeftVertix)
        {
            TopLeftVertix = topLeftVertix;
            TopRightVertix = topRightVertix;
            BottomRightVertix = bottomRightVertix;
            BottomLeftVertix = bottomLeftVertix;
        }

        public Point TopLeftVertix { get; }
        public Point TopRightVertix { get; }
        public Point BottomRightVertix { get; }
        public Point BottomLeftVertix { get; }
    }
}
