using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using static Turmerik.Notes.Core.NotesAppConfig;

namespace Turmerik.Notes.Core
{
    public class NotesAppConfigMtbl : INotesAppConfig
    {
        public NotesAppConfigMtbl()
        {
        }

        public NotesAppConfigMtbl(
            INotesAppConfig src)
        {
            FsExplorerServiceReqRootPath = src.FsExplorerServiceReqRootPath;
            AppEnvLocatorFilePath = src.AppEnvLocatorFilePath;
            IsDevEnv = src.IsDevEnv;
            RequiredClientVersion = src.RequiredClientVersion;
            ClientRedirectUrl = src.ClientRedirectUrl;
            NoteDirPairs = src.GetNoteDirPairs()?.ToMtbl();
            StorageOption = src.GetStorageOptions()?.ToMtblList();
            SingleStorageOption = src.GetSingleStorageOption()?.ToMtbl();
        }

        public string FsExplorerServiceReqRootPath { get; set; }
        public string AppEnvLocatorFilePath { get; set; }
        public bool IsDevEnv { get; set; }
        public int RequiredClientVersion { get; set; }
        public string ClientRedirectUrl { get; set; }
        public NoteDirsPairConfigMtbl NoteDirPairs { get; set; }
        public List<TrmrkNotesStorageOptionMtbl> StorageOption { get; }
        public TrmrkNotesStorageOptionMtbl SingleStorageOption { get; }

        public INoteDirsPairConfig GetNoteDirPairs() => NoteDirPairs;

        public IEnumerable<ITrmrkNotesStorageOption> GetStorageOptions() => StorageOption;
        public ITrmrkNotesStorageOption GetSingleStorageOption() => SingleStorageOption;

        public class TrmrkNotesStorageOptionMtbl : ITrmrkNotesStorageOption
        {
            public TrmrkNotesStorageOptionMtbl()
            {
            }

            public TrmrkNotesStorageOptionMtbl(ITrmrkNotesStorageOption src)
            {
                Name = src.Name;
                NoteBookPath = src.NoteBookPath;
                Storage = src.Storage;
                IsCloudStorage = src.IsCloudStorage;
                TrmrkRestApiHost = src.TrmrkRestApiHost;
                IsApi = src.IsApi;
                IsTrmrkRestApi = src.IsTrmrkRestApi;
                IsLocalFilesTrmrkRestApi = src.IsLocalFilesTrmrkRestApi;
                IsCloudStorageApi = src.IsCloudStorageApi;
                IsCloudStorageTrmrkRestApi = src.IsCloudStorageTrmrkRestApi;
            }

            public string Name { get; set; }
            public string NoteBookPath { get; set; }
            public TrmrkStorageOption? Storage { get; set; }
            public bool? IsCloudStorage { get; set; }
            public string TrmrkRestApiHost { get; set; }
            public bool? IsApi { get; set; }
            public bool? IsTrmrkRestApi { get; set; }
            public bool? IsLocalFilesTrmrkRestApi { get; set; }
            public bool? IsCloudStorageApi { get; set; }
            public bool? IsCloudStorageTrmrkRestApi { get; set; }
        }
    }
}
