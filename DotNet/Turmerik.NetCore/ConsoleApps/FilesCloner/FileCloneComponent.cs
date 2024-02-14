﻿using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.NetCore.ConsoleApps.FilesCloner
{
    public interface IFileCloneComponent
    {
        void Run(FileCloneArgs args);
    }

    public class FileCloneComponent : IFileCloneComponent
    {
        private readonly IChecksumCalculator checksumCalculator;

        public FileCloneComponent(
            IChecksumCalculator checksumCalculator)
        {
            this.checksumCalculator = checksumCalculator ?? throw new ArgumentNullException(
                nameof(checksumCalculator));
        }

        public void Run(
            FileCloneArgs args)
        {
            string checksum = null;

            string inputText = args.InputText ?? File.ReadAllText(
                args.File.InputFileLocator.EntryPath);

            string[] outputTextLines = args.File.CloneTplLines.Select(
                line => string.Format(
                    line, inputText)).ToArray();

            string outputText = string.Join(
                Environment.NewLine,
                outputTextLines);

            if (args.File.UseChecksum == true)
            {
                var bytesArr = Encoding.UTF8.GetBytes(
                    outputText);

                checksum = checksumCalculator.Checksum(bytesArr);

                Console.ForegroundColor = ConsoleColor.DarkCyan;
                Console.WriteLine("Computed the following checksum: ");

                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine(checksum);

                Console.WriteLine();
                Console.ResetColor();
            }

            if (args.CloneInputFile)
            {
                string cloneFileName = GetCloneFileName(
                    args, checksum);

                Directory.CreateDirectory(
                    args.File.CloneDirLocator.EntryPath);

                string cloneFilePath = Path.Combine(
                    args.File.CloneDirLocator.EntryPath,
                    cloneFileName);

                Console.ForegroundColor = ConsoleColor.DarkBlue;
                Console.WriteLine("Attempting to create clone file: ");

                Console.ForegroundColor = ConsoleColor.Blue;
                Console.WriteLine(cloneFilePath);

                Console.WriteLine();
                Console.ResetColor();

                if (File.Exists(cloneFilePath))
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("Clone file already exists; exiting without creating the clone file");

                    Console.WriteLine();
                    Console.ResetColor();
                }
                else
                {
                    File.WriteAllLines(cloneFilePath, outputTextLines);

                    Console.ForegroundColor = ConsoleColor.DarkGreen;
                    Console.WriteLine("Created the clone file successfully");

                    Console.WriteLine();
                    Console.ResetColor();
                }
            }
        }

        private string GetCloneFileName(
            FileCloneArgs args,
            string? checksum)
        {
            string extn = Path.GetExtension(
                args.File.InputFileLocator.EntryPath).Substring(1);

            string fileNameWoExtn = Path.GetFileNameWithoutExtension(
                args.File.InputFileLocator.EntryPath);

            string cloneFileNameTpl = args.File.CloneFileNameTpl;

            if (cloneFileNameTpl == null)
            {
                if (checksum != null)
                {
                    cloneFileNameTpl = "{0}.{1}.{2}";
                }
                else
                {
                    cloneFileNameTpl = "{0}.{2}";
                }
            }

            string cloneFileName = string.Format(
                cloneFileNameTpl,
                fileNameWoExtn,
                checksum,
                extn);

            return cloneFileName;
        }
    }
}
