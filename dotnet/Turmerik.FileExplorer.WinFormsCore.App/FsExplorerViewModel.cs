using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.FileExplorer.WinFormsCore.App.Properties;
using static System.Environment;

namespace Turmerik.FsUtils.WinForms.App
{
    public class FsExplorerViewModel
    {
        public const string ROOT_FOLDER_NAME = "This PC";

        private readonly ConcurrentStack<string> backHistoryStack;
        private readonly ConcurrentStack<string> forwardHistoryStack;

        private Action fsEntriesRefreshed;
        private Action currentFsDirNameChanged;

        public FsExplorerViewModel(
            MainFormEventsViewModel eventsViewModel,
            IFsPathNormalizer fsPathNormalizer,
            ITimeStampHelper timeStampHelper)
        {
            this.EventsViewModel = eventsViewModel ?? throw new ArgumentNullException(nameof(eventsViewModel));
            this.FsPathNormalizer = fsPathNormalizer ?? throw new ArgumentNullException(nameof(fsPathNormalizer));
            this.TimeStampHelper = timeStampHelper ?? throw new ArgumentNullException(nameof(timeStampHelper));

            backHistoryStack = new ConcurrentStack<string>();
            forwardHistoryStack = new ConcurrentStack<string>();

            Uuid = Guid.NewGuid();
        }

        public Guid Uuid { get; }
        public IFsPathNormalizer FsPathNormalizer { get; }
        public ITimeStampHelper TimeStampHelper { get; }
        public MainFormEventsViewModel EventsViewModel { get; }

        public bool IsRootFolder { get; private set; }
        public string CurrentDirName { get; private set; }
        public string CurrentDirPath { get; private set; }
        public string CurrentDirVPath { get; private set; }

        public bool HistoryBackButtonEnabled { get; private set; }
        public bool HistoryForwardButtonEnabled { get; private set; }
        public bool GoToParentDirButtonEnabled { get; private set; }

        public ReadOnlyCollection<IFsItem> FsDirectoryEntries { get; private set; }
        public ReadOnlyCollection<IFsItem> FsFileEntries { get; private set; }

        private List<FsItemMtbl> EditableFsDirectoryEntries { get; set; }
        private List<FsItemMtbl> EditableFsFileEntries { get; set; }


        public event Action FsEntriesRefreshed
        {
            add
            {
                fsEntriesRefreshed += value;
            }

            remove
            {
                fsEntriesRefreshed -= value;
            }
        }

        public event Action CurrentFsDirNameChanged
        {
            add
            {
                currentFsDirNameChanged += value;
            }

            remove
            {
                currentFsDirNameChanged -= value;
            }
        }

