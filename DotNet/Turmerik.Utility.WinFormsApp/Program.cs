using Microsoft.Extensions.DependencyInjection;
using Turmerik.WinForms.Dependencies;
using Turmerik.Core.Dependencies;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Logging.Dependencies;
using Turmerik.Logging;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Utility.WinFormsApp.UserControls;
using Turmerik.Utility.WinFormsApp.Services;
using Turmerik.WinForms.Controls;
using Turmerik.Core.Helpers;
using Turmerik.WinForms.Actions;
using Turmerik.Core.Actions;
using Serilog.Core;
using Turmerik.Utility.WinFormsApp.UserControls.Forms;

namespace Turmerik.Utility.WinFormsApp
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
            var appCrashDialogResult = DialogResult.None;

            actionComponent.Execute(new WinFormsActionOpts<int>
            {
                ActionName = "Run Application",
                Action = () =>
                {
                    Application.Run(new MainForm());
                    return ActionResultH.Create(0);
                },
                OnUnhandledError = exc =>
                {
                    actionComponent.Logger.Fatal(
                        exc, "An unhandled error ocurred while running the app");

                    appCrashDialogResult = MessageBox.Show(string.Join('\n',
                        $"An unhandled error ocurred while running the app: {exc.Message}.\n",
                        "Do you want to want to launch the app recovery tool or just quit the app?"),
                        "Error", MessageBoxButtons.YesNo, MessageBoxIcon.Error);

                    return WinFormsMessageTuple.WithOnly();
                }
            });

            return appCrashDialogResult;
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

            var svcProv  = svcProvContnr.RegisterData(
                new ServiceCollection().AsOpts(services =>
                {
                    TrmrkServices.RegisterAll(services);
                    services.AddSingleton<IDriveItemsRetriever, FsEntriesRetriever>();
                    services.AddSingleton<IDriveExplorerService, FsExplorerService>();

                    services.AddSingleton<IAppEnv, AppEnv>();
                    LoggingServices.RegisterAll(services);

                    services.AddSingleton(
                        svcProv => svcProv.GetRequiredService<IAppLoggerCreatorFactory>().Create());

                    services.AddSingleton<IAppDataFactory, AppDataFactory>();
                    services.AddSingleton<IAppSettings, AppSettings>();
                    services.AddSingleton<IUISettingsRetriever, UISettingsRetriever>();
                    services.AddSingleton<IUIThemeRetriever, UIThemeRetriever>();
                    services.AddSingleton<ControlBlinkTimersManagerAdapterFactory>();
                    services.AddSingleton<ControlBlinkTimersManagerAdapterContainer>();
                    services.AddSingleton<TextToMdService>();
                    services.AddSingleton<ToolTipHintsOrchestratorRetriever>();
                }));

            return svcProv;
        }
    }
}