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
                var uISettings = UISettingsDataCore.GetDefaultData();

                actionComponentCreator.DefaultStatusLabelOpts = new WinFormsStatusLabelActionComponentOpts
                {
                    StatusLabel = toolStripStatusLabelMain,
                    DefaultForeColor = uISettings.DefaultForeColor,
                    WarningForeColor = uISettings.WarningColor,
                    ErrorForeColor = uISettings.ErrorColor,
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

        #endregion UI Event Handlers
    }
}
