using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.FileSystem
{
    public static class FsEntryLocatorH
    {
        public static FsEntryLocator Normalize(
            this FsEntryLocator fsEntryLocator,
            string entryBasePath = null,
            bool checkIfLocatorIsNotNull = false,
            Func<string> defaultEmptyRelPathFactory = null)
        {
            if (!checkIfLocatorIsNotNull || fsEntryLocator != null)
            {
                fsEntryLocator.EntryPath ??= Path.Combine(
                    fsEntryLocator.EntryBasePath ?? entryBasePath ?? string.Empty,
                    fsEntryLocator.EntryRelPath ?? defaultEmptyRelPathFactory.FirstNotNull(
                        () => throw new ArgumentNullException(nameof(
                            fsEntryLocator.EntryRelPath))).Invoke());
            }

            return fsEntryLocator;
        }

        public static FsEntryLocator FromPath(string path)
        {
            var locator = new FsEntryLocator();

            if (Path.IsPathRooted(path))
            {
                locator.EntryPath = path;
            }
            else
            {
                locator.EntryRelPath = path;
            }

            return locator;
        }
    }
}
