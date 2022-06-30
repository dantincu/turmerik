using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FsUtilsConsoleApp
{
    internal class ProgramComponentArgsParser
    {
        private static readonly ReadOnlyCollection<Tuple<string, Action<ProgramComponentArgs, string>>> propParsers;

        static ProgramComponentArgsParser()
        {
            var propsList = new List<Tuple<string, Action<ProgramComponentArgs, string>>>();
            var optsList = new List<Tuple<string, Action<ProgramComponentArgs, string>>>();

            AddPropParser(propsList, nameof(ProgramComponentArgs.ParentDirPath), (args, str) =>
            {
                if (string.IsNullOrWhiteSpace(str))
                {
                    args.ParentDirPath = Environment.CurrentDirectory;
                }
                else
                {
                    args.ParentDirPath = str;
                }
            });

            AddPropParser(propsList, nameof(ProgramComponentArgs.DirName), (args, str) => args.DirName = str);

            propParsers = new ReadOnlyCollection<Tuple<string, Action<ProgramComponentArgs, string>>>(propsList.ToArray());
        }

        public ProgramComponentArgs Parse(string[] args)
        {
            var parsedArgs = new ProgramComponentArgs();
            int propParsersCount = propParsers.Count;

            for (int i = 0; i < propParsersCount; i++)
            {
                var propParser = propParsers[i];
                string strArg = GetStrArg(args, i, propParser.Item1);

                propParser.Item2(parsedArgs, strArg);
            }

            return parsedArgs;
        }

        private static void AddPropParser(
            List<Tuple<string, Action<ProgramComponentArgs, string>>> propParsersList,
            string propName, Action<ProgramComponentArgs, string> factory)
        {
            var tuple = new Tuple<string, Action<ProgramComponentArgs, string>>(
                propName, factory);

            propParsersList.Add(tuple);
        }

        private string GetStrArg(
            string[] args,
            int idx,
            string propName)
        {
            string strArg;

            if (idx < args.Length)
            {
                strArg = args[idx];
                Console.WriteLine($"Property {propName} has been provided with the following value: {strArg}");
            }
            else
            {
                Console.WriteLine($"Please provide a value for property {propName}");
                strArg = Console.ReadLine();
            }

            Console.WriteLine();
            return strArg;
        }
    }
}
