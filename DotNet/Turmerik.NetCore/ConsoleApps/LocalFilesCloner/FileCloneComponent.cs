using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;

namespace Turmerik.NetCore.ConsoleApps.LocalFilesCloner
{
    public interface IFileCloneComponent
    {
        string Run(
            FileCloneArgs args,
            List<string> prevCheckSums = null);
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

        public string Run(
            FileCloneArgs args,
            List<string> prevCheckSums = null)
        {
            var outputTextArgsList = prevCheckSums?.ToList() ?? new List<string>();

            string checksum = null;

            string inputText = args.InputText ?? File.ReadAllText(
                args.File.InputFilePath);

            outputTextArgsList.Insert(0, inputText);

            string[] outputTextLines = args.File.CloneTplLines.Select(
                line => string.Format(line,
                    outputTextArgsList.ToArray())).ToArray();

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
                    args.File.CloneDirPath);

                string cloneFilePath = Path.Combine(
                    args.File.CloneDirPath,
                    cloneFileName);

                Console.ForegroundColor = ConsoleColor.DarkBlue;
                Console.WriteLine("Attempting to create clone file: ");

                Console.ForegroundColor = ConsoleColor.Blue;
                Console.WriteLine(cloneFilePath);

                Console.WriteLine();
                Console.ResetColor();

                if (args.File.ForceOverwrite != true && File.Exists(
                    cloneFilePath))
                {
                    Console.ForegroundColor = ConsoleColor.Red;

                    Console.WriteLine(string.Join(" ",
                        "Clone file already exists and the force overwrite flag has not been provided;",
                        "exiting without creating the clone file"));

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

            return checksum;
        }

        private string GetCloneFileName(
            FileCloneArgs args,
            string? checksum)
        {
            string extn = Path.GetExtension(
                args.File.InputFilePath).Substring(1);

            string fileNameWoExtn = Path.GetFileNameWithoutExtension(
                args.File.InputFilePath);

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
