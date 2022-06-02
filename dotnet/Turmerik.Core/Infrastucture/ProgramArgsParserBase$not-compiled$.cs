using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Components;
using Turmerik.Core.Reflection.Wrappers;

namespace Turmerik.Core.Infrastucture
{
    public abstract class ProgramArgsParserBase<TProgramArgs>
        where TProgramArgs : ProgramArgsBase
    {
        protected ProgramArgsParserBase(
            ITypesStaticDataCache typesStaticDataCache)
        {
            this.TypesStaticDataCache = typesStaticDataCache ?? throw new ArgumentNullException(nameof(typesStaticDataCache));
            this.ArgsTypeWrapper = typesStaticDataCache.Get(typeof(TProgramArgs));
        }

        protected ITypesStaticDataCache TypesStaticDataCache { get; }
        protected TypeWrapper ArgsTypeWrapper { get; }

        public TProgramArgs Parse(string[] args)
        {
            var argsList = args.ToList();

            var propParsersList = new List<Tuple<string, Action<TProgramArgs, string>>>();
            var parsedArgs = Activator.CreateInstance<TProgramArgs>();

            AddPropParsers(parsedArgs, propParsersList);
            int propParsersCount = propParsersList.Count;

            for (int i = 0; i < propParsersCount; i++)
            {
                var propParser = propParsersList[i];
                string strArg = GetStrArg(args, i, propParser.Item1);

                propParser.Item2(parsedArgs, strArg);
            }

            return parsedArgs;
        }

        protected virtual void AddPropParsers(
            TProgramArgs args,
            List<Tuple<string, Action<TProgramArgs, string>>> propParsersList)
        {

        }

        protected void AddPropParser(
            List<Tuple<string, Action<TProgramArgs, string>>> propParsersList,
            string propName, Action<TProgramArgs, string> factory)
        {
            var tuple = new Tuple<string, Action<TProgramArgs, string>>(
                propName, factory);

            propParsersList.Add(tuple);
        }

        protected void AddStrPropParser(
            List<Tuple<string, Action<TProgramArgs, string>>> propParsersList,
            string propName, string defaultPropValue, bool allWhitespaceIsNotEmpty = true)
        {
            AddPropParser(propParsersList, propName, (args, value) =>
            {
                bool isEmpty;

                if (allWhitespaceIsNotEmpty)
                {
                    isEmpty = string.IsNullOrEmpty(value);
                }
                else
                {
                    isEmpty = string.IsNullOrWhiteSpace(value);
                }

                if (isEmpty)
                {
                    value = defaultPropValue;
                }

                ArgsTypeWrapper.AllProps.Value.Single(
                    prop => prop.Name == propName).Data.SetValue(args, value);
            });
        }

        protected void AddStrPropParser(
            List<Tuple<string, Action<TProgramArgs, string>>> propParsersList,
            string propName)
        {
            AddPropParser(propParsersList, propName, (args, value) =>
            {
                ArgsTypeWrapper.AllProps.Value.Single(
                    prop => prop.Name == propName).Data.SetValue(args, value);
            });
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

    public class ProgramArgsItemOpts
    {
        string FullPropName { get; set; }
        public string PropNameAlias { get; set; }
    }

    public class ProgramArgItemAttribute : Attribute
    {
        public ProgramArgItemAttribute(
            string propNameAlias,
            string switchName)
        {
            PropNameAlias = propNameAlias;
            SwitchName = switchName;
        }

        public string PropNameAlias { get; }
        public string SwitchName { get; }
    }

    public abstract class ProgramArgsBase
    {
        public bool IsInteractive { get; set; }
    }
}
