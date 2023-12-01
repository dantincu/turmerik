using Microsoft.Extensions.DependencyInjection;
using System.Drawing;
using System.Drawing.Drawing2D;
using Turmerik.Core.Helpers;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.TestWinFormsApp
{
    public partial class Form1 : Form
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly IWinFormsActionComponentCreator actionComponentCreator;

        private Pen borderPen1Px;
        private Pen borderPen1P5Px;

        public Form1()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
                actionComponentCreator = svcProv.GetRequiredService<IWinFormsActionComponentCreator>();
            }

            InitializeComponent();

            borderPen1Px = new Pen(new SolidBrush(
                    Color.FromArgb(32, 32, 32)), 1F);

            borderPen1P5Px = new Pen(new SolidBrush(
                    Color.FromArgb(32, 32, 32)), 1.5F);

            if (svcProvContnr.IsRegistered)
            {
                var uITheme = UIThemeDataCore.GetDefaultData();

                actionComponentCreator.DefaultStatusLabelOpts = new WinFormsStatusLabelActionComponentOpts
                {
                    StatusLabel = toolStripStatusLabelMain,
                    DefaultForeColor = uITheme.DefaultForeColor.Value,
                    WarningForeColor = uITheme.WarningColor.Value,
                    ErrorForeColor = uITheme.ErrorColor.Value,
                };
            }

            this.Paint += Form1_Paint;

            var pointF = new PointF(-1, -1);
            var point = new Point(-1, -1);
        }

        #region UI Event Handlers

        private void Form1_Paint(object? sender, PaintEventArgs e)
        {
            e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;

            DrawingH.DrawWithRoundedCorners(
                e.Graphics, borderPen1Px,
                ClientRectangle.With(rctngl => new Rectangle(
                    rctngl.Left + 50,
                    rctngl.Top + 50,
                    rctngl.Width - 100,
                    200)), 50F);


            DrawingH.DrawWithRoundedCorners(
                e.Graphics, borderPen1Px,
                ClientRectangle.With(rctngl => new Rectangle(
                    rctngl.Left + 100,
                    rctngl.Top + 100,
                    rctngl.Width - 200,
                    23)), 5F);


            DrawingH.DrawWithRoundedCorners(
                e.Graphics, borderPen1P5Px,
                ClientRectangle.With(rctngl => new Rectangle(
                    rctngl.Left + 100,
                    rctngl.Top + 150,
                    rctngl.Width - 200,
                    23)), 5F);


            DrawingH.DrawWithRoundedCorners(
                e.Graphics, borderPen1P5Px,
                ClientRectangle.With(rctngl => new Rectangle(
                    rctngl.Left + 100,
                    rctngl.Top + 200,
                    rctngl.Width - 200,
                    23)), 3F);
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // Create the ToolTip and associate with the Form container.
            ToolTip toolTip1 = new ToolTip();

            // Set up the delays for the ToolTip.
            toolTip1.AutoPopDelay = 0;
            toolTip1.InitialDelay = 1;
            toolTip1.ReshowDelay = 0;
            // Force the ToolTip text to be displayed whether or not the form is active.
            toolTip1.ShowAlways = true;
            toolTip1.IsBalloon = true;
            // Set up the ToolTip text for the Button and Checkbox.
            toolTip1.SetToolTip(this.button1, "My button1");

            ToolTip toolTip2 = new ToolTip();

            // Set up the delays for the ToolTip.
            toolTip2.AutoPopDelay = 0;
            toolTip2.InitialDelay = 1000;
            toolTip2.ReshowDelay = 0;
            // Force the ToolTip text to be displayed whether or not the form is active.
            toolTip2.ShowAlways = true;
            toolTip2.IsBalloon = true;
            // Set up the ToolTip text for the Button and Checkbox.
            toolTip2.SetToolTip(this.label1, "My label1");

        }

        #endregion UI Event Handlers
    }
}
