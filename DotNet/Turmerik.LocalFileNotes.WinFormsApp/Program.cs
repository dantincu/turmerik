using Microsoft.Extensions.DependencyInjection;
using Turmerik.WinForms.Dependencies;
using Turmerik.Core.Dependencies;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Logging.Dependencies;
using Turmerik.Logging;
using Turmerik.LocalFileNotes.WinFormsApp.Settings;
using Turmerik.WinForms.Controls;
using Turmerik.Core.Helpers;
using Turmerik.WinForms.Actions;
using Turmerik.Core.Actions;
using Serilog.Core;
using System.Windows.Forms;
using Turmerik.NetCore.Md;
using Turmerik.NetCore.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Dependencies;
using Turmerik.Jint.Dependencies;
using Turmerik.LocalFileNotes.WinFormsApp.UserControls.Forms;
using Turmerik.LocalFileNotes.WinFormsApp.UserControls;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    internal static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            var svcProv = RegisterServices();

            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();

            var stoppingDialogResults = DialogResult.None.Arr(
                DialogResult.Cancel, DialogResult.Abort, DialogResult.No);

            var actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                ).MsgBox(typeof(Program));

            DialogResult dialogResult = DialogResult.Yes;

            while (!stoppingDialogResults.Contains(dialogResult))
            {
                dialogResult = TryRunApp(actionComponent);

                if (!stoppingDialogResults.Contains(dialogResult))
                {
                    dialogResult = TryRunAppRecoveryTool(actionComponent);
                }
            }
        }

        private static DialogResult TryRunApp(
            IWinFormsMsgBoxActionComponent actionComponent)
        {
            var dialogResult = DialogResult.None;

            actionComponent.Execute(new WinFormsActionOpts<int>
            {
                ActionName = "Run Application",
                Action = () =>
                {
                    Action appRecoveryToolRequested = () =>
                    {
                        dialogResult = DialogResult.Yes;
                    };

                    using (var mainForm = new MainForm())
                    {
                        mainForm.AppRecoveryToolRequested += appRecoveryToolRequested;
                        Application.Run(mainForm);

                        mainForm.AppRecoveryToolRequested -= appRecoveryToolRequested;
                    }

                    return ActionResultH.Create(0);
                },
                OnUnhandledError = exc =>
                {
                    actionComponent.Logger.Fatal(
                        exc, "An unhandled error ocurred while running the app");

                    dialogResult = MessageBox.Show(string.Join('\n',
                        $"An unhandled error ocurred while running the app: {exc.Message}.\n",
                        "Do you want to want to launch the app recovery tool or just quit the app?"),
                        "Error", MessageBoxButtons.YesNo, MessageBoxIcon.Error);

                    return WinFormsMessageTuple.WithOnly();
                }
            });

            return dialogResult;
        }

        private static DialogResult TryRunAppRecoveryTool(
            IWinFormsMsgBoxActionComponent actionComponent)
        {
            DialogResult dialogResult = DialogResult.None;

            actionComponent.Execute(new WinFormsActionOpts<int>
            {
                ActionName = "Run Application Recovery tool",
                Action = () =>
                {
                    Action appRestartRequested = () =>
                    {
                        dialogResult = DialogResult.Yes;
                    };

                    using (var appRecoveryForm = new AppRecoveryForm())
                    {
                        appRecoveryForm.AppRestartRequested += appRestartRequested;
                        Application.Run(appRecoveryForm);
                        appRecoveryForm.AppRestartRequested -= appRestartRequested;
                    }

                    return ActionResultH.Create(0);
                },
                OnUnhandledError = exc =>
                {
                    actionComponent.Logger.Fatal(
                        exc, "An unhandled error ocurred while running the app recovery tool");

                    MessageBox.Show(string.Join('\n',
                        $"An unhandled error ocurred while running the app recovery tool: {exc.Message}.\n",
                        "The app recovery tool will exit now."),
                        "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);

                    return WinFormsMessageTuple.WithOnly();
                }
            });

            return dialogResult;
        }

        private static IServiceProvider RegisterServices()
        {
            var svcProvContnr = ServiceProviderContainer.Instance.Value;

            var svcProv = svcProvContnr.RegisterData(
                new ServiceCollection().AsOpts(services =>
                {
                    TrmrkServices.RegisterAll(services);

                    DriveExplorerH.AddFsRetrieverAndExplorer(
                        services, null, true);

                    services.AddSingleton<IAppEnv, AppEnv>();
                    LoggingServices.RegisterAll(services);

                    services.AddSingleton(
                        svcProv => svcProv.GetRequiredService<IAppLoggerCreatorFactory>().Create());

                    TrmrkJintServices.RegisterAll(services);

                    services.AddSingleton<IAppDataFactory, AppDataFactory>();
                    services.AddSingleton<IAppSettings, AppSettings>();
                }));

            return svcProv;
        }
    }
}