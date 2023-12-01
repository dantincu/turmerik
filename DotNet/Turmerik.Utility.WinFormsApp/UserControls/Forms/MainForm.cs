using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Helpers;
using Turmerik.Core.Logging;
using Turmerik.Logging;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Utility.WinFormsApp.UserControls;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Turmerik.Utility.WinFormsApp
{
    public partial class MainForm : Form
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IAppLogger logger;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;
        private readonly UISettingsRetriever uISettingsRetriever;
        private readonly IUIThemeRetriever uIThemeRetriever;
        private readonly IWinFormsActionComponentCreator actionComponentCreator;
        private readonly ControlBlinkTimersManagerAdapterFactory controlBlinkTimersManagerAdapterFactory;

        public MainForm()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                logger = svcProv.GetRequiredService<IAppLoggerCreator>().GetSharedAppLogger(GetType());
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
                uISettingsRetriever = svcProv.GetRequiredService<UISettingsRetriever>();
                uIThemeRetriever = svcProv.GetRequiredService<IUIThemeRetriever>();
                actionComponentCreator = svcProv.GetRequiredService<IWinFormsActionComponentCreator>();
                controlBlinkTimersManagerAdapterFactory = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterFactory>();
            }

            InitializeComponent();
            var refUxControl = textUtilsUC.RefUxControl;

            if (svcProvContnr.IsRegistered)
            {
                try
                {
                    uIThemeRetriever.Data.ActWith(uiTheme =>
                    {
                        uiTheme.ApplyBgColor([
                            this,
                            this.tabControlMain,
                            this.tabPageTextUtils,
                            this.textUtilsUC
                        ]);

                        actionComponentCreator.DefaultStatusLabelOpts = new WinFormsStatusLabelActionComponentOpts
                        {
                            StatusLabel = toolStripStatusLabelMain,
                            DefaultForeColor = uiTheme.DefaultForeColor,
                            WarningForeColor = uiTheme.WarningColor,
                            ErrorForeColor = uiTheme.ErrorColor,
                        };
                    });
                }
                catch (Exception ex)
                {
                    logger.Fatal(ex, "Could not retrieve the UI Theme");
                    MessageBox.Show($"An unhandled error has occurred: {ex}");

                    throw;
                }

                var uISettings = uISettingsRetriever.RegisterData(
                    UISettingsDataCore.GetDefaultData().With(
                        coreMtbl => new UISettingsDataMtbl(coreMtbl)),
                        data =>
                        {
                            svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().RegisterData(
                                controlBlinkTimersManagerAdapterFactory.Create(
                                    new ControlBlinkTimersManagerAdapterOpts
                                    {
                                        RefUxControl = refUxControl,
                                    }));
                        });
            }
        }
    }
}
