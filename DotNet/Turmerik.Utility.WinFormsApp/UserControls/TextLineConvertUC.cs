using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Code.Core;
using Turmerik.Core.Helpers;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;
using Turmerik.Core.Actions;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class TextLineConvertUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly IUISettingsRetriever uISettingsRetriever;
        private readonly IUIThemeRetriever uIThemeRetriever;
        private readonly IAppSettings appSettings;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        private readonly Lazy<NameToIdnfConverterUC> nameToIdnfConverterUC;
        private readonly Lazy<PathConverterUC> pathConverterUC;

        private readonly ReadOnlyCollection<TextLineConverterBase> textLineConverters;

        public TextLineConvertUC()
        {
            nameToIdnfConverterUC = LazyControl<NameToIdnfConverterUC>();
            pathConverterUC = LazyControl<PathConverterUC>();
            textLineConverters = GetTextLineConverters();

            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();

                uISettingsRetriever = svcProv.GetRequiredService<IUISettingsRetriever>();
                uIThemeRetriever = svcProv.GetRequiredService<IUIThemeRetriever>();
                appSettings = svcProv.GetRequiredService<IAppSettings>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());

                comboBoxConverter.DataSource = textLineConverters;
                comboBoxConverter.DisplayMember = nameof(TextLineConverterBase.Name);

                var kvp = textLineConverters.FirstKvp(
                    (converter, idx) => converter.IsSelectedValRetriever());

                if (kvp.Key >= 0)
                {
                    comboBoxConverter.SelectedIndex = kvp.Key;
                }

                comboBoxConverter.SelectedIndexChanged += ComboBoxConverter_SelectedIndexChanged;
            }
        }

        private Lazy<TControl> LazyControl<TControl>(
            Action<TControl> initializer = null)
            where TControl : Control
        {
            initializer = initializer.IfNull(() => control =>
            {
                control.Dock = DockStyle.Top;
                this.Controls.Add(control);
                this.Controls.SetChildIndex(control, 0);
            });

            var lazyControl = LazyH.Lazy(() =>
            {
                var control = Activator.CreateInstance<TControl>();
                initializer(control);

                return control;
            });

            return lazyControl;
        }

        private ReadOnlyCollection<TextLineConverterBase> GetTextLineConverters(
            ) => new TextLineConverterBase[]
            {
                GetTextLineConverter(
                    nameToIdnfConverterUC, "Name To Idnf",
                    mtbl => mtbl.NameToIdnfConverter.IsShown = true,
                    () => appSettings.Data.NameToIdnfConverter.IsShown == true),
                GetTextLineConverter(
                    pathConverterUC, "Path",
                    mtbl => mtbl.PathConverter.IsShown = true,
                    () => appSettings.Data.PathConverter.IsShown == true)
            }.RdnlC();

        private TextLineConverter<TControl> GetTextLineConverter<TControl>(
            Lazy<TControl> control, string name,
            Action<AppSettingsDataMtbl> componentSelector,
            Func<bool> isSelectedValRetriever)
            where TControl : Control => new TextLineConverter<TControl>(
                control, name, () =>
                {
                    appSettings.Update(mtbl =>
                    {
                        UnselectConverterSettings(mtbl);
                        componentSelector(mtbl);
                    });
                }, isSelectedValRetriever);

        private void UnselectConverterSettings(AppSettingsDataMtbl mtbl)
        {
            mtbl.NameToIdnfConverter.IsShown = null;
            mtbl.PathConverter.IsShown = null;
        }

        private bool HideConverterIfCreated<TControl>(
            Lazy<TControl> control) where TControl : UserControl
        {
            bool isValueCreated = control.IsValueCreated;

            if (isValueCreated)
            {
                control.Value.Hide();
            }

            return isValueCreated;
        }

        private int HideCreatedConverters()
        {
            int hiddenCount = 0;

            hiddenCount += HideConverterIfCreated(nameToIdnfConverterUC) ? 1 : 0;
            hiddenCount += HideConverterIfCreated(pathConverterUC) ? 1 : 0;

            return hiddenCount;
        }

        private int OnConverterSelected()
        {
            HideCreatedConverters();
            int selectedIdx = comboBoxConverter.SelectedIndex;

            if (selectedIdx >= 0)
            {
                var converter = textLineConverters[selectedIdx];
                var control = converter.GetControl();

                control.Show();
                this.Height = panelComboBoxConverter.Height + control.Height;

                converter.OnSelected();
            }
            else
            {
                appSettings.Update(mtbl =>
                {
                    UnselectConverterSettings(mtbl);
                });
            }

            return selectedIdx;
        }

        #region UI Event Handlers

        private void ComboBoxConverter_SelectedIndexChanged(
            object? sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
            {
                Action = () =>
                {
                    int selectedIdx = OnConverterSelected();
                    return ActionResultH.Create(selectedIdx);
                }
            });

        private void TextLineConvertUC_Load(
            object sender, EventArgs e) => actionComponent?.Execute(new WinFormsActionOpts<int>
        {
            Action = () =>
            {
                int selectedIdx = OnConverterSelected();
                return ActionResultH.Create(selectedIdx);
            }
        });
        

        #endregion UI Event Handlers
    }
}
