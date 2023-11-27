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

namespace Turmerik.Utility.WinFormsApp.ViewModels
{
    public partial class MdTableLinesUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IMdTableLinesVM viewModel;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        public MdTableLinesUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                viewModel = svcProv.GetRequiredService<IMdTableLinesVM>();
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
            }

            InitializeComponent();

            if (svcProvContnr.IsRegistered)
            {
            }
        }
    }
}
