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
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
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
    public partial class PathConverterUC : UserControl
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

        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxWinPathToCB_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxUnixPathToCB_EvtAdapter;
        private readonly IPropChangedEventAdapter<bool, EventArgs> checkBoxEscWinPathToCB_EvtAdapter;

        private readonly ToolTip toolTip;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        public PathConverterUC()
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

                iconLabelFromWinPath.Text = MatUIIconUnicodesH.AudioAndVideo.PLAY_ARROW;
                iconLabelFromEscWinPath.Text = MatUIIconUnicodesH.AudioAndVideo.PLAY_ARROW;
                iconLabelFromUnixPath.Text = MatUIIconUnicodesH.AudioAndVideo.PLAY_ARROW;

                iconLabelWinPathToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;
                iconLabelEscWinPathToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;
                iconLabelUnixPathToCB.Text = MatUIIconUnicodesH.TextFormatting.CONTENT_PASTE;

                this.checkBoxWinPathToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxWinPathToCB,
                    (source, e, isChecked) =>
                    {
                        toolTipHintsGroup?.UpdateToolTipsText(new());
                        SetWinPathToCB(isChecked);
                    });

                this.checkBoxEscWinPathToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxEscWinPathToCB,
                    (source, e, isChecked) =>
                    {
                        toolTipHintsGroup?.UpdateToolTipsText(new());
                        SetEscWinPathToCB(isChecked);
                    });

                this.checkBoxUnixPathToCB_EvtAdapter = propChangedEventAdapterFactory.CheckedChanged(
                    checkBoxUnixPathToCB,
                    (source, e, isChecked) =>
                    {
                        toolTipHintsGroup?.UpdateToolTipsText(new());
                        SetUnixPathToCB(isChecked);
                    });

                uISettingsData = uISettingsRetriever.Data;
            }
        }

        private void ConvertFromWinPath() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            Action = () =>
            {
                string winPath = textBoxWinPath.Text;
                string escWinPath = winPath.Replace("\\", "\\\\");
                textBoxEscWinPath.Text = escWinPath;

                string unixPath = NormPathH.NormPathUnixStyle(winPath);
                textBoxUnixPath.Text = unixPath;

                string? retVal = null;

                if (checkBoxEscWinPathToCB.Checked)
                {
                    retVal = escWinPath;
                }
                else if (checkBoxUnixPathToCB.Checked)
                {
                    retVal = unixPath;
                }

                return ActionResultH.Create(retVal);
            }
        }).With(result => (result.IsSuccess && result.Value != null).ActIf(() =>
        {
            actionComponent.CopyTextToClipboard(
                controlBlinkTimersManagerAdapter,
                checkBoxEscWinPathToCB.Checked ? iconLabelEscWinPathToCB : iconLabelWinPathToCB,
                result.Value!);
        }));

        private void ConvertFromEscWinPath() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            Action = () =>
            {
                string escWinPath = textBoxEscWinPath.Text;
                string winPath = escWinPath.Replace("\\\\", "\\");
                textBoxWinPath.Text = winPath;

                string unixPath = NormPathH.NormPathUnixStyle(winPath);
                textBoxUnixPath.Text = unixPath;

                string? retVal = null;

                if (checkBoxWinPathToCB.Checked)
                {
                    retVal = winPath;
                }
                else if (checkBoxUnixPathToCB.Checked)
                {
                    retVal = unixPath;
                }

                return ActionResultH.Create(retVal);
            }
        }).With(result => (result.IsSuccess && result.Value != null).ActIf(() =>
        {
            actionComponent.CopyTextToClipboard(
                controlBlinkTimersManagerAdapter,
                checkBoxWinPathToCB.Checked ? iconLabelWinPathToCB : iconLabelUnixPathToCB,
                result.Value!);
        }));

        private void ConvertFromUnixPath() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            Action = () =>
            {
                string unixPath = textBoxUnixPath.Text;
                string winPath;

                if (Path.IsPathRooted(unixPath))
                {
                    winPath = NormPathH.NormRootedPathWinStyle(unixPath);
                }
                else
                {
                    winPath = unixPath.Replace("/", "\\");
                }

                textBoxWinPath.Text = winPath;
                string escWinPath = winPath.Replace("\\", "\\\\");

                textBoxEscWinPath.Text = escWinPath;

                string? retVal = null;

                if (checkBoxWinPathToCB.Checked)
                {
                    retVal = winPath;
                }
                else if (checkBoxEscWinPathToCB.Checked)
                {
                    retVal = escWinPath;
                }

                return ActionResultH.Create(retVal);
            }
        }).With(result => (result.IsSuccess && result.Value != null).ActIf(() =>
        {
            actionComponent.CopyTextToClipboard(
                controlBlinkTimersManagerAdapter,
                checkBoxWinPathToCB.Checked ? iconLabelWinPathToCB : iconLabelEscWinPathToCB,
                result.Value!);
        }));

        private void SetWinPathToCB(bool enabled) => actionComponent.UpdateAppSettings(
            appSettings, settings => settings.PathConverter.ActWith(mtbl =>
            {
                mtbl.WinPathToCB = enabled.If(
                    () => (bool?)true, () => null);
            }));

        private void SetEscWinPathToCB(bool enabled) => actionComponent.UpdateAppSettings(
            appSettings, settings => settings.PathConverter.ActWith(mtbl =>
            {
                mtbl.EscWinPathToCB = enabled.If(
                    () => (bool?)true, () => null);
            }));

        private void SetUnixPathToCB(bool enabled) => actionComponent.UpdateAppSettings(
            appSettings, settings => settings.PathConverter.ActWith(mtbl =>
            {
                mtbl.UnixPathToCB = enabled.If(
                    () => (bool?)true, () => null);
            }));

        private ToolTipHintsGroupOpts GetToolTipHintsGroupOpts()
        {
            var optsList = new List<ToolTipHintOpts>();

            Func<string> winPathToCBHintFactory = () => string.Concat(
                "Click here to ",
                checkBoxWinPathToCB.Checked ? "dis" : "",
                $"activate the automatic copying of the ",
                "win path to clipboard after it has been converted");

            Func<string> escWinPathToCBHintFactory = () => string.Concat(
                "Click here to ",
                checkBoxEscWinPathToCB.Checked ? "dis" : "",
                $"activate the automatic copying of the ",
                "json string-escaped win path to clipboard after it has been converted");

            Func<string> unixPathToCBHintFactory = () => string.Concat(
                "Click here to ",
                checkBoxUnixPathToCB.Checked ? "dis" : "",
                $"activate the automatic copying of the ",
                "unix path to clipboard after it has been converted");

            optsList.AddRange(
                iconLabelFromWinPath.HintOpts(
                    () => "Click here to convert this win path to a json string-escaped format and to an equivallent unix path").Arr(
                checkBoxWinPathToCB.HintOpts(
                    winPathToCBHintFactory),
                iconLabelWinPathToCB.HintOpts(
                    winPathToCBHintFactory),
                textBoxWinPath.HintOpts(
                    () => string.Join("\n",
                        "Type or paste here the win path.",
                        "Then press the ENTER key to convert this win path to a json string-escaped format and to an equivallent unix path.",
                        "Press CTRL + ENTER keys to activate automatic copying of the generated json string-escaped win path to clipboard.",
                        "Press CTRL + SHIFT + ENTER keys to activate automatic copying of the generated unix path to clipboard.")),
                iconLabelFromEscWinPath.HintOpts(
                    () => "Click here to convert this json string-escaped win path to an actual win path and to an equivallent unix path"),
                checkBoxEscWinPathToCB.HintOpts(
                    escWinPathToCBHintFactory),
                iconLabelEscWinPathToCB.HintOpts(
                    escWinPathToCBHintFactory),
                textBoxEscWinPath.HintOpts(
                    () => string.Join("\n",
                        "Type or paste here the json string-escaped win path.",
                        "Then press the ENTER key to convert this json string-escaped win path back to an actual win path and to an equivallent unix path.",
                        "Press CTRL + ENTER keys to activate automatic copying of the generated win path to clipboard.",
                        "Press CTRL + SHIFT + ENTER keys to activate automatic copying of the generated unix path to clipboard.")),
                iconLabelFromUnixPath.HintOpts(
                    () => "Click here to convert this unix path to an equivallent win path and the win path to a json string-escaped format"),
                checkBoxUnixPathToCB.HintOpts(
                    unixPathToCBHintFactory),
                iconLabelUnixPathToCB.HintOpts(
                    unixPathToCBHintFactory),
                textBoxUnixPath.HintOpts(
                    () => string.Join("\n",
                        "Type or paste here the unix path.",
                        "Then press the ENTER key to convert this unix win path to a win path and the win path to a json string-escaped format.",
                        "Press CTRL + ENTER keys to activate automatic copying of the generated win path to clipboard.",
                        "Press CTRL + SHIFT + ENTER keys to activate automatic copying of the generated json string-escaped win path to clipboard."))
                ));

            return new ToolTipHintsGroupOpts
            {
                HintOpts = optsList,
            };
        }

        #region UI Event Handlers

        private void PathConverterUC_Load(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            Action = () =>
            {
                controlBlinkTimersManagerAdapter = svcProv.GetRequiredService<ControlBlinkTimersManagerAltAdapterContainer>().Data;

                uIThemeData = uIThemeRetriever.Data.ActWith(uiTheme =>
                {
                    uiTheme.ApplyBgColor([
                        this.textBoxWinPath,
                        this.textBoxEscWinPath,
                        this.textBoxUnixPath,
                        // this.checkBoxWinPathToCB,
                        // this.checkBoxEscWinPathToCB,
                        // this.checkBoxUnixPathToCB
                    ], uiTheme.InputBackColor);

                    iconLabelWinPathToCB.ForeColor = uiTheme.InfoIconColor;
                    iconLabelEscWinPathToCB.ForeColor = uiTheme.InfoIconColor;
                    iconLabelUnixPathToCB.ForeColor = uiTheme.InfoIconColor;
                });

                appSettings.Data.ActWith(appSettingsData =>
                {
                    var nameToIdnfSettings = appSettingsData.PathConverter;

                    controlsSynchronizer.Execute(false,
                        (wasEnabled) =>
                        {
                            checkBoxWinPathToCB.Checked = nameToIdnfSettings.WinPathToCB ?? false;
                            checkBoxEscWinPathToCB.Checked = nameToIdnfSettings.EscWinPathToCB ?? false;
                            checkBoxUnixPathToCB.Checked = nameToIdnfSettings.UnixPathToCB ?? false;
                        });
                });

                toolTipHintsOrchestrator = svcProv.GetRequiredService<ToolTipHintsOrchestratorRetriever>().Data;

                toolTipHintsOrchestrator.HintGroups.Add(
                    toolTipHintsGroup = GetToolTipHintsGroupOpts().HintsGroup());

                return ActionResultH.Create(0);
            }
        });

        private void IconLabelFromWinPath_Click(object sender, EventArgs e)
        {
            ConvertFromWinPath();
        }

        private void IconLabelFromEscWinPath_Click(object sender, EventArgs e)
        {
            ConvertFromEscWinPath();
        }

        private void IconLabelFromUnixPath_Click(object sender, EventArgs e)
        {
            ConvertFromUnixPath();
        }

        private void IconLabelWinPathToCB_Click(object sender, EventArgs e)
        {
            checkBoxWinPathToCB.ToggleChecked();
        }

        private void IconLabelEscWinPathToCB_Click(object sender, EventArgs e)
        {
            checkBoxEscWinPathToCB.ToggleChecked();
        }

        private void IconLabelUnixPathToCB_Click(object sender, EventArgs e)
        {
            checkBoxUnixPathToCB.ToggleChecked();
        }

        private void TextBoxWinPath_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (e.Control)
                {
                    checkBoxEscWinPathToCB.Checked = !e.Shift;
                    checkBoxUnixPathToCB.Checked = e.Shift;
                }

                ConvertFromWinPath();
            }
        }

        private void TextBoxEscWinPath_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (e.Control)
                {
                    checkBoxWinPathToCB.Checked = !e.Shift;
                    checkBoxUnixPathToCB.Checked = e.Shift;
                }

                ConvertFromEscWinPath();
            }
        }

        private void TextBoxUnixPath_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (e.Control)
                {
                    checkBoxWinPathToCB.Checked = !e.Shift;
                    checkBoxEscWinPathToCB.Checked = e.Shift;
                }

                ConvertFromUnixPath();
            }
        }

        #endregion UI Event Handlers
    }
}
