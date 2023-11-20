using Turmerik.LocalFileNotes.WinFormsApp.Dependencies;

namespace Turmerik.LocalFilesNotes.WinFormsApp
{
    public partial class MainForm : Form
    {
        private readonly IServiceProvider svcProv;

        public MainForm()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;

            InitializeComponent();
        }
    }
}
