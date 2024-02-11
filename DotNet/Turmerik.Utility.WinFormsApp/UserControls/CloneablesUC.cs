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
using Turmerik.Code.CSharp.Cloneables;
using Turmerik.Core.Threading;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Ux;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class CloneablesUC : UserControl
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

        private readonly ICloneableTypesCodeGenerator cloneableTypesCodeGenerator;
        private readonly KeyValuePair<CloneablesGeneratedCodeType, string>[] codeTypes;
        private readonly KeyValuePair<CloneablesGeneratedCodeType, string> dfCodeType;

        private readonly ToolTip toolTip;

        private UISettingsDataImmtbl uISettingsData;
        private UIThemeDataImmtbl uIThemeData;
        private ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter;
        private ToolTipHintsOrchestrator toolTipHintsOrchestrator;
        private ToolTipHintsGroup toolTipHintsGroup;

        public CloneablesUC()
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

                cloneableTypesCodeGenerator = svcProv.GetRequiredService<ICloneableTypesCodeGenerator>();

                codeTypes = Enum.GetValues<CloneablesGeneratedCodeType>().Select(
                    codeType => new KeyValuePair<CloneablesGeneratedCodeType, string>(
                        codeType, StringH.CamelCaseToWords(codeType.ToString()))).ToArray();

                dfCodeType = codeTypes.First();
            }

            InitializeComponent();

            comboBoxCodeType.DataSource = codeTypes;
            comboBoxCodeType.DisplayMember = nameof(dfCodeType.Value);
            comboBoxCodeType.ValueMember = nameof(dfCodeType.Key);
            comboBoxCodeType.SelectedIndex = 0;

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                iconLabelClearAllTypeNames.Text = MatUIIconUnicodesH.UIActions.DELETE_SWEEP;
                iconLabelRefreshAllTypeNames.Text = MatUIIconUnicodesH.UIActions.REFRESH;

                uISettingsData = uISettingsRetriever.Data;
            }
        }

        private ToolTipHintsGroupOpts GetToolTipHintsGroupOpts()
        {
            var optsList = new List<ToolTipHintOpts>();

            return new ToolTipHintsGroupOpts
            {
                HintOpts = optsList,
            };
        }

        private IActionResult<string> GenerateCloneables() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            ActionName = nameof(GenerateCloneables),
            Action = () =>
            {
                string outputCode = cloneableTypesCodeGenerator.GenerateCode(
                    new CloneableTypesCodeGeneratorOpts
                    {
                        CodeType = GetSelectedCloneablesGeneratedCodeType(),
                        InputCode = richTextBoxSrcText.Text,
                        StaticClassName = textBoxStaticClassName.Text,
                        ImmtblClassName = textBoxImmtblClassName.Text,
                        MtblClassName = textBoxMtblClassName.Text,
                    });

                richTextBoxResultText.Text = outputCode;
                return ActionResultH.Create(outputCode);
            },
            OnUnhandledError = exc => WinFormsMessageTuple.WithOnly(
                exc.Message, exc.Message)
        });

        private void ClearAllTypeNames() => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(ClearAllTypeNames),
            Action = () =>
            {
                this.textBoxStaticClassName.Clear();
                this.textBoxImmtblClassName.Clear();
                this.textBoxMtblClassName.Clear();

                return ActionResultH.Create(0);
            },
            OnUnhandledError = exc => WinFormsMessageTuple.WithOnly(
                exc.Message, exc.Message)
        });

        private IActionResult<string> RefreshAllTypeNames(
            ) => RefreshStaticClassName().With(result => result.IsSuccess switch
            {
                true => RefreshImmtblClassName(
                    result.Value).With(result => result.IsSuccess switch
                    {
                        true => RefreshMtblClassName(result.Value),
                    })
            });

        private IActionResult<string> RefreshStaticClassName() => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            ActionName = nameof(RefreshStaticClassName),
            Action = () =>
            {
                throw new NotImplementedException();
            },
            OnUnhandledError = exc => WinFormsMessageTuple.WithOnly(
                exc.Message, exc.Message)
        });

        private IActionResult<string> RefreshImmtblClassName(
            string staticClassName = null,
            bool forceRefreshStaticClassName = false) => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            ActionName = nameof(RefreshImmtblClassName),
            Action = () =>
            {
                if (staticClassName == null || forceRefreshStaticClassName)
                {

                }

                return ActionResultH.Create(staticClassName);
                throw new NotImplementedException();
            },
            OnUnhandledError = exc => WinFormsMessageTuple.WithOnly(
                exc.Message, exc.Message)
        });

        private IActionResult<string> RefreshMtblClassName(
            string staticClassName = null,
            bool forceRefreshStaticClassName = false) => actionComponent.Execute(new WinFormsActionOpts<string>
        {
            OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
            ActionName = nameof(RefreshMtblClassName),
            Action = () =>
            {
                if (staticClassName == null || forceRefreshStaticClassName)
                {

                }

                return ActionResultH.Create(staticClassName);
                throw new NotImplementedException();
            },
            OnUnhandledError = exc => WinFormsMessageTuple.WithOnly(
                exc.Message, exc.Message)
        });

        private CloneablesGeneratedCodeType GetSelectedCloneablesGeneratedCodeType(
            ) => (CloneablesGeneratedCodeType)comboBoxCodeType.SelectedValue;

        #region UI Event Handlers

        private void CloneablesUC_Load(object sender, EventArgs e) => actionComponent?.Execute(
            new WinFormsActionOpts<int>
            {
                Action = () =>
                {
                    controlBlinkTimersManagerAdapter = svcProv.GetRequiredService<ControlBlinkTimersManagerAdapterContainer>().Data;

                    uIThemeData = uIThemeRetriever.Data.ActWith(uiTheme =>
                    {
                        uiTheme.ApplyBgColor([
                            this.buttonGenerateCloneables,
                            this.textBoxStaticClassName,
                            this.textBoxImmtblClassName,
                            this.textBoxImmtblClassNameSuffix,
                            this.textBoxMtblClassName,
                            this.textBoxMtblClassNameSuffix,
                            this.richTextBoxSrcText,
                            this.richTextBoxResultText,
                        ], uiTheme.InputBackColor);
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

        private void ButtonGenerateCloneables_Click(object sender, EventArgs e)
        {
            GenerateCloneables();
        }

        private void RichTextBoxSrcText_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (e.Control)
                {
                    if (e.Shift)
                    {
                        RefreshAllTypeNames().With(result => result.IsSuccess switch
                        {
                            true => GenerateCloneables()
                        });
                    }
                    else
                    {
                        GenerateCloneables();
                    }
                }
            }
        }

        private void TextBoxStaticClassName_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (e.Control == false)
                {
                    if (e.Shift)
                    {
                        RefreshAllTypeNames();
                    }
                    else
                    {
                        RefreshStaticClassName();
                    }
                }
            }
        }

        private void TextBoxImmutableClassName_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (e.Control == false)
                {
                    RefreshImmtblClassName(
                        textBoxStaticClassName.Text,
                        e.Shift);
                }
            }
        }

        private void TextBoxMutableClassName_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (e.Control == false)
                {
                    RefreshMtblClassName(
                        textBoxStaticClassName.Text,
                        e.Shift);
                }
            }
        }

        private void IconLabelClearAllTypeNames_Click(object sender, EventArgs e)
        {
            ClearAllTypeNames();
        }

        private void IconLabelRefreshAllTypeNames_Click(object sender, EventArgs e)
        {
            RefreshAllTypeNames();
        }

        private void TextBoxMtblClassNameSuffix_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (e.Control == false)
                {
                    if (e.Shift)
                    {
                        RefreshAllTypeNames();
                    }
                    else
                    {
                        RefreshMtblClassName();
                    }
                }
            }
        }

        private void TextBoxImmtblClassNameSuffix_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (e.Control == false)
                {
                    if (e.Shift)
                    {
                        RefreshAllTypeNames();
                    }
                    else
                    {
                        RefreshImmtblClassName();
                    }
                }
            }
        }

        #endregion UI Event Handlers
    }
}
