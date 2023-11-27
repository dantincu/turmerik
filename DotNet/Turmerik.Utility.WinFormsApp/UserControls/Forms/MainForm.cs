using Microsoft.Extensions.DependencyInjection;
using Turmerik.Utility.WinFormsApp.ViewModels;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp
{
    public partial class MainForm : Form
    {
        private readonly IServiceProvider svcProv;
        private readonly IMainFormVM viewModel;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        public MainForm()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            viewModel = svcProv.GetRequiredService<IMainFormVM>();
            matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();

            InitializeComponent();
        }
    }
}
