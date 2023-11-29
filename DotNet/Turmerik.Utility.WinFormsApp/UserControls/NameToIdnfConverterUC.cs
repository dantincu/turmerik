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
using Turmerik.Core.Threading;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Ux;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;
using Turmerik.Core.Helpers;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class NameToIdnfConverterUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ISynchronizedValueAdapter<bool> controlsSynchronizer;
        private readonly IPropChangedEventAdapterFactory propChangedEventAdapterFactory;

        private readonly UISettingsRetriever uISettingsRetriever;
        private readonly IAppSettings appSettings;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxNameConvertToCB_EvtAdapter;

        private readonly Color defaultBackColor;
        private readonly Color defaultForeColor;

        private UISettingsDataImmtbl uISettingsData;

        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;

        public NameToIdnfConverterUC()
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

            defaultBackColor = iconLabelIdnfToCB.BackColor;
            defaultForeColor = iconLabelIdnfToCB.ForeColor;

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                iconLabelConvertName.Text = MatUIIconUnicodesH.AudioAndVideo.PLAY_ARROW;
                iconLabelIdnfToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;
                iconLabelNameConvertToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;

                this.checkBoxNameConvertToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxNameConvertToCB,
                    (source, e, isChecked) => SetIdnfToCB(isChecked));
            }

            uISettingsRetriever.SubscribeToData(OnUISettingsData);
        }

        private void OnUISettingsData(UISettingsDataImmtbl uISettingsData)
        {
            this.uISettingsData = uISettingsData;

            controlBlinkTimersManagerAdapter = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().Data;

            uISettingsData.ApplyBgColor([this,
                textBoxName,
                textBoxIndf]);
        }

        private void SetIdnfToCB(bool enabled)
        {
            appSettings.Update((ref AppSettingsDataMtbl mtbl) =>
            {
                var nameToIdnfConverter = mtbl.NameToIdnfConverter;

                nameToIdnfConverter.NameConvertToCB = enabled.If(
                    () => (bool?)true, () => null);
            });
        }

        #region UI Event Handlers

        private void IconLabelConvertName_Click(object sender, EventArgs e)
        {

        }

        private void IconLabelIdnfToCB_Click(object sender, EventArgs e)
        {

        }

        private void CheckBoxNameConvertToCB_CheckedChanged(object sender, EventArgs e)
        {

        }

        private void IconLabelNameConvertToCB_Click(object sender, EventArgs e)
        {

        }

        #endregion UI Event Handlers
    }
}
