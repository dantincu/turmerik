using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Logging;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.Logging;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public class TrmrkApplicationContext : ApplicationContext
    {
        const string LAST_RUN_CRASH_INFO_FILE_NAME = "last-run-crash-info.json";

        private readonly Type thisType;
        private readonly IJsonConversion jsonConversion;
        private readonly IExceptionSerializer exceptionSerializer;
        private readonly IAppInstanceStartInfoProvider appInstanceStartInfoProvider;
        private readonly IAppInstanceStartInfo appInstanceStartInfo;
        private readonly IAppEnv appEnv;
        private readonly IAppLoggerCreator appLoggerCreator;
        private readonly AppArgsParser appArgsParser;
        private readonly AppOptionsBuilder appOptionsBuilder;
        private readonly AppOptionsRetriever appOptionsRetriever;
        private readonly string lastRunCrashDirPath;
        private readonly string lastRunCrashFilePath;
        private readonly Mutex lastRunCrashFileMutex;
        private readonly SemaphoreSlim noteBookFormSemaphore;
        private readonly IAppLogger logger;

        private ManageNoteBooksForm manageNoteBooksForm;
        private NoteBookForm noteBookForm;

        public TrmrkApplicationContext(
            IJsonConversion jsonConversion,
            IExceptionSerializer exceptionSerializer,
            IAppInstanceStartInfoProvider appInstanceStartInfoProvider,
            IAppEnv appEnv,
            IAppLoggerCreator appLoggerCreator,
            AppArgsParser appArgsParser,
            AppOptionsBuilder appOptionsBuilder,
            AppOptionsRetriever appOptionsRetriever,
            string[] args)
        {
            thisType = GetType();

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
            this.exceptionSerializer = exceptionSerializer ?? throw new ArgumentNullException(nameof(exceptionSerializer));
            this.appInstanceStartInfoProvider = appInstanceStartInfoProvider ?? throw new ArgumentNullException(nameof(appInstanceStartInfoProvider));
            this.appEnv = appEnv ?? throw new ArgumentNullException(nameof(appEnv));
            this.appLoggerCreator = appLoggerCreator ?? throw new ArgumentNullException(nameof(appLoggerCreator));
            this.appArgsParser = appArgsParser ?? throw new ArgumentNullException(nameof(appArgsParser));
            this.appOptionsBuilder = appOptionsBuilder ?? throw new ArgumentNullException(nameof(appOptionsBuilder));
            this.appOptionsRetriever = appOptionsRetriever ?? throw new ArgumentNullException(nameof(appOptionsRetriever));

            appInstanceStartInfo = appInstanceStartInfoProvider.Data;

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

            noteBookFormSemaphore = new SemaphoreSlim(1);
            logger = appLoggerCreator.GetSharedAppLogger(thisType);

            Run(args);
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);

            if (disposing)
            {
                lastRunCrashFileMutex.Dispose();
                noteBookFormSemaphore.Dispose();
                logger.Dispose();
            }
        }

        private void Run(string[] args)
        {
            try
            {
                var appArgs = appArgsParser.Parse(args);
                var optsMtbl = GetAppOpts(logger, appArgs);
                appOptionsBuilder.BuildAsync(optsMtbl).Wait();
                var appOpts = appOptionsRetriever.RegisterData(optsMtbl);

                logger.DebugData(optsMtbl,
                    "Turmerik Local File Notes app started");

                // throw new Exception("asdfasdf");

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

                ExitApp();
                throw;
            }
        }

        private void Run(AppOptionsImmtbl opts)
        {
            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.

            // ApplicationConfiguration.Initialize();

            manageNoteBooksForm = new ManageNoteBooksForm();
            manageNoteBooksForm.NoteBookChosen += ManageNoteBooksForm_NoteBookChosen;
            manageNoteBooksForm.FormClosed += ManageNoteBooksForm_FormClosed;

            if (opts.LaunchNoteBookFormDirectly)
            {
                ShowNoteBookForm(
                    opts.NoteBookFormOpts,
                    true);
            }
            else
            {
                manageNoteBooksForm.Show();
            }

            // Application.Run(manageNoteBooksForm);
        }

        private AppOptionsMtbl GetAppOpts(
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

            return optsMtbl;
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

        private void ShowNoteBookForm(
            NoteBookFormOpts opts,
            bool showNew)
        {
            var noteBookForm = GetNoteBookForm(showNew);

            if (opts != null)
            {
                noteBookForm.SetOpts(opts);
            }

            noteBookForm.Show();
        }

        private NoteBookForm GetNoteBookForm(
            bool showNew)
        {
            NoteBookForm noteBookForm;
            noteBookFormSemaphore.Wait();

            try
            {
                if (showNew)
                {
                    this.noteBookForm?.ActWith(form =>
                    {
                        form.NoteBookMinimized -= NoteBookForm_NoteBookMinimized;
                        form.FormClosed -= NoteBookForm_FormClosed;
                        form.Dispose();
                    });

                    noteBookForm = this.noteBookForm = GetNewNoteBookForm();
                }
                else
                {
                    noteBookForm = this.noteBookForm;
                }
            }
            finally
            {
                noteBookFormSemaphore.Release();
            }

            return noteBookForm;
        }

        private NoteBookForm GetNewNoteBookForm()
        {
            var noteBookForm = new NoteBookForm();
            noteBookForm.NoteBookMinimized += NoteBookForm_NoteBookMinimized;
            noteBookForm.FormClosed += NoteBookForm_FormClosed;
            return noteBookForm;
        }

        private void ExitApp()
        {
            noteBookFormSemaphore.Wait();

            try
            {
                noteBookForm?.Dispose();
                manageNoteBooksForm?.Dispose();
            }
            finally
            {
                noteBookFormSemaphore.Release();
                ExitThread();
            }
        }

        #region UI Event Handlers

        private void ManageNoteBooksForm_NoteBookChosen(
            NoteBookFormOpts opts)
        {
            manageNoteBooksForm.Hide();
            ShowNoteBookForm(opts, true);
        }

        private void NoteBookForm_NoteBookMinimized(
            NoteBookFormOpts opts)
        {
            noteBookForm.Hide();
            manageNoteBooksForm.Show();
        }

        private void NoteBookForm_FormClosed(
            object? sender,
            FormClosedEventArgs e)
        {
            ExitThread();
        }

        private void ManageNoteBooksForm_FormClosed(
            object? sender,
            FormClosedEventArgs e)
        {
            ExitThread();
        }

        #endregion UI Event Handlers
    }
}
