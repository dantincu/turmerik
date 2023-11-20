using Microsoft.Extensions.DependencyInjection;
using Turmerik.LocalFileNotes.WinFormsApp.Dependencies;
using Turmerik.Dependencies;

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
            ServiceProviderContainer.Instance.Value.RegisterData(
                new ServiceCollection().AsOpts());

            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();
            Application.Run(new MainForm());
        }
    }
}