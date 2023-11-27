using Microsoft.Extensions.DependencyInjection;
using Turmerik.Logging;
using Turmerik.Core.Utility;
using Turmerik.DriveExplorer;
using Turmerik.LocalFileNotes.WinFormsApp.ViewModels;
using Turmerik.Logging.Dependencies;
using Turmerik.Notes.Dependencies;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;
using Turmerik.LocalFileNotes.WinFormsApp;
using Turmerik.LocalFileNotes.WinFormsApp.Settings;
using Turmerik.LocalFileNotes.WinFormsApp.Data;
using Turmerik.Core.Dependencies;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Dependencies;
using Turmerik.Notes.Core;

namespace Turmerik.LocalFilesNotes.WinFormsApp
{
    internal static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            var svcProv = RegisterServices();
            ApplicationConfiguration.Initialize();

            using (var appContext = svcProv.GetRequiredService<TrmrkApplicationContextFactory>().Create(args))
            {
                EventHandler eventHandler = null;

                eventHandler = (sender, e) =>
                {
                    appContext.ThreadExit -= eventHandler;
                };

                appContext.ThreadExit += eventHandler;
                Application.Run(appContext);
            }
        }

        private static IServiceProvider RegisterServices()
        {
            var svcProvContnr = ServiceProviderContainer.Instance.Value;

            svcProvContnr.RegisterData(
                new ServiceCollection().AsOpts(services =>
                {
                    TrmrkCoreServices.RegisterAll(services);
                    TrmrkServices.RegisterAll(services);
                    TrmrkNoteServices.RegisterAll(services);
                    TrmrkNoteServices.RegisterAppSettingsRetriever<NotesAppConfigImmtbl, NotesAppConfigMtbl>(services);

                    services.AddSingleton<IDriveItemsRetriever, FsEntriesRetriever>();
                    services.AddSingleton<IDriveExplorerService, FsExplorerService>();

                    services.AddSingleton<IAppEnv, AppEnv>();
                    LoggingServices.RegisterAll(services);

                    services.AddSingleton(
                        svcProv => svcProv.GetRequiredService<IAppLoggerCreatorFactory>().Create());

                    services.AddSingleton<IAppDataFactory, AppDataFactory>();
                    services.AddSingleton<IAppSettings, AppSettings>();

                    services.AddSingleton<UITextContentsRetriever>();

                    services.AddSingleton<INoteBookFormVM, NoteBookFormVM>();
                    services.AddSingleton<IManageNoteBooksFormVM, ManageNoteBooksFormVM>();

                    services.AddSingleton<AppArgsParser>();
                    services.AddSingleton<AppOptionsBuilder>();
                    services.AddSingleton<AppOptionsRetriever>();
                    services.AddSingleton<TrmrkApplicationContextFactory>();
                }));

            return svcProvContnr.Data;
        }
    }
}