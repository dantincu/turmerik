using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.Utility;

namespace Turmerik.MkFsDirsPair.ConsoleApp
{
    public class DirsPairInfoGenerator : DirsPairInfoGeneratorBase, IDirsPairInfoGenerator
    {
        public DirsPairInfoGenerator(
            INoteDirsPairFullNamePartRetriever noteDirsPairFullNamePartRetriever) : base(
                noteDirsPairFullNamePartRetriever)
        {
        }

        public DirsPairInfo Generate(
            string[] args)
        {
            string workDir = Environment.CurrentDirectory;

            string[] existingEntriesArr = Directory.GetFileSystemEntries(
                workDir).Select(entry => Path.GetFileName(entry)).ToArray();

            string docFileName = GetArgs(
                args,
                out string shortDirName,
                out string fullDirName,
                out string docTitle);

            var dirsPairInfo = GetDirsPairInfo(
                workDir,
                existingEntriesArr,
                docTitle,
                shortDirName,
                docFileName,
                fullDirName);

            return dirsPairInfo;
        }

        private DirsPairInfo GetDirsPairInfo(
            string workDir,
            string[] existingEntriesArr,
            string docTitle,
            string shortDirName,
            string docFileName,
            string fullDirName)
        {
            string? docFilePath = docFileName?.With(
                fileName => Path.Combine(
                    workDir,
                    shortDirName,
                    fileName));

            string docFileContents = GetFileContents(
                docFileName, docTitle);

            var docFile = docFileContents?.With(
                contents => new DriveItemOpts(
                    docFileName,
                    docFileContents).File().Arr()) ?? new DataTreeNode<DriveItemOpts>[0];

            var dirsPairInfo = new DirsPairInfo(
                workDir,
                existingEntriesArr,
                new List<DataTreeNode<DriveItemOpts>>
                {
                    new DriveItemOpts(shortDirName).Folder(docFile),
                    new DriveItemOpts(fullDirName).Folder(
                        new DriveItemOpts(".keep", "").File())
                },
                docFilePath);

            return dirsPairInfo;
        }

        private string GetArgs(
            string[] args,
            out string shortDirName,
            out string fullDirName,
            out string docTitle)
        {
            string docFileName = GetArgs(
                args,
                out shortDirName,
                out string fullDirNamePart,
                out string fullDirNameJoinStr,
                out docTitle);

            fullDirName = string.Join(
                fullDirNameJoinStr,
                shortDirName,
                fullDirNamePart);

            return docFileName;
        }

        private string GetArgs(
            string[] args,
            out string shortDirName,
            out string fullDirNamePart,
            out string fullDirNameJoinStr,
            out string docTitle)
        {
            if (args.Length > 3)
            {
                throw new ArgumentException(
                    $"Expected 3 arguments but received {args.Length}");
            }

            int idx = 0;
            string docFileName = null;
            string title = null;

            shortDirName = GetArg(
                args,
                idx++,
                "Type the short dir name");

            fullDirNameJoinStr = GetArg(
                args,
                idx++,
                "Type the full dir name join str");

            fullDirNamePart = GetArg(
                args,
                idx++,
                "Type the full dir name part",
                (rawArg, i, titleStr, arg) =>
                {
                    int rawArgLen = rawArg.Length;
                    int argLen = arg.Length;
                    int titleStrLen = titleStr.Length;

                    title = titleStr;
                    var lastChar = rawArg.Last();

                    if (lastChar == ENTRY_NAME_SPECIAL_CHAR)
                    {
                        docFileName = $"{arg}.md";

                        title = titleStr.Substring(
                            0, titleStrLen - 1);
                    }
                    else if (rawArgLen >= 2 && rawArg[rawArgLen - 2] == ENTRY_NAME_SPECIAL_CHAR)
                    {
                        arg = arg.Substring(
                            0, argLen - 1);

                        title = titleStr.Substring(
                            0, titleStrLen - 2);

                        switch (lastChar)
                        {
                            case 'd':
                                docFileName = $"{arg}.docx";
                                break;
                            default:
                                throw new ArgumentException(
                                $"Full dir name part cannot end in {rawArg.Substring(
                                    rawArgLen - 2)}");
                        }
                    }

                    return arg;
                });

            docTitle = title;
            return docFileName;
        }

        private string GetArg(
            string[] argsArr,
            int idx,
            string message,
            Func<string, int, string, string, string> callback = null)
        {
            string rawArg;
            string docTitle = null;

            if (idx < argsArr.Length)
            {
                rawArg = argsArr[idx];
            }
            else
            {
                rawArg = GetArg(message);
            }

            string arg = rawArg.Trim();

            if (arg == "?")
            {
                arg = string.Empty;
            }
            else
            {
                arg = NormalizeFileName(
                    arg, out docTitle, ':');
            }

            if (callback != null)
            {
                arg = callback(rawArg,
                    idx, docTitle, arg);
            }
            
            return arg;
        }

        private string GetArg(
            string message)
        {
            Console.WriteLine(message);
            Console.Write("> ");

            string arg = Console.ReadLine();
            Console.WriteLine();

            return arg;
        }
    }
}
