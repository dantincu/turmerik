using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Core.FsExplorer.Background.AspNetCore;
using Turmerik.Core.Infrastucture;
using Turmerik.FileExplorer.WinFormsCore.App.Properties;
using Turmerik.FileExplorer.WinFormsCore.App;

namespace Turmerik.FileExplorer.WinFormsCore.App
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            var programArgs = new ProgramArgsParser().Parse(args);

            var services = new ServiceCollection();
            TrmrkCoreServiceCollectionBuilder.RegisterAll(services);

            services.AddSingleton(programArgs);
            services.AddSingleton<MainFormViewModel>();
            services.AddSingleton<MainFormEventsViewModel>();
            services.AddTransient<FsExplorerViewModel>();

            ServiceProviderContainer.Instance.Value.RegisterServices(services);
            ServiceProviderContainer.Instance.Value.IsDesignMode = false;

            bool openMainForm = true; //!programArgs.IsSingleInstance;
            // HubConnection connection = null;

            try
            {
                /* if (programArgs.IsSingleInstance)
                {
                    /* string uri = string.Concat(
                        Settings.Default.BackgroundAspNetCoreAppBaseUri,
                        HubsH.MAIN_HUB_ADDRESS); * /

                    string uri = Settings.Default.BackgroundAspNetCoreAppBaseUri;

                    connection = new HubConnection(uri);

                    //Make proxy to hub based on hub name on server
                    var mainHub = connection.CreateHubProxy(HubsH.MAIN_HUB_ADDRESS);
                    bool connected = false;

                    //Start connection
                    connection.Start().ContinueWith(task =>
                    {
                        if (task.IsFaulted)
                        {
                            MessageBox.Show(
                                string.Format(
                                "There was an error opening the connection:{0}",
                                task.Exception.GetBaseException()),
                                "Error",
                                MessageBoxButtons.OK,
                                MessageBoxIcon.Error);
                        }
                        else
                        {
                            connected = true;
                        }
                    }).Wait();

                    openMainForm = connected;
                } */

                if (openMainForm)
                {
                    Application.EnableVisualStyles();
                    Application.SetCompatibleTextRenderingDefault(false);

                    Application.Run(new MainForm());
                }
            }
            finally
            {
                // connection?.Dispose();
            }
        }
    }
}
