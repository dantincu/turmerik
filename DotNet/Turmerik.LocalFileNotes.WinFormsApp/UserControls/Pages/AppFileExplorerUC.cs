using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Threading;
using Turmerik.LocalFileNotes.WinFormsApp.Pages;
using Turmerik.LocalFileNotes.WinFormsApp.Settings;
using Turmerik.LocalFileNotes.WinFormsApp.Settings.UI;
using Turmerik.Ux;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.LocalFileNotes.WinFormsApp.UserControls.Pages
{
    public partial class AppFileExplorerUC : UserControl, IAppPageUC
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ISynchronizedValueAdapter<bool> controlsSynchronizer;
        private readonly IPropChangedEventAdapterFactory propChangedEventAdapterFactory;

        private readonly IUISettingsRetriever uISettingsRetriever;
        private readonly IUIThemeRetriever uIThemeRetriever;
        private readonly IAppSettings appSettings;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        private readonly ToolTip toolTip;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        private Action<AppPageOpts> openPageInNewTab;
        private Action<AppPageOpts> openPageInCurrentTab;
        private Action closeCurrentTab;

        public AppFileExplorerUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();

                controlsSynchronizer = svcProv.GetRequiredService<ISynchronizedValueAdapterFactory>().Create(
                    initialValue: true);

                propChangedEventAdapterFactory = svcProv.GetRequiredService<IPropChangedEventAdapterFactory>();

                uISettingsRetriever = svcProv.GetRequiredService<IUISettingsRetriever>();
                uIThemeRetriever = svcProv.GetRequiredService<IUIThemeRetriever>();
                appSettings = svcProv.GetRequiredService<IAppSettings>();
            }

            InitializeComponent();
            toolTip = new ToolTip();

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                uISettingsData = uISettingsRetriever.Data;
            }
        }

        public event Action<AppPageOpts> OnOpenPageInNewTab
        {
            add => openPageInNewTab += value;
            remove => openPageInNewTab -= value;
        }

        public event Action<AppPageOpts> OnOpenPageInCurrentTab
        {
            add => openPageInCurrentTab += value;
            remove => openPageInCurrentTab -= value;
        }

        public event Action OnCloseCurrentTab
        {
            add => closeCurrentTab += value;
            remove => closeCurrentTab -= value;
        }

        public void UnregisterAll()
        {
            openPageInNewTab = null;
            openPageInCurrentTab = null;
            closeCurrentTab = null;
        }

        private ToolTipHintsGroupOpts GetToolTipHintsGroupOpts()
        {
            var optsList = new List<ToolTipHintOpts>();

            return new ToolTipHintsGroupOpts
            {
                HintOpts = optsList,
            };
        }

        #region UI Event Handler

        private void AppFileExplorerUC_Load(object sender, EventArgs e) => actionComponent?.Execute(
            new WinFormsActionOpts<int>
            {
                Action = () =>
                {
                    // controlBlinkTimersManagerAdapter = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().Data;

                    uIThemeData = uIThemeRetriever.Data.ActWith(uiTheme =>
                    {
                        /* uiTheme.ApplyBgColor([
                        ], uiTheme.InputBackColor); */
                    });

                    appSettings.Data.ActWith(appSettingsData =>
                    {
                        controlsSynchronizer.Execute(false,
                            (wasEnabled) =>
                            {
                            });
                    });

                    toolTipHintsOrchestrator = svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().Data;

                    toolTipHintsOrchestrator.HintGroups.Add(
                        toolTipHintsGroup = GetToolTipHintsGroupOpts().HintsGroup());

                    return ActionResultH.Create(0);
                }
            });

        #endregion UI Event Handler
    }
}
