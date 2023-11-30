using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public readonly struct RectangleVerticesF
    {
        public RectangleVerticesF(
            PointF topLeftVertix,
            PointF topRightVertix,
            PointF bottomRightVertix,
            PointF bottomLeftVertix)
        {
            TopLeftVertix = topLeftVertix;
            TopRightVertix = topRightVertix;
            BottomRightVertix = bottomRightVertix;
            BottomLeftVertix = bottomLeftVertix;
        }

        public PointF TopLeftVertix { get; }
        public PointF TopRightVertix { get; }
        public PointF BottomRightVertix { get; }
        public PointF BottomLeftVertix { get; }
    }
}
