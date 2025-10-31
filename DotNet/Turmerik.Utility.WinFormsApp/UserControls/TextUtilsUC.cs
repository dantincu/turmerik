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
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class TextUtilsUC : UserControl, IMainFormTabPageContentControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        public TextUtilsUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
            }

            InitializeComponent();
            textLineConvertUC.SizeChanged += TextLineConvertUC_SizeChanged;

            if (svcProvContnr.IsRegistered)
            {
            }
        }

        public Control RefUxControl => fetchWebResourceUC.RefUxControl;
        public IconLabel AltRefUxControl => fetchWebResourceUC.AltRefUxControl;

        public void GoToWebResourceUrlTool() => fetchWebResourceUC.GoToWebResourceUrlTool();
        public void GoToMarkdownSourceText() => textToMdUC.GoToMarkdownSourceText();
        public void GoToMarkdownResultText() => textToMdUC.GoToMarkdownResultText();

        public void HandleKeyDown(KeyEventArgs e)
        {
        }

        #region UI Event Handlers

        private void TextLineConvertUC_SizeChanged(object? sender, EventArgs e)
        {
            groupBoxTextLineConvert.Height = textLineConvertUC.Height + 30;
        }

        #endregion UI Event Handlers
    }
}
