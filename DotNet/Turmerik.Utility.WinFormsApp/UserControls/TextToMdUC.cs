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
using Turmerik.Code.Core;
using Turmerik.Core.Threading;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Ux;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class TextToMdUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ISynchronizedValueAdapter<bool> controlsSynchronizer;
        private readonly IPropChangedEventAdapterFactory propChangedEventAdapterFactory;

        private readonly UISettingsRetriever uISettingsRetriever;
        private readonly IAppSettings appSettings;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxSrcFromCB_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxResultsToCB_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxMdTblSrcTxtIsTabSep_EvtAdapter;

        private UISettingsDataImmtbl uISettingsData;

        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;

        public TextToMdUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();

                controlsSynchronizer = svcProv.GetRequiredService<ISynchronizedValueAdapterFactory>().Create(
                    initialValue: true);

                propChangedEventAdapterFactory = svcProv.GetRequiredService<IPropChangedEventAdapterFactory>();

                uISettingsRetriever = svcProv.GetRequiredService<UISettingsRetriever>();
                appSettings = svcProv.GetRequiredService<IAppSettings>();
            }

            InitializeComponent();
            splitContainerMain.SplitterDistance = panelOptionControls.Height;
            panelOptionControls.SizeChanged += PanelOptionControls_SizeChanged;

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                iconLabelSrcFromCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;
                iconLabelResultsToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;

                this.checkBoxSrcFromCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxSrcFromCB,
                    (source, e, isChecked) => SetSrcFromCB(isChecked));

                this.checkBoxResultsToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxResultsToCB,
                    (source, e, isChecked) => SetResultToCB(isChecked));

                this.checkBoxMdTblSrcTxtIsTabSep_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxMdTableSrcTextIsTabSeparated,
                    (source, e, isChecked) => SetMdTablSrcTxtIsTabSepCB(isChecked));

                uISettingsRetriever.SubscribeToData(OnUISettingsData);
            }
        }

        private void OnUISettingsData(UISettingsDataImmtbl uISettingsData)
        {
            this.uISettingsData = uISettingsData;
            controlBlinkTimersManagerAdapter = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().Data;
            iconLabelSrcFromCB.ForeColor = uISettingsData.InfoIconColor;
            iconLabelResultsToCB.ForeColor = uISettingsData.InfoIconColor;

            ApplyHorizontalSplitPanelsSettings([
                horizontalSplitPanelSrcFromCB,
                horizontalSplitPanelResultsToCB
            ]);
        }

        private void ApplyHorizontalSplitPanelsSettings(
            HorizontalSplitPanel[] panelsArr)
        {
            foreach (var panel in panelsArr)
            {
                panel.SetBorderWidth(1);
                panel.SetBorderRadius(3);

                panel.SetBorderColor(
                    uISettingsData.BorderColor);
            }
        }

        private void SetSrcFromCB(
            bool enabled)
        {
        }

        private void SetResultToCB(
            bool enabled)
        {
        }

        private void SetMdTablSrcTxtIsTabSepCB(
            bool enabled)
        {
        }

        #region UI Event Handlers

        private void PanelOptionControls_SizeChanged(object? sender, EventArgs e)
        {
            splitContainerMain.SplitterDistance = panelOptionControls.Height;
        }

        private void ButtonMdTable_Click(object sender, EventArgs e)
        {

        }

        private void CheckBoxMdTableSrcTextIsTabSeparated_CheckedChanged(object sender, EventArgs e)
        {

        }

        private void TextBoxMdTableSrcTextSep_KeyUp(object sender, KeyEventArgs e)
        {

        }

        private void IconLabelSrcFromCB_Click(object sender, EventArgs e)
        {
            checkBoxSrcFromCB.ToggleChecked();
        }

        private void IconLabelResultsToCB_Click(object sender, EventArgs e)
        {
            checkBoxResultsToCB.ToggleChecked();
        }

        #endregion UI Event Handlers
    }
}
