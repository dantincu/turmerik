using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.WinForms.Controls
{
    public class HorizontalSplitPanel : Panel
    {
        public const double DEFAULT_WIDTH_RATIO = 0.5;

        private double widthRatio;
        private Color? borderColor;
        private float borderWidth;
        private float borderRadius;
        private Pen? borderPen;

        public HorizontalSplitPanel()
        {
            widthRatio = DEFAULT_WIDTH_RATIO;

            LeftPanel = CreateLeftPanel();
            RightPanel = CreateRightPanel();

            Padding = new Padding(1);
            this.Paint += HorizontalSplitPanel_Paint;
        }

        public Panel LeftPanel { get; }
        public Panel RightPanel { get; }

        public double WidthRatio => widthRatio;
        public Color? BorderColor => borderColor;
        public float BorderWidth => borderWidth;
        public float BorderRadius => borderRadius;

        public void SetWidthRatio(
            double widthRatio)
        {
            this.widthRatio = widthRatio;
            LeftPanel.Width = GetNewWidth();
        }

        public void SetBorderColor(
            Color? borderColor)
        {
            this.borderColor = borderColor;
            RefreshBorderPen();
        }

        public void SetBorderWidth(
            float borderWidth)
        {
            this.borderWidth = borderWidth;
            RefreshBorderPen();
        }

        public void SetBorderRadius(
            float borderRadius)
        {
            this.borderRadius = borderRadius;
            RefreshBorderPen();
        }

        private Panel CreateLeftPanel(
            ) => CreatePanel(
                DockStyle.Left);

        private Panel CreateRightPanel(
            ) => CreatePanel(
                DockStyle.Right);

        private Panel CreatePanel(
            DockStyle dockStyle)
        {
            Panel panel = new Panel
            {
                Width = GetNewWidth(),
                Dock = dockStyle,
            };

            return panel;
        }

        private int GetNewWidth() => (
            Width * widthRatio).RoundToInt();

        private void RefreshBorderPen()
        {
            this.borderPen = GetNewBorderPen();
            Invalidate();
        }

        private Pen? GetNewBorderPen(
            ) => borderColor?.With(
                color => new Pen(
                    new SolidBrush(
                        color),
                    borderWidth));

        #region UI Event Handlers

        private void HorizontalSplitPanel_Paint(
            object? sender, PaintEventArgs e)
        {
            var rectangle = this.ClientRectangle.Shrink(Padding);
            var graphics = e.Graphics;
            var pen = this.borderPen;
            var radius = this.borderRadius;

            if (pen != null)
            {
                if (radius == 0)
                {
                    graphics.DrawRectangle(
                        pen, rectangle);
                }
                else
                {
                    DrawingH.DrawWithRoundedCorners(
                        graphics, pen, rectangle, radius);
                }
            }
        }

        #endregion UI Event Handlers
    }
}
