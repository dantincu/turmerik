using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.TextParsing;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileManager
{
    public interface IFsManagerGuardFactory
    {
        IFsManagerGuard Create(
            bool allowSysFolders = false,
            bool allowNonSysDrives = false,
            string rootDirPath = null);
    }

    public class FsManagerGuardFactory : IFsManagerGuardFactory
    {
        public IFsManagerGuard Create(
            bool allowSysFolders = false,
            bool allowNonSysDrives = false,
            string rootDirPath = null) => new FsManagerGuard
            {
                AllowSysFolders = allowSysFolders,
                AllowNonSysDrives = allowNonSysDrives,
                RootDirPath = rootDirPath
            };
    }
}
