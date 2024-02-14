using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class ProgramH
    {
        public static readonly string ExecutingAssemmblyPath = AppDomain.CurrentDomain.BaseDirectory;

        public static bool FilePathExists(
            string path,
            out string fullPath,
            string[] basePathsArr = null,
            Func<string, bool> existsPredicate = null)
        {
            bool exists;
            fullPath = null;

            existsPredicate = existsPredicate.FirstNotNull(
                File.Exists);

            if (Path.IsPathRooted(fullPath))
            {
                fullPath = path;
                exists = existsPredicate(fullPath);
            }
            else
            {
                basePathsArr ??= [Environment.CurrentDirectory, ExecutingAssemmblyPath];

                if (basePathsArr.Length > 0)
                {
                    exists = false;

                    for (int i = 0; i < basePathsArr.Length; i++)
                    {
                        string basePath = basePathsArr[i];

                        fullPath = Path.Combine(
                            basePath,
                            path);

                        if (existsPredicate(fullPath))
                        {
                            exists = true;
                            break;
                        }
                    }
                }
                else
                {
                    exists = false;
                }
            }

            return exists;
        }

        public static void Run(
            Action program,
            bool rethrow = false)
        {
            try
            {
                program();
            }
            catch (Exception ex)
            {
                ConsoleH.WithExcp(ex);
                Console.ResetColor();

                if (rethrow)
                {
                    throw;
                }
            }
        }
    }
}
