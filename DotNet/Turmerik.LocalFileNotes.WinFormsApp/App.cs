using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Helpers;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.LocalFileNotes.WinFormsApp.ViewModels;
using Turmerik.LocalFilesNotes.WinFormsApp;
using Turmerik.Logging;
using Turmerik.Notes;
using Turmerik.TextSerialization;
using Turmerik.Utility;
using Turmerik.WinForms.Dependencies;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public partial class App : IDisposable
    {
        const string LAST_RUN_CRASH_INFO_FILE_NAME = "last-run-crash-info.json";

        private readonly Type thisType;
        private readonly IServiceProvider svcProv;
        private readonly IJsonConversion jsonConversion;
        private readonly IExceptionSerializer exceptionSerializer;
        private readonly IAppInstanceStartInfoProvider appInstanceStartInfoProvider;
        private readonly IAppInstanceStartInfo appInstanceStartInfo;
        private readonly IAppEnv appEnv;
        private readonly string lastRunCrashDirPath;
        private readonly string lastRunCrashFilePath;
        private readonly Mutex lastRunCrashFileMutex;

        private ManageNoteBooksForm manageNoteBooksForm;
        private NoteBookForm noteBookForm;

        public App()
        {
            thisType = GetType();
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            jsonConversion = svcProv.GetRequiredService<IJsonConversion>();
            exceptionSerializer = svcProv.GetRequiredService<IExceptionSerializer>();
            appInstanceStartInfoProvider = svcProv.GetRequiredService<IAppInstanceStartInfoProvider>();
            appInstanceStartInfo = appInstanceStartInfoProvider.Data;
            appEnv = svcProv.GetRequiredService<IAppEnv>();

            lastRunCrashDirPath = appEnv.GetTypePath(
                AppEnvDir.Data,
                thisType);

            Directory.CreateDirectory(
                lastRunCrashDirPath);

            lastRunCrashFilePath = Path.Combine(
                lastRunCrashDirPath,
                LAST_RUN_CRASH_INFO_FILE_NAME);

            lastRunCrashFileMutex = MutexH.Create(
                lastRunCrashFilePath);
        }

        public void Dispose()
        {
            lastRunCrashFileMutex.Dispose();
        }

        public void Run(string[] args)
        {
            var appLoggerCreator = svcProv.GetRequiredService<IAppLoggerCreator>();

            using (var logger = appLoggerCreator.GetSharedAppLogger(thisType))
            {
                try
                {
                    var appArgs = svcProv.GetRequiredService<AppArgsParser>().Parse(args);
                    var appOpts = GetAppOpts(logger, appArgs);

                    logger.DebugData(appOpts,
                        "Turmerik Local File Notes app started");

                    Run(appOpts);
                    logger.Debug("Turmerik Local File Notes app closed");
                }
                catch (Exception ex)
                {
                    logger.Fatal(ex, "An unhandled error ocurred and Turmerik Local File Notes app crashed");
                    TryWriteLastRunCrahedInfo(ex, logger);

                    MessageBox.Show(
                        "An unexpected error ocurred and Turmerik Local File Notes needs to exit",
                        "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void Run(AppOptionsImmtbl opts)
        {
            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.

            ApplicationConfiguration.Initialize();

            manageNoteBooksForm = new ManageNoteBooksForm();
            manageNoteBooksForm.SetAppOpts(opts);

            manageNoteBooksForm.NoteBookChosen += ManageNoteBooksForm_NoteBookChosen;
            Application.Run(manageNoteBooksForm);
        }

        private AppOptionsImmtbl GetAppOpts(
            IAppLogger logger,
            AppArgsMtbl appArgs)
        {
            bool lastRunCrashed = TryReadLastRunCrashedInfo(
                logger, out var lastRunCrashInfo);

            var optsMtbl = new AppOptionsMtbl
            {
                Args = appArgs,
                LastRunCrashed = lastRunCrashed,
                LastRunCrashInfo = lastRunCrashInfo
            };

            var opts = new AppOptionsImmtbl(optsMtbl);
            return opts;
        }

        private bool TryReadLastRunCrashedInfo(
            IAppLogger logger,
            out LastRunCrashedInfoMtbl info,
            bool deleteAfterRead = true)
        {
            bool lastRunCrashed;
            bool fileExists = false;
            info = null;
            lastRunCrashFileMutex.WaitOne();

            try
            {
                fileExists = File.Exists(lastRunCrashFilePath);
                lastRunCrashed = fileExists;
            }
            catch (Exception exc)
            {
                lastRunCrashed = true;

                logger.Error(exc,
                    "Could not check if last run crashed info file at {0} exists",
                    lastRunCrashFilePath);
            }

            try
            {
                if (fileExists)
                {
                    string json = File.ReadAllText(lastRunCrashFilePath);

                    if (deleteAfterRead)
                    {
                        File.Delete(lastRunCrashFilePath);
                    }

                    info = jsonConversion.Adapter.Deserialize<LastRunCrashedInfoMtbl>(json);
                }
            }
            catch (Exception exc)
            {
                logger.Error(exc,
                    "Could not read existing last run crashed info file at {0}",
                    lastRunCrashFilePath);
            }
            finally
            {
                lastRunCrashFileMutex.ReleaseMutex();
            }

            return lastRunCrashed;
        }

        private void TryWriteLastRunCrahedInfo(
            Exception exc,
            IAppLogger logger)
        {
            var info = new LastRunCrashedInfoMtbl
            {
                AppInstanceStartInfo = appInstanceStartInfo.ToMtbl(),
                CrashMoment = DateTime.UtcNow,
                UnhandledException = exceptionSerializer.SerializeException(exc)
            };

            TryWriteLastRunCrahedInfo(info, logger);
        }

        private void TryWriteLastRunCrahedInfo(
            LastRunCrashedInfoMtbl info,
            IAppLogger logger)
        {
            lastRunCrashFileMutex.WaitOne();

            try
            {
                string json = jsonConversion.Adapter.Serialize(info);
                File.WriteAllText(lastRunCrashFilePath, json);
            }
            catch (Exception exc)
            {
                logger.Error(exc,
                    "Could not write last run crashed info file at {0}",
                    lastRunCrashFilePath);
            }
            finally
            {
                lastRunCrashFileMutex.ReleaseMutex();
            }
        }

        #region UI Event Handlers

        private void ManageNoteBooksForm_NoteBookChosen(
            NoteBookFormOpts opts)
        {
            manageNoteBooksForm.Hide();

            if (opts != null)
            {
                noteBookForm = new NoteBookForm();
                noteBookForm.SetOpts(opts);
                noteBookForm.NoteBookMinimized += NoteBookForm_NoteBookMinimized;
                noteBookForm.Show();
            }
            else
            {
                noteBookForm.Show();
            }
        }

        private void NoteBookForm_NoteBookMinimized(
            NoteBookFormOpts opts)
        {
            noteBookForm.Hide();
            manageNoteBooksForm.Show();
        }

        #endregion UI Event Handlers
    }
}
