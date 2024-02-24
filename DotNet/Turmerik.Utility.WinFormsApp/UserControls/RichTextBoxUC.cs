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
using Turmerik.Ux;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class RichTextBoxUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;

        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private IWinFormsStatusLabelActionComponent actionComponent;

        public RichTextBoxUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
                iconLabelIncreaseZoomFactory.Text = MatUIIconUnicodesH.UIActions.ADD;
                iconLabelDecreaseZoomFactory.Text = MatUIIconUnicodesH.UIActions.REMOVE;

                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                    ).StatusLabel(GetType());
            }
        }

        public RichTextBox RichTextBox => richTextBox;

        public IWinFormsStatusLabelActionComponent ActionComponent => actionComponent;

        public void SetActionComponent(
            IWinFormsStatusLabelActionComponent actionComponent)
        {
            this.actionComponent = actionComponent;
        }

        private IActionResult<float> TrySetZoomFactor(
            Func<float, float> newValueFactory = null) => actionComponent.Execute(
                new WinFormsActionOpts<float>
                {
                    ActionName = nameof(TrySetZoomFactor),
                    OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(" "),
                    Action = () =>
                    {
                        float newValue;

                        if (newValueFactory == null)
                        {
                            newValue = float.Parse(
                                textBoxNewZoomValue.Text);

                            newValue = newValue / 100;
                        }
                        else
                        {
                            newValue = newValueFactory(
                                richTextBox.ZoomFactor);
                        }

                        richTextBox.ZoomFactor = newValue;

                        string newValueStr = Convert.ToInt32(
                            Math.Round(newValue * 100)).ToString();

                        textBoxNewZoomValue.Text = newValueStr;
                        labelZoomValue.Text = $"{newValueStr}%";

                        return ActionResultH.Create(newValue);
                    }
                });

        #region UI Event Handlers

        private void TextBoxSrcTextBoxNewZoomValue_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                TrySetZoomFactor();
            }
        }

        private void IconLabelSrcTextBoxIncreaseZoomFactory_Click(object sender, EventArgs e)
        {
            TrySetZoomFactor(zoomFactor => zoomFactor * 1.25F);
        }

        private void IconLabelSrcTextBoxDecreaseZoomFactory_Click(object sender, EventArgs e)
        {
            TrySetZoomFactor(zoomFactor => zoomFactor / 1.25F);
        }

        private void RichTextBox_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Control && e.Alt)
            {
                switch (e.KeyCode)
                {
                    case Keys.Add:
                    case Keys.A:
                        TrySetZoomFactor(
                            zoomFactor => zoomFactor * 1.25F);
                        break;
                    case Keys.Subtract:
                    case Keys.S:
                        TrySetZoomFactor(
                            zoomFactor => zoomFactor / 1.25F);
                        break;
                }

                richTextBox.Focus();
            }
        }

        #endregion UI Event Handlers
    }
}
