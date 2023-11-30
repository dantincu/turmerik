using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.WinForms.Controls
{
    public static partial class DrawingH
    {
        public static PointF ToPointF(
            this Point point) => new PointF(
                point.X, point.Y);

        public static Point ToPoint(
            this PointF point) => new Point(
                point.X.RoundToInt(),
                point.Y.RoundToInt());

        public static RectangleF ToRectangleF(
            this Rectangle rctngl) => new RectangleF(
                rctngl.X, rctngl.Y, rctngl.Width, rctngl.Height);

        public static Rectangle ToRectangle(
            this RectangleF rctngl) => new Rectangle(
                rctngl.X.RoundToInt(),
                rctngl.Y.RoundToInt(),
                rctngl.Width.RoundToInt(),
                rctngl.Height.RoundToInt());

        public static Point Point(
            this int x,
            int y) => new Point(x, y);

        public static PointF PointF(
            this float x,
            float y) => new PointF(x, y);

        public static Point ToX(
            this Point point,
            int newX) => new Point(
                newX, point.Y);

        public static PointF ToXF(
            this PointF point,
            int newY) => new PointF(
                newY, point.Y);

        public static Point ToY(
            this Point point,
            int newY) => new Point(
                point.X, newY);

        public static PointF ToXF(
            this PointF point,
            float newY) => new PointF(
                point.X, newY);

        public static Point Add(
            this Point point,
            int offsetX,
            int offsetY) => new Point(
                point.X + offsetX,
                point.Y + offsetY);

        public static Point Add(
            this Point point,
            Point offset) => point.Add(
                offset.X, offset.Y);

        public static PointF AddF(
            this PointF point,
            float offsetX,
            float offsetY) => new PointF(
                point.X + offsetX,
                point.Y + offsetY);

        public static PointF AddF(
            this PointF point,
            PointF offset) => point.AddF(
                offset.X, offset.Y);

        public static Point AddX(
            this Point point,
            int offsetX) => new Point(
                point.X + offsetX, point.Y);

        public static PointF AddXF(
            this PointF point,
            float offsetX) => new PointF(
                point.X + offsetX, point.Y);

        public static Point AddY(
            this Point point,
            int offsetY) => new Point(
                point.X, point.Y + offsetY);

        public static PointF AddYF(
            this PointF point,
            float offsetY) => new PointF(
                point.X, point.Y + offsetY);

        public static Point Substract(
            this Point point,
            int offsetX,
            int offsetY) => new Point(
                point.X - offsetX,
                point.Y - offsetY);

        public static Point Substract(
            this Point point,
            Point offset) => Substract(
                point, offset.X, offset.Y);

        public static PointF SubstractF(
            this PointF point,
            float offsetX,
            float offsetY) => new PointF(
                point.X - offsetX,
                point.Y - offsetY);

        public static PointF SubstractF(
            this PointF point,
            PointF offset) => SubstractF(
                point, offset.X, offset.Y);

        public static Point SubstractX(
            this Point point,
            int offsetX) => new Point(
                point.X - offsetX, point.Y);

        public static PointF SubstractXF(
            this PointF point,
            float offsetX) => new PointF(
                point.X - offsetX, point.Y);

        public static Point SubstractY(
            this Point point,
            int offsetY) => new Point(
                point.X, point.Y - offsetY);

        public static PointF SubstractYF(
            this PointF point,
            float offsetY) => new PointF(
                point.X, point.Y - offsetY);

        public static Rectangle Enlarge(
            this Rectangle rctngl,
            Point leftTopOffset,
            Point bottomRightOffset) => new Rectangle(
                rctngl.X - leftTopOffset.X,
                rctngl.Y - leftTopOffset.Y,
                rctngl.Width + leftTopOffset.X + bottomRightOffset.X,
                rctngl.Height + leftTopOffset.Y + bottomRightOffset.Y);

        public static RectangleF EnlargeF(
            this RectangleF rctngl,
            PointF leftTopOffset,
            PointF bottomRightOffset) => new RectangleF(
                rctngl.X - leftTopOffset.X,
                rctngl.Y - leftTopOffset.Y,
                rctngl.Width + leftTopOffset.X + bottomRightOffset.X,
                rctngl.Height + leftTopOffset.Y + bottomRightOffset.Y);

        public static Rectangle Shrink(
            this Rectangle rctngl,
            Point leftTopOffset,
            Point bottomRightOffset) => new Rectangle(
                rctngl.X + leftTopOffset.X,
                rctngl.Y + leftTopOffset.Y,
                rctngl.Width - leftTopOffset.X - bottomRightOffset.X,
                rctngl.Height - leftTopOffset.Y - bottomRightOffset.Y);

        public static RectangleF ShrinkF(
            this RectangleF rctngl,
            PointF leftTopOffset,
            PointF bottomRightOffset) => new RectangleF(
                rctngl.X + leftTopOffset.X,
                rctngl.Y + leftTopOffset.Y,
                rctngl.Width - leftTopOffset.X - bottomRightOffset.X,
                rctngl.Height - leftTopOffset.Y - bottomRightOffset.Y);

        public static Point TopLeftVertix(
            this Rectangle rctngl) => new Point(
                rctngl.X, rctngl.Y);

        public static PointF TopLeftVertixF(
            this RectangleF rctngl) => new PointF(
                rctngl.X, rctngl.Y);

        public static Point TopRightVertix(
            this Rectangle rctngl) => new Point(
                rctngl.X, rctngl.Y + rctngl.Height);

        public static PointF TopRightVertixF(
            this RectangleF rctngl) => new PointF(
                rctngl.X, rctngl.Y + rctngl.Height);

        public static Point BottomLeftVertix(
            this Rectangle rctngl) => new Point(
                rctngl.X + rctngl.Width, rctngl.Y);

        public static PointF BottomLeftVertixF(
            this RectangleF rctngl) => new PointF(
                rctngl.X + rctngl.Width, rctngl.Y);

        public static Point BottomRightVertix(
            this Rectangle rctngl) => new Point(
                rctngl.X + rctngl.Width,
                rctngl.Y + rctngl.Height);

        public static PointF BottomRightVertixF(
            this RectangleF rctngl) => new PointF(
                rctngl.X + rctngl.Width,
                rctngl.Y + rctngl.Height);

        public static RectangleVertices GetVertices(
            this Rectangle rctngl) => new RectangleVertices(
                rctngl.TopLeftVertix(),
                rctngl.TopRightVertix(),
                rctngl.BottomRightVertix(),
                rctngl.BottomLeftVertix());

        public static RectangleVerticesF GetVertices(
            this RectangleF rctngl) => new RectangleVerticesF(
                rctngl.TopLeftVertixF(),
                rctngl.TopRightVertixF(),
                rctngl.BottomRightVertixF(),
                rctngl.BottomLeftVertixF());
    }
}
