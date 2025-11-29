using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Threading;
using Turmerik.Utility.WinFormsApp.Services.FetchMultipleLinks;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class FetchLinkTextItemUC : UserControl, IFetchLinkItemUC
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IJsonConversion jsonConversion;

        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ISynchronizedValueAdapter<bool> controlsSynchronizer;
        private readonly IPropChangedEventAdapterFactory propChangedEventAdapterFactory;

        private readonly IUISettingsRetriever uISettingsRetriever;
        private readonly IUIThemeRetriever uIThemeRetriever;
        private readonly IAppSettings appSettings;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;
        private readonly IFetchMultipleLinksDataContainer fetchMultipleLinksDataContainer;
        private readonly FetchMultipleLinksService fetchMultipleLinksService;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        private FetchLinkDataTextItemMtbl item;

        public FetchLinkTextItemUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                jsonConversion = svcProv.GetRequiredService<IJsonConversion>();

                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();

                controlsSynchronizer = svcProv.GetRequiredService<ISynchronizedValueAdapterFactory>().Create(
                    initialValue: true);

                propChangedEventAdapterFactory = svcProv.GetRequiredService<IPropChangedEventAdapterFactory>();

                uISettingsRetriever = svcProv.GetRequiredService<IUISettingsRetriever>();
                uIThemeRetriever = svcProv.GetRequiredService<IUIThemeRetriever>();
                appSettings = svcProv.GetRequiredService<IAppSettings>();
                fetchMultipleLinksDataContainer = svcProv.GetRequiredService<IFetchMultipleLinksDataContainer>();
                fetchMultipleLinksService = svcProv.GetRequiredService<FetchMultipleLinksService>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                uISettingsData = uISettingsRetriever.Data;
            }
        }

        public void SetItem(FetchLinkDataItemCoreMtbl item)
        {
            this.item = (FetchLinkDataTextItemMtbl)item;
            textBoxMain.Text = item.Text;
        }

        public void HandleKeyDown(KeyEventArgs e)
        {
            if (e.Control && e.Shift && !e.Alt && e.KeyCode == Keys.D1)
            {
                textBoxMain.Focus();
                textBoxMain.SelectAll();
            }
        }

        public void UnsetItem()
        {
        }

        #region UI Event Handlers

        #endregion UI Event Handlers
    }
}
