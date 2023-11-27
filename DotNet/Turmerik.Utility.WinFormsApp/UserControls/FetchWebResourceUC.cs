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
using Turmerik.Utility.WinFormsApp.ViewModels;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class FetchWebResourceUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IFetchWebResourceVM viewModel;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        public FetchWebResourceUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                viewModel = svcProv.GetRequiredService<IFetchWebResourceVM>();
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
            }
        }
    }
}
