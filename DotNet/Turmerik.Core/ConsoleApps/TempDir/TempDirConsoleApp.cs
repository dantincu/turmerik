using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Utility;

namespace Turmerik.Core.ConsoleApps.TempDir
{
    public interface ITempDirConsoleApp
    {
        void Run(TempDirConsoleAppOpts opts);
        Task RunAsync(TempDirAsyncConsoleAppOpts opts);
    }

    public class TempDirConsoleApp : ITempDirConsoleApp
    {
        private readonly ITrmrkUniqueDirCreator trmrkUniqueDirCreator;

        public TempDirConsoleApp(
            ITrmrkUniqueDirCreator trmrkUniqueDirCreator)
        {
            this.trmrkUniqueDirCreator = trmrkUniqueDirCreator ?? throw new ArgumentNullException(
                nameof(trmrkUniqueDirCreator));
        }

        public async void Run(
            TempDirConsoleAppOpts opts)
        {
            var tempDir = TryCreateTempDir(opts);

            if (tempDir != null)
            {
                try
                {
                    opts.Action(tempDir);
                }
                catch (Exception exc)
                {
                    if (OnUnhandledExc(
                        opts.OnActionCrash,
                        opts.RethrowActionExc,
                        tempDir,
                        exc))
                    {
                        throw;
                    }
                }
                finally
                {
                    DeleteTempDirIfReq(opts, tempDir);
                }
            }
        }

        public async Task RunAsync(
            TempDirAsyncConsoleAppOpts opts)
        {
            var tempDir = TryCreateTempDir(opts);

            if (tempDir != null)
            {
                try
                {
                    await opts.Action(tempDir);
                }
                catch (Exception exc)
                {
                    if (OnUnhandledExc(
                        opts.OnActionCrash,
                        opts.RethrowActionExc,
                        tempDir,
                        exc))
                    {
                        throw;
                    }
                }
                finally
                {
                    DeleteTempDirIfReq(opts, tempDir);
                }
            }
        }

        private bool OnUnhandledExc(
            Action<TrmrkUniqueDir, Exception> excHandler,
            bool? rethrowExc,
            TrmrkUniqueDir trmrkUniqueDir,
            Exception exc)
        {
            if (excHandler != null)
            {
                excHandler(trmrkUniqueDir, exc);
            }
            else
            {
                ConsoleH.WithExcp(exc,
                    msgCaption: "An unhandled exception occurred");
            }

            bool rethrowErr = rethrowExc ?? (rethrowExc == null);
            return rethrowErr;
        }

        private TrmrkUniqueDir TryCreateTempDir(
            TempDirConsoleAppOptsCore opts)
        {
            TrmrkUniqueDir tempDir = null;

            try
            {
                opts.TempDirOpts.CreateDirectory = false;

                tempDir = trmrkUniqueDirCreator.CreateTrmrkUniqueDir(
                    opts.TempDirOpts);

                Directory.CreateDirectory(
                    Path.GetDirectoryName(
                        tempDir.DirPath));

                DeleteExistingTempDirsIfReq(opts, tempDir);
                Directory.CreateDirectory(tempDir.DirPath);

            }
            catch (Exception exc)
            {
                if (OnUnhandledExc(
                        opts.OnBeforeActionCrash,
                        opts.RethrowBeforeActionExc,
                        tempDir,
                        exc))
                {
                    throw;
                }
            }

            return tempDir;
        }

        private bool DeleteExistingTempDirsIfReq(
            TempDirConsoleAppOptsCore opts,
            TrmrkUniqueDir trmrkUniqueDir) => DeleteTempDirsIfReq(
                opts.RemoveExistingTempDirsBeforeAction,
                () => Directory.GetFileSystemEntries(
                    Path.GetDirectoryName(
                        trmrkUniqueDir.DirPath)),
                true);

        private bool DeleteTempDirIfReq(
            TempDirConsoleAppOptsCore opts,
            TrmrkUniqueDir trmrkUniqueDir) => DeleteTempDirsIfReq(
                opts.RemoveTempDirAfterAction,
                () => [trmrkUniqueDir.DirPath],
                false);

        private bool DeleteTempDirsIfReq(
            bool? condition,
            Func<string[]> dirNamesToRemoveFactory,
            bool onBeforeAction)
        {
            bool exitProgram = false;

            if (condition != false)
            {
                var dirNamesToRemoveArr = dirNamesToRemoveFactory.Invoke();

                if (dirNamesToRemoveArr.Any())
                {
                    exitProgram = DeleteTempDirsIfReq(
                        dirNamesToRemoveArr,
                        onBeforeAction,
                        condition != true);
                }
            }

            return exitProgram;
        }

