using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public partial class DrawingH
    {
        public static void DrawWithRoundedCorners(
            this Graphics g,
            Pen pen,
            Rectangle rctngl,
            float radius,
            float? roundingTension = null)
        {
            var rctnglF = rctngl.ToRectangleF();
            var lng = radius / 6;

            var pt = rctnglF.TopLeftVertixF().AddXF(radius);

            var ls = new PointF[]
            {
                pt,
                pt = pt.AddXF(rctnglF.Width - radius * 2),
                pt = pt.AddF(3 * lng, 1 * lng),
                pt = pt.AddF(2 * lng, 2 * lng),
                pt = pt.AddF(1 * lng, 3 * lng),
                pt = pt.AddYF(rctnglF.Height - radius * 2),
                pt = pt.AddF(-1 * lng, 3 * lng),
                pt = pt.AddF(-2 * lng, 2 * lng),
                pt = pt.AddF(-3 * lng, 1 * lng),
                pt = pt.SubstractXF(rctnglF.Width - radius * 2),
                pt = pt.AddF(-3 * lng, -1 * lng),
                pt = pt.AddF(-2 * lng, -2 * lng),
                pt = pt.AddF(-1 * lng, -3 * lng),
                pt = pt.SubstractYF(rctnglF.Height - radius * 2),
                pt = pt.AddF(1 * lng, -3 * lng),
                pt = pt.AddF(2 * lng, -2 * lng),
                pt = pt.AddF(3 * lng, -1 * lng),
            };

            Action<PointF[]> drawCurveFunc;

            if (roundingTension.HasValue)
            {
                var tension = roundingTension.Value;
                drawCurveFunc = arr => g.DrawCurve(pen, arr, tension);
            }
            else
            {
                drawCurveFunc = arr => g.DrawCurve(pen, arr);
            }

            g.DrawLine(pen, ls[0], ls[1]);
            g.DrawCurve(pen, ls[1..5]);
            g.DrawLine(pen, ls[4], ls[5]);
            g.DrawCurve(pen, ls[5..9]);
            g.DrawLine(pen, ls[8], ls[9]);
            g.DrawCurve(pen, ls[9..13]);
            g.DrawLine(pen, ls[12], ls[13]);
            g.DrawCurve(pen, ls[13..17]);
        }
    }
}
