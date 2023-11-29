using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Helpers;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Utility.WinFormsApp.ViewModels;
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
        private readonly IMainFormVM viewModel;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;
        private readonly UISettingsRetriever uISettingsRetriever;
        private readonly IWinFormsActionComponentCreator actionComponentCreator;

        public MainForm()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                viewModel = svcProv.GetRequiredService<IMainFormVM>();
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
                uISettingsRetriever = svcProv.GetRequiredService<UISettingsRetriever>();
                actionComponentCreator = svcProv.GetRequiredService<IWinFormsActionComponentCreator>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
                var uISettings = uISettingsRetriever.RegisterData(
                    UISettingsDataCore.GetDefaultData().With(
                        coreMtbl => new UISettingsDataMtbl(coreMtbl)
                        {
                        }));

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
