using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
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
using Turmerik.Core.TextSerialization;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.TestWinFormsApp
{
    public partial class RichTextBoxPseudoMarkupForm : Form
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;
        private readonly IJsonConversion jsonConversion;
        private readonly IRichTextBoxPseudoMarkupRetriever richTextBoxPseudoMarkupRetriever;
        private readonly IRichTextBoxPseudoMarkupAdapter richTextBoxPseudoMarkupAdapter;

        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        public RichTextBoxPseudoMarkupForm()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
                jsonConversion = svcProv.GetRequiredService<IJsonConversion>();
                richTextBoxPseudoMarkupRetriever = svcProv.GetRequiredService<IRichTextBoxPseudoMarkupRetriever>();
                richTextBoxPseudoMarkupAdapter = svcProv.GetRequiredService<IRichTextBoxPseudoMarkupAdapter>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
                var uITheme = UIThemeDataCore.GetDefaultData();

                var actionComponentCreator = svcProv.GetRequiredService<IWinFormsActionComponentCreator>();

                actionComponentCreator.DefaultStatusLabelOpts = new WinFormsStatusLabelActionComponentOpts
                {
                    StatusLabel = toolStripStatusLabelMain,
                    DefaultForeColor = uITheme.DefaultForeColor.Value,
                    WarningForeColor = uITheme.WarningColor.Value,
                    ErrorForeColor = uITheme.ErrorColor.Value,
                };

                actionComponent = actionComponentCreator.StatusLabel(GetType());
            }
        }

        #region UI Event Handlers

        private void ButtonRun_Click(object sender, EventArgs e) => actionComponent.Execute(
            new WinFormsActionOpts<RichTextBoxPseudoMarkupMtbl>
            {
                OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
                ActionName = nameof(ButtonRun_Click),
                Action = () =>
                {
                    var pseudoMarkup = richTextBoxPseudoMarkupRetriever.GetPseudoMarkup(
                        new RichTextBoxPseudoMarkupRetrieverOptsMtbl
                        {
                            RichTextBox = this.richTextBoxSrcRichText,
                        });

                    var pseudoMarkupJson = jsonConversion.Adapter.Serialize(pseudoMarkup);
                    richTextBoxResultJson.Text = pseudoMarkupJson;

                    richTextBoxPseudoMarkupAdapter.InsertPseudoMarkup(new RichTextBoxPseudoMarkupAdapterOptsMtbl
                    {
                        RichTextBox = richTextBoxConvertedRichText,
                        InsertIdx = int.MaxValue,
                        PseudoMarkup = pseudoMarkup
                    });

                    return ActionResultH.Create(pseudoMarkup);
                }
            });

        #endregion UI Event Handlers
    }
}
