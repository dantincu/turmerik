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
using Turmerik.LocalFileNotes.WinFormsApp.Data;
using Turmerik.WinForms.Dependencies;
using Turmerik.Core.Helpers;

namespace Turmerik.LocalFileNotes.WinFormsApp.UserControls
{
    public partial class ClearAppDataUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;

        private readonly UITextContentsImmtbl uITextContents;
        private readonly UITextContents.SettingsImmtbl uITextContentsSettings;
        private readonly UITextContents.ResetAppDataImmtbl uITextContentsResetAppData;

        private Action clearAppDataBtnClick;

        public ClearAppDataUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                uITextContents = svcProv.GetRequiredService<UITextContentsRetriever>().Data.Value;
                uITextContentsSettings = uITextContents.Settings;
                uITextContentsResetAppData = uITextContentsSettings.ResetAppData;
            }

            InitializeComponent();

            labelExplanation.Visible = false;
            OnLabelExplanationHidden();

            if (svcProvContnr.IsRegistered)
            {
                labelExplanation.Text = uITextContentsResetAppData.ExplanationText;
                iconLabelToggleExplanationLabel.Text = "\ueb8b";
            }
        }

        public event Action ClearAppDataBtnClick
        {
            add => clearAppDataBtnClick += value;
            remove => clearAppDataBtnClick -= value;
        }

        private void OnLabelExplanationVisible()
        {
            this.Height = labelExplanation.Height + panelButton.Height;
        }

        private void OnLabelExplanationHidden()
        {
            this.Height = panelButton.Height;
        }

        #region UI Event Handlers

        private void IconLabelToggleExplanationLabel_Click(object sender, EventArgs e)
        {
            (labelExplanation.Visible = !labelExplanation.Visible).ActIf(
                OnLabelExplanationVisible,
                OnLabelExplanationHidden);
        }

        private void ButtonClearAppData_Click(object sender, EventArgs e)
        {
            clearAppDataBtnClick?.Invoke();
        }

        #endregion UI Event Handlers
    }
}
