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
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class CloneablesUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private readonly ICloneableTypesCodeGenerator cloneableTypesCodeGenerator;

        public CloneablesUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
                cloneableTypesCodeGenerator = svcProv.GetRequiredService<ICloneableTypesCodeGenerator>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
            }
        }

        #region UI Event Handlers

        private void ButtonGenerateCloneables_Click(object sender, EventArgs e)
        {

        }

        private void TextBoxStaticClassName_TextChanged(object sender, EventArgs e)
        {

        }

        private void TextBoxImmutableClassName_TextChanged(object sender, EventArgs e)
        {

        }

        private void TextBoxMutableClassName_TextChanged(object sender, EventArgs e)
        {

        }

        #endregion UI Event Handlers
    }
}
