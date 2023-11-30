using Microsoft.Extensions.DependencyInjection;
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

        private Pen borderPen;

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

            borderPen = new Pen(new SolidBrush(Color.Gray));

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
            DrawingH.DrawWithRoundedCorners(
                e.Graphics, borderPen,
                ClientRectangle.With(rctngl => new Rectangle(
                    rctngl.Left + 50,
                    rctngl.Top + 50,
                    rctngl.Width - 100,
                    200)), 50F);
        }

        #endregion UI Event Handlers
    }
}
