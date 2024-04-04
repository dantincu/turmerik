using Microsoft.Extensions.DependencyInjection;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Turmerik.LocalFileNotes.WpfApp.ViewModels;
using Turmerik.WpfLibrary.Dependencies;

namespace Turmerik.LocalFileNotes.WpfApp
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private IServiceProvider SvcProv => ServiceProviderContainer.Instance.Value.Data;
        private MainWindowVM viewModel;

        public MainWindow()
        {
            InitializeComponent();
            viewModel = (MainWindowVM)DataContext;
            viewModel.FirstName = "Daniel";

            // vm.FirstName = "Daniel";
            Uri iconUri = new Uri("pack://siteoforigin:,,,/Assets/Icons/Icon-32x32.ico", UriKind.RelativeOrAbsolute);
            this.Icon = BitmapFrame.Create(iconUri);
        }
    }
}