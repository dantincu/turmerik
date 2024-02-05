using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using static Turmerik.Notes.Core.NotesAppConfig;

namespace Turmerik.Notes.Core
{
    public class NotesAppConfigImmtbl : INotesAppConfig
    {
        public NotesAppConfigImmtbl(
            INotesAppConfig src)
        {
            FsExplorerServiceReqRootPath = src.FsExplorerServiceReqRootPath;
            AppEnvLocatorFilePath = src.AppEnvLocatorFilePath;
            IsDevEnv = src.IsDevEnv;
            RequiredClientVersion = src.RequiredClientVersion;
            ClientRedirectUrl = src.ClientRedirectUrl;
            NoteDirPairs = src.GetNoteDirPairs()?.ToImmtbl();
            StorageOption = src.GetStorageOptions()?.ToImmtblRdnlC();
            SingleStorageOption = src.GetSingleStorageOption()?.ToImmtbl();
        }

        public string FsExplorerServiceReqRootPath { get; }
        public string AppEnvLocatorFilePath { get; }
        public bool IsDevEnv { get; }
        public int RequiredClientVersion { get; }
        public string ClientRedirectUrl { get; }
        public NoteDirsPairConfigImmtbl NoteDirPairs { get; }
        public ReadOnlyCollection<TrmrkNotesStorageOptionImmtbl> StorageOption { get; }
        public TrmrkNotesStorageOptionImmtbl SingleStorageOption { get; }

        public INoteDirsPairConfig GetNoteDirPairs() => NoteDirPairs;

        public IEnumerable<ITrmrkNotesStorageOption> GetStorageOptions() => StorageOption;
        public ITrmrkNotesStorageOption GetSingleStorageOption() => SingleStorageOption;

        public class TrmrkNotesStorageOptionImmtbl : ITrmrkNotesStorageOption
        {
            public TrmrkNotesStorageOptionImmtbl(ITrmrkNotesStorageOption src)
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

            public string Name { get; }
            public string NoteBookPath { get; }
            public TrmrkStorageOption? Storage { get; }
            public bool? IsCloudStorage { get; }
            public string TrmrkRestApiHost { get; }
            public bool? IsApi { get; }
            public bool? IsTrmrkRestApi { get; }
            public bool? IsLocalFilesTrmrkRestApi { get; }
            public bool? IsCloudStorageApi { get; }
            public bool? IsCloudStorageTrmrkRestApi { get; }
        }
    }
}
