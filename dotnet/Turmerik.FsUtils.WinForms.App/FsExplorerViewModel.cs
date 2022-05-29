using Microsoft.Extensions.DependencyInjection;
using System;
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
using Turmerik.FsUtils.WinForms.App.Properties;
using static System.Environment;

namespace Turmerik.FsUtils.WinForms.App
{
    public class FsExplorerViewModel
    {
        public const string ROOT_FOLDER_NAME = "This PC";

        private readonly MainFormEventsViewModel eventsViewModel;
        private readonly IFsPathNormalizer fsPathNormalizer;

        private Action fsEntriesRefreshed;
        private Action currentFsDirNameChanged;

        public FsExplorerViewModel(
            MainFormEventsViewModel eventsViewModel,
            IFsPathNormalizer fsPathNormalizer)
        {
            this.eventsViewModel = eventsViewModel ?? throw new ArgumentNullException(nameof(eventsViewModel));
            this.fsPathNormalizer = fsPathNormalizer ?? throw new ArgumentNullException(nameof(fsPathNormalizer));

            UILogMessages = new List<IUILogMessage>();
            Uuid = Guid.NewGuid();
        }

        public Guid Uuid { get; }
        public List<IUILogMessage> UILogMessages { get; }

        public bool IsRootFolder { get; private set; }
        public string CurrentDirName { get; private set; }
        public string CurrentDirPath { get; private set; }
        public string CurrentDirVPath { get; private set; }

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
            NavigateToFolderCore(currentDirPath);
            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> NavigateToRoot()
        {
            NavigateToFolderCore(null);
            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> NavigateToParentFolder()
        {
            string folderPath = CurrentDirPath.GetDirPath();
            NavigateToFolderCore(folderPath);

            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> NavigateToSubFolder(string folderName)
        {
            string folderPath = Path.Combine(CurrentDirPath, folderName);
            NavigateToFolderCore(folderPath);

            return new Tuple<bool, string>(true, null);
        }

        public Tuple<bool, string> NavigateToFolder(string folderPath, bool normalizePath = false)
        {
            string errorMessage = null;

            if (normalizePath && !string.IsNullOrEmpty(folderPath))
            {
                var result = fsPathNormalizer.TryNormalizePath(folderPath);

                if (result.IsValid)
                {
                    if (result.IsAbsUri == true)
                    {
                        errorMessage = "Path must not be an URI";
                    }
                    else if (result.IsRooted)
                    {
                        folderPath = result.NormalizedPath;
                    }
                    else
                    {
                        errorMessage = "Path must be rooted";
                    }
                }
                else
                {
                    errorMessage = "Path is invalid";
                }
            }

            var retVal = new Tuple<bool, string>(
                errorMessage == null,
                errorMessage);

            if (retVal.Item1)
            {
                NavigateToFolderCore(folderPath);
            }

            return retVal;
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
            bool showMessageBox;

            if (resultIsSuccess)
            {
                showMessageBox = showMessageBoxOnSuccess;
                eventsViewModel.UpdateStatusStripText($"Action {actionName} executed successfully");
            }
            else
            {
                showMessageBox = showMessageBoxOnError;
                eventsViewModel.UpdateStatusStripText($"Action {actionName} executed with errors");
            }

            eventsViewModel.AddUILogMessage(
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
            eventsViewModel.AddUILogMessage(uILogMessage, showMessageBox);
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

            if (!string.IsNullOrEmpty(folderPath))
            {
                CurrentDirName = folderPath.GetDirName();
            }
            else
            {
                CurrentDirName = ROOT_FOLDER_NAME;
                IsRootFolder = true;
            }

            CurrentDirPath = folderPath;
            CurrentDirVPath = GetCurrentDirVPath(CurrentDirPath);

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
                GetFsItemMtbl).ToList();

            return fsEntries;
        }

        private List<FsItemMtbl> GetRootFsDirectoryEntriesMtbl()
        {
            var fsEntriesList = new List<FsItemMtbl>();

            var drives = DriveInfo.GetDrives(
                ).Where(d => d.IsReady).Select(
                d => new FsItemMtbl
                {
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
                Name = fsInfo.Name,
                Path = fsInfo.FullName,
                IsDirectory = fsInfo is DirectoryInfo,
                CreationTime = fsInfo.CreationTime,
                LastAccessTime = fsInfo.LastAccessTime,
                LastWriteTime = fsInfo.LastWriteTime
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
    }
}
