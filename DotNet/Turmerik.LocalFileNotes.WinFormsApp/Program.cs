using Microsoft.Extensions.DependencyInjection;
using Turmerik.LocalFileNotes.WinFormsApp.Dependencies;
using Turmerik.Dependencies;
using Turmerik.Logging;
using Turmerik.Utility;

namespace Turmerik.LocalFilesNotes.WinFormsApp
{
    internal static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            var svcProvContnr = ServiceProviderContainer.Instance.Value;

            svcProvContnr.RegisterData(
                new ServiceCollection().AsOpts());

            var svcProv = svcProvContnr.Data;
            var appLoggerCreator = svcProv.GetRequiredService<IAppLoggerCreatorFactory>().Create(true);

            using (var logger = appLoggerCreator.GetSharedAppLogger(typeof(Program)))
            {
                try
                {
                    var appInstanceStartInfo = svcProv.GetRequiredService<IAppInstanceStartInfoProvider>();

                    logger.DebugData(
                        appInstanceStartInfo.Data,
                        "Turmerik Local File Notes app started");
                    // To customize application configuration such as set high DPI settings or default font,
                    // see https://aka.ms/applicationconfiguration.
                    
                    ApplicationConfiguration.Initialize();
                    Application.Run(new MainForm());

                    logger.Debug("Turmerik Local File Notes app closed");
                }
                catch (Exception ex)
                {
                    logger.Fatal(ex, "An unhandled error ocurred and Turmerik Local File Notes app crashed");

                    MessageBox.Show(
                        "An unexpected error ocurred and Turmerik Local File Notes needs to exit",
                        "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }
    }
}