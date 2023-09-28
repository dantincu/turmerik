using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.MkFsDirsPair.Lib;

namespace Turmerik.MkFsDirsPair.ConsoleApp
{
    public class DirsPairInfoGenerator : DirsPairInfoGeneratorBase, IDirsPairInfoGenerator
    {
        public DirsPairInfo Generate(
            string[] args)
        {
            string workDir = Environment.CurrentDirectory;

            string[] existingEntriesArr = Directory.EnumerateFileSystemEntries(
                workDir).Select(
                entry => Path.GetFileName(entry)).ToArray();

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
                true,
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
            bool normalizeDocTitle = false,
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
                    arg, out docTitle,
                    normalizeDocTitle);
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