        private bool DeleteTempDirsIfReq(
            string[] dirNamesToRemoveArr,
            bool onBeforeAction,
            bool askForConfirmation)
        {
            bool removeDirs = true;

            bool exitProgram = PrintExistingTempDirNames(
                dirNamesToRemoveArr,
                onBeforeAction,
                askForConfirmation,
                ref removeDirs);

            if (removeDirs)
            {
                exitProgram = DeleteTempDirs(
                    dirNamesToRemoveArr,
                    onBeforeAction);
            }

            return exitProgram;
        }

        private bool DeleteTempDirs(
            string[] dirNamesToRemoveArr,
            bool onBeforeAction)
        {
            bool tryAgain = true;
            bool exitProgram = false;

            while (tryAgain)
            {
                try
                {
                    DeleteTempDirsCore(
                        dirNamesToRemoveArr,
                        onBeforeAction);

                    tryAgain = false;
                }
                catch (Exception ex)
                {
                    exitProgram = HandleDeleteTempDirsErr(
                        ex, onBeforeAction, ref tryAgain);
                }
            }

            return exitProgram;
        }

        private void DeleteTempDirsCore(
            string[] dirNamesToRemoveArr,
            bool onBeforeAction)
        {
            Console.WriteLine();
            Console.ResetColor();

            Console.WriteLine(onBeforeAction switch
            {
                true => "Deleting existing temp folders before executing this app",
                false => "Deleting the temp folder this app has been using"
            });

            Console.WriteLine();

            foreach (var dirPath in dirNamesToRemoveArr)
            {
                Directory.Delete(dirPath, true);
            }

            Console.WriteLine(onBeforeAction switch
            {
                true => "Successfully deleted existing temp folders before executing this app",
                false => "Successfully deleted the temp folder this app has been using"
            });
        }

        private bool HandleDeleteTempDirsErr(
            Exception ex,
            bool onBeforeAction,
            ref bool tryAgain)
        {
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.DarkRed;

            Console.WriteLine(onBeforeAction switch
            {
                true => "An unhandled error has occurred while trying to delete existing temp folders before executing this app",
                false => "An unhandled error has occurred while trying to delete the temp folder this app has been using"
            });

            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.DarkRed;

            Console.WriteLine(onBeforeAction switch
            {
                true => "Do you want this app to try deleting existing temp folders again?",
                false => "Do you want this app to try deleting the temp folder again?"
            });

            Console.WriteLine(onBeforeAction switch
            {
                true => string.Join(" ",
                    "Type Y to try again, X to exit the program,",
                    "or anything else to leave the existing folders as they are and move on the executing the app"),
                false => string.Join(" ",
                    "Type Y to try again",
                    "or anything else to leave the existing folders as they are and exit the program")
            });

            Console.ResetColor();

            string answer = Console.ReadLine().ToUpper();
            bool exitProgram = answer == "X";

            tryAgain = answer == "Y";
            return exitProgram;
        }

        private bool PrintExistingTempDirNames(
            string[] dirNamesToRemoveArr,
            bool onBeforeAction,
            bool askForConfirmation,
            ref bool removeDirs)
        {
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.DarkYellow;

            Console.WriteLine(onBeforeAction switch
            {
                true => "Found the following existing temp dirs:",
                false => "The following temp folder has been used to execute this app:"
            });

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Yellow;

            foreach (var dirName in dirNamesToRemoveArr)
            {
                Console.WriteLine(dirName);
            }

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.DarkYellow;

            bool exitProgram = false;

            if (askForConfirmation)
            {
                Console.WriteLine(string.Join(" ",
                    onBeforeAction switch
                    {
                        true => "Do you want these folders removed before executing this app?",
                        false => "Do you want this folder removed before exiting this app?"
                    },
                    onBeforeAction switch
                    {
                        true => "Type Y to confirm, X to exit the program, or anything else to not remove any folder.",
                        false => "Type Y to confirm or anything else to not exit the program."
                    }));

                string answer = Console.ReadLine();
                removeDirs = answer.ToUpper() == "Y";
                exitProgram = answer == "X";
            }

            return exitProgram;
        }
    }
}
