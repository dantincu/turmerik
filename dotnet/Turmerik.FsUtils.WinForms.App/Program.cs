using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Core.Infrastucture;

namespace Turmerik.FsUtils.WinForms.App
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            var services = new ServiceCollection();
            TrmrkCoreServiceCollectionBuilder.RegisterAll(services);

            services.AddSingleton<MainFormViewModel>();
            services.AddSingleton<MainFormEventsViewModel>();
            services.AddTransient<FsExplorerViewModel>();

            ServiceProviderContainer.Instance.Value.RegisterServices(services);
            ServiceProviderContainer.Instance.Value.IsDesignMode = false;

            Application.EnableVisualStyles();

            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm(args));
        }
    }
}
