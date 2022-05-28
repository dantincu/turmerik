using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;
using Turmerik.Core.Helpers;
using Turmerik.FsUtils.WinForms.App.Properties;
using static System.Environment;

namespace Turmerik.FsUtils.WinForms.App
{
    public class FsExplorerViewModel
    {
        private readonly ITimeStampHelper timeStampHelper;
        private readonly MainFormEventsViewModel eventsViewModel;

        private Action fsEntriesRefreshed;

        public FsExplorerViewModel(
            MainFormEventsViewModel eventsViewModel,
            ITimeStampHelper timeStampHelper)
        {
            this.timeStampHelper = timeStampHelper ?? throw new ArgumentNullException(nameof(timeStampHelper));
            this.eventsViewModel = eventsViewModel ?? throw new ArgumentNullException(nameof(eventsViewModel));

            UILogMessages = new List<IUILogMessage>();
            Uuid = Guid.NewGuid();

            FsDirectoryEntries = new List<IFsItem>();
            FsFileEntries = new List<IFsItem>();
        }

        public Guid Uuid { get; }
        public List<IUILogMessage> UILogMessages { get; }

        public string CurrentDirName { get; private set; }
        public string CurrentDirPath { get; private set; }
        public string CurrentDirVPath { get; private set; }

        public List<IFsItem> FsDirectoryEntries { get; }
        public List<IFsItem> FsFileEntries { get; }

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

        public Tuple<bool, string> Init(string currentDirPath)
        {
            NavigateToFolderCore(currentDirPath);
            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> NavigateToRoot()
        {
            return null;
        }

        public Tuple<bool, string> NavigateToParentFolder()
        {
            return null;
        }

        public Tuple<bool, string> NavigateToFolder(string folderName)
        {
            return null;
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
            Func<Tuple<bool, string>> action)
        {
            eventsViewModel.UpdateStatusStripText($"Executing action {actionName}");
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

            if (resultIsSuccess)
            {
                eventsViewModel.UpdateStatusStripText($"Action {actionName} executed successfully");
            }
            else
            {
                eventsViewModel.UpdateStatusStripText($"Action {actionName} executed with errors");
            }

            AddUILogMessage(
                uILogMessageLevel,
                resultMessage,
                exception);
        }

        #region AddUILogMessage

        public void AddUILogMessage(IUILogMessage uILogMessage)
        {
            eventsViewModel.AddUILogMessage(uILogMessage);
        }

        public void AddUILogMessage(UILogMessageMtbl uILogMessage)
        {
            var logMessage = new UILogMessageImmtbl(uILogMessage);
            AddUILogMessage(logMessage);
        }

        public void AddUILogMessage(
            UILogMessageLevel level,
            string message,
            Exception exc = null,
            DateTime? dateTime = null)
        {
            var timeStamp = dateTime ?? DateTime.Now;

            var uiLogMessage = new UILogMessageMtbl
            {
                Uuid = Guid.NewGuid(),
                Level = level,
                Message = message,
                Exception = exc,
                TimeStamp = timeStamp,
                TimeStampStr = timeStampHelper.TmStmp(
                    timeStamp, true,
                    TimeStamp.Seconds)
            };

            AddUILogMessage(uiLogMessage);
        }

        public void AddUIInfoMsg(
            string message,
            Exception exc = null)
        {
            AddUILogMessage(
                UILogMessageLevel.Information,
                message, exc);
        }

        public void AddUIWarnMsg(
            string message,
            Exception exc = null)
        {
            AddUILogMessage(
                UILogMessageLevel.Warning,
                message, exc);
        }

        public void AddUIErrMsg(
            string message,
            Exception exc = null)
        {
            AddUILogMessage(
                UILogMessageLevel.Error,
                message, exc);
        }

        #endregion AddUILogMessage

        private void NavigateToFolderCore(string folderPath)
        {
            CurrentDirPath = folderPath;

            if (!string.IsNullOrEmpty(folderPath))
            {
                CurrentDirName = folderPath.GetDirName();
            }
            else
            {
                CurrentDirName = "This PC";
            }

            CurrentDirPath = folderPath;
            CurrentDirVPath = GetCurrentDirVPath(CurrentDirPath);

            var fsEntries = GetFsEntries(folderPath);

            FsDirectoryEntries.Clear();
            FsFileEntries.Clear();

            FsDirectoryEntries.AddRange(fsEntries.Where(item => item.IsDirectory));
            FsFileEntries.AddRange(fsEntries.Where(item => !item.IsDirectory));

            fsEntriesRefreshed?.Invoke();
        }

        private string GetCurrentDirVPath(string currentDirPath)
        {
            return currentDirPath;
        }

        #region GetFsEntries

        private IFsItem[] GetFsEntries(string currentDirPath)
        {
            IFsItem[] fsEntriesArr;

            if (!string.IsNullOrWhiteSpace(currentDirPath))
            {
                fsEntriesArr = GetFsEntriesCore(currentDirPath);
            }
            else
            {
                fsEntriesArr = GetRootFsDirectoryEntries();
            }

            return fsEntriesArr;
        }

        private IFsItem[] GetFsEntriesCore(
            string currentDirPath)
        {
            var dirInfo = new DirectoryInfo(currentDirPath);

            var fsEntries = dirInfo.EnumerateFileSystemInfos().Select(
                GetFsItemMtbl).Select(d => new FsItemImmtbl(d) as IFsItem).ToArray();

            return fsEntries;
        }

        private IFsItem[] GetRootFsDirectoryEntries()
        {
            var fsEntriesList = new List<IFsItem>();

            var drives = DriveInfo.GetDrives(
                ).Where(d => d.IsReady).Select(
                d => new FsItemMtbl
                {
                    Name = d.Name,
                    Path = d.Name,
                    Label = d.VolumeLabel,
                    IsDirectory = true,
                    IsDriveRoot = true
                }).Select(d => new FsItemImmtbl(d) as IFsItem);

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
                }).Select(d => new FsItemImmtbl(d) as IFsItem);

            fsEntriesList.AddRange(drives);
            fsEntriesList.AddRange(folders);

            return fsEntriesList.ToArray();
        }

        private FsItemMtbl GetFsItemMtbl(FileSystemInfo fsInfo)
        {
            var fsItemMtbl = new FsItemMtbl
            {
                Name = fsInfo.Name,
                Path = fsInfo.FullName,
                IsDirectory = fsInfo is DirectoryInfo,
                CreationTime = fsInfo.CreationTime,
                LastAccessTime = fsInfo.LastAccessTime,
                LastWriteTime = fsInfo.LastWriteTime
            };

            return fsItemMtbl;
        }

        #endregion GetFsEntries
    }
}
