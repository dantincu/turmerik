using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class FsH
    {
        public const string FILE_URI_SCHEME = "file://";

        public static bool IsWinDrive(this string path)
        {
            bool isWinDrive = path.LastOrDefault() == ':';
            return isWinDrive;
        }

        public static void CopyDirectory(string sourceDir, string destinationDir, bool recursive)
        {
            CopyDirectoryCore(
                sourceDir,
                destinationDir,
                recursive,
                (fileInfo, newPath) => fileInfo.CopyTo(newPath));
        }

        public static void MoveDirectory(string sourceDir, string destinationDir, bool recursive)
        {
            CopyDirectoryCore(
                sourceDir,
                destinationDir,
                recursive,
                (fileInfo, newPath) => fileInfo.MoveTo(newPath));
        }

        /// <summary>
        /// Taken from: https://docs.microsoft.com/en-us/dotnet/standard/io/how-to-copy-directories
        /// </summary>
        /// <param name="sourceDir"></param>
        /// <param name="destinationDir"></param>
        /// <param name="recursive"></param>
        /// <exception cref="DirectoryNotFoundException"></exception>
        private static void CopyDirectoryCore(
            string sourceDir,
            string destinationDir,
            bool recursive,
            Action<FileInfo, string> copyFileFunc)
        {
            // Get information about the source directory
            var dir = new DirectoryInfo(sourceDir);

            // Check if the source directory exists
            if (!dir.Exists)
                throw new DirectoryNotFoundException($"Source directory not found: {dir.FullName}");

            // Cache directories before we start copying
            DirectoryInfo[] dirs = dir.GetDirectories();

            // Create the destination directory
            Directory.CreateDirectory(destinationDir);

            // Get the files in the source directory and copy to the destination directory
            foreach (FileInfo file in dir.GetFiles())
            {
                string targetFilePath = Path.Combine(destinationDir, file.Name);
                copyFileFunc(file, targetFilePath);
            }

            // If recursive and copying subdirectories, recursively call this method
            if (recursive)
            {
                foreach (DirectoryInfo subDir in dirs)
                {
                    string newDestinationDir = Path.Combine(destinationDir, subDir.Name);
                    CopyDirectory(subDir.FullName, newDestinationDir, true);
                }
            }
        }
    }
}