        public Tuple<bool, string> Init(string currentDirPath)
        {
            HistoryBackButtonEnabled = false;
            HistoryForwardButtonEnabled = false;

            NavigateToFolderCore(currentDirPath);
            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> NavigateToHistoryBack()
        {
            string folderPath;
            bool isValid = backHistoryStack.TryPop(out folderPath);

            if (isValid)
            {
                HistoryBackButtonEnabled = backHistoryStack.Any();
                HistoryForwardButtonEnabled = true;

                forwardHistoryStack.Push(CurrentDirPath);
                NavigateToFolderCore(folderPath);
            }

            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> NavigateToHistoryForward()
        {
            string folderPath;
            bool isValid = forwardHistoryStack.TryPop(out folderPath);

            if (isValid)
            {
                HistoryForwardButtonEnabled = forwardHistoryStack.Any();
                HistoryBackButtonEnabled = true;

                backHistoryStack.Push(CurrentDirPath);
                NavigateToFolderCore(folderPath);
            }

            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> NavigateToRoot()
        {
            forwardHistoryStack.Clear();
            HistoryForwardButtonEnabled = false;

            HistoryBackButtonEnabled = true;

            backHistoryStack.Push(CurrentDirPath);
            NavigateToFolderCore(string.Empty);

            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> NavigateToParentFolder()
        {
            forwardHistoryStack.Clear();
            HistoryForwardButtonEnabled = false;

            HistoryBackButtonEnabled = true;

            backHistoryStack.Push(CurrentDirPath);
            string folderPath = CurrentDirPath.GetDirPath();

            NavigateToFolderCore(folderPath);
            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> NavigateToSubFolder(string folderName)
        {
            forwardHistoryStack.Clear();
            HistoryForwardButtonEnabled = false;

            HistoryBackButtonEnabled = true;
            backHistoryStack.Push(CurrentDirPath);

            string folderPath = Path.Combine(CurrentDirPath, folderName);
            NavigateToFolderCore(folderPath);

            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> NavigateToFolder(string folderPath)
        {
            forwardHistoryStack.Clear();
            HistoryForwardButtonEnabled = false;

            HistoryBackButtonEnabled = true;
            backHistoryStack.Push(CurrentDirPath);

            NavigateToFolderCore(folderPath);
            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> ReloadCurrentFolder()
        {
            NavigateToFolderCore(CurrentDirPath);
            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> OpenFileInOSDefaultApp(string fileName)
        {
            string filePath = Path.Combine(CurrentDirPath, fileName);
            Process.Start(filePath);

            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> EditFileInNotepadPlusPlus(string fileName)
        {
            string filePath = Path.Combine(CurrentDirPath, fileName);
            Process.Start(Settings.Default.NotepadPlusPlusPath, filePath);

            return new Tuple<bool, string>(true, null);
        }

        public void TryExecute(
            string actionName,
            Func<Tuple<bool, string>> action,
            bool showMessageBoxOnError = false,
            bool showMessageBoxOnSuccess = false)
        {
            EventsViewModel.UpdateStatusStripText($"Executing action {actionName}");
            Exception exception = null;

            string resultMessage;
            bool resultIsSuccess;

            try
            {
                var result = action();

                if (result != null)
                {
                    resultIsSuccess = result.Item1;

                    if (resultIsSuccess)
                    {
                        resultMessage = result.Item2 ?? $"Action {actionName} executed successfully";
                    }
                    else
                    {
                        resultMessage = result.Item2 ?? $"An error ocurred while executing action {actionName}";
                    }
                }
                else
                {
                    resultIsSuccess = false;
                    resultMessage = $"Something went wrong while executing action {actionName}";
                }
            }
            catch (Exception exc)
            {
                resultIsSuccess = false;
                resultMessage = $"An Unhandled error ocurred while executing action {actionName}";

                exception = exc;
            }

            var uILogMessageLevel = resultIsSuccess ? UILogMessageLevel.Information : UILogMessageLevel.Error;
            bool showMessageBox;

            if (resultIsSuccess)
            {
                showMessageBox = showMessageBoxOnSuccess;
                EventsViewModel.UpdateStatusStripText($"Action {actionName} executed successfully");
            }
            else
            {
                showMessageBox = showMessageBoxOnError;
                EventsViewModel.UpdateStatusStripText($"Action {actionName} executed with errors");
            }

            EventsViewModel.AddUILogMessage(
                uILogMessageLevel,
                resultMessage,
                exception,
                showMessageBox);
        }

        #region AddUILogMessage

        public void AddUILogMessage(
            IUILogMessage uILogMessage,
            bool showMessageBox = false)
        {
            EventsViewModel.AddUILogMessage(uILogMessage, showMessageBox);
        }

        public void AddUILogMessage(
            UILogMessageMtbl uILogMessage,
            bool showMessageBox = false)
        {
            var logMessage = new UILogMessageImmtbl(uILogMessage);
            AddUILogMessage(logMessage, showMessageBox);
        }

        #endregion AddUILogMessage

        private void NavigateToFolderCore(string folderPath)
        {
            CurrentDirPath = folderPath;
            CurrentDirVPath = GetCurrentDirVPath(CurrentDirPath);

            if (!string.IsNullOrEmpty(folderPath))
            {
                IsRootFolder = false;
                GoToParentDirButtonEnabled = true;

                CurrentDirName = folderPath.GetDirName();
            }
            else
            {
                IsRootFolder = true;
                GoToParentDirButtonEnabled = false;

                CurrentDirName = ROOT_FOLDER_NAME;
            }

            var fsEntries = GetFsEntriesMtbl(folderPath);

            EditableFsDirectoryEntries = fsEntries.Where(item => item.IsDirectory).ToList();
            EditableFsFileEntries = fsEntries.Where(item => !item.IsDirectory).ToList();

            FsDirectoryEntries = EditableFsDirectoryEntries.Select(
                entry => new FsItemImmtbl(entry) as IFsItem).RdnlC();

            FsFileEntries = EditableFsFileEntries.Select(
                entry => new FsItemImmtbl(entry) as IFsItem).RdnlC();

            fsEntriesRefreshed?.Invoke();
            currentFsDirNameChanged?.Invoke();
        }

        private string GetCurrentDirVPath(string currentDirPath)
        {
            return currentDirPath;
        }

        #region GetFsEntries

        private List<FsItemMtbl> GetFsEntriesMtbl(string currentDirPath)
        {
            List<FsItemMtbl> fsEntriesArr;

            if (!string.IsNullOrWhiteSpace(currentDirPath))
            {
                fsEntriesArr = GetFsEntriesMtblCore(currentDirPath);
            }
            else
            {
                fsEntriesArr = GetRootFsDirectoryEntriesMtbl();
            }

            return fsEntriesArr;
        }

        private List<FsItemMtbl> GetFsEntriesMtblCore(
            string currentDirPath)
        {
            var dirInfo = new DirectoryInfo(currentDirPath);

            var fsEntries = dirInfo.EnumerateFileSystemInfos().Select(
                GetFsItemMtbl).ToList().OrderBy(
                entry => entry.Name).ToList();

            return fsEntries;
        }

        private List<FsItemMtbl> GetRootFsDirectoryEntriesMtbl()
        {
            var fsEntriesList = new List<FsItemMtbl>();

            var drives = DriveInfo.GetDrives(
                ).Where(d => d.IsReady).Select(
                d => new FsItemMtbl
                {
                    Uuid = Guid.NewGuid(),
                    Name = d.Name,
                    Path = d.Name,
                    Label = d.VolumeLabel,
                    IsDirectory = true,
                    IsDriveRoot = true
                });

            string userHomePath = GetFolderPath(SpecialFolder.UserProfile);

            var folders = new Dictionary<SpecialFolder, string>
            {
                { SpecialFolder.UserProfile, "User Home" },
                { SpecialFolder.ApplicationData, "Application Data" },
                { SpecialFolder.MyDocuments, "Documents" },
                { SpecialFolder.MyPictures, "Pictures" },
                { SpecialFolder.MyVideos, "Videos" },
                { SpecialFolder.MyMusic, "Music" },
                { SpecialFolder.Desktop, "Desktop" }
            }.Select(
                kvp =>
                {
                    string path = GetFolderPath(kvp.Key);
                    string name = path;

                    if (name.StartsWith(userHomePath))
                    {
                        name = name.Substring(userHomePath.Length).TrimStart('/', '\\');
                        name = $"~{Path.DirectorySeparatorChar}{name}";
                    }

                    DirectoryInfo dirInfo = new DirectoryInfo(path);
                    var item = GetFsItemMtbl(dirInfo);

                    item.Name = name;
                    item.Label = kvp.Value;

                    item.SpecialFolder = kvp.Key;
                    return item;
                });

            fsEntriesList.AddRange(drives);
            fsEntriesList.AddRange(folders);

            return fsEntriesList;
        }

        private FsItemMtbl GetFsItemMtbl(FileSystemInfo fsInfo)
        {
            var fsItemMtbl = new FsItemMtbl
            {
                Uuid = Guid.NewGuid(),
                Name = fsInfo.Name,
                Path = fsInfo.FullName,
                IsDirectory = fsInfo is DirectoryInfo,
                CreationTime = fsInfo.CreationTime,
                CreationTimeStr = TimeStampHelper.TmStmp(fsInfo.CreationTime, true, TimeStamp.Seconds),
                LastAccessTime = fsInfo.LastAccessTime,
                LastAccessTimeStr = TimeStampHelper.TmStmp(fsInfo.LastAccessTime, true, TimeStamp.Seconds),
                LastWriteTime = fsInfo.LastWriteTime,
                LastWriteTimeStr = TimeStampHelper.TmStmp(fsInfo.LastWriteTime, true, TimeStamp.Seconds)
            };

            if (!fsItemMtbl.IsDirectory)
            {
                fsItemMtbl.FileNameWithoutExtension = Path.GetFileNameWithoutExtension(fsItemMtbl.Name);
                fsItemMtbl.FileNameExtension = Path.GetExtension(fsItemMtbl.Name);
                fsItemMtbl.Label = fsItemMtbl.FileNameExtension;
            }

            return fsItemMtbl;
        }

        #endregion GetFsEntries

        public static class ActionNames
        {
            private const string ACTION_NAME_TPL = "[{0}] -> {1}";
            private const string ACTION_NAME_PREFIX = "FS Explorer";

            public static readonly string NavigateToParentFolder = GetActionName("navigate to parent folder");
            public static readonly string NavigateToFolder = GetActionName("navigate to folder");
            public static readonly string ReloadToFolder = GetActionName("reload current folder");
            public static readonly string NavigateToSubFolder = GetActionName("navigate to sub folder");
            public static readonly string NavigateToHistoryBack = GetActionName("navigate to history back");
            public static readonly string NavigateToHistoryForward = GetActionName("navigate to history forward");
            public static readonly string OpenFileInOSDefaultApp = GetActionName("open app in OS default app");
            public static readonly string CopyCurrentDirPathToClipboard = GetActionName("copy current dir path to clipboard");
            public static readonly string CopyEditableDirPathToClipboard = GetActionName("copy editable dir path to clipboard");
            public static readonly string CopyCurrentDirNameToClipboard = GetActionName("copy current dir name to clipboard");
            public static readonly string CopySelectedFsEntryNameToClipboard = GetActionName("copy current entry name to clipboard");
            public static readonly string AddNewTabPage = GetActionName("add new tab page");
            public static readonly string NavigateToRoot = GetActionName("navigate to root");

            private static string GetActionName(string actionNameCore)
            {
                string actionName = string.Format(
                    ACTION_NAME_TPL,
                    ACTION_NAME_PREFIX,
                    actionNameCore);

                return actionName;
            }
        }
    }
}
