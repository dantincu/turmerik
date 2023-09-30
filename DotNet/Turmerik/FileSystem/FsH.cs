using Turmerik.Helpers;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Text;

namespace Turmerik.FileSystem
{
    public static class FsH
    {
        public static bool EntryExists(
            string entryPath) => EntryExists(
                entryPath, out _);

        public static bool EntryExists(
            string entryPath,
            out bool existingIsFolder) => (
                existingIsFolder = Directory.Exists(
                    entryPath)) || File.Exists(entryPath);

        public static void CopyDirectory(string sourceDir, string destinationDir)
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
                file.CopyTo(targetFilePath);
            }

            // If recursive and copying subdirectories, recursively call this method
            foreach (DirectoryInfo subDir in dirs)
            {
                string newDestinationDir = Path.Combine(destinationDir, subDir.Name);

                CopyDirectory(
                    subDir.FullName,
                    newDestinationDir);
            }
        }

        public static void MoveDirectory(
            string sourceDir,
            string destinationDir)
        {
            Directory.Move(sourceDir, destinationDir);
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
            bool isMoveDir)
        {
            Action<FileInfo, string> copyFileFunc;

            if (isMoveDir)
            {
                copyFileFunc = (fileInfo, newPath) => fileInfo.MoveTo(newPath);
            }
            else
            {
                copyFileFunc = (fileInfo, newPath) => fileInfo.CopyTo(newPath);
            }

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

                    CopyDirectoryCore(
                        subDir.FullName,
                        newDestinationDir,
                        true,
                        isMoveDir);

                    if (isMoveDir)
                    {
                        subDir.Delete();
                    }
                }
            }
        }
    }
}
