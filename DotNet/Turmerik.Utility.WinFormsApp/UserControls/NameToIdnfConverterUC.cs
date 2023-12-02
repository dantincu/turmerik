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
using Turmerik.Code.Core;
using Turmerik.Core.Actions;
using Turmerik.Core.UIActions;
using static Turmerik.WinForms.Controls.UISettingsDataCore;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class NameToIdnfConverterUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly Code.Core.INameToIdnfConverter nameToIdnfConverter;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ISynchronizedValueAdapter<bool> controlsSynchronizer;
        private readonly IPropChangedEventAdapterFactory propChangedEventAdapterFactory;

        private readonly IUISettingsRetriever uISettingsRetriever;
        private readonly IUIThemeRetriever uIThemeRetriever;
        private readonly IAppSettings appSettings;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxNameConvertToCB_EvtAdapter;

        private readonly ToolTip toolTip;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        public NameToIdnfConverterUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                nameToIdnfConverter = svcProv.GetRequiredService<Code.Core.INameToIdnfConverter>();
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

                iconLabelConvertName.Text = MatUIIconUnicodesH.AudioAndVideo.PLAY_ARROW;
                iconLabelIdnfToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;
                iconLabelNameConvertToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;

                this.checkBoxNameConvertToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxNameConvertToCB,
                    (source, e, isChecked) => SetIdnfToCB(isChecked));

                uISettingsData = uISettingsRetriever.Data;
            }
        }

        private void SetIdnfToCB(bool enabled) => actionComponent.UpdateAppSettings(
                appSettings, settings => settings.NameToIdnfConverter.ActWith(mtbl =>
                {
                    mtbl.NameConvertToCB = enabled.If(
                        () => (bool?)true, () => null);
                }));

        private void ConvertNameToIdnf() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            Action = () =>
            {
                string idnf = nameToIdnfConverter.Convert(
                    new NameToIdnfConverterOpts
                    {
                        InputIdentifier = textBoxName.Text,
                    });

                textBoxIndf.Text = idnf;
                return ActionResultH.Create(idnf);
            }
        }).With(result => (result.IsSuccess && checkBoxNameConvertToCB.Checked).ActIf(
            () => CopyIdnfToCB(result.Value)));

        private void CopyIdnfToCB(
            string idnf = null) => actionComponent.CopyTextToClipboard(
                controlBlinkTimersManagerAdapter,
                iconLabelIdnfToCB,
                idnf ?? textBoxIndf.Text);

        private ToolTipHintsGroupOpts GetToolTipHintsGroupOpts()
        {
            var optsList = new List<ToolTipHintOpts>();

            return new ToolTipHintsGroupOpts
            {
                HintOpts = optsList,
            };
        }

        #region UI Event Handlers

        private void NameToIdnfConverterUC_Load(object sender, EventArgs e) => actionComponent.Execute(
            new WinFormsActionOpts<int>
            {
                Action = () =>
                {
                    controlBlinkTimersManagerAdapter = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().Data;

                    uIThemeData = uIThemeRetriever.Data.ActWith(uiTheme =>
                    {
                        uiTheme.ApplyBgColor([
                            this.textBoxName,
                            this.textBoxIndf,
                            this.checkBoxNameConvertToCB,
                        ], uiTheme.InputBackColor);

                        iconLabelNameConvertToCB.ForeColor = uiTheme.InfoIconColor;
                    });

                    appSettings.Data.ActWith(appSettingsData =>
                    {
                        var nameToIdnfSettings = appSettingsData.NameToIdnfConverter;

                        controlsSynchronizer.Execute(false,
                            (wasEnabled) =>
                            {
                                checkBoxNameConvertToCB.Checked = nameToIdnfSettings.NameConvertToCB ?? false;
                            });
                    });

                    toolTipHintsOrchestrator = svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().Data;

                    toolTipHintsOrchestrator.HintGroups.Add(
                        toolTipHintsGroup = GetToolTipHintsGroupOpts().HintsGroup());

                    return ActionResultH.Create(0);
                }
            });

        private void IconLabelConvertName_Click(object sender, EventArgs e)
        {
            ConvertNameToIdnf();
        }

        private void IconLabelIdnfToCB_Click(object sender, EventArgs e)
        {
            CopyIdnfToCB();
        }

        private void IconLabelNameConvertToCB_Click(object sender, EventArgs e)
        {
            checkBoxNameConvertToCB.ToggleChecked();
        }

        private void TextBoxName_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (e.Control)
                {
                    checkBoxNameConvertToCB.Checked = !e.Shift;
                }

                ConvertNameToIdnf();
            }
        }

        private void TextBoxIndf_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                checkBoxNameConvertToCB.Checked = !e.Control;
            }
        }

        #endregion UI Event Handlers
    }
}
