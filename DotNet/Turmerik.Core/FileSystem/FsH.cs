using Turmerik.Core.Helpers;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Text;

namespace Turmerik.Core.FileSystem
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

        public static async Task<byte[]> ReadAllBytesAsync(
            string filePath,
            int buffSize = 1024)
        {
            using var stream = new FileStream(
                filePath, FileMode.Open,
                FileAccess.Read);

            var bytesList = new List<byte>();
            var buff = new byte[buffSize];

            var readCount = await stream.ReadBytesAsync(
                bytesList, buff, buffSize);

            while (readCount == buffSize)
            {
                readCount = await stream.ReadBytesAsync(
                    bytesList, buff, buffSize);
            }

            return bytesList.ToArray();
        }

        public static async Task<int> ReadBytesAsync(
            this FileStream stream,
            List<byte> bytesList,
            byte[] buff,
            int maxBytesToRead)
        {
            int readCount = await stream.ReadAsync(
                buff, 0, maxBytesToRead);

            if (readCount > 0)
            {
                var arr = new byte[readCount];
                buff.CopyTo(arr, 0);
                bytesList.AddRange(arr);
            }

            return readCount;
        }

        public static string CreateParentDirPath(
            string filePath)
        {
            string dirPath = Path.GetDirectoryName(filePath);
            Directory.CreateDirectory(dirPath);

            return dirPath;
        }

        public static bool DeleteFileIfExists(
            string filePath)
        {
            bool fileExists = File.Exists(filePath);

            if (fileExists)
            {
                File.Delete(filePath);
            }

            return fileExists;
        }
    }
}
