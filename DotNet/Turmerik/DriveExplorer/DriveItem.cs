﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.DriveExplorer
{
    public enum OfficeFileType
    {
        Word = 1,
        Excel,
        PowerPoint
    }

    public enum FileType
    {
        PlainText = 1,
        Document,
        Image,
        Audio,
        Video,
        Code,
        Binary,
        ZippedFolder
    }

    public class DriveItem<TDriveItem>
        where TDriveItem : DriveItem<TDriveItem>
    {
        public DriveItem()
        {
        }

        public DriveItem(
            DriveItem<TDriveItem> src,
            int depth = 0)
        {
            Idnf = src.Idnf;
            Name = src.Name;
            DisplayName = src.DisplayName;
            IsFolder = src.IsFolder;
            FnWoExtn = src.FnWoExtn;
            FnExtn = src.FnExtn;
            IsRootFolder = src.IsRootFolder;
            PrIdnf = src.PrIdnf;
            FileType = src.FileType;
            OfficeFileType = src.OfficeFileType;
            IsTextFile = src.IsTextFile;
            IsImageFile = src.IsImageFile;
            IsVideoFile = src.IsVideoFile;
            IsAudioFile = src.IsAudioFile;

            if (depth > 0)
            {
                int childrenDepth = depth - 1;

                SubFolders = src.SubFolders?.Select(
                    item => item.CreateFromSrc<TDriveItem>(null, childrenDepth)).ToList();

                FolderFiles = src.FolderFiles?.Select(
                    item => item.CreateFromSrc<TDriveItem>(null, 0)).ToList();
            }
            else if (depth < 0)
            {
                SubFolders = src.SubFolders;
                FolderFiles = src.FolderFiles;
            }
        }

        public string Idnf { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public bool? IsFolder { get; set; }
        public string FnWoExtn { get; set; }
        public string FnExtn { get; set; }
        public bool? IsRootFolder { get; set; }

        public string PrIdnf { get; set; }

        public FileType? FileType { get; set; }
        public OfficeFileType? OfficeFileType { get; set; }
        public bool? IsTextFile { get; set; }
        public bool? IsImageFile { get; set; }
        public bool? IsVideoFile { get; set; }
        public bool? IsAudioFile { get; set; }

        public List<TDriveItem>? SubFolders { get; set; }
        public List<TDriveItem>? FolderFiles { get; set; }
    }

    public class DriveItem : DriveItem<DriveItem>
    {
    }

    public class DriveItem<TDriveItem, TData> : DriveItem<TDriveItem>
        where TDriveItem : DriveItem<TDriveItem, TData>
    {
        public DriveItem()
        {
        }

        public DriveItem(DriveItem<TDriveItem, TData> src, int depth = 0) : base(src, depth)
        {
            Data = src.Data;
        }

        public DriveItem(DriveItem<TDriveItem> src, int depth = 0) : base(src, depth)
        {
        }

        public TData Data { get; set; }
    }
}
