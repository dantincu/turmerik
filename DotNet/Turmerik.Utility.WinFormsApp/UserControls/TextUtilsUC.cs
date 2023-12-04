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
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;
using static Turmerik.WinForms.Controls.UISettingsDataCore;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class TextUtilsUC : UserControl
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

            if (svcProvContnr.IsRegistered)
            {
            }
        }

        public Control RefUxControl => fetchWebResourceUC.RefUxControl;

        public void GoToWebResourceUrlTool() => fetchWebResourceUC.GoToWebResourceUrlTool();
        public void GoToMarkdownSourceText() => textToMdUC.GoToMarkdownSourceText();
        public void GoToMarkdownResultText() => textToMdUC.GoToMarkdownResultText();
    }
}
