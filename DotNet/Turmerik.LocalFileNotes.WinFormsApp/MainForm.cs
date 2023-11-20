using Microsoft.Extensions.DependencyInjection;
using Turmerik.LocalFileNotes.WinFormsApp.Dependencies;
using Turmerik.WinForms.Actions;

namespace Turmerik.LocalFilesNotes.WinFormsApp
{
    public partial class MainForm : Form
    {
        private readonly IServiceProvider svcProv;
        private readonly IWinFormsActionComponent actionComponent;

        public MainForm()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>().Create(GetType());

            InitializeComponent();
        }
    }
}
