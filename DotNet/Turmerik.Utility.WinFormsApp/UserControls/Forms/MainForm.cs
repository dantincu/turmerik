using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Helpers;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Utility.WinFormsApp.UserControls;
using Turmerik.Utility.WinFormsApp.UserControls.Forms;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp
{
    public partial class MainForm : Form
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;
        private readonly UISettingsRetriever uISettingsRetriever;
        private readonly IWinFormsActionComponentCreator actionComponentCreator;
        private readonly ControlBlinkTimersManagerAdapterFactory controlBlinkTimersManagerAdapterFactory;

        public MainForm()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
                uISettingsRetriever = svcProv.GetRequiredService<UISettingsRetriever>();
                actionComponentCreator = svcProv.GetRequiredService<IWinFormsActionComponentCreator>();
                controlBlinkTimersManagerAdapterFactory = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterFactory>();
            }

            InitializeComponent();
            var refUxControl = textUtilsUC.RefUxControl;

            if (svcProvContnr.IsRegistered)
            {
                var uISettings = uISettingsRetriever.RegisterData(
                    UISettingsDataCore.GetDefaultData().With(
                        coreMtbl => new UISettingsDataMtbl(coreMtbl)
                        {
                            DefaultBackColor = refUxControl.BackColor,
                            DefaultForeColor = refUxControl.ForeColor,
                        }),
                        data =>
                        {
                            svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().RegisterData(
                                controlBlinkTimersManagerAdapterFactory.Create(
                                    new ControlBlinkTimersManagerAdapterOpts
                                    {
                                        RefUxControl = refUxControl,
                                    }));
                        });

                actionComponentCreator.DefaultStatusLabelOpts = new WinFormsStatusLabelActionComponentOpts
                {
                    StatusLabel = toolStripStatusLabelMain,
                    DefaultForeColor = uISettings.DefaultForeColor,
                    WarningForeColor = uISettings.WarningColor,
                    ErrorForeColor = uISettings.ErrorColor,
                };
            }
        }
    }
}
