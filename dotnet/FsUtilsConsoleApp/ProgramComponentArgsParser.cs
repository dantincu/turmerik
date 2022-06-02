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
            var d = new ProgramComponentArgs();
            var list = new List<Tuple<string, Action<ProgramComponentArgs, string>>>();

            AddPropParser(list, nameof(d.ParentDirPath), (args, str) =>
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

            AddPropParser(list, nameof(d.DirName), (args, str) => args.DirName = str);

            propParsers = new ReadOnlyCollection<Tuple<string, Action<ProgramComponentArgs, string>>>(list.ToArray());
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
